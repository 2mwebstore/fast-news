<script setup lang="ts">
/**
 * The site logo, as set in Admin → Settings.
 *
 * With an uploaded logo, that image is the logo, and the name is written
 * beside it only when the admin asks (for an icon-only mark). Without one, the
 * built-in mark is drawn beside the site name, so renaming the site needs no
 * new artwork.
 *
 * Size it with the --logo-h variable, e.g. class="[--logo-h:2rem]": the mark,
 * image and lettering all scale from it, the way the old fixed SVG did.
 */
const props = defineProps<{
  /** Unsaved values to draw instead of the saved ones (settings preview). */
  preview?: { nameEn: string; logoUrl: string; showName: boolean }
}>()

const site = useSite()
const nameEn = computed(() => props.preview?.nameEn.trim() || site.nameEn.value)
const logoUrl = computed(() => (props.preview ? props.preview.logoUrl.trim() : site.logoUrl.value))
const showName = computed(() => (props.preview ? props.preview.showName : site.logoShowName.value))

// A logo that fails to load falls back to the built-in mark rather than
// leaving a broken-image icon in the header.
const failed = ref(false)
watch(logoUrl, () => { failed.value = false })

// On a server-rendered page the browser can give up on the image before Vue
// hydrates and attaches @error, so that event is missed. Check once on mount.
const image = ref<HTMLImageElement | null>(null)
onMounted(() => {
  if (image.value?.complete && image.value.naturalWidth === 0) failed.value = true
})

const hasImage = computed(() => Boolean(logoUrl.value) && !failed.value)
const withName = computed(() => !hasImage.value || showName.value)

// Two lines, like the original wordmark: the first word, then the rest.
const lines = computed(() => {
  const words = nameEn.value.trim().split(/\s+/)
  return words.length > 1 ? [words[0], words.slice(1).join(' ')] : [nameEn.value]
})
</script>

<template>
  <span class="logo flex w-fit items-center">
    <img
      v-if="hasImage"
      ref="image"
      :src="logoUrl"
      :alt="withName ? '' : nameEn"
      class="logo-image"
      @error="failed = true"
    >
    <svg v-else class="logo-mark" viewBox="0 0 32 32" fill="none" aria-hidden="true">
      <rect width="32" height="32" rx="6" fill="#1E3A8A" />
      <path d="M9 16h14M16 9l7 7-7 7" stroke="#fff" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" />
    </svg>

    <span v-if="withName" class="logo-name">
      <span class="text-ink">{{ lines[0] }}</span>
      <span v-if="lines[1]" class="logo-second text-brand">{{ lines[1] }}</span>
    </span>
  </span>
</template>

<style scoped>
/* Proportions from the original 240×40 wordmark: a mark 80% of the height,
   lettering 37.5% of it, and a fifth of the height between the two. */
/* --logo-max-w caps the whole logo (the header sets it so the logo stays
   centred); inside it, an image scales down and a name truncates. */
.logo {
  height: var(--logo-h, 2rem);
  max-width: var(--logo-max-w, 100%);
  gap: calc(var(--logo-h, 2rem) * 0.2);
}

.logo-mark {
  height: 80%;
  width: auto;
  flex-shrink: 0;
  aspect-ratio: 1;
}

/* A wide wordmark is capped so it cannot push the header controls off a
   phone screen; it scales down inside the box rather than being cropped. */
.logo-image {
  height: 100%;
  width: auto;
  min-width: 0;
  max-width: min(60vw, calc(var(--logo-h, 2rem) * 7));
  object-fit: contain;
}

.logo-name {
  display: flex;
  min-width: 0;
  max-width: calc(var(--logo-h, 2rem) * 7);
  flex-direction: column;
  font-size: calc(var(--logo-h, 2rem) * 0.375);
  font-weight: 800;
  text-transform: uppercase;
}

/* Set on the lines themselves: the site-wide :lang(km) rule targets every
   element, so inheriting from .logo-name is not enough. */
.logo-name > span {
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  font-family: Manrope, Inter, 'Kantumruy Pro', system-ui, sans-serif;
  line-height: 1.1;
}

.logo-second {
  letter-spacing: 0.03em;
}
</style>
