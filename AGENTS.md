# HR Tech Nugget — contract

A static German blog. Astro 7, no CSS framework, no client-side JavaScript.
These are rules, not suggestions. Everything else is derivable from the code.

## Hard rules

1. **No inline `style=` attributes.** The design mockups use them because the
   design tool required it; this codebase does not. Use scoped `<style>` blocks.
   The only exception is a value that cannot be known at author time, e.g. a
   bar's `width: {pct}%`.
2. **No colour or size literals outside `src/styles/tokens.css`.** If a value is
   not in the token file, add it there first. Never hardcode a hex, a px font
   size, or a letter-spacing in a component.
3. **No `getCollection('nuggets')` outside `src/lib/nuggets.ts`.** Numbering is
   derived from publish order; deriving it in two places is exactly how the hero
   and the article breadcrumb end up disagreeing.
4. **Every page except `/` passes a non-null `back` to `SpecStrip`.** `null` is
   legal only on the home page. The prop is typed as required precisely so
   `astro check` catches a forgotten one instead of a user finding a dead end.
5. **The word "Essay" never appears.** Posts are Nuggets. Use `nuggetCount()`
   for the German plural — "1 NUGGET", "2 NUGGETS".
6. **No client-side JavaScript without an explicit decision.** The mobile nav is
   a `<details>` disclosure for this reason. The only `<script>` tags in `dist/`
   are `application/ld+json` structured-data blocks, which browsers never
   execute. Zero executable scripts.
7. **No third-party runtime requests.** Fonts are self-hosted at build time by
   Astro's Fonts API. `grep -r googleapis dist/` must return nothing — a GDPR
   requirement, not a performance preference.
8. **`pnpm build` must pass `astro check` clean** (build runs check first).

## The newsletter is a single switch

`OWNER.buttondownUser` in `src/config/site.ts` is the only control. Empty means
dormant: no signup block, no SUBSCRIBE button in the top bar or mobile drawer, no
Buttondown section in the privacy policy. Everything reads `NEWSLETTER_ENABLED`
from that one value, so the feature can never be half-on — a form without a
username, or a privacy policy describing processing that does not happen.

`buttondownUser` is deliberately **not** in `REQUIRED_OWNER_FIELDS`: the
newsletter is a feature you may not want, not an unfinished field.

The CSP in `public/_headers` keeps `form-action https://buttondown.com` while the
newsletter is dormant, so reactivation is one value and not also a header edit.
`pnpm verify` asserts both directions.

## Design invariants

2px borders, `border-radius: 0` everywhere, monospace uppercase labels with wide
letter-spacing, every page inside one bordered document frame.

`--muted` (#5A5A5A) is the lightest permissible text colour on `--paper`.
Anything lighter fails WCAG AA. Do not lighten it.

## Writing a nugget

Drop a `.md` or `.mdx` file into `src/content/nuggets/`:

```yaml
---
title: 'Der Titel'
dek: 'Ein Satz unter der Überschrift — dient auch als Meta-Description und RSS-Text.'
topic: 'digitalisierung' # | 'ki-daten' | 'organisation'
published: 2026-08-24
draft: false # optional
---
```

Reading time and the nugget number are computed — never write them by hand.

**Open with a paragraph, not a component** — the lede styling is `p:first-of-type`.

MDX components (`.mdx` files only): `<Note>`, `<PullQuote>`, `<BarFigure>`.
Writing `## Überschrift` produces a numbered section heading automatically.

**A `<Note>` aligns with the top of the block immediately before it.** Put it
directly after that block. Prefer attaching notes to paragraphs: after an element
with a top margin (a figure, a pull quote) the note aligns to the grid row, which
sits above that element's visible top by its margin.

## Numbering caveat

Numbers derive from publish order, so **backdating a nugget renumbers every
nugget published after it**. For an append-only blog this never happens. If you
must insert one with an older date and want existing numbers stable, pin the
affected nuggets with `number:` in frontmatter.

## Before pushing

```bash
pnpm verify
```

That runs the build and then asserts: no Google font requests, fonts actually
self-hosted, no executable scripts, drafts excluded from pages/RSS/sitemap/counts,
a back link on every non-home page, and the CSP allowing the Buttondown POST.

## Development

```
pnpm dev
```

Astro also supports `astro dev --background`, managed with `astro dev stop`,
`astro dev status`, and `astro dev logs`.

## Documentation

- [Content collections](https://docs.astro.build/en/guides/content-collections/)
- [Fonts](https://docs.astro.build/en/guides/fonts/)
- [Routing](https://docs.astro.build/en/guides/routing/)
- [Styling](https://docs.astro.build/en/guides/styling/)
