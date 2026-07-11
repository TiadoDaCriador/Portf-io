# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project overview

One-page PT-PT portfolio site for Tiago Silva (mobile/web developer, job-seeking).
`html-css-js/` is the whole site — static, no build step, no root-level build
command. There *is* a root-level lint/CI setup for it — see "Deployment & CI"
below.

This is a git repo (`git init` done in-project). `.gitignore` covers
`node_modules/`, `dist/`, `.angular/`, Firebase artifacts (`.firebase/`,
`firebase-debug.log*`) and Lighthouse CI (`.lighthouseci/`).

**History note:** the repo originally also had an `ionic-angular/` folder —
the same content/design ported to standalone Angular components, meant to be
copied into a scaffolded Ionic project (it had no `package.json`/CLI config of
its own, so it never ran standalone). Tiago had it removed (2026-07-10) since
it wasn't deployed anywhere, needed manual scaffolding to even run, and had
drifted out of sync with `html-css-js/` (old placeholder projects, an
unfixed scroll-reveal glitch). The version from the initial commit
(`3423d92`) is recoverable via git history/`git log` if it's ever worth
reviving — but some later uncommitted work on top of that (wiring up a
`SplitRevealDirective` letter-reveal, mirroring `html-css-js`'s) was
deliberately discarded, not committed, at Tiago's choice, and is **not**
recoverable — only the original committed version is.

## html-css-js/ — static, ready to deploy

- No build step. Open `index.html` directly in a browser, or use the VS Code
  Live Server extension — `.vscode/settings.json` pins
  `liveServer.settings.root` to `/html-css-js`, so "Go Live" opens straight to
  it without a folder picker.
- Standard external references: `index.html` links `css/styles.css`,
  `js/script.js` and `js/analytics.js` normally (no inline styles/scripts).
  Design: navy/cream palette, Bebas Neue + Inter fonts, drag-to-scroll project
  carousel (also has visible prev/next buttons + arrow-key nav), full-page
  mobile nav overlay (see below).
- **Not dependency-free anymore**: GSAP + ScrollTrigger are loaded via CDN
  (`cdnjs`, pinned version, with SRI `integrity` hashes) for the letter-by-letter
  title reveal — see "Scroll reveal" below. Everything else is still vanilla
  JS/CSS.
- Google Fonts are loaded via `<link rel="preconnect">` + `<link rel="stylesheet">`
  in `index.html` (not a CSS `@import`, for faster first paint). All `<script>`
  tags are `defer`red.
- **Mobile nav (`≤800px`) is a full-page takeover**, not a small dropdown
  (changed 2026-07-10, Tiago's request: "quero a side bar a ocupar a
  página"). `.nav-links.open` becomes `position:fixed; inset:0`, covering
  the whole viewport, and `js/script.js` toggles a `body.nav-open` class
  that sets `overflow:hidden` so the page behind it can't scroll. Non-obvious
  bit: `.nav-actions` (which holds the `✕`/hamburger button) needs its own
  `position:relative; z-index:2` at that breakpoint, or the full-screen
  `.nav-links` overlay (`z-index:1`, same stacking context since both are
  inside `nav{position:relative; z-index:10}`) would render on top of it and
  there'd be no way to close the menu. If you touch this, re-check the close
  button is still clickable with the menu open.

## Scroll reveal

Two independent, coexisting animation systems — don't conflate them:

1. **Simple fade+slide** (`.reveal` / `.is-visible`) — native
   `IntersectionObserver`, no dependency. Fades in + slides up 20px, once per
   element, then the JS removes the `reveal` class again after the transition
   ends. Used for paragraphs, cards, skill/contact tiles. Stagger is done via
   a `--reveal-delay` CSS custom property (nth-child selectors).
   - **Non-obvious gotcha**: `.card`/`.contact-tile` already have their own
     hover `transition`. A same-specificity `.reveal` rule can get silently
     clobbered by that (or vice versa) depending on source order. If you touch
     hover transitions on those classes, re-check this doesn't regress.
2. **Letter-by-letter, scroll-scrubbed** (`.reveal-line` / `.char`) — GSAP +
   ScrollTrigger, `scrub: 1` (tied continuously to scroll position, not a
   one-shot trigger — reverses if you scroll back up, by design). `scrub: 1`
   trails the actual scroll position by up to 1s of smoothing, which on a fast
   flick/fast scroll used to read as letters stuck mid-reveal for a moment
   after the user stopped scrolling. `html-css-js/js/script.js` sets
   `fastScrollEnd: true` on the ScrollTrigger config to fix this — it snaps
   the tween to completion instantly once scroll speed crosses GSAP's
   threshold, instead of visibly catching up. Used only on the hero title and
   section `<h2>`s. Each visual line must be its own `.reveal-line` wrapper
   (`overflow:hidden`) — the JS reads its `textContent` and rebuilds it as
   one `.char` span per letter. Accessibility: the heading carries the real
   text via `aria-label`; the decomposed `.reveal-line` spans are
   `aria-hidden="true"` so screen readers get the sentence once, not
   letter-by-letter.
   - Degrades gracefully: if the CDN script fails to load, the plain heading
     text stays visible/readable, and it respects `prefers-reduced-motion`
     (skips the animation, text stays static).
   - **Edge-of-page gotcha (fixed 2026-07-10):** `start:'top 85%'`/`end:'top
     40%'` become absolute scroll positions. For a `.reveal-line` close to
     the bottom of the page (the contact section's "PROJETO"), the computed
     `end` can exceed the page's actual max scroll, so it could never reach
     100% even scrolled all the way down — confirmed by measuring `.progress`
     on the live `ScrollTrigger` instance at max scroll (was ~0.94, not 1).
     Fixed in `html-css-js/js/script.js` by computing the natural `end` in
     pixels and clamping it down to the page's real max scroll whenever it
     would otherwise be unreachable.
   - **Above-the-fold gotcha (fixed 2026-07-10, revised 2026-07-11):** for a
     `.reveal-line` close to the *top* of the page (e.g. "Sobre mim"'s
     heading on a tall mobile viewport, where it's already near the initial
     viewport at load), the computed `start` goes negative — unreachable,
     since you can't scroll to negative Y — so the line rendered partially
     revealed (non-zero opacity/offset per char) with **zero scrolling**,
     looking broken on load. First fix attempt clamped `start` to `0` so it
     revealed as the user scrolled a little — Tiago's follow-up feedback was
     that on mobile he didn't want to have to scroll *at all* to see it
     ("não é preciso"). Landed behavior: whenever the natural `start` is
     negative **and** `window.innerWidth <= 800` (same breakpoint as the rest
     of the site's mobile styles), skip the scroll-tied tween entirely and
     `gsap.set` the chars straight to their revealed end state
     (`yPercent:0, opacity:1`) — same treatment the hero title's chars
     already got implicitly (both its lines' natural start/end are negative,
     so they were always fully visible immediately, no animation). **The
     `<=800px` check is deliberate and was added specifically because Tiago
     asked desktop to keep the original scroll-triggered reveal** ("mas em
     versão desktop deixa como estava") — without it, a short/non-maximized
     desktop browser window could also trip the negative-`start` condition
     and skip the animation there too, which he didn't want. So: on mobile,
     any heading whose reveal would naturally start before scroll position 0
     now just appears instantly; on desktop, that heading keeps the
     scroll-scrubbed reveal regardless of window height. Only headings
     genuinely below the fold at load (on either breakpoint) get the
     scroll-scrubbed animation.
   - Both of the above measurements are deferred until `document.fonts.ready`
     resolves — doing it earlier reads stale
     `document.documentElement.scrollHeight`/element positions from before
     Bebas Neue swaps in (fallback-font metrics differ), which silently
     desyncs the clamp. If you touch this logic, re-verify with real
     measurements (char `opacity`/`transform` at load, `ScrollTrigger`
     `progress` at max scroll) — both bugs were invisible to *reading* the
     code and only showed up by measuring actual rendered state.

## Decorative mockups (hero / sobre)

Two CSS-only decorative mockups fill the lateral whitespace next to text in
wide viewports — no images/SVG, just nested `div`/`span` with borders and
background tricks:

- `.hero-visual > .phone-mockup` — a phone frame (hero, next to the title).
- `.about-visual > .browser-mockup` — a browser window + bar chart ("Sobre
  mim", reinforces the "construir + medir com dados" copy).

Both are `aria-hidden="true"` (purely decorative, no information not already
in the surrounding text) and are hidden entirely (`display:none`) at the
`max-width:800px` breakpoint — Tiago's explicit call, not a bug: on mobile
they added scroll length without adding value. If you resurrect them on
mobile later, re-check vertical rhythm — they were sized assuming a
side-by-side layout, not stacked.

**"Competências" deliberately has no decorative element.** It's a plain
`<h2 class="section-label reveal" id="competencias">`, same pattern as
"Projetos em destaque" above it — no wrapper div. This follows five (5)
rejected decorative attempts across the site on 2026-07-10: a dot/shape grid
in the hero (`.symbol-grid`, removed outright), then for this section
specifically — a code-editor window, a desktop computer/monitor, a dark
laptop, and a light-screen laptop, each rejected in turn ("não gosto muito
deste elemento gráfico" / "não gostei muito" / "não gosto , podes fazer
isso de outra forma?"), before Tiago said "podes tirar" and it was removed
for good. **Do not add a new decorative graphic here without asking first**
— this section has used up its budget of guesses.

## Deployment & CI (html-css-js only)

- **Firebase Hosting** is set up at the repo root: `firebase.json` (serves
  `html-css-js/`, security headers incl. CSP, cache headers) + `.firebaserc`
  (project id is currently the placeholder `portfolio-tiago-silva` — replace
  with the real Firebase project id before deploying). `firebase deploy
  --only hosting` / `firebase emulators:start --only hosting` from repo root.
  - **Emulator gotcha**: the local hosting emulator does NOT apply the custom
    `headers` from `firebase.json` (verified on firebase-tools v13 and v15,
    including with a minimal repro — it's the emulator, not this config).
    `cleanUrls`/rewrites work locally; headers only take effect on deployed
    Hosting. Verify post-deploy with `curl -I`.
- **GA4 analytics** (`html-css-js/js/analytics.js`): Consent Mode v2, default
  `denied`. Shows a PT consent banner; `gtag.js` only loads after explicit
  accept (nothing is sent to Google before that). `GA_MEASUREMENT_ID` is now
  a real, live Measurement ID (`G-JSGN6T85G`, GA4 property "Portfolio Tiago
  Silva", web data stream id `15236468288`) — set 2026-07-10. The stream's
  configured web URL is still the `tiagosilva.dev` placeholder; update it in
  GA4 Admin → Data streams once the real domain is known (doesn't block
  tracking either way). Custom events: `contact_click`, `cta_click`,
  `section_view`, `carousel_interaction`.
- **CI** (`.github/workflows/ci.yml`): `html-validate` (config in
  `.htmlvalidate.json`) + Lighthouse CI (`.lighthouserc.json`, thresholds 0.9
  for accessibility/best-practices/SEO, 0.9 warn for performance) on every
  push/PR.
- **Deploy** (`.github/workflows/deploy.yml`): pushes to `master` deploy to
  the live Firebase Hosting channel; PRs get a preview channel. Requires the
  `FIREBASE_SERVICE_ACCOUNT` GitHub secret (see README for how to generate it).
- **GitHub Pages** (`.github/workflows/pages.yml`): parallel/alternative
  deploy target, not a replacement for the Firebase one — both can run off
  the same `master` push. Uses the official `actions/deploy-pages` flow (no
  `gh-pages` branch), needs Settings → Pages → Source: "GitHub Actions" set
  once in the GitHub repo, no secrets required. GA4 works identically here
  (it's just a script tag, not Firebase-dependent) but the Firebase security
  headers (CSP etc., see below) don't apply on Pages.
- **No git remote is configured in this repo yet** (`git remote -v` is
  empty) — both `deploy.yml` and `pages.yml` are inert until the repo is
  pushed to an actual GitHub remote.
- SEO/meta files reference `https://tiagosilva.dev` as a placeholder domain:
  `index.html` (`canonical`, `og:url`, `og:image`, JSON-LD `Person`),
  `robots.txt`, `sitemap.xml`. All three need updating together to whichever
  real domain ends up serving the site (Firebase `*.web.app`, GitHub Pages
  `<user>.github.io/<repo>/`, or a custom domain).

## Content is placeholder — treat as such

- `html-css-js/index.html` shows Tiago's two real projects, **App Sócios**
  (member management for musical associations — Ionic Angular, Capacitor,
  REST API, biometric login, 574 unit tests) and **Maestro Member** (band
  management app — Ionic Angular, Angular Signals, Capacitor). Their stat
  blocks use real, verifiable technical numbers (test pass rate, screen
  count), not invented business metrics — no illustrative/placeholder
  projects remain on the site.
- Both real projects carry a `.card-context` credit line ("Estágio · MUsa
  Software") — Tiago confirmed both were built during an internship at MUsa
  Software (MUsa is also the name of the REST API/backend App Sócios
  integrates with) and okayed naming the company publicly. Don't remove or
  genericize that credit without checking with him first.
- **"Sobre mim" now has real biographical detail, added 2026-07-11:** Tiago
  is currently finishing (last year, not yet concluded — keep the "estudante"
  framing, not "formado"/past tense) a **CTeSP em Desenvolvimento Web e
  Multimédia** at **ESTG**, and did a **4-month internship at MUsa Software**
  (the same one that produced App Sócios/Maestro Member — the "Sobre mim"
  text explicitly calls forward to "os dois projetos em destaque mais
  abaixo", so if the projects section is ever reordered to appear *before*
  "Sobre mim", that wording needs to flip to "em cima"/"acima"). Job-seeking
  language across the site was also changed from "estágio" to "emprego"
  this same session (he's no longer looking for an internship, he's already
  done one) — see `index.html`'s eyebrow, "Sobre mim"'s closing paragraph,
  and the contact section's intro, plus `README.md`'s intro line. Don't
  revert any of these to "estágio" without checking — it wasn't a typo fix,
  it's a real change in what he's looking for.
- Repo/demo/video links (`href="#"`, `data-placeholder="true"`) are still
  placeholders — App Sócios and Maestro Member are private/client-ish repos
  (real `origin` remotes exist locally, `github.com/TiadoDaCriador/Socios_App`
  and `/Maestro_Member`, but they 404 publicly — not pushed, or private).
  Tiago chose to keep them private for now; don't invent public GitHub URLs
  or link those remotes without checking with him first — per `README.md`,
  invented metrics/links should never ship in an actual job application.
- Contact placeholders (`tiago.silva.dev@email.com`,
  `linkedin.com/in/tiago-silva-dev`, `github.com/tiagosilva-dev`) are in
  `html-css-js/index.html` — update when real contact info is provided.
- Also placeholder, added with the deployment infra (see "Deployment & CI"):
  the `tiagosilva.dev` domain baked into meta/SEO files, and the Firebase
  project id in `.firebaserc`. Neither breaks anything left as-is (Firebase
  deploy just fails until a real project id is set) but they're both "before
  this actually goes live" items alongside the projects/contacts above. (The
  GA4 Measurement ID is no longer a placeholder — see "Deployment & CI".)
