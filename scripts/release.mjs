#!/usr/bin/env node
import { spawn } from 'node:child_process';
import { readFile, writeFile } from 'node:fs/promises';
import { dirname, join, resolve } from 'node:path';
import { stdin as input, stdout as output } from 'node:process';
import { createInterface } from 'node:readline/promises';
import { fileURLToPath } from 'node:url';

import { generateChangelog } from './changelog.mjs';

const __dirname = dirname(fileURLToPath(import.meta.url));
const repoRoot = resolve(__dirname, '..');
const pkgDir = join(repoRoot, 'packages', 'react');
const pkgJsonPath = join(pkgDir, 'package.json');
const srcPkgJsonPath = join(repoRoot, 'src', 'package.json');
const changelogPath = join(repoRoot, 'CHANGELOG.md');
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
      else
        rejectPromise(
          new Error(`${cmd} ${args.join(' ')} exited with code ${code}`),
        );
    });
  });

const captureStdout = (cmd, args) =>
  new Promise((resolvePromise) => {
    const child = spawn(cmd, args, { stdio: ['ignore', 'pipe', 'ignore'] });
    let stdout = '';
    child.stdout.on('data', (chunk) => {
      stdout += chunk.toString();
    });
    child.on('error', () => resolvePromise({ ok: false, stdout: '' }));
    child.on('exit', (code) =>
      resolvePromise({ ok: code === 0, stdout: stdout.trim() }),
    );
  });

const checkNpmAuth = async () => {
  const { ok, stdout } = await captureStdout('npm', ['whoami']);
  return ok ? stdout || null : null;
};

const checkGhAvailable = async () => {
  const { ok } = await captureStdout('gh', ['--version']);
  return ok;
};

const checkGhAuth = async () => {
  // gh auth status writes to stderr; non-zero exit means not authed.
  const { ok } = await captureStdout('gh', ['auth', 'status']);
  return ok;
};

const checkGitClean = async () => {
  const { ok, stdout } = await captureStdout('git', ['status', '--porcelain']);
  if (!ok) throw new Error('git status failed');
  return stdout === '';
};

const getCurrentBranch = async () => {
  const { ok, stdout } = await captureStdout('git', [
    'rev-parse',
    '--abbrev-ref',
    'HEAD',
  ]);
  if (!ok) throw new Error('git rev-parse failed');
  return stdout;
};

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
      const answer = (
        await rl.question('\nSelect [1-4] or enter version directly: ')
      ).trim();
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
    const answer = (await rl.question(`${message} [y/N]: `))
      .trim()
      .toLowerCase();
    return answer === 'y' || answer === 'yes';
  } finally {
    rl.close();
  }
};

const pause = async (message) => {
  const rl = createInterface({ input, output });
  try {
    await rl.question(message);
  } finally {
    rl.close();
  }
};

const writeChangelog = async (version) => {
  const result = generateChangelog({ version });
  console.log(
    `\n[release] ${result.commitCount} commit(s) since ${result.fromRef ?? 'beginning'}`,
  );
  console.log('\n--- changelog preview ---');
  process.stdout.write(result.content);
  console.log('--- end preview ---\n');

  let existing = '';
  try {
    existing = await readFile(changelogPath, 'utf8');
  } catch {
    // file doesn't exist yet
  }

  const header = '# Changelog\n\n';
  const body = existing.startsWith('# Changelog')
    ? existing.slice(existing.indexOf('\n')).replace(/^\n+/, '')
    : existing;

  const next = `${header}${result.content}${body ? `\n${body}` : ''}`;
  await writeFile(changelogPath, next);
  console.log(`[release] wrote ${changelogPath}`);

  return result;
};

