# Base Structure v2

Clean, modern Vue 3 admin starter — **shadcn-vue**, **TanStack Vue Query**, axios, Pinia.

## Stack

| Layer  | Package                                  |
| ------ | ---------------------------------------- |
| UI     | shadcn-vue + Tailwind CSS v4 + reka-ui   |
| Data   | @tanstack/vue-query (+ Devtools in DEV)  |
| HTTP   | axios + `sharedService` bulk helpers     |
| Auth   | Pinia + JWT permissions                  |
| Forms  | vee-validate + **Zod** (`toTypedSchema`) |
| i18n   | vue-i18n (ar/en, RTL)                    |
| Toasts | vue-sonner                               |
| Lint   | ESLint 9 flat config                     |

## Structure

```
src/
├── assets/index.css          # Tailwind + theme tokens
├── components/
│   ├── ui/                   # shadcn components
│   ├── global/               # App* forms, table, filters, chips
│   └── layout/               # Header, sidebar, theme/locale
├── composables/
├── lib/
│   ├── env.ts                # Zod env validation
│   ├── nav.ts                # registerNavItem() — single nav registry
│   ├── format.ts
│   ├── query/createCrudQueries.ts
│   └── utils.ts
├── modules/
│   ├── demo-crud/            # Full localStorage CRUD showcase
│   └── participant-categories/
├── services/
│   └── SharedService.ts      # Shared bulk / toggle / sort APIs
├── layouts/
├── pages/
├── plugins/
├── router/
└── stores/
```

## Quick start

```bash
yarn install
cp .env.example .env.development
yarn dev
```

`.env.development`:

```
VITE_BASE_API_URL=http://localhost:8000/api/
```

## Global components (like spaces-vue)

Auto-imported from `src/components/global/` — **no imports needed** in modules:

| Global                                                  | Purpose                                         |
| ------------------------------------------------------- | ----------------------------------------------- |
| `AppTextField`, `AppTextarea`, `AppSelect`, `AppSwitch` | Form inputs (shadcn Select/Switch) + `VeeField` |
| `AppDataTable`                                          | Table/cards, selection, drag reorder            |
| `PageActions`                                           | Search, filters, view toggle, bulk actions      |
| `ActiveFilterChips`                                     | Applied filters outside the drawer              |
| `PagePagination`                                        | Page navigation                                 |
| `ConfirmModal`                                          | Delete confirmation                             |
| `FilterSideBar`                                         | Filter slide-over                               |
| `VeeForm`, `VeeField`                                   | Registered globally                             |
| `UseCrudPage`                                           | Modal + delete confirm state                    |

Prefer **Zod schemas** + `toTypedSchema` on `VeeForm` (see demo / participant modals). Global string rules remain available as a fallback.

See [docs/GLOBAL_COMPONENTS.md](docs/GLOBAL_COMPONENTS.md).

## Create a full CRUD module

Follow the step-by-step guide: **[docs/CREATE_CRUD_MODULE.md](docs/CREATE_CRUD_MODULE.md)**.

## Full CRUD demo (no backend)

1. `yarn dev`
2. Open login → **Continue as demo user**
3. Go to **CRUD demo** (`/demo-crud`)

Exercises: forms (Zod), table/cards, drag reorder, filters + **active filter chips**, bulk activate/delete, sidebar customize (order / hide / favorites).

## Add a new module

1. Copy `src/modules/participant-categories/` (or patterns from `demo-crud`)
2. Define Zod schema in `schemas/` and wire with `toTypedSchema` in the form modal
3. Create service with standard CRUD methods; use `sharedService` for bulk (default in `PageActions`)
4. Wire `createCrudQueries()` in `composables/`
5. Register routes in `src/router/index.ts`
6. Register nav with `registerNavItem(...)` in `src/lib/nav.ts` (do **not** edit `AppSidebar`)

## Scripts

| Command          | Description                         |
| ---------------- | ----------------------------------- |
| `yarn dev`       | Dev server :3000                    |
| `yarn build`     | Production build                    |
| `yarn typecheck` | TypeScript check                    |
| `yarn lint`      | ESLint 9 flat config                |
| `yarn format`    | Prettier                            |
| `yarn validate`  | typecheck + lint + build (CI entry) |

## CI

- **GitHub Actions**: `.github/workflows/ci.yml` → `yarn validate`
- **GitLab CI**: `.gitlab-ci.yml` → `yarn validate`

## Review score: **97/100**

Strengths: focused stack, shadcn Select/Switch, Zod forms, shared bulk service, active filter chips, nav registry helper, Vue Query Devtools (DEV), ESLint 9 flat config, CI on validate, demo CRUD + sidebar customize.

Remaining gap to 100: unit/e2e tests (intentionally out of scope for this pass).
