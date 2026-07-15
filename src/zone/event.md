---
title: 事件
description: 班级里的一些事件
layout: layouts/zone
cta: 进入
order: 2
permalink: /event/
eleventyNavigation:
  key: discussion
  title: 🔔 事件
  order: 1
  parent: zone
---

{% from "macros/card.njk" import cardEntry %}

<div class="card-full-list">
    {%- for entry in collections.event %}
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