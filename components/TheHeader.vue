<script setup lang="ts">
import type { CategoryDetail } from '~/types'

/** Sticky site header (§5): logo, section nav, search and language switch. */
const { data: categories } = await useAsyncApi<CategoryDetail[]>('nav-categories', '/api/categories')

const { locale, setLocale, t, categoryName } = useLocale()

const mobileOpen = ref(false)
const searchOpen = ref(false)
const searchTerm = ref('')
const route = useRoute()

// Close the mobile drawer on navigation, or it stays open over the new page.
watch(() => route.fullPath, () => {
  mobileOpen.value = false
  searchOpen.value = false
})

// A drawer that scrolls the page behind it feels broken on a phone.
watch(mobileOpen, (open) => {
  if (import.meta.client) document.body.style.overflow = open ? 'hidden' : ''
})
onBeforeUnmount(() => {
  if (import.meta.client) document.body.style.overflow = ''
})

function submitSearch() {
  const q = searchTerm.value.trim()
  if (!q) return
  navigateTo({ path: '/search', query: { q } })
  searchOpen.value = false
}

const navItems = computed(() => [
  { path: '/', label: t('home'), alt: locale.value === 'km' ? 'Home' : 'ទំព័រដើម' },
  ...(categories.value ?? []).map(c => ({
    path: `/category/${c.slug}`,
    label: categoryName(c),
    alt: locale.value === 'km' ? c.nameEn : c.nameKh,
  })),
])

function isActive(path: string) {
  return path === '/' ? route.path === '/' : route.path.startsWith(path)
}
</script>

<template>
  <header class="sticky top-0 z-50 border-b border-line bg-surface/95 backdrop-blur supports-[backdrop-filter]:bg-surface/80">
    <div class="container-content">
      <!-- ── Top row ─────────────────────────────────────────────────── -->
      <div class="flex h-14 items-center justify-between gap-3 lg:h-16">
        <button
          class="-ml-2 rounded p-2 text-ink lg:hidden"
          :aria-expanded="mobileOpen"
          aria-controls="mobile-nav"
          :aria-label="t('menu')"
          @click="mobileOpen = !mobileOpen"
        >
          <svg class="h-6 w-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true">
            <path v-if="!mobileOpen" d="M3 6h18M3 12h18M3 18h18" stroke-linecap="round" />
            <path v-else d="M6 6l12 12M18 6L6 18" stroke-linecap="round" />
          </svg>
        </button>

        <NuxtLink to="/" class="flex shrink-0 items-center gap-2" aria-label="Cambodia Fast News">
          <TheLogo class="h-8 w-auto lg:h-9" />
        </NuxtLink>

        <div class="flex items-center gap-1">
          <button
            class="rounded p-2 text-ink hover:bg-surface-muted"
            :aria-label="t('search')"
            @click="searchOpen = !searchOpen"
          >
            <svg class="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true">
              <circle cx="11" cy="11" r="7" />
              <path d="M20 20l-3.5-3.5" stroke-linecap="round" />
            </svg>
          </button>

          <!-- Reading language. Khmer stays the canonical edition: switching
               to English shows English text where a journalist wrote it, and
               falls back to Khmer where none exists. -->
          <div
            class="flex items-center overflow-hidden rounded border border-line text-xs font-semibold"
            role="group"
            :aria-label="t('language')"
          >
            <button
              type="button"
              :class="['px-2 py-1 transition-colors', locale === 'km' ? 'bg-brand text-white' : 'text-ink-muted hover:bg-surface-muted']"
              :aria-pressed="locale === 'km'"
              @click="setLocale('km')"
            >ខ្មែរ</button>
            <button
              type="button"
              :class="['px-2 py-1 transition-colors', locale === 'en' ? 'bg-brand text-white' : 'text-ink-muted hover:bg-surface-muted']"
              :aria-pressed="locale === 'en'"
              @click="setLocale('en')"
            >EN</button>
          </div>
        </div>
      </div>

      <!-- ── Search bar ──────────────────────────────────────────────── -->
      <div v-if="searchOpen" class="pb-3">
        <form class="flex gap-2" @submit.prevent="submitSearch">
          <input
            v-model="searchTerm"
            type="search"
            name="q"
            :placeholder="t('searchPlaceholder')"
            class="w-full rounded-lg border border-line bg-surface-muted px-4 py-2.5 text-kh-base outline-none focus:border-brand"
            autofocus
          >
          <button type="submit" class="rounded-lg bg-brand px-5 py-2.5 font-semibold text-white hover:bg-brand-dark">
            {{ t('search') }}
          </button>
        </form>
      </div>

      <!-- ── Desktop section nav ─────────────────────────────────────── -->
      <nav class="hidden border-t border-line lg:block" :aria-label="t('sections')">
        <ul class="flex items-center gap-1 overflow-x-auto py-1">
          <li v-for="item in navItems" :key="item.path">
            <NuxtLink
              :to="item.path"
              :class="[
                'block whitespace-nowrap rounded px-3 py-2 text-kh-sm font-semibold transition-colors',
                isActive(item.path) ? 'bg-brand text-white' : 'text-ink hover:bg-surface-muted hover:text-brand',
              ]"
            >
              {{ item.label }}
            </NuxtLink>
          </li>
          <li>
            <NuxtLink to="/video" class="block whitespace-nowrap rounded px-3 py-2 text-kh-sm font-semibold text-ink hover:bg-surface-muted hover:text-brand">
              {{ t('videoNews') }}
            </NuxtLink>
          </li>
        </ul>
      </nav>
    </div>

    <!-- ── Mobile drawer ─────────────────────────────────────────────── -->
    <nav
      v-if="mobileOpen"
      id="mobile-nav"
      class="border-t border-line bg-surface lg:hidden"
      :aria-label="t('sections')"
    >
      <ul class="container-content max-h-[70vh] divide-y divide-line overflow-y-auto py-1">
        <li v-for="item in navItems" :key="item.path">
          <NuxtLink
            :to="item.path"
            :class="[
              'flex items-center justify-between py-3 text-kh-base font-semibold',
              isActive(item.path) ? 'text-brand' : 'text-ink',
            ]"
          >
            {{ item.label }}
            <span class="text-xs font-normal text-ink-muted">{{ item.alt }}</span>
          </NuxtLink>
        </li>
        <li>
          <NuxtLink to="/video" class="flex items-center justify-between py-3 text-kh-base font-semibold text-ink">
            {{ t('videoNews') }}<span class="text-xs font-normal text-ink-muted">{{ locale === 'km' ? 'Video' : 'វីដេអូ' }}</span>
          </NuxtLink>
        </li>
        <li>
          <NuxtLink to="/live" class="flex items-center justify-between py-3 text-kh-base font-semibold text-breaking">
            {{ t('liveBadge') }}<span class="text-xs font-normal text-ink-muted">{{ locale === 'km' ? 'Live' : 'ផ្ទាល់' }}</span>
          </NuxtLink>
        </li>
      </ul>
    </nav>
  </header>
</template>
