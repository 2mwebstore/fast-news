<script setup lang="ts">
definePageMeta({ layout: 'admin', middleware: 'admin' })
const { t } = useAdminLocale()
useHead({ title: 'New video — Newsroom' })
</script>

<template>
  <div>
    <h1 class="mb-4 text-xl font-bold">{{ t('create') }} — {{ t('videos') }}</h1>
    <AdminVideoForm />
  </div>
</template>
