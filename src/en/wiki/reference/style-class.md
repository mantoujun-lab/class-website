---
title: Style Class List
description: A summary of all style classes defined in SCSS files under src/style, categorized by module for developer reference
layout: layouts/wiki
permalink: /wiki/reference/style-class/
order: 2
wikiCategory: 📚 Reference
wikiCategoryOrder: 2
---

This page summarizes all CSS classes defined in SCSS files under `src/style/`, categorized by functional module. All classes can be used directly in any Nunjucks template or Markdown document.

> **Notes**
> - `@mixin` definitions in SCSS source files are only for source reuse and won't compile into standalone CSS classes, so they're not listed in the table below.
> - Some classes only take effect at specific responsive breakpoints (`≤768px` tablet, `≤480px` mobile), as noted in the comments.

---

## 1. Base Styles (base.scss)

| Class | Purpose | Notes |
|---|---|---|
| `.hover-show` | Show text on hover (with width-scaling animation) | Desktop default `max-width: 0` + `opacity: 0`, expands to `200px` when parent is hovered; always visible on mobile |

> `html` / `body` / `a` / `i` are tag selectors without separately defined classes.

---

## 2. Buttons (buttons.scss)

Pill buttons (design ref: Button - Content Area), primary-color solid buttons.

| Class | Purpose | Notes |
|---|---|---|
| `.btn-pill` | Pill button container (primary background + shadow + rounded corners) | Used as `<a>` or `<button>` |
| `.btn-pill-icon` | Left-side icon inside the button | Pairs with Font Awesome and similar icon libraries |
| `.btn-pill-label` | Text inside the button | Doesn't wrap by default |

**Typical Usage**

```html
<a class="btn-pill">
    <i class="fa-solid fa-play btn-pill-icon"></i>
    <span class="btn-pill-label">Button</span>
</a>
```

**Custom Colors (Macro Parameters)**

When calling the button macro `macros/button.njk`, the following optional parameters can override the default colors:

| Parameter | Purpose | Default |
|---|---|---|
| `btnColor` | Button background color | `var(--color-primary)` |
| `textColor` | Button text color | `var(--color-white)` |
| `btnHover` | Background color on hover | If unset, same as `btnColor`; pass `var(--color-primary-dark)` to use the dark variant |
| `btnBorder` | Border color | `var(--border-color-blue)` |
| `btnBorderHover` | Border color on hover | Falls back to `btnBorder`, then to `var(--border-color-blue)` |

When any parameter is omitted, the corresponding inline style won't be generated on the rendered `<a>`, and CSS falls back to `.btn-pill` defaults.

```jinja2
{% from "macros/button.njk" import button %}
{{ button("fa-solid fa-arrow-right", "Learn More", "/about/", btnColor="rgba(200, 255, 200)") }}
{{ button("fa-solid fa-pen", "Edit", "#", btnColor="#fff0f0", btnBorder="#e03131") }}
```

---

## 3. Cards (cards.scss)

Unified card baseline: `hover-lift` hover effect, `$radius-md` rounded corners, frosted glass background + light border + shadow.

### 3.1 Common Internal Card Structure

All card layouts can reuse the following three internal element classes.

| Class | Purpose | Notes |
|---|---|---|
| `.card-title` | Card title | Bold, follows theme text color |
| `.card-content` | Card body / description | Secondary text color, auto word-break |
| `.card-btn` | Button inside the card | Primary-color solid, pill-rounded |

### 3.2 Grid Cards (Three-Column Layout)

| Class | Purpose | Notes |
|---|---|---|
| `.cardzone-three-columns` | Three-column grid container | Responsive: 2 columns on tablet, 1 on mobile |
| `.three-column-card` | "Grid card" within the three-column grid | Centered text, `hover-lift` effect |

**Macro Parameters**

When calling `card()` in the card macro `macros/card.njk`, the following parameters can customize the card:

| Parameter | Purpose | Default |
|---|---|---|
| `title` | Title text | Required |
| `content` | Body text | Required |
| `url` | Button link target | `#` |
| `btnText` | Button text | `View` |
| `bgColor` | Custom background color | Empty → use default |
| `textColor` | Custom text color | Empty → use default |
| `borderColor` | Custom border color | Empty → use default |
| `hoverBgColor` | Custom hover background color | If unset, keeps original background |
| `hoverBorderColor` | Custom hover border color | If unset, falls back to `borderColor` |
| `btnColor` | Button background color | Empty → use default |
| `btnTextColor` | Button text color | Empty → use default |
| `btnHover` | Button hover background color | Empty → use default |
| `btnBorder` | Button border color | Empty → use default |
| `btnBorderHover` | Button hover border color | If unset, falls back to `btnBorder` |

