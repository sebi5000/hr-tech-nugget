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

Diese Dinge müssen erledigt sein, bevor die Seite öffentlich erreichbar ist.

### 1. Impressum und Datenschutz ausfüllen

`src/pages/impressum.astro` und `src/pages/datenschutz.astro` enthalten
Platzhalter in eckigen Klammern (Anschrift, E-Mail, USt-IdNr.). **Ein
unvollständiges Impressum ist abmahnfähig.** Beide Seiten sind Vorlagen und
ersetzen keine Rechtsberatung.

### 2. Buttondown verbinden

In `src/config/site.ts` `buttondownUser` von `PLACEHOLDER` auf deinen
Newsletter-Namen setzen. Die exakte Action-URL aus dem Embed-Snippet im
Buttondown-Dashboard übernehmen, nicht raten.

**Double-Opt-in im Buttondown-Dashboard aktivieren** — die Datenschutzerklärung
sagt zu, dass es aktiv ist.

### 3. Kontaktdaten

In `src/config/site.ts`: `linkedinUrl` und `contactEmail`. Die About-Seite zeigt
sonst weiter `[DEINE E-MAIL]` und `[LINKEDIN-URL]`.

### 4. Deployment auf Cloudflare Pages

```bash
gh repo create sebi5000/hr-tech-nugget --public --source . --push
```

Dann im Cloudflare-Dashboard: **Workers & Pages → Create → Pages → Connect to
Git**, Repo auswählen.

| Einstellung | Wert |
| --- | --- |
| Build command | `pnpm build` |
| Output directory | `dist` |
| Environment variable | `NODE_VERSION` = `22.12.0` |

`NODE_VERSION` ist nicht optional — das Standard-Build-Image von Cloudflare ist
älter als Astro 7 verlangt, und das ist der erste Fehler, in den du sonst läufst.

Nur **einen** Deploy-Weg verwenden. Git-Integration *und* ein
Wrangler-GitHub-Action gleichzeitig erzeugen doppelte Deployments, die um den
Produktions-Branch konkurrieren.

### 5. Eigene Domain (später)

`site:` in `astro.config.mjs` und die Sitemap-URL in `public/robots.txt`
anpassen. Beide werden zur Build-Zeit in RSS, Sitemap und Canonicals eingebacken.

### 6. Nach dem ersten Deploy prüfen

```bash
curl -sI https://hr-tech-nugget.pages.dev/ | grep -i "content-security\|referrer"
```

Und einmal echt im Newsletter-Formular eintragen: Das beweist, dass die CSP den
POST zulässt, der Buttondown-Name stimmt und das Double-Opt-in ankommt.
