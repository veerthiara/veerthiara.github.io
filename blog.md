---
title: Blog
nav_order: 4
permalink: /blog/
description: Build notes, architectural decisions, and project journal entries.
---

{% for post in site.posts %}
- [{{ post.title }}]({{ post.url }}) — {{ post.date | date: "%B %d, %Y" }}
{% endfor %}
