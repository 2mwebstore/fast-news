<script setup lang="ts">
import type { ApiMeta } from '~/types'

/**
 * Audit log (§66, §79), with retention.
 *
 * Trimming the log is the one action that removes the record of other actions,
 * so it needs roles.manage — Super Admin only, the same gate as editing what a
 * role can do — and the purge records itself before deleting anything. A log
 * that could be silently shortened would not be an audit log.
 *
 * The windows are fixed at 1, 2 and 3 months rather than a free date, because a
 * free date lets somebody delete yesterday.
 */
definePageMeta({ layout: 'admin', middleware: 'admin' })

const { t } = useAdminLocale()

const api = useAdminApi()
const { dateTime } = useFormat()

interface Entry {
  id: number; createdAt: string; userEmail: string
  action: string; entityType: string; entityId?: number
  summary: string; ipAddress: string
}

interface RetentionWindow {
  months: number
  label: string
  cutoff: string
  removable: number
}
interface Retention {
  total: number
  oldest?: string
  windows: RetentionWindow[]
}

const auth = useAuthStore()
const route = useRoute()
const router = useRouter()

// Page and size live in the URL, so a page of the log is linkable and survives
// a reload — which matters when somebody is citing an entry to a colleague.
const page = computed(() => Math.max(1, Number(route.query.page) || 1))
const limit = computed(() => {
  const value = Number(route.query.limit) || 50
  return [25, 50, 100].includes(value) ? value : 50
})
const limitOptions = [25, 50, 100].map(n => ({ value: n, label: String(n) }))

const meta = ref<ApiMeta | null>(null)
const entries = ref<Entry[]>([])
const retention = ref<Retention | null>(null)
const loading = ref(true)
const purging = ref(false)
const notice = ref('')
const errorMessage = ref('')
const pending = ref<RetentionWindow | null>(null)

const canPurge = computed(() => auth.can('roles.manage'))

async function load() {
  loading.value = true
  try {
    const [result, stats] = await Promise.all([
      api.list<Entry[]>('/api/admin/audit-logs', { page: page.value, limit: limit.value }),
      api.get<Retention>('/api/admin/audit-logs/retention').catch(() => null),
    ])
    entries.value = result.data ?? []
    meta.value = result.meta ?? null
    retention.value = stats
  } finally {
    loading.value = false
  }
}
onMounted(load)

// Reloads when the page or size changes. immediate is off: onMounted already did
// the first fetch, and running both would double-request on load.
watch([page, limit], load)

/** A window around the current page — 40 pages of log should not render 40 links. */
const pageNumbers = computed(() => {
  if (!meta.value) return []
  const { page: current, totalPages } = meta.value
  const start = Math.max(1, current - 2)
  const end = Math.min(totalPages, current + 2)
  return Array.from({ length: end - start + 1 }, (_, i) => start + i)
})

function linkTo(target: number) {
  return {
    path: '/admin/audit-logs',
    query: {
      ...route.query,
      page: target === 1 ? undefined : target,
      limit: limit.value === 50 ? undefined : limit.value,
    },
  }
}

function setLimit(next: string | number) {
  // Back to page 1: page 7 of a 25-per-page list is not page 7 of a 100-per-page
  // one, and landing on an empty page would look like the log had been trimmed.
  router.push({ path: '/admin/audit-logs', query: { ...route.query, limit: Number(next), page: undefined } })
}

async function purge() {
  const window = pending.value
  if (!window) return
  purging.value = true
  errorMessage.value = ''
  try {
    const result = await api.del<{ removed: number }>(
      `/api/admin/audit-logs?months=${window.months}`,
    )
    notice.value = t('purgeDone', { n: result.removed })
    pending.value = null
    // A purge can shorten the log past the page being viewed, so go back to the
    // first page rather than showing an empty table.
    if (page.value > 1) {
      await router.push(linkTo(1))
    } else {
      await load()
    }
  } catch (e: unknown) {
    errorMessage.value = (e as { data?: { message?: string } }).data?.message || t('purgeFailed')
    pending.value = null
  } finally {
    purging.value = false
  }
}

useHead({ title: 'Audit log — Newsroom' })
</script>

