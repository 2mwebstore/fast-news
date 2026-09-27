<script setup lang="ts">
/** Root component. Page-level metadata is set per page via useSiteSeo. */
const { nameEn, nameKh } = useSite()

useHead({
  titleTemplate: (title?: string) => {
    if (!title) return nameEn.value

    // Editors often type the brand into an SEO title, and some page titles
    // include it by design. Appending it unconditionally would produce
    // "... | Cambodia Fast News | Cambodia Fast News".
    const brand = nameEn.value
    const brandKh = nameKh.value
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
