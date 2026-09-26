<script setup lang="ts">
definePageMeta({ layout: 'admin', middleware: 'admin' })
const { t } = useAdminLocale()
useHead({ title: 'New creative — Newsroom' })
</script>

<template>
  <div>
    <h1 class="mb-4 text-xl font-bold">{{ t('create') }} creative</h1>
    <AdminCreativeForm />
  </div>
</template>
