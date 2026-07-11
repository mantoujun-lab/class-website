---
title: 文章
layout: layouts/article
eleventyNavigation:
  key: article
  title: 📰 文章
  order: 2
---

{% from "macros/button.njk" import button %}
{% from "macros/card.njk" import card, cardFull, cardStandalone %}

<div class="card-full-list">
    {%- for entry in collections.article %}
    {{ cardFull(
        entry.data.title,
        entry.data.description or "",
        entry.url | url,
        "查看详细信息"
    ) }}
    {%- endfor %}
</div>