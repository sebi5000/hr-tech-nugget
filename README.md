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

## Vor dem Livegang — offene Punkte

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

### 3. Deployment auf Cloudflare Pages

Das Repository liegt bereits auf GitHub:
<https://github.com/sebi5000/hr-tech-nugget>

Im Cloudflare-Dashboard: **Workers & Pages → Create → Pages → Connect to Git**,
dieses Repo auswählen.

| Einstellung      | Wert         |
| ---------------- | ------------ |
| Framework preset | Astro        |
| Build command    | `pnpm build` |
| Output directory | `dist`       |

Die Node-Version steht in `.node-version` (22.16.0) und wird von Cloudflare
automatisch gelesen — es ist **keine** `NODE_VERSION`-Umgebungsvariable nötig.
pnpm wird an der `pnpm-lock.yaml` erkannt.

Nur **einen** Deploy-Weg verwenden. Git-Integration _und_ ein
Wrangler-GitHub-Action gleichzeitig erzeugen doppelte Deployments, die um den
Produktions-Branch konkurrieren.

### 4. Eigene Domain (später)

`site:` in `astro.config.mjs` und die Sitemap-URL in `public/robots.txt`
anpassen. Beide werden zur Build-Zeit in RSS, Sitemap und Canonicals eingebacken.

### 5. Nach dem ersten Deploy prüfen

```bash
curl -sI https://hr-tech-nugget.pages.dev/ | grep -i "content-security\|referrer"
```

Und einmal echt im Newsletter-Formular eintragen: Das beweist, dass die CSP den
POST zulässt, der Buttondown-Name stimmt und das Double-Opt-in ankommt.
