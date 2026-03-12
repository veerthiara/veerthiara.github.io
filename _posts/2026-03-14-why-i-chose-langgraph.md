---
layout: post
title: "Why I Chose LangGraph"
date: 2026-03-14
categories: habit-tracker langgraph
---

After evaluating several options for orchestrating AI workflows in the habit tracker, I decided to go with LangGraph.

## What is LangGraph?

LangGraph is a library for building stateful, multi-step AI applications using a graph-based workflow model. It's built on top of LangChain and gives you fine-grained control over the flow of your AI pipelines.

## Why Not Plain LangChain?

LangChain chains work well for linear workflows. But habit analysis involves branching logic — checking streaks, generating personalised nudges, and handling edge cases. LangGraph's graph model is a much better fit.

## Key Benefits

- Explicit state management
- Easy to visualise and debug workflows
- First-class support for cycles (useful for retry/reflection patterns)
