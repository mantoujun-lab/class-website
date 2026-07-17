---
title: Writing Guide
description: How to write Wiki entries
layout: layouts/wiki
permalink: /wiki/guide/writing-guide/
order: 1
wikiCategory: 📝 Getting Started
wikiCategoryOrder: 1
---

# Writing Guide

Wiki entry writing conventions:

- Use clear, hierarchical headings
- Add a space between Chinese and English
- Specify the language for code blocks

## Using Macros in Markdown

Wiki / Article pages are `.md` files. Eleventy is configured with `markdownTemplateEngine: "njk"` — i.e. Nunjucks renders macros **first**, then hands off to markdown-it. However, markdown-it's attribute sanitizer treats `style` / `data-*` attributes on `<a>` as "dangerous", which causes **button calls with custom colors to be escaped entirely**, producing output like `<p>&lt;a ...&gt;`.

### Recommended: Wrap Each Colored Button in Its Own `<div>`

When calling the button macro with color parameters like `btnColor` / `textColor` / `btnHover` / `btnBorder` / `btnBorderHover` in a `.md` file, **wrap it in an independent `<div>...</div>`**. Markdown-it recognizes `<div>` as a CommonMark HTML block Type 7 — the whole block is kept as-is without invoking inline rules, thereby bypassing the attribute sanitizer.

**One `<div>` per colored button** — testing shows that when two colored buttons are placed consecutively in the same `<div>`, the second one gets escaped (the html_block state doesn't fully cover multi-element scenarios).

### Comparison of Writing Styles

Each style below comes with an example — copy as needed.

#### ✅ Recommended: Independent `<div>`

Custom background only:

{% raw %}
```html
<div>
{{ button("fa-solid fa-arrow-right", "Learn More", "/about/", btnColor="rgba(200, 255, 200)") }}
</div>
```
{% endraw %}

#### ❌ Wrong: Calling a Colored Button Directly

Without wrapping in a div or any existing container, the `style` attribute will be escaped by the attribute sanitizer:

{% raw %}
```html
<!-- This produces output with &lt;a class=&quot;...&gt; -->
{{ button("fa-solid fa-palette", "Themed Button", "/", btnColor="#222831", textColor="#ffd369") }}
```
{% endraw %}

#### ❌ Wrong: Multiple Colored Buttons in the Same `<div>`

{% raw %}
```html
<!-- ❌ The second button gets escaped -->
<div>
{{ button("fa-icon-a", "Button 1", "#", btnColor="#fff5f5") }}
{{ button("fa-icon-b", "Button 2", "#", btnColor="#ffe7e7") }}
</div>
```
{% endraw %}

The correct approach is to **give each button its own `<div>`**:

{% raw %}
```html
<!-- ✅ -->
<div>
{{ button("fa-icon-a", "Button 1", "#", btnColor="#fff5f5") }}
</div>
<div>
{{ button("fa-icon-b", "Button 2", "#", btnColor="#ffe7e7") }}
</div>
```
{% endraw %}

#### ❌ Wrong: Wrapping Macro Calls in a `raw` Block

Nunjucks' `raw` block (wrapped with `raw` / `endraw` tags) outputs its content as literal text, so macros won't be expanded. As a result, there's no escaping issue (because it's never parsed), but **there are no buttons either** (because the macro wasn't expanded). **You can't use `raw` blocks to solve this escaping issue.**

#### ✅ Derived Rule: Place Inside an Existing `<div class="cardzone-three-columns">`

If the button call is already inside a container like `<div class="cardzone-three-columns">` with `.three-column-card` (the container itself is a valid HTML block), **the outer layer already naturally shields the inner `<a>` — no need to manually wrap in a div**:

{% raw %}
```html
<div class="cardzone-three-columns">
{{ card("Study Resources", "Some commonly used study resources", "/zone/study/", "Go", bgColor="#fff5f5") }}
{{ card("Events", "Some class events", "/event/", "Enter", bgColor="#e7f5ff") }}
</div>
```
{% endraw %}

### Simple Buttons Without Color Parameters

Button calls without any color overrides don't need a `<div>` wrapper — the output `<a>` only has `class` and `href`, both within markdown-it's whitelist, so they won't be escaped:

{% raw %}
```html
{{ button("fa-solid fa-play", "Get Started", "/") }}
```
{% endraw %}

### Card Macros (card / cardFull / cardStandalone)

When `card` / `cardFull` / `cardStandalone` are passed color parameters like `bgColor` / `textColor` / `borderColor` / `hoverBgColor` / `hoverBorderColor` / `btnColor` / `btnTextColor`, they output a `<div>` with `style="--card-bg:..."`, which is also affected by markdown-it's attribute sanitizer. The handling is the same as for the button macro:

- If the call site is already inside `<div class="cardzone-three-columns">` → no extra handling needed
- Otherwise, wrap in a single `<div>`

### Live Demo

For a complete runnable demo, see the "Custom Colors" section of [Markdown & Component Showcase](/article/markdown-showcase/) to see the actual rendered result with only one colored button per div.
