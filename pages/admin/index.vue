<script setup lang="ts">
import type { Dashboard } from '~/types/admin'

/** Newsroom dashboard (§68). */
definePageMeta({ layout: 'admin', middleware: 'admin' })

const api = useAdminApi()
const auth = useAuthStore()
const { dateTime, compact } = useFormat()
const { t } = useAdminLocale()

const dashboard = ref<Dashboard | null>(null)
const loading = ref(true)
const loadError = ref('')

onMounted(async () => {
  try {
    dashboard.value = await api.get<Dashboard>('/api/admin/dashboard')
  } catch {
    loadError.value = t('noResults')
  } finally {
    loading.value = false
  }
})

const quickActions = computed(() => [
  { label: '+ ' + t('write'), path: '/admin/news/create', permission: 'news.create' },
  { label: '+ ' + t('aiAssistant'), path: '/admin/ai-news', permission: 'ai.use' },
  { label: '+ ' + t('uploadMedia'), path: '/admin/media', permission: 'media.upload' },
  { label: '+ ' + t('newAd'), path: '/admin/ads', permission: 'ads.view' },
].filter(a => auth.can(a.permission)))

useHead({ title: 'Dashboard — Newsroom' })
</script>

<template>
  <div>
    <div class="mb-6 flex flex-wrap items-center justify-between gap-3">
      <div>
        <h1 class="text-xl font-bold">{{ t('dashboard') }}</h1>
        <p class="text-sm text-ink-muted">{{ t('greeting') }} {{ auth.user?.name }}</p>
      </div>

      <div class="flex flex-wrap gap-2">
        <NuxtLink
          v-for="action in quickActions" :key="action.path" :to="action.path"
          class="rounded-lg bg-brand px-3 py-2 text-sm font-semibold text-white hover:bg-brand-dark"
        >{{ action.label }}</NuxtLink>
      </div>
    </div>

    <p v-if="loading" class="py-12 text-center text-ink-muted">{{ t('loading') }}</p>
    <p v-else-if="loadError" class="rounded-lg bg-breaking/10 p-4 text-breaking">{{ loadError }}</p>

    <div v-else-if="dashboard" class="space-y-6">
      <!-- ── Newsroom ─────────────────────────────────────────────────── -->
      <section>
        <h2 class="mb-3 text-sm font-bold uppercase tracking-wide text-ink-muted">{{ t('newsroom') }}</h2>
        <div class="grid gap-3 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6">
          <AdminStat :label="t('todayPublished')" :value="dashboard.news.todayPublished" />
          <AdminStat :label="t('breakingNow')" :value="dashboard.news.breaking" accent="breaking" />
          <AdminStat :label="t('drafts')" :value="dashboard.news.drafts" to="/admin/news?status=draft" />
          <AdminStat :label="t('reviewQueue')" :value="dashboard.news.reviewQueue" to="/admin/review" accent="warning" />
          <AdminStat :label="t('scheduled')" :value="dashboard.news.scheduled" to="/admin/news?status=scheduled" />
          <AdminStat :label="t('totalPublished')" :value="dashboard.news.totalPublished" />
        </div>
      </section>

      <!-- ── Audience ─────────────────────────────────────────────────── -->
      <section>
        <h2 class="mb-3 text-sm font-bold uppercase tracking-wide text-ink-muted">{{ t('readers') }}</h2>
        <div class="grid gap-3 sm:grid-cols-3">
          <AdminStat :label="t('viewsToday')" :value="compact(dashboard.traffic.viewsToday)" />
          <AdminStat :label="t('uniqueVisitors')" :value="compact(dashboard.traffic.uniqueVisitorsToday)" />
          <AdminStat :label="t('videoViews')" :value="compact(dashboard.traffic.videoViews)" />
        </div>
      </section>

      <!-- ── Advertising ──────────────────────────────────────────────── -->
      <section v-if="auth.can('ads.view')">
        <h2 class="mb-3 text-sm font-bold uppercase tracking-wide text-ink-muted">{{ t('advertising') }}</h2>
        <div class="grid gap-3 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6">
          <AdminStat :label="t('activeAds')" :value="dashboard.ads.activeAds" />
          <AdminStat :label="t('activeCampaigns')" :value="dashboard.ads.activeCampaigns" />
          <AdminStat :label="t('pendingApproval')" :value="dashboard.ads.pendingApproval" accent="warning" to="/admin/ads" />
          <AdminStat :label="t('expired')" :value="dashboard.ads.expiredCampaigns" />
          <AdminStat :label="t('impressionsToday')" :value="compact(dashboard.ads.impressionsToday)" />
          <AdminStat :label="t('ctrToday')" :value="`${dashboard.ads.ctrToday.toFixed(2)}%`" />
        </div>
      </section>

      <!-- ── Distribution ─────────────────────────────────────────────── -->
      <section>
        <h2 class="mb-3 text-sm font-bold uppercase tracking-wide text-ink-muted">{{ t('distribution') }}</h2>
        <div class="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          <div class="card p-4">
            <p class="text-xs text-ink-muted">Telegram</p>
            <p class="mt-1 flex items-center gap-2 font-semibold">
              <span
                :class="['h-2 w-2 rounded-full', dashboard.distribution.telegramConfigured ? 'bg-success' : 'bg-ink-muted']"
                aria-hidden="true"
              />
              {{ dashboard.distribution.telegramConfigured ? t('connected') : t('notConfigured') }}
            </p>
            <p class="mt-1 text-xs text-ink-muted">
              {{ t('todayPublished') }} {{ dashboard.distribution.telegramPostsToday }}
              <span v-if="dashboard.distribution.telegramFailed" class="text-breaking">
                · {{ t('failed') }} {{ dashboard.distribution.telegramFailed }}
              </span>
            </p>
          </div>

          <AdminStat :label="t('pushSubscribers')" :value="compact(dashboard.distribution.pushSubscribers)" />
          <AdminStat :label="t('liveConnections')" :value="dashboard.distribution.websocketClients" />
          <AdminStat
            :label="t('readerTips')"
            :value="dashboard.moderation.pendingTips"
            accent="warning" to="/admin/tips"
          />
        </div>
      </section>

      <p class="text-xs text-ink-muted">
        {{ t('environment') }}: {{ dashboard.system.environment }} · {{ t('serverTime') }}: {{ dateTime(dashboard.system.serverTime) }}
      </p>
    </div>
  </div>
</template>
