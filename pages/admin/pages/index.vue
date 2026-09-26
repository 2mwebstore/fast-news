<script setup lang="ts">
/**
 * Standalone pages: the policies, About and Contact (§93).
 *
 * These were Vue files until now, which meant a wording change in the privacy
 * policy needed a developer and a deploy.
 *
 * Deleting a required page is allowed but deliberately harder: search engines
 * already know /privacy, so a delete leaves a 404 there, while unpublishing
 * achieves the same visible result reversibly. The dialog says so and asks the
 * operator to type the address, and the API refuses without an explicit confirm.
 */
definePageMeta({ layout: 'admin', middleware: 'admin' })

const api = useAdminApi()
const { t, locale } = useAdminLocale()
const { dateTime } = useFormat()

interface PageRow {
  id: number
  slug: string
  titleKh: string
  titleEn?: string
  isPublished: boolean
  showInFooter: boolean
  isSystem: boolean
  position: number
  hasEnglish: boolean
  wordsKh: number
  updatedAt: string
}

const pages = ref<PageRow[]>([])
const loading = ref(true)
const errorMessage = ref('')
const notice = ref('')

const deleteTarget = ref<PageRow | null>(null)
const deleting = ref(false)

const route = useRoute()

function title(page: PageRow) {
  return locale.value === 'en' && page.titleEn ? page.titleEn : page.titleKh
}

async function load() {
  loading.value = true
  errorMessage.value = ''
  try {
    pages.value = await api.get<PageRow[]>('/api/admin/pages')
  } catch (e: unknown) {
    errorMessage.value = (e as { data?: { message?: string } }).data?.message || t('pagesLoadFailed')
  } finally {
    loading.value = false
  }
}
onMounted(load)

// The editor route redirects back here with its confirmation.
onMounted(() => {
  if (route.query.saved) notice.value = String(route.query.saved)
})

async function confirmDelete() {
  const target = deleteTarget.value
  if (!target) return
  deleting.value = true
  errorMessage.value = ''
  try {
    // The API requires this for a required page, and ignores it otherwise.
    await api.del(`/api/admin/pages/${target.id}?confirm=permanent`)
    deleteTarget.value = null
    notice.value = t('saved')
    await load()
  } catch (e: unknown) {
    // The API refuses to delete a required page and explains why; that message
    // is more useful than anything generic.
    errorMessage.value = (e as { data?: { message?: string } }).data?.message || t('pageDeleteFailed')
    deleteTarget.value = null
  } finally {
    deleting.value = false
  }
}

useHead({ title: `${t('pagesNav')} · CFN Admin` })
</script>

<template>
  <div class="space-y-6">
    <header class="flex flex-wrap items-start justify-between gap-3">
      <div>
        <h1 class="text-xl font-bold">{{ t('pagesNav') }}</h1>
        <p class="mt-1 max-w-2xl text-sm text-ink-muted">{{ t('pagesIntro') }}</p>
      </div>
      <NuxtLink
        to="/admin/pages/new"
        class="rounded-lg bg-brand px-4 py-2 text-sm font-semibold text-white hover:bg-brand-dark"
      >+ {{ t('newPage') }}</NuxtLink>
    </header>

    <p v-if="notice" role="status" class="rounded-lg bg-success/10 px-4 py-3 text-sm text-success">{{ notice }}</p>
    <p v-if="errorMessage" role="alert" class="rounded-lg bg-breaking/10 px-4 py-3 text-sm text-breaking">{{ errorMessage }}</p>

    <p v-if="loading" class="py-12 text-center text-sm text-ink-muted">{{ t('loading') }}</p>
    <p v-else-if="!pages.length" class="card p-8 text-center text-sm text-ink-muted">{{ t('noPages') }}</p>

    <div v-else class="card overflow-hidden">
      <ul class="divide-y divide-line">
        <li
          v-for="page in pages"
          :key="page.id"
          class="flex flex-wrap items-start gap-3 p-4 hover:bg-surface-muted"
        >
          <div class="min-w-0 flex-1">
            <p class="flex flex-wrap items-center gap-2 text-kh-sm font-semibold">
              <NuxtLink :to="`/admin/pages/${page.id}`" class="hover:text-brand">{{ title(page) }}</NuxtLink>
              <span v-if="page.isSystem" class="rounded bg-ink/10 px-1.5 py-0.5 text-xs font-normal text-ink-muted">
                {{ t('required') }}
              </span>
              <span v-if="!page.isPublished" class="rounded bg-warning/15 px-1.5 py-0.5 text-xs font-normal">
                {{ t('hidden') }}
              </span>
              <span
                :class="[
                  'rounded px-1.5 py-0.5 text-xs font-normal',
                  page.hasEnglish ? 'bg-success/10 text-success' : 'bg-surface-muted text-ink-muted',
                ]"
              >{{ page.hasEnglish ? t('translated') : t('noTranslationYet') }}</span>
            </p>

            <div class="mt-1 flex flex-wrap items-center gap-2 text-xs text-ink-muted">
              <code class="font-mono">/{{ page.slug }}</code>
              <span>· {{ page.showInFooter ? t('inFooter') : t('notInMenu') }}</span>
              <span>· {{ t('wordsKh', { n: page.wordsKh }) }}</span>
              <span>· {{ dateTime(page.updatedAt) }}</span>
            </div>
          </div>

          <div class="flex shrink-0 items-center gap-1">
            <a
              v-if="page.isPublished"
              :href="`/${page.slug}`" target="_blank" rel="noopener"
              class="rounded px-2 py-1 text-sm text-ink-muted hover:text-brand"
            >{{ t('viewPage') }}</a>
            <NuxtLink
              :to="`/admin/pages/${page.id}`"
              class="rounded-lg border border-line px-3 py-1 text-sm font-semibold hover:bg-surface"
            >{{ t('edit') }}</NuxtLink>
            <button
              type="button"
              class="rounded px-2 py-1 text-sm text-breaking hover:bg-breaking/10"
              @click="deleteTarget = page"
            >{{ t('remove') }}</button>
          </div>
        </li>
      </ul>
    </div>

    <!-- requireText only for a required page: typing the address is a
         proportionate speed bump there, and busywork for a page somebody added
         themselves five minutes ago. -->
    <ConfirmDialog
      :open="!!deleteTarget"
      :title="t('deletePageTitle')"
      :message="deleteTarget ? t('deletePageMessage', { name: title(deleteTarget) }) : ''"
      :require-text="deleteTarget?.isSystem ? deleteTarget.slug : undefined"
      :consequences="deleteTarget?.isSystem
        ? [t('deleteRequiredWarning'), t('deleteRequiredUnpublish')]
        : []"
      :confirm-label="t('remove')"
      :cancel-label="t('cancel')"
      :busy="deleting"
      @confirm="confirmDelete"
      @cancel="deleteTarget = null"
    />
  </div>
</template>
