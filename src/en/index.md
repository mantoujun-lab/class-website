---
title: Home - Class of 2025 Computer Applications
description: Official class website — study notes, events, and projects
layout: layouts/home
permalink: /
eleventyNavigation:
    key: en-home
    title: 🏠 Home
    order: 1
---

{% from "macros/button.njk" import button %}
{% from "macros/card.njk" import card, cardEntry %}

## {{ 'home.sectionZones' | i18n }}

<div class="cardzone-three-columns">
{%- for entry in collections['zone_' + locale] %}
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
{%- for entry in collections['event_' + locale] %}
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
{%- for entry in collections['article_' + locale] %}
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

> 🌐 This English site is currently in **early translation**. Most wiki entries and articles are still in Chinese. We're working on it — check back later, or switch to 简体中文 for the full content.
