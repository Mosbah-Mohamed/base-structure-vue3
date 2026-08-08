<script setup lang="ts">
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog'

const open = ref(false)
const title = ref('')
const description = ref('')
let resolveFn: ((value: boolean) => void) | null = null

const { t } = useI18n()

function confirm(options?: { title?: string; description?: string }) {
  title.value = options?.title || t('actions.confirmDelete')
  description.value = options?.description || t('messages.deleteConfirm')
  open.value = true

  return new Promise<boolean>((resolve) => {
    resolveFn = resolve
  })
}

function onConfirm() {
  open.value = false
  resolveFn?.(true)
  resolveFn = null
}

function onCancel() {
  open.value = false
  resolveFn?.(false)
  resolveFn = null
}

defineExpose({ confirm })
</script>

<template>
  <AlertDialog :open="open" @update:open="(value) => !value && onCancel()">
    <AlertDialogContent>
      <AlertDialogHeader>
        <AlertDialogTitle>{{ title }}</AlertDialogTitle>
        <AlertDialogDescription>{{ description }}</AlertDialogDescription>
      </AlertDialogHeader>
      <AlertDialogFooter>
        <AlertDialogCancel @click="onCancel">{{ t('actions.cancel') }}</AlertDialogCancel>
        <AlertDialogAction
          class="bg-destructive text-destructive-foreground hover:bg-destructive/90"
          @click="onConfirm"
        >
          {{ t('actions.delete') }}
        </AlertDialogAction>
      </AlertDialogFooter>
    </AlertDialogContent>
  </AlertDialog>
</template>
