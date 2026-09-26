<script setup lang="ts">
/** SEO health dashboard (§60, §89). */
definePageMeta({ layout: 'admin', middleware: 'admin' })

const { t } = useAdminLocale()

const api = useAdminApi()

interface Issue {
  key: string; label: string; severity: 'warning' | 'error'
  count: number
  samples?: { id: number; slug: string; titleKh: string }[]
}
interface Report {
  publishedArticles: number; sitemapOk: boolean; newsSitemapOk: boolean
  robotsOk: boolean; newsSitemapCount: number; issues: Issue[]; note: string
}

const report = ref<Report | null>(null)
const loading = ref(true)

onMounted(async () => {
  try {
    report.value = await api.get<Report>('/api/admin/seo/health')
  } finally {
    loading.value = false
  }
})

useHead({ title: 'SEO health — Newsroom' })
</script>

<template>
  <div>
    <h1 class="mb-1 text-xl font-bold">SEO Health</h1>
    <p v-if="report" class="mb-4 max-w-prose text-sm text-ink-muted">{{ report.note }}</p>

    <p v-if="loading" class="py-12 text-center text-ink-muted">{{ t('checking') }}</p>

    <div v-else-if="report" class="space-y-6">
      <div class="grid gap-3 sm:grid-cols-4">
        <AdminStat :label="t('publishedArticles')" :value="report.publishedArticles" />
        <AdminStat label="Sitemap" :value="report.sitemapOk ? '✓' : '—'" :accent="report.sitemapOk ? 'success' : 'warning'" />
        <AdminStat :label="t('newsSitemap48h')" :value="report.newsSitemapCount" />
        <AdminStat label="robots.txt" :value="report.robotsOk ? '✓' : '—'" :accent="report.robotsOk ? 'success' : 'warning'" />
      </div>

      <section>
        <h2 class="mb-3 text-sm font-bold uppercase tracking-wide text-ink-muted">{{ t('issuesFound') }}</h2>

        <p v-if="!report.issues.length" class="card p-6 text-center text-success">
          {{ t('noIssues') }}
        </p>

        <ul v-else class="space-y-3">
          <li v-for="issue in report.issues" :key="issue.key" class="card p-4">
            <div class="flex items-center gap-2">
              <span
                :class="[
                  'rounded px-2 py-0.5 text-xs font-bold uppercase',
                  issue.severity === 'error' ? 'bg-breaking/15 text-breaking' : 'bg-warning/15 text-warning',
                ]"
              >{{ issue.severity }}</span>
              <span class="font-semibold">{{ issue.label }}</span>
              <span class="ml-auto text-lg font-extrabold tabular-nums">{{ issue.count }}</span>
            </div>

            <ul v-if="issue.samples?.length" class="mt-3 space-y-1 border-t border-line pt-3">
              <li v-for="sample in issue.samples" :key="sample.id">
                <NuxtLink :to="`/admin/news/${sample.id}/edit`" class="block truncate text-kh-sm text-brand hover:underline">
                  {{ sample.titleKh }}
                </NuxtLink>
              </li>
            </ul>
          </li>
        </ul>
      </section>

      <section class="card p-5">
        <h2 class="mb-2 font-bold">Google Search Console</h2>
        <p class="mb-3 text-sm text-ink-muted">{{ t('afterLaunchSteps') }}</p>
        <ol class="list-decimal space-y-1 pl-5 text-sm">
          <li>{{ t('gscAddDomain') }}</li>
          <li>{{ t('gscVerify') }}</li>
          <li>{{ t('gscSubmit') }} <code>/sitemap.xml</code></li>
          <li>{{ t('gscSubmit') }} <code>/news-sitemap.xml</code></li>
          <li>{{ t('gscIndexing') }}</li>
          <li>{{ t('gscCwv') }}</li>
          <li>{{ t('gscStructured') }}</li>
          <li>{{ t('gscQueries') }}</li>
        </ol>
      </section>
    </div>
  </div>
</template>
