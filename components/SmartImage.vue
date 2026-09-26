<script setup lang="ts">
/**
 * An image that reserves its space, shows a shimmer while loading, fades in
 * when ready, and degrades to a branded placeholder if it never arrives.
 *
 * The box is sized from the aspect ratio before the file is requested, so a
 * slow or failed image never shifts the layout (§38, §56).
 */
const props = withDefaults(defineProps<{
  src?: string
  alt: string
  width?: number
  height?: number
  /** CSS aspect-ratio for the reserved box. */
  ratio?: string
  /** Load eagerly and at high priority — for the one image above the fold. */
  priority?: boolean
  imgClass?: string
}>(), { ratio: '16 / 9', priority: false, imgClass: '' })

const loaded = ref(false)
const failed = ref(false)
const el = ref<HTMLImageElement | null>(null)

// An image served from cache can finish before the load listener attaches,
// which would leave the shimmer up forever.
onMounted(() => {
  const img = el.value
  if (img?.complete) {
    img.naturalWidth > 0 ? (loaded.value = true) : (failed.value = true)
  }
})

// A new src means a new load cycle.
watch(() => props.src, () => {
  loaded.value = false
  failed.value = false
})

const showPlaceholder = computed(() => !props.src || failed.value)
</script>

<template>
  <div
    class="relative overflow-hidden bg-surface-muted"
    :style="{ aspectRatio: ratio }"
  >
    <!-- Shimmer, shown only while a real image is in flight. -->
    <div
      v-if="!loaded && !showPlaceholder"
      class="absolute inset-0 animate-shimmer bg-[linear-gradient(90deg,transparent,rgba(15,23,42,0.06),transparent)] bg-[length:200%_100%]"
      aria-hidden="true"
    />

    <img
      v-if="src && !failed"
      ref="el"
      :src="src"
      :alt="alt"
      :width="width"
      :height="height"
      :loading="priority ? 'eager' : 'lazy'"
      :fetchpriority="priority ? 'high' : undefined"
      decoding="async"
      :class="[
        'h-full w-full object-cover transition-opacity duration-500',
        loaded ? 'opacity-100' : 'opacity-0',
        imgClass,
      ]"
      @load="loaded = true"
      @error="failed = true"
    >

    <!-- No source, or the load failed. A visible mark beats a blank grey box:
         it reads as intentional rather than broken. -->
    <div
      v-if="showPlaceholder"
      class="absolute inset-0 flex items-center justify-center bg-brand/5"
      aria-hidden="true"
    >
      <svg class="h-8 w-8 text-brand/25" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
        <rect x="3" y="4" width="18" height="16" rx="2" />
        <circle cx="8.5" cy="9.5" r="1.5" />
        <path d="M21 16l-5-5-4 4-2-2-5 5" stroke-linecap="round" stroke-linejoin="round" />
      </svg>
    </div>

    <slot />
  </div>
</template>
