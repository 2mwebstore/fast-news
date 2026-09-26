<script setup lang="ts">
/**
 * Page editor. Handles both create (/admin/pages/new) and edit
 * (/admin/pages/<id>) so the two never drift apart.
 *
 * The English body is deliberately optional. A privacy policy or set of
 * editorial standards is a commitment the newsroom makes, so it is written by a
 * person, not translated automatically. Until it exists, English readers get the
 * Khmer text with a note saying so.
 */
definePageMeta({ layout: 'admin', middleware: 'admin' })

const api = useAdminApi()
const route = useRoute()
const router = useRouter()
const { t } = useAdminLocale()

const isNew = computed(() => route.params.id === 'new')
const pageId = computed(() => (isNew.value ? 0 : Number(route.params.id)))

interface PageDetail {
  id: number
  slug: string
  titleKh: string
  titleEn: string
  bodyKh: string
  bodyEn: string
  metaDescKh: string
  metaDescEn: string
  isPublished: boolean
  showInFooter: boolean
  isSystem: boolean
  position: number
}

const form = reactive({
  slug: '', titleKh: '', titleEn: '',
  bodyKh: '', bodyEn: '',
  metaDescKh: '', metaDescEn: '',
  isPublished: false, showInFooter: true, position: 0,
})

const isSystem = ref(false)
const loading = ref(!isNew.value)
const saving = ref(false)
const errorMessage = ref('')

async function load() {
  if (isNew.value) return
  loading.value = true
  try {
    const page = await api.get<PageDetail>(`/api/admin/pages/${pageId.value}`)
    Object.assign(form, {
      slug: page.slug, titleKh: page.titleKh, titleEn: page.titleEn ?? '',
      bodyKh: page.bodyKh ?? '', bodyEn: page.bodyEn ?? '',
      metaDescKh: page.metaDescKh ?? '', metaDescEn: page.metaDescEn ?? '',
      isPublished: page.isPublished, showInFooter: page.showInFooter,
      position: page.position,
    })
    isSystem.value = page.isSystem
  } catch (e: unknown) {
    errorMessage.value = (e as { data?: { message?: string } }).data?.message || t('pageNotFound')
  } finally {
    loading.value = false
  }
}
onMounted(load)

const canSave = computed(() => !saving.value && form.titleKh.trim() !== '')

async function save() {
  if (!canSave.value) return
  saving.value = true
  errorMessage.value = ''
  try {
    const body = { ...form }
    if (isNew.value) {
      await api.post('/api/admin/pages', body)
    } else {
      await api.put(`/api/admin/pages/${pageId.value}`, body)
    }
    await router.push({ path: '/admin/pages', query: { saved: t('saved') } })
  } catch (e: unknown) {
    errorMessage.value = (e as { data?: { message?: string } }).data?.message || t('pageSaveFailed')
  } finally {
    saving.value = false
  }
}

useHead({ title: `${isNew.value ? t('newPage') : t('editPage')} · CFN Admin` })
</script>

