---
layout: post
title: "Structuring the MVP"
date: 2026-03-16
categories: habit-tracker architecture
---

With the tech choices made, it's time to define what the MVP actually looks like.

## MVP Scope

The first version will focus on:
1. Logging habits (yes/no per day)
2. Viewing current streaks
3. A simple LangGraph workflow that generates a daily summary

Everything else — reminders, analytics, multi-user support — is out of scope for now.

## Data Model

```
Habit:
  id: str
  name: str
  created_at: date

HabitLog:
  habit_id: str
  date: date
  completed: bool
```

## LangGraph Workflow

The MVP workflow has three nodes:
1. **Fetch** — load today's habit logs
2. **Analyse** — compute streaks and identify gaps
3. **Summarise** — generate a natural-language daily summary using an LLM
