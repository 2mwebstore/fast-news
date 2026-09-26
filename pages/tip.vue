<script setup lang="ts">
/**
 * Citizen reporter submission form (§34).
 *
 * The form states up front that nothing is published automatically, so nobody
 * submits under the impression that their report goes straight to the site.
 */

const { t } = useLocale()
const api = useApi()

const form = reactive({ name: '', contact: '', location: '', description: '' })
const submitting = ref(false)
const submitted = ref(false)
const errorMessage = ref('')

async function submit() {
  if (form.description.trim().length < 10) {
    errorMessage.value = t('tipTooShort')
    return
  }

  submitting.value = true
  errorMessage.value = ''
  try {
    await api.post('/api/tip', { ...form })
    submitted.value = true
  } catch (e: unknown) {
    const err = e as { data?: { message?: string } }
    errorMessage.value = err.data?.message || t('tipFailed')
  } finally {
    submitting.value = false
  }
}

useSiteSeo({
  title: t('tipTitle'),
  description: t('tipDesc'),
  path: '/tip',
})
</script>

<template>
  <div class="container-content max-w-prose">
    <h1 class="text-kh-2xl font-bold">{{ t('tipTitle') }}</h1>

    <div class="mt-4 rounded-lg border border-line bg-surface-muted p-4 text-kh-sm khmer-wrap">
      {{ t('tipIntro') }}
    </div>

    <div v-if="submitted" class="mt-6 rounded-lg border border-success/40 bg-success/5 p-6 text-center">
      <p class="text-kh-lg font-semibold text-success">{{ t('tipThanks') }}</p>
      <p class="mt-2 text-kh-base khmer-wrap">
        {{ t('tipReceived') }}
      </p>
    </div>

    <form v-else class="mt-6 space-y-4" @submit.prevent="submit">
      <div>
        <label for="tip-description" class="mb-1 block text-kh-sm font-semibold">
          {{ t('tipWhatHappened') }} <span class="text-breaking">*</span>
        </label>
        <textarea
          id="tip-description" v-model="form.description" rows="6" required
          class="w-full rounded-lg border border-line px-3 py-2 text-kh-base outline-none focus:border-brand"
          :placeholder="t('tipDetailPlaceholder')"
        />
      </div>

      <div>
        <label for="tip-location" class="mb-1 block text-kh-sm font-semibold">{{ t('tipLocation') }}</label>
        <input
          id="tip-location" v-model="form.location" type="text"
          class="w-full rounded-lg border border-line px-3 py-2 text-kh-base outline-none focus:border-brand"
          :placeholder="t('tipLocationPlaceholder')"
        >
      </div>

      <div class="grid gap-4 sm:grid-cols-2">
        <div>
          <label for="tip-name" class="mb-1 block text-kh-sm font-semibold">{{ t('tipName') }}</label>
          <input
            id="tip-name" v-model="form.name" type="text"
            class="w-full rounded-lg border border-line px-3 py-2 text-kh-base outline-none focus:border-brand"
          >
        </div>
        <div>
          <label for="tip-contact" class="mb-1 block text-kh-sm font-semibold">{{ t('tipContact') }}</label>
          <input
            id="tip-contact" v-model="form.contact" type="text"
            class="w-full rounded-lg border border-line px-3 py-2 text-kh-base outline-none focus:border-brand"
            :placeholder="t('tipContactPlaceholder')"
          >
        </div>
      </div>

      <p class="text-xs text-ink-muted khmer-wrap">
        {{ t('tipContactNote') }}
      </p>

      <p v-if="errorMessage" class="rounded-lg bg-breaking/10 p-3 text-kh-sm text-breaking">
        {{ errorMessage }}
      </p>

      <button
        type="submit" :disabled="submitting"
        class="w-full rounded-lg bg-brand px-6 py-3 font-semibold text-white hover:bg-brand-dark disabled:opacity-50 sm:w-auto"
      >
        {{ submitting ? t('tipSending') : t('tipSubmit') }}
      </button>
    </form>
  </div>
</template>
