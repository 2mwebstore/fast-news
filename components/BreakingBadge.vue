<script setup lang="ts">
/** The red BREAKING pill. Red is reserved for this and LIVE (§2). */
const props = withDefaults(defineProps<{ small?: boolean; label?: string }>(), { small: false })
const { t } = useLocale()
const text = computed(() => props.label || t('breaking'))
</script>

<template>
  <span :class="['badge-breaking', small ? 'text-[10px]' : 'text-xs']">
    <span class="inline-block h-1.5 w-1.5 rounded-full bg-white animate-pulse-dot" aria-hidden="true" />
    {{ text }}
  </span>
</template>
