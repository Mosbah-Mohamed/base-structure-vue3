# Global components (spaces-vue style)

All components under `src/components/global/` are **auto-imported** — no manual imports needed in pages/modals.

## Form inputs (`App*`)

Built on shadcn + `VeeField`. Prefer **Zod** on the form (`toTypedSchema`) — string `rules` remain as a fallback:

| Component      | Usage                                                   |
| -------------- | ------------------------------------------------------- |
| `AppTextField` | Text, email, password                                   |
| `AppTextarea`  | Multi-line text                                         |
| `AppSelect`    | shadcn Select (`options` prop) — dark-mode safe popover |
| `AppSwitch`    | shadcn Switch                                           |

```vue
<script setup lang="ts">
import { toTypedSchema } from '@vee-validate/zod'
import { productSchema } from '../schemas/productSchema'
const validationSchema = toTypedSchema(productSchema)
</script>

<template>
  <VeeForm ref="formRef" v-slot="{ meta }" :validation-schema="validationSchema" @submit="submit">
    <AppTextField v-model="formData.email" name="email" label="Email" />
  </VeeForm>
</template>
```

## Table & CRUD UI

| Component           | Purpose                                                                                        |
| ------------------- | ---------------------------------------------------------------------------------------------- |
| `AppDataTable`      | Table/cards, selection checkboxes, drag reorder, `#item.{key}` slots                           |
| `PageActions`       | Search, filter, view toggle, **bulk activate/deactivate/delete** (defaults to `sharedService`) |
| `ActiveFilterChips` | Show applied filters outside the drawer (remove / clear)                                       |
| `FilterSideBar`     | Slide-over filter drawer (apply / reset) like spaces-vue                                       |
| `PagePagination`    | Prev/next pagination                                                                           |
| `ConfirmModal`      | Delete confirmation (`ref` + `confirm()`)                                                      |

### Bulk actions (spaces-vue style)

API modules can omit `:bulk-service` — `PageActions` uses `sharedService` (`multi_destroy` / `multi_toggle_activation`). Pass a custom service only for mocks (e.g. demo-crud).

```vue
<PageActions
  :show-multi-delete="true"
  :show-multi-activate="true"
  :selected-items="selectedItems"
  model="products"
  @reload-data="onReloadData(refetch)"
/>

<ActiveFilterChips :filters="activeFilterChips" @remove="removeFilterChip" @clear="resetFilters" />
```

### Sidebar customize (draggable order)

Gear icon on sidebar opens `SideMenuCustomizer`:

- drag to reorder
- eye hide/show
- star favorites
- restore default / done
- prefs persist in `localStorage`

### AppDataTable

```vue
<AppDataTable
  v-model:items="tableItems"
  :headers="headers"
  :view-mode="viewMode"
  :enable-drag="true"
  card-title-key="title.en"
  @reorder="onReorder"
>
  <template #item.actions="{ item }">...</template>
</AppDataTable>
```

### PageActions + filters

```vue
<PageActions
  v-model:view-mode="viewMode"
  :show-filter="true"
  :filter-active="filterActive"
  :show-view-toggle="true"
  @open-filter="showFilter = true"
/>

<FilterSideBar v-model:show-filter="showFilter" @apply-filter="apply" @reset-filter="reset">
  <!-- many AppSelect / AppTextField filters -->
</FilterSideBar>
```

## Animations

- Route page fade: `DefaultLayout` (`app-fade`)
- Filter drawer slide: `FilterSideBar`
- Row/card hover + drag ghost styles in `src/assets/index.css`
- Theme color transition on `App.vue`

## Composables (auto-imported)

| Composable     | Purpose                      |
| -------------- | ---------------------------- |
| `UseCrudPage`  | Modal state + delete confirm |
| `useFormField` | Required indicator helpers   |

## Example modules

- `src/modules/demo-crud/` — full showcase (filters, cards, drag, animations)
- `src/modules/participant-categories/` — API-backed CRUD pattern

**New module guide:** [CREATE_CRUD_MODULE.md](./CREATE_CRUD_MODULE.md)
