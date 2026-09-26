<script setup lang="ts">
/**
 * Share buttons for any page (§90).
 *
 * Extracted from ArticleShare so videos get the same control instead of a
 * second copy that would drift. The caller supplies the path and the title; the
 * component owns the network list, the URL building and the copy-to-clipboard
 * fallback.
 *
 * `trackPath` is optional. When set, each share fires a beacon so it can feed
 * analytics (§43) and trending (§44); when absent the buttons still work and
 * nothing is counted, which is the right behaviour for a page with no counter
 * behind it — better than pointing every page at the article endpoint and
 * recording shares against the wrong thing.
 */
const props = withDefaults(defineProps<{
  /** Site-relative path, e.g. /news/slug or /video/slug. */
  path: string
  title: string
  /** API path for the share beacon. Omit to not count shares. */
  trackPath?: string
  expanded?: boolean
}>(), { expanded: false })

const config = useRuntimeConfig()
const api = useApi()
const { t } = useLocale()
const copied = ref(false)

// The canonical URL is shared, never window.location — so a link copied from a
// page reached with ?utm_source= does not propagate the parameter.
const shareUrl = computed(() => `${config.public.siteUrl}${props.path}`)

const targets = computed(() => {
  const url = encodeURIComponent(shareUrl.value)
  const text = encodeURIComponent(props.title)
  const both = encodeURIComponent(`${props.title} ${shareUrl.value}`)
  return [
    { key: 'facebook', label: 'Facebook', href: `https://www.facebook.com/sharer/sharer.php?u=${url}` },
    { key: 'messenger', label: 'Messenger', href: `https://www.facebook.com/dialog/send?link=${url}&app_id=0&redirect_uri=${url}` },
    { key: 'telegram', label: 'Telegram', href: `https://t.me/share/url?url=${url}&text=${text}` },
    { key: 'whatsapp', label: 'WhatsApp', href: `https://wa.me/?text=${both}` },
    { key: 'x', label: 'X', href: `https://twitter.com/intent/tweet?url=${url}&text=${text}` },
  ]
})

function track(network: string) {
  if (!props.trackPath) return
  api.beacon(props.trackPath, { network })
}

async function copyLink() {
  try {
    await navigator.clipboard.writeText(shareUrl.value)
    copied.value = true
    track('copy')
    setTimeout(() => { copied.value = false }, 2000)
  } catch {
    // Clipboard access can be denied, and is unavailable outside a secure
    // context. The share links above still work, so there is nothing to report.
  }
}
</script>

<template>
  <div :class="['flex flex-wrap items-center', expanded ? 'gap-3' : 'gap-2']">
    <span v-if="expanded" class="text-kh-sm font-semibold">{{ t('shareLabel') }}</span>

    <a
      v-for="target in targets"
      :key="target.key"
      :href="target.href"
      target="_blank"
      rel="noopener noreferrer"
      :class="[
        'rounded-lg border border-line px-3 py-1.5 text-xs font-semibold hover:border-brand hover:text-brand',
        // Narrow screens show only the two networks that matter most in
        // Cambodia; the rest are one tap away in the expanded placement.
        !expanded && target.key !== 'facebook' && target.key !== 'telegram' ? 'hidden sm:block' : '',
      ]"
      :aria-label="t('shareVia', { network: target.label })"
      @click="track(target.key)"
    >
      {{ target.label }}
    </a>

    <button
      type="button"
      class="rounded-lg border border-line px-3 py-1.5 text-xs font-semibold hover:border-brand hover:text-brand"
      :aria-label="copied ? t('linkCopied') : t('copyLink')"
      @click="copyLink"
    >
      {{ copied ? `✓ ${t('copied')}` : t('copyLink') }}
    </button>
  </div>
</template>
