# HR Tech Nugget

Persönlicher Blog über Digitalisierung im HR, KI & Daten im HR und den Umbau zu
einer modernen HR-Organisation.

Statische Astro-Site, kein Client-JavaScript, selbst gehostete Schriften.

## Entwicklung

```bash
pnpm install
pnpm dev          # http://localhost:4321
pnpm build        # astro check + build nach dist/
pnpm preview
```

Node ≥ 22.12 erforderlich (Astro 7).

## Neues Nugget schreiben

Eine Datei in `src/content/nuggets/` anlegen — `.md` reicht, `.mdx` wenn du
Randnotizen, Zitatblöcke oder Diagramme brauchst.

```yaml
---
title: 'Der Titel'
dek: 'Ein Satz unter der Überschrift.'
topic: 'digitalisierung' # oder 'ki-daten' oder 'organisation'
published: 2026-08-24
---
```

Nummer und Lesezeit werden berechnet. `draft: true` blendet ein Nugget in der
Produktion aus, in `pnpm dev` bleibt es sichtbar.

Details und die Regeln des Projekts stehen in [AGENTS.md](AGENTS.md).

---

## Offene Punkte vor der Bekanntgabe

### 1. Den OWNER-Block ausfüllen

**Alles Persönliche steht an genau einer Stelle:** dem `OWNER`-Block in
`src/config/site.ts`. Impressum, Datenschutzerklärung, die Über-mich-Seite, der
Footer und das Newsletter-Formular lesen von dort — es gibt keinen zweiten Ort,
den man vergessen kann.

```ts
export const OWNER = {
  buttondownUser: '', // aus deinem Buttondown-Dashboard
  email: '',
  linkedinUrl: '',
  street: '',
  postalCity: '',
  country: 'Deutschland',
  phone: '', // optional
  vatId: '', // oder der Hinweis, dass sie entfällt
};
```

Solange ein Pflichtfeld leer ist:

- steht auf Impressum und Datenschutz ein Banner „NOCH NICHT
  VERÖFFENTLICHUNGSREIF" mit der Liste der offenen Felder,
- rendern die betroffenen Stellen sichtbar markierte Platzhalter,
- ist das Newsletter-Formular **deaktiviert** statt E-Mail-Adressen ins Leere zu
  schicken.

**Ein unvollständiges Impressum ist abmahnfähig.** Impressum und
Datenschutzerklärung sind Vorlagen und ersetzen keine Rechtsberatung.

### 2. Double-Opt-in bei Buttondown aktivieren

Das ist eine Einstellung im Buttondown-Dashboard, nicht im Code — und die
Datenschutzerklärung sagt zu, dass es aktiv ist.

Die Action-URL des Formulars wird aus `buttondownUser` gebaut. Vergleiche sie
einmal mit dem Embed-Snippet in deinem Dashboard.

### 3. Newsletter live testen

Nach dem Ausfüllen von `buttondownUser` einmal echt im Formular eintragen. Das
beweist auf einen Schlag, dass die CSP den POST zulässt, der Buttondown-Name
stimmt und das Double-Opt-in ankommt.

---

## Deployment (steht bereits)

Läuft auf Cloudflare Pages, Projekt `hr-tech-nugget`, verbunden mit dem
GitHub-Repo <https://github.com/sebi5000/hr-tech-nugget>.

**Jeder Push auf `main` deployt automatisch.** Pull Requests bekommen eine
Preview-URL als Kommentar.

| Einstellung      | Wert                                   |
| ---------------- | -------------------------------------- |
| Build command    | `pnpm build` (führt `astro check` mit) |
| Output directory | `dist`                                 |
| Node             | `.node-version` → 22.16.0              |
| Paketmanager     | pnpm, erkannt an `pnpm-lock.yaml`      |

Weil `pnpm build` mit `astro check` startet, bricht ein Typfehler den Deploy ab,
statt ihn live zu stellen.

### Domains

| Host                       | Verhalten                     |
| -------------------------- | ----------------------------- |
| `hr-tech-nugget.org`       | kanonisch, serviert die Seite |
| `www.hr-tech-nugget.org`   | 301 auf die Apex-Domain       |
| `hr-tech-nugget.pages.dev` | Cloudflare-Standarddomain     |

DNS sind proxied CNAMEs auf `hr-tech-nugget.pages.dev`; die Apex-Domain nutzt
CNAME-Flattening. Der www-Redirect ist eine Single-Redirect-Rule in der Zone.

Bei einem Domainwechsel: `site:` in `astro.config.mjs`, `url` in
`src/config/site.ts` und die Sitemap-URL in `public/robots.txt` anpassen — alle
drei werden zur Build-Zeit in Canonicals, RSS, OG-Tags und Sitemap eingebacken.

Nur **einen** Deploy-Weg verwenden. Git-Integration _und_ ein
Wrangler-GitHub-Action gleichzeitig erzeugen doppelte Deployments, die um den
Produktions-Branch konkurrieren.
