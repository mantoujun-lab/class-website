---
title: 部署指南
description: 如何部署班级网站
layout: layouts/wiki
permalink: /wiki/deployment/
order: 3
---

# 部署指南

## 自动部署

`main` 分支的 `push` 会触发 GitHub Actions：

1. `npm ci` 安装依赖
2. `npm run build` 构建
3. 上传 `_site/` 工件
4. 部署到 GitHub Pages

## 手动部署

在 GitHub Actions 页面选择 `Deploy static content to Pages`，点击 `Run workflow`。

## 部署路径前缀

由于部署在根路径 `/`，所有资源引用必须用 `| url` 过滤器：

```njk
<link rel="stylesheet" href="{{ '/style/base.css' | url }}">
```

## 贡献者头像墙

`Generate contributors image` 工作流（`.github/workflows/contributors.yml`）会在 main 上自动维护"贡献者"区块：

- **触发方式**：Actions 页面手动 Run workflow
- **执行流程**：
  1. 调 GitHub API 拉取贡献者列表
  2. 替换 `README.md` / `docs/README_zh-cn.md` / `src/index.md` 中 `<!-- CONTRIBUTORS START/END -->` 占位符内的内容
  3. 自动 commit 并 push 到 main
- **联动部署**：`static.yml` 的 `push.paths` 已包含 `README.md` 和 `docs/README_zh-cn.md`，因此当 README 被修改后，部署工作流会自动重新跑一遍，网站与 README 上的头像墙保持一致
- **本地调试**：可以用 `ALLOW_FALLBACK=1` 环境变量使用占位数据跑

```bash
GITHUB_REPOSITORY=hjx-25pc1/hjx-25pc1.github.io \
ALLOW_FALLBACK=1 \
npm run generate:contributors
```

> **提示**：占位符 `<!-- CONTRIBUTORS START -->` 和 `<!-- CONTRIBUTORS END -->` 一定要保留，否则 Action 找不到替换位置会跳过该文件。