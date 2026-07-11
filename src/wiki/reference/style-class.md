---
title: 样式 Class 列表
description: 汇总 src/style 下所有 SCSS 文件定义的样式类，按模块分类，供开发者参考
layout: layouts/wiki
order: 2
wikiCategory: 📚 参考手册
wikiCategoryOrder: 2
---

本页汇总 `src/style/` 目录下所有 SCSS 文件中定义的 CSS 类，按功能模块分类。所有类均可在任意 Nunjucks 模板或 Markdown 文档中直接使用。

> **说明**
> - SCSS 源文件中的 `@mixin`（混入）仅用于源码复用，不会编译成独立的 CSS 类，因此不列入下表。
> - 部分类只在特定响应式断点（`≤768px` 平板、`≤480px` 手机）下生效，已在备注中标明。

---

## 一、基础样式（base.scss）

| 类名 | 作用 | 备注 |
|---|---|---|
| `.hover-show` | Hover 时显示文本（带宽度缩放动画） | 桌面端默认 `max-width: 0` + `opacity: 0`，父级 hover 时展开为 `200px`；移动端始终显示 |

> `html` / `body` / `a` / `i` 为标签选择器，未单独定义类。

---

## 二、按钮（buttons.scss）

胶囊按钮（设计图 Button - Content Area），主色实心按钮。

| 类名 | 作用 | 备注 |
|---|---|---|
| `.btn-pill` | 胶囊按钮容器（主色背景 + 阴影 + 圆角） | 用作 `<a>` 或 `<button>` |
| `.btn-pill-icon` | 按钮内左侧图标 | 配合 Font Awesome 等图标库 |
| `.btn-pill-label` | 按钮内文字 | 自动不换行 |

**典型用法**

```html
<a class="btn-pill">
    <i class="fa-solid fa-play btn-pill-icon"></i>
    <span class="btn-pill-label">Button</span>
</a>
```

**自定义颜色（宏参数）**

调用按钮宏 `macros/button.njk` 时，可通过以下可选参数覆盖默认颜色：

| 参数 | 作用 | 默认 |
|---|---|---|
| `btnColor` | 按钮背景色 | `var(--color-primary)` |
| `textColor` | 按钮文字色 | `var(--color-white)` |
| `btnHover` | hover 时的背景色 | 未传则保持与 `btnColor` 相同；想换主题 dark 时传 `var(--color-primary-dark)` |
| `btnBorder` | 边框颜色 | `var(--border-color-blue)` |
| `btnBorderHover` | hover 时的边框颜色 | 回落到 `btnBorder`，再回落则走 `var(--border-color-blue)` |

任意一个参数省略时，渲染出的 `<a>` 上不会生成对应内联样式，CSS 走 `.btn-pill` 默认值。

```jinja2
{% from "macros/button.njk" import button %}
{{ button("fa-solid fa-arrow-right", "了解更多", "/about.html", btnColor="rgba(200, 255, 200)") }}
{{ button("fa-solid fa-pen", "编辑", "#", btnColor="#fff0f0", btnBorder="#e03131") }}
```

---

## 三、卡片（cards.scss）

统一卡片基线：`hover-lift` 悬停上浮、`$radius-md` 圆角、毛玻璃背景 + 浅边框 + 阴影。

### 3.1 卡片内部通用结构

任何布局的卡片均可复用以下三个内部元素类。

| 类名 | 作用 | 备注 |
|---|---|---|
| `.card-title` | 卡片标题 | 加粗、跟随主题文字色 |
| `.card-content` | 卡片正文/描述 | 次要文字色，自动断词 |
| `.card-btn` | 卡片内按钮 | 主色实心，胶囊圆角 |

### 3.2 网格卡片（三列布局）

| 类名 | 作用 | 备注 |
|---|---|---|
| `.cardzone-three-columns` | 三列网格容器 | 响应式：平板 2 列、手机 1 列 |
| `.three-column-card` | 三列网格中的"格子卡片" | 居中文字、`hover-lift` 效果 |

### 3.3 独立信息卡片（左侧 icon + 右侧 标题/正文）

| 类名 | 作用 | 备注 |
|---|---|---|
| `.card-standalone` | 独立卡片容器 | 最大宽 440px，`hover-lift` |
| `.card-info` | 左侧图标区域 | flex 居中 |
| `.card-info-icon` | 图标本体 | 27×27px |
| `.card-body` | 右侧标题 + 正文 + 按钮纵向堆叠 | flex column |

