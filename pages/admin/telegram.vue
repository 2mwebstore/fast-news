<script setup lang="ts">
/**
 * The Telegram screen was folded into Settings, which now owns both the
 * credentials and the delivery log. This redirect exists so an existing
 * bookmark or a link in someone's notes still lands somewhere useful rather
 * than on an error page.
 */
definePageMeta({ layout: false, middleware: 'admin' })

await navigateTo('/admin/settings', { replace: true })
</script>

<template>
  <div />
</template>
