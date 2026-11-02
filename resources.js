/* ============================================================
   @bunnybethinking Resource Hub — resources.js
   ------------------------------------------------------------
   THIS IS THE ONLY FILE YOU EDIT TO ADD A RESOURCE.

   1. Add a resource object to RESOURCES (copy any existing one).
   2. Set `section` to one of the ids in SECTIONS below.
   3. Commit + push. Cards are numbered automatically.

   Resource fields
     title   required   Card heading
     desc    required   One line, keep it short
     url     required   https://… link, or a path like assets/file.pdf
     type    optional   Small label on the right (PDF, Playlist, Skill…)
     badge   optional   "new" — drop it once it's not new anymore
     accent  optional   "first" (default) | "core" | "optional"
                        first = do this first · core = core skill · optional = optional / advanced
   ============================================================ */

const SECTIONS = [
  { id: 'roadmaps', tag: 'Roadmaps',        title: 'Roadmaps & Guides',  blurb: 'The order it actually makes sense to learn things.' },
  { id: 'skills',   tag: 'Skills & Prompts', title: 'Skills & Prompts',   blurb: 'Copy these. Make them yours.' },
  { id: 'learn',    tag: 'Learn',            title: 'Learn the Basics',   blurb: 'Free courses and playlists I actually recommend.' },
];

const RESOURCES = [
  /* ── Roadmaps & Guides ─────────────────────────────────── */
  {
    section: 'roadmaps',
    title: 'AI Engineer Roadmap',
    desc: 'Zero to shipping real AI products. No PhD, no skipped steps.',
    url: 'assets/roadmap_ai_engineer.pdf',
    type: 'PDF',
    badge: 'new',
  },

  /* ── Skills & Prompts ──────────────────────────────────── */
  {
    section: 'skills',
    title: 'Instagram Carousel Skill',
    desc: 'The exact skill I use to design my carousels.',
    url: 'https://github.com/pavankumarbalijepalli/bunnybethinking-resources/blob/main/assets/instagram-carousel-skill.md',
    type: 'Skill',
    accent: 'core',
  },

  /* ── Learn the Basics ──────────────────────────────────── */
  {
    section: 'learn',
    title: 'Math & ML on YouTube',
    desc: 'Linear algebra → calculus → probability → stats → ML. Tick them off.',
    url: 'https://github.com/pavankumarbalijepalli/bunnybethinking-resources/blob/main/assets/Youtube-Resources.md',
    type: 'Checklist',
    accent: 'core',
  },
  {
    section: 'learn',
    title: 'Linear Algebra',
    desc: '3Blue1Brown — the visual way to learn the maths behind ML.',
    url: 'https://www.youtube.com/playlist?list=PLZHQObOWTQDPD3MizzM2xVFitgF8hE_ab',
    type: 'Playlist',
    accent: 'core',
  },

  /* ── ADD NEW RESOURCES ABOVE THIS LINE ─────────────────── */
];
