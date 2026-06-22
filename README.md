# JazzyVault — Frontend

Secure AI-powered document vault. Convert. Store. Secure. Smarter.

This is the Next.js 15 frontend for JazzyVault, deployed on **Netlify**.

> Backend repo: `jazzyvault-backend` (FastAPI, deployed on Render)

---

## Tech Stack

- Next.js 15 (App Router)
- React 19 + TypeScript
- Tailwind CSS
- Framer Motion
- TanStack React Query
- React Hook Form + Zod
- Supabase Auth (via `@supabase/ssr`)

---

## Build Status — Phased Delivery

- [x] **Phase 1** — Project Foundation
- [x] **Phase 2** — Authentication System
- [x] **Phase 3** — File Upload & Storage
- [x] **Phase 4** — Document Conversion Engine
- [x] **Phase 5** — Conversion History & Analytics
- [x] **Phase 6** — AI Document Intelligence
- [x] **Phase 7** — Dashboard Enhancement
- [x] **Phase 8** — Security & Optimization (this README)
- [ ] Phase 9 — Deployment

Each phase is built and validated before the next begins.

---

## Phase 2 — Required Supabase Dashboard Setup

Before testing registration/login locally, configure these in your Supabase project dashboard:

### 1. Run the database migrations

In Supabase Dashboard → SQL Editor, run these from the **backend repo**, in order:
1. `jazzyvault-backend/supabase/migrations/001_profiles.sql` — creates `profiles`, RLS, and the auto-create-on-signup trigger.
2. `jazzyvault-backend/supabase/migrations/002_files.sql` — creates `files`, the private `jazzyvault-files` Storage bucket, and its access policies.
3. `jazzyvault-backend/supabase/migrations/003_conversions.sql` — creates `conversions`, with RLS.
4. `jazzyvault-backend/supabase/migrations/004_activity_logs.sql` — creates `activity_logs`, with RLS.
5. `jazzyvault-backend/supabase/migrations/005_rename_conversion_fkeys.sql` — names the `conversions`→`files` foreign keys explicitly (needed for the History page's backend query).
6. `jazzyvault-backend/supabase/migrations/006_ai_requests.sql` — creates `ai_requests`, with RLS.

### 2. Configure redirect URLs

Supabase Dashboard → Authentication → URL Configuration:

| Setting | Local dev value | Production value |
|---|---|---|
| Site URL | `http://localhost:3000` | `https://your-app.netlify.app` |
| Redirect URLs | `http://localhost:3000/**` | `https://your-app.netlify.app/**` |

The password reset flow redirects to `/reset-password` after the user clicks the emailed link — this must be covered by the redirect URL pattern above.

### 3. Email confirmation (your choice)

Supabase Dashboard → Authentication → Providers → Email:

- **Confirm email: ON** (default, recommended for production) — after registering, the user must click a confirmation link before they can log in. The register form already handles this state ("Check your email").
- **Confirm email: OFF** — useful for faster local testing. Registration immediately returns a session and signs the user in.

### 4. (Local dev only) Email delivery

Supabase's free tier sends real confirmation/reset emails from a shared sender with a low rate limit (2/hour) — fine for testing, but consider a custom SMTP provider before real users sign up in production. See Supabase Dashboard → Authentication → Email Templates / SMTP Settings.

---

## What Was Built in Phase 2

- **Registration** (`/register`) — Zod-validated form, calls `supabase.auth.signUp()` directly from the client, handles both "instant session" and "email confirmation required" outcomes.
- **Login** (`/login`) — calls `supabase.auth.signInWithPassword()`, redirects back to whatever protected page the user originally tried to visit (`?redirectedFrom=`).
- **Logout** — available from the dashboard navbar, calls `supabase.auth.signOut()`.
- **Password reset** (`/reset-password`) — single route that serves two states: request form (enter email) and update form (shown automatically when the user arrives via the emailed recovery link).
- **Protected routes** — `src/middleware.ts` + `src/lib/supabase/middleware.ts`, redirects unauthenticated users away from `/dashboard`, `/files`, `/conversions`, `/ai-tools`, `/settings`.
- **Session management** — `src/lib/hooks/use-auth.tsx` provides a `useAuth()` hook (`user`, `session`, `isLoading`, `signOut`) backed by Supabase's `onAuthStateChange` listener, available anywhere via `AuthProvider` in `providers.tsx`.
- **Profile auto-creation** — handled entirely at the database level (see migration), not in application code, so it's atomic with user creation and can't be skipped by a buggy client.

---

## What Was Built in Phase 3

- **Drag-and-drop uploader** (`/files`) — multi-file, client-side validated (type + 25MB size limit) before hitting the network, with a per-file progress/status queue.
- **File Vault table** — search (debounced), filter by type, sort by name/date/size, all delegated to the backend's `GET /files` query params.
- **Preview modal** — inline preview for images and PDFs; other types fall back to a direct download link.
- **Delete** — confirmation dialog, optimistic UI removal via React Query.
- **Sidebar navigation** — added in this phase since there's now more than one dashboard section to move between.

**Note on file URLs:** the Storage bucket is private, so every file the frontend receives includes a signed URL valid for 1 hour. The file list refetches this on every load, so this is invisible in normal use — but if you leave a file list open in a background tab for over an hour, refresh before downloading.

---

## What Was Built in Phase 4

- **Convert action** in the File Vault — a "convert" icon appears on any file that has a supported target format (DOCX→PDF, PDF→DOCX/JPG/PNG, JPG/PNG→PDF). Clicking it opens a dialog to pick the target format.
- **Conversions page** (`/conversions`) — shows recent conversion jobs with live status (pending/processing/completed/failed). The full searchable/filterable history table is built in Phase 5; this phase covers triggering conversions and seeing they happened.
- Converted files are automatically saved back into the Vault as new files, so they show up in **My Files** like anything else.

**Heads up on conversion speed:** conversions run synchronously on the backend (the API call doesn't return until the conversion finishes or fails), since LibreOffice-based conversions are usually a few seconds. If you're testing against a Render free-tier backend that's spun down, the very first request can take 30–60 seconds just to wake the server, on top of the conversion itself — that's normal, not a bug.

---

## What Was Built in Phase 5

- **Conversion History page** (`/conversions`) — replaces the simpler Phase 4 version (which was explicitly a placeholder pending this phase). Now a full table with: debounced filename search, conversion-type filter (e.g. DOCX→PDF), status filter, a date range picker, newest/oldest sort toggle, and a re-download action for any completed conversion's output file.
- **Dashboard analytics cards** (`/dashboard`) — total files uploaded, total/successful/failed conversions, and a storage usage bar, all pulled from the new `GET /dashboard/stats` endpoint.
- **Activity timeline** (`/dashboard`) — a chronological feed of uploads, deletes, downloads, and conversion events, each with an icon, description, and relative timestamp ("2h ago"). Pulled from `GET /activity/recent`.
- **Download tracking** — clicking download (from the file vault, the preview modal, or re-downloading from history) now also fires a fire-and-forget call to the backend so it shows up in the activity feed. This never blocks or delays the actual download.
- The dashboard's `/dashboard` route — previously a minimal Phase 2 session-debug view — now shows the real analytics + activity feed described above. The Phase 2 session/profile fields it showed are still accessible via the browser's dev tools or `/auth/me` if you need to debug auth state directly.

---

## What Was Built in Phase 6

- **AI Tools page** (`/ai-tools`) — replaces the "coming soon" placeholder from Phase 3 (which was always intended for this). A three-step flow: pick a file (DOCX/PDF/TXT only — these are the only formats this MVP can extract text from), pick an action (Summarize, Key Insights, Simplify, Translate, Smart Analysis), and run it. Translate additionally asks for a target language.
- **Result display** — the AI's response renders with basic formatting (bullet points, headers) and a one-click copy button. Failed requests show the error message instead of a blank result.
- AI requests automatically show up in the **Dashboard** activity feed (the `ai_request` activity type was already future-proofed into the schema back in Phase 5) and count toward future AI-related stats.

**Note on supported file types:** images, PPTX, and XLSX aren't included in the AI file picker — the backend can't extract plain text from them with this MVP's tooling. If you select a file before realizing it's unsupported, the picker won't even list it, so this is enforced before the request is sent rather than failing after the fact.

---

## What Was Built in Phase 7

- **Global search** (`⌘K` / `Ctrl+K`, or the search bar in the navbar) — a command palette that searches across files, conversions, and AI requests in one query, debounced, with results grouped by type and linking straight to the relevant page.
- **Mobile navigation** — the sidebar was `hidden md:flex` with no small-screen equivalent at all before this phase, meaning phone users had no way to move between sections except editing the URL directly. Fixed with a new fixed bottom tab bar (`MobileBottomNav`), visible only below `md` exactly where the sidebar disappears, so there's never a moment with neither visible.
- **AI Request History** — `/ai-tools` now includes an expandable history list below the action runner, surfacing the `GET /ai/history` endpoint that existed on the backend since Phase 6 but had no frontend view of its own until now.
- **Loading skeletons** — replaced bare spinners with content-shaped skeleton placeholders (matching each table/card's actual layout) on the dashboard analytics cards, activity timeline, file vault table, conversion history table, and AI history list. Reuses the `shimmer`/`animate-shimmer` CSS classes that were already defined in `globals.css` since Phase 1 but unused until now.
- **Responsive audit** — reviewed every existing page (tables, filter bars, grids) for mobile behavior. Most of it held up well from earlier phases (column-hiding on tables, `flex-wrap` filter bars, responsive grids were already in place); the missing mobile nav above was the one real gap found.

**A bug caught during this phase's own verification pass:** while wiring loading skeletons into the new AI history list, an editing pass briefly left a duplicated `"use client"` directive and a dangling reference to a removed `Loader2` import. Both were caught by the same import-resolution/syntax checks used throughout every phase — not boot-tested, since this sandbox can't run `npm run dev`, but worth being explicit that "I checked it" sometimes means "I checked it twice because the first edit was wrong."

---

## What Was Built in Phase 8

Most of Phase 8's substance is backend work — see the backend README for the full breakdown (rate limiting on every previously-unprotected route, UUID/format validation, filename sanitization, security headers, a real N+1 fix). The frontend changes this phase were small and targeted:

- **`next.config.mjs` image remote pattern fix** — the `images.remotePatterns` entry pointed at `/storage/v1/object/public/**`, but the `jazzyvault-files` bucket is private (set up back in Phase 3), so files are actually served from `/storage/v1/object/sign/**`. This pattern was never exercised by anything — every file preview in the app correctly uses a plain `<img>` tag instead of `next/image` for Supabase content, since signed URLs are short-lived and per-request, which doesn't suit `next/image`'s optimizer well — but it's now corrected in case a future phase adds an `next/image`-based preview that needs it.
- No other frontend changes were needed: the file vault, conversion history, and AI history pages already handle whatever shape of data the backend returns, so the backend's new `limit` param on `GET /files` and the batch URL-signing change are both transparent to the frontend — same API contract, just faster and safer underneath.

---

## Local Setup

### 1. Install dependencies

```bash
npm install
```

### 2. Configure environment variables

```bash
cp .env.example .env.local
```

Fill in:

| Variable | Where to find it |
|---|---|
| `NEXT_PUBLIC_SUPABASE_URL` | Supabase Dashboard → Project Settings → API |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Supabase Dashboard → Project Settings → API |
| `NEXT_PUBLIC_API_URL` | `http://localhost:8000` for local dev, your Render URL in production |

### 3. Run the dev server

```bash
npm run dev
```

Visit [http://localhost:3000](http://localhost:3000). You should see the JazzyVault landing page with **Get started** / **Log in** buttons.

**To confirm Phase 2:**
1. Click **Get started**, register a new account.
2. If email confirmation is enabled in Supabase, check your inbox and click the confirmation link, then return and log in.
3. You should land on `/dashboard`, which shows your session info and (if the backend is running) your profile fetched via `/auth/me`.
4. Try visiting `/dashboard` in an incognito window — you should be redirected to `/login`.
5. Click **Log out** in the navbar — you should be redirected to `/login`, and `/dashboard` should now be unreachable again.

**To confirm Phase 3:**
1. Go to **My Files** in the sidebar.
2. Drag a PDF or image onto the upload zone (or click to browse), then click **Upload**.
3. The file should appear in the table below within a second or two.
4. Click the eye icon to preview it (images/PDFs preview inline), the download icon to save it, and the trash icon to delete it (with confirmation).
5. Try the search box and column sort headers — both should work without a full page reload.

**To confirm Phase 4:**
1. In **My Files**, upload a DOCX or PDF (or use one from Phase 3 testing).
2. Click the convert icon (circular arrows) on that file's row.
3. Pick a target format and click **Convert**. This calls the backend, which needs LibreOffice/poppler available — see the backend README's "Local Setup" for the two ways to get that locally.
4. You should be redirected to **Conversions** and see the job listed as `Completed` (or `Failed` with a reason, if something went wrong on the backend).
5. Go back to **My Files** — the converted output should now appear there too as a new file.

**To confirm Phase 5:**
1. Go to **Dashboard**. You should see four stat cards (Files Uploaded, Total Conversions, Successful, Failed) and a storage usage bar, all reflecting whatever you've uploaded/converted so far.
2. Below that, the **Recent Activity** timeline should show entries for your uploads and conversions, newest first, with relative timestamps.
3. Go to **My Files**, click the download icon on any file. Go back to **Dashboard** — a new "Downloaded ..." entry should appear at the top of the activity feed within a few seconds (refresh if React Query hasn't refetched yet).
4. Go to **Conversions** (now the full History page). Try the search box, the conversion-type dropdown, the status dropdown, and the date range pickers — each should narrow the table. Toggle Newest/Oldest and confirm the order flips.
5. On a completed conversion row, click the download icon in the Action column — it should download the converted output file directly from history, without needing to go back to My Files.

**To confirm Phase 6:**
1. Make sure your backend has a real `GEMINI_API_KEY` set (free at [Google AI Studio](https://aistudio.google.com/apikey)) — without it, AI requests will fail with a clear "not configured" error rather than hanging.
2. Upload a TXT or DOCX file in **My Files** if you don't already have one (PDFs work too, but a text-heavy file gives a more interesting result).
3. Go to **AI Tools**. Select that file in the picker — only DOCX/PDF/TXT files should appear, even if you have images or other types uploaded.
4. Pick **Summarize** and click **Run**. After a few seconds you should see a result card with the summary and a working **Copy** button.
5. Try **Translate** — a language input should appear; type a language and run it.
6. Go to **Dashboard** — a new "Running summarize on..." (and similarly for translate) entry should appear in the activity feed.

**To confirm Phase 7:**
1. Press `⌘K` (Mac) or `Ctrl+K` (Windows/Linux) anywhere in the dashboard — a search overlay should open. Click the search bar in the navbar to confirm it opens the same way.
2. Type part of a filename you've uploaded. After a brief pause, results should appear grouped with type labels (File / Conversion / AI Request). Click one — it should close the overlay and navigate to the relevant page.
3. Resize your browser to a phone width (or open dev tools device emulation). The sidebar should disappear and a bottom tab bar with 5 icons should appear instead. Tap through all 5 — each should navigate correctly and show the active one highlighted.
4. Go to **AI Tools** and scroll down — a **Request History** section should appear below the result card, showing your past AI requests. Click one to expand it and see the full response with a copy button.
5. Reload the **Dashboard**, **My Files**, or **Conversions** page and watch closely right after — you should briefly see skeleton placeholders shaped like the real content (not a generic spinner) before the actual data appears.

**To confirm Phase 8:**
1. Most of this phase is backend-verifiable only — see the backend README's Phase 8 checklist (steps 15–19) for rate limiting, validation, sanitization, and security header checks.
2. From the frontend, the main thing to confirm is that nothing broke: run through the Phase 3–6 checklists above once more (upload, convert, view history, run an AI request) — all the new backend validation should be invisible when you're sending well-formed requests through the UI, and only surface if you were crafting malformed requests directly against the API.

### 4. Type-check (recommended before each commit)

```bash
npm run type-check
```

---

## Folder Structure

```
src/
  app/
    (auth)/
      login/page.tsx          → login page
      register/page.tsx        → registration page
      reset-password/page.tsx   → password reset (request + update)
    (dashboard)/
      layout.tsx                 → navbar + sidebar + mobile bottom nav wrapper (Phase 7) for all protected pages
      dashboard/page.tsx          → analytics cards + activity timeline (Phase 5)
      files/page.tsx                → file vault (uploader + table + convert action)
      conversions/page.tsx           → full conversion history (search/filter/sort/re-download) (Phase 5)
      ai-tools/page.tsx                → AI document intelligence + request history (Phase 6, history added Phase 7)
      settings/page.tsx                  → still a "coming soon" placeholder
    layout.tsx                     → root layout, metadata, fonts
    page.tsx                       → landing page
    providers.tsx                   → React Query + Auth + Toaster providers
    globals.css                      → brand design tokens
  components/
    ui/                  → button, input, card, skeleton (Phase 7) primitives
    layout/               → navbar (+global search, Phase 7), sidebar, mobile-bottom-nav (Phase 7), nav-items (shared list, Phase 7)
    auth/                  → auth-layout, login/register/reset forms, router
    dashboard/               → analytics-cards, activity-timeline, conversion-history-table,
                                conversion-status-badge, activity-icon, date-range-picker (Phase 5),
                                coming-soon (still used by the settings placeholder)
    files/                     → uploader, vault table, preview modal, delete dialog, convert dialog, file icons
    ai/                          → ai-file-picker, ai-action-selector, ai-actions, ai-result-card (Phase 6),
                                    ai-status-badge, ai-history-list (Phase 7)
    landing/                       → (built in later phases)
  lib/
    supabase/
      client.ts             → browser Supabase client
      server.ts               → server Supabase client (Server Components)
      middleware.ts             → session refresh + route protection logic
    api/
      client.ts                  → typed fetch client, auto-attaches Supabase JWT
    hooks/
      use-auth.tsx                 → useAuth() hook + AuthProvider (session state)
      use-files.ts                   → React Query hooks: list/upload/delete files
      use-conversions.ts               → React Query hooks: convert + history (extended Phase 5)
      use-dashboard-stats.ts             → React Query hook: dashboard stats (Phase 5)
      use-recent-activity.ts               → React Query hook: activity feed (Phase 5)
      use-ai.ts                              → React Query hooks: run AI action + history (Phase 6)
      use-global-search.ts                     → React Query hook: global search (Phase 7)
      use-debounced-callback.ts                  → generic debounce hook (used by search)
    validators/
      auth.ts                        → Zod schemas for all auth forms
    utils/
      index.ts                         → cn, formatBytes, truncateFilename
      file-validation.ts                 → client-side accepted types/size limit
      conversion-rules.ts                  → client-side mirror of backend's supported conversion pairs
      conversion-history-filters.ts          → type/status filter option lists (Phase 5)
  types/                                 → shared TypeScript interfaces
  middleware.ts                            → Next.js middleware entrypoint
public/
  images/                        → logo variants
  favicon*.png, icon*.png         → generated favicon/icon set
```

---

## Brand Assets

The JazzyVault logo was processed into the following variants, all in `public/`:

- `favicon.ico`, `favicon-16.png`, `favicon-32.png` — browser tab icon
- `icon-192.png`, `icon-512.png`, `apple-icon.png` — PWA / mobile home screen
- `images/logo-icon.png` — square icon mark, for navbar/sidebar
- `images/logo-full.png` — full lockup (icon + wordmark + tagline), for landing/auth pages

Brand colors are defined as Tailwind tokens (`brand.primary`, `brand.secondary`, `brand.accent`, `brand.bg`) in `tailwind.config.ts` and as CSS variables in `globals.css`.

---

## Deployment — Netlify

1. Push this repo to GitHub.
2. In Netlify: **Add new site → Import an existing project** → select the repo.
3. Build settings are already configured via `netlify.toml`:
   - Build command: `npm run build`
   - Publish directory: `.next`
   - Plugin: `@netlify/plugin-nextjs` (auto-installed from `netlify.toml`)
4. Add environment variables in **Site Settings → Environment Variables** (same keys as `.env.example`), pointing `NEXT_PUBLIC_API_URL` at your live Render backend URL.
5. Deploy. Netlify will rebuild automatically on every push to `main`.

---

## Notes

- This is a **two-repo setup**: this frontend repo is independent from `jazzyvault-backend`. They communicate purely over HTTPS via `NEXT_PUBLIC_API_URL`.
- Route protection (redirecting unauthenticated users away from `/dashboard`, etc.) is handled in `src/middleware.ts` and will become fully active once Phase 2 (Authentication) ships.
