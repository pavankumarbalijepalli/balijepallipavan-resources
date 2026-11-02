/* ============================================================
   @bunnybethinking Resource Hub — script.js
   Renders the page from SECTIONS + RESOURCES (see resources.js)
   ============================================================ */

const sectionsEl = document.getElementById('sections');
const finderEl   = document.getElementById('finder');
const chipsEl    = document.getElementById('chips');
const searchEl   = document.getElementById('search');
const emptyEl    = document.getElementById('empty');

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
  body.append(titleRow, el('p', 'card-desc', res.desc));

  const meta = el('div', 'card-meta');
  if (res.type) meta.append(el('span', 'card-type caption', res.type));
  meta.append(el('span', 'card-arrow', '↗'));

  card.append(el('span', 'card-num', pad(index + 1)), body, meta);
  return card;
}

/* ── Render (re-run on every filter / search change) ──────── */
function render() {
  sectionsEl.replaceChildren();
  const q = query.trim().toLowerCase();
  let shown = 0;

  SECTIONS.forEach((section, sectionIndex) => {
    if (activeSection !== 'all' && activeSection !== section.id) return;

    const items = RESOURCES.filter((r) => {
      if (r.section !== section.id) return false;
      if (!q) return true;
      return [r.title, r.desc, r.type].join(' ').toLowerCase().includes(q);
    });
    if (!items.length) return;

    const wrap = el('section', 'section');
    wrap.id = `section-${section.id}`;
    wrap.setAttribute('aria-labelledby', `${wrap.id}-title`);

    const tag = el('span', 'tag caption', `${pad(sectionIndex + 1)} · ${section.tag}`);
    const title = el('h2', 'section-title', section.title);
    title.id = `${wrap.id}-title`;
    const list = el('div', 'cards');
    items.forEach((res, i) => list.append(buildCard(res, i)));

    wrap.append(tag, title, el('p', 'section-blurb', section.blurb), list);
    sectionsEl.append(wrap);
    shown += items.length;
  });

  emptyEl.hidden = shown > 0;
}

/* ── Filter chips + search ────────────────────────────────── */
function buildChips() {
  const chips = [{ id: 'all', tag: 'All' }, ...SECTIONS];
  chips.forEach((chip) => {
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
}

/* ── Init ─────────────────────────────────────────────────── */
buildChips();
// Search + chips are only worth showing once there's enough to filter
finderEl.hidden = RESOURCES.length < 6;
render();
