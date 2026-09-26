<script setup lang="ts">
/**
 * Select with a type-to-filter box, for lists too long to scan — categories,
 * authors, ad positions.
 *
 * The panel is teleported to the body so a dropdown inside a card with
 * `overflow-hidden` is not clipped, and it flips above the trigger when there
 * is no room below.
 *
 * Unlike a plain styled `<div>` dropdown this is keyboard operable: arrows
 * move the highlight, Enter picks, Escape closes, and the trigger carries the
 * combobox roles a screen reader needs. Use SelectField for short lists where
 * a native `<select>` is the better tool.
 */
export interface SearchableOption {
  value: string | number
  label: string
  /** Secondary text shown on the right, e.g. an English name or a count. */
  sub?: string
  disabled?: boolean
}

const model = defineModel<string | number | null>({ default: null })

const props = withDefaults(defineProps<{
  options: SearchableOption[]
  label?: string
  placeholder?: string
  /** Label for the "no selection" row. Shown only when `clearable`. */
  emptyLabel?: string
  required?: boolean
  clearable?: boolean
  disabled?: boolean
  searchPlaceholder?: string
  /** Hide the filter box for short lists, where typing is more friction. */
  searchable?: boolean
}>(), {
  placeholder: 'Select…',
  emptyLabel: '— none —',
  required: false,
  clearable: true,
  disabled: false,
  searchPlaceholder: 'Search…',
  searchable: true,
})

const open = ref(false)
const query = ref('')
const highlighted = ref(-1)
const wrapper = ref<HTMLElement | null>(null)
const searchInput = ref<HTMLInputElement | null>(null)
const listbox = ref<HTMLElement | null>(null)
const panelStyle = ref<Record<string, string>>({})

const listboxId = useId()

// Values are compared as strings: a caller may hold '5' where the options use
// the number 5. Without this a type mismatch silently shows the raw value
// instead of its label.
const sameValue = (a: unknown, b: unknown) => String(a) === String(b)

const hasValue = computed(() => model.value !== null && model.value !== undefined && model.value !== '')

const selected = computed(() => props.options.find(o => sameValue(o.value, model.value)) ?? null)

const displayLabel = computed(() => selected.value?.label ?? (hasValue.value ? String(model.value) : props.placeholder))

const filtered = computed(() => {
  const q = query.value.trim().toLowerCase()
  if (!q) return props.options
  return props.options.filter(o =>
    o.label.toLowerCase().includes(q) || (o.sub ?? '').toLowerCase().includes(q),
  )
})

/** Rows the keyboard can land on: the clear row plus every enabled option. */
const navigable = computed<(SearchableOption | null)[]>(() => {
  const rows: (SearchableOption | null)[] = []
  if (props.clearable) rows.push(null)
  rows.push(...filtered.value.filter(o => !o.disabled))
  return rows
})

function positionPanel() {
  if (!wrapper.value) return
  const rect = wrapper.value.getBoundingClientRect()
  const panelHeight = 300
  const flipUp = window.innerHeight - rect.bottom < panelHeight && rect.top > panelHeight

  panelStyle.value = {
    width: `${Math.max(rect.width, 220)}px`,
    left: `${rect.left}px`,
    ...(flipUp
      ? { bottom: `${window.innerHeight - rect.top + 4}px` }
      : { top: `${rect.bottom + 4}px` }),
  }
}

async function toggle() {
  if (props.disabled) return
  if (open.value) {
    close()
    return
  }
  positionPanel()
  open.value = true
  query.value = ''
  // Start on the current selection so Enter without arrows is a no-op rather
  // than a surprise change.
  highlighted.value = Math.max(0, navigable.value.findIndex(o => o && sameValue(o.value, model.value)))
  await nextTick()
  searchInput.value?.focus()
}

function close() {
  open.value = false
  query.value = ''
  highlighted.value = -1
}

function pick(option: SearchableOption | null) {
  model.value = option ? option.value : null
  close()
}

function clear() {
  model.value = null
}

function move(delta: number) {
  const rows = navigable.value
  if (!rows.length) return
  const next = highlighted.value + delta
  highlighted.value = next < 0 ? rows.length - 1 : next >= rows.length ? 0 : next
  scrollHighlightIntoView()
}

async function scrollHighlightIntoView() {
  await nextTick()
  listbox.value
    ?.querySelector('[data-highlighted="true"]')
    ?.scrollIntoView({ block: 'nearest' })
}

function onKeydown(event: KeyboardEvent) {
  if (!open.value) {
    if (['Enter', ' ', 'ArrowDown'].includes(event.key)) {
      event.preventDefault()
      toggle()
    }
    return
  }
  switch (event.key) {
    case 'ArrowDown': event.preventDefault(); move(1); break
    case 'ArrowUp': event.preventDefault(); move(-1); break
    case 'Home': event.preventDefault(); highlighted.value = 0; scrollHighlightIntoView(); break
    case 'End': event.preventDefault(); highlighted.value = navigable.value.length - 1; scrollHighlightIntoView(); break
    case 'Enter':
      event.preventDefault()
      if (highlighted.value >= 0) pick(navigable.value[highlighted.value] ?? null)
      break
    case 'Escape': event.preventDefault(); close(); break
    case 'Tab': close(); break
  }
}

// Filtering changes which row index means what, so reset the highlight.
watch(filtered, () => { highlighted.value = navigable.value.length ? 0 : -1 })

function onPointerDown(event: MouseEvent) {
  if (!open.value) return
  const target = event.target as Node
  if (wrapper.value?.contains(target)) return
  if (listbox.value?.closest('[data-searchable-panel]')?.contains(target)) return
  close()
}

