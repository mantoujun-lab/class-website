---
title: 分区
description: 你可以在这里找到你需要的专区、链接等内容
layout: layouts/zone
eleventyNavigation:
  key: zone
  title: 📌 分区
  order: 4
---

{% from "macros/button.njk" import button %}
{% from "macros/card.njk" import card, cardFull, cardStandalone %}

<div class="cardzone-three-columns">
{%- for entry in collections.zone %}
{{ card(entry.data.title, entry.data.description or "", entry.url | url, entry.data.cta or "进入") }}
{%- endfor %}
</div>

<div align="center">
{{ button("fa-solid fa-book-open", "进入班级 Wiki", "/wiki.html") }}
</div>