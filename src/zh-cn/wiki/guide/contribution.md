---
title: 贡献流程
description: 提交 Wiki 条目的流程
layout: layouts/wiki
permalink: /wiki/guide/contribution/
order: 2
wikiCategory: 📝 入门指南
wikiCategoryOrder: 1
---

# 贡献流程

1. Fork 仓库
2. 在 `src/zh-cn/wiki/<分类>/xxx.md` 新建文件
3. 提交 PR

## 注意事项

- 贡献者头像墙（`README.md` / `src/zh-cn/index.md` / `src/en/index.md`）以及 `CONTRIBUTORS.md` 中 `<!-- CONTRIBUTORS START/END -->`（`CONTRIBUTORS.md` 还有 `<!-- CONTRIBUTORS TABLE START/END -->`）之间的内容由 GitHub Action 自动生成，**不要手动修改**，否则下次 Action 跑时会被覆盖
- 头像是 GitHub 自动拉取的，无需手动同步
## 提交身份规范

- 提交前确认 Git 身份与你的 GitHub 账号一致：

  ```bash
  git config user.name "你的 GitHub 用户名"
  git config user.email "12345678+用户名@users.noreply.github.com"   # 你的 GitHub noreply 邮箱
  ```

- **AI 编程助手（Trae / Copilot 等）代为提交时**，同样使用你的真实身份或 GitHub noreply 邮箱，不要使用 `xxx@example.com` 这类假邮箱，否则贡献者统计会被拆散、无法溯源。
- 仓库根目录的 `.mailmap` 已把历史提交中的别名（如「一张白纸」「一张黑纸」）与假邮箱统一映射，可用 `git shortlog -sne` 验证统计结果。
