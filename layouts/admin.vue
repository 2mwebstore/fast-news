<script setup lang="ts">
/** Admin shell: sidebar navigation plus the signed-in user. */
const auth = useAuthStore()
const route = useRoute()
const { locale, setLocale, t } = useAdminLocale()
const sidebarOpen = ref(false)

// Sections are filtered by permission so an editor never sees an advertising
// screen they cannot open — the API would refuse it anyway (§67).
const sections = computed(() => [
  { path: '/admin', label: t('dashboard'), icon: '◧', permission: null },
  { path: '/admin/news', label: t('articles'), icon: '📰', permission: 'news.view' },
  { path: '/admin/news/create', label: t('write'), icon: '✎', permission: 'news.create' },
  { path: '/admin/review', label: t('reviewQueue'), icon: '☑', permission: 'news.review' },
  { path: '/admin/videos', label: t('videos'), icon: '▶', permission: 'video.manage' },
  { path: '/admin/categories', label: t('sections'), icon: '⊞', permission: 'categories.manage' },
  { path: '/admin/pages', label: t('pagesNav'), icon: '▤', permission: 'pages.manage' },
  { path: '/admin/ai-news', label: t('aiAssistant'), icon: '✦', permission: 'ai.use' },
  { path: '/admin/media', label: t('media'), icon: '🖼', permission: 'media.upload' },
  { path: '/admin/ads', label: t('advertising'), icon: '◈', permission: 'ads.view' },
  { path: '/admin/seo', label: t('seoHealth'), icon: '◎', permission: 'seo.manage' },
  { path: '/admin/roles', label: t('rolesAccess'), icon: '⚿', permission: 'users.manage' },
  { path: '/admin/settings', label: t('settings'), icon: '⚙', permission: 'settings.manage' },
  { path: '/admin/tips', label: t('tips'), icon: '✉', permission: 'tips.review' },
  { path: '/admin/analytics', label: t('analytics'), icon: '◑', permission: 'analytics.view' },
  { path: '/admin/audit-logs', label: t('auditLog'), icon: '⧉', permission: 'users.manage' },
].filter(s => !s.permission || auth.can(s.permission)))

function isActive(path: string) {
  return path === '/admin' ? route.path === '/admin' : route.path.startsWith(path)
}

function signOut() {
  auth.logout()
  navigateTo('/admin/login')
}

watch(() => route.fullPath, () => { sidebarOpen.value = false })
</script>

<template>
  <div class="flex min-h-screen bg-surface-muted">
    <!-- ── Sidebar ─────────────────────────────────────────────────────── -->
    <aside
      :class="[
        'fixed inset-y-0 left-0 z-40 w-64 shrink-0 overflow-y-auto border-r border-line bg-surface transition-transform lg:static lg:translate-x-0',
        sidebarOpen ? 'translate-x-0' : '-translate-x-full',
      ]"
    >
      <div class="border-b border-line p-4">
        <NuxtLink to="/admin" class="block w-fit"><TheLogo class="[--logo-h:2rem]" /></NuxtLink>
        <p class="mt-1 text-[10px] uppercase tracking-widest text-ink-muted">{{ t('newsroom') }}</p>
      </div>

      <nav class="p-2" aria-label="Admin sections">
        <ul class="space-y-0.5">
          <li v-for="section in sections" :key="section.path">
            <NuxtLink
              :to="section.path"
              :class="[
                'flex items-center gap-2.5 rounded-lg px-3 py-2 text-kh-sm font-medium transition-colors',
                isActive(section.path) ? 'bg-brand text-white' : 'text-ink hover:bg-surface-muted',
              ]"
            >
              <span class="w-4 text-center" aria-hidden="true">{{ section.icon }}</span>
              {{ section.label }}
            </NuxtLink>
          </li>
        </ul>
      </nav>

      <div class="mt-auto border-t border-line p-4">
        <p class="truncate text-sm font-semibold">{{ auth.user?.name }}</p>
        <p class="truncate text-xs text-ink-muted">{{ auth.user?.roleName }}</p>
        <!-- Interface language, independent of the reader-facing site. -->
        <div
          class="mt-3 flex items-center overflow-hidden rounded border border-line text-xs font-semibold"
          role="group"
          :aria-label="t('language')"
        >
          <button
            type="button"
            :class="['flex-1 px-2 py-1.5 transition-colors', locale === 'en' ? 'bg-brand text-white' : 'text-ink-muted hover:bg-surface-muted']"
            :aria-pressed="locale === 'en'"
            @click="setLocale('en')"
          >EN</button>
          <button
            type="button"
            :class="['flex-1 px-2 py-1.5 transition-colors', locale === 'km' ? 'bg-brand text-white' : 'text-ink-muted hover:bg-surface-muted']"
            :aria-pressed="locale === 'km'"
            @click="setLocale('km')"
          >ខ្មែរ</button>
        </div>

        <div class="mt-2 flex gap-2">
          <NuxtLink to="/" target="_blank" class="flex-1 rounded border border-line px-2 py-1.5 text-center text-xs hover:bg-surface-muted">
            {{ t('viewSite') }}
          </NuxtLink>
          <button class="rounded border border-line px-2 py-1.5 text-xs hover:bg-surface-muted" @click="signOut">
            {{ t('signOut') }}
          </button>
        </div>
      </div>
    </aside>

    <div
      v-if="sidebarOpen"
      class="fixed inset-0 z-30 bg-ink/40 lg:hidden"
      @click="sidebarOpen = false"
    />

    <!-- ── Content ─────────────────────────────────────────────────────── -->
    <div class="flex min-w-0 flex-1 flex-col">
      <header class="flex h-14 items-center gap-3 border-b border-line bg-surface px-4 lg:hidden">
        <button class="rounded p-2 hover:bg-surface-muted" aria-label="Menu" @click="sidebarOpen = true">
          <svg class="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true">
            <path d="M3 6h18M3 12h18M3 18h18" stroke-linecap="round" />
          </svg>
        </button>
        <TheLogo class="[--logo-h:1.75rem]" />
      </header>

      <main class="flex-1 p-4 lg:p-6">
        <slot />
      </main>
    </div>
  </div>
</template>
