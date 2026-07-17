<div align="center">

![Counts](https://count.getloli.com/@hjx-25pc1.github.io?name=hjx-25pc1.github.io&theme=miku&padding=7&offset=0&align=top&scale=1&pixelated=1&darkmode=auto)

# Class Website

Class 1, Computer Application, Grade 2025

[![GitHub Pages](https://img.shields.io/github/deployments/hjx-25pc1/hjx-25pc1.github.io/github-pages?style=for-the-badge)](https://hjx-25pc1.github.io)
[![License](https://img.shields.io/github/license/hjx-25pc1/hjx-25pc1.github.io?style=for-the-badge)](https://github.com/hjx-25pc1/hjx-25pc1.github.io/blob/main/LICENSE)
[![Stars](https://img.shields.io/github/stars/hjx-25pc1/hjx-25pc1.github.io?style=for-the-badge)](https://github.com/hjx-25pc1/hjx-25pc1.github.io)
[![Open in GitHub Codespaces](https://img.shields.io/badge/Codespaces-Open-181717?style=for-the-badge&logo=github)](https://github.com/hjx-25pc1/hjx-25pc1.github.io/codespaces)
[![Eleventy](https://img.shields.io/badge/Eleventy-000000?style=for-the-badge&logo=eleventy&logoColor=white)](https://www.11ty.dev)
[![Nunjucks](https://img.shields.io/badge/nunjucks-green?logo=nunjucks&style=for-the-badge)](https://mozilla.github.io/nunjucks/)
[![SCSS](https://img.shields.io/badge/SCSS-CC6699?style=for-the-badge&logo=sass&logoColor=white)](https://sass-lang.com/)
[![JavaScript](https://img.shields.io/badge/JavaScript-black?style=for-the-badge&logo=javascript)](https://developer.mozilla.org/en-US/docs/Web/JavaScript)

**English** | [简体中文](docs/README_zh-cn.md)

This is a Class Website. You can find some interesting content.

📖 [Documentation](CONTRIBUTING.md) · 🛡️ [Security Policy](SECURITY.md) · 💬 [Support](SUPPORT.md) · 📜 [Code of Conduct](CODE_OF_CONDUCT.md)

</div>

## 🔭 Overview

This repository hosts the source code of the official class website for **Class 1, Computer Application, Grade 2025**. It is used to showcase the class, share learning materials, document everyday[...]

The site is organized into three main content sections — **Events / Articles / Wiki** — plus a handful of "Zone" entry points (discussion, study, activities, etc.).

- **Author**: hjx-25pc1
- **License**: MIT
- **Live Site**: <https://hjx-25pc1.github.io>
- **Repository**: <https://github.com/hjx-25pc1/hjx-25pc1.github.io>

## Project Structure & i18n Architecture

This site uses a **directory-isolated** i18n architecture, where each language has its own content directory. Eleventy directory data files automatically inject locale and permalink prefixes:

```
src/
├── _data/i18n.js              ← Translation dictionary (zh-cn / en)
├── _includes/                 ← Layouts, components, macros (shared, not language-specific)
├── _layouts/                  ← Layout templates
├── _macros/                   ← Reusable macros
├── style/                     ← SCSS stylesheets
├── script/                    ← Front-end JavaScript
├── zh-cn/                     ← Chinese content (primary language)
│   ├── zh-cn.11tydata.js      ← Injects locale and permalink prefix
│   ├── zh-cn.json             ← Injects locale/lang/dir metadata
│   ├── index.md               ← Chinese homepage
│   ├── article/               ← Chinese articles
│   ├── wiki/                  ← Chinese wiki
│   ├── zone/                  ← Chinese zones
│   └── event/                 ← Chinese events
├── en/                        ← English content
│   ├── en.11tydata.js         ← Same, for English
│   ├── en.json
│   ├── index.md
│   └── ...
└── index-redirect.md          ← Root JS redirect (no language content, detects user preference)
```

### Adding Multilingual Content

1. **Create new pages**: Add the Chinese version under `src/zh-cn/` (primary), and the English version under `src/en/`. The `permalink` in front matter does not need a language prefix (e.g., `permalink: /about/`) — directory data files will auto-add `/zh-cn/` or `/en/`.

2. **Use translation dictionary**: Reference translations in templates with `{{ 'key.path' | i18n }}`. Dictionary keys are defined in `src/_data/i18n.js`. When adding new keys, provide both zh-cn and en values.

3. **Locale-aware links**: Use `{{ '/path/' | localUrl }}` instead of `{{ '/path/' | url }}` for internal links. The `localUrl` filter automatically prepends the correct language prefix.

4. **Root path behavior**: When users visit `/`, the site detects their language preference from localStorage (or `navigator.language`) and redirects to `/zh-cn/` or `/en/`. The navigation bar provides a language switcher that saves preferences to localStorage.

5. **Directory data files**:
   - `*.11tydata.js`: JavaScript objects with computed properties, mainly used for `eleventyComputed.permalink` (dynamic prefix injection)
   - `*.json`: Static JSON objects for locale, lang, dir metadata

### Page Metadata

All content pages should include the following front matter:

```yaml
---
title: Page Title          # Required; appears in <title> and page header
permalink: /page-slug/     # Semantic path, no language prefix (auto-added)
layout: layouts/default    # Layout template
---
```

## Tech Stack

This project is a fully static site built with the following technologies:

- **[Eleventy (11ty)](https://www.11ty.dev/)** v3 — Static Site Generator (SSG)
- **Nunjucks (`.njk`)** — Templating engine for layouts, reusable components, and page rendering
- **Markdown (`.md`)** — Primary content format for easy writing and reading
- **Sass / SCSS** — CSS preprocessor, compiled into compressed CSS
- **PostCSS + Autoprefixer** — Automatically adds vendor prefixes for broad browser compatibility
- **[@11ty/eleventy-img](https://www.11ty.dev/docs/plugins/image/)** — Responsive image processing, auto-generates `webp` and `jpeg` at multiple sizes
- **[@11ty/eleventy-plugin-syntaxhighlight](https://www.11ty.dev/docs/plugins/syntaxhighlight/)** — Syntax highlighting for Markdown code blocks
- **i18n Internationalization** — Directory-based multi-language solution:
  - `lodash.get` + `templite` — Custom `i18n` filter with variable interpolation
  - `eleventy-plugin-i18n` — Official plugin (reference implementation; we use our own filter)
  - Directory data files (`*.11tydata.js` / `*.json`) — Auto-inject locale and permalink prefix for `src/zh-cn/` and `src/en/`
  - Custom filters: `i18n` (translate), `localUrl` (locale-aware URL), `switchLang` (language switch URL), `lang` (current language code)
- **Vanilla JavaScript (ES Modules)** — A small amount of client-side interaction; scripts are organized as native ES modules under `src/script/` with no front-end framework or bundler dependency; `lang-switcher.js` handles the navigation language switcher and localStorage preference persistence[...]
- **GitHub Actions** — Automated CI/CD; pushing to the `main` branch triggers a build and deployment
- **GitHub Pages** — Static site hosting platform

## 🖥️ Development Requirements

Before you start, make sure the following tools are installed locally:

| Tool | Version | Description |
| --- | --- | --- |
| **Node.js** | 24.x (LTS; the latest LTS is recommended) | Runtime and package management |
| **npm** | 11.x or newer (installed with Node.js) | Dependency management and script execution |
| **Git** | Latest stable | Version control and commits |

> 💡 Recommend using [nvm](https://github.com/nvm-sh/nvm) (or [nvm-windows](https://github.com/coreybutler/nvm-windows) on Windows) to manage Node.js versions.

## ☁️ Developing in GitHub Codespaces

No local toolchain needed — fire up a full dev environment straight from your browser:

1. Open <https://github.com/hjx-25pc1/hjx-25pc1.github.io> and click the green **Code** button.
2. Switch to the **Codespaces** tab → click **Create codespace on main**.
3. On first launch, `npm ci` will run automatically to install dependencies, and `npm run serve` will start in the background.
4. Once the codespace is ready, a port-forwarding prompt will appear at the bottom-right — pick port `8080` and click **Open in Browser** to open `http://localhost:8080` for live preview.
5. Edit any file under `src/`; Eleventy will rebuild automatically and the browser will refresh — true WYSIWYG.
6. When you're done, commit, push, and open a PR straight from the Source Control panel on the left — exactly like local development.

> 💡 Each GitHub account gets a free monthly Codespace allowance (the 2-core machine type). That's plenty for writing articles and tweaking styles. If you need more horsepower, pick a 4-core (or[...]

## 💻 Local Development

Follow these steps to run the dev server locally:

1. **Clone the repository**

   ```bash
   git clone https://github.com/hjx-25pc1/hjx-25pc1.github.io.git
   cd hjx-25pc1.github.io
   ```

2. **Install dependencies**

   ```bash
   npm install
   ```

3. **Start the dev server** (default URL: <http://localhost:8080>, with hot reload)

   ```bash
   npm run serve
   ```

4. **Build once** (without starting a server; output is written to `_site/`)

   ```bash
   npm run build
   ```

5. **Watch files and rebuild on change** (without a local server)

   ```bash
   npm run watch
   ```

6. **Sync the knowledge base to the Wiki repository** (requires push permission)

   ```bash
   npm run sync:wiki
   ```

7. **Package a release** (writes `<name>-<version>-<date>-<short>.zip` into `dist/`)

   ```bash
   npm run release                # reads the version from package.json
   npm run release -- 1.2.3       # override the version explicitly
   ```

8. **Bump the version** in `package.json` (and `package-lock.json`)

   ```bash
   npm run bump -- patch          # 1.2.3 → 1.2.4
   npm run bump -- minor          # 1.2.3 → 1.3.0
   npm run bump -- major          # 1.2.3 → 2.0.0
   npm run bump -- 1.2.3          # set explicitly
   ```

9. **Regenerate the contributors avatar wall** (same effect as the `Generate contributors image` workflow)

   ```bash
   npm run generate:contributors
   ```

## 🐛 Feedback & Suggestions

This repository ships with **5 Issue templates** — pick the one that fits your case:

| Template            | Purpose                                                              |
| ------------------- | -------------------------------------------------------------------- |
| `bug-report`        | Report broken functionality, display glitches, dead links             |
| `feature-request`   | Suggest new features or content sections                             |
| `documentation`     | Suggest improvements to the documentation                            |
| `performance`       | Report performance issues                                            |
| `task`              | Track internal tasks and assignments (maintainers only)              |

> Please search existing Issues before opening a new one. The full workflow is in [CONTRIBUTING.md](CONTRIBUTING.md).

## 🚀 Deployment

This project is automatically deployed to **GitHub Pages** via **GitHub Actions**:

- **Trigger**: Pushes to the `main` branch that modify `src/**`, `.eleventy.js`, `package.json`, `package-lock.json`, `README.md`, or `docs/README_zh-cn.md`
- **Build environment**: Latest Ubuntu + Node.js 24
- **Pipeline**: `npm ci` → `npm run build` → upload `_site/` artifact → deploy to the `github-pages` environment
- **Concurrency**: Only one deployment runs at a time; queued runs in between are skipped
- **Live URL**: <https://hjx-25pc1.github.io>

To trigger a deployment manually, go to the repository's **Actions** tab, select the `Deploy static content to Pages` workflow, and click **Run workflow**.

## 👥 Contributors

<!-- CONTRIBUTORS START -->
<a href="https://github.com/mantoujun12" title="mantoujun12"><img src="https://avatars.githubusercontent.com/u/202384594?v=4" width="80" alt="mantoujun12"/></a>
<a href="https://github.com/zswcft34567890" title="zswcft34567890"><img src="https://avatars.githubusercontent.com/u/300807762?v=4" width="80" alt="zswcft34567890"/></a>
<a href="https://github.com/mantoujun6" title="mantoujun6"><img src="https://avatars.githubusercontent.com/u/91870686?v=4" width="80" alt="mantoujun6"/></a>
<!-- CONTRIBUTORS END -->

## 👋 Contributing

Welcome to contributing to this project! Please read [CONTRIBUTING.md](CONTRIBUTING.md) before submitting.

A short version of the workflow:

1. Fork this repository
2. Create a feature branch (`git checkout -b feature/your-feature`)
3. Commit your changes (`git commit -m "Add some feature"`)
4. Push to your branch (`git push origin feature/your-feature`)
5. Open a Pull Request

### 📚 Project Documentation

- 📖 [Contributing Guide](CONTRIBUTING.md) — How to participate
- 🛡️ [Security Policy](SECURITY.md) — Report a vulnerability
- 💬 [Support](SUPPORT.md) — Get help and ask questions
- 📜 [Code of Conduct](CODE_OF_CONDUCT.md) — Community guidelines

> 💡 Chinese versions are available under [`docs/`](docs/).

## 🛠️ Documentation Maintenance Workflow

Documentation in this repository follows a **Chinese-first → translate to English** workflow:

- [`docs/README_zh-cn.md`](docs/README_zh-cn.md) is the **primary source of truth**. Write and update it in Chinese first.
- Then translate the changes into English in this file ([README.md](README.md)).
- The same rule applies to [`docs/CONTRIBUTING_zh-cn.md`](docs/CONTRIBUTING_zh-cn.md) (Chinese primary) and [CONTRIBUTING.md](CONTRIBUTING.md) (English translation).
- When submitting changes, please update the Chinese version first, then sync the English translation, to keep both versions semantically consistent.

---

## ⭐ Star History

<a href="https://www.star-history.com/?repos=hjx-25pc1%2Fhjx-25pc1.github.io&type=date&legend=top-left">
 <picture>
   <source media="(prefers-color-scheme: dark)" srcset="https://api.star-history.com/chart?repos=hjx-25pc1/hjx-25pc1.github.io&type=date&theme=dark&legend=top-left&sealed_token=1uUsgyjqwNyC4JYWSO[...]">
   <source media="(prefers-color-scheme: light)" srcset="https://api.star-history.com/chart?repos=hjx-25pc1/hjx-25pc1.github.io&type=date&legend=top-left&sealed_token=1uUsgyjqwNyC4JYWSO1BAP1lC6rG[...]">
   <img alt="Star History Chart" src="https://api.star-history.com/chart?repos=hjx-25pc1/hjx-25pc1.github.io&type=date&legend=top-left&sealed_token=1uUsgyjqwNyC4JYWSO1BAP1lC6rGqjaptq0hEm43RiPnW3K[...]">
 </picture>
</a>

## 📑 License

This project is open source under the [MIT License](LICENSE).

> Some content generated by AI. (Project information, code...)
