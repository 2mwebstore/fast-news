<script setup lang="ts">
import type { ApiMeta, ArticleStatus } from '~/types'
import type { AdminCard } from '~/types/admin'

/** Article list (§73 /admin/news) with search, page size and scroll-to-load. */
definePageMeta({ layout: 'admin', middleware: 'admin' })

const api = useAdminApi()
const route = useRoute()
const router = useRouter()
const { dateTime } = useFormat()
const { t, locale, contentTitle } = useAdminLocale()
const { meta: platformMeta, toOptions } = useMeta()
const auth = useAuthStore()

const pendingDelete = ref<AdminCard | null>(null)
const deleting = ref(false)
const deleteError = ref('')

const articles = ref<AdminCard[]>([])
const meta = ref<ApiMeta | null>(null)
const loading = ref(true)

const search = ref(String(route.query.search ?? ''))
const status = computed(() => String(route.query.status ?? ''))
const limit = computed(() => Number(route.query.limit) || 25)

// Statuses come from /api/meta, derived from the same constants the API
// validates against — so a workflow change cannot leave a filter offering a
// status the backend would reject.
const statusOptions = computed(() => [
  { value: '', label: t('all') },
  ...toOptions(platformMeta.value?.articleStatuses, locale.value),
])

const limitOptions = [25, 50, 100].map(n => ({ value: n, label: String(n) }))

async function confirmDelete() {
  if (!pendingDelete.value) return
  deleting.value = true
  deleteError.value = ''
  try {
    await api.del(`/api/news/${pendingDelete.value.id}`)
    pendingDelete.value = null
    await load()
  } catch (e: unknown) {
    deleteError.value = (e as { data?: { message?: string } }).data?.message || 'Could not delete the article.'
  } finally {
    deleting.value = false
  }
}

function query(page: number) {
  return {
    status: status.value || undefined,
    search: String(route.query.search ?? '') || undefined,
    page,
    limit: limit.value,
  }
}

/** Loads the first page. Any filter change starts over from here. */
async function load() {
  loading.value = true
  try {
    const result = await api.list<AdminCard[]>('/api/admin/news', query(1))
    articles.value = result.data ?? []
    meta.value = result.meta ?? null
    resetFeed(result.meta)
  } finally {
    loading.value = false
  }
}

const {
  extra: extraArticles,
  loading: feedLoading,
  hasMore: feedHasMore,
  failed: feedFailed,
  sentinel,
  next: loadNextPage,
  reset: resetFeed,
} = usePagedFeed<AdminCard>(
  async (page) => {
    const result = await api.list<AdminCard[]>('/api/admin/news', query(page))
    return { data: result.data ?? [], meta: result.meta }
  },
  { meta: null },
)

const rows = computed(() => [...articles.value, ...extraArticles.value])

onMounted(load)
watch(() => route.query, load)

// SearchInput owns the debounce, so every search box on the platform behaves
// the same way.
function applySearch(value: string) {
  router.push({ query: { ...route.query, search: value || undefined, page: undefined } })
}

function setStatus(next: string) {
  router.push({ query: { ...route.query, status: next || undefined, page: undefined } })
}

function setLimit(next: number) {
  router.push({ query: { ...route.query, limit: next, page: undefined } })
}

useHead({ title: 'Articles — Newsroom' })
</script>

