<script setup lang="ts">
import type { ApiMeta } from '~/types'
import type { SelectOption } from '~/components/SelectField.vue'

/**
 * Video library (§26) — a paginated list with thumbnails, laid out like the
 * article list so the two read the same way.
 *
 * Pagination rather than infinite scroll: an editor working through a library
 * needs a stable position they can return to, which an endless feed takes away.
 */
definePageMeta({ layout: 'admin', middleware: 'admin' })

const api = useAdminApi()
const route = useRoute()
const router = useRouter()
const auth = useAuthStore()
const { t, locale } = useAdminLocale()
const { meta: platformMeta, toOptions } = useMeta()
const { dateTime, duration, compact } = useFormat()

interface AdminVideo {
  id: number; slug: string; titleKh: string; titleEn?: string
  youtubeId: string; embedUrl: string; watchUrl: string
  thumbnailUrl?: string; thumbnailAlt?: string
  durationSec: number
  status: 'draft' | 'published' | 'archived'
  publishedAt?: string; viewCount: number; updatedAt: string
  category?: { nameKh: string; nameEn: string }
}

const videos = ref<AdminVideo[]>([])
const meta = ref<ApiMeta | null>(null)
const loading = ref(true)
const search = ref(String(route.query.search ?? ''))

const status = computed(() => String(route.query.status ?? ''))
const limit = computed(() => Number(route.query.limit) || 25)
const page = computed(() => Math.max(1, Number(route.query.page) || 1))

const pendingDelete = ref<AdminVideo | null>(null)
const deleting = ref(false)
const errorMessage = ref('')

const statusOptions = computed<SelectOption[]>(() => [
  { value: '', label: t('all') },
  ...toOptions(platformMeta.value?.videoStatuses, locale.value),
])
const limitOptions: SelectOption[] = [25, 50, 100].map(n => ({ value: n, label: String(n) }))

async function load() {
  loading.value = true
  try {
    const result = await api.list<AdminVideo[]>('/api/admin/videos', {
      status: status.value || undefined,
      search: String(route.query.search ?? '') || undefined,
      page: page.value,
      limit: limit.value,
    })
    videos.value = result.data ?? []
    meta.value = result.meta ?? null
  } finally {
    loading.value = false
  }
}
onMounted(load)
watch(() => route.query, load)

function setQuery(patch: Record<string, unknown>) {
  router.push({ query: { ...route.query, ...patch, page: undefined } })
}

async function setStatus(video: AdminVideo, next: string) {
  await api.post(`/api/admin/videos/${video.id}/status`, { status: next })
  await load()
}

async function confirmDelete() {
  if (!pendingDelete.value) return
  deleting.value = true
  errorMessage.value = ''
  try {
    await api.del(`/api/videos/${pendingDelete.value.id}`)
    pendingDelete.value = null
    await load()
  } catch (e: unknown) {
    errorMessage.value = (e as { data?: { message?: string } }).data?.message || 'Could not delete the video.'
  } finally {
    deleting.value = false
  }
}

function title(video: AdminVideo) {
  return locale.value === 'en' && video.titleEn ? video.titleEn : video.titleKh
}

useHead({ title: 'Videos — Newsroom' })
</script>

