---
title: 写作指南
description: 如何撰写 Wiki 条目
layout: layouts/wiki
order: 1
wikiCategory: 📝 入门指南
wikiCategoryOrder: 1
---

# 写作指南

Wiki 条目的写作约定：

- 用清晰的标题分层
- 中文与英文之间留一个空格
- 代码块注明语言

## 宏组件在 Markdown 里的使用

Wiki / Article 页面是 `.md` 文件，Eleventy 配置 `markdownTemplateEngine: "njk"` —— 即 Nunjucks **先**渲染宏、再交给 markdown-it 解析。但 markdown-it 的 attribute sanitizer 会把 `<a>` 上的 `style` / `data-*` 等属性视为"危险"，导致**带自定义颜色的按钮调用被整段转义**，输出形如 `<p>&lt;a ...&gt;`。

### 推荐的写法：用一个 `<div>` 单独包住带颜色的按钮

在 `.md` 文件里调用带 `btnColor` / `textColor` / `btnHover` / `btnBorder` / `btnBorderHover` 等颜色参数的按钮宏时，**用一个独立的 `<div>...</div>` 包裹它**。`<div>` 在 markdown-it 里被识别为 CommonMark HTML block Type 7，整段原样保留、不调用 inline rule，从而绕过 attribute sanitizer。

**一个 `<div>` 只放一个带颜色的按钮** —— 实测发现，同一个 `<div>` 内连续放两个带颜色的按钮时，第二个会被转义（html_block 状态在多元素场景下覆盖不到位）。

### 各种写法对比

下面每种写法都给一个示例，可以按需复制。

#### ✅ 推荐：套独立 `<div>`

仅自定义背景色：

{% raw %}
```html
<div>
{{ button("fa-solid fa-arrow-right", "了解更多", "/about.html", btnColor="rgba(200, 255, 200)") }}
</div>
```
{% endraw %}

#### ❌ 错误：直接调带颜色的按钮

不套 div、也不在已有容器内时，`style` 属性会被 attribute sanitizer 转义：

{% raw %}
```html
<!-- 这样写产物会出现 &lt;a class=&quot;...&gt; -->
{{ button("fa-solid fa-palette", "主题色按钮", "/", btnColor="#222831", textColor="#ffd369") }}
```
{% endraw %}

#### ❌ 错误：同一个 `<div>` 内塞多个带颜色的按钮

{% raw %}
```html
<!-- ❌ 第二个按钮会被转义 -->
<div>
{{ button("fa-icon-a", "按钮 1", "/a", btnColor="#fff5f5") }}
{{ button("fa-icon-b", "按钮 2", "/b", btnColor="#ffe7e7") }}
</div>
```
{% endraw %}

正确做法是**每个按钮独立一个 `<div>`**：

{% raw %}
```html
<!-- ✅ -->
<div>
{{ button("fa-icon-a", "按钮 1", "/a", btnColor="#fff5f5") }}
</div>
<div>
{{ button("fa-icon-b", "按钮 2", "/b", btnColor="#ffe7e7") }}
</div>
```
{% endraw %}

#### ❌ 错误：用 raw 块包裹宏调用

Nunjucks 的 raw 块（用 `raw` / `endraw` 标签包裹）会把其中内容当字面文本输出，宏不会被展开。所以写出来既不会有转义问题（因为根本就没被解析），但**也不会有按钮**（因为宏没展开）。**不能用 raw 块来解决这个转义问题**。

#### ✅ 派生规则：放在已有的 `<div class="cardzone-three-columns">` 内

如果调用的按钮已经在 `<div class="cardzone-three-columns">` 这种带 `.three-column-card` 的容器结构里（容器本身就是合法的 HTML block），**外层已天然庇护内层 `<a>`，无需再手动套 div**：

{% raw %}
```html
<div class="cardzone-three-columns">
{{ card("学习资源", "一些常用的学习资源", "/study.html", "跳转", bgColor="#fff5f5") }}
{{ card("事件", "班级里的一些事件", "/event.html", "进入", bgColor="#e7f5ff") }}
</div>
```
{% endraw %}

### 不带颜色参数的简单按钮

不带任何颜色覆盖的按钮调用不需要套 `<div>` —— 输出的 `<a>` 上只有 `class` 和 `href`，都在 markdown-it 的白名单内，不会被转义：

{% raw %}
```html
{{ button("fa-solid fa-play", "立即开始", "/") }}
```
{% endraw %}

### 卡片宏（card / cardFull / cardStandalone）

`card` / `cardFull` / `cardStandalone` 传 `bgColor` / `textColor` / `borderColor` / `hoverBgColor` / `hoverBorderColor` / `btnColor` / `btnTextColor` 等颜色参数时会输出带 `style="--card-bg:..."` 的 `<div>`，同样受 markdown-it attribute sanitizer 影响。处理方式与按钮宏一致：

- 调用场景已在 `<div class="cardzone-three-columns">` 内 → 无需额外处理
- 否则用一个 `<div>` 单独包住

### 实际演示

完整可运行的演示可参考 [Markdown & 组件展示示例](/article/markdown-showcase.html) 的「自定义颜色」小节，看到每个 div 内只放一个带颜色按钮的真实渲染结果。
