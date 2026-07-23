<div align="center">

![Counts](https://count.getloli.com/@class-website?name=class-website&theme=miku&padding=7&offset=0&align=top&scale=1&pixelated=1&darkmode=auto)

# 班级网站

25级计算机应用1班

[![Vercel](https://img.shields.io/badge/Vercel-000000?style=for-the-badge&logo=vercel&logoColor=white)](https://vercel.com)
[![License](https://img.shields.io/github/license/mantoujun-lab/class-website?style=for-the-badge)](https://github.com/mantoujun-lab/class-website/blob/main/LICENSE)
[![Stars](https://img.shields.io/github/stars/mantoujun-lab/class-website?style=for-the-badge)](https://github.com/mantoujun-lab/class-website)
[![Open in GitHub Codespaces](https://img.shields.io/badge/Codespaces-Open-181717?style=for-the-badge&logo=github)](https://github.com/mantoujun-lab/class-website/codespaces)
[![Eleventy](https://img.shields.io/badge/Eleventy-000000?style=for-the-badge&logo=eleventy&logoColor=white)](https://www.11ty.dev)
[![Nunjucks](https://img.shields.io/badge/nunjucks-green?logo=nunjucks&style=for-the-badge)](https://mozilla.github.io/nunjucks/)
[![SCSS](https://img.shields.io/badge/SCSS-CC6699?style=for-the-badge&logo=sass&logoColor=white)](https://sass-lang.com/)
[![JavaScript](https://img.shields.io/badge/JavaScript-black?style=for-the-badge&logo=javascript)](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript)

[English](../README.md) | **简体中文**

这是一个班级网站，你可以在这里找到一些有趣的内容。

📖 [贡献指南](CONTRIBUTING_zh-cn.md) · 🛡️ [安全政策](SECURITY_zh-cn.md) · 💬 [获取支持](SUPPORT_zh-cn.md) · 📜 [行为准则](CODE_OF_CONDUCT_zh-cn.md)

</div>

## 🔭 项目简介

本仓库是 **25 级计算机应用 1 班** 的官方班级网站源代码，用于展示班级风采、分享学习资料、记录班级日常，并作为同学们学习 Web 开发的练手项目。

站点主要分为 **事件 / 文章 / 知识库（Wiki）** 三大内容板块，辅以若干「专区入口」（讨论区、学习区、活动区等）。

- **作者**：hjx-25pc1
- **许可证**：MIT
- **在线访问**：部署在 Vercel 上（连接仓库后自动分配域名）
- **源码仓库**：<https://github.com/mantoujun-lab/class-website>

## 📁 项目结构与多语言架构

本站采用 **目录隔离** 的多语言架构，每种语言拥有独立的内容目录，由 Eleventy 的目录数据文件自动注入 locale 和 permalink 前缀：

```
src/
├── _data/i18n.js              ← 翻译字典（zh-cn / en 两套）
├── _data/settings.json        ← 设置面板配置（主题、语言等）
├── _includes/                 ← 布局、组件、宏（共享，非语言相关）
├── _layouts/                  ← 布局模板
├── _macros/                   ← 可复用宏
├── style/                     ← SCSS 样式
├── script/                    ← 前端 JS
├── zh-cn/                     ← 中文内容（主语言）
│   ├── zh-cn.11tydata.js      ← 注入 locale/permalink 前缀
│   ├── zh-cn.json             ← 注入 locale/lang/dir 元数据
│   ├── index.md               ← 中文首页
│   ├── article/               ← 中文文章
│   ├── wiki/                  ← 中文 Wiki
│   ├── zone/                  ← 中文分区
│   └── event/                 ← 中文事件
├── en/                        ← 英文内容
│   ├── en.11tydata.js         ← 同上，en 版本
│   ├── en.json
│   ├── index.md
│   └── ...
└── index-redirect.md          ← 根路径 JS 跳板（无语言内容，仅检测用户偏好后跳转）
```

### 如何添加多语言内容

1. **添加新页面**：在 `src/zh-cn/` 下创建中文版本（主语言），在 `src/en/` 下创建英文版本。两者的 frontmatter 中 `permalink` 无需加语言前缀（如 `permalink: /about/`），目录数据文件会自动为它们加上 `/zh-cn/` 或 `/en/`。

2. **使用翻译字典**：在模板中通过 `{{ 'key.path' | i18n }}` 引用翻译，字典键值在 `src/_data/i18n.js` 中定义。若新增翻译键，需同时添加 zh-cn 和 en 两个条目。

3. **语言感知链接**：站内链接使用 `{{ '/xxx/' | localUrl }}` 而非 `{{ '/xxx/' | url }}`，`localUrl` 会自动根据当前语言加上正确前缀。

4. **根路径行为**：用户访问 `/` 时，站点会检测 localStorage 中的语言偏好（或浏览器 `navigator.language`），自动跳转到 `/zh-cn/` 或 `/en/`。导航栏设置面板提供语言和主题设置，点击后偏好写入 localStorage。

5. **目录数据文件说明**：
   - `*.11tydata.js`：JavaScript 对象，可计算属性，主要用于 `eleventyComputed.permalink`（动态加前缀）
   - `*.json`：静态 JSON 对象，主要用于 locale、lang、dir 等元数据

### 页面元数据

所有内容页面需在 frontmatter 中设置以下字段：

```yaml
---
title: 页面标题          # 必填，会出现在 <title> 和页面头部
permalink: /page-slug/  # 语义路径，无需语言前缀（自动添加）
layout: layouts/default  # 布局模板
---
```

## 🔨 技术栈

本项目是一个纯静态站点，使用以下技术构建：

- **[Eleventy (11ty)](https://www.11ty.dev/)** v3 — 静态站点生成器（SSG）
- **Nunjucks (`.njk`)** — 模板引擎，用于布局、组件复用和页面渲染
- **Markdown (`.md`)** — 主要内容格式，便于编写和阅读
- **Sass / SCSS** — CSS 预处理器，编译为压缩后的 CSS
- **PostCSS + Autoprefixer** — 自动添加浏览器前缀，兼容主流浏览器
- **[@11ty/eleventy-img](https://www.11ty.dev/docs/plugins/image/)** — 响应式图片处理，自动生成 `webp` 与 `jpeg` 多尺寸
- **[11ty/eleventy-plugin-syntaxhighlight](https://www.11ty.dev/docs/plugins/syntaxhighlight/)** — Markdown 代码块语法高亮
- **i18n 国际化** — 基于目录隔离的多语言方案：
  - `lodash.get` + `templite` — 实现可嵌入变量的自定义翻译过滤器 `i18n`
  - 目录级数据文件 (`*.11tydata.js` / `*.json`) — 自动为 `src/zh-cn/` 和 `src/en/` 注入 locale、permalink 前缀等
  - 自定义过滤器：`i18n`（翻译）、`localUrl`（locale 感知的内部链接）、`switchLang`（语言切换链接）、`lang`（取当前语言）
- **原生 JavaScript（ES Modules）** — 少量交互逻辑；脚本以原生 ES Modules 形式组织在 `src/script/` 下，无需前端框架或打包器
- **GitHub Actions** — 自动化 CI/CD
- **Vercel** — 静态站点托管平台

## 🖥️ 开发环境要求

在开始之前，请确保本机已安装：

| 工具 | 版本要求 | 说明 |
| --- | --- | --- |
| **Node.js** | 24.x（LTS，建议使用最新 LTS 版本） | 运行环境与包管理 |
| **npm** | 11.x+（随 Node.js 一同安装） | 依赖管理与脚本执行 |
| **Git** | 最新稳定版 | 版本控制与代码提交 |

> 💡 推荐使用 [nvm](https://github.com/nvm-sh/nvm)（Windows 下推荐 [nvm-windows](https://github.com/coreybutler/nvm-windows)）来管理 Node.js 版本。

## ☁️ 在 GitHub Codespace 中开发

不用在本地装任何东西，浏览器一点就能进入完整开发环境：

1. 打开 <https://github.com/mantoujun-lab/class-website>，点击绿色的 **Code** 按钮。
2. 切到 **Codespaces** 标签 → 点击 **Create codespace on main**。
3. 首次创建会自动跑 `npm ci` 装依赖，并在后台启动 `npm run serve`。
4. 创建完成后，右下角会弹出端口转发提示，端口选 `8080` 并点击 **Open in Browser**，就能在网页上打开 `http://localhost:8080` 实时预览。
5. 修改 `src/` 下的任意文件，Eleventy 会自动重新构建并刷新浏览器，所见即所得。
6. 改完之后在左侧 Source Control 面板直接提交、推送、发起 PR，与本地开发完全一致。

> 💡 每个 GitHub 账号每月有免费的 Codespace 额度（2 核机型），普通写稿、改样式完全够用。需要更高配置时可在创建 Codespace 时手动选择 4 核或更大机型。

## 💻 本地开发

按照以下步骤即可在本地启动开发服务器：

1. **克隆仓库**

   ```bash
   git clone https://github.com/mantoujun-lab/class-website.git
   cd class-website
   ```

2. **安装依赖**

   ```bash
   npm install
   ```

3. **启动开发服务器**（默认地址：<http://localhost:8080>，支持热重载）

   ```bash
   npm run serve
   ```

4. **仅构建一次**（不启动服务器，产物输出到 `_site/`）

   ```bash
   npm run build
   ```

5. **监听文件变化并重新构建**（不启动本地服务器）

   ```bash
   npm run watch
   ```

6. **同步知识库到 Wiki 仓库**（自动执行，需要本地有推送权限）

   ```bash
   npm run sync:wiki
   ```

7. **打包发行版**（在 `dist/` 下生成 `<包名>-<版本>-<日期>-<短哈希>.zip`）

   ```bash
   npm run release                # 自动从 package.json 读取版本号
   npm run release -- 1.2.3       # 手动指定版本号
   ```

8. **升级版本号**（同时改 `package.json` 与 `package-lock.json`）

   ```bash
   npm run bump -- patch          # 1.2.3 → 1.2.4
   npm run bump -- minor          # 1.2.3 → 1.3.0
   npm run bump -- major          # 1.2.3 → 2.0.0
   npm run bump -- 1.3.0          # 显式指定版本号
   ```

9. **重新生成贡献者头像墙**（与 `Generate contributors image` workflow 效果相同）

   ```bash
   npm run generate:contributors
   ```

## 🐛 反馈与建议

本仓库提供了 5 种 **Issue 模板** 供你选择：

| 模板                | 用途                                                |
| ------------------ | --------------------------------------------------- |
| `bug-report`       | 报告网站功能异常、显示错乱、链接失效等                |
| `feature-request`  | 提出新功能或内容板块建议                              |
| `documentation`    | 文档改进建议                                         |
| `performance`      | 性能问题反馈                                         |
| `task`             | 任务跟踪与分配（项目内部使用）                       |

> 提交前请先搜索现有 Issue，避免重复。完整流程见 [CONTRIBUTING_zh-cn.md](CONTRIBUTING_zh-cn.md)。

## 🚀 部署说明

本项目配置为在 **Vercel** 上部署：

### Vercel 一键部署

1. Fork 本仓库到你的 GitHub 账号
2. 访问 [Vercel](https://vercel.com) 并使用 GitHub 登录
3. 点击 "New Project"，导入你 fork 的仓库
4. Vercel 会自动检测项目配置（根目录 `vercel.json`）
5. 直接点击 "Deploy"，等待构建完成即可

### 配置说明

项目根目录的 `vercel.json` 包含完整的部署配置：

- **构建命令**：`npm run build`
- **输出目录**：`_site`
- **简洁 URL**：启用（`cleanUrls: true`）
- **尾部斜杠**：启用（`trailingSlash: true`）
- **重写规则**：支持 Eleventy 生成的 clean URLs 路由

### 自动部署

推送到 `main` 分支会自动触发 Vercel 部署，部署成功后可在 Vercel 控制台查看分配的域名。

## 👥 贡献者

<!-- CONTRIBUTORS START -->
<a href="https://github.com/mantoujun12" title="mantoujun12"><img src="https://avatars.githubusercontent.com/u/202384594?v=4" width="80" alt="mantoujun12"/></a>
<a href="https://github.com/zswcft34567890" title="zswcft34567890"><img src="https://avatars.githubusercontent.com/u/300807762?v=4" width="80" alt="zswcft34567890"/></a>
<a href="https://github.com/mantoujun6" title="mantoujun6"><img src="https://avatars.githubusercontent.com/u/91870686?v=4" width="80" alt="mantoujun6"/></a>
<!-- CONTRIBUTORS END -->

## 👋 贡献指南

欢迎完善这个网站！提交之前请阅读 [CONTRIBUTING_zh-cn.md](CONTRIBUTING_zh-cn.md)。

简要流程：

1. Fork 本仓库
2. 创建特性分支（`git checkout -b feature/your-feature`）
3. 提交更改（`git commit -m "Add some feature"`）
4. 推送到远程分支（`git push origin feature/your-feature`）
5. 发起 Pull Request

### 📚 项目文档

- 📖 [贡献指南](CONTRIBUTING_zh-cn.md) — 如何参与贡献
- 🛡️ [安全政策](SECURITY_zh-cn.md) — 如何上报安全漏洞
- 💬 [获取支持](SUPPORT_zh-cn.md) — 获取帮助与提问
- 📜 [行为准则](CODE_OF_CONDUCT_zh-cn.md) — 社区公约

> 💡 English versions are available at the project root.

## 🛠️ 文档维护流程

文档维护采用"中文优先 → 翻译英文"的流程：

- 本文档 `docs/README_zh-cn.md` 为**主要维护源**，先用中文编写 / 更新。
- 完成后翻译为英文，对应到根目录的 [README.md](../README.md)。
- 同样地，[CONTRIBUTING_zh-cn.md](CONTRIBUTING_zh-cn.md) 为贡献指南的中文主要源，翻译版位于根目录的 [CONTRIBUTING.md](../CONTRIBUTING.md)。
- 提交修改时请优先在中文版上改动，再同步翻译；这样可以保证两个版本语义一致。

---

## 📑 许可证

本项目基于 [MIT 许可证](../LICENSE) 开源。

> 部分内容由AI生成（项目介绍、代码等）
