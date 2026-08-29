![Cover](/public/cover.png)

<div align="center">

<!-- Badges -->

[![GitHub License](https://img.shields.io/github/license/mantoujun-lab/class-website?style=for-the-badge)](LICENSE)
[![GitHub Actions Workflow Status](https://img.shields.io/github/actions/workflow/status/mantoujun-lab/class-website/node.yml?style=for-the-badge)](https://github.com/mantoujun-lab/class-website/actions/workflows/node.yml)
[![Vercel](https://img.shields.io/badge/Vercel-black?style=for-the-badge&logo=Vercel)](https://vercel.com)
[![Astro](https://img.shields.io/badge/Astro-black?style=for-the-badge&logo=astro)](https://astro.build/)

<!-- Badges -->

</div>

## 👋 介绍

### 关于我们

这个网站由 **海南省经济技术学校** 25 级计算机应用 1 班的同学自发创建与维护。我们希望把班级里那些有趣的、实用的、值得记录的瞬间，沉淀到一个可以长期访问的地方，让每一位同学都能在这里找到属于自己的回忆。

### 项目原理

项目的源代码托管在 **GitHub** 上，使用 **Vercel** 进行自动化的网站部署，并借助 **GitHub Actions** 完成 `CI` 流程。每一次提交代码后，网站都会自动构建并发布，无需人工干预。

### 分享什么

只要是班级或学校中发生的有趣、实用、新鲜的事，并且内容可以公开，我们都会在网站上分享出来。这里既可以是课堂上的小发现，也可以是社团活动、校园风景、学习心得，或是任何值得被记住的瞬间。

## 🚀 项目

### 技术栈

- [Astro](https://astro.build) — 静态站点生成器，提供极快的页面加载速度与现代化的开发体验
- [TypeScript](https://www.typescriptlang.org/) — 为 JavaScript 加上静态类型支持，让代码更健壮、更易于维护
- [Node.js](https://nodejs.org/) 22.12+ — 本地开发与构建所需的运行时环境
- [Vercel](https://vercel.com) — 托管与部署平台，提供全球 CDN 与自动化发布能力
- [GitHub Actions](https://github.com/features/actions) — 持续集成与持续部署（CI/CD）工具

### 本地构建

在开始之前，请确保你的电脑上已经安装了 Node.js 22.12 或更高版本。

````bash
# 克隆仓库
git clone https://github.com/mantoujun-lab/class-website.git # git
gh repo clone mantoujun-lab/class-website # Github CLI

# 进入项目目录
cd class-website

# 安装依赖
npm install

# 启动本地开发服务器
npm run dev

# 构建生产版本
npm run build

# 本地预览构建产物
npm run preview
````

启动开发服务器后，打开浏览器访问 [http://localhost:4321](http://localhost:4321) 即可预览网站。

### 杂项

如需部署到自己的环境，可参考 [Astro 部署指南](https://docs.astro.build/en/guides/deploy/)，支持 Vercel、Netlify、Cloudflare Pages 等多种平台。

## 🤝 贡献

### 提出建议

如果你对网站有任何想法或建议，欢迎通过 [GitHub Issues](https://github.com/mantoujun-lab/class-website/issues) 提出。无论是新的功能、内容的策划，还是页面的小改进，我们都非常乐意倾听。

### 参与贡献

欢迎任何 **同学/校友/外部开发者** 参与到项目中来。贡献的方式非常多样：

- 🐛 提交 Issue 反馈 Bug 或提出建议
- 💡 发起 Pull Request 贡献代码或内容
- ✍️ 撰写并分享班级故事、校园资讯
- ⭐ 给项目点个 Star，这是对开发者最大的支持

在提交 Pull Request 之前，请先 Fork 仓库并创建一个新的分支。提交信息建议遵循项目中的约定式提交规范（Conventional Commits），例如 `feat: 新增留言板页面`、`fix: 修复首页图片加载异常` 等。

### 赞赏开发者

如果你愿意支持，可以扫描下方的微信赞赏码

项目维护不易，感谢你的鼓励 ☕

<img src="./public/funding_wechat.png" alt="微信赞赏码" width="240" />

## 📄 许可证

本项目使用 [MIT License](LICENSE) 开源。可以自由地使用、修改和分发本项目的代码与内容。
