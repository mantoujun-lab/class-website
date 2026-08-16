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

## Vercel Analytics & Speed Insights

This project integrates Vercel's Web Analytics and Speed Insights for monitoring visitor data and performance metrics:

- **Web Analytics**: Tracks page views and custom events
- **Speed Insights**: Collects real user performance metrics (LCP, FCP, CLS, etc.)

### Implementation

The project uses a pure static injection approach, dynamically loading Vercel-provided edge functions at the end of `src/script/main.js`:

```javascript
// Dynamically injects /_vercel/insights/script.js
// Dynamically injects /_vercel/speed-insights/script.js
```

These scripts are automatically provided by the Vercel platform after deployment and asynchronously collect and report data after the page loads.

### Local Development

The local development server (localhost / 127.0.0.1) does not load these scripts to avoid 404 errors. Analytics and Speed Insights only activate in the production environment after Vercel deployment.

### Viewing Data

After successful deployment, you can view real-time data and historical reports in the **Analytics** and **Speed Insights** tabs of the Vercel dashboard.

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
  2. Replace content between the `<!-- CONTRIBUTORS START/END -->` placeholders in `README.md` / `src/zh-cn/index.md` / `src/en/index.md`
  3. Auto-commit and push to `main`
- **Local debugging**: you can use the `ALLOW_FALLBACK=1` environment variable to run with placeholder data

```bash
GITHUB_REPOSITORY=mantoujun-lab/class-website \
ALLOW_FALLBACK=1 \
npm run generate:contributors
```

> **Tip**: The placeholders `<!-- CONTRIBUTORS START -->` and `<!-- CONTRIBUTORS END -->` must be kept, otherwise the Action can't find the replacement location and will skip that file.
