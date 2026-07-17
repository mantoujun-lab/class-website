---
title: Wiki
description: 25 级计算机应用 1 班的集体 Wiki
layout: layouts/wiki
permalink: /wiki/
eleventyNavigation:
  key: zh-cn-wiki
  title: 📚 Wiki
  order: 3
---

# Wiki

这里是 25 级计算机应用 1 班的集体 Wiki，由同学们共同维护。

## 如何贡献

在 <code>src/{{ (locale or 'zh-cn') }}/wiki/</code> 目录下新建 <code>.md</code> 文件，按以下模板填写：

```
---
title: 你的标题
description: 你的简介
layout: layouts/wiki
order: #顺序
wikiCategory: 可选,子目录
wikiCategoryOrder: 可选,子目录顺序
---

正文内容...
```

## 所有条目

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