# How to create a full CRUD module

Step-by-step guide to add a new API-backed CRUD module using the project globals.

**Reference modules**

| Module        | Path                                  | Use when                                     |
| ------------- | ------------------------------------- | -------------------------------------------- |
| API CRUD      | `src/modules/participant-categories/` | Real backend                                 |
| Full showcase | `src/modules/demo-crud/`              | Filters, bulk, cards, drag, sidebar patterns |

Also see [GLOBAL_COMPONENTS.md](./GLOBAL_COMPONENTS.md).

---

## Checklist

1. [ ] Folder structure
2. [ ] Interfaces
3. [ ] Service (axios CRUD)
4. [ ] Vue Query composable (`createCrudQueries`)
5. [ ] Form modal (`VeeForm` + `App*` inputs)
6. [ ] List page (`PageActions` + `AppDataTable` + `UseCrudPage`)
7. [ ] Module shell + routes
8. [ ] Register router
9. [ ] Nav item + i18n
10. [ ] (Optional) Filters / bulk / cards / drag

---

## Step 1 — Folder structure

Create under `src/modules/<module-name>/` (example: `products`):

```text
src/modules/products/
├── ProductsModule.vue
├── ProductsRoutes.ts
├── interfaces/
│   └── Product.ts
├── services/
│   └── ProductsService.ts
├── composables/
│   └── useProducts.ts
├── pages/
│   └── ProductsPage.vue
├── modals/
│   └── ProductFormModal.vue
└── components/                 # optional
    └── ProductsFilter.vue
```

---

## Step 2 — Interfaces

```ts
// interfaces/Product.ts
export interface ProductBase {
  id?: number
  name: { ar: string; en: string }
  description?: string
  is_active: boolean
}

export interface Product extends ProductBase {
  id: number
  created_at: string
}
```

---

## Step 3 — Service

Match the backend path and return `AxiosPromise`.

```ts
// services/ProductsService.ts
import type { AxiosPromise } from 'axios'
import axios from 'axios'
import type { Product, ProductBase } from '../interfaces/Product'

class ProductsService {
  contextPath = 'products'

  getItem(params: Record<string, unknown>): AxiosPromise {
    return axios.get(this.contextPath, { params })
  }

  createItem(data: ProductBase): AxiosPromise {
    return axios.post(this.contextPath, data)
  }

  editItem(data: Product): AxiosPromise {
    return axios.put(`${this.contextPath}/${data.id}`, data)
  }

  deleteItem(id: number): AxiosPromise {
    return axios.delete(`${this.contextPath}/${id}`)
  }
}

export const productsService = new ProductsService()
```

Bulk activate/delete uses shared `sharedService` via `PageActions` (no need to redefine `multi_destroy` / `multi_toggle_activation` in every module). Override with `:bulk-service` only for local mocks.

Expected list response shape:

```json
{
  "data": [/* items */],
  "meta": {
    "current_page": 1,
    "last_page": 5,
    "per_page": 20,
    "total": 100
  }
}
```

---

## Step 4 — Vue Query composable

```ts
// composables/useProducts.ts
import { createCrudQueries } from '@/lib/query/createCrudQueries'
import type { Product, ProductBase } from '../interfaces/Product'
import { productsService } from '../services/ProductsService'

export interface ProductsParams {
  page: number
  itemPerPage: number
  keyword: string
}

export const productsQueries = createCrudQueries<Product, ProductsParams, ProductBase, Product>(
  'products',
  productsService,
)

export const {
  useListQuery: useProductsQuery,
  useCreateMutation: useCreateProductMutation,
  useUpdateMutation: useUpdateProductMutation,
  useDeleteMutation: useDeleteProductMutation,
} = productsQueries
```

---

## Step 5 — Form modal

**Rules**

- Use `v-model:show-modal` + `useVModel`
- Wrap fields in `VeeForm` + global `App*` inputs
- Prefer **Zod** (`toTypedSchema`) over string `rules` on each field
- Prefer a **single root element** (required for route transitions)
- Global components are auto-imported (`AppTextField`, `Dialog`, `Button`, …)

