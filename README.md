<div align="center">

![class-website](https://socialify.git.ci/mantoujun-lab/class-website/image?custom_language=HTML&font=Inter&language=1&name=1&pattern=Solid&theme=Auto)

[![Vercel](https://img.shields.io/badge/Vercel-000000?style=for-the-badge&logo=vercel&logoColor=white)](https://vercel.com)
[![License](https://img.shields.io/github/license/mantoujun-lab/class-website?style=for-the-badge)](https://github.com/mantoujun-lab/class-website/blob/main/LICENSE)
[![Eleventy](https://img.shields.io/badge/Eleventy-000000?style=for-the-badge&logo=eleventy&logoColor=white)](https://www.11ty.dev)
[![Nunjucks](https://img.shields.io/badge/nunjucks-green?logo=nunjucks&style=for-the-badge)](https://mozilla.github.io/nunjucks/)
[![SCSS](https://img.shields.io/badge/SCSS-CC6699?style=for-the-badge&logo=sass&logoColor=white)](https://sass-lang.com/)
[![JavaScript](https://img.shields.io/badge/JavaScript-black?style=for-the-badge&logo=javascript)](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript)

</div>

## 🔭 项目简介

本仓库托管 **2025 级计算机应用1班** 班级网站的源代码。网站用于展示班级风貌、分享学习资料、记录日常点滴，同时也是同学们学习 Web 开发的练手项目。

站点主要包含三大内容板块——**动态 / 文章 / 百科**——以及若干“专区”入口（讨论、学习、活动等）。

- **作者**：mantoujun-lab
- **许可证**：MIT
- **在线站点**：部署于 Vercel（连接仓库后分配域名）
- **仓库地址**：<https://github.com/mantoujun-lab/class-website>

### 页面元数据

所有内容页面都应包含以下 front matter：

```yaml
---
title: 页面标题            # 必填；用于 <title> 和页面头部
permalink: /page-slug/    # 语义化路径，不带语言前缀（由系统自动添加）
layout: layouts/default    # 布局模板
---
```

## 技术栈

本项目是一个完全静态的站点，基于以下技术构建：

- **[Eleventy (11ty)](https://www.11ty.dev/)** v3 — 静态站点生成器（SSG）
- **Nunjucks（`.njk`）** — 用于布局、可复用组件和页面渲染的模板引擎
- **Markdown（`.md`）** — 主要内容格式，便于书写与阅读
- **Sass / SCSS** — CSS 预处理器，编译为压缩后的 CSS
- **PostCSS + Autoprefixer** — 自动添加浏览器厂商前缀，提升兼容性
- **[@11ty/eleventy-img](https://www.11ty.dev/docs/plugins/image/)** — 响应式图片处理，自动生成多种尺寸的 `webp` 与 `jpeg`
- **[@11ty/eleventy-plugin-syntaxhighlight](https://www.11ty.dev/docs/plugins/syntaxhighlight/)** — Markdown 代码块的语法高亮
- **i18n 国际化** — 基于目录的多语言方案：
  - `lodash.get` + `templite` — 自定义 `i18n` 过滤器，支持变量插值
  - 目录数据文件（`*.11tydata.js` / `*.json`）— 为 `src/zh-cn/` 和 `src/en/` 自动注入语言与 permalink 前缀
  - 自定义过滤器：`i18n`（翻译）、`localUrl`（按语言生成 URL）、`switchLang`（语言切换 URL）、`lang`（当前语言代码）
- **原生 JavaScript（ES Modules）** — 少量客户端交互，脚本以原生 ES 模块组织在 `src/script/` 下，不依赖任何前端框架或打包工具
- **[@vercel/analytics](https://vercel.com/docs/analytics) 与 [@vercel/speed-insights](https://vercel.com/docs/speed-insights)** — 访问统计与真实用户性能监控，由 `src/script/main.js` 动态注入
- **GitHub Actions** — 自动化 CI/CD
- **Vercel** — 静态站点托管平台

## 🖥️ 开发要求

开始之前，请确保本地已安装以下工具：

| 工具          | 版本                          | 说明              |
| ----------- | --------------------------- | --------------- |
| **Node.js** | 24.x（LTS，建议使用最新 LTS 版本）    | 运行时与包管理        |
| **npm**     | 11.x 或更高（随 Node.js 一起安装）    | 依赖管理与脚本执行     |
| **Git**     | 最新稳定版                       | 版本控制与提交        |

## 💻 本地开发

按照以下步骤在本地启动开发服务器：

1. **克隆仓库**

   ```bash
   git clone https://github.com/mantoujun-lab/class-website.git
   cd class-website
   ```

2. **安装依赖**

   ```bash
   npm install
   ```

3. **启动开发服务器**（默认地址：<http://localhost:8080>，支持热更新）

   ```bash
   npm run serve
   ```

4. **构建一次**（不启动服务器，产物输出到 `_site/`）

   ```bash
   npm run build
   ```

5. **监听文件变化并自动重新构建**（不启动本地服务器）

   ```bash
   npm run watch
   ```

6. **同步知识库到 Wiki 仓库**（需要推送权限）

   ```bash
   npm run sync:wiki              # 默认推送到上游仓库的 Wiki
   # 指定目标 Wiki 仓库（例如在 fork 上运行时推送 fork 自己的 Wiki）：
   WIKI_REPO_URL=https://github.com/<owner>/<repo>.wiki.git npm run sync:wiki
   ```

   > 注意：GitHub Actions 的 `GITHUB_TOKEN` 只能推送当前仓库的 Wiki，
   > `sync-wiki.yml` 工作流会自动把 `WIKI_REPO_URL` 设为当前仓库的 Wiki 地址。

7. **打包发布版本**（在 `dist/` 下生成 `<name>-<version>-<date>-<short>.zip`）

   ```bash
   npm run release                # 从 package.json 读取版本号
   npm run release -- 1.2.3       # 显式指定版本号
   ```

8. **更新 `package.json` 中的版本号**（同时更新 `package-lock.json`）

   ```bash
   npm run bump -- patch          # 1.2.3 → 1.2.4
   npm run bump -- minor          # 1.2.3 → 1.3.0
   npm run bump -- major          # 1.2.3 → 2.0.0
   npm run bump -- 1.2.3          # 显式指定版本
   ```
   > 该命令使用 **bump-version.js** 脚本。

9. **重新生成贡献者头像墙**（与 `Generate contributors image` 工作流效果一致）

   ```bash
   npm run generate:contributors
   ```

## 🚀 部署

本项目已为 **Vercel** 部署做好准备

### 配置说明

项目根目录下的 `vercel.json` 包含完整的部署配置：

- **构建命令**：`npm run build`
- **输出目录**：`_site`
- **Clean URL**：已启用（`cleanUrls: true`）
- **尾部斜杠**：已启用（`trailingSlash: true`）
- **路由**：`cleanUrls` + `trailingSlash` 直接映射 Eleventy 生成的目录式页面（如 `/about/` → `_site/about/index.html`），无需自定义 rewrite

### 自动部署

推送到 `main` 分支会自动触发 Vercel 部署。部署成功后，可在 Vercel 控制台查看分配的域名。

## 👥 贡献者

<!-- CONTRIBUTORS START -->
<a href="https://github.com/mantoujun12" title="mantoujun12"><img src="https://avatars.githubusercontent.com/u/202384594?v=4" width="80" alt="mantoujun12"/></a>
<a href="https://github.com/zswcft34567890" title="zswcft34567890"><img src="https://avatars.githubusercontent.com/u/300807762?v=4" width="80" alt="zswcft34567890"/></a>
<a href="https://github.com/mantoujun6" title="mantoujun6"><img src="https://avatars.githubusercontent.com/u/91870686?v=4" width="80" alt="mantoujun6"/></a>
<!-- CONTRIBUTORS END -->

## 📊 统计信息

![Alt](https://repobeats.axiom.co/api/embed/7c0f674f2e91e3c96247c872ef2f4e202b86e11e.svg "Repobeats analytics image")

## 📑 许可证

本项目基于 [MIT 许可证](LICENSE)开源。