<template>
  <div>
    <h1 class="mb-4 text-xl font-bold">{{ t('auditLogTitle') }}</h1>

    <p v-if="notice" role="status" class="mb-4 rounded-lg bg-success/10 p-3 text-sm text-success">{{ notice }}</p>
    <p v-if="errorMessage" role="alert" class="mb-4 rounded-lg bg-breaking/10 p-3 text-sm text-breaking">{{ errorMessage }}</p>

    <!-- ── Retention ─────────────────────────────────────────────────── -->
    <section v-if="canPurge && retention" class="card mb-6 p-5">
      <h2 class="mb-1 font-bold">{{ t('retention') }}</h2>
      <p class="mb-3 max-w-2xl text-sm text-ink-muted">{{ t('retentionIntro') }}</p>

      <p class="mb-3 text-xs text-ink-muted">
        {{ t('entriesTotal', { n: retention.total }) }}
        <template v-if="retention.oldest"> · {{ t('oldestEntry') }} {{ dateTime(retention.oldest) }}</template>
      </p>

      <div class="flex flex-wrap gap-2">
        <button
          v-for="w in retention.windows"
          :key="w.months"
          type="button"
          class="rounded-lg border border-line px-3 py-2 text-left text-sm hover:border-brand disabled:opacity-40"
          :disabled="purging || w.removable === 0"
          @click="pending = w"
        >
          <span class="block font-semibold">{{ w.label }}</span>
          <span class="block text-xs text-ink-muted">
            {{ w.removable > 0 ? t('wouldRemove', { n: w.removable }) : t('purgeNothing') }}
          </span>
        </button>
      </div>
    </section>

    <div v-if="meta" class="mb-3 flex flex-wrap items-center justify-between gap-3">
      <p class="text-sm text-ink-muted">
        {{ t('showing', { shown: entries.length, total: meta.total }) }}
        <span v-if="meta.totalPages > 1">· {{ t('pageOf', { page: meta.page, total: meta.totalPages }) }}</span>
      </p>
      <SelectField
        :model-value="limit"
        :options="limitOptions"
        :label="t('perPage')"
        inline
        size="sm"
        @update:model-value="setLimit($event)"
      />
    </div>

    <p v-if="loading" class="py-12 text-center text-ink-muted">{{ t('loading') }}</p>
    <p v-else-if="!entries.length" class="card py-12 text-center text-ink-muted">{{ t('noAuditEntries') }}</p>

    <div v-else class="card overflow-x-auto">
      <table class="w-full text-sm">
        <thead class="border-b border-line bg-surface-muted text-left text-xs uppercase text-ink-muted">
          <tr>
            <th class="px-4 py-2">{{ t('colTime') }}</th>
            <th class="px-4 py-2">{{ t('colUser') }}</th>
            <th class="px-4 py-2">{{ t('colAction') }}</th>
            <th class="px-4 py-2">{{ t('colDetails') }}</th>
          </tr>
        </thead>
        <tbody class="divide-y divide-line">
          <tr v-for="entry in entries" :key="entry.id">
            <td class="whitespace-nowrap px-4 py-2 text-xs text-ink-muted">{{ dateTime(entry.createdAt) }}</td>
            <td class="px-4 py-2 text-xs">{{ entry.userEmail || '—' }}</td>
            <td class="px-4 py-2"><code class="text-xs">{{ entry.action }}</code></td>
            <td class="max-w-md truncate px-4 py-2 text-kh-sm" :title="entry.summary">{{ entry.summary }}</td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- Real links, not buttons: an entry can be cited by URL and a page opened
         in a new tab.
         NuxtLink is used in `custom` mode throughout. Its automatic
         aria-current comes from Vue Router's exact-match test, which compares
         path and params but not the query string — and these links differ only
         by ?page=. Left alone, every link in the pager is announced as the
         current page. -->
    <nav
      v-if="meta && meta.totalPages > 1"
      class="mt-6 flex flex-wrap items-center justify-center gap-1"
      :aria-label="t('pagination')"
    >
      <NuxtLink v-if="meta.page > 1" v-slot="{ href, navigate }" :to="linkTo(meta.page - 1)" custom>
        <a
          :href="href ?? undefined"
          class="rounded-lg border border-line px-3 py-1.5 text-sm font-semibold hover:border-brand"
          @click="navigate"
        >← {{ t('previous') }}</a>
      </NuxtLink>

      <NuxtLink v-if="pageNumbers[0] > 1" v-slot="{ href, navigate }" :to="linkTo(1)" custom>
        <a :href="href ?? undefined" class="rounded px-3 py-1.5 text-sm hover:bg-surface-muted" @click="navigate">1</a>
      </NuxtLink>
      <span v-if="pageNumbers[0] > 2" class="px-1 text-sm text-ink-muted">…</span>

      <NuxtLink
        v-for="n in pageNumbers"
        :key="n"
        v-slot="{ href, navigate }"
        :to="linkTo(n)"
        custom
      >
        <a
          :href="href ?? undefined"
          :class="[
            'rounded px-3 py-1.5 text-sm tabular-nums',
            n === meta.page ? 'bg-brand font-semibold text-white' : 'hover:bg-surface-muted',
          ]"
          :aria-current="n === meta.page ? 'page' : undefined"
          @click="navigate"
        >{{ n }}</a>
      </NuxtLink>

      <span v-if="pageNumbers[pageNumbers.length - 1] < meta.totalPages - 1" class="px-1 text-sm text-ink-muted">…</span>
      <NuxtLink
        v-if="pageNumbers[pageNumbers.length - 1] < meta.totalPages"
        v-slot="{ href, navigate }"
        :to="linkTo(meta.totalPages)"
        custom
      >
        <a :href="href ?? undefined" class="rounded px-3 py-1.5 text-sm hover:bg-surface-muted" @click="navigate">{{ meta.totalPages }}</a>
      </NuxtLink>

      <NuxtLink v-if="meta.hasMore" v-slot="{ href, navigate }" :to="linkTo(meta.page + 1)" custom>
        <a
          :href="href ?? undefined"
          class="rounded-lg border border-line px-3 py-1.5 text-sm font-semibold hover:border-brand"
          @click="navigate"
        >{{ t('next') }} →</a>
      </NuxtLink>
    </nav>

    <ConfirmDialog
      :open="!!pending"
      :title="t('purgeTitle')"
      :message="pending ? t('purgeMessage', { months: pending.months, n: pending.removable }) : ''"
      :confirm-label="t('purge')"
      :cancel-label="t('cancel')"
      :busy="purging"
      @confirm="purge"
      @cancel="pending = null"
    />
  </div>
</template>
