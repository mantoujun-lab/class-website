---
title: 关于我们
layout: layouts/main
description: 海南省经济技术学校 25 级计算机应用 1 班组织介绍
eleventyNavigation:
    key: about
    title: ℹ️ 关于
    order: 7
---

{% from "macros/card.njk" import card, cardFull, cardStandalone %}
{% from "macros/button.njk" import button %}

# 关于我们

我们是来自 [**海南省经济技术学校**](http://hnjjx.com/) 的
**25 级计算机应用 1 班**(简称"海经校 25 计算机 1"),一个由同学们自发组建、共同维护的班集体组织。

我们既是学校里一个真实存在的班级,也是一群对 Web 开发、编程、开源协作感兴趣的同龄人。除了日常的学习与班级事务,我们还共同运营着班级的官方网站、班级 Wiki、讨论区等数字化内容,**把我们的班级生活搬到了互联网上**。

{{ cardStandalone(
    "fa-solid fa-bullseye",
    "我们的目标",
    "留下一份属于我们的「数字档案」;在学习专业课的同时,动手做一个真正的项目;让每一位同学都能找到自己的位置。",
    bgColor="rgba(255, 248, 220, 0.6)",
    textColor="#5a4a00"
) }}

## 🎯 我们在做什么

围绕班级,我们持续在使用 **GitHub** 做这些事情:

<div class="cardzone-three-columns">
{{ card(
    "🏠 班级主页",
    "展示班级风貌,作为对外窗口。",
    "/",
    "回到首页"
) }}
{{ card(
    "📚 班级 Wiki",
    "沉淀学习资料、写作规范、API 参考、部署指南等知识文档。",
    "/wiki.html",
    "浏览 Wiki"
) }}
{{ card(
    "🔔 事件记录",
    "记录班级里的重要事件、活动与日常。",
    "/event.html",
    "查看事件"
) }}
{{ card(
    "📰 文章分享",
    "同学撰写的技术笔记、随笔与心得。",
    "/article.html",
    "阅读文章"
) }}
{{ card(
    "💬 讨论区",
    "基于 GitHub Issues / Giscus 的开放讨论空间。",
    "/discussion.html",
    "前往讨论"
) }}
{{ card(
    "🛠️ 开源协作",
    "使用 GitHub Actions 自动部署,鼓励同学提交 PR 参与共建。",
    "https://github.com/hjx-25pc1/hjx-25pc1.github.io",
    "查看仓库",
    target="_blank"
) }}
</div>

## 👥 团队与角色

我们没有严格的层级,更像是「谁有空谁就顶上」的协作小组:

- **站长 / 维护者** — 负责网站部署、版本发布、Wiki 同步
- **内容贡献者** — 撰写 Wiki 文章、班级事件、活动报道
- **开发者** — 参与前端代码、样式、脚本的改进
- **每一位同学** — 都可以通过 Issue、PR 或讨论区参与进来

> 贡献不分大小,从改一个错别字到写一篇长文,都是一份贡献 ✨

## 🌟 我们倡导

{{ cardStandalone(
    "fa-solid fa-handshake",
    "开放共享",
    "班级资料、学习笔记默认对所有人可见。"
) }}

{{ cardStandalone(
    "fa-solid fa-language",
    "中文优先",
    "文档以中文为主要维护语言,再翻译为英文。"
) }}

{{ cardStandalone(
    "fa-solid fa-flask",
    "动手实践",
    "在真实项目中学习 Web 开发,不做「只看不写」。"
) }}

{{ cardStandalone(
    "fa-solid fa-shield-halved",
    "友好社区",
    "遵守行为准则,营造尊重、包容的讨论氛围。"
) }}

## 📬 加入协作

{{ cardStandalone(
    "fa-brands fa-github",
    "三步即可参与",
    "① 创建 GitHub 账户;② 申请加入 hjx-25pc1 组织(或提供用户名主动邀请你);③ 提交 Issue 或 Pull Request。"
) }}

<div align="center">
{{ button("fa-solid fa-book", "阅读项目 README", "https://github.com/hjx-25pc1/hjx-25pc1.github.io/blob/main/docs/README_zh-cn.md", target="_blank") }}
{{ button("fa-brands fa-github", "提交 Issue / PR", "https://github.com/hjx-25pc1/hjx-25pc1.github.io", target="_blank") }}
</div>

---

> 哪怕只是把一张活动照片、一个想法写下来,也都是我们共同的班级记忆。(｡･ω･｡)ﾉ