### 3.4 通栏卡片

| 类名 | 作用 | 备注 |
|---|---|---|
| `.card-full` | 通栏独立卡片 | 撑满父容器，`hover-lift` |
| `.card-full-list` | 通栏卡片纵向堆叠容器 | 间距统一为 `$spacing-lg` |

---

## 四、代码块（code.scss）

配合 `@11ty/eleventy-plugin-syntaxhighlight` + Prism 主题使用。

> 代码块容器（`pre[class*="language-"]`、`pre.line-numbers`）与行内代码（`:not(pre) > code`）均为标签/属性选择器，未单独定义类。
>
> 行号、复制按钮等子元素通过嵌套选择器控制样式（`.line-numbers-rows`、`.copy-to-clipboard-button`），由 Prism 插件自动注入。

---

## 五、主内容区（content.scss）

| 选择器 | 作用 | 备注 |
|---|---|---|
| `article` | 主内容卡片容器 | 最大 1280px，最小 768px；平板及以下解除最小宽度 |
| `article > ul` | 文章内无序列表 | 默认 `text-align: justify` |
| `article > div.card-standalone` | 文章内的独立卡片 | 上下外边距 25px |
| `article blockquote` | 引用块 | 左侧主色 4px 边 + 主色淡背景 |
| `article table` | 文章内表格 | 横向溢出滚动，表头淡背景 |
| `article img` | 文章内图片 | 自适应最大宽度 |
| `article hr` | 文章内分隔线 | 2px 浅色横线 |

---

## 六、页脚（footer.scss）

| 选择器 | 作用 | 备注 |
|---|---|---|
| `footer` | 页脚容器 | 居中文字、主背景色 |
| `footer p` | 页脚段落 | 移动端切换为块级居中显示 |

---

## 七、导航栏（header.scss）

固定顶部导航栏（高 64px + 15px 装饰条），桌面端显示按钮组、移动端切换为抽屉。

| 类名 | 作用 | 备注 |
|---|---|---|
| `.nav-title` | 导航栏左侧站点标题 | 加粗 |
| `.nav-btns` | 导航按钮组容器 | 移动端变为纵向堆叠 |
| `.nav-hamburger` | 移动端汉堡菜单图标 | 桌面端 `display: none` |
| `.nav-drawer-close` | 移动端抽屉关闭按钮 | 仅移动端显示（桌面端 `display: none`） |

**状态类（由 JS 切换 `<body>` 上的类）**

| 类名 | 作用 | 备注 |
|---|---|---|
| `.nav-drawer-open` | 打开移动端导航抽屉 | 抽屉滑入 + 显示遮罩 |

---

## 八、导航弹出菜单（nav-popup.scss）

桌面端点击按钮下拉的面板，移动端切换为底部弹层（高 90vh）。

| 类名 | 作用 | 备注 |
|---|---|---|
| `.nav-popup-btn` | 触发弹窗的按钮（覆盖 cursor） | 复用 `.nav-btns a` 样式 |
| `.nav-popup` | 弹出面板容器 | 桌面 300px 宽、右上角对齐 |
| `.nav-popup-close` | 移动端关闭按钮 | 仅移动端显示 |
| `.nav-active` | 标记当前激活项 | 文字加粗 + 主色淡背景 |

**状态类（由 JS 切换 `<body>` 上的类）**

| 类名 | 作用 | 备注 |
|---|---|---|
| `.nav-popup-open` | 打开导航弹窗 | 弹窗淡入 + 下划线常驻 |

---

## 九、统一遮罩（overlay.scss）

全站唯一的 `<div class="overlay">`，由 `header.njk` 引入；同一时刻只能服务一个激活场景。

| 类名 | 作用 | 备注 |
|---|---|---|
| `.overlay` | 遮罩元素本体 | 固定全屏、半透明黑 + 模糊 |

**触发遮罩的状态类（切换 `<body>` 上的类）**

| 类名 | 作用 | 备注 |
|---|---|---|
| `.nav-drawer-open` | 移动端导航抽屉 | 通用场景 |
| `.nav-popup-open` | 桌面端站点导航弹窗 | 通用场景 |
| `.theme-menu-open` | 桌面端主题切换菜单 | 仅桌面端 |
| `.wiki-sidebar-open` | 移动端 Wiki 侧边栏 | 仅移动端（≤768px） |

