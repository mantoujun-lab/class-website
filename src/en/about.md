---
title: About Us
layout: layouts/main
permalink: /about/
description: About Class of 2025 — Computer Applications, Hainan Technical and Economic School
eleventyNavigation:
    key: en-about
    title: ℹ️ About
    order: 7
---

{% from "macros/card.njk" import card, cardStandalone %}
{% from "macros/button.njk" import button %}

# About Us

We are **Class 1 of 2025 Computer Applications** from [**Hainan Technical and Economic School**](http://hnjjx.com/) — a class organization founded and maintained by the students themselves.

We are a real class at school, and at the same time a group of peers who share an interest in web development, programming, and open-source collaboration. Beyond daily coursework and class affairs, we run our official website, class wiki, discussion board, and other digital spaces together — **bringing our class life to the internet**.

{{ cardStandalone(
    "fa-solid fa-bullseye",
    "Our Goals",
    "Leave behind a digital archive of our class; learn by building a real project; give every classmate a place to contribute.",
    bgColor="rgba(255, 248, 220, 0.6)",
    textColor="#5a4a00"
) }}

## 🎯 What We Do

Around the class, we keep collaborating on **GitHub**:

<div class="cardzone-three-columns">
{{ card(
    "🏠 Class Website",
    "Our window to the world, showing what the class is like.",
    ("/" | localUrl),
    "Back to Home"
) }}
{{ card(
    "📚 Class Wiki",
    "Study notes, writing guides, API references, and deployment docs.",
    ("/wiki/" | localUrl),
    "Browse the Wiki"
) }}
{{ card(
    "🔔 Event Log",
    "Important events, activities, and everyday moments of the class.",
    ("/event/" | localUrl),
    "View Events"
) }}
{{ card(
    "📰 Articles",
    "Technical notes, essays, and reflections written by classmates.",
    ("/article/" | localUrl),
    "Read Articles"
) }}
{{ card(
    "💬 Discussion",
    "An open discussion space based on GitHub Issues / Giscus.",
    ("/discussion/" | localUrl),
    "Join the Discussion"
) }}
{{ card(
    "🛠️ Open Source",
    "Deployed automatically with GitHub Actions; everyone is welcome to contribute PRs.",
    "https://github.com/mantoujun-lab/class-website",
    "View the Repo",
    target="_blank"
) }}
</div>

## 👥 Team & Roles

There is no strict hierarchy — we are more like a collaboration group where "whoever is free steps up":

- **Webmaster / Maintainers** — site deployment, releases, wiki sync
- **Content Contributors** — wiki articles, class events, activity reports
- **Developers** — frontend code, styles, and scripts
- **Every Classmate** — join through Issues, PRs, or the discussion board

> No contribution is too small — from fixing a typo to writing a long article, it all counts ✨

## 🌟 What We Value

<div class="cardzone-three-columns">
{{ cardStandalone(
    "fa-solid fa-handshake",
    "Open & Shared",
    "Class materials and study notes are public to everyone by default.",
    grid=true
) }}

{{ cardStandalone(
    "fa-solid fa-language",
    "Chinese First",
    "Docs are primarily maintained in Chinese, then translated into English.",
    grid=true
) }}

{{ cardStandalone(
    "fa-solid fa-flask",
    "Learn by Doing",
    "Learn web development through a real project — hands-on, not just watching.",
    grid=true
) }}

{{ cardStandalone(
    "fa-solid fa-shield-halved",
    "Friendly Community",
    "Follow the code of conduct and keep discussions respectful and inclusive.",
    grid=true
) }}
</div>

## 📬 Join Us

{{ cardStandalone(
    "fa-brands fa-github",
    "Three Steps to Contribute",
    "① Create a GitHub account; ② request to join the hjx-25pc1 organization (or tell us your username and we'll invite you); ③ submit an Issue or Pull Request."
) }}

<div align="center">
{{ button("fa-solid fa-book", "Read the Project README", "https://github.com/mantoujun-lab/class-website/blob/main/README.md", target="_blank") }}
{{ button("fa-brands fa-github", "Submit Issue / PR", "https://github.com/mantoujun-lab/class-website", target="_blank") }}
</div>

---

> Even jotting down one activity photo or one idea counts as part of our shared class memory. (｡･ω･｡)ﾉ
