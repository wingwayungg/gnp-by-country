# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## What this is

A Next.js (App Router) site that lists GNP per person employed by country for 2020, sourced from the World Bank API. It's a personal project built to practice Next.js — see README.md for the full feature/technical rationale.

## Commands

```bash
pnpm dev      # start dev server (Turbopack)
pnpm build    # production build
pnpm start    # run production build
pnpm lint     # eslint
```

Node version is pinned via `.nvmrc` (v24). Package manager is pnpm (see `pnpm-lock.yaml`). There is no test suite configured in this repo.

## Architecture

**Data flow is server-fetch-once, then all-client-side filtering.**

- `app/page.tsx` is a Server Component that fetches the entire World Bank dataset once at build/request time (`fetch(..., { cache: "force-cache" })`), truncates GNP values to integers, and drops entries without data. This full dataset is passed as a prop into `HomePageClient`.
- `components/home-page-client.tsx` is a Client Component that receives the full dataset and never re-fetches. All searching, filtering, sorting, and pagination happen in-memory on the client from that one payload — hence the "works offline" property mentioned in the README.
- State for filters/sort/pagination lives in the URL query string, not React state. `lib/hook/useQueryAction.ts` exposes a reducer (`queryReducer`) that maps actions (`SUBMIT`, `SORT`, `CHANGE_PAGE`, `RESET`) to a new `URLSearchParams`, then updates the URL via `window.history.pushState` (no server round-trip, no Next.js router navigation). This is why filter/sort/page state survives reload and is shareable via link.
- `lib/hook/useCountryFilterData.ts` reads those query params back out with `useSearchParams`, and runs a Ramda (`R.compose`) pipeline — filter by country name, filter by GNP min/max, sort by name or value ascending/descending — memoized on the raw data + query params. Pagination slicing (`no_display = 10` per page) is derived separately from the filtered result so paging alone doesn't recompute the filter/sort pipeline.
- Because filter state is entirely derived from `searchParams`, any component that needs to read or mutate it must call `useSearchParams`/`useQueryAction` itself — there is no central store.

**Component responsibilities:**
- `components/form/Form.tsx` — filter inputs (country name, GNP min/max), built with Next's `next/form` and uncontrolled inputs (React 19 form actions) so typing doesn't cause re-renders; values are read only on submit and dispatched via `ACTIONS_QUERY.SUBMIT`.
- `components/table/CountryTable.tsx` (+ `CountryTableButton.tsx`, `CountryTableArrow.tsx`) — renders the current page of results and the sortable column headers; sorting is dispatched via `ACTIONS_QUERY.SORT`.
- `components/pagination/PaginationComponent.tsx` — renders page controls from `totalPage`, dispatches `ACTIONS_QUERY.CHANGE_PAGE`.
- `components/ThemeToggle.tsx` — client-only light/dark toggle; persists to `localStorage` and toggles `data-bs-theme` on `<html>` (Bootstrap's dark mode mechanism), with the initial theme also falling back to `prefers-color-scheme`.

**Path aliases** (see `tsconfig.json`): `@components/*` → `components/*`, `@hook/*` → `lib/hook/*`, `@type/*` → `lib/type/*`.

**Styling**: SCSS Modules for component-scoped styles (`CountryTable.module.scss`) plus a global stylesheet (`lib/global.scss`) imported once in `app/layout.tsx`. Bootstrap + react-bootstrap provide layout/components; PurgeCSS and postcss-preset-env run via `postcss.config.js`.

**Images**: country flags are loaded from `flagsapi.com` via `next/legacy/image`; the allowed remote host is whitelisted in `next.config.js`.
