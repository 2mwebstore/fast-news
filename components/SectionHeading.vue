<script setup lang="ts">
/** The rule-and-title used above every homepage section (§6). */
const { t } = useLocale()

defineProps<{
  title: string
  subtitle?: string
  icon?: string
  href?: string
  accent?: string
}>()
</script>

<template>
  <div class="section-rule" :style="accent ? { borderColor: accent } : undefined">
    <h2 class="flex items-center gap-2 text-kh-xl font-bold">
      <span v-if="icon" aria-hidden="true">{{ icon }}</span>
      {{ title }}
    </h2>
    <span v-if="subtitle" class="text-xs text-ink-muted">{{ subtitle }}</span>
    <NuxtLink
      v-if="href"
      :to="href"
      class="ml-auto shrink-0 text-xs font-semibold text-brand hover:underline"
    >
      {{ t('viewAll') }} →
    </NuxtLink>
  </div>
</template>