<template>
  <div class="space-y-5">
    <div>
      <NuxtLink to="/admin/pages" class="text-sm text-brand hover:underline">← {{ t('backToPages') }}</NuxtLink>
    </div>

    <p v-if="errorMessage" role="alert" class="rounded-lg bg-breaking/10 p-3 text-sm text-breaking">{{ errorMessage }}</p>
    <p v-if="loading" class="py-12 text-center text-ink-muted">{{ t('loading') }}</p>

    <form v-else class="space-y-5" @submit.prevent="save">
      <h1 class="text-xl font-bold">{{ isNew ? t('newPage') : t('editPage') }}</h1>

      <div class="card space-y-4 p-5">
        <div class="grid gap-4 sm:grid-cols-2">
          <div>
            <label for="p-title-kh" class="mb-1 block text-sm font-medium">{{ t('titleKh') }} *</label>
            <input
              id="p-title-kh" v-model="form.titleKh" required
              class="w-full rounded-lg border border-line px-3 py-2 text-kh-sm outline-none focus:border-brand"
            >
          </div>
          <div>
            <label for="p-title-en" class="mb-1 block text-sm font-medium">{{ t('titleEn') }}</label>
            <input
              id="p-title-en" v-model="form.titleEn"
              class="w-full rounded-lg border border-line px-3 py-2 text-sm outline-none focus:border-brand"
            >
          </div>
        </div>

        <div>
          <label for="p-slug" class="mb-1 block text-sm font-medium">{{ t('pageAddress') }}</label>
          <div class="flex items-center gap-1">
            <span class="shrink-0 text-sm text-ink-muted">/</span>
            <input
              id="p-slug" v-model="form.slug" :disabled="isSystem" placeholder="privacy"
              class="w-full rounded-lg border border-line px-3 py-2 font-mono text-sm outline-none focus:border-brand disabled:bg-surface-muted disabled:text-ink-muted"
            >
          </div>
          <p v-if="isSystem" class="mt-1 text-xs text-ink-muted">{{ t('pageAddressFixed') }}</p>
          <p v-else class="mt-1 text-xs text-ink-muted">{{ t('slugHint') }}</p>
        </div>

        <div class="flex flex-wrap gap-5">
          <label class="flex items-start gap-2 text-sm">
            <input v-model="form.isPublished" type="checkbox" class="mt-0.5 rounded border-line">
            <span>
              {{ t('published') }}
              <span class="block text-xs text-ink-muted">{{ t('publishedHint') }}</span>
            </span>
          </label>
          <label class="flex items-center gap-2 text-sm">
            <input v-model="form.showInFooter" type="checkbox" class="rounded border-line">
            {{ t('inFooter') }}
          </label>
          <div>
            <label for="p-position" class="mb-1 block text-sm font-medium">{{ t('positionLabel') }}</label>
            <input
              id="p-position" v-model.number="form.position" type="number" min="0"
              class="w-24 rounded-lg border border-line px-3 py-2 text-sm outline-none focus:border-brand"
            >
          </div>
        </div>
      </div>

      <div class="card space-y-3 p-5">
        <label class="block text-sm font-medium">{{ t('bodyKhLabel') }}</label>
        <AdminRichText v-model="form.bodyKh" />
      </div>

      <div class="card space-y-3 p-5">
        <label class="block text-sm font-medium">{{ t('bodyEnLabel') }}</label>
        <p class="text-xs text-ink-muted">{{ t('bodyEnHint') }}</p>
        <AdminRichText v-model="form.bodyEn" />
      </div>

      <details class="card p-5">
        <summary class="cursor-pointer text-sm font-bold">SEO</summary>
        <div class="mt-4 grid gap-3 sm:grid-cols-2">
          <textarea
            v-model="form.metaDescKh" rows="2" :placeholder="`${t('metaDescription')} (ខ្មែរ)`"
            class="w-full rounded-lg border border-line px-3 py-2 text-kh-sm outline-none focus:border-brand"
          />
          <textarea
            v-model="form.metaDescEn" rows="2" :placeholder="`${t('metaDescription')} (EN)`"
            class="w-full rounded-lg border border-line px-3 py-2 text-sm outline-none focus:border-brand"
          />
        </div>
      </details>

      <div class="flex flex-wrap items-center gap-2">
        <button
          type="submit"
          class="rounded-lg bg-brand px-4 py-2 text-sm font-semibold text-white hover:bg-brand-dark disabled:opacity-50"
          :disabled="!canSave"
        >{{ saving ? t('saving') : t('save') }}</button>
        <NuxtLink
          to="/admin/pages"
          class="rounded-lg border border-line px-4 py-2 text-sm font-semibold hover:bg-surface-muted"
        >{{ t('cancel') }}</NuxtLink>
        <a
          v-if="!isNew && form.isPublished"
          :href="`/${form.slug}`" target="_blank" rel="noopener"
          class="text-sm text-brand hover:underline"
        >{{ t('viewPage') }} →</a>
      </div>
    </form>
  </div>
</template>
