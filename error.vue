<script setup lang="ts">
import type { NuxtError } from '#app'

/**
 * Error page. On a 404 it first asks the API whether the path has a redirect
 * (§61) — a renamed article should send the reader on, not show them a dead
 * end.
 */
const props = defineProps<{ error: NuxtError }>()

const route = useRoute()
const checking = ref(props.error.statusCode === 404)

if (props.error.statusCode === 404) {
  const api = useApi()
  try {
    const result = await api.get<{ redirect: { toPath: string; statusCode: number } | null }>(
      '/api/redirects/resolve', { path: route.path },
    )
    if (result?.redirect) {
      await navigateTo(result.redirect.toPath, {
        redirectCode: result.redirect.statusCode, external: false, replace: true,
      })
    }
  } catch {
    // No redirect service available; fall through to the error page.
  } finally {
    checking.value = false
  }
}

const is404 = computed(() => props.error.statusCode === 404)

// A failed request while the device is offline is a connection problem, not a
// server fault. Saying "technical problem" there sends the reader looking for
// a fault that is not ours, and hides the one thing they can act on.
const online = ref(true)
function syncOnline() {
  online.value = navigator.onLine
}
onMounted(() => {
  syncOnline()
  window.addEventListener('online', syncOnline)
  window.addEventListener('offline', syncOnline)
})
onBeforeUnmount(() => {
  window.removeEventListener('online', syncOnline)
  window.removeEventListener('offline', syncOnline)
})
const isOffline = computed(() => !online.value && !is404.value)

useSiteSeo({
  title: is404.value ? 'រកមិនឃើញទំព័រ' : 'មានបញ្ហាបច្ចេកទេស',
  description: is404.value ? 'ទំព័រដែលអ្នកស្វែងរកមិនមានទេ។' : 'សូមអភ័យទោស មានបញ្ហាបច្ចេកទេស។',
  path: route.path,
  // An error page must never be indexed, whatever it is standing in for.
  robots: 'noindex, follow',
})
</script>

<template>
  <div class="flex min-h-screen flex-col bg-surface">
    <TheHeader />

    <main class="container-content flex flex-1 flex-col items-center justify-center py-20 text-center">
      <p v-if="!isOffline" class="text-6xl font-extrabold text-brand/20">{{ error.statusCode }}</p>
      <p v-else class="text-5xl" aria-hidden="true">📡</p>

      <h1 class="mt-4 text-kh-2xl font-bold">
        <template v-if="isOffline">គ្មានការតភ្ជាប់អ៊ីនធឺណិត</template>
        <template v-else-if="is404">រកមិនឃើញទំព័រនេះទេ</template>
        <template v-else>មានបញ្ហាបច្ចេកទេស</template>
      </h1>

      <p class="mt-2 max-w-prose text-kh-base text-ink-muted khmer-wrap">
        <template v-if="isOffline">
          សូមពិនិត្យការតភ្ជាប់របស់អ្នក រួចព្យាយាមម្តងទៀត។ — You appear to be offline.
        </template>
        <template v-else-if="is404">
          ទំព័រដែលអ្នកស្វែងរកអាចត្រូវបានផ្លាស់ប្តូរ ឬលុបចោល។
        </template>
        <template v-else>
          សូមព្យាយាមម្តងទៀតក្នុងពេលបន្តិចទៀត។
        </template>
      </p>

      <div class="mt-6 flex flex-wrap justify-center gap-3">
        <button
          v-if="isOffline"
          class="rounded-lg bg-brand px-5 py-2.5 font-semibold text-white hover:bg-brand-dark"
          @click="reloadNuxtApp({ persistState: false })"
        >
          ព្យាយាមម្តងទៀត
        </button>
        <NuxtLink v-else to="/" class="rounded-lg bg-brand px-5 py-2.5 font-semibold text-white hover:bg-brand-dark">
          ត្រឡប់ទៅទំព័រដើម
        </NuxtLink>
        <NuxtLink to="/search" class="rounded-lg border border-line px-5 py-2.5 font-semibold hover:bg-surface-muted">
          ស្វែងរកព័ត៌មាន
        </NuxtLink>
      </div>
    </main>

    <TheFooter />
  </div>
</template>