// Strip the leading "## version (date)" header from the changelog block —
// gh release shows the tag/title above the body, so the header is redundant.
const releaseNotes = (changelogContent) =>
  changelogContent.replace(/^## .+?\n+/, '').trimEnd();

const main = async () => {
  const pkg = await readJson(pkgJsonPath);
  const currentVersion = pkg.version;
  if (!isValidSemver(currentVersion)) {
    throw new Error(
      `Current version "${currentVersion}" in ${pkgJsonPath} is not valid semver`,
    );
  }

  const npmUser = await checkNpmAuth();
  if (!npmUser) {
    throw new Error(
      'Not logged in to npm. Run `npm login` first, then re-run this script.\n' +
        '       (npm whoami returned no user — auth token missing or invalid.)',
    );
  }
  console.log(`[release] npm user: ${npmUser}`);

  if (!(await checkGhAvailable())) {
    throw new Error(
      'GitHub CLI (`gh`) not found on PATH. Install from https://cli.github.com/ and re-run.',
    );
  }
  if (!(await checkGhAuth())) {
    throw new Error(
      'Not logged in to GitHub. Run `gh auth login`, then re-run this script.',
    );
  }

  if (!(await checkGitClean())) {
    throw new Error(
      'Working tree has uncommitted changes. Commit or stash them first — release ' +
        'needs a clean tree so it can stage only the version bump and changelog.',
    );
  }

  const branch = await getCurrentBranch();
  console.log(`[release] git branch: ${branch}`);

  const newVersion = await promptVersion(currentVersion);

  if (newVersion === currentVersion) {
    console.log(`\nNothing to do — version is already ${currentVersion}`);
    return;
  }

  const ok = await confirm(
    `\nAbout to release @cladd-ui/react ${currentVersion} -> ${newVersion}:\n` +
      `  • bump package.json files\n` +
      `  • prepend CHANGELOG.md\n` +
      `  • build & npm publish\n` +
      `  • git commit + tag v${newVersion}\n` +
      `  • git push --follow-tags (branch: ${branch})\n` +
      `  • gh release create v${newVersion}\n\nContinue?`,
  );
  if (!ok) {
    console.log('Aborted.');
    return;
  }

  console.log(
    `\n[release] writing version ${newVersion} to package.json files`,
  );
  pkg.version = newVersion;
  await writeJson(pkgJsonPath, pkg);

  let srcPkgUpdated = false;
  try {
    const srcPkg = await readJson(srcPkgJsonPath);
    srcPkg.version = newVersion;
    await writeJson(srcPkgJsonPath, srcPkg);
    srcPkgUpdated = true;
  } catch {
    // src/package.json is optional — skip silently if missing
  }

  const changelog = await writeChangelog(newVersion);
  await pause(
    '[release] CHANGELOG.md updated. Press Enter to continue with build & publish, or Ctrl+C to abort and edit it first... ',
  );

  console.log('\n[release] building');
  await run(process.execPath, [buildScript]);

  console.log('\n[release] publishing to npm');
  await run('npm', ['publish', '--access', 'public'], { cwd: pkgDir });

  console.log(`\n[release] committing release ${newVersion}`);
  const filesToCommit = [pkgJsonPath, changelogPath];
  if (srcPkgUpdated) filesToCommit.push(srcPkgJsonPath);
  await run('git', ['add', ...filesToCommit]);
  await run('git', ['commit', '-m', newVersion]);

  console.log(`[release] tagging v${newVersion}`);
  await run('git', [
    'tag',
    '-a',
    `v${newVersion}`,
    '-m',
    `Release v${newVersion}`,
  ]);

  console.log('[release] pushing commit + tag');
  await run('git', ['push', '--follow-tags']);

  console.log('[release] creating GitHub release');
  const notes = releaseNotes(changelog.content) || '_No changes recorded._';
  await run('gh', [
    'release',
    'create',
    `v${newVersion}`,
    '--title',
    `v${newVersion}`,
    '--notes',
    notes,
  ]);

  console.log(`\n[release] done — @cladd-ui/react@${newVersion} released`);
};

main().catch((err) => {
  console.error(`\n[release] failed: ${err.message}`);
  process.exit(1);
});
