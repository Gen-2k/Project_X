#!/usr/bin/env node
/**
 * Create GitHub Releases for packages whose version was bumped by changesets.
 *
 * This runs in the `publish` phase of the changesets action — i.e. only AFTER
 * the `chore(release): version packages` PR has been merged to main. At that
 * point there are no pending changesets, and each bumped package has:
 *   - a bumped version in its package.json
 *   - an updated CHANGELOG.md with a new `## x.y.z` section
 *
 * For every package with a version section that has no git tag yet, we:
 *   1. create and push a git tag        `@scope/name@x.y.z`
 *   2. create a GitHub Release using the changelog section as notes
 *
 * The script is idempotent — re-runs skip packages that are already tagged.
 */
import { execSync } from 'node:child_process';
import { existsSync, readdirSync, readFileSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import path from 'node:path';

const root = process.cwd();
const run = (cmd) => execSync(cmd, { encoding: 'utf8', stdio: ['pipe', 'pipe', 'pipe'] }).trim();

const existingTags = new Set(run('git tag -l').split('\n').filter(Boolean));

let released = 0;

for (const area of ['apps', 'packages']) {
  const dir = path.join(root, area);
  if (!existsSync(dir)) continue;

  for (const name of readdirSync(dir)) {
    const pkgDir = path.join(dir, name);
    const pkgFile = path.join(pkgDir, 'package.json');
    if (!existsSync(pkgFile)) continue;

    const pkg = JSON.parse(readFileSync(pkgFile, 'utf8'));
    const changelogFile = path.join(pkgDir, 'CHANGELOG.md');
    if (!existsSync(changelogFile)) continue;

    const changelog = readFileSync(changelogFile, 'utf8');
    // Extract the latest `## x.y.z` section. NOTE: `### Sub-headings` are part
    // of the section — only a new `## ` level starts a new version section.
    const lines = changelog.split('\n');
    const startIdx = lines.findIndex((l) => /^## \d+\.\d+\.\d+/.test(l));
    if (startIdx === -1) continue;

    const version = lines[startIdx].replace(/^##\s*/, '').trim();
    const tag = `${pkg.name}@${version}`;
    if (existingTags.has(tag)) {
      console.log(`skipping ${tag}: already tagged`);
      continue;
    }

    let endIdx = lines.findIndex((l, i) => i > startIdx && /^## /.test(l));
    if (endIdx === -1) endIdx = lines.length;
    const notes = lines.slice(startIdx, endIdx).join('\n').trim();
    const notesFile = path.join(tmpdir(), `${tag.replace(/[/@]/g, '_')}-notes.md`);
    writeFileSync(notesFile, notes);

    try {
      run(`git tag "${tag}"`);
      run(`git push origin "${tag}"`);
      execSync(`gh release create "${tag}" --title "${tag}" --notes-file "${notesFile}"`, { stdio: 'inherit' });
      console.log(`released ${tag}`);
      released++;
    } finally {
      rmSync(notesFile, { force: true });
    }
  }
}

console.log(`release.mjs done: ${released} release(s) created`);
if (released === 0) process.exit(0);
