---
title: Getting Started
description: New to the class website? Here's how to contribute content
layout: layouts/wiki
permalink: /wiki/getting-started/
order: 1
---

# Getting Started

Welcome aboard! This guide shows how to contribute to the class website.

## How to contribute an article

1. Fork the repository to your GitHub account
2. Clone locally: `git clone https://github.com/<your-username>/hjx-25pc1.github.io.git`
3. Create a branch: `git checkout -b add-event-<date>`
4. Create a file under `src/event-<date>.md`; use lowercase letters, numbers, and hyphens in the filename
5. Edit the content. Add frontmatter at the top with title, description, layout, permalink, order, etc.
6. Run a local build check: after `npm install`, run `npm run dev`
7. Commit changes: `git add .` / `git commit -m "Add event <date>"` / `git push origin add-event-<date>`
8. Open a PR on GitHub with a clear title and description of your changes
9. Wait for review. After approval, it will deploy automatically

## How to contribute to the Wiki

Similar to writing an article, just create or edit a `.md` file under `src/wiki/`.
- Before adding a page, check if a similar topic already exists
- Use lowercase letters and hyphens in filenames for easier management and linking
- Wiki pages should include a complete title, description, and clear paragraph structure
- When editing others' content, explain the reason and scope in the PR description

## Notes

- Add a space between Chinese and English text
- Use triple backticks for code blocks
- Upload images to `src/assets/images/` and use relative paths in Markdown
- Validate with a local build before submitting to ensure no errors
- Keep text concise, structured, and avoid repetition
- If unsure about formatting, refer to existing articles and wiki page templates