---

## 十、主题切换（theme-switcher.scss）

桌面端下拉菜单 / 移动端内联展开。

| 类名 | 作用 | 备注 |
|---|---|---|
| `.theme-switcher` | 主题切换器容器 | 相对定位 |
| `.theme-btn` | 切换按钮（图标） | 36×36px、透明背景 |
| `.theme-menu` | 主题选项下拉菜单 | 桌面端绝对定位、移动端改为静态内联 |

**状态类**

| 类名 | 作用 | 备注 |
|---|---|---|
| `.theme-menu.open` | 展开主题菜单 | 由 JS 切换 |
| `.theme-menu-open` | 触发遮罩 | 详见第九节 |

---

## 十一、图片画廊（images.scss）

| 类名 | 作用 | 备注 |
|---|---|---|
| `.image-gallery` | 图片画廊容器 | 水平排列 + 居中，移动端竖向 |
| `.image-gallery > picture` | 画廊中的单个 picture 元素 | `hover` 上浮 + 阴影加深 |

---

## 十二、Wiki（wiki.scss）

### 12.1 整体布局

| 类名 | 作用 | 备注 |
|---|---|---|
| `.wiki-layout` | Wiki 页面整体布局（侧边栏 + 内容） | 移动端切换为纵向 |

### 12.2 侧边栏

| 类名 | 作用 | 备注 |
|---|---|---|
| `.wiki-sidebar-toggle` | 侧边栏折叠/展开按钮 | 桌面固定左上、移动端固定左下 |
| `.wiki-sidebar-toggle-icon` | 按钮内的汉堡/X 图标（三横线） | `aria-expanded='false'` 时变为 X |
| `.wiki-sidebar` | 侧边栏本体 | 桌面 220px 宽、sticky 定位；移动端改为 fixed 抽屉 |
| `.wiki-sidebar-title` | 侧边栏顶部标题 | 主色文字 |
| `.wiki-nav` | 导航列表容器 | |
| `.wiki-nav-group` | 分组容器 | 当前页对应分组高亮 |
| `.wiki-nav-group-title` | 分组小标题 | 大写、字间距 |
| `.wiki-nav-group-list` | 分组列表 | |

**状态类（由 JS 切换 `<body>` 上的类）**

| 类名 | 作用 | 备注 |
|---|---|---|
| `.wiki-sidebar-collapsed` | 折叠侧边栏 | 桌面端隐藏 + 按钮左移 |
| `.wiki-sidebar-open` | 触发遮罩 | 仅移动端，详见第九节 |

### 12.3 主内容区

| 类名 | 作用 | 备注 |
|---|---|---|
| `.wiki-content` | 内容区容器 | flex 1 |
| `.wiki-article` | 文章卡片 | 主色 H1 标题 |
| `.wiki-description` | 文章描述段落 | 斜体、次要文字色 |
| `.wiki-edit-link` | "编辑此页"链接区块 | 右对齐、胶囊按钮样式 |

### 12.4 索引列表

| 类名 | 作用 | 备注 |
|---|---|---|
| `.wiki-list` | 索引页条目列表 | 左侧 3px 主色边 |
| `.wiki-list-desc` | 条目描述 | 次要文字色 |

---

## 附：状态类总览（JS 在 `<body>` 上切换）

| 状态类 | 触发组件 | 副作用 |
|---|---|---|
| `.nav-drawer-open` | 移动端导航抽屉 | 抽屉滑入 + 遮罩显示 |
| `.nav-popup-open` | 桌面端导航弹窗 | 弹窗淡入 + 遮罩显示 |
| `.theme-menu-open` | 桌面端主题菜单 | 菜单展开 + 遮罩显示 |
| `.wiki-sidebar-open` | 移动端 Wiki 侧边栏 | 抽屉滑入 + 遮罩显示 |
| `.wiki-sidebar-collapsed` | 桌面端 Wiki 侧边栏 | 侧边栏隐藏 + 按钮左移（**注意**：此为布局容器上的类，非 `<body>`） |
| `.nav-popup-open .nav-popup-btn::after` | 导航按钮打开态 | 下划线常驻 |
| `.nav-active` | 当前激活的导航项 | 文字加粗 + 主色淡背景 |