<script setup lang="ts">
/**
 * Labelled select.
 *
 * Built on a native `<select>` rather than a custom listbox: it is keyboard
 * accessible, screen-reader correct and uses the platform picker on a phone —
 * all of which a hand-rolled dropdown has to reimplement and usually gets
 * wrong.
 */
export interface SelectOption {
  value: string | number
  label: string
  disabled?: boolean
}

const model = defineModel<string | number>({ default: '' })

withDefaults(defineProps<{
  options: SelectOption[]
  label?: string
  /** Renders the label beside the control instead of above it. */
  inline?: boolean
  placeholder?: string
  disabled?: boolean
  size?: 'sm' | 'md'
}>(), { inline: false, disabled: false, size: 'md' })

const selectId = useId()
</script>

<template>
  <div :class="inline ? 'flex items-center gap-2' : ''">
    <label
      v-if="label"
      :for="selectId"
      :class="inline ? 'shrink-0 text-sm text-ink-muted' : 'mb-1 block text-sm font-medium'"
    >{{ label }}</label>

    <div class="relative">
      <select
        :id="selectId"
        v-model="model"
        :disabled="disabled"
        :class="[
          'w-full appearance-none rounded-lg border border-line bg-surface pr-8 outline-none transition-colors focus:border-brand disabled:opacity-50',
          size === 'sm' ? 'py-1.5 pl-2.5 text-sm' : 'py-2 pl-3 text-kh-sm',
        ]"
      >
        <option v-if="placeholder" value="" disabled>{{ placeholder }}</option>
        <option
          v-for="option in options"
          :key="option.value"
          :value="option.value"
          :disabled="option.disabled"
        >{{ option.label }}</option>
      </select>

      <span class="pointer-events-none absolute right-2.5 top-1/2 -translate-y-1/2 text-ink-muted" aria-hidden="true">
        <svg class="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <path d="M6 9l6 6 6-6" stroke-linecap="round" stroke-linejoin="round" />
        </svg>
      </span>
    </div>
  </div>
</template>