When any color parameter is omitted, the corresponding CSS variable won't be generated on the rendered element, and SCSS falls back to the default value.

**CSS Variables**

Color customization is implemented at the bottom layer via CSS variables. Advanced users can use them directly in HTML:

| Variable | Purpose | Fallback Chain |
|---|---|---|
| `--card-bg` | Card background color | `transparent` |
| `--card-fg` | Card text color | `$color-text` |
| `--card-border` | Card border color | `$card-border-color` |
| `--card-bg-hover` | Hover background color | `var(--card-bg, transparent)` |
| `--card-border-hover` | Hover border color | `var(--card-border, $card-border-color)` |
| `--btn-bg` | Button background color | `$color-primary` |
| `--btn-fg` | Button text color | `$color-white` |
| `--btn-hover` | Button hover background color | `var(--btn-bg, $color-primary-dark)` |
| `--btn-border` | Button border color | `$border-color-blue` |
| `--btn-border-hover` | Button hover border color | `var(--btn-border, $border-color-blue)` |

**Usage Examples**

```jinja2
{% from "macros/card.njk" import card %}

{{ card("Docs Center", "Browse the full API docs and usage guide", "#") }}

{{ card("Custom Card", "Light green background + dark green border", "#", bgColor="#f0fdf4", borderColor="#22c55e", hoverBorderColor="#16a34a") }}

{{ card("Custom Button", "Orange button + red border", "#", btnColor="#f97316", btnBorder="#ef4444", btnHover="#ea580c") }}
```

### 3.3 Standalone Info Card (Left Icon + Right Title/Body)

| Class | Purpose | Notes |
|---|---|---|
| `.card-standalone` | Standalone card container | Max width 440px, `hover-lift` |
| `.card-info` | Left-side icon area | Flex centered |
| `.card-info-icon` | The icon itself | 27×27px |
| `.card-body` | Right-side title + body + button, stacked vertically | Flex column |

### 3.4 Full-Width Cards

| Class | Purpose | Notes |
|---|---|---|
| `.card-full` | Full-width standalone card | Fills parent container, `hover-lift` |
| `.card-full-list` | Full-width card vertical stack container | Spacing unified as `$spacing-lg` |

**Macro Parameters**

When calling `cardFull()` in the card macro `macros/card.njk`, the following parameters can customize the card (parameter list identical to `card()`):

| Parameter | Purpose | Default |
|---|---|---|
| `title` | Title text | Required |
| `content` | Body text | Required |
| `url` | Button link target | `#` |
| `btnText` | Button text | `View` |
| `bgColor` | Custom background color | Empty → use default |
| `textColor` | Custom text color | Empty → use default |
| `borderColor` | Custom border color | Empty → use default |
| `hoverBgColor` | Custom hover background color | If unset, keeps original background |
| `hoverBorderColor` | Custom hover border color | If unset, falls back to `borderColor` |
| `btnColor` | Button background color | Empty → use default |
| `btnTextColor` | Button text color | Empty → use default |
| `btnHover` | Button hover background color | Empty → use default |
| `btnBorder` | Button border color | Empty → use default |
| `btnBorderHover` | Button hover border color | If unset, falls back to `btnBorder` |

When any color parameter is omitted, the corresponding CSS variable won't be generated on the rendered element, and SCSS falls back to the default value.

**CSS Variables**

Full-width cards and grid cards share the same CSS variable system — see the "CSS Variables" table in section 3.2.

**Usage Examples**

```jinja2
{% from "macros/card.njk" import cardFull %}

{{ cardFull("New Version Released", "v2.0 brings a brand new design language and performance optimizations. Check out the updates now.", "/changelog/", btnText="View Changelog") }}

{{ cardFull("Limited Event", "Summer sale is on — up to 20% off everything. Click below to join!", "/event/summer/", bgColor="#fffbeb", borderColor="#f59e0b", btnColor="#f59e0b", btnHover="#d97706") }}
```

---

## 4. Code Blocks (code.scss)

Used with `@11ty/eleventy-plugin-syntaxhighlight` + the Prism theme.

> Code block containers (`pre[class*="language-"]`, `pre.line-numbers`) and inline code (`:not(pre) > code`) are tag/attribute selectors without separately defined classes.
>
> Line numbers, copy buttons and other sub-elements are styled via nested selectors (`.line-numbers-rows`, `.copy-to-clipboard-button`) injected automatically by the Prism plugin.

