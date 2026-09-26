<script setup lang="ts">
definePageMeta({ layout: 'admin', middleware: 'admin' })

const { t } = useAdminLocale()

const route = useRoute()
const articleId = computed(() => Number(route.params.id))

useHead({ title: 'Edit article — Newsroom' })
</script>

<template>
  <div>
    <div class="mb-4 flex items-center justify-between">
      <h1 class="text-xl font-bold">{{ t('editArticle') }}</h1>
      <NuxtLink to="/admin/news" class="text-sm text-brand hover:underline">← {{ t('backToList') }}</NuxtLink>
    </div>
    <AdminArticleForm :article-id="articleId" />
  </div>
</template>
