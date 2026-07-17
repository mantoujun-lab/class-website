---
title: Wiki
description: Class Wiki (English)
layout: layouts/wiki
permalink: /wiki/
eleventyNavigation:
  key: en-wiki
  title: 📚 Wiki
  order: 3
---

# Wiki

Welcome to our class Wiki!

> 🌐 **Translation status**: English wiki entries are still being translated. For now, please refer to the [简体中文 Wiki](/zh-cn/wiki/) for the complete content.

## How to contribute

Create a new `.md` file under <code>src/{{ (locale or 'en') }}/wiki/</code>:

```
---
title: Your title
description: Your description
layout: layouts/wiki
permalink: /wiki/your-slug/
order: 1
---

Body content...
```

## All entries

<ul class="wiki-list">
    {%- for entry in collections['wiki_' + locale] %}
    <li>
        <a href="{{ entry.url | url }}">{{ entry.data.title }}</a>
        {%- if entry.data.description %}
        <span class="wiki-list-desc">— {{ entry.data.description }}</span>
        {%- endif %}
    </li>
    {%- endfor %}
</ul>