---

## 5. Main Content Area (content.scss)

| Selector | Purpose | Notes |
|---|---|---|
| `article` | Main content card container | Max 1280px, min 768px; min-width removed at tablet and below |
| `article > ul` | Unordered list inside article | Default `text-align: justify` |
| `article > div.card-standalone` | Standalone card inside article | 25px top/bottom margin |
| `article blockquote` | Blockquote | 4px primary-color left border + light primary background |
| `article table` | Table inside article | Horizontal scroll on overflow, light background header |
| `article img` | Image inside article | Max-width responsive |
| `article hr` | Horizontal rule inside article | 2px light-colored line |

---

## 6. Footer (footer.scss)

| Selector | Purpose | Notes |
|---|---|---|
| `footer` | Footer container | Centered text, primary background |
| `footer p` | Footer paragraph | Switches to block-centered display on mobile |

---

## 7. Header Navigation (header.scss)

Fixed top navigation bar (64px + 15px decorative strip), shows button group on desktop, switches to drawer on mobile.

| Class | Purpose | Notes |
|---|---|---|
| `header` | Top-level `<header>` container | Fixed top, theme-color background (customizable, see 7.2) |
| `.nav-title` | Site title on left of nav bar | Bold |
| `.nav-btns` | Nav button group container | Becomes vertical stack on mobile |
| `.nav-hamburger` | Mobile hamburger menu icon | `display: none` on desktop |
| `.nav-drawer-close` | Mobile drawer close button | Only shown on mobile (`display: none` on desktop) |

**State Classes (toggled by JS on `<body>`)**

| Class | Purpose | Notes |
|---|---|---|
| `.nav-drawer-open` | Open mobile nav drawer | Drawer slides in + shows overlay |

### 7.2 Custom Background Color

Customize the `<header>` background color via the `--header-bg` CSS variable. When unset, the theme color (`--color-primary`) is used, switching with light/dark theme.

Two methods are supported, **priority from high to low**:

1. **Nunjucks template `set` tag** (highest) — use `set headerBg = "..."` in the layout before including the header. Since Nunjucks `set` is evaluated before include, it **overrides** the front matter setting
2. **Markdown front matter** (next) — `headerBg: "#xxx"`
3. **Theme color fallback** — when unset, uses `--color-primary`

**Method 1: Markdown Front Matter**

```yaml
---
title: About
headerBg: "#c92a2a"
---
```

**Method 2: Nunjucks Template (in a Layout)**

```jinja2
{%- set _headerBg = headerBg or "" -%}
{#- Or set directly in layout before include: -#}
{%- set headerBg = "#2b8a3e" %}
{% include "components/header.njk" %}
```

> The color is inlined as `style="--header-bg:...";` on the `<header>` element, with a smooth `transition: background`.

#### Custom Button Hover / Mobile Background (Global)

The 5 background colors for button hover and mobile display are **NOT exposed at the page level**. They're configured uniformly in the global theme file `_theme-vars.scss` via CSS variables:

| Variable | Purpose |
|---|---|
| `--header-hover-bg` | Desktop nav button hover background |
| `--nav-drawer-close-hover-bg` | Mobile close button hover background |
| `--nav-mobile-btn-bg` | Mobile menu default background |
| `--nav-mobile-btn-border` | Mobile menu border |
| `--nav-mobile-btn-hover-bg` | Mobile menu hover background |

Defaults use `color-mix(in srgb, var(--header-bg, var(--color-primary)) X%, transparent)` to automatically follow the current `--header-bg` color — when only `headerBg` is set, hover produces a harmonious contrast automatically; to globally override one (e.g. all mobile menus to semi-transparent black), just change the corresponding variable under the light/dark `:root` in `_theme-vars.scss`.

#### Override a Single Button's Hover Background

Since the 5 variables are CSS custom properties, any **higher-priority CSS rule** can override the defaults. No need to modify the njk template or add new classes — just write the rule via attribute selectors in an SCSS file:

```scss
// Example: make the "Articles" button hover show green
.nav-btns a[href="/article/"]:hover {
    --header-hover-bg: rgba(76, 175, 80, 0.3);
}

// Example: make the "This GitHub project" button hover show dark
.nav-btns a[href^="https://github.com"]:hover {
    --header-hover-bg: rgba(0, 0, 0, 0.4);
}

// Example: make all `.theme-btn` hover use primary color (also applies to mobile drawer close button)
.theme-btn:hover {
    --header-hover-bg: rgba(74, 108, 247, 0.4);
}
```

