#!/usr/bin/env node
import { spawn } from 'node:child_process';
import { cp, readdir, readFile, rm, stat, writeFile } from 'node:fs/promises';
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

// TypeScript with `moduleResolution: Bundler` emits extensionless imports.
// Node ESM (and Next.js server bundling) needs explicit `.js` extensions, so
// we walk the emitted output and append them to relative specifiers.
const RELATIVE_IMPORT_RE =
  /(\bfrom\s*|\bimport\s*|\bexport\s*\*\s*from\s*|\bexport\s*\{[^}]*\}\s*from\s*|\bimport\s*\(\s*)(['"])(\.\.?\/[^'"]*)(['"])/g;
const KNOWN_EXTENSIONS = new Set([
  '.js',
  '.mjs',
  '.cjs',
  '.json',
  '.css',
  '.svg',
  '.png',
  '.jpg',
  '.jpeg',
  '.gif',
  '.webp',
]);

const hasKnownExtension = (specifier) => {
  const last = specifier.slice(specifier.lastIndexOf('/') + 1);
  const dot = last.lastIndexOf('.');
  if (dot <= 0) return false;
  return KNOWN_EXTENSIONS.has(last.slice(dot).toLowerCase());
};

const resolveSpecifier = async (fileDir, specifier) => {
  if (hasKnownExtension(specifier)) return specifier;
  const absBase = resolve(fileDir, specifier);
  if (await exists(absBase + '.js')) return specifier + '.js';
  if (await exists(join(absBase, 'index.js'))) {
    const sep = specifier.endsWith('/') ? '' : '/';
    return specifier + sep + 'index.js';
  }
  return null;
};

const walk = async function* (dir) {
  const entries = await readdir(dir, { withFileTypes: true });
  for (const entry of entries) {
    const full = join(dir, entry.name);
    if (entry.isDirectory()) {
      yield* walk(full);
    } else if (entry.isFile()) {
      yield full;
    }
  }
};

const rewriteFileImports = async (file) => {
  const original = await readFile(file, 'utf8');
  const fileDir = dirname(file);
  const replacements = [];
  let match;
  RELATIVE_IMPORT_RE.lastIndex = 0;
  while ((match = RELATIVE_IMPORT_RE.exec(original)) !== null) {
    const [whole, prefix, openQuote, specifier, closeQuote] = match;
    const resolved = await resolveSpecifier(fileDir, specifier);
    if (!resolved || resolved === specifier) continue;
    replacements.push({
      start: match.index,
      end: match.index + whole.length,
      replacement: `${prefix}${openQuote}${resolved}${closeQuote}`,
    });
  }
  if (replacements.length === 0) return false;
  let out = '';
  let cursor = 0;
  for (const { start, end, replacement } of replacements) {
    out += original.slice(cursor, start) + replacement;
    cursor = end;
  }
  out += original.slice(cursor);
  await writeFile(file, out);
  return true;
};

const addExtensionsToImports = async () => {
  log('rewriting relative imports with .js extensions');
  let changed = 0;
  for await (const file of walk(pkgDir)) {
    if (!/\.(js|d\.ts)$/.test(file)) continue;
    if (await rewriteFileImports(file)) changed += 1;
  }
  log(`rewrote imports in ${changed} file(s)`);
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

  const changelogFrom = join(repoRoot, 'CHANGELOG.md');
  const changelogTo = join(pkgDir, 'CHANGELOG.md');
  if (await exists(changelogFrom)) {
    log('copying CHANGELOG.md');
    await cp(changelogFrom, changelogTo);
  }
};

const main = async () => {
  if (!(await exists(tscBin))) {
    throw new Error(`tsc not found at ${tscBin}. Run \`npm install\` first.`);
  }
  await cleanArtifacts();
  await compile();
  await addExtensionsToImports();
  await copyAssets();
  log(`done -> ${pkgDir}`);
};

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
