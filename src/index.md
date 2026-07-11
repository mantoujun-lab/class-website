---
title: 25级计算机应用1班|首页
layout: layouts/home
eleventyNavigation:
    key: home
    title: 🏠 首页
    order: 1
---

{% from "macros/button.njk" import button %}
{% from "macros/card.njk" import card, cardFull, cardStandalone %}

## 关于我们

<div align="center">

我们是**25级计算机应用1班**，一个由 **37** 名同学组成的小集体

{{ button("fa-solid fa-arrow-right", "了解更多", "/about.html", btnColor="rgb(200, 255, 200)", textColor="rgb(0, 0, 0)", btnHover="rgb(150, 200, 150)", btnBorder="rgb(150,200, 150)") }}
</div>

## 分区

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

## 文章

<div class="card-full-list">
{%- for entry in collections.article %}
{%- if loop.index <= 15 %}
{{ cardFull(entry.data.title,entry.data.description or "",entry.url | url,"查看详细信息") }}
{%- endif %}
{%- endfor %}
</div>

## 贡献者

<!-- CONTRIBUTORS START -->
<a href="https://github.com/mantoujun12" title="mantoujun12"><img src="https://avatars.githubusercontent.com/u/202384594?v=4" width="80" alt="mantoujun12"/></a>
<a href="https://github.com/zswcft34567890" title="zswcft34567890"><img src="https://avatars.githubusercontent.com/u/300807762?v=4" width="80" alt="zswcft34567890"/></a>
<a href="https://github.com/mantoujun6" title="mantoujun6"><img src="https://avatars.githubusercontent.com/u/91870686?v=4" width="80" alt="mantoujun6"/></a>
<!-- CONTRIBUTORS END -->

## 友情链接

<div align="center">
{{ button("fa-solid fa-smile", "mantoujun12 的个人网站", "https://mantoujun12.github.io") }}

{{ button("fa-solid fa-school", "海经校网站", "http://www.hnjjx.com", btnColor="rgb(255, 150, 0)", btnHover="rgb(200, 150, 0)", btnBorder="rgb(200, 150, 0)") }}
</div>

## 卡片信息

{{ cardStandalone(
    "fa-solid fa-arrows-rotate",
    "流动更新",
    "内容会实时更新，因此每天看到的内容可能都会不一样",
    bgColor="rgba(171, 234, 114, 0.1)"
) }}