```ts
// schemas/productSchema.ts
import { z } from 'zod'

export const productSchema = z.object({
  id: z.number().optional(),
  name: z.object({
    ar: z.string().min(2).max(100),
    en: z.string().min(2).max(100),
  }),
  description: z.string().max(500).optional(),
  is_active: z.boolean(),
})
```

```vue
<!-- modals/ProductFormModal.vue -->
<script setup lang="ts">
import { toast } from 'vue-sonner'
import { useVModel } from '@vueuse/core'
import { toTypedSchema } from '@vee-validate/zod'
import { cloneItem } from '@/helpers'
import type { FormModalProps } from '@/interfaces/Forms'
import type { Product, ProductBase } from '../interfaces/Product'
import { productSchema } from '../schemas/productSchema'
import { useCreateProductMutation, useUpdateProductMutation } from '../composables/useProducts'

const props = withDefaults(defineProps<FormModalProps>(), {
  showModal: false,
  formAction: 'create',
})

const emit = defineEmits<{
  (e: 'update:showModal', value: boolean): void
  (e: 'saved'): void
}>()

const { t } = useI18n()
const showModal = useVModel(props, 'showModal', emit)
const formRef = ref<{ validate: () => Promise<{ valid: boolean }> }>()
const isLoading = ref(false)
const validationSchema = toTypedSchema(productSchema)

const createMutation = useCreateProductMutation()
const updateMutation = useUpdateProductMutation()

const formData = reactive<ProductBase>({
  name: { ar: '', en: '' },
  description: '',
  is_active: true,
})

watch(
  () => props.showModal,
  (open) => {
    if (!open) return
    if (props.activeItem) Object.assign(formData, cloneItem(props.activeItem))
    else Object.assign(formData, { name: { ar: '', en: '' }, description: '', is_active: true })
  },
)

function submit() {
  formRef.value?.validate().then(({ valid }) => {
    if (!valid) return
    isLoading.value = true

    const onSuccess = (res: { message?: string }) => {
      toast.success(res?.message || t('messages.saved'))
      showModal.value = false
      emit('saved')
    }
    const onSettled = () => {
      isLoading.value = false
    }

    if (props.formAction === 'create') {
      createMutation.mutate({ ...formData }, { onSuccess, onSettled })
    } else {
      updateMutation.mutate(
        { ...(formData as Product), id: formData.id! },
        { onSuccess, onSettled },
      )
    }
  })
}
</script>

<template>
  <Dialog v-model:open="showModal">
    <DialogContent class="max-w-xl">
      <DialogHeader>
        <DialogTitle>
          {{ formAction === 'create' ? t('actions.create') : t('actions.edit') }}
        </DialogTitle>
      </DialogHeader>

      <VeeForm
        ref="formRef"
        v-slot="{ meta }"
        :validation-schema="validationSchema"
        @submit="submit"
      >
        <div class="grid gap-4 py-2">
          <AppTextField v-model="formData.name.ar" name="name.ar" :label="t('fields.nameAr')" />
          <AppTextField v-model="formData.name.en" name="name.en" :label="t('fields.nameEn')" />
          <AppTextarea
            v-model="formData.description"
            name="description"
            :label="t('fields.description')"
          />
          <AppSwitch v-model="formData.is_active" name="is_active" :label="t('status.active')" />
        </div>

        <DialogFooter>
          <Button type="button" variant="outline" @click="showModal = false">
            {{ t('actions.cancel') }}
          </Button>
          <Button type="button" :disabled="!meta.valid || isLoading" @click="submit">
            {{ formAction === 'create' ? t('actions.create') : t('actions.save') }}
          </Button>
        </DialogFooter>
      </VeeForm>
    </DialogContent>
  </Dialog>
</template>
```

---

## Step 6 — List page

**Must have a single root `<div>`** (route `<Transition>` breaks on multi-root pages).

