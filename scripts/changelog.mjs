#!/usr/bin/env node
import { spawnSync } from "node:child_process";

const TYPE_LABELS = {
  feat: "Features",
  fix: "Bug Fixes",
  perf: "Performance",
  refactor: "Refactoring",
  docs: "Documentation",
  style: "Styles",
  test: "Tests",
  build: "Build System",
  ci: "CI",
  chore: "Chores",
  revert: "Reverts",
};

// Aliases: project uses `ref:` for refactor commits.
const TYPE_ALIASES = {
  ref: "refactor",
  styles: "style",
};

const TYPE_ORDER = [
  "feat",
  "fix",
  "perf",
  "refactor",
  "docs",
  "style",
  "test",
  "build",
  "ci",
  "chore",
  "revert",
];

const git = (args) => {
  const r = spawnSync("git", args, { encoding: "utf8" });
  if (r.status !== 0) {
    throw new Error(`git ${args.join(" ")} failed: ${r.stderr.trim()}`);
  }
  return r.stdout;
};

const findLastVersionTag = () => {
  const r = spawnSync(
    "git",
    ["describe", "--tags", "--abbrev=0", "--match", "v[0-9]*"],
    { encoding: "utf8" },
  );
  if (r.status !== 0) return null;
  const tag = r.stdout.trim();
  return tag || null;
};

const listCommits = (from, to) => {
  const range = from ? `${from}..${to}` : to;
  const out = git([
    "log",
    "--no-merges",
    "--pretty=format:%h%x09%s",
    range,
  ]).trim();
  if (!out) return [];
  return out.split("\n").map((line) => {
    const tab = line.indexOf("\t");
    return { hash: line.slice(0, tab), subject: line.slice(tab + 1) };
  });
};

const parseCommit = (subject) => {
  const m = /^(\w+)(?:\(([^)]+)\))?(!)?:\s*(.+)$/.exec(subject);
  if (!m)
    return { type: "other", scope: null, breaking: false, message: subject };

  let type = m[1].toLowerCase();
  type = TYPE_ALIASES[type] ?? type;
  const known = Object.hasOwn(TYPE_LABELS, type);

  return {
    type: known ? type : "other",
    scope: m[2] || null,
    breaking: m[3] === "!",
    message: m[4],
  };
};

const groupCommits = (commits) => {
  const groups = {};
  for (const c of commits) {
    const parsed = parseCommit(c.subject);
    (groups[parsed.type] ??= []).push({ ...c, ...parsed });
  }
  return groups;
};

export const generateChangelog = ({
  version,
  from,
  to = "HEAD",
  date,
} = {}) => {
  if (!version) throw new Error("version is required");

  const fromRef = from === undefined ? findLastVersionTag() : from || null;
  const commits = listCommits(fromRef, to);
  const groups = groupCommits(commits);
  const today = date || new Date().toISOString().slice(0, 10);

  const lines = [`## ${version} (${today})`, ""];

  if (commits.length === 0) {
    lines.push("- _No changes since previous release_", "");
  } else {
    const sectionOrder = [...TYPE_ORDER, "other"];
    for (const type of sectionOrder) {
      const items = groups[type];
      if (!items?.length) continue;
      const label = type === "other" ? "Other" : TYPE_LABELS[type];
      lines.push(`### ${label}`, "");
      for (const item of items) {
        const breaking = item.breaking ? "**BREAKING** " : "";
        const scope = item.scope ? `**${item.scope}:** ` : "";
        lines.push(`- ${breaking}${scope}${item.message} (${item.hash})`);
      }
      lines.push("");
    }
  }

  return {
    content: lines.join("\n").replace(/\n+$/, "\n"),
    commitCount: commits.length,
    fromRef,
    toRef: to,
  };
};

const isCli = import.meta.url === `file://${process.argv[1]}`;

if (isCli) {
  const args = process.argv.slice(2);
  const opts = {};
  for (let i = 0; i < args.length; i++) {
    const a = args[i];
    if (a === "--version") opts.version = args[++i];
    else if (a === "--from") opts.from = args[++i];
    else if (a === "--to") opts.to = args[++i];
    else if (a === "--help" || a === "-h") {
      console.log(
        "Usage: node scripts/changelog.mjs --version <x.y.z> [--from <git-ref>] [--to <git-ref>]",
      );
      console.log(
        "       --from defaults to the most recent v* tag, or beginning of history if none",
      );
      process.exit(0);
    } else {
      console.error(`Unknown argument: ${a}`);
      process.exit(2);
    }
  }
  if (!opts.version) {
    console.error("Missing --version. Use --help for usage.");
    process.exit(2);
  }
  const result = generateChangelog(opts);
  process.stdout.write(result.content);
  process.stderr.write(
    `\n[changelog] ${result.commitCount} commits since ${result.fromRef ?? "beginning"}\n`,
  );
}
