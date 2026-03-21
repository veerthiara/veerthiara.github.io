---
title: Projects
nav_order: 2
has_children: true
description: Ongoing builds, architecture notes, and implementation direction.
---

{% assign project_children = site.html_pages | where: "parent", "Projects" | sort: "nav_order" %}

{% for project in project_children %}
## {{ project.title }}
{{ project.content | markdownify | strip_html | truncate: 180 }}

[Open project page]({{ project.url | relative_url }})
{% endfor %}
