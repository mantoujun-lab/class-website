---
title: Discussion
description: 'Discussion board (GitHub account required)'
layout: layouts/main
cta: Visit
order: 3
permalink: /discussion/
---

{% from "macros/card.njk" import cardStandalone %}

# Discussion

You can discuss things here.

<div align="center">

{{ cardStandalone(
    "fa-brands fa-github",
    "GitHub account required",
    "Due to limitations, a GitHub account is needed to post comments.",
    bgColor="rgba(0, 0, 0, 0.1)") }}

</div>

<script src="https://giscus.app/client.js"
        data-repo="hjx-25pc1/hjx-25pc1.github.io"
        data-repo-id="R_kgDOTNNixA"
        data-category="Giscus|网站评论"
        data-category-id="DIC_kwDOTNNixM4DAxSG"
        data-mapping="pathname"
        data-strict="0"
        data-reactions-enabled="1"
        data-emit-metadata="1"
        data-input-position="top"
        data-theme="preferred_color_scheme"
        data-lang="{{ (lang or 'en') }}"
        data-loading="lazy"
        crossorigin="anonymous"
        async>
</script>
