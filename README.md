# 🐇 @bunnybethinking — Resource Hub

Every roadmap, skill and guide mentioned in [@bunnybethinking](https://www.instagram.com/bunnybethinking/) posts and videos, in one place. Hosted on **GitHub Pages**.

Styled from the **Sage and Stone** design system: cool blueprint paper, deep navy ink, cobalt + mist; Garamond display lines, Space Grotesk text, one Lora pull-quote; hairline borders, no shadows. Colors, fonts, spacing and radii live as tokens at the top of `styles.css` and mirror the system's `tokens.json`.

## ➕ Adding a resource

Everything is driven by **`resources.js`** — you never touch the HTML.

1. Drop the file into `assets/` (or use an external URL).
2. Add an object to `RESOURCES` in `resources.js`:

```js
{
  section: 'roadmaps',            // id from SECTIONS
  title: 'AI Engineer Roadmap',
  desc: 'Zero to shipping real AI products.',
  url: 'assets/roadmap_ai_engineer.pdf',
  type: 'PDF',                    // optional label
  badge: 'new',                   // optional — remove when it's no longer new
  accent: 'first',                // optional: first | core | optional
}
```

3. Commit and push. Cards are numbered automatically.

Need a new category? Add an entry to `SECTIONS` at the top of `resources.js`.
Search + filter chips appear automatically once there are 6+ resources.

**Accents** (the card's number box): cobalt = do this first · mist = core skill · outlined = optional / advanced.

## 📁 Structure

```
├── index.html      # Page shell (header, callout, footer)
├── resources.js    # ← the only file you edit to add content
├── script.js       # Renders sections/cards, search + filters
├── styles.css      # Design tokens + components
├── avatar.jpg
└── assets/         # PDFs, skills, checklists
```

## 🚀 Deployment

Settings → Pages → source `main`, root `/`. Live at  
`https://pavankumarbalijepalli.github.io/bunnybethinking-resources/`

## 🛠️ Stack

HTML5 · vanilla CSS · vanilla JS · Google Fonts (EB Garamond, Space Grotesk, Lora)

---

Analog in a digital life.
