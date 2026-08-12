<div align="center">

![class-website](https://socialify.git.ci/mantoujun-lab/class-website/image?custom_language=HTML&font=Inter&language=1&name=1&pattern=Solid&theme=Auto)

[![Vercel](https://img.shields.io/badge/Vercel-000000?style=for-the-badge&logo=vercel&logoColor=white)](https://vercel.com)
[![License](https://img.shields.io/github/license/mantoujun-lab/class-website?style=for-the-badge)](https://github.com/mantoujun-lab/class-website/blob/main/LICENSE)
[![Eleventy](https://img.shields.io/badge/Eleventy-000000?style=for-the-badge&logo=eleventy&logoColor=white)](https://www.11ty.dev)
[![Nunjucks](https://img.shields.io/badge/nunjucks-green?logo=nunjucks&style=for-the-badge)](https://mozilla.github.io/nunjucks/)
[![SCSS](https://img.shields.io/badge/SCSS-CC6699?style=for-the-badge&logo=sass&logoColor=white)](https://sass-lang.com/)
[![JavaScript](https://img.shields.io/badge/JavaScript-black?style=for-the-badge&logo=javascript)](https://developer.mozilla.org/en-US/docs/Web/JavaScript)

</div>

## 🔭 Overview

This repository hosts the source code of the official class website for **Class 1, Computer Application, Grade 2025**. It is used to showcase the class, share learning materials, document everyday moments, and serves as a practice project for students learning web development.

The site is organized into three main content sections — **Events / Articles / Wiki** — plus a handful of "Zone" entry points (discussion, study, activities, etc.).

- **Author**: mantoujun-lab
- **License**: MIT
- **Live Site**: Deployed on Vercel (domain assigned after connecting the repository)
- **Repository**: <https://github.com/mantoujun-lab/class-website>

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
  - Directory data files (`*.11tydata.js` / `*.json`) — Auto-inject locale and permalink prefix for `src/zh-cn/` and `src/en/`
  - Custom filters: `i18n` (translate), `localUrl` (locale-aware URL), `switchLang` (language switch URL), `lang` (current language code)
- **Vanilla JavaScript (ES Modules)** — A small amount of client-side interaction; scripts are organized as native ES modules under `src/script/` with no front-end framework or bundler dependency
- **[@vercel/analytics](https://vercel.com/docs/analytics) & [@vercel/speed-insights](https://vercel.com/docs/speed-insights)** — Visitor analytics and real-user performance monitoring, dynamically injected via `src/script/main.js`
- **GitHub Actions** — Automated CI/CD
- **Vercel** — Static site hosting platform

## 🖥️ Development Requirements

Before you start, make sure the following tools are installed locally:

| Tool | Version | Description |
| --- | --- | --- |
| **Node.js** | 24.x (LTS; the latest LTS is recommended) | Runtime and package management |
| **npm** | 11.x or newer (installed with Node.js) | Dependency management and script execution |
| **Git** | Latest stable | Version control and commits |

## 💻 Local Development

Follow these steps to run the dev server locally:

1. **Clone the repository**

   ```bash
   git clone https://github.com/mantoujun-lab/class-website.git
   cd class-website
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
> This command uses the **bump-version.js** script.

9. **Regenerate the contributors avatar wall** (same effect as the `Generate contributors image` workflow)

   ```bash
   npm run generate:contributors
   ```

## 🐛 Feedback & Suggestions

This repository ships with **5 Issue templates** — pick the one that fits your case:

| Template            | Purpose                                                              |
| ------------------- | -------------------------------------------------------------------- |
| `bug-report`        | Report broken functionality, display glitches, dead links             |

## 🚀 Deployment

This project is configured for deployment on **Vercel**:

### Configuration

The `vercel.json` at the project root contains the complete deployment configuration:

- **Build Command**: `npm run build`
- **Output Directory**: `_site`
- **Clean URLs**: Enabled (`cleanUrls: true`)
- **Trailing Slash**: Enabled (`trailingSlash: true`)
- **Rewrites**: Supports clean URL routing generated by Eleventy

### Automatic Deployment

Pushing to the `main` branch automatically triggers a Vercel deployment. After successful deployment, you can view the assigned domain in the Vercel dashboard.

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

---

## 📑 License

This project is open source under the [MIT License](LICENSE).

> Some content generated by AI. (Project information, code...)