// The panel is fixed-positioned against the trigger, so it has to follow it.
// Capture phase catches scrolling inside any ancestor, not just the window.
function reposition() { if (open.value) positionPanel() }

onMounted(() => {
  document.addEventListener('mousedown', onPointerDown)
  window.addEventListener('resize', reposition)
  window.addEventListener('scroll', reposition, true)
})
onBeforeUnmount(() => {
  document.removeEventListener('mousedown', onPointerDown)
  window.removeEventListener('resize', reposition)
  window.removeEventListener('scroll', reposition, true)
})
</script>

<template>
  <div ref="wrapper" class="relative">
    <span v-if="label" class="mb-1 block text-sm font-medium text-ink">
      {{ label }}<span v-if="required" class="text-breaking"> *</span>
    </span>

    <button
      type="button"
      role="combobox"
      :aria-expanded="open"
      :aria-controls="listboxId"
      aria-haspopup="listbox"
      :disabled="disabled"
      :class="[
        'flex w-full items-center justify-between gap-2 rounded-lg border bg-surface px-3 py-2 text-left text-kh-sm outline-none transition-colors disabled:cursor-not-allowed disabled:opacity-50',
        open ? 'border-brand ring-1 ring-brand/20' : 'border-line hover:border-brand/50',
      ]"
      @click="toggle"
      @keydown="onKeydown"
    >
      <span :class="['min-w-0 truncate', hasValue ? 'text-ink' : 'text-ink-muted']">
        {{ displayLabel }}
      </span>

      <span class="flex shrink-0 items-center gap-1">
        <span
          v-if="hasValue && clearable"
          class="rounded p-0.5 text-ink-muted hover:text-ink"
          role="button"
          tabindex="-1"
          aria-label="Clear selection"
          @click.stop="clear"
          @keydown.enter.stop.prevent="clear"
        >
          <svg class="h-3.5 w-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" aria-hidden="true">
            <path d="M6 6l12 12M18 6L6 18" stroke-linecap="round" />
          </svg>
        </span>
        <svg
          :class="['h-4 w-4 text-ink-muted transition-transform', open ? 'rotate-180' : '']"
          viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"
        >
          <path d="M6 9l6 6 6-6" stroke-linecap="round" stroke-linejoin="round" />
        </svg>
      </span>
    </button>

    <Teleport to="body">
      <Transition name="searchable">
        <div
          v-if="open"
          data-searchable-panel
          :style="panelStyle"
          class="fixed z-[120] overflow-hidden rounded-xl border border-line bg-surface shadow-lift"
        >
          <div v-if="searchable" class="border-b border-line p-2">
            <div class="flex items-center gap-2 rounded-lg border border-line bg-surface-muted px-2.5 py-1.5">
              <svg class="h-4 w-4 shrink-0 text-ink-muted" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true">
                <circle cx="11" cy="11" r="7" /><path d="M20 20l-3.5-3.5" stroke-linecap="round" />
              </svg>
              <input
                ref="searchInput"
                v-model="query"
                type="text"
                :placeholder="searchPlaceholder"
                class="min-w-0 flex-1 bg-transparent text-kh-sm text-ink outline-none"
                @keydown="onKeydown"
              >
            </div>
          </div>

          <div :id="listboxId" ref="listbox" role="listbox" class="max-h-60 overflow-y-auto py-1">
            <p v-if="!filtered.length" class="px-3 py-6 text-center text-sm text-ink-muted">
              No matches
            </p>

            <button
              v-if="clearable"
              type="button"
              role="option"
              :aria-selected="!hasValue"
              :data-highlighted="navigable[highlighted] === null"
              :class="[
                'flex w-full items-center gap-2 px-3 py-2 text-left text-kh-sm transition-colors',
                navigable[highlighted] === null ? 'bg-surface-muted' : '',
                !hasValue ? 'font-semibold text-brand' : 'text-ink-muted',
              ]"
              @mousedown.prevent="pick(null)"
            >
              <span class="w-3.5 shrink-0 text-brand" aria-hidden="true">{{ !hasValue ? '✓' : '' }}</span>
              {{ emptyLabel }}
            </button>

            <button
              v-for="option in filtered"
              :key="option.value"
              type="button"
              role="option"
              :aria-selected="sameValue(option.value, model)"
              :disabled="option.disabled"
              :data-highlighted="navigable[highlighted] === option"
              :class="[
                'flex w-full items-center gap-2 px-3 py-2 text-left text-kh-sm transition-colors disabled:opacity-40',
                navigable[highlighted] === option ? 'bg-surface-muted' : '',
                sameValue(option.value, model) ? 'font-semibold text-brand' : 'text-ink',
              ]"
              @mousedown.prevent="!option.disabled && pick(option)"
            >
              <span class="w-3.5 shrink-0 text-brand" aria-hidden="true">
                {{ sameValue(option.value, model) ? '✓' : '' }}
              </span>
              <span class="min-w-0 truncate">{{ option.label }}</span>
              <span v-if="option.sub" class="ml-auto shrink-0 truncate text-xs text-ink-muted">{{ option.sub }}</span>
            </button>
          </div>
        </div>
      </Transition>
    </Teleport>
  </div>
</template>

<style scoped>
.searchable-enter-active,
.searchable-leave-active { transition: opacity 0.12s ease, transform 0.12s ease; }
.searchable-enter-from,
.searchable-leave-to { opacity: 0; transform: translateY(-4px); }
</style>
