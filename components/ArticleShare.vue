<script setup lang="ts">
import type { ArticleDetail } from '~/types'

/**
 * Article sharing (§90). A thin wrapper over ShareLinks that supplies the
 * article's canonical path, its headline in the reader's language, and the
 * beacon that feeds share counts into trending (§44).
 */
const props = withDefaults(defineProps<{ article: ArticleDetail; expanded?: boolean }>(), {
  expanded: false,
})

const { title } = useLocale()
</script>

<template>
  <ShareLinks
    :path="`/news/${props.article.slug}`"
    :title="title(props.article)"
    :track-path="`/api/news/${props.article.slug}/share`"
    :expanded="props.expanded"
  />
</template>
