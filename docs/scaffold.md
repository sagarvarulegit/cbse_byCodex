---
type: Runbook
title: Scaffolding Guidelines
description: Best practices for scaffolding files, routes, and components.
tags: ['scaffold', 'setup', 'workspace']
timestamp: 2026-07-08T12:00:00Z
---

# Scaffold

Current monorepo structure:

- apps/web: Student web app using Next.js.
- apps/admin: Admin CMS using Next.js.
- apps/api: Backend API using Express initially, with Prisma/PostgreSQL schema.
- apps/mobile: Flutter app placeholder.

The scaffold avoids dependency installation. Run npm install later to fetch packages.

Suggested commands after installing dependencies:

```bash
npm install
npm run dev:web
npm run dev:admin
npm run dev:api
```