**Key Points**:
- The selector priority needs to be **higher than** `.nav-btns a:hover` in `header.scss`, so writing it in a later file (e.g. create a new `_nav-override.scss` and `@use` it at the end of `styles.njk`) is enough
- Mobile menu follows the same pattern — `.nav-btns a:hover` inside `respond-to($breakpoint-tablet)` uses the same variables, just write the mobile override selector inside a media query too
- You can also write `style="--header-hover-bg: rgba(...)"` directly on the `<a>` tag in the njk template — inline style priority is naturally highest

---

## 8. Nav Popup (nav-popup.scss)

Dropdown panel that opens when a desktop button is clicked. Switches to a bottom sheet on mobile (90vh height).

| Class | Purpose | Notes |
|---|---|---|
| `.nav-popup-btn` | Popup trigger button (overrides cursor) | Reuses `.nav-btns a` styles |
| `.nav-popup` | Popup panel container | 300px wide on desktop, top-right aligned |
| `.nav-popup-close` | Mobile close button | Only shown on mobile |
| `.nav-active` | Marks the currently active item | Bold text + primary-color light background |

**State Classes (toggled by JS on `<body>`)**

| Class | Purpose | Notes |
|---|---|---|
| `.nav-popup-open` | Open nav popup | Popup fades in + underline persists |

---

## 9. Unified Overlay (overlay.scss)

The site's only `<div class="overlay">`, included by `header.njk`. Can only serve one active scene at a time.

| Class | Purpose | Notes |
|---|---|---|
| `.overlay` | The overlay element itself | Fixed fullscreen, semi-transparent black + blur |

**State Classes That Trigger the Overlay (toggled on `<body>`)**

| Class | Purpose | Notes |
|---|---|---|
| `.nav-drawer-open` | Mobile nav drawer | Common scenario |
| `.nav-popup-open` | Desktop site nav popup | Common scenario |
| `.theme-menu-open` | Desktop theme switcher menu | Desktop only |
| `.wiki-sidebar-open` | Mobile Wiki sidebar | Common scenario (mounted on `<header>`) |

---

## 10. Theme Switcher (theme-switcher.scss)

Desktop dropdown menu / inline expansion on mobile.

| Class | Purpose | Notes |
|---|---|---|
| `.theme-switcher` | Theme switcher container | Relative positioning |
| `.theme-btn` | Switch button (icon) | 36×36px, transparent background |
| `.theme-menu` | Theme options dropdown menu | Absolutely positioned on desktop, static inline on mobile |

**State Classes**

| Class | Purpose | Notes |
|---|---|---|
| `.theme-menu.open` | Expanded theme menu | Toggled by JS |
| `.theme-menu-open` | Triggers overlay | See section 9 |

---

## 11. Image Gallery (images.scss)

| Class | Purpose | Notes |
|---|---|---|
| `.image-gallery` | Image gallery container | Horizontal arrangement + centered, vertical on mobile |
| `.image-gallery > picture` | Single picture element in the gallery | `hover` lift + deeper shadow |

---

## 12. Wiki (wiki.scss)

### 12.1 Overall Layout

| Class | Purpose | Notes |
|---|---|---|
| `.wiki-layout` | Wiki page overall layout (sidebar + content) | Switches to vertical on mobile |

### 12.2 Sidebar

| Class | Purpose | Notes |
|---|---|---|
| `.wiki-sidebar-toggle` | Sidebar collapse/expand button | Fixed top-left on desktop, fixed bottom-left on mobile |
| `.wiki-sidebar-toggle-icon` | Hamburger/X icon inside the button (three lines) | Becomes X when `aria-expanded='false'` |
| `.wiki-sidebar` | Sidebar itself | 220px wide on desktop, sticky positioning; fixed drawer on mobile |
| `.wiki-sidebar-title` | Sidebar top title | Primary-color text |
| `.wiki-nav` | Nav list container | |
| `.wiki-nav-group` | Group container | Current page's group is highlighted |
| `.wiki-nav-group-title` | Group subtitle | Uppercase, letter-spacing |
| `.wiki-nav-group-list` | Group list | |

**State Classes (toggled by JS on `<body>`)**

| Class | Purpose | Notes |
|---|---|---|
| `.wiki-sidebar-collapsed` | Collapse sidebar | Hidden on desktop + button shifts left |
| `.wiki-sidebar-open` | Triggers overlay | Common scenario, see section 9 |

