# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## What this is

A Next.js (App Router) site that lists GNP per person employed by country for 2020, sourced from the World Bank API, with an AI prompt bar that answers plain-English questions about that same dataset. It's a personal project built to practice Next.js — see README.md for the full feature/technical rationale.

## Commands

```bash
pnpm dev      # start dev server (Turbopack)
pnpm build    # production build
pnpm start    # run production build
pnpm lint     # eslint
```

Node version is pinned via pnpm (`pnpm env use --global 24`, matching the `packageManager` field in `package.json`). There is no test suite configured in this repo.

**Environment**: `GEMINI_API_KEY` (Google AI Studio) must be set in `.env.local` for the `askQuestion` server action; without it the action returns a "not configured" error and only the AI feature is dead — the table still works. `GEMINI_MODEL` optionally overrides the default model. `.env*.local` is gitignored.

## Architecture

**Data is fetched once at build time and passed down as a prop to a Client Component. From there, the URL search string is the single source of truth for filtering/sorting/pagination — everything else is derived client-side as a pure function of (data, urlSearchParams).**

- `lib/countryData.ts` owns the World Bank fetch (`fetchCountryGDP`, `fetch(..., { cache: "force-cache" })`): it truncates GNP values to integers, drops entries without data, and keeps only the two fields the app reads (`country.id`/`country.value` and `value`) so the rest never reaches the RSC payload. It lives in `lib/` rather than in the page because both `app/page.tsx` and `lib/askQuestion.ts` need it; `force-cache` means the second caller reuses the first one's result rather than re-fetching. `DATA_YEAR` is exported from here too and is what the AI system instruction interpolates (the `<h1>` in `app/page.tsx` still hardcodes the year separately).
- `app/page.tsx` is a Server Component that calls `fetchCountryGDP` once at build/request time and passes the full dataset as a prop into `HomePageClient`.
- `components/HomePageClient.tsx` is a Client Component that receives the full dataset and never re-fetches. All searching, filtering, sorting, and pagination happen in-memory on the client from that one payload — hence the "works offline" property mentioned in the README.
- State for filters/sort/pagination lives in the URL query string, not React state. `lib/hook/useQueryAction.ts` exposes a reducer (`queryReducer`) that maps actions (`SUBMIT`, `SORT`, `CHANGE_PAGE`, `RESET`) to a new `URLSearchParams`, then updates the URL via `window.history` (no server round-trip, no Next.js router navigation). `SUBMIT`/`RESET` use `pushState` (a new search is worth a back-button entry); `SORT`/`CHANGE_PAGE` use `replaceState` (refining the current view isn't). This is why filter/sort/page state survives reload and is shareable via link.
- `lib/hook/useQueryState.ts` is the single place that reads and parses the query params (`country`, `greaterThan`, `lessThan`, `orderBy`, `orderAsc`, `page`) back out of `useSearchParams`; both `useCountryFilterData.ts` and `PaginationComponent.tsx` consume it rather than reading `searchParams` themselves.
- `lib/hook/useCountryFilterData.ts` takes that parsed query state and runs a Ramda (`R.compose`) pipeline — filter by country name, filter by GNP min/max, sort by name or value ascending/descending — memoized on the raw data + query params. Pagination slicing (`no_display = 10` per page) is derived separately from the filtered result so paging alone doesn't recompute the filter/sort pipeline.
- Because filter state is entirely derived from `searchParams`, any component that needs to read or mutate it must call `useQueryState`/`useQueryAction` itself — there is no central store.

**AI question answering** (`lib/askQuestion.ts`) — the one part of the app that talks to the network at request time. `askQuestion` is a **Server Action** (`"use server"`), shaped for `useActionState` as `(prevState, formData) => Promise<AskState>`: it reads `question` off the `FormData`, validates it (non-empty string, ≤ 500 chars), and asks Gemini via `@google/genai`. There is no `/api` route — the prompt bar passes this action straight to `<form action>`, so there is one entry point, no hand-written `fetch`, and the request/response types are shared rather than JSON-parsed. `AskState` (`lib/type/askType.ts`) is a discriminated union on `status`: `idle` | `answered` | `error`; it lives in `lib/type/` and not beside the action because a `"use server"` module may only export async functions. The design decisions here are deliberate and easy to undo by accident:

- The **entire dataset goes into `systemInstruction`, pre-sorted by value descending**, so ranking questions ("top 5", "lowest 3") are answered by reading consecutive lines instead of by sorting 176 numbers in-model, which it does unreliably. `toSorted` is used so the shared `force-cache`d array is never mutated, and the resulting instruction stays byte-identical between requests, which is what makes Gemini's implicit caching apply.
- The system instruction — not application code — defines the two sentinel replies: `Irrelevant` for anything outside the dataset, `No data` for an in-topic question the dataset can't answer (another year, an unlisted country). It also forbids outside knowledge and estimated values, and caps answer length. If you change the wording, keep those sentinels; the README documents them as behaviour.
- `thinkingLevel: MINIMAL` and `temperature: 0` are load-bearing. Thinking tokens are drawn from `maxOutputTokens`, so `LOW` spends ~250 of them reasoning and the answer gets cut off mid-number. The pre-sorted dataset is what makes a reasoning budget unnecessary.
- A `MAX_TOKENS` finish reason is **discarded and returned as an error**, not surfaced. A truncated answer reads as a confident, complete reply while cutting off mid-figure, which is worse than no answer.
- Every failure returns an `error` state with a distinct user-facing message rather than throwing: a 12s `AbortController` timeout (server-side, around the Gemini call), missing key or `API_KEY_INVALID` → "not configured" (note Gemini rejects a bad key with a **400**, not a 401), 429 → rate limit, anything else → unavailable. Nothing is swallowed — the unexpected (non-`ApiError`) branch still `console.error`s the full error, but returns rather than re-throws, because a throw inside a Server Action reaches the client as an opaque digest and trips the error boundary, taking the whole page down over one failed question.
- The default model (`gemini-3.1-flash-lite`) is chosen for the free tier, where the newer flash models are heavily contended and stall for 15-25s or return 503. Override with `GEMINI_MODEL` rather than editing the default.

**Component responsibilities:**
- `components/form/Form.tsx` — filter inputs (country name, GNP min/max), built with Next's `next/form` and uncontrolled inputs (React 19 form actions) so typing doesn't cause re-renders; values are read only on submit and dispatched via `ACTIONS_QUERY.SUBMIT`.
- `components/table/CountryTable.tsx` (+ `CountryTableButton.tsx`, `CountryTableArrow.tsx`) — renders the current page of results and the sortable column headers; sorting is dispatched via `ACTIONS_QUERY.SORT`.
- `components/pagination/PaginationComponent.tsx` — renders page controls from `totalPage`, dispatches `ACTIONS_QUERY.CHANGE_PAGE`.
- `components/prompt/PromptInput.tsx` — the AI prompt bar above the table; it passes the `askQuestion` server action to `<form action>` via `useActionState`, so React owns the pending flag and the answer/error state and the form degrades to a plain POST without JS. Unlike `Form.tsx` this input is *controlled*, because the submit button's disabled state depends on the current value — that difference is intentional, don't unify them (the controlled `value` is also why the question survives React's post-action form reset). Two requests can never be in flight: the submit button is disabled while `pending`, which is what makes client-side cancellation unnecessary. It holds no dataset state and does not touch the query string.
- `components/ThemeToggle.tsx` — client-only light/dark toggle; persists to `localStorage` and toggles `data-bs-theme` on `<html>` (Bootstrap's dark mode mechanism), with the initial theme also falling back to `prefers-color-scheme`.

**Path aliases** (see `tsconfig.json`): `@components/*` → `components/*`, `@lib/*` → `lib/*`, `@hook/*` → `lib/hook/*`, `@type/*` → `lib/type/*`.

**Styling**: SCSS Modules for component-scoped styles (`CountryTable.module.scss`) plus a global stylesheet (`lib/global.scss`) imported once in `app/layout.tsx`. Bootstrap + react-bootstrap provide layout/components; PurgeCSS and postcss-preset-env run via `postcss.config.js`.

**Images**: country flags are loaded from `flagsapi.com` via `next/image`; the allowed remote host is whitelisted in `next.config.js`.
