---
title: 新手指南
description: 第一次参与班级网站？这里教你如何贡献内容
layout: layouts/wiki
permalink: /wiki/getting-started/
order: 1
---

# 新手指南

欢迎加入！这里教你如何参与班级网站的建设。

## 如何贡献一篇文章

1. Fork 仓库到你的 GitHub 账号
2. Clone 到本地：`git clone https://github.com/<你的用户名>/hjx-25pc1.github.io.git`
3. 新建分支：`git checkout -b add-event-<日期>`
4. 在 `src/event-<日期>.md` 创建文件，文件名请使用英文小写、数字和短横线
5. 编辑内容，文章顶部请加上 frontmatter，包含 title、description、layout、permalink、order 等信息
6. 本地运行构建检查：`npm install` 后 `npm run dev`
7. 提交更改：`git add .` / `git commit -m "Add event <日期>"` / `git push origin add-event-<日期>`
8. 在 GitHub 上发起 PR，填写清晰的标题和说明，说明你做了哪些改动
9. 等待审核，审核通过后自动部署到网站

## 如何参与 Wiki

和写文章类似，只需要在 `src/wiki/` 目录下新建或编辑 `.md` 文件。
- 新增页面前先检查现有目录是否已有类似主题
- 文件名应使用英文小写、短横线分隔，方便管理和链接
- Wiki 页面需要包含完整标题、描述和清晰的段落结构
- 修改他人内容时，在 PR 描述中说明改动原因和内容范围

## 注意事项

- 中文与英文之间加一个空格
- 代码块使用三反引号格式
- 图片上传到 `src/assets/images/`，并在 Markdown 中使用相对路径
- 提交前先本地构建验证，确认没有报错
- 文字尽量简洁、结构清晰，避免重复
- 如果不确定格式，可参考已有文章和 Wiki 页面模板