### 12.3 Main Content Area

| Class | Purpose | Notes |
|---|---|---|
| `.wiki-content` | Content area container | flex 1 |
| `.wiki-article` | Article card | Primary-color H1 title |
| `.wiki-description` | Article description paragraph | Italic, secondary text color |
| `.wiki-edit-link` | "Edit this page" link block | Right-aligned, pill button style |

### 12.4 Index List

| Class | Purpose | Notes |
|---|---|---|
| `.wiki-list` | Index page entry list | 3px primary-color left border |
| `.wiki-list-desc` | Entry description | Secondary text color |

---

## Appendix: State Class Overview (toggled by JS on `<body>`)

| State Class | Triggered By | Side Effect |
|---|---|---|
| `.nav-drawer-open` | Mobile nav drawer | Drawer slides in + overlay shown |
| `.nav-popup-open` | Desktop nav popup | Popup fades in + overlay shown |
| `.theme-menu-open` | Desktop theme menu | Menu expands + overlay shown |
| `.wiki-sidebar-open` | Wiki sidebar drawer | Drawer slides in + overlay shown (effective on mobile) |
| `.wiki-sidebar-collapsed` | Desktop Wiki sidebar | Sidebar hidden + button shifts left (**Note**: this is a class on the layout container, not `<body>`) |
| `.modal-open` | Any modal | Modal fades in + overlay shown + body scroll locked (multiple modals coexist until all are closed) |
| `.nav-popup-open .nav-popup-btn::after` | Nav button open state | Underline persists |
| `.nav-active` | Currently active nav item | Bold text + primary-color light background |

---

## 13. Universal Modal (popup.scss)

Unlike the "nav popup" (`.nav-popup`), the modal is a **universal popup for any content**: announcements, confirmation dialogs, rich-text explanations, etc. For a complete example, see section 14.5 of [Markdown Showcase](/article/markdown-showcase/).

### 13.1 Container

| Class | Purpose | Notes |
|---|---|---|
| `.modal` | The modal itself | Centered top-positioned, vertical three-section structure (header / body / footer) |
| `.modal-backdrop` | Backdrop layer | Fixed fullscreen + blurred background |

