---
title: 文章
layout: layouts/article
permalink: /article/
eleventyNavigation:
  key: zh-cn-article
  title: 📰 文章
  order: 2
---

{% from "macros/card.njk" import cardEntry %}

<div class="card-full-list">
    {%- for entry in collections['article_' + locale] %}
    {{ cardEntry(
        entry.data.title,
        entry.data.description or "",
        entry.url | url,
        "查看详细信息",
        entry.data.date,
        entry.data.author
    ) }}
    {%- endfor %}
</div>
