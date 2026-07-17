---
title: Coding Style
description: Code style conventions for the class website
layout: layouts/wiki
permalink: /wiki/coding-style/
order: 2
---

# Coding Style

> A hobby project — aim for "easy to read, easy to maintain". No need to over-engineer.

## Styles

- SCSS files go in `src/style/`, with underscore prefix for partials
- Variables centralized in `_variables.scss`, mixins in `_mixins.scss`
- Minified output with Autoprefixer enabled

## Scripts

- Native ES Modules, no bundler
- Prefer `const` / `let`, **never use `var` in business code**
- Strings in single quotes; indent with 4 spaces; comments in English
- Split granularity: pure utilities → `initXxx(deps)` functions
- Full conventions in `.trae/rules/js.md`

## Markdown

- Add a space between Chinese and English
- Use GFM syntax

## HTML

- Prefer semantic tags when possible (`<header>` / `<nav>` / `<main>` etc.)
- Always add an `alt` to images — if you don't know what to write, leave it empty but don't forget it
- Write link text clearly — don't use "click here"

## Naming

- File names use hyphens: `class-photo.scss`
- JS variables and functions use camelCase
- CSS class names just need to look consistent — no need to strictly follow BEM

## Git

- Commit messages should clearly describe what was changed, e.g. "Fix homepage carousel misalignment"
- One commit per change, don't bundle a bunch together
- Don't write nonsense commits like "my mom has been dead!" 😇
