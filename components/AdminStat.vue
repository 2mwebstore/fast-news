<script setup lang="ts">
/** One dashboard tile. Becomes a link when a destination is given. */
withDefaults(defineProps<{
  label: string
  value: string | number
  to?: string
  accent?: 'brand' | 'breaking' | 'warning' | 'success'
}>(), { accent: 'brand' })

const accentClass: Record<string, string> = {
  brand: 'text-brand',
  breaking: 'text-breaking',
  warning: 'text-warning',
  success: 'text-success',
}
</script>

<template>
  <component
    :is="to ? resolveComponent('NuxtLink') : 'div'"
    :to="to"
    :class="['card block p-4', to ? 'transition-shadow hover:shadow-lift' : '']"
  >
    <p class="truncate text-xs text-ink-muted">{{ label }}</p>
    <p :class="['mt-1 text-2xl font-extrabold tabular-nums', accentClass[accent]]">{{ value }}</p>
  </component>
</template>
