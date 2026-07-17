---
title: 讨论区
description: '[需要Github 账户]可以在这里讨论一些事情'
layout: layouts/main
cta: 前往
order: 3
permalink: /discussion/
eleventyNavigation:
  key: zh-cn-discussion
  title: 💬 讨论
  order: 3
  parent: zh-cn-zone
---

{% from "macros/card.njk" import cardStandalone %}

# 讨论

你可以在这里讨论一些内容

<div align="center">

{{ cardStandalone(
    "fa-brands fa-github",
    "需要 Github 账户",
    "因为一些限制，需要账户才能发评论",
    bgColor="rgba(0, 0, 0, 0.1)") }}

</div>

<script src="https://giscus.app/client.js"
        data-repo="hjx-25pc1/hjx-25pc1.github.io"
        data-repo-id="R_kgDOTNNixA"
        data-category="Giscus|网站评论"
        data-category-id="DIC_kwDOTNNixM4DAxSG"
        data-mapping="pathname"
        data-strict="0"
        data-reactions-enabled="1"
        data-emit-metadata="1"
        data-input-position="top"
        data-theme="preferred_color_scheme"
        data-lang="{{ (lang or 'zh-CN') }}"
        data-loading="lazy"
        crossorigin="anonymous"
        async>
</script>