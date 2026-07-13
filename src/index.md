---
title: 25级计算机应用1班|首页
description: 海经校 25 计算机 1 班官方班级主页 —— 记录学习心得、笔记、事件与项目
layout: layouts/home
eleventyNavigation:
    key: home
    title: 🏠 首页
    order: 1
---

{% from "macros/button.njk" import button %}
{% from "macros/card.njk" import card, cardFull, cardStandalone %}

## 📌 分区

<div class="cardzone-three-columns">
{%- for entry in collections.zone %}
{%- if loop.index <= 3 %}
{{ card(entry.data.title, entry.data.description or "", entry.url | url, entry.data.cta or "进入") }}
{%- endif %}
{%- endfor %}
</div>

<div align="center">
{{ button("fa-solid fa-book-open", "进入班级 Wiki", "/wiki.html") }}

{{ button("fa-solid fa-arrow-right", "更多分区", "/zone.html") }}
</div>

## 🔔 事件

<div class="card-full-list">
{%- for entry in collections.event %}
{%- if loop.index <= 5 %}
{{ cardFull(entry.data.title,entry.data.description or "",entry.url | url,"查看详细信息") }}
{%- endif %}
{%- endfor %}
</div>

## 📰 文章

<div class="card-full-list">
{%- for entry in collections.article %}
{%- if loop.index <= 15 %}
{{ cardFull(entry.data.title,entry.data.description or "",entry.url | url,"查看详细信息") }}
{%- endif %}
{%- endfor %}
</div>

## 👥 贡献者

<!-- CONTRIBUTORS START -->
<a href="https://github.com/mantoujun12" title="mantoujun12"><img src="https://avatars.githubusercontent.com/u/202384594?v=4" width="80" alt="mantoujun12"/></a>
<a href="https://github.com/zswcft34567890" title="zswcft34567890"><img src="https://avatars.githubusercontent.com/u/300807762?v=4" width="80" alt="zswcft34567890"/></a>
<a href="https://github.com/mantoujun6" title="mantoujun6"><img src="https://avatars.githubusercontent.com/u/91870686?v=4" width="80" alt="mantoujun6"/></a>
<!-- CONTRIBUTORS END -->