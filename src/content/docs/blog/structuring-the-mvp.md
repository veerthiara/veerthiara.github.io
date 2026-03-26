---
title: Structuring the MVP
description: Defining the first version clearly before adding more surface area.
editUrl: false
head: []
template: doc
sidebar:
  hidden: false
  attrs: {}
pagefind: true
draft: false
---

With the core tech choices in place, the next step is defining what the MVP actually includes.

## MVP Scope

The first version focuses on:

1. logging habits day by day
2. viewing current streaks
3. generating a simple daily summary from a LangGraph workflow

Everything else, including reminders, analytics, and multi-user support, stays out of scope for now.

## Data Model

```txt
Habit:
  id: str
  name: str
  created_at: date

HabitLog:
  habit_id: str
  date: date
  completed: bool
```

## Workflow Shape

The MVP workflow has three main nodes:

1. Fetch: load today's habit logs
2. Analyze: compute streaks and identify gaps
3. Summarize: generate a natural-language daily summary using an LLM
