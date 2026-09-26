<script setup lang="ts">
const { t } = useLocale()

/**
 * Overlay marking an AI-generated illustration (§25). An AI image must never
 * read as a photograph of a real event, so the notice sits on the image itself
 * rather than in a caption that can be scrolled past.
 */
</script>

<template>
  <span
    class="absolute bottom-2 left-2 rounded bg-ink/75 px-2 py-0.5 text-[10px] font-medium text-white backdrop-blur-sm"
  >
    {{ t('aiImageNotice') }}
  </span>
</template>
