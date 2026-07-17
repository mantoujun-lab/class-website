---
title: Deployment Guide
description: How to deploy the class website
layout: layouts/wiki
permalink: /wiki/deployment/
order: 3
---

# Deployment Guide

## Automatic Deployment

Pushing to the `main` branch triggers GitHub Actions:

1. `npm ci` installs dependencies
2. `npm run build` builds the site
3. Uploads the `_site/` artifact
4. Deploys to GitHub Pages

## Manual Deployment

On the GitHub Actions page, select `Deploy static content to Pages` and click `Run workflow`.

## Deployment Path Prefix

Since the site is deployed at the root path `/`, all asset references must use the `| url` filter:

```njk
<link rel="stylesheet" href="{{ '/style/base.css' | url }}">
```

## Contributors Wall

The `Generate contributors image` workflow (`.github/workflows/contributors.yml`) automatically maintains the "Contributors" section on `main`:

- **Trigger**: Manually run the workflow from the Actions page
- **Workflow**:
  1. Call the GitHub API to fetch the contributor list
  2. Replace content between the `<!-- CONTRIBUTORS START/END -->` placeholders in `README.md` / `docs/README_zh-cn.md` / `src/index.md`
  3. Auto-commit and push to `main`
- **Linked deployment**: `static.yml`'s `push.paths` already includes `README.md` and `docs/README_zh-cn.md`, so when the README is modified, the deployment workflow runs again automatically — keeping the avatar wall on the website and README in sync
- **Local debugging**: you can use the `ALLOW_FALLBACK=1` environment variable to run with placeholder data

```bash
GITHUB_REPOSITORY=hjx-25pc1/hjx-25pc1.github.io \
ALLOW_FALLBACK=1 \
npm run generate:contributors
```

> **Tip**: The placeholders `<!-- CONTRIBUTORS START -->` and `<!-- CONTRIBUTORS END -->` must be kept, otherwise the Action can't find the replacement location and will skip that file.
