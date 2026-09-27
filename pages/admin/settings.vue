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

// Save feedback for the two site cards, shown beside the button that was
// pressed rather than down in the Telegram card.
const siteNotice = ref<{ section: 'brand' | 'details'; ok: boolean; text: string } | null>(null)

// ── Brand ──────────────────────────────────────────────────────────────────
// The name and logo readers see in the header, footer, browser tab and search
// results. Saved with the rest of the site details (same endpoint).
const { refresh: refreshSite } = useSite()

const logoShowName = computed({
  get: () => site.value['site.logo_show_name'] === 'true',
  set: (value: boolean) => { site.value['site.logo_show_name'] = value ? 'true' : 'false' },
})

// What the header will draw, from the form as it stands — before saving.
const brandPreview = computed(() => ({
  nameEn: site.value['site.name'] ?? '',
  logoUrl: site.value['site.logo_url'] ?? '',
  showName: logoShowName.value,
}))

async function loadSite() {
  try {
    site.value = await api.get<Record<string, string>>('/api/admin/settings/site')
  } catch {
    // The rest of the page still works without it.
  }
}

async function saveSite(section: 'brand' | 'details') {
  savingSite.value = true
  siteNotice.value = null
  try {
    await api.put('/api/admin/settings/site', site.value)
    siteNotice.value = { section, ok: true, text: t('saved') }
    // The admin's own logo and name update now; the public site follows
    // within a few minutes, as its cached copy expires.
    await refreshSite().catch(() => {})
  } catch (e: unknown) {
    siteNotice.value = {
      section,
      ok: false,
      text: (e as { data?: { message?: string } }).data?.message || 'Could not save the site details.',
    }
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
      <h2 class="mb-1 font-bold">Brand</h2>
      <p class="mb-4 text-sm text-ink-muted">
        The name and logo readers see in the header, footer, browser tab and
        search results. Leave a name empty to use the deployment default.
      </p>

      <!-- Drawn from the form as it stands, so the effect is visible before
           anything is saved. -->
      <div class="mb-5 rounded-xl border border-line bg-surface-muted p-3">
        <p class="mb-2 text-xs font-semibold uppercase tracking-wide text-ink-muted">Preview</p>
        <div class="flex h-16 items-center justify-between gap-3 rounded-lg border border-line bg-surface px-4">
          <TheLogo :preview="brandPreview" class="[--logo-h:2.25rem]" />
          <span class="flex shrink-0 items-center gap-2 text-ink-muted" aria-hidden="true">
            <svg class="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <circle cx="11" cy="11" r="7" /><path d="M20 20l-3.5-3.5" stroke-linecap="round" />
            </svg>
            <span class="rounded border border-line px-2 py-0.5 text-xs font-semibold">EN</span>
          </span>
        </div>
      </div>

      <div class="grid gap-3 sm:grid-cols-2">
        <div>
          <label for="site-name-en" class="mb-1 block text-sm font-medium">Site name (English)</label>
          <input
            id="site-name-en"
            v-model="site['site.name']"
            type="text"
            maxlength="80"
            class="w-full rounded-lg border border-line px-3 py-2 text-sm outline-none focus:border-brand"
          >
          <p class="mt-1 text-xs text-ink-muted">Used in the logo, browser tab and Google News.</p>
        </div>
        <div>
          <label for="site-name-kh" class="mb-1 block text-sm font-medium">Site name (Khmer)</label>
          <input
            id="site-name-kh"
            v-model="site['site.name_kh']"
            type="text"
            maxlength="80"
            class="w-full rounded-lg border border-line px-3 py-2 text-kh-sm outline-none focus:border-brand"
          >
          <p class="mt-1 text-xs text-ink-muted">Shown to Khmer readers in the footer and titles.</p>
        </div>
      </div>

      <ImageField
        v-model="site['site.logo_url']"
        class="mt-5"
        label="Logo"
        folder="site"
        ratio="4 / 1"
        fit="contain"
        :max-size-mb="2"
        hint="PNG or SVG with a transparent background — a wide wordmark, or a square icon. Leave empty for the built-in mark beside the name."
      />

      <label :class="['mt-3 flex items-start gap-2.5 text-sm', site['site.logo_url'] ? '' : 'opacity-50']">
        <input
          v-model="logoShowName"
          type="checkbox"
          :disabled="!site['site.logo_url']"
          class="mt-0.5 rounded border-line"
        >
        <span>
          Write the site name beside the logo
          <span class="block text-xs text-ink-muted">
            For an icon-only logo. Leave off when the logo already contains the name.
          </span>
        </span>
      </label>

      <div class="mt-5 flex flex-wrap items-center gap-3">
        <button
          type="button"
          class="rounded-lg bg-brand px-4 py-2 text-sm font-semibold text-white hover:bg-brand-dark disabled:opacity-50"
          :disabled="savingSite"
          @click="saveSite('brand')"
        >{{ savingSite ? t('saving') : t('save') }}</button>
        <p
          v-if="siteNotice?.section === 'brand'"
          :class="['text-sm', siteNotice.ok ? 'text-success' : 'text-breaking']"
        >{{ siteNotice.text }}</p>
      </div>
    </section>

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

      <div class="mt-4 flex flex-wrap items-center gap-3">
        <button
          type="button"
          class="rounded-lg bg-brand px-4 py-2 text-sm font-semibold text-white hover:bg-brand-dark disabled:opacity-50"
          :disabled="savingSite"
          @click="saveSite('details')"
        >{{ savingSite ? t('saving') : t('save') }}</button>
        <p
          v-if="siteNotice?.section === 'details'"
          :class="['text-sm', siteNotice.ok ? 'text-success' : 'text-breaking']"
        >{{ siteNotice.text }}</p>
      </div>
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
