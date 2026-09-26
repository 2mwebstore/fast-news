<script setup lang="ts">
/**
 * Runtime settings (§70).
 *
 * The bot token is write-only over the API: it comes back masked and can only
 * be replaced. The field is left blank on load, and a blank field means
 * "unchanged" — clearing is a separate, deliberate action.
 */
definePageMeta({ layout: 'admin', middleware: 'admin' })

const api = useAdminApi()
const { t } = useAdminLocale()

interface TelegramPost {
  id: number
  kind: string
  status: string
  text: string
  errorMessage?: string
  sentAt?: string
  createdAt: string
}

interface TelegramSettings {
  botTokenMasked: string
  botTokenSet: boolean
  botTokenSource: 'database' | 'environment' | 'unset'
  channelId: string
  autoPublish: boolean
}

const settings = ref<TelegramSettings | null>(null)
const loading = ref(true)
const saving = ref(false)
const testing = ref(false)
const message = ref('')
const errorMessage = ref('')
const confirmClear = ref(false)
const clearing = ref(false)

const form = reactive({ botToken: '', channelId: '', autoPublish: false })

const recentPosts = ref<TelegramPost[]>([])

// Footer content. Lives in the settings table so adding a Facebook page is an
// edit here, not a deploy. Every key is optional: an empty value means the
// footer omits that row rather than rendering a dead link.
const siteKeys = [
  { key: 'site.tagline_kh', label: 'Tagline (Khmer)', type: 'text' },
  { key: 'site.tagline_en', label: 'Tagline (English)', type: 'text' },
  { key: 'site.contact_email', label: 'Contact email', type: 'email' },
  { key: 'site.contact_phone', label: 'Contact phone', type: 'tel' },
  { key: 'site.address_kh', label: 'Address (Khmer)', type: 'text' },
  { key: 'site.address_en', label: 'Address (English)', type: 'text' },
  { key: 'site.facebook_url', label: 'Facebook page', type: 'url' },
  { key: 'site.youtube_url', label: 'YouTube channel', type: 'url' },
  { key: 'site.telegram_url', label: 'Telegram channel', type: 'url' },
  { key: 'site.tiktok_url', label: 'TikTok', type: 'url' },
  { key: 'site.x_url', label: 'X (Twitter)', type: 'url' },
] as const

const site = ref<Record<string, string>>({})
const savingSite = ref(false)

async function loadSite() {
  try {
    site.value = await api.get<Record<string, string>>('/api/admin/settings/site')
  } catch {
    // The rest of the page still works without it.
  }
}

async function saveSite() {
  savingSite.value = true
  message.value = ''
  errorMessage.value = ''
  try {
    await api.put('/api/admin/settings/site', site.value)
    message.value = t('saved')
  } catch (e: unknown) {
    errorMessage.value = (e as { data?: { message?: string } }).data?.message
      || 'Could not save the site details.'
  } finally {
    savingSite.value = false
  }
}
const { dateTime } = useFormat()

async function load() {
  loading.value = true
  try {
    void loadSite()
    const result = await api.get<TelegramSettings>('/api/admin/settings/telegram')
    settings.value = result
    form.channelId = result.channelId
    form.autoPublish = result.autoPublish
    form.botToken = ''

    // The delivery log is the evidence that the credentials actually work, so
    // it belongs beside them rather than on a separate screen.
    const status = await api.get<{ recentPosts: TelegramPost[] }>('/api/admin/telegram')
    recentPosts.value = status.recentPosts ?? []
  } finally {
    loading.value = false
  }
}
onMounted(load)

async function save() {
  saving.value = true
  message.value = ''
  errorMessage.value = ''
  try {
    settings.value = await api.put<TelegramSettings>('/api/admin/settings/telegram', {
      botToken: form.botToken || undefined,
      channelId: form.channelId,
      autoPublish: form.autoPublish,
    })
    form.botToken = ''
    message.value = t('saved')
  } catch (e: unknown) {
    errorMessage.value = (e as { data?: { message?: string } }).data?.message || 'Could not save settings.'
  } finally {
    saving.value = false
  }
}