**Sizes (switch via macro's `size` parameter or `[data-modal-size]`)**

| Value | Width | Typical Scenario |
|---|---|---|
| `sm` | 360px | Confirmation dialogs, short notices |
| `md` (default) | 560px | General explanations, rich-text display |
| `lg` | 800px | Long-form content, terms |

> You can also customize any width via the CSS variable `--modal-size` (e.g. `style="--modal-size: 480px"`).

### 13.2 Internal Structure

| Class | Purpose | Notes |
|---|---|---|
| `.modal-header` | Top title bar | Left icon + title + right close button |
| `.modal-header-text` | Title text container | Flex horizontal, overflow ellipsis |
| `.modal-icon` | Font Awesome icon prefix in title | Primary color, 1.2rem |
| `.modal-title` | Modal title (`<h3>`) | 1.1rem, bold |
| `.modal-close` | Top-right X button | Darker background on hover |
| `.modal-body` | Body scrollable area | padding 24px, line-height 1.6 |
| `.modal-footer` | Footer (button group) | Primary background, flex right-aligned; auto-hidden when footer not passed |

### 13.3 State Classes / Attributes (toggled by JS)

| Selector | Trigger Scenario | Side Effect |
|---|---|---|
| `body.modal-open` | Any modal opens | body gets `overflow: hidden` + overlay shown |
| `.modal[data-modal-state="open"]` | Modal open | Scale fade-in (Material dialog style, 225ms with bounce-back) |
| `.modal[data-modal-state="closed"]` | Modal closed | Scale fade-out (120ms, scale 1→0.9) |
| `body.modal-open .modal-backdrop` | Overlay shown | Semi-transparent black (rgba(0,0,0,0.5)), 200ms fade-in |

**Animation**:
- Enter / leave: `$transition-fast` (`0.25s ease`, classic ease curve) + opacity fade + scale 0.95↔1
- Overlay: `rgba(0, 0, 0, 0.4)` semi-transparent black + `backdrop-filter: blur(6px)` blurred background

### 13.4 Trigger Attributes (write on any element)

| Attribute | Purpose |
|---|---|
| `data-modal-open="<id>"` | Click element to open the corresponding modal |
| `data-modal-close="<id>"` | Click element to close the corresponding modal |
| `data-modal-backdrop="<id>"` | Marker attribute on the backdrop node (rendered automatically by the macro) |

### 13.5 JS API

Global functions exposed on `window` via `src/script/popup-modal.js`:

| Function | Purpose |
|---|---|
| `window.openModal(id)` | Open the modal with the given id |
| `window.closeModal(id)` | Close the modal with the given id |
| `window.closeTopModal()` | Close the top modal on the stack (no-op when stack is empty) |
| `window.isModalOpen(id?)` | Check whether a specific / any modal is open |

Also dispatches two custom events: `modalopen` / `modalclose` (the event object carries `event.detail.id`).

### 13.6 Macro Signature (macros/popup.njk)

{% raw %}
```jinja2
{% from "macros/popup.njk" import popup %}
{{ popup(
    modalId,                  # Required, globally unique
    title,                    # Required, title text
    content,                  # Required, body content (HTML string)
    size="md",                # Optional: "sm" / "md" / "lg"
    icon="",                  # Optional, FA icon class name
    showClose=true,           # Optional, whether to show the top-right X
    footer=""                 # Optional, footer HTML (typically a button group)
) }}
```
{% endraw %}

For complete examples and demos, see section 14.5 of [Markdown Showcase](/article/markdown-showcase/).

---

## 14. Modal Trigger Macro (modal-trigger.njk)

`button.njk` renders an `<a>` tag for navigating to links, which is **not suitable** for use as an "open modal" button: it doesn't have a `data-modal-open` attribute, and because of `href="#"` it scrolls to the top of the page when clicked. `modalTrigger` is an equivalent macro designed specifically for modal scenarios — it **renders `<button type="button">` by default** and automatically binds the correct `data-modal-open` / `data-modal-close` attributes.

### 14.1 Differences from button.njk

| Comparison | `button.njk` | `modalTrigger.njk` |
|---|---|---|
| Tag | `<a href="...">` | `<button type="button">` |
| Default action | Navigate to URL | Trigger modal (`data-modal-open` / `data-modal-close`) |
| Click side effect | May navigate page | No navigation (no `href`) |
| Required parameters | icon / label / url | modalId / icon / label |
| Optional parameters | url / target / color series | action / color series (no url / target) |
| Color variables | Same as `button.njk` | Same as `button.njk` |

### 14.2 Macro Signature

{% raw %}
```jinja2
{% from "macros/modal-trigger.njk" import modalTrigger %}
{{ modalTrigger(
    modalId,              # Required, matches popup macro's modalId
    icon,                 # Required, FA icon class name
    label,                # Required, button text
    action="open",        # Optional: "open" (default) opens modal / "close" closes modal
    btnColor="",          # Optional, background color (uses .btn-pill's CSS variables)
    textColor="",         # Optional, text color
    btnHover="",          # Optional, hover background color
    btnBorder="",         # Optional, border color
    btnBorderHover=""     # Optional, hover border color
) }}
```
{% endraw %}

### 14.3 Render Output Example

```html
<!-- action="open" (default) -->
<button type="button" class="btn-pill" data-modal-open="announcement"
    style="--btn-bg:#74c0fc; --btn-hover:#1c7ed6;" data-bhover="1">
    <i class="fa-solid fa-circle-info btn-pill-icon"></i>
    <span class="btn-pill-label">View Announcement</span>
</button>

<!-- action="close" -->
<button type="button" class="btn-pill" data-modal-close="js-demo">
    <i class="fa-solid fa-xmark btn-pill-icon"></i>
    <span class="btn-pill-label">JS Close Modal</span>
</button>
```

### 14.4 Complete Usage Example

{% raw %}
```jinja2
{% from "macros/popup.njk" import popup %}
{% from "macros/modal-trigger.njk" import modalTrigger %}

{{ modalTrigger("hello", "fa-solid fa-circle-info", "Say Hello") }}

{{ popup(
    "hello",
    "Hello",
    "<p>This is regular modal content.</p>"
) }}
```
{% endraw %}

### 14.5 Why Not Use button.njk

In many projects, the first instinct is to write `{{ button("...", "...", "#") }}` as a modal trigger, but there are two hidden issues:

1. **It won't trigger**: the button macro only renders `<a href="#">`, with no `data-modal-open`, so `popup-modal.js`'s event delegation can't catch the click at all.
2. **Page scrolls to top**: `href="#"` is an anchor — clicking scrolls the page to the top, breaking the reading position.

`modalTrigger` solves both at once: renders as `<button type="button">` (no `href`, no jump on click) + auto-binds `data-modal-open="<modalId>"` (event delegation can recognize it).
