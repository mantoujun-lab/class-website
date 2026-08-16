---
title: 部署指南
description: 如何部署班级网站
layout: layouts/wiki
permalink: /wiki/deployment/
order: 3
---

# 部署指南

## Vercel 自动部署

本项目已配置为在 Vercel 上自动部署：

1. 将仓库连接到 Vercel
2. 推送到 `main` 分支会触发自动部署
3. Vercel 会执行 `npm run build` 并部署 `_site/` 目录
4. 部署成功后会自动分配域名

## 配置说明

项目根目录的 `vercel.json` 包含以下配置：

- **构建命令**：`npm run build`
- **输出目录**：`_site`
- **简洁 URL**：启用（`cleanUrls: true`）
- **尾部斜杠**：启用（`trailingSlash: true`）
- **路由规则**：`cleanUrls` + `trailingSlash` 会把 `/about/` 这类路径直接映射到 `_site/about/index.html`，无需自定义 rewrite（原 catch-all rewrite 已移除，避免与静态资源路径冲突）

## Vercel Analytics 与 Speed Insights

本项目已集成 Vercel 提供的 Web Analytics 和 Speed Insights 功能，用于监控网站访问数据和性能指标：

- **Web Analytics**：跟踪页面访问量（pageview）和自定义事件
- **Speed Insights**：收集真实用户的性能指标（LCP、FCP、CLS 等）

### 实现方式

项目使用了纯静态注入方案，在 `src/script/main.js` 末尾动态加载 Vercel 提供的边缘函数：

```javascript
// 动态注入 /_vercel/insights/script.js
// 动态注入 /_vercel/speed-insights/script.js
```

这两个脚本由 Vercel 平台在部署后自动提供，会在页面加载后异步收集数据并上报。

### 本地开发

本地开发服务器（localhost / 127.0.0.1）不会加载这些脚本，避免产生 404 错误。只有在 Vercel 部署后的生产环境中，Analytics 和 Speed Insights 才会生效。

### 查看数据

部署成功后，可在 Vercel 控制台的 **Analytics** 和 **Speed Insights** 标签页查看实时数据和历史报告。

## 部署路径前缀

由于网站部署在根路径 `/`，所有资源引用必须使用 `| url` 过滤器：

```njk
<link rel="stylesheet" href="{{ '/style/base.css' | url }}">
```

## 贡献者头像墙

`.github/workflows/contributors.yml` 工作流会在 main 分支上自动维护"贡献者"区块：

- **触发方式**：Actions 页面手动 Run workflow、push 到 `main`、每周定时（周日 03:00 UTC）
- **执行流程**：
  1. 调用 GitHub API 拉取贡献者列表（默认排除机器人与匿名贡献者）
  2. 根据 `templates/contributors.tpl.md` 生成 `CONTRIBUTORS.md`（头像墙 + 贡献榜）
  3. 替换 `README.md` / `src/zh-cn/index.md` / `src/en/index.md` 中 `<!-- CONTRIBUTORS START/END -->` 占位符内的内容
  4. 自动 commit 并 push 到 main
- **本地调试**：可以用 `ALLOW_FALLBACK=1` 环境变量使用占位数据运行

```bash
GITHUB_REPOSITORY=mantoujun-lab/class-website \
ALLOW_FALLBACK=1 \
npm run generate:contributors
```

> **提示**：占位符 `<!-- CONTRIBUTORS START -->` 和 `<!-- CONTRIBUTORS END -->`（`CONTRIBUTORS.md` 还需要 `<!-- CONTRIBUTORS TABLE START/END -->`）一定要保留，否则 Action 找不到替换位置会跳过该文件。
