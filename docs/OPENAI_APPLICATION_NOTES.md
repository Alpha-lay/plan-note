# OpenAI Application Notes

This document summarizes PlanNote for grant, credit, or security review contexts.

## Project

PlanNote is an early-stage public open-source personal planning assistant built with React, TypeScript, Vite, and Tailwind CSS.

Repository: https://github.com/Alpha-lay/plan-note

Live demo: https://plan-note-rdh9.vercel.app

## Maintainer Role

Alpha-lay is the primary maintainer and developer.

## Current Product Scope

PlanNote currently focuses on:

- Task management
- Calendar-based daily planning
- Notes grouped by date
- Local-first browser storage
- PWA support
- Optional WeChat reminders through ServerChan

## Planned OpenAI API Usage

API credits would be used to prototype user-facing productivity features:

- Break large tasks into smaller steps
- Summarize daily or weekly notes
- Suggest priorities from tasks, notes, and deadlines
- Draft clearer reminder messages
- Convert rough notes into structured tasks
- Support daily planning and review workflows

## Why API Support Helps

The project is early-stage, so API support would help speed up experimentation and make the AI implementation public for other developers to learn from. The goal is not to add a vague chatbot, but to build focused planning features that fit the existing task, note, calendar, and reminder workflows.

## Security Relevance

PlanNote handles local planning data and optional reminder credentials. Security work focuses on safe secret handling, local storage transparency, dependency checks, and careful review of future AI API integration.

## Current Repository Improvements

Recent improvements include:

- Clear README and demo link
- Public roadmap
- Security policy
- Contribution guide
- MIT license
- Safe example file for reminder keys
- GitHub issue templates
- GitHub Actions build check
