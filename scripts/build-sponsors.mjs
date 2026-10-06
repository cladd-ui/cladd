#!/usr/bin/env node
import { readFile, writeFile } from 'node:fs/promises';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const repoRoot = resolve(__dirname, '..');
const readmePath = join(repoRoot, 'README.md');
const backersPath = join(repoRoot, 'BACKERS.md');

const API_URL = 'https://sponsors.nolimits4web.com/api/sponsors/cladd';

const TABLE_MARKER = '<!-- SPONSORS_TABLE_WRAP -->';
const GOLD_MARKER = '<!-- GOLD_SPONSOR -->';
const SPONSOR_MARKER = '<!-- SPONSOR -->';

const TIERS = [
  { plan: 'Gold Sponsor', perRow: 6, width: 160 },
  { plan: 'Sponsor', perRow: 8, width: 100 },
];

const log = (msg) => console.log(`[build-sponsors] ${msg}`);

const escapeHtml = (s) =>
  s
    .replace(/&/g, '&amp;')
    .replace(/"/g, '&quot;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');

const escapeMdText = (s) => s.replace(/([[\]\\])/g, '\\$1');

const fetchSponsors = async () => {
  const res = await fetch(API_URL, { signal: AbortSignal.timeout(10_000) });
  if (!res.ok) throw new Error(`${API_URL} responded with ${res.status}`);
  const data = await res.json();
  if (!Array.isArray(data)) throw new Error('unexpected response shape');
  return data.map((item) => ({
    title: item.title ?? '',
    link: item.link ?? '',
    image: item.image ?? '',
    plan: item.plan === 'Gold Sponsor' ? 'Gold Sponsor' : 'Sponsor',
    createdAt: item.createdAt ?? '',
  }));
};

const chunk = (items, size) => {
  const rows = [];
  for (let i = 0; i < items.length; i += size) {
    rows.push(items.slice(i, i + size));
  }
  return rows;
};

const cell = (item, width) => {
  const title = escapeHtml(item.title);
  const content = item.image
    ? `<img src="${escapeHtml(item.image)}" alt="${title}" width="${width}">`
    : title;
  if (!item.link) {
    return `    <td align="center" valign="middle">${content}</td>`;
  }
  return [
    `    <td align="center" valign="middle">`,
    `      <a href="${escapeHtml(item.link)}" target="_blank">`,
    `        ${content}`,
    `      </a>`,
    `    </td>`,
  ].join('\n');
};

const buildTable = (items, { perRow, width }) => {
  if (!items.length) return '';
  const rows = chunk(items, perRow).map((row) =>
    [`  <tr>`, ...row.map((item) => cell(item, width)), `  </tr>`].join('\n'),
  );
  return `<table>\n${rows.join('\n')}\n</table>`;
};

// Leading blank line keeps the output stable under oxfmt, which separates a
// list from a preceding HTML comment.
const buildList = (items) => {
  if (!items.length) return '';
  const lines = items.map((item) =>
    item.link
      ? `- [${escapeMdText(item.title)}](${item.link})`
      : `- ${escapeMdText(item.title)}`,
  );
  return `\n${lines.join('\n')}`;
};

// Replaces whatever sits between a pair of identical markers, keeping the
// markers themselves so the next run can find them again.
const replaceBetween = (content, marker, inner, file) => {
  const parts = content.split(marker);
  if (parts.length !== 3) {
    throw new Error(`${file} must contain exactly two "${marker}" markers`);
  }
  parts[1] = inner ? `\n${inner}\n` : '\n';
  return parts.join(marker);
};

const main = async () => {
  const sponsors = await fetchSponsors();
  log(`fetched ${sponsors.length} sponsor(s)`);

  const byPlan = Object.fromEntries(
    TIERS.map(({ plan }) => [
      plan,
      sponsors
        .filter((s) => s.plan === plan)
        .sort((a, b) => (a.createdAt > b.createdAt ? -1 : 1)),
    ]),
  );

  const tables = TIERS.map((tier) => buildTable(byPlan[tier.plan], tier))
    .filter(Boolean)
    .join('\n\n');

  let readme = await readFile(readmePath, 'utf8');
  readme = replaceBetween(readme, TABLE_MARKER, tables, 'README.md');
  await writeFile(readmePath, readme);
  log('updated README.md');

  let backers = await readFile(backersPath, 'utf8');
  backers = replaceBetween(backers, TABLE_MARKER, tables, 'BACKERS.md');
  backers = replaceBetween(
    backers,
    GOLD_MARKER,
    buildList(byPlan['Gold Sponsor']),
    'BACKERS.md',
  );
  backers = replaceBetween(
    backers,
    SPONSOR_MARKER,
    buildList(byPlan.Sponsor),
    'BACKERS.md',
  );
  await writeFile(backersPath, backers);
  log('updated BACKERS.md');
};

main().catch((err) => {
  console.error(`[build-sponsors] ${err.message}`);
  process.exit(1);
});
