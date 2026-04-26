#!/usr/bin/env node
import { spawn } from 'node:child_process';
import { cp, readdir, rm, stat } from 'node:fs/promises';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const repoRoot = resolve(__dirname, '..');
const srcDir = join(repoRoot, 'src');
const pkgDir = join(repoRoot, 'packages', 'react');
const tsconfig = join(__dirname, 'tsconfig.build.json');
const tscBin = join(repoRoot, 'node_modules', '.bin', 'tsc');

const log = (msg) => console.log(`[build] ${msg}`);

const exists = async (path) => {
  try {
    await stat(path);
    return true;
  } catch {
    return false;
  }
};

const run = (cmd, args, opts = {}) =>
  new Promise((resolvePromise, rejectPromise) => {
    const child = spawn(cmd, args, { stdio: 'inherit', ...opts });
    child.on('error', rejectPromise);
    child.on('exit', (code) => {
      if (code === 0) resolvePromise();
      else rejectPromise(new Error(`${cmd} exited with code ${code}`));
    });
  });

const cleanArtifacts = async () => {
  log('cleaning previous build artifacts');

  // Remove the legacy dist/ folder if it still exists from the old layout.
  await rm(join(pkgDir, 'dist'), { recursive: true, force: true });

  // Derive what to delete from the contents of src/ — anything else in
  // packages/react (package.json, README.md, LICENSE) is preserved.
  const entries = await readdir(srcDir, { withFileTypes: true });
  for (const entry of entries) {
    if (entry.name === 'package.json') continue;

    if (entry.isDirectory()) {
      await rm(join(pkgDir, entry.name), { recursive: true, force: true });
      continue;
    }

    if (/\.(ts|tsx)$/.test(entry.name)) {
      const base = entry.name.replace(/\.tsx?$/, '');
      for (const ext of ['.js', '.js.map', '.d.ts', '.d.ts.map']) {
        await rm(join(pkgDir, base + ext), { force: true });
      }
      continue;
    }

    // Plain assets co-located in src/ (e.g. ui.css) — drop the prior copy.
    await rm(join(pkgDir, entry.name), { force: true });
  }
};

const compile = async () => {
  log('compiling typescript -> esm + d.ts');
  await run(tscBin, ['-p', tsconfig]);
};

const copyAssets = async () => {
  log('copying css assets');
  await cp(join(srcDir, 'ui.css'), join(pkgDir, 'ui.css'));
  await cp(join(srcDir, 'styles'), join(pkgDir, 'styles'), { recursive: true });

  const licenseFrom = join(repoRoot, 'LICENSE');
  const licenseTo = join(pkgDir, 'LICENSE');
  if (await exists(licenseFrom)) {
    log('copying LICENSE');
    await cp(licenseFrom, licenseTo);
  }
};

const main = async () => {
  if (!(await exists(tscBin))) {
    throw new Error(`tsc not found at ${tscBin}. Run \`npm install\` first.`);
  }
  await cleanArtifacts();
  await compile();
  await copyAssets();
  log(`done -> ${pkgDir}`);
};

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
