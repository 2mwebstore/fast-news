<script setup lang="ts">
definePageMeta({ layout: 'admin', middleware: 'admin' })

const { t } = useAdminLocale()
useHead({ title: 'New article — Newsroom' })
</script>

<template>
  <div>
    <h1 class="mb-4 text-xl font-bold">{{ t('writeNewArticle') }}</h1>
    <AdminArticleForm />
  </div>
</template>