<template>
  <div>
    <div class="mb-4 flex flex-wrap items-center justify-between gap-3">
      <div>
        <h1 class="text-xl font-bold">{{ t('videos') }}</h1>
        <p v-if="meta" class="text-sm text-ink-muted">
          {{ t('showing', { shown: videos.length, total: meta.total }) }}
        </p>
      </div>
      <NuxtLink
        to="/admin/videos/create"
        class="rounded-lg bg-brand px-4 py-2 text-sm font-semibold text-white hover:bg-brand-dark"
      >+ {{ t('create') }}</NuxtLink>
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
          @click="setQuery({ status: option.value || undefined })"
        >{{ option.label }}</button>
      </div>

      <div class="flex flex-wrap items-center gap-3">
        <div class="min-w-[16rem] flex-1">
          <SearchInput
            v-model="search"
            :placeholder="t('searchVideos')"
            :busy="loading"
            @search="setQuery({ search: $event || undefined })"
            @clear="setQuery({ search: undefined })"
          />
        </div>
        <SelectField
          :model-value="limit"
          :options="limitOptions"
          :label="t('perPage')"
          inline size="sm"
          @update:model-value="setQuery({ limit: Number($event) })"
        />
      </div>
    </div>

    <p v-if="errorMessage" class="mb-4 rounded-lg bg-breaking/10 p-3 text-sm text-breaking">{{ errorMessage }}</p>
    <p v-if="loading" class="py-12 text-center text-ink-muted">{{ t('loading') }}</p>
    <p v-else-if="!videos.length" class="card py-12 text-center text-ink-muted">{{ t('noResults') }}</p>

    <!-- ── List ──────────────────────────────────────────────────────── -->
    <template v-else>
      <div class="card overflow-hidden">
        <ul class="divide-y divide-line">
          <li
            v-for="video in videos"
            :key="video.id"
            class="flex flex-wrap items-start gap-3 p-4 hover:bg-surface-muted"
          >
            <SmartImage
              :src="video.thumbnailUrl"
              :alt="video.thumbnailAlt || title(video)"
              :width="64" :height="36"
              class="h-9 w-16 shrink-0 rounded"
            />

            <div class="min-w-0 flex-1">
              <NuxtLink
                :to="`/admin/videos/${video.id}/edit`"
                class="block truncate text-kh-sm font-semibold hover:text-brand"
              >{{ title(video) }}</NuxtLink>

              <div class="mt-1 flex flex-wrap items-center gap-2 text-xs text-ink-muted">
                <AdminStatusBadge :status="video.status" />
                <span v-if="video.category">
                  {{ locale === 'en' ? video.category.nameEn : video.category.nameKh }}
                </span>
                <span v-if="video.durationSec" class="tabular-nums">· {{ duration(video.durationSec) }}</span>
                <span>· {{ dateTime(video.publishedAt || video.updatedAt) }}</span>
                <span>· {{ compact(video.viewCount) }}</span>
              </div>

              <a
                :href="video.watchUrl" target="_blank" rel="noopener"
                class="mt-1 block truncate text-xs text-ink-muted hover:text-brand"
              >youtube.com/watch?v={{ video.youtubeId }}</a>
            </div>

            <div class="flex shrink-0 flex-wrap gap-1.5">
              <NuxtLink
                :to="`/admin/videos/${video.id}/edit`"
                class="rounded border border-line px-2 py-1 text-xs hover:bg-surface"
              >{{ t('edit') }}</NuxtLink>

              <NuxtLink
                v-if="video.status === 'published'"
                :to="`/video/${video.slug}`" target="_blank"
                class="rounded border border-line px-2 py-1 text-xs hover:bg-surface"
              >{{ t('view') }}</NuxtLink>

              <button
                v-if="video.status !== 'published'"
                class="rounded bg-success px-2 py-1 text-xs font-semibold text-white hover:opacity-90"
                @click="setStatus(video, 'published')"
              >{{ t('statusPublished') }}</button>
              <button
                v-else
                class="rounded border border-line px-2 py-1 text-xs hover:bg-surface"
                @click="setStatus(video, 'archived')"
              >{{ t('statusArchived') }}</button>

              <button
                v-if="auth.can('video.manage')"
                class="rounded border border-breaking px-2 py-1 text-xs text-breaking hover:bg-breaking/5"
                @click="pendingDelete = video"
              >{{ t('remove') }}</button>
            </div>
          </li>
        </ul>
      </div>

      <Pagination v-if="meta" :meta="meta" base-path="/admin/videos" />
    </template>

    <ConfirmDialog
      :open="!!pendingDelete"
      :title="t('confirmDeleteTitle')"
      :message="pendingDelete ? title(pendingDelete) : ''"
      :consequences="[
        'The video is removed from the site and from sitemaps.',
        'The YouTube video itself is not affected.',
        'The record is retired, not destroyed — it stays in the audit log.',
      ]"
      :confirm-label="t('remove')"
      :busy="deleting"
      @confirm="confirmDelete"
      @cancel="pendingDelete = null"
    />
  </div>
</template>
