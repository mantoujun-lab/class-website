---
title: Articles
layout: layouts/article
permalink: /article/
eleventyExcludeFromCollections: true
eleventyNavigation:
  key: article
  title: 📰 Articles
  order: 2
---

{% from "macros/card.njk" import cardEntry %}

> 🌐 Most articles are still in Chinese. We're translating them step by step.

<div class="card-full-list">
    {%- for entry in collections.article %}
    {{ cardEntry(
        entry.data.title,
        entry.data.description or "",
        entry.url | url,
        ("common.viewDetail" | i18n),
        entry.data.date,
        entry.data.author
    ) }}
    {%- endfor %}
</div>