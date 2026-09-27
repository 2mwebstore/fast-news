<script setup lang="ts">
import { MONTH_NAMES } from '~/composables/useLocale'
import type { CategoryRef } from '~/types'

/**
 * "By month" and "By section" filters: two pills, each opening a bottom sheet.
 * The archive uses it on phones, where its sidebar lists would push the first
 * article off screen; search uses it at every width.
 *
 * A pill reads as its filter's name until something is picked, then shows the
 * choice itself, so the reader can see what the list is filtered by at a
 * glance.
 *
 * The filters live in the URL (?year=&month=&category=) so a filtered page can
 * be shared. Every other query key, such as the search term, is kept.
 */
const props = defineProps<{
  categories: CategoryRef[]
}>()

const { t, locale, categoryName } = useLocale()
const route = useRoute()
const { currentYear, years, monthGrid } = useArchiveMonths()

const year = computed(() => Number(route.query.year) || 0)
const month = computed(() => Number(route.query.month) || 0)
const category = computed(() => String(route.query.category ?? ''))

type Filter = 'month' | 'section'
const open = ref<Filter | null>(null)

const monthOpen = computed({
  get: () => open.value === 'month',
  set: (value) => { open.value = value ? 'month' : null },
})
const sectionOpen = computed({
  get: () => open.value === 'section',
  set: (value) => { open.value = value ? 'section' : null },
})

// The year tabs only change which months the grid shows. Navigating on each
// tap would close the sheet before a month was picked.
const pickerYear = ref(year.value || currentYear)
const pickerMonths = computed(() => monthGrid(pickerYear.value))

function show(which: Filter) {
  pickerYear.value = year.value || currentYear
  open.value = which
}

// Picking an option is a navigation; the sheet has done its job.
watch(() => route.fullPath, () => { open.value = null })

// Changing a filter is a new result set, so paging starts over. A month also
// replaces any explicit ?from=&to= range.
function monthLink(y?: number, m?: number) {
  return { path: route.path, query: { ...route.query, year: y, month: m, from: undefined, to: undefined, page: undefined } }
}

function sectionLink(slug?: string) {
  return { path: route.path, query: { ...route.query, category: slug, page: undefined } }
}

const clearLink = computed(() => ({
  path: route.path,
  query: { ...route.query, year: undefined, month: undefined, category: undefined, from: undefined, to: undefined, page: undefined },
}))

const selectedSection = computed(() => props.categories.find(c => c.slug === category.value))

const monthValue = computed(() => {
  if (!year.value) return ''
  if (!month.value) return t('wholeYear', { year: year.value })
  const name = MONTH_NAMES[locale.value][month.value - 1] ?? ''
  // English month names are long for a pill; the Khmer ones are already short.
  return `${locale.value === 'en' ? name.slice(0, 3) : name} ${year.value}`
})

/** The other language's name, as a quiet hint beside each section. */
function altName(c: CategoryRef) {
  return locale.value === 'km' ? c.nameEn : c.nameKh
}

// One row even with both filters set. The month is always short, so it keeps
// its width; a long section name truncates rather than wrapping the row.
const pill = 'inline-flex h-10 min-w-0 items-center gap-1.5 rounded-full border px-3.5 text-kh-sm font-semibold transition active:scale-[0.97]'
const pillIdle = 'border-line bg-surface text-ink hover:border-brand/40'
const pillActive = 'border-brand/30 bg-brand/10 text-brand'
const choice = 'flex h-11 items-center justify-center rounded-xl border px-3 text-kh-sm font-semibold transition active:scale-[0.97]'
const cell = 'relative flex h-12 items-center justify-center rounded-xl text-kh-sm font-semibold transition active:scale-[0.96]'
const row = 'flex items-center gap-3 rounded-xl px-3 py-2.5 text-kh-base transition-colors'
</script>

