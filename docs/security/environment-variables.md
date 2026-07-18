# Environment Variables Audit

This document lists and validates all environment variables used by the PM Sessions application.

---

## Environment Variables Directory

| Variable Name                   | Required? | Description                                                                                                                                                                                        | Scope           | Used In                                              |
| ------------------------------- | :-------: | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | --------------- | ---------------------------------------------------- |
| `NEXT_PUBLIC_APP_URL`           |  **Yes**  | The base URL of the Next.js application (e.g., `http://localhost:3000` in development, or `https://pm-sessions.vercel.app` in production). Used for absolute redirects in OAuth callback settings. | Client & Server | Server Actions, OAuth Callbacks                      |
| `NEXT_PUBLIC_SUPABASE_URL`      |  **Yes**  | The base API URL for your Supabase project (e.g., `https://yjyckvesjmqlvxrszown.supabase.co`).                                                                                                     | Client & Server | `shared/lib/supabase/config.ts`                      |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` |  **Yes**  | The public anonymous key for Supabase API requests. Safe to share publicly.                                                                                                                        | Client & Server | `shared/lib/supabase/config.ts`                      |
| `SUPABASE_SERVICE_ROLE_KEY`     |  **Yes**  | The privileged service role key. Bypasses Row Level Security (RLS) policies. **CRITICAL: NEVER expose to the client.**                                                                             | Server Only     | `shared/lib/supabase/config.ts` (Admin Client setup) |
| `GOOGLE_CLIENT_ID`              |  **Yes**  | The Client ID generated in Google Cloud Console for OAuth integration.                                                                                                                             | Client & Server | Auth context config (Supabase dashboard settings)    |
| `GOOGLE_CLIENT_SECRET`          |  **Yes**  | The Client Secret generated in Google Cloud Console. Used by Supabase Auth server. **CRITICAL: NEVER hardcode or commit.**                                                                         | Server Only     | Supabase dashboard configuration                     |

---

## Security Verification & Auditing Results

- **Secrets Sanitization**: A codebase audit confirmed that no values or secrets for the keys listed above are hardcoded in any file versioned in git.
- **Git Ignored Configuration**: The actual environment keys are placed in `apps/web/.env.local`, which is ignored globally via `.gitignore`.
- **Validation Fallback**: Configured safe fallback placeholders in `config.ts` during Next.js static build times so production bundling does not fail.
