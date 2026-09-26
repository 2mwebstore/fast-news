<script setup lang="ts">
definePageMeta({ layout: 'admin', middleware: 'admin' })

const route = useRoute()
const { t } = useAdminLocale()
const creativeId = computed(() => Number(route.params.id))

useHead({ title: 'Edit creative — Newsroom' })
</script>

<template>
  <div>
    <h1 class="mb-4 text-xl font-bold">{{ t('edit') }} creative</h1>
    <AdminCreativeForm :creative-id="creativeId" />
  </div>
</template>