```vue
<!-- pages/ProductsPage.vue -->
<script setup lang="ts">
import { toast } from 'vue-sonner'
import { Pencil, Trash2 } from 'lucide-vue-next'
import type { pageAction } from '@/interfaces/Shared'
import type { Product } from '../interfaces/Product'
import { useDeleteProductMutation, useProductsQuery } from '../composables/useProducts'
import { productsService } from '../services/ProductsService'
import ProductFormModal from '../modals/ProductFormModal.vue'

const { t } = useI18n()
const { hasPermission } = useAuthStore()

const params = reactive({
  page: 1,
  itemPerPage: 20,
  keyword: '',
})

const { data, isLoading, isFetching, refetch } = useProductsQuery(params)
const deleteMutation = useDeleteProductMutation()

const {
  showFormModal,
  formAction,
  activeItem,
  selectedItems,
  confirmModal,
  showCreateModal,
  showEditModal,
  showConfirmDelete,
  onReloadData,
} = UseCrudPage<Product>()

const permissions = computed(() => ({
  create: hasPermission('create_product'),
  edit: hasPermission('update_product'),
  delete: hasPermission('delete_product'),
}))

const pageActionsButtons = computed<pageAction[]>(() => [
  {
    label: t('actions.create'),
    show: permissions.value.create,
    icon: 'create',
    handler: showCreateModal,
  },
])

const headers = computed(() => [
  { title: '#', key: 'id' },
  { title: t('fields.nameAr'), key: 'name.ar' },
  { title: t('fields.nameEn'), key: 'name.en' },
  { title: t('fields.status'), key: 'is_active', align: 'center' as const },
  { title: t('fields.actions'), key: 'actions', align: 'center' as const },
])

const items = computed(() => data.value?.data ?? [])
const meta = computed(() => data.value?.meta ?? null)

async function deleteItem(item: Product) {
  const confirmed = await showConfirmDelete()
  if (!confirmed) return

  deleteMutation.mutate(item.id, {
    onSuccess: (res) => toast.success(res?.message || t('messages.deleted')),
  })
}

function reloadList() {
  onReloadData(() => refetch())
}
</script>

<template>
  <!-- SINGLE ROOT — required -->
  <div>
    <ConfirmModal ref="confirmModal" />

    <ProductFormModal
      v-if="showFormModal"
      v-model:show-modal="showFormModal"
      :form-action="formAction"
      :active-item="activeItem"
      @saved="refetch()"
    />

    <Card>
      <CardHeader>
        <CardTitle>{{ t('modules.products') }}</CardTitle>
      </CardHeader>

      <CardContent>
        <PageActions
          :page-actions-buttons="pageActionsButtons"
          :items-per-page="params.itemPerPage"
          :search="params.keyword"
          :show-search="true"
          :show-multi-delete="permissions.delete"
          :show-multi-activate="permissions.edit"
          :selected-items="selectedItems"
          model="products"
          @update:items-per-page="
            (v: number) => {
              params.itemPerPage = v
              params.page = 1
            }
          "
          @update:search="
            (v: string) => {
              params.keyword = v
              params.page = 1
            }
          "
          @reload-data="reloadList"
        />

        <AppDataTable
          v-model:selected-items="selectedItems"
          :headers="headers"
          :items="items"
          :loading="isLoading || isFetching"
          :meta="meta"
          :show-select="true"
        >
          <template #item.is_active="{ item }">
            <Badge :variant="item.is_active ? 'default' : 'outline'">
              {{ item.is_active ? t('status.active') : t('status.inactive') }}
            </Badge>
          </template>

          <template #item.actions="{ item }">
            <div class="flex justify-center gap-1">
              <Button
                v-if="permissions.edit"
                variant="ghost"
                size="icon"
                @click="showEditModal(item as Product)"
              >
                <Pencil class="size-4" />
              </Button>
              <Button
                v-if="permissions.delete"
                variant="ghost"
                size="icon"
                @click="deleteItem(item as Product)"
              >
                <Trash2 class="size-4 text-destructive" />
              </Button>
            </div>
          </template>

          <template #bottom>
            <PagePagination v-model:page="params.page" :meta="meta" />
          </template>
        </AppDataTable>
      </CardContent>
    </Card>
  </div>
</template>
```

