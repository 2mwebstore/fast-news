<script setup lang="ts">
import type { CategoryDetail } from '~/types'

/** Sticky site header (§5): logo, section nav, search and language switch. */
const { data: categories } = await useAsyncApi<CategoryDetail[]>('nav-categories', '/api/categories')

const { locale, setLocale, t, categoryName } = useLocale()
const { nameEn } = useSite()

const mobileOpen = ref(false)
const searchOpen = ref(false)
const searchTerm = ref('')
const searchForm = ref<{ focus: () => void } | null>(null)
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

// `autofocus` only fires on page load, not when the bar is inserted later.
watch(searchOpen, async (open) => {
  if (!open) return
  await nextTick()
  searchForm.value?.focus()
})

// The drawer and the search bar share the space under the top row, so only
// one is open at a time.
function toggleMenu() {
  mobileOpen.value = !mobileOpen.value
  if (mobileOpen.value) searchOpen.value = false
}

function toggleSearch() {
  // The search page has its own field (see pages/search.vue). Opening a
  // second one here would just be a duplicate, so point the reader at it.
  if (route.path === '/search') {
    mobileOpen.value = false
    document.getElementById('page-search')?.focus({ preventScroll: true })
    window.scrollTo({ top: 0, behavior: 'smooth' })
    return
  }
  searchOpen.value = !searchOpen.value
  if (searchOpen.value) mobileOpen.value = false
}

function closeAll() {
  mobileOpen.value = false
  searchOpen.value = false
}

onKeyStroke('Escape', () => { if (mobileOpen.value || searchOpen.value) closeAll() })

