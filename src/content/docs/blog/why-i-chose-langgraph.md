---
title: Why I Chose LangGraph
description: Why graph-based orchestration made more sense than simple linear chains.
editUrl: false
head: []
template: doc
sidebar:
  hidden: false
  attrs: {}
pagefind: true
draft: false
---

After evaluating several options for orchestrating AI workflows in the habit tracker, I decided to go with LangGraph.

## What Is LangGraph?

LangGraph is a library for building stateful, multi-step AI applications using a graph-based workflow model.

## Why Not Plain LangChain?

LangChain chains work well for linear workflows. Habit analysis is less linear and involves branching logic:

- checking streaks
- generating personalized nudges
- handling edge cases

LangGraph's graph model is a better fit for that shape of application logic.

## Key Benefits

- explicit state management
- easier workflow debugging
- first-class support for cycles and retries
