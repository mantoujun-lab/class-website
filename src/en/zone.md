---
title: Zones
description: Class zones & portals
layout: layouts/zone
permalink: /zone/
eleventyNavigation:
  key: en-zone
  title: 📌 Zones
  order: 4
---

{% from "macros/button.njk" import button %}
{% from "macros/card.njk" import card %}

<div class="cardzone-three-columns">
{%- for entry in collections['zone_' + locale] %}
{{ card(entry.data.title, entry.data.description or "", entry.url | url, entry.data.cta or ('common.enter' | i18n)) }}
{%- endfor %}
</div>

<div align="center">
{{ button("fa-solid fa-book-open", ('home.btnWiki' | i18n), ('/wiki/' | localUrl)) }}
</div>