function submitSearch(q: string) {
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

const menuBar = 'absolute left-[3px] h-0.5 w-[18px] rounded-full bg-current transition duration-300 ease-out'
const searchIcon = 'absolute inset-0 h-5 w-5 transition duration-300 ease-out'
</script>

<template>
  <header class="sticky top-0 z-50 border-b border-line bg-surface/95 backdrop-blur supports-[backdrop-filter]:bg-surface/80">
    <div class="container-content">
      <!-- ── Top row ─────────────────────────────────────────────────── -->
      <!-- On a phone: three columns with the logo in the middle. The side
           columns always share the leftover width equally, so the logo sits
           dead centre even though the controls on the right are wider than
           the menu button. From lg up there is no menu button, and the logo
           goes back to the left. -->
      <div class="grid h-14 grid-cols-[1fr_auto_1fr] items-center gap-2 lg:flex lg:h-16 lg:justify-between lg:gap-3">
        <div class="flex items-center lg:hidden">
          <button
            class="-ml-2 rounded p-2 text-ink transition-colors hover:bg-surface-muted lg:hidden"
            :aria-expanded="mobileOpen"
            aria-controls="mobile-nav"
            :aria-label="t('menu')"
            @click="toggleMenu"
          >
            <!-- Three bars that fold into an X, so the button shows what the
                 next tap will do. -->
            <span class="relative block h-6 w-6" aria-hidden="true">
              <span :class="[menuBar, 'top-[5px]', mobileOpen ? 'translate-y-[6px] rotate-45' : '']" />
              <span :class="[menuBar, 'top-[11px]', mobileOpen ? 'scale-x-0 opacity-0' : '']" />
              <span :class="[menuBar, 'top-[17px]', mobileOpen ? '-translate-y-[6px] -rotate-45' : '']" />
            </span>
          </button>
        </div>

        <!-- The width cap leaves room for the controls on both sides (each up
             to ~7rem on a phone), so a long name or wide logo shrinks rather
             than pushing the logo off centre. -->
        <NuxtLink to="/" class="flex min-w-0 items-center justify-center lg:shrink-0" :aria-label="nameEn">
          <TheLogo class="[--logo-h:2rem] [--logo-max-w:calc(100vw_-_16rem)] lg:[--logo-h:2.25rem] lg:[--logo-max-w:24rem]" />
        </NuxtLink>

        <div class="flex items-center justify-end gap-1">
          <button
            :class="[
              'rounded p-2 transition-colors hover:bg-surface-muted',
              searchOpen ? 'bg-surface-muted text-brand' : 'text-ink',
            ]"
            :aria-label="t('search')"
            :aria-expanded="searchOpen"
            aria-controls="site-search"
            @click="toggleSearch"
          >
            <span class="relative block h-5 w-5" aria-hidden="true">
              <svg
                :class="[searchIcon, searchOpen ? 'rotate-90 scale-50 opacity-0' : '']"
                viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"
              >
                <circle cx="11" cy="11" r="7" />
                <path d="M20 20l-3.5-3.5" stroke-linecap="round" />
              </svg>
              <svg
                :class="[searchIcon, searchOpen ? '' : '-rotate-90 scale-50 opacity-0']"
                viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"
              >
                <path d="M6 6l12 12M18 6L6 18" stroke-linecap="round" />
              </svg>
            </span>
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
      <ExpandTransition>
        <div v-if="searchOpen" id="site-search">
          <SiteSearchForm ref="searchForm" v-model="searchTerm" class="pb-3" @submit="submitSearch" />
        </div>
      </ExpandTransition>

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
    <ExpandTransition>
      <nav
        v-if="mobileOpen"
        id="mobile-nav"
        class="bg-surface lg:hidden"
        :aria-label="t('sections')"
      >
        <ul class="container-content max-h-[70vh] divide-y divide-line overflow-y-auto overscroll-contain border-t border-line py-1">
          <li v-for="(item, i) in navItems" :key="item.path" class="drawer-item" :style="{ '--i': i }">
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
          <li class="drawer-item" :style="{ '--i': navItems.length }">
            <NuxtLink to="/video" class="flex items-center justify-between py-3 text-kh-base font-semibold text-ink">
              {{ t('videoNews') }}<span class="text-xs font-normal text-ink-muted">{{ locale === 'km' ? 'Video' : 'វីដេអូ' }}</span>
            </NuxtLink>
          </li>
          <li class="drawer-item" :style="{ '--i': navItems.length + 1 }">
            <NuxtLink to="/live" class="flex items-center justify-between py-3 text-kh-base font-semibold text-breaking">
              {{ t('liveBadge') }}<span class="text-xs font-normal text-ink-muted">{{ locale === 'km' ? 'Live' : 'ផ្ទាល់' }}</span>
            </NuxtLink>
          </li>
        </ul>
      </nav>
    </ExpandTransition>
  </header>

  <!-- Dims the page behind the open drawer or search bar; a tap outside
       closes them. It lives outside <header> because the header's
       backdrop-filter would make it the containing block for `fixed`. -->
  <Transition name="backdrop">
    <div
      v-if="mobileOpen || searchOpen"
      class="fixed inset-0 z-[45] bg-ink/40 lg:hidden"
      aria-hidden="true"
      @click="closeAll"
    />
  </Transition>
</template>

<style scoped>
/* Drawer rows slide in one after another. The delay is capped so a long
   section list still finishes quickly. */
.drawer-item {
  animation: drawer-item 0.36s cubic-bezier(0.22, 1, 0.36, 1) both;
  animation-delay: calc(min(var(--i, 0), 10) * 30ms + 60ms);
}

@keyframes drawer-item {
  from {
    opacity: 0;
    transform: translateX(-12px);
  }
  to {
    opacity: 1;
    transform: none;
  }
}

.backdrop-enter-active {
  transition: opacity 0.28s ease-out;
}
.backdrop-leave-active {
  transition: opacity 0.2s ease-in;
}
.backdrop-enter-from,
.backdrop-leave-to {
  opacity: 0;
}

@media (prefers-reduced-motion: reduce) {
  .drawer-item {
    animation: none;
  }
}
</style>
