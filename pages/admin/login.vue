<script setup lang="ts">
definePageMeta({ layout: false })

const { t } = useAdminLocale()

const auth = useAuthStore()
const route = useRoute()

const email = ref('')
const password = ref('')
const busy = ref(false)
const errorMessage = ref('')

onMounted(async () => {
  await auth.restore()
  if (auth.isAuthenticated) navigateTo(String(route.query.redirect || '/admin'))
})

async function submit() {
  busy.value = true
  errorMessage.value = ''
  try {
    await auth.login(email.value.trim(), password.value)
    await navigateTo(String(route.query.redirect || '/admin'))
  } catch (e: unknown) {
    const err = e as { data?: { message?: string } }
    // The API deliberately returns the same message for a wrong email and a
    // wrong password, so this cannot be used to enumerate accounts.
    errorMessage.value = err.data?.message || t('loginFailed')
  } finally {
    busy.value = false
  }
}

useHead({ title: 'Sign in — Newsroom' })
// The login screen must never be indexed.
useSeoMeta({ robots: 'noindex, nofollow' })
</script>

<template>
  <div class="flex min-h-screen items-center justify-center bg-surface-muted px-4">
    <div class="w-full max-w-sm">
      <div class="mb-6 text-center">
        <TheLogo class="mx-auto h-10 w-auto" />
        <p class="mt-2 text-xs uppercase tracking-widest text-ink-muted">Newsroom sign in</p>
      </div>

      <form class="card space-y-4 p-6" @submit.prevent="submit">
        <div>
          <label for="email" class="mb-1 block text-sm font-semibold">{{ t('email') }}</label>
          <input
            id="email" v-model="email" type="email" required autocomplete="username"
            class="w-full rounded-lg border border-line px-3 py-2.5 outline-none focus:border-brand"
          >
        </div>

        <div>
          <label for="password" class="mb-1 block text-sm font-semibold">{{ t('password') }}</label>
          <input
            id="password" v-model="password" type="password" required autocomplete="current-password"
            class="w-full rounded-lg border border-line px-3 py-2.5 outline-none focus:border-brand"
          >
        </div>

        <p v-if="errorMessage" class="rounded-lg bg-breaking/10 p-3 text-sm text-breaking">
          {{ errorMessage }}
        </p>

        <button
          type="submit" :disabled="busy"
          class="w-full rounded-lg bg-brand px-4 py-2.5 font-semibold text-white hover:bg-brand-dark disabled:opacity-50"
        >
          {{ busy ? t('loading') : t('signIn') }}
        </button>
      </form>
    </div>
  </div>
</template>
