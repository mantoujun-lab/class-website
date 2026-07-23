---
title: Deployment Guide
description: How to deploy the class website
layout: layouts/wiki
permalink: /wiki/deployment/
order: 3
---

# Deployment Guide

## Vercel Automatic Deployment

This project is configured for automatic deployment on Vercel:

1. Connect the repository to Vercel
2. Pushing to the `main` branch triggers automatic deployment
3. Vercel runs `npm run build` and deploys the `_site/` directory
4. A domain is automatically assigned after successful deployment

## Configuration

The `vercel.json` at the project root includes the following configuration:

- **Build command**: `npm run build`
- **Output directory**: `_site`
- **Clean URLs**: Enabled (`cleanUrls: true`)
- **Trailing Slash**: Enabled (`trailingSlash: true`)
- **Rewrites**: All paths rewrite to `/$1/index.html`, supporting SPA-style routing

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
- **Local debugging**: you can use the `ALLOW_FALLBACK=1` environment variable to run with placeholder data

```bash
GITHUB_REPOSITORY=mantoujun-lab/class-website \
ALLOW_FALLBACK=1 \
npm run generate:contributors
```

> **Tip**: The placeholders `<!-- CONTRIBUTORS START -->` and `<!-- CONTRIBUTORS END -->` must be kept, otherwise the Action can't find the replacement location and will skip that file.
