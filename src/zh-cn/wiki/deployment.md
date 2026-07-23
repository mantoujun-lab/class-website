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
- **重写规则**：所有路径重写到 `/$1/index.html`，支持 SPA 风格路由

## 部署路径前缀

由于网站部署在根路径 `/`，所有资源引用必须使用 `| url` 过滤器：

```njk
<link rel="stylesheet" href="{{ '/style/base.css' | url }}">
```

## 贡献者头像墙

`.github/workflows/contributors.yml` 工作流会在 main 分支上自动维护"贡献者"区块：

- **触发方式**：Actions 页面手动 Run workflow
- **执行流程**：
  1. 调用 GitHub API 拉取贡献者列表
  2. 替换 `README.md` / `docs/README_zh-cn.md` / `src/index.md` 中 `<!-- CONTRIBUTORS START/END -->` 占位符内的内容
  3. 自动 commit 并 push 到 main
- **本地调试**：可以用 `ALLOW_FALLBACK=1` 环境变量使用占位数据运行

```bash
GITHUB_REPOSITORY=mantoujun-lab/class-website \
ALLOW_FALLBACK=1 \
npm run generate:contributors
```

> **提示**：占位符 `<!-- CONTRIBUTORS START -->` 和 `<!-- CONTRIBUTORS END -->` 一定要保留，否则 Action 找不到替换位置会跳过该文件。