<template>
  <div class="flex items-center gap-2">
    <button
      type="button"
      :class="[pill, 'shrink-0', year ? pillActive : pillIdle]"
      aria-haspopup="dialog"
      :aria-expanded="open === 'month'"
      @click="show('month')"
    >
      <svg class="h-4 w-4 shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true">
        <rect x="3.5" y="5" width="17" height="15.5" rx="2.5" />
        <path d="M3.5 10h17M8 3v4M16 3v4" stroke-linecap="round" />
      </svg>
      <span class="truncate">{{ year ? monthValue : t('byMonth') }}</span>
      <svg class="h-3.5 w-3.5 shrink-0 opacity-60" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" aria-hidden="true">
        <path d="M6 9l6 6 6-6" stroke-linecap="round" stroke-linejoin="round" />
      </svg>
    </button>

    <button
      type="button"
      :class="[pill, selectedSection ? pillActive : pillIdle]"
      aria-haspopup="dialog"
      :aria-expanded="open === 'section'"
      @click="show('section')"
    >
      <svg class="h-4 w-4 shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true">
        <rect x="3.5" y="3.5" width="7" height="7" rx="1.5" />
        <rect x="13.5" y="3.5" width="7" height="7" rx="1.5" />
        <rect x="3.5" y="13.5" width="7" height="7" rx="1.5" />
        <rect x="13.5" y="13.5" width="7" height="7" rx="1.5" />
      </svg>
      <span class="truncate">{{ selectedSection ? categoryName(selectedSection) : t('bySection') }}</span>
      <svg class="h-3.5 w-3.5 shrink-0 opacity-60" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" aria-hidden="true">
        <path d="M6 9l6 6 6-6" stroke-linecap="round" stroke-linejoin="round" />
      </svg>
    </button>

    <Transition name="clear">
      <!-- Just the ✕ on a phone, where the pills need the width. -->
      <NuxtLink
        v-if="year || selectedSection"
        :to="clearLink"
        :title="t('clearFilters')"
        class="inline-flex h-10 w-10 shrink-0 items-center justify-center gap-1 rounded-full border border-line text-ink-muted transition hover:border-brand/40 hover:text-brand active:scale-[0.94] sm:w-auto sm:border-transparent sm:px-3 sm:text-sm sm:font-semibold"
      >
        <svg class="h-4 w-4 sm:h-3.5 sm:w-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" aria-hidden="true">
          <path d="M6 6l12 12M18 6L6 18" stroke-linecap="round" />
        </svg>
        <span class="sr-only sm:not-sr-only">{{ t('clearFilters') }}</span>
      </NuxtLink>
    </Transition>

    <!-- ── Month sheet ────────────────────────────────────────────────── -->
    <BottomSheet v-model:open="monthOpen" :title="t('byMonth')">
      <div
        v-if="years.length > 1"
        class="mb-3 grid auto-cols-fr grid-flow-col gap-1 rounded-xl bg-surface-muted p-1"
        role="group"
      >
        <button
          v-for="y in years"
          :key="y"
          type="button"
          :class="[
            'rounded-lg py-2 text-sm font-bold transition',
            pickerYear === y ? 'bg-surface text-brand shadow-card' : 'text-ink-muted hover:text-ink',
          ]"
          :aria-pressed="pickerYear === y"
          @click="pickerYear = y"
        >{{ y }}</button>
      </div>

      <div class="grid grid-cols-2 gap-2">
        <NuxtLink
          :to="monthLink()"
          :class="[choice, !year ? 'border-brand bg-brand text-white' : 'border-line text-ink hover:border-brand/40']"
        >{{ t('allDates') }}</NuxtLink>
        <NuxtLink
          :to="monthLink(pickerYear)"
          :class="[choice, year === pickerYear && !month ? 'border-brand bg-brand text-white' : 'border-line text-ink hover:border-brand/40']"
        >{{ t('wholeYear', { year: pickerYear }) }}</NuxtLink>
      </div>

      <!-- Calendar order, the way a reader thinks of a year. Months still to
           come stay in the grid, greyed out, so it keeps its shape. -->
      <ul class="mt-4 grid grid-cols-3 gap-2">
        <li v-for="m in pickerMonths" :key="m.month">
          <span
            v-if="m.future"
            :class="[cell, 'cursor-default text-ink-muted/40']"
            aria-disabled="true"
          >{{ m.name }}</span>
          <NuxtLink
            v-else
            :to="monthLink(pickerYear, m.month)"
            :class="[
              cell,
              year === pickerYear && month === m.month
                ? 'bg-brand text-white shadow-card'
                : 'bg-surface-muted text-ink hover:bg-brand/10 hover:text-brand',
            ]"
          >
            {{ m.name }}
            <span v-if="m.current" class="absolute bottom-1 h-1 w-1 rounded-full bg-current" aria-hidden="true" />
          </NuxtLink>
        </li>
      </ul>
    </BottomSheet>

    <!-- ── Section sheet ──────────────────────────────────────────────── -->
    <BottomSheet v-model:open="sectionOpen" :title="t('bySection')">
      <ul class="-mx-1 space-y-0.5">
        <li>
          <NuxtLink
            :to="sectionLink()"
            :class="[row, !category ? 'bg-brand/10 font-semibold text-brand' : 'text-ink hover:bg-surface-muted']"
          >
            <span class="h-2.5 w-2.5 shrink-0 rounded-full border-2 border-current" aria-hidden="true" />
            <span class="min-w-0 flex-1">{{ t('allSections') }}</span>
            <svg v-if="!category" class="h-5 w-5 shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" aria-hidden="true">
              <path d="M5 12.5l4.5 4.5L19 7.5" stroke-linecap="round" stroke-linejoin="round" />
            </svg>
          </NuxtLink>
        </li>
        <li v-for="c in categories" :key="c.slug">
          <NuxtLink
            :to="sectionLink(c.slug)"
            :class="[row, category === c.slug ? 'bg-brand/10 font-semibold text-brand' : 'text-ink hover:bg-surface-muted']"
          >
            <span
              :class="['h-2.5 w-2.5 shrink-0 rounded-full', c.color ? '' : 'bg-brand']"
              :style="c.color ? { backgroundColor: c.color } : undefined"
              aria-hidden="true"
            />
            <span class="min-w-0 flex-1 truncate">{{ categoryName(c) }}</span>
            <span class="shrink-0 text-xs text-ink-muted">{{ altName(c) }}</span>
            <svg
              :class="['h-5 w-5 shrink-0', category === c.slug ? '' : 'invisible']"
              viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" aria-hidden="true"
            >
              <path d="M5 12.5l4.5 4.5L19 7.5" stroke-linecap="round" stroke-linejoin="round" />
            </svg>
          </NuxtLink>
        </li>
      </ul>
    </BottomSheet>
  </div>
</template>

<style scoped>
.clear-enter-active,
.clear-leave-active {
  transition: opacity 0.2s ease, transform 0.2s ease;
}
.clear-enter-from,
.clear-leave-to {
  opacity: 0;
  transform: translateX(-6px);
}
</style>
