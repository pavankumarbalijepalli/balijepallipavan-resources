#!/usr/bin/env node
/* Validates data/*.json — run locally with: node scripts/validate-data.mjs
   Exits 1 on any error. Emits GitHub Actions annotations when run in CI. */
import { readFileSync, existsSync, readdirSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..');
const DATA = join(ROOT, 'data');
const ACCENTS = ['first', 'core', 'optional'];
const inCI = process.env.GITHUB_ACTIONS === 'true';

let errors = 0;
function fail(file, msg) {
  errors++;
  console.error(inCI ? `::error file=data/${file},title=Invalid data::${msg}` : `✗ data/${file}: ${msg}`);
}
function warn(file, msg) {
  console.warn(inCI ? `::warning file=data/${file}::${msg}` : `! data/${file}: ${msg}`);
}

function readJSON(file) {
  try {
    return JSON.parse(readFileSync(join(DATA, file), 'utf8'));
  } catch (e) {
    fail(file, e.code === 'ENOENT' ? 'file not found' : `not valid JSON (${e.message})`);
    return null;
  }
}

const isStr = (v) => typeof v === 'string' && v.trim() !== '';

const index = readJSON('index.json');
const files = index && Array.isArray(index.sections) ? index.sections : null;
if (index && !files) fail('index.json', '"sections" must be a list of file names');

const seenIds = new Set();
let total = 0;

for (const file of files ?? []) {
  const sec = readJSON(file);
  if (!sec) continue;

  for (const key of ['id', 'title']) {
    if (!isStr(sec[key])) fail(file, `section needs a "${key}"`);
  }
  if (isStr(sec.id)) {
    if (seenIds.has(sec.id)) fail(file, `duplicate section id "${sec.id}"`);
    seenIds.add(sec.id);
  }
  if (!Array.isArray(sec.items)) {
    fail(file, '"items" must be a list');
    continue;
  }

  sec.items.forEach((item, i) => {
    const where = `item ${i + 1}${isStr(item?.title) ? ` ("${item.title}")` : ''}`;
    if (!item || typeof item !== 'object') return fail(file, `${where} must be an object`);
    total++;

    if (!isStr(item.title)) fail(file, `${where}: missing "title"`);
    if (!isStr(item.url)) {
      fail(file, `${where}: missing "url"`);
    } else if (!/^(https?:|mailto:)/i.test(item.url) && !existsSync(join(ROOT, item.url))) {
      fail(file, `${where}: "${item.url}" does not exist in the repo`);
    }
    if (item.desc !== undefined && typeof item.desc !== 'string') fail(file, `${where}: "desc" must be text`);
    if (item.type !== undefined && !isStr(item.type)) fail(file, `${where}: "type" must be text`);
    if (item.badge !== undefined && !isStr(item.badge)) fail(file, `${where}: "badge" must be text`);
    if (item.accent !== undefined && !ACCENTS.includes(item.accent)) {
      fail(file, `${where}: "accent" must be one of ${ACCENTS.join(', ')} (got "${item.accent}")`);
    }
    if (item.keywords !== undefined && !(Array.isArray(item.keywords) && item.keywords.every(isStr))) {
      fail(file, `${where}: "keywords" must be a list of words`);
    }
    if (item.desc === undefined) warn(file, `${where}: no "desc"`);
  });
}

// A section file that exists but isn't listed would silently never show up.
for (const f of readdirSync(DATA)) {
  if (f.endsWith('.json') && f !== 'index.json' && !(files ?? []).includes(f)) {
    warn(f, 'not listed in data/index.json, so it will not appear on the page');
  }
}

if (errors) {
  console.error(`\n${errors} problem${errors > 1 ? 's' : ''} found.`);
  process.exit(1);
}
console.log(`✓ data OK: ${files.length} sections, ${total} resources`);
