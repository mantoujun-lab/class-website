# Contributing Guide

First of all, thank you for your interest in contributing to this project! Whether you're reporting bugs, suggesting features, improving the code, or polishing the docs and translations, every contribution helps make this class website a little better. (•̀ᴗ•́)و

This guide will walk you through how to get involved. Please give it a full read before submitting any contribution.

> 🌐 [简体中文](docs/CONTRIBUTING_zh-cn.md)

---

## Table of Contents

- [Code of Conduct](#code-of-conduct)
- [How Can I Contribute?](#how-can-i-contribute)
- [Submitting an Issue](#submitting-an-issue)
    - [Bug Reports](#bug-reports)
    - [Feature Requests](#feature-requests)
    - [Documentation Improvements](#documentation-improvements)
    - [Performance Issues](#performance-issues)
    - [Task Tracking](#task-tracking)
- [Submitting a Pull Request](#submitting-a-pull-request)
- [Developing in GitHub Codespaces](#developing-in-github-codespaces)
- [Local Development Setup](#local-development-setup)
- [Coding Conventions](#coding-conventions)
- [Commit Conventions](#commit-conventions)
- [Deployment Notes](#deployment-notes)
- [License](#license)

---

## Code of Conduct

All participants are expected to follow these basic guidelines:

- Be friendly and inclusive; respect every contributor and classmate.
- Critique ideas, not people; keep discussions rational.
- No discrimination, harassment, or aggressive language in any form.
- Follow the maintainers' and the community's consensus; avoid endless debate.

See [CODE_OF_CONDUCT.md](CODE_OF_CONDUCT.md) for the full code of conduct.

Issues / PRs that violate the Code of Conduct may be closed, and the associated accounts may be restricted from participating.

---

## How Can I Contribute?

You don't have to write code! You can:

- Report bugs or suggest features (via Issues)
- Improve copy, documentation, and translations
- Polish page layout, styling, and interactions
- Add class materials, photos, or activity records
- Review other people's PRs and give feedback
- Help answer questions from others in the community

---

## Submitting an Issue

Before opening an Issue, please **search existing Issues** to avoid duplicates.

This repo provides five Issue templates:

| Template            | Purpose                                                              |
| ------------------- | -------------------------------------------------------------------- |
| `bug-report`        | Report broken functionality, display glitches, dead links             |
| `feature-request`   | Suggest new features or content sections                             |
| `documentation`     | Suggest improvements to the documentation                            |
| `performance`       | Report performance issues                                            |
| `task`              | Track internal tasks and assignments (maintainers only)              |

Please fill out the matching template. Incomplete submissions may be asked for additional information.

### Bug Reports

Please include as much of the following as possible:

- A brief description of the problem
- Reproduction steps (how to trigger the bug)
- Expected behavior vs. actual behavior
- Browser and operating system versions
- Screenshots or screen recordings (if available)
- Any console errors (screenshots welcome)

### Feature Requests

Please try to cover:

- The problem or scenario you want to solve
- The expected outcome
- Possible alternatives or reference pages
- Whether you're willing to implement it yourself

### Documentation Improvements

Please try to cover:

- The location of the document (file path or URL)
- The current issue (what's unclear, wrong, or missing)
- Your suggested change or a draft
- (Optional) screenshots or reference material

### Performance Issues

Please try to provide:

- The symptom (which page, which metric, what scenario)
- The affected page
- Lighthouse / WebPageTest metrics (LCP / FCP / TBT / CLS, etc.)
- The test environment (device, network, browser, region)
- Target metrics or optimization direction

### Task Tracking

> ⚠️ Maintainers only.

Please include as much of the following as possible:

- Background and goal
- Acceptance Criteria (as a checklist)
- Priority (P0 / P1 / P2 / P3)
- Effort estimate (XS / S / M / L / XL)
- Linked Milestone (optional)
- Sub-task breakdown

---

## Submitting a Pull Request

### Basic Workflow

1. **Fork** this repository to your own account.
2. Create a new feature branch off of `main`:
   ```bash
   git checkout main
   git pull upstream main
   git checkout -b feat/your-feature-name
   ```
   Suggested branch naming:
   - `feat/xxx` — new feature
   - `fix/xxx` — bug fix
   - `docs/xxx` — documentation change
   - `style/xxx` — style tweaks
   - `refactor/xxx` — refactoring
   - `chore/xxx` — build / toolchain changes
3. Make your changes locally, and **make sure the build passes**:
   ```bash
   npm run build
   ```
4. Self-check before committing:
   - Pages render correctly across screen widths
   - All external resources use HTTPS
   - No leftover debug code or `console.log`
5. Push to your fork:
   ```bash
   git push origin feat/your-feature-name
   ```
6. Open a Pull Request on GitHub, **targeting the `main` branch**.
7. Wait for CI checks and maintainer review.

### PR Notes

- Keep each PR focused on a single concern; avoid huge PRs.
- If your PR fixes an Issue, link it with `Fixes #123` or `Closes #123` in the description.
- For UI / style changes, please attach **before / after** screenshots.
- Maintainers may ask for revisions; please stay patient and open-minded.

---

## Developing in GitHub Codespaces

Don't want to install Node.js locally? No problem — this repo ships with a Codespace devcontainer that gives you a full environment straight from your browser:

1. Open <https://github.com/hjx-25pc1/hjx-25pc1.github.io> and click the green **Code** button.
2. Switch to the **Codespaces** tab → click **Create codespace on main**.
3. On first launch, `npm ci` will run automatically to install dependencies, and `npm run serve` will start in the background.
4. Once the codespace is ready, a port-forwarding prompt will appear at the bottom-right — pick port `8080` and click **Open in Browser** to open `http://localhost:8080` for live preview.
5. Edit any file under `src/`; Eleventy will rebuild automatically and the browser will refresh — true WYSIWYG.
6. When you're done, commit, push, and open a PR straight from the Source Control panel on the left — exactly like local development.

> 💡 Each GitHub account gets a free monthly Codespace allowance (the 2-core machine type). That's plenty for writing articles and tweaking styles. If you see "Your codespace exceeds its usage limits", stop any codespaces you aren't using or wait for the quota to reset.

---

## Local Development Setup

### Requirements

- Node.js 24.x (current LTS)
- npm 11.x or newer (installed together with Node.js)
- Git

> 💡 Recommend using [nvm](https://github.com/nvm-sh/nvm) (or [nvm-windows](https://github.com/coreybutler/nvm-windows) on Windows) to manage Node.js versions.

### Clone and Install

```bash
git clone https://github.com/hjx-25pc1/hjx-25pc1.github.io.git
cd hjx-25pc1.github.io
npm install
```

### Common Commands

| Command                        | Description                                                              |
| ------------------------------ | ------------------------------------------------------------------------ |
| `npm run serve`                | Start the local dev server with hot reload                               |
| `npm run build`                | Build the production bundle into `_site/`                                |
| `npm run watch`                | Watch files and rebuild without starting a server                        |
| `npm run sync:wiki`            | Sync entries under `src/wiki/` to the GitHub Wiki repo                   |
| `npm run release`              | Build `_site/` and package it as a zip into `dist/`                      |
| `npm run bump`                 | Bump the `version` field in `package.json` / `package-lock.json`        |
| `npm run generate:contributors` | Regenerate the contributors avatar wall in the READMEs (same effect as the `Generate contributors image` workflow) |

Once the dev server is running, the terminal will print the local URL (usually `http://localhost:8080`). Open it in your browser to preview.

### Cutting a Release

The repo ships with an automated release workflow (see `.github/workflows/release.yml`):

1. Bump `version` in `package.json` to the target version (e.g. `1.2.3`).
2. Commit and push to `main`.
3. Tag and push the release:

   ```bash
   git tag v1.2.3
   git push origin v1.2.3
   ```

4. GitHub Actions will build the site and publish the zip on the Releases page.

To dry-run a release locally, run `npm run release`. A zip is written to `dist/` with the same naming scheme for inspection before tagging.

### Bumping the Version

`npm run bump` rewrites the `version` field in `package.json` (and `package-lock.json` when present). It accepts a SemVer upgrade level or an explicit target version:

```bash
npm run bump -- patch          # 1.2.3 → 1.2.4
npm run bump -- minor          # 1.2.3 → 1.3.0
npm run bump -- major          # 1.2.3 → 2.0.0
npm run bump -- 1.3.0          # set a specific version
npm run bump -- 1.3.0-rc.1     # pre-release identifier is supported
```

By default, `npm run bump` will:

1. Rewrite `version` in both `package.json` and `package-lock.json`.
2. `git add` and `git commit` the change with the message `chore(release): bump to <new>`.
3. **Not** push, **not** tag — those are left to the release workflow above.

Use `--no-commit` to skip the git commit step (handy when chaining into other scripts):

```bash
npm run bump -- patch --no-commit
```

A typical release + bump cycle looks like:

```bash
# 1. Cut the release
git tag v1.2.3
git push origin v1.2.3
# → release.yml builds the zip and publishes to GitHub Releases

# 2. Prepare for the next iteration
npm run bump -- patch
git push origin main
# → main now reflects the upcoming 1.2.4 version
```

### Deployment Path Prefix

The site is deployed at the GitHub Pages root path (`/`), so please use Eleventy's `| url` filter when referencing assets in templates:

```njk
<link rel="stylesheet" href="{{ '/style/style.css' | url }}">
<a href="{{ '/about/' | url }}">About</a>
```

Avoid hard-coding the root path `/`; otherwise styles and links will break during local preview.

---

## Coding Conventions

To keep the codebase consistent, please follow these conventions:

### Styles

- Styles are split into multiple `.scss` files by responsibility, all maintained under `src/style/`.
- Shared variables live in `_variables.scss`, shared mixins in `_mixins.scss`. Add new modules as their own `.scss` files.
- The build entry (`.eleventy.js`) automatically picks up every non-underscore-prefixed `.scss` file under `src/style/` and compiles each to a minified CSS file.
- Avoid inline styles in templates unless absolutely necessary.

### Scripts

- Front-end scripts are organized as **native ES Modules** under `src/script/`, split by domain (e.g. `_dom`, `focus-trap`, `history-stack`, `popup`, `drawer`, `main`). No bundler is required.
- The entry `main.js` imports other modules via `import`. HTML templates **must** load it with `<script type="module" src="{{ '/script/main.js' | url }}">`, otherwise module imports will fail.
- When adding new scripts, follow the same granularity: pure utilities live in their own files; business modules are exposed as `initXxx(deps)` and orchestrated from `main.js` with dependencies injected at the entry point.
- Prefer `var` over `const` / `let` (for compatibility) unless you genuinely need block scope.
- Do not use inline scripts (e.g. `onclick="..."`) — they open the door to XSS.

### HTML

- Files must be valid HTML5, starting with `<!DOCTYPE html>`.
- Declare `lang="zh-CN"` on the `<html>` tag.
- Include `<meta charset="UTF-8">` and the viewport meta tag:
  ```html
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  ```
- Use **4 spaces** for indentation, not tabs.

### Spacing Between Chinese and English

Add a single space between Chinese and English content, e.g.:

```markdown
本项目使用 Eleventy 构建，并部署在 GitHub Pages。
```

(This rule applies to any Chinese / English mix in the repo.)

### Security

- Never commit sensitive information (API keys, passwords, tokens, etc.) to the repo.
- Don't handle user input with inline scripts — protect against XSS.
- Always use HTTPS for external resources.

---

## Commit Conventions

- Commit messages may be written in **English or Chinese**, and should briefly describe the change.
- The Conventional Commits style is suggested but not required:

  ```
  feat: add new photo gallery section
  fix: correct broken navigation link on mobile
  docs: update contributing guide
  style: improve header layout on small screens
  refactor: extract card component into partial
  chore: bump eleventy to v3
  ```

- Keep each Commit focused on a single thing — easier to review and revert.

---

## Deployment Notes

- Only pushes to the `main` branch trigger deployment.
- GitHub Actions builds the project and publishes the `_site/` directory to GitHub Pages.
- In-flight deployments are not cancelled; queued intermediate deployments are skipped.
- **Do not** edit anything inside `_site/` directly — it will be overwritten on every build.
- Discuss CI changes with the maintainers in an Issue first.

After a successful deployment, the site is available at [https://hjx-25pc1.github.io](https://hjx-25pc1.github.io).

---

## Becoming a Contributor

Once your PR is merged, feel free to add yourself to `CONTRIBUTORS.md`:

```markdown
## Contributors

- **your-github-username** — short note on what you contributed
```

You can also ask the maintainers to add you in the PR.

---

## Contact

- Open an Issue: [GitHub Issues](https://github.com/hjx-25pc1/hjx-25pc1.github.io/issues)
- Maintainers: [mantoujun12](https://github.com/mantoujun12) / [mantoujun6](https://github.com/mantoujun6).

---

## Documentation Maintenance Workflow

This repository follows a **Chinese-first → translate to English** workflow for documentation:

- [`docs/CONTRIBUTING_zh-cn.md`](docs/CONTRIBUTING_zh-cn.md) is the **primary source of truth**. All additions and edits should be made in Chinese first.
- Then translate the changes into English in this file ([CONTRIBUTING.md](CONTRIBUTING.md)).
- The same rule applies to [`docs/README_zh-cn.md`](docs/README_zh-cn.md) (Chinese primary) and [README.md](README.md) (English translation).
- When opening a PR, please update the Chinese version first and sync the English translation afterward, to avoid semantic drift between the two.

---

## License

This project is licensed under the [MIT License](./LICENSE). By submitting a contribution, you agree to license your code and documentation under the same terms.
