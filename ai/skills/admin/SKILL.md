---
name: admin
description: Build or update account profiles, role-controlled admin sidebars, realtime Firestore dashboards, animated charts, and server-protected Vercel analytics and observability in the current app.
---

1. Read the applicable shared guides in the order required by AGENTS.md, then read [admin.md](admin.md). Use this skill for the connected account and admin system, including its data access and reporting boundaries.

2. Follow the app's framework, feature model, theme, and installed components. Adapt the shell and charts to the app rather than copying another product's pages or branding. Keep public browsing available and implement only relevant admin sections.

3. Use Firebase Authentication and realtime Firestore for a requested connected system. Keep an explicitly chosen local demo separate, and show a connection-needed state when production configuration is missing. Client navigation checks do not grant backend permissions.

4. Keep this skill portable: no project names, credentials, fixed Firebase projects, role bootstrap emails, or deployment IDs. Put those values and the actual route/schema mapping in project configuration or project documentation outside ai/. Copy ai/ with AGENTS.md to adopt the guidance in another repository; copying instructions does not create cloud resources.

5. Recheck official provider documentation when integrating reporting because endpoint schemas and plan access change. Complete reviewable source and configuration examples within scope; follow AGENTS.md for validation, commits, deployment, and live changes.