async function test() {
  testing.value = true
  message.value = ''
  errorMessage.value = ''
  try {
    const result = await api.post<{ message: string }>('/api/admin/settings/telegram/test')
    message.value = result.message
  } catch (e: unknown) {
    errorMessage.value = (e as { data?: { message?: string } }).data?.message || 'Telegram did not respond.'
  } finally {
    testing.value = false
  }
}

async function clearToken() {
  clearing.value = true
  try {
    settings.value = await api.del<TelegramSettings>('/api/admin/settings/telegram/token')
    message.value = 'Stored token cleared.'
  } catch (e: unknown) {
    errorMessage.value = (e as { data?: { message?: string } }).data?.message || 'Could not clear the token.'
  } finally {
    clearing.value = false
    confirmClear.value = false
  }
}

const sourceLabel = computed(() => {
  switch (settings.value?.botTokenSource) {
    case 'database': return 'Saved here in the admin'
    case 'environment': return 'From TELEGRAM_BOT_TOKEN in the environment'
    default: return 'Not configured'
  }
})

useHead({ title: 'Settings — Newsroom' })
</script>

<template>
  <div class="max-w-2xl">
    <h1 class="mb-1 text-xl font-bold">{{ t('settings') }}</h1>
    <p class="mb-6 text-sm text-ink-muted">
      Values saved here override the environment and take effect immediately — no redeploy.
    </p>

    <p v-if="loading" class="py-12 text-center text-ink-muted">{{ t('loading') }}</p>

    <section v-if="!loading" class="card mb-6 p-6">
      <h2 class="mb-1 font-bold">Site details</h2>
      <p class="mb-4 text-sm text-ink-muted">
        Shown in the public footer. Leave a field empty to hide that row — an
        unset social profile must not become a dead link, and these also feed the
        Organization schema, so only list profiles the newsroom actually owns.
      </p>

      <div class="space-y-3">
        <div v-for="field in siteKeys" :key="field.key">
          <label :for="field.key" class="mb-1 block text-sm font-medium">{{ field.label }}</label>
          <input
            :id="field.key"
            v-model="site[field.key]"
            :type="field.type"
            :placeholder="field.type === 'url' ? 'https://…' : ''"
            class="w-full rounded-lg border border-line px-3 py-2 text-sm outline-none focus:border-brand"
          >
        </div>
      </div>

      <button
        type="button"
        class="mt-4 rounded-lg bg-brand px-4 py-2 text-sm font-semibold text-white hover:bg-brand-dark disabled:opacity-50"
        :disabled="savingSite"
        @click="saveSite"
      >{{ savingSite ? t('saving') : t('save') }}</button>
    </section>

    <section v-if="!loading" class="card p-6">
      <div class="mb-4 flex items-center justify-between gap-3">
        <h2 class="font-bold">Telegram</h2>
        <span
          :class="[
            'rounded-full px-2.5 py-1 text-xs font-semibold',
            settings?.botTokenSet ? 'bg-success/10 text-success' : 'bg-ink/10 text-ink-muted',
          ]"
        >{{ settings?.botTokenSet ? 'Configured' : 'Not configured' }}</span>
      </div>

      <form class="space-y-5" @submit.prevent="save">
        <div>
          <label for="bot-token" class="mb-1 block text-sm font-medium">Bot token</label>
          <input
            id="bot-token"
            v-model="form.botToken"
            type="password"
            autocomplete="off"
            :placeholder="settings?.botTokenSet ? settings.botTokenMasked : '123456789:AA…'"
            class="w-full rounded-lg border border-line px-3 py-2 font-mono text-sm outline-none focus:border-brand"
          >
          <p class="mt-1.5 text-xs text-ink-muted">
            Source: {{ sourceLabel }}.
            <template v-if="settings?.botTokenSet">
              Leave blank to keep the current token — it is stored encrypted and never shown again.
            </template>
            The token is verified with Telegram before it is saved.
          </p>
        </div>

        <div>
          <label for="channel-id" class="mb-1 block text-sm font-medium">Channel</label>
          <input
            id="channel-id"
            v-model="form.channelId"
            type="text"
            placeholder="@cambodiafastnews"
            class="w-full rounded-lg border border-line px-3 py-2 text-sm outline-none focus:border-brand"
          >
        </div>

        <label class="flex items-start gap-2.5 text-sm">
          <input v-model="form.autoPublish" type="checkbox" class="mt-0.5 rounded border-line">
          <span>
            Post automatically when an article is published
            <span class="block text-xs text-ink-muted">
              Off by default. With this on, every published article goes to the channel.
            </span>
          </span>
        </label>

        <p v-if="message" class="rounded-lg bg-success/10 p-3 text-sm text-success">{{ message }}</p>
        <p v-if="errorMessage" class="rounded-lg bg-breaking/10 p-3 text-sm text-breaking">{{ errorMessage }}</p>

        <div class="flex flex-wrap gap-2 border-t border-line pt-4">
          <button
            type="submit" :disabled="saving"
            class="rounded-lg bg-brand px-5 py-2.5 text-sm font-semibold text-white hover:bg-brand-dark disabled:opacity-50"
          >{{ saving ? t('saving') : t('save') }}</button>

          <button
            type="button" :disabled="testing || !settings?.botTokenSet"
            class="rounded-lg border border-line px-4 py-2.5 text-sm font-semibold hover:bg-surface-muted disabled:opacity-50"
            @click="test"
          >{{ testing ? '…' : t('test') }}</button>

          <button
            v-if="settings?.botTokenSource === 'database'"
            type="button"
            class="ml-auto rounded-lg border border-breaking px-4 py-2.5 text-sm font-semibold text-breaking hover:bg-breaking/5"
            @click="confirmClear = true"
          >Clear stored token</button>
        </div>
      </form>
    </section>

    <!-- ── Delivery log ─────────────────────────────────────────────── -->
    <section v-if="!loading" class="card mt-6 p-6">
      <h2 class="mb-3 font-bold">Recent Telegram posts</h2>

      <p v-if="!recentPosts.length" class="py-6 text-center text-sm text-ink-muted">
        Nothing sent yet.
      </p>

      <ul v-else class="divide-y divide-line">
        <li v-for="post in recentPosts" :key="post.id" class="py-3 first:pt-0">
          <div class="mb-1 flex flex-wrap items-center gap-2 text-xs">
            <span
              :class="[
                'rounded px-1.5 py-0.5 font-semibold',
                post.status === 'sent' ? 'bg-success/15 text-success'
                : post.status === 'failed' ? 'bg-breaking/15 text-breaking'
                : 'bg-ink/10 text-ink-muted',
              ]"
            >{{ post.status }}</span>
            <span class="text-ink-muted">{{ post.kind }}</span>
            <span class="text-ink-muted">{{ dateTime(post.sentAt || post.createdAt) }}</span>
          </div>
          <p class="line-clamp-2 whitespace-pre-line text-kh-sm khmer-wrap">{{ post.text }}</p>
          <p v-if="post.errorMessage" class="mt-1 text-xs text-breaking">{{ post.errorMessage }}</p>
        </li>
      </ul>
    </section>

    <ConfirmDialog
      :open="confirmClear"
      title="Clear the stored bot token?"
      message="Publishing to Telegram will stop unless TELEGRAM_BOT_TOKEN is set in the environment."
      :consequences="[
        'The encrypted token is removed from the database.',
        'Any environment value takes over again.',
        'You will need to paste the token to restore it.',
      ]"
      confirm-label="Clear token"
      :busy="clearing"
      @confirm="clearToken"
      @cancel="confirmClear = false"
    />
  </div>
</template>
