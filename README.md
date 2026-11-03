# 🐇 @balijepallipavan — Resource Hub

Every roadmap, skill and guide mentioned in [@balijepallipavan](https://www.instagram.com/balijepallipavan/) posts and videos, in one place. Hosted on **GitHub Pages**.

Styled from the **Sage and Stone** design system: cool blueprint paper, deep navy ink, cobalt + mist; Garamond display lines, Space Grotesk text, one Lora pull-quote; hairline borders, no shadows. Colors, fonts, spacing and radii live as tokens at the top of `styles.css` and mirror the system's `tokens.json`.

## ➕ Adding a resource

Content lives in **`data/*.json`**, one file per section. Edit a file, push, and the page updates. You never touch the HTML.

| File | Section |
|------|---------|
| `data/roadmaps.json` | Roadmaps & Guides |
| `data/skills.json` | Skills & Prompts |
| `data/learn.json` | Learn the Basics |
| `data/index.json` | Which sections show, and in what order |

1. Drop the file into `assets/` (or use an external URL).
2. Add an object to the `items` list of the right JSON file:

```json
{
  "title": "AI Engineer Roadmap",
  "desc": "Zero to shipping real AI products.",
  "url": "assets/roadmap_ai_engineer.pdf",
  "type": "PDF",
  "badge": "new",
  "accent": "first",
  "keywords": ["llm", "career", "beginner"]
}
```

Only `title` and `url` are required.

| Field | What it does |
|-------|--------------|
| `type` | Small label on the right (PDF, Playlist, Skill…) |
| `badge` | `"new"` tag. Remove it when it's no longer new |
| `accent` | Number box colour: `first` (cobalt, do this first) · `core` (mist, core skill) · `optional` (outlined) |
| `keywords` | Extra words that only search sees, e.g. synonyms and tool names |

3. Commit and push. Cards are numbered automatically.

**New section?** Create `data/<name>.json` (copy an existing one, set `id`, `tag`, `title`, `blurb`) and add its file name to `data/index.json`.

**Search** is always on: type several words and a card must match all of them across its title, description, type, keywords and section name. The chips filter by section.

If a JSON file has a typo (missing comma or quote), the page shows a notice naming the broken file and every other section still loads.

**Checking your edits.** A GitHub Action (`.github/workflows/validate-data.yml`) runs on every push and PR that touches `data/` or `assets/`. It fails if a JSON file has a syntax error, an item is missing `title` or `url`, `accent` isn't `first`/`core`/`optional`, or a local link like `assets/foo.pdf` points at a file that isn't in the repo. To check before pushing:

```bash
node scripts/validate-data.mjs
```

> The page loads JSON with `fetch`, so open it through a server (`python3 -m http.server`), not by double-clicking `index.html`. GitHub Pages is fine.

## 🚀 Deployment

Settings → Pages → source `main`, root `/`. Live at  
`https://pavankumarbalijepalli.github.io/balijepallipavan-resources/`

## 🛠️ Stack

HTML5 · vanilla CSS · vanilla JS · Google Fonts (EB Garamond, Space Grotesk, Lora)

---

Analog in a digital life.
