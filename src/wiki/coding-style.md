---
title: 代码规范
description: 班级网站的代码风格约定
layout: layouts/wiki
order: 2
---

# 代码规范

> 业余项目，以「能看懂、能维护」为目标，不必过度工程化。

## 样式

- SCSS 文件放在 `src/style/`，下划线开头为 partial
- 变量集中放 `_variables.scss`，混入放 `_mixins.scss`
- 压缩后输出，启用 Autoprefixer

## 脚本

- 原生 ES Modules，无打包器
- 优先 `const` / `let`，**业务代码不用 `var`**
- 字符串统一单引号；缩进 4 空格；中文注释
- 拆分粒度：纯工具 → `initXxx(deps)` 函数
- 完整规范见 `.trae/rules/js.md`

## Markdown

- 中文与英文之间加一个空格
- 使用 GFM 语法

## HTML

- 能用语义化标签就用语义化标签（`<header>` / `<nav>` / `<main>` 等）
- 图片顺手补个 `alt`，不知道写啥就先空着也别忘
- 链接文案写清楚，别用「点击这里」

## 命名

- 文件名用连字符：`class-photo.scss`
- JS 变量、函数用 camelCase
- CSS 类名看着顺眼、统一就行，不必死守 BEM

## Git

- commit message 简单写清楚改了什么就行，比如「修复首页轮播图错位」
- 改一个事情就提一次，别攒一大坨
- 不要乱写 commit ，比如写"我是sb"😇