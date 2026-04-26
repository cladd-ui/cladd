#!/usr/bin/env node
import { spawn } from 'node:child_process';
import { readFile, writeFile } from 'node:fs/promises';
import { dirname, join, resolve } from 'node:path';
import { createInterface } from 'node:readline/promises';
import { stdin as input, stdout as output } from 'node:process';
import { fileURLToPath } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const repoRoot = resolve(__dirname, '..');
const pkgDir = join(repoRoot, 'packages', 'react');
const pkgJsonPath = join(pkgDir, 'package.json');
const srcPkgJsonPath = join(repoRoot, 'src', 'package.json');
const buildScript = join(__dirname, 'build.mjs');

const SEMVER = /^(\d+)\.(\d+)\.(\d+)(?:-([0-9A-Za-z.-]+))?$/;

const bump = (version, kind) => {
  const m = SEMVER.exec(version);
  if (!m) throw new Error(`Cannot parse version "${version}"`);
  let [, major, minor, patch] = m;
  major = Number(major);
  minor = Number(minor);
  patch = Number(patch);
  if (kind === 'patch') return `${major}.${minor}.${patch + 1}`;
  if (kind === 'minor') return `${major}.${minor + 1}.0`;
  if (kind === 'major') return `${major + 1}.0.0`;
  throw new Error(`Unknown bump kind: ${kind}`);
};

const isValidSemver = (v) => SEMVER.test(v);

const readJson = async (path) => JSON.parse(await readFile(path, 'utf8'));

const writeJson = async (path, data) => {
  await writeFile(path, `${JSON.stringify(data, null, 2)}\n`);
};

const run = (cmd, args, opts = {}) =>
  new Promise((resolvePromise, rejectPromise) => {
    const child = spawn(cmd, args, { stdio: 'inherit', ...opts });
    child.on('error', rejectPromise);
    child.on('exit', (code) => {
      if (code === 0) resolvePromise();
      else rejectPromise(new Error(`${cmd} ${args.join(' ')} exited with code ${code}`));
    });
  });

const checkNpmAuth = () =>
  new Promise((resolvePromise) => {
    const child = spawn('npm', ['whoami'], { stdio: ['ignore', 'pipe', 'ignore'] });
    let stdout = '';
    child.stdout.on('data', (chunk) => {
      stdout += chunk.toString();
    });
    child.on('error', () => resolvePromise(null));
    child.on('exit', (code) => {
      if (code === 0) resolvePromise(stdout.trim() || null);
      else resolvePromise(null);
    });
  });

const promptVersion = async (current) => {
  const choices = {
    1: { kind: 'patch', value: bump(current, 'patch') },
    2: { kind: 'minor', value: bump(current, 'minor') },
    3: { kind: 'major', value: bump(current, 'major') },
  };

  console.log(`\nCurrent version: ${current}\n`);
  console.log(`  1) patch  -> ${choices[1].value}`);
  console.log(`  2) minor  -> ${choices[2].value}`);
  console.log(`  3) major  -> ${choices[3].value}`);
  console.log(`  4) custom`);

  const rl = createInterface({ input, output });
  try {
    while (true) {
      const answer = (await rl.question('\nSelect [1-4] or enter version directly: ')).trim();
      if (!answer) continue;

      if (choices[answer]) return choices[answer].value;

      if (answer === '4') {
        const custom = (await rl.question('Enter version (x.y.z): ')).trim();
        if (isValidSemver(custom)) return custom;
        console.log(`  ! "${custom}" is not a valid semver`);
        continue;
      }

      if (isValidSemver(answer)) return answer;

      console.log(`  ! "${answer}" is not a valid choice or semver`);
    }
  } finally {
    rl.close();
  }
};

const confirm = async (message) => {
  const rl = createInterface({ input, output });
  try {
    const answer = (await rl.question(`${message} [y/N]: `)).trim().toLowerCase();
    return answer === 'y' || answer === 'yes';
  } finally {
    rl.close();
  }
};

const main = async () => {
  const pkg = await readJson(pkgJsonPath);
  const currentVersion = pkg.version;
  if (!isValidSemver(currentVersion)) {
    throw new Error(`Current version "${currentVersion}" in ${pkgJsonPath} is not valid semver`);
  }

  const npmUser = await checkNpmAuth();
  if (!npmUser) {
    throw new Error(
      'Not logged in to npm. Run `npm login` first, then re-run this script.\n' +
        '       (npm whoami returned no user — auth token missing or invalid.)'
    );
  }
  console.log(`[release] npm user: ${npmUser}`);

  const newVersion = await promptVersion(currentVersion);

  if (newVersion === currentVersion) {
    console.log(`\nNothing to do — version is already ${currentVersion}`);
    return;
  }

  const ok = await confirm(
    `\nAbout to bump @cladd-ui/react ${currentVersion} -> ${newVersion}, build, and npm publish. Continue?`
  );
  if (!ok) {
    console.log('Aborted.');
    return;
  }

  console.log(`\n[release] writing version ${newVersion} to package.json files`);
  pkg.version = newVersion;
  await writeJson(pkgJsonPath, pkg);

  try {
    const srcPkg = await readJson(srcPkgJsonPath);
    srcPkg.version = newVersion;
    await writeJson(srcPkgJsonPath, srcPkg);
  } catch {
    // src/package.json is optional — skip silently if missing
  }

  console.log('\n[release] building');
  await run(process.execPath, [buildScript]);

  console.log('\n[release] publishing to npm');
  await run('npm', ['publish', '--access', 'public'], { cwd: pkgDir });

  console.log(`\n[release] done — @cladd-ui/react@${newVersion} published`);
};

main().catch((err) => {
  console.error(`\n[release] failed: ${err.message}`);
  process.exit(1);
});
