<script setup lang="ts">
definePageMeta({ layout: 'admin', middleware: 'admin' })

const route = useRoute()
const { t } = useAdminLocale()
const videoId = computed(() => Number(route.params.id))

useHead({ title: 'Edit video — Newsroom' })
</script>

<template>
  <div>
    <h1 class="mb-4 text-xl font-bold">{{ t('edit') }} — {{ t('videos') }}</h1>
    <AdminVideoForm :video-id="videoId" />
  </div>
</template>
