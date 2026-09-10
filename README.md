# Portfolio — Astro + Geist design system

Static portfolio site. Two page types sharing one split layout: a homepage with a sticky
sidebar and a project grid, and a case study template rendered from content files.

Built against `DESIGN-vercel.md` (Vercel's Geist system). Ships zero JavaScript.

## Run it

```bash
npm install
npm run dev      # http://localhost:4321
npm run build    # static output in dist/
npm run preview  # serve the build
```

## Structure

```
src/
  content/work/*.yaml     <- all case study copy lives here
  content.config.ts       <- the schema those files must satisfy
  assets/work/*.webp      <- screenshots, optimised at build time
  styles/global.css       <- design tokens + type scale + button/card classes
  layouts/Base.astro      <- html shell, fonts, nav, footer
  components/
    Stage.astro           <- gradient panel + browser-framed screenshot
    ProjectCard.astro     <- homepage card, reused as the "next case study" link
  pages/
    index.astro           <- homepage
    work/[slug].astro     <- case study template
  lib/screens.ts          <- maps content image keys to real assets
```

## Editing content

Every case study is one YAML file in `src/content/work/`. Add a file and it appears in the
grid and joins the next-case chain automatically — `order` controls both. The schema in
`content.config.ts` validates on build, so a typo in a field name fails loudly instead of
rendering blank.

Screenshots are referenced by filename stem (`thumb: Cloud` -> `src/assets/work/Cloud.webp`).
Drop a new webp in that folder and reference it by name.

## How the design system maps

Tokens are transcribed into `@theme` in `global.css`, so Tailwind utilities are generated from
them directly — `text-ink`, `border-hairline`, `bg-canvas`, `text-mute`. Type tokens become
classes (`.t-display-xl`, `.t-eyebrow`, `.t-body-md`) rather than utilities, because each one
bundles four properties including the negative tracking that defines the display face.

Two button shapes, used by context per the spec:

- `.btn-pill` — marketing CTAs. The sidebar's Résumé and LinkedIn.
- `.btn-sq` — nav and app chrome, 6px radius. The header buttons.

### Deliberate deviations

1. **Gradients appear on cards, not only in the hero.** The spec confines colour to a hero mesh.
   This site's structure depends on four gradient stages, so the three named Vercel gradients
   (develop / preview / ship) plus a mesh blend are used one per project. Everything else stays
   ink-on-white.
2. **Buttons have explicit heights.** The spec gives horizontal-only padding (`0px 14px`), which
   would produce a 20px-tall control. Heights are set to 44px (pill) and 32px (square) to clear
   touch targets; horizontal padding is unchanged.

## Before launch

- `public/resume.pdf` — not included, add yours.
- Name, bio, work history and all case study copy is placeholder. Replace it.
- `liveUrl` is optional in the schema and unset on all four projects; add it to any YAML file
  and the sidebar link appears.
- Update `site` in `astro.config.mjs` to the real domain.
