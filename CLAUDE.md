# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project overview

One-page PT-PT portfolio site for Tiago Silva (mobile/web developer, job-seeking).
It exists as **two independent implementations of the same content/design** — not
a single app with a shared build. There is no root-level build, lint, or test
command; each folder is self-contained (or, for `ionic-angular/`, not runnable
on its own — see below).

## html-css-js/ — static, ready to deploy

- No build step, no dependencies. Open `index.html` directly in a browser, or
  use the VS Code Live Server extension — `.vscode/settings.json` pins
  `liveServer.settings.root` to `/html-css-js`, so "Go Live" opens straight to
  it without a folder picker.
- Standard external references: `index.html` links `css/styles.css` and
  `js/script.js` normally (no inline styles/scripts). Design: navy/cream
  palette, Bebas Neue + Inter fonts, drag-to-scroll project carousel, mobile
  dropdown nav.

## ionic-angular/ — Angular/Ionic components, not a runnable project as-is

- This folder has no `package.json`/`angular.json`/CLI config — it's just the
  `src/app` tree, organized exactly as it would sit inside a scaffolded Ionic
  project, meant to be copied in. To actually run it:
  1. `ionic start portfolio blank --type=angular`
  2. Replace that project's `src/app/`, `src/theme/`, `src/global.scss`,
     `src/main.ts` with the files from this folder.
  3. `npm install && ionic serve`
- No lint/test commands exist in-repo because there's no project scaffold here.

### Architecture

- Each page section (header, hero, about, projects, project-card, skills,
  contact, footer) is an independent **standalone** Angular component under
  `src/app/components/`, composed in order in `app.component.html`.
- Content is centralized in one place: `src/app/data/portfolio-data.ts`
  (typed via `src/app/models/project.model.ts` and `skill-group.model.ts`).
  Components are presentational/"dumb" — edit project/skill content there,
  not inside the component files.
- Design tokens (colors, spacing) live in `src/theme/variables.scss`. This is
  a separate design system from `html-css-js` (which currently uses its own
  navy/cream/Bebas Neue palette defined via CSS custom properties in
  `css/styles.css`) — the two are not currently kept in visual sync.

## Content is placeholder — treat as such

- The three projects (FitTrack, MesaFácil, StudyFlow) and their result
  metrics (32%, 40%, 78%) are illustrative examples, not real data, and the
  "Ver repositório" links / `repoUrl` fields are all `#` placeholders. If
  asked to finalize or publish the site, flag that these need real projects
  and real numbers — per `README.md`, invented metrics should never ship in
  an actual job application.
- Contact placeholders (`tiago.silva.dev@email.com`,
  `linkedin.com/in/tiago-silva-dev`, `github.com/tiagosilva-dev`) appear in
  both `html-css-js/index.html` and
  `ionic-angular/src/app/components/contact/contact.component.ts` — update
  both when real contact info is provided.