<template>
  <div>
    <div class="mb-4 flex flex-wrap items-center justify-between gap-3">
      <div>
        <h1 class="text-xl font-bold">{{ t('articles') }}</h1>
        <p v-if="meta" class="text-sm text-ink-muted">
          {{ t('showing', { shown: rows.length, total: meta.total }) }}
        </p>
      </div>
      <NuxtLink to="/admin/news/create" class="rounded-lg bg-brand px-4 py-2 text-sm font-semibold text-white hover:bg-brand-dark">
        {{ t('newArticle') }}
      </NuxtLink>
    </div>

    <!-- ── Filters ───────────────────────────────────────────────────── -->
    <div class="mb-4 space-y-3">
      <div class="flex flex-wrap items-center gap-2">
        <button
          v-for="option in statusOptions" :key="option.value"
          :class="[
            'rounded-full border px-3 py-1.5 text-sm transition-colors',
            status === option.value ? 'border-brand bg-brand text-white' : 'border-line hover:border-brand',
          ]"
          @click="setStatus(option.value)"
        >{{ option.label }}</button>
      </div>

      <div class="flex flex-wrap items-center gap-3">
        <div class="min-w-[16rem] flex-1">
          <SearchInput
            v-model="search"
            :placeholder="t('searchArticles')"
            :busy="loading"
            @search="applySearch"
            @clear="applySearch('')"
          />
        </div>
        <SelectField
          :model-value="limit"
          :options="limitOptions"
          :label="t('perPage')"
          inline size="sm"
          @update:model-value="setLimit(Number($event))"
        />
      </div>
    </div>

    <!-- ── Results ───────────────────────────────────────────────────── -->
    <p v-if="loading" class="py-12 text-center text-ink-muted">{{ t('loading') }}</p>
    <p v-else-if="!rows.length" class="card py-12 text-center text-ink-muted">
      {{ t('noResults') }}
    </p>

    <template v-else>
      <div class="card overflow-hidden">
        <ul class="divide-y divide-line">
          <li v-for="article in rows" :key="article.id" class="flex items-start gap-3 p-4 hover:bg-surface-muted">
            <SmartImage
              :src="article.imageUrl" :alt="article.imageAlt || ''"
              :width="64" :height="36"
              class="h-9 w-16 shrink-0 rounded"
            />

            <div class="min-w-0 flex-1">
              <NuxtLink :to="`/admin/news/${article.id}/edit`" class="block truncate text-kh-sm font-semibold hover:text-brand">
                {{ contentTitle(article) }}
              </NuxtLink>
              <div class="mt-1 flex flex-wrap items-center gap-2 text-xs text-ink-muted">
                <AdminStatusBadge :status="article.status" />
                <span v-if="article.category">{{ article.category.nameKh }}</span>
                <span v-if="article.author">· {{ article.author.nameKh }}</span>
                <span>· {{ dateTime(article.publishedAt || article.updatedAt) }}</span>
                <span>· {{ article.wordCount }} {{ t('words') }}</span>
                <span v-if="article.aiAssisted" class="rounded bg-brand/10 px-1.5 py-0.5 text-brand">AI draft</span>
                <BreakingBadge v-if="article.isBreaking" small />
              </div>
            </div>

            <div class="flex shrink-0 gap-1.5">
              <NuxtLink
                v-if="article.status === 'published'"
                :to="`/news/${article.slug}`" target="_blank"
                class="rounded border border-line px-2 py-1 text-xs hover:bg-surface"
              >{{ t('view') }}</NuxtLink>
              <button
                v-if="auth.can('news.delete')"
                class="rounded border border-breaking px-2 py-1 text-xs text-breaking hover:bg-breaking/5"
                @click="pendingDelete = article"
              >{{ t('remove') }}</button>
            </div>
          </li>
        </ul>
      </div>

      <div ref="sentinel" aria-hidden="true" />
      <InfiniteFooter
        :loading="feedLoading"
        :has-more="feedHasMore"
        :failed="feedFailed"
        show-end
        @next="loadNextPage"
      />
    </template>

    <ConfirmDialog
      :open="!!pendingDelete"
      :title="t('confirmDeleteTitle')"
      :message="pendingDelete ? contentTitle(pendingDelete) : ''"
      :require-text="pendingDelete?.status === 'published' ? 'DELETE' : undefined"
      :consequences="[
        'The article is removed from the site, feeds and sitemaps.',
        'Existing links to it will stop working — add a redirect if it was published.',
        'The record is retired, not destroyed, and stays in the audit log.',
      ]"
      :confirm-label="t('remove')"
      :busy="deleting"
      @confirm="confirmDelete"
      @cancel="pendingDelete = null"
    />
    <p v-if="deleteError" class="mt-3 rounded-lg bg-breaking/10 p-3 text-sm text-breaking">{{ deleteError }}</p>
  </div>
</template>
