---
permalink: /index.html
layout: layouts/redirect.njk
eleventyExcludeFromCollections: true
---
{# 此页面作为根路径 / 的 JS 跳板，由 src/_includes/layouts/redirect.njk 渲染。
   放在 src/ 顶层（不在 zh-cn/ 或 en/ 下），避免被 permalink override 加 locale 前缀。
   eleventyExcludeFromCollections: true 让它不进入 wiki/event/article 等集合。 #}