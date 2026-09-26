<script setup lang="ts">
/** Root component. Page-level metadata is set per page via useSiteSeo. */
const config = useRuntimeConfig()

useHead({
  titleTemplate: (title?: string) => {
    if (!title) return config.public.siteName

    // Editors often type the brand into an SEO title, and some page titles
    // include it by design. Appending it unconditionally would produce
    // "... | Cambodia Fast News | Cambodia Fast News".
    const brand = config.public.siteName
    const brandKh = config.public.siteNameKh
    if (title.includes(brand) || title.includes(brandKh)) return title

    return `${title} | ${brand}`
  },
})
</script>

<template>
  <NuxtLayout>
    <NuxtPage />
  </NuxtLayout>
</template>
