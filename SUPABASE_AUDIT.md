# Supabase Client & Session Management Audit

## Overview
This document audits the current usage of Supabase clients and session management in the codebase, identifies issues, and provides a step-by-step refactor plan to ensure best practices, security, and reliability.

---

## 1. Current State & Issues

### 1.1. Multiple Supabase Client Instantiations
- `createSupabaseBrowser()` is called in multiple components/pages (e.g., `CreateProjectModal`, `ProjectDetailsModal`, `dashboard/projects/page.tsx`, `test-auth/page.tsx`).
- This can lead to **multiple GoTrueClient instances** in the same browser context, causing session bugs and UI issues (e.g., spinning loader in navigation).

### 1.2. Legacy Client Export
- `src/utils/supabase.ts` exports a legacy `supabase` client using `createClient()`, which is used in some debug pages and helpers.
- This can also create multiple GoTrueClient instances if used alongside the singleton/browser client.

### 1.3. Session State Management
- `AuthProvider` correctly creates a singleton client and manages session state via React context.
- However, other components/pages bypass the context and create/use their own Supabase client, leading to out-of-sync session state and potential race conditions.

---

## 2. Best Practices for Supabase Auth & Session Management

1. **Singleton Pattern:** Only create one Supabase client per browser context. Export a single instance for use in all browser code.
2. **Centralized Session State:** Use a React context (e.g., `AuthProvider`) to manage and provide session/user state. All components should consume this context.
3. **No Direct Client Creation in Components:** Never call `createSupabaseBrowser()` or `createClient()` directly in components/pages. Only use the singleton/client from context or a shared module.
4. **Server-Side Clients:** Only use `createServerClient` or `createClient` with the service role key in API routes or server code.
5. **Remove Legacy Exports:** Remove or refactor the legacy `supabase` export to prevent accidental use.

---

## 3. Step-by-Step Refactor Plan

### Step 1: Refactor `src/utils/supabase.ts`
- Export only a singleton browser client:
  ```ts
  // src/utils/supabase.ts
  import { createBrowserClient } from '@supabase/ssr';
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
  export const supabase = createBrowserClient(supabaseUrl, supabaseAnonKey);
  ```
- Remove the `createSupabaseBrowser()` function and the legacy `supabase` export using `createClient()`.

### Step 2: Update `AuthProvider`
- Import and use the singleton `supabase` from `src/utils/supabase.ts`.
- Ensure all session/auth state is managed in this provider.

### Step 3: Update All Components/Pages
- Replace all direct calls to `createSupabaseBrowser()` with imports of the singleton `supabase`.
- In all components/pages, use the `AuthProvider` context for session/user state. Do not call `supabase.auth.getSession()` or listen for auth changes outside the provider.
- Example:
  ```ts
  import { supabase } from '@/utils/supabase';
  // ... use supabase for queries, but get session/user from context
  ```

### Step 4: Update Data Layer
- In `src/lib/database.ts`, use the singleton `supabase` for all browser-side operations.
- For server-side/API routes, use the appropriate server-side client (e.g., from `src/lib/server-database.ts`).

### Step 5: Remove/Refactor Debug and Helper Usages
- Update debug pages (e.g., `debug/user-role/page.tsx`, `debug/check-tables/page.tsx`) to use the singleton client.
- Ensure no direct instantiations of Supabase clients remain in the codebase.

### Step 6: Test Thoroughly
- Test all authentication flows, session persistence, and UI components (especially navigation dropdowns and protected routes).
- Check for the absence of the "Multiple GoTrueClient instances" warning in the browser console.

---

## 4. Security & Reliability Checklist
- [ ] Only one Supabase client per browser context
- [ ] All session/user state managed in a single React context
- [ ] No direct client creation in components/pages
- [ ] No legacy `supabase` export in browser code
- [ ] Server-side clients only used in API/server code
- [ ] All components consume session/user state from context
- [ ] No GoTrueClient warnings in browser console

---

## 5. References
- [Supabase Auth Docs](https://supabase.com/docs/guides/auth)
- [Singleton Pattern in React](https://react.dev/learn/sharing-state-between-components)
- [Supabase SSR/SSG Patterns](https://supabase.com/docs/guides/auth/server-side)

---

**Following this plan will ensure robust, secure, and maintainable session management with Supabase in your Next.js app.** 