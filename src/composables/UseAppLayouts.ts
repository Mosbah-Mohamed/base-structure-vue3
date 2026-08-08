import BlankLayout from '@/layouts/BlankLayout.vue'
import DefaultLayout from '@/layouts/DefaultLayout.vue'
import FormsLayout from '@/layouts/FormsLayout.vue'

export default function UseAppLayouts() {
  const route = useRoute()

  const layoutComponent = computed(() => {
    switch (route.meta.layout) {
      case 'blank':
        return BlankLayout
      case 'forms':
        return FormsLayout
      default:
        return DefaultLayout
    }
  })

  return { layoutComponent }
}
