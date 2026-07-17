---
title: 首页 - 25级计算机应用1班
description: 海经校 25 计算机 1 班官方班级主页 —— 记录学习心得、笔记、事件与项目
layout: layouts/home
permalink: /
eleventyExcludeFromCollections: true
eleventyNavigation:
    key: home
    title: 🏠 首页
    order: 1
---

{% from "macros/button.njk" import button %}
{% from "macros/card.njk" import card, cardEntry %}

## {{ 'home.sectionZones' | i18n }}

<div class="cardzone-three-columns">
{%- for entry in collections.zone %}
{%- if loop.index <= 3 %}
{{ card(entry.data.title, entry.data.description or "", entry.url | url, entry.data.cta or ('common.enter' | i18n)) }}
{%- endif %}
{%- endfor %}
</div>

<div align="center">
{{ button("fa-solid fa-book-open", ('home.btnWiki' | i18n), ('/wiki/' | localUrl)) }}

{{ button("fa-solid fa-arrow-right", ('home.btnMoreZones' | i18n), ('/zone/' | localUrl)) }}
</div>

## {{ 'home.sectionEvents' | i18n }}

<div class="card-entry-list">
{%- for entry in collections.event %}
{%- if loop.index <= 5 %}
{{ cardEntry(entry.data.title, entry.data.description or "", entry.url | url, ('common.viewDetail' | i18n), entry.data.date, entry.data.author) }}
{%- endif %}
{%- endfor %}
</div>

<div align="right">
{{ button("fa-solid fa-arrow-right", ('home.btnMoreEvents' | i18n), ('/event/' | localUrl)) }}
</div>

## {{ 'home.sectionArticles' | i18n }}

<div class="card-entry-list">
{%- for entry in collections.article %}
{%- if loop.index <= 15 %}
{{ cardEntry(entry.data.title, entry.data.description or "", entry.url | url, ('common.viewDetail' | i18n), entry.data.date, entry.data.author) }}
{%- endif %}
{%- endfor %}
</div>

<div align="right">
{{ button("fa-solid fa-arrow-right", ('home.btnMoreArticles' | i18n), ('/article/' | localUrl)) }}
</div>

## {{ 'home.sectionContribs' | i18n }}

<!-- CONTRIBUTORS START -->
<a href="https://github.com/mantoujun12" title="mantoujun12"><img src="https://avatars.githubusercontent.com/u/202384594?v=4" width="80" alt="mantoujun12"/></a>
<a href="https://github.com/zswcft34567890" title="zswcft34567890"><img src="https://avatars.githubusercontent.com/u/300807762?v=4" width="80" alt="zswcft34567890"/></a>
<a href="https://github.com/mantoujun6" title="mantoujun6"><img src="https://avatars.githubusercontent.com/u/91870686?v=4" width="80" alt="mantoujun6"/></a>
<!-- CONTRIBUTORS END -->