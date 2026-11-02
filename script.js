/* ============================================================
   bunnybethinking Resource Hub — script.js
   Loads every section from data/*.json and renders it.
   Edit a JSON file, push, and the page updates. Nothing else to touch.
   ============================================================ */

const DATA_DIR = 'data/';

const sectionsEl = document.getElementById('sections');
const finderEl   = document.getElementById('finder');
const chipsEl    = document.getElementById('chips');
const searchEl   = document.getElementById('search');
const statusEl   = document.getElementById('status');
const emptyEl    = document.getElementById('empty');

let SECTIONS = [];            // loaded section objects, in index.json order
const loadErrors = [];        // file names that failed to load / parse
let activeSection = 'all';
let query = '';

/* ── Tiny DOM helper ──────────────────────────────────────── */
function el(tag, className, text) {
  const node = document.createElement(tag);
  if (className) node.className = className;
  if (text !== undefined) node.textContent = text;
  return node;
}

const pad = (n) => String(n).padStart(2, '0');

/* ── Load data ────────────────────────────────────────────── */
async function loadJSON(file) {
  const res = await fetch(DATA_DIR + file, { cache: 'no-cache' });
  if (!res.ok) throw new Error(`${file}: HTTP ${res.status}`);
  return res.json();
}

function cleanSection(raw, file) {
  const items = (Array.isArray(raw.items) ? raw.items : []).filter(
    (r) => r && r.title && r.url
  );
  return {
    id: raw.id || file.replace(/\.json$/, ''),
    tag: raw.tag || raw.title || file,
    title: raw.title || raw.tag || file,
    blurb: raw.blurb || '',
    items,
  };
}

async function loadAll() {
  const index = await loadJSON('index.json');
  const files = Array.isArray(index.sections) ? index.sections : [];
  const results = await Promise.allSettled(files.map(loadJSON));

  results.forEach((r, i) => {
    if (r.status === 'fulfilled') {
      SECTIONS.push(cleanSection(r.value, files[i]));
    } else {
      loadErrors.push(files[i]);
      console.error(`Could not load ${files[i]}:`, r.reason);
    }
  });
}

/* ── Build one resource card ──────────────────────────────── */
function buildCard(res, index) {
  const card = el('a', `card accent-${res.accent || 'first'}`);
  card.href = res.url;
  card.target = '_blank';
  card.rel = 'noopener noreferrer';

  const body = el('div', 'card-body');
  const titleRow = el('div', 'card-title-row');
  titleRow.append(el('h3', 'card-title', res.title));
  if (res.badge) titleRow.append(el('span', 'badge', res.badge));
  body.append(titleRow, el('p', 'card-desc', res.desc || ''));

  const meta = el('div', 'card-meta');
  if (res.type) meta.append(el('span', 'card-type caption', res.type));
  meta.append(el('span', 'card-arrow', '↗'));

  card.append(el('span', 'card-num', pad(index + 1)), body, meta);
  return card;
}

/* ── Search: every word must appear somewhere in the card ─── */
function matches(res, section, words) {
  if (!words.length) return true;
  const haystack = [
    res.title, res.desc, res.type, res.badge,
    ...(Array.isArray(res.keywords) ? res.keywords : []),
    section.title, section.tag,
  ].join(' ').toLowerCase();
  return words.every((w) => haystack.includes(w));
}

/* ── Render (re-run on every filter / search change) ──────── */
function render() {
  sectionsEl.replaceChildren();
  const words = query.trim().toLowerCase().split(/\s+/).filter(Boolean);
  let shown = 0;

  SECTIONS.forEach((section, sectionIndex) => {
    if (activeSection !== 'all' && activeSection !== section.id) return;

    const items = section.items.filter((r) => matches(r, section, words));
    if (!items.length) return;

    const wrap = el('section', 'section');
    wrap.id = `section-${section.id}`;
    wrap.setAttribute('aria-labelledby', `${wrap.id}-title`);

    const tag = el('span', 'tag caption', `${pad(sectionIndex + 1)} · ${section.tag}`);
    const title = el('h2', 'section-title', section.title);
    title.id = `${wrap.id}-title`;
    const list = el('div', 'cards');
    items.forEach((res, i) => list.append(buildCard(res, i)));

    wrap.append(tag, title);
    if (section.blurb) wrap.append(el('p', 'section-blurb', section.blurb));
    wrap.append(list);
    sectionsEl.append(wrap);
    shown += items.length;
  });

  const total = SECTIONS.reduce((n, s) => n + s.items.length, 0);
  emptyEl.hidden = shown > 0 || !SECTIONS.length;
  statusEl.textContent = words.length || activeSection !== 'all'
    ? `${shown} of ${total} resources`
    : `${total} resources`;
}

/* ── Filter chips + search ────────────────────────────────── */
function buildFinder() {
  [{ id: 'all', tag: 'All' }, ...SECTIONS].forEach((chip) => {
    const btn = el('button', 'chip', chip.tag);
    btn.type = 'button';
    btn.dataset.id = chip.id;
    btn.setAttribute('aria-pressed', String(chip.id === activeSection));
    btn.addEventListener('click', () => {
      activeSection = chip.id;
      chipsEl.querySelectorAll('.chip').forEach((c) =>
        c.setAttribute('aria-pressed', String(c.dataset.id === activeSection)));
      render();
    });
    chipsEl.append(btn);
  });

  searchEl.addEventListener('input', () => {
    query = searchEl.value;
    render();
  });
  finderEl.hidden = false;
}

/* ── Init ─────────────────────────────────────────────────── */
(async function init() {
  try {
    await loadAll();
  } catch (err) {
    console.error('Could not load data/index.json:', err);
    loadErrors.push('index.json');
  }

  if (loadErrors.length) {
    const note = el('p', 'notice',
      `Couldn't load ${loadErrors.join(', ')}. If you just edited a JSON file, check it for a missing comma or quote.`);
    sectionsEl.before(note);
  }

  if (SECTIONS.length) {
    buildFinder();
    render();
  }
})();
