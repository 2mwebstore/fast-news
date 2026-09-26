<script setup lang="ts">
/**
 * The paid-content label (§42). It renders wherever sponsored content appears,
 * including inside feeds, so a reader is never shown paid material presented
 * as independent reporting.
 */
withDefaults(defineProps<{ sponsor?: string; small?: boolean }>(), { small: false })
const { t } = useLocale()
</script>

<template>
  <span :class="['badge-sponsored', small ? 'text-[10px]' : 'text-xs']">
    {{ t('sponsored') }}<template v-if="sponsor"> · {{ sponsor }}</template>
  </span>
</template>
