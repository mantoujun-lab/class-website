---
title: Events
description: Class events and activities
layout: layouts/zone
cta: Visit
order: 2
permalink: /event/
---

{% from "macros/card.njk" import cardEntry %}

<div class="card-entry-list">
    {%- for entry in collections['event_' + locale] %}
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