#!/usr/bin/env bash
# Post-build assertions. Each one maps to a decision that is easy to regress
# silently: a font host creeping back in, a draft leaking, a page losing its
# back link, or a CSP that would block the newsletter only in production.
set -uo pipefail
cd "$(dirname "$0")/.."

fails=0
pass() { printf "  \033[32mPASS\033[0m  %s\n" "$1"; }
fail() {
	printf "  \033[31mFAIL\033[0m  %s\n" "$1"
	fails=$((fails + 1))
}

if [ ! -d dist ]; then
	echo "dist/ not found — run 'pnpm build' first." >&2
	exit 1
fi

echo "VERIFYING dist/"

# GDPR: the design originally linked fonts.googleapis.com. It must never return.
if [ -z "$(grep -rl 'googleapis\|gstatic' dist/ 2>/dev/null)" ]; then
	pass "no third-party font requests"
else
	fail "a Google font request is present"
fi

fontcount=$(find dist/_astro/fonts -name '*.woff2' 2>/dev/null | wc -l | tr -d ' ')
if [ "$fontcount" -gt 0 ]; then
	pass "fonts self-hosted ($fontcount files)"
else
	fail "no self-hosted font files"
fi

# ld+json is data, not code — browsers never execute it. Anything else is a script.
execscripts=$(grep -rho '<script[^>]*>' dist --include='*.html' | grep -vc 'application/ld+json' || true)
if [ "$execscripts" -eq 0 ]; then
	pass "zero executable scripts"
else
	fail "$execscripts executable script tag(s)"
fi

# Drafts must vanish completely — not just from the route list.
drafts=$(grep -rl 'draft: true' src/content/nuggets 2>/dev/null | wc -l | tr -d ' ')
leaked=0
for f in $(grep -rl 'draft: true' src/content/nuggets 2>/dev/null); do
	slug=$(basename "$f" | sed 's/\.[^.]*$//')
	[ -d "dist/nuggets/$slug" ] && leaked=1
	grep -q "$slug" dist/rss.xml 2>/dev/null && leaked=1
	grep -q "$slug" dist/sitemap-0.xml 2>/dev/null && leaked=1
done
if [ "$leaked" -eq 0 ]; then
	pass "drafts excluded from pages, RSS and sitemap ($drafts draft(s))"
else
	fail "a draft leaked into the build"
fi

# The standing rule: every route except home offers a way back.
missing=0
for f in $(find dist -name index.html ! -path 'dist/index.html'); do
	grep -q '←' "$f" || {
		fail "no back link: $f"
		missing=1
	}
done
grep -q '←' dist/404.html 2>/dev/null || {
	fail "no back link: dist/404.html"
	missing=1
}
[ "$missing" -eq 0 ] && pass "back link on every non-home page"

# Without this the newsletter POST fails only in production.
if grep -q 'form-action https://buttondown.com' dist/_headers 2>/dev/null; then
	pass "CSP allows the Buttondown POST"
else
	fail "CSP would block the newsletter form"
fi

# The newsletter is one switch (OWNER.buttondownUser). Assert the rendered site
# actually agrees with it, so the feature can never end up half-on: a signup form
# without a username, or a privacy policy describing a newsletter that is absent.
bduser=$(grep -o "buttondownUser: *'[^']*'" src/config/site.ts | sed "s/.*'\(.*\)'/\1/")
forms=$(grep -rl 'buttondown.com/api' dist --include='*.html' 2>/dev/null | wc -l | tr -d ' ')
# `|| true` swallows grep's exit-1 on zero matches without appending a second "0".
privacy=$(grep -c 'Buttondown' dist/datenschutz/index.html 2>/dev/null || true)
if [ -z "$bduser" ]; then
	if [ "$forms" -eq 0 ] && [ "$privacy" -eq 0 ]; then
		pass "newsletter dormant: no signup form, no Buttondown clause"
	else
		fail "newsletter is off but still rendered ($forms page(s), privacy mentions: $privacy)"
	fi
else
	if [ "$forms" -gt 0 ] && [ "$privacy" -gt 0 ]; then
		pass "newsletter live on $forms page(s), privacy policy covers it"
	else
		fail "buttondownUser is set but the newsletter did not render ($forms page(s), privacy: $privacy)"
	fi
fi

# RSS/sitemap sanity. Zero nuggets is a legitimate state (a blog before its
# first post), so the assertion is agreement between feed and pages, not a count.
items=$(grep -o '<item>' dist/rss.xml 2>/dev/null | wc -l | tr -d ' ')
published=$(find dist/nuggets -mindepth 1 -maxdepth 1 -type d 2>/dev/null | wc -l | tr -d ' ')
if [ "$items" -eq "$published" ]; then
	if [ "$items" -eq 0 ]; then
		pass "RSS is valid and empty (no nuggets published yet)"
	else
		pass "RSS lists all $items published nuggets"
	fi
else
	fail "RSS has $items items but $published nuggets are built"
fi

grep -q 'https://hr-tech-nugget.org' dist/rss.xml 2>/dev/null &&
	pass "RSS uses absolute URLs on the real domain" || fail "RSS URLs are not absolute"

[ -f dist/sitemap-index.xml ] && pass "sitemap generated" || fail "no sitemap"

echo
if [ "$fails" -eq 0 ]; then
	printf "\033[32mAll checks passed.\033[0m\n"
else
	printf "\033[31m%s check(s) failed.\033[0m\n" "$fails"
	exit 1
fi
