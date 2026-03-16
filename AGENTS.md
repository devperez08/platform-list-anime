# Agent Capabilities & Skill Activation

This file defines the available skills in the **platform-list-anime** project and the specific conditions under which they should be invoked. The goal is to minimize context noise by only referencing these specialized skill sets when the task strictly requires them.

## 🛠 Available Skills

| Skill                                                                                  | Trigger Conditions / Use Cases                                                                                                                                                            |
| :------------------------------------------------------------------------------------- | :---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **[database-schema-design](.agents/skills/database-schema-design/SKILL.md)**           | Use when designing or optimizing database schemas, creating new tables, defining SQL/NoSQL relationships, indexing, or handling migrations.                                               |
| **[frontend-design](.agents/skills/frontend-design/SKILL.md)**                         | Use for high-quality, distinctive UI work. Activate when building web components, pages, landing pages, dashboards, or when "beautifying" any web interface. Avoid generic AI aesthetics. |
| **[git-commit](.agents/skills/git-commit/SKILL.md)**                                   | Use for all Git operations. Triggered by `/commit` or when preparing a commit to ensure conventional commit standards and intelligent staging.                                            |
| **[security-best-practices](.agents/skills/security-best-practices/SKILL.md)**         | Use when implementing security-sensitive features: API protection, CORS policies, XSS/SQLi prevention, and rate limiting.                                                                 |
| **[seo-audit](.agents/skills/seo-audit/SKILL.md)**                                     | Use when reviewing site SEO, meta tags, Core Web Vitals, or when the user mentions ranking issues or "SEO audit."                                                                         |
| **[typescript-advanced-types](.agents/skills/typescript-advanced-types/SKILL.md)**     | Use when dealing with complex TypeScript logic: generics, conditional types, mapped types, or building reusable type-safe utilities.                                                      |
| **[vercel-react-best-practices](.agents/skills/vercel-react-best-practices/SKILL.md)** | Use when optimizing Next.js or React performance, data fetching patterns (RSCs, Suspense), or bundle optimization.                                                                        |
| **[web-design-guidelines](.agents/skills/web-design-guidelines/SKILL.md)**             | Use for auditing existing UI code against Web Interface Guidelines, checking accessibility (a11y), and UX reviews.                                                                        |

## 🤖 Instructions for the Agent

1.  **On-Demand Activation**: Do not keep all skill instructions in active memory. Refer to the specific `SKILL.md` file listed above _only_ when the task matches the trigger conditions.
2.  **Context Hygiene**: If a task does not involve one of these specialized domains (e.g., a simple logic fix or general question), do not invoke any design or audit skills to keep the conversation focused and efficient.
3.  **Proactive Research**: When a task aligns with a skill (e.g., "build a new page"), immediately read the corresponding `SKILL.md` before starting the implementation to ensure project standards are met.