---

## Step 7 — Module shell + routes

```vue
<!-- ProductsModule.vue -->
<script setup lang="ts">
import { RouterView } from 'vue-router'
</script>

<template>
  <div>
    <RouterView />
  </div>
</template>
```

```ts
// ProductsRoutes.ts
export const ProductsRoutes = [
  {
    path: '',
    name: 'products-page',
    component: () => import('./pages/ProductsPage.vue'),
    meta: {
      requiredPermission: 'view_products',
    },
  },
]
```

---

## Step 8 — Register in the router

```ts
// src/router/index.ts
import { ProductsRoutes } from '@/modules/products/ProductsRoutes'

// inside routes: [...]
{
  path: '/products',
  name: 'products',
  component: () => import('@/modules/products/ProductsModule.vue'),
  meta: { layout: 'default' },
  children: ProductsRoutes,
},
```

---

## Step 9 — Nav + i18n

### 9.1 Nav item

Use `registerNavItem` in `src/lib/nav.ts` (do **not** edit `AppSidebar`):

```ts
import { Package } from 'lucide-vue-next'
import { registerNavItem } from '@/lib/nav'

registerNavItem(
  {
    id: 'products',
    titleKey: 'nav.products',
    routeName: 'products-page',
    icon: 'package',
    permission: 'view_products',
  },
  Package,
)
```

### 9.2 Translations

Add keys in `src/plugins/i18n/locales/en.json` and `ar.json`:

```json
{
  "nav": {
    "products": "Products"
  },
  "modules": {
    "products": "Products"
  }
}
```

---

## Step 10 — Optional upgrades

Copy patterns from `demo-crud` when needed:

| Feature              | How                                                                                          |
| -------------------- | -------------------------------------------------------------------------------------------- |
| Filters drawer       | `FilterSideBar` + module `*Filter.vue` + `PageActions` `:show-filter`                        |
| Table / cards toggle | `v-model:view-mode` on `PageActions` + `:view-mode` on `AppDataTable`                        |
| Draggable rows       | `:enable-drag="true"` + `@reorder`                                                           |
| Bulk actions         | `:show-select` + `:show-multi-delete` / `:show-multi-activate` — defaults to `sharedService` |
| Active filter chips  | `ActiveFilterChips` under `PageActions`                                                      |
| Error / retry UI     | Use `isError` from `useProductsQuery`                                                        |

---

## Globals you get for free (no import)

| Global                                                  | Role                                |
| ------------------------------------------------------- | ----------------------------------- |
| `AppTextField`, `AppTextarea`, `AppSelect`, `AppSwitch` | Form fields + validation            |
| `AppDataTable`, `PageActions`, `PagePagination`         | List UI                             |
| `FilterSideBar`, `ConfirmModal`                         | Filters + confirm                   |
| `VeeForm`, `VeeField`                                   | Validation form                     |
| `UseCrudPage`                                           | Modal + selection + confirm helpers |
| `useI18n`, `useAuthStore`, vue-query APIs               | Via auto-import                     |

---

## Common mistakes

1. **Multi-root page template** → blank screen on route change. Always wrap in one `<div>`.
2. Forgetting **router + nav + i18n** → page exists but is unreachable / untranslated.
3. Wrong **list response shape** → empty table (need `data` + `meta`).
4. Missing **permission** on route/nav while user lacks it → redirected to error page.
5. Using raw Vuetify inputs → prefer `App*` + `VeeForm` for consistency.

---

## Quick copy path

1. Copy `src/modules/participant-categories/`
2. Rename files/symbols to your module
3. Update `contextPath`, interfaces, headers, form fields
4. Register router + `registerNavItem` in `src/lib/nav.ts` + i18n
5. Run `yarn validate`
