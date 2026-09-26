<script setup lang="ts">
import type { ApiMeta } from '~/types'
import type { UserRef } from '~/types/admin'

/**
 * Access control (§66, §67): who holds which role, and what each role can do.
 *
 * Two writes with deliberately different gates. Assigning a role to a person is
 * routine, so it needs users.manage. Editing what a role can *do* is the one
 * action that can hand out every other action, so it needs roles.manage — which
 * only Super Admin holds.
 *
 * Editing a role's permissions is its own route (/admin/roles/[id]) rather than
 * a panel here. A permission grid is long, it is worth a browser-history entry
 * and a link somebody can be sent, and mixing it into this page meant the list
 * you were comparing against scrolled away while you worked.
 *
 * The API enforces all of this again; nothing here is load-bearing for security.
 */
definePageMeta({ layout: 'admin', middleware: 'admin' })

const api = useAdminApi()
const auth = useAuthStore()
const { t } = useAdminLocale()
const { dateTime } = useFormat()

interface Role {
  id: number; slug: string; name: string; description: string
  isSystem: boolean; userCount: number
  permissions: string[]; holdsEverything: boolean
  permissionsCustomised: boolean
}
interface PermissionGroup {
  group: string
  entries: { name: string; description: string }[]
}

const roles = ref<Role[]>([])
const groups = ref<PermissionGroup[]>([])
const users = ref<UserRef[]>([])
const userMeta = ref<ApiMeta | null>(null)
const loading = ref(true)
const errorMessage = ref('')
const notice = ref('')
const search = ref('')
const tab = ref<'people' | 'roles'>('people')

const pendingDeactivate = ref<UserRef | null>(null)
const busy = ref(false)

const canEditRoles = computed(() => auth.can('roles.manage'))

const tabs = computed(() => [
  { key: 'people' as const, label: t('people') },
  { key: 'roles' as const, label: t('rolesAndPermissions') },
])

const roleOptions = computed(() =>
  roles.value.map(r => ({ value: r.slug, label: r.name, sub: t('holders', { n: r.userCount }) })),
)

async function load() {
  loading.value = true
  errorMessage.value = ''
  try {
    const [r, p, u] = await Promise.all([
      api.get<Role[]>('/api/admin/roles'),
      api.get<PermissionGroup[]>('/api/admin/permissions'),
      api.list<UserRef[]>('/api/admin/users', { limit: 100, search: search.value || undefined }),
    ])
    roles.value = r ?? []
    groups.value = p ?? []
    users.value = u.data ?? []
    userMeta.value = u.meta ?? null
  } catch (e: unknown) {
    errorMessage.value = (e as { data?: { message?: string } }).data?.message || t('rolesLoadFailed')
  } finally {
    loading.value = false
  }
}
onMounted(load)

// A role change made on the edit route comes back as a query flag, so the
// confirmation lands on the list the operator returns to.
const route = useRoute()
onMounted(() => {
  if (route.query.saved) {
    notice.value = String(route.query.saved)
    tab.value = 'roles'
  }
})

async function setRole(user: UserRef, roleSlug: string) {
  if (roleSlug === user.roleSlug) return
  errorMessage.value = ''
  notice.value = ''
  try {
    await api.put(`/api/admin/users/${user.id}/role`, { roleSlug })
    notice.value = `${user.name} → ${roles.value.find(r => r.slug === roleSlug)?.name ?? roleSlug}`
    await load()
  } catch (e: unknown) {
    // The API blocks removing the last Super Admin and granting Super Admin
    // from a lesser role — show its reason, not a generic failure.
    errorMessage.value = (e as { data?: { message?: string } }).data?.message || t('roleSaveFailed')
    await load()
  }
}

async function setActive(user: UserRef, isActive: boolean) {
  errorMessage.value = ''
  busy.value = true
  try {
    await api.put(`/api/admin/users/${user.id}/active`, { isActive })
    notice.value = `${user.name} — ${isActive ? t('activeSection') : t('deactivate')}`
    pendingDeactivate.value = null
    await load()
  } catch (e: unknown) {
    errorMessage.value = (e as { data?: { message?: string } }).data?.message || t('roleSaveFailed')
  } finally {
    busy.value = false
  }
}

function permissionCount(role: Role) {
  return role.holdsEverything
    ? t('holdsEverythingShort')
    : t('permissionsCount', { n: role.permissions.length })
}

useHead({ title: `${t('rolesAccess')} · CFN Admin` })
</script>

<template>
  <div>
    <h1 class="mb-1 text-xl font-bold">{{ t('rolesAccess') }}</h1>
    <p class="mb-4 max-w-prose text-sm text-ink-muted">{{ t('rolesIntro') }}</p>

    <div class="mb-4 flex gap-2">
      <button
        v-for="item in tabs"
        :key="item.key"
        type="button"
        :class="[
          'rounded-full border px-4 py-1.5 text-sm transition-colors',
          tab === item.key ? 'border-brand bg-brand text-white' : 'border-line hover:border-brand',
        ]"
        @click="tab = item.key"
      >{{ item.label }}</button>
    </div>

    <p v-if="notice" role="status" class="mb-4 rounded-lg bg-success/10 p-3 text-sm text-success">{{ notice }}</p>
    <p v-if="errorMessage" role="alert" class="mb-4 rounded-lg bg-breaking/10 p-3 text-sm text-breaking">{{ errorMessage }}</p>
    <p v-if="loading" class="py-12 text-center text-ink-muted">{{ t('loading') }}</p>

    <!-- ── People ────────────────────────────────────────────────────── -->
    <section v-else-if="tab === 'people'">
      <div class="mb-4 max-w-md">
        <SearchInput v-model="search" :placeholder="t('searchPeople')" :busy="loading" @search="load" @clear="load" />
      </div>

      <p v-if="!users.length" class="card p-8 text-center text-ink-muted">{{ t('noResults') }}</p>

      <div v-else class="card overflow-hidden">
        <ul class="divide-y divide-line">
          <li v-for="user in users" :key="user.id" class="flex flex-wrap items-center gap-3 p-4">
            <span class="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-brand/10 text-sm font-bold text-brand">
              {{ user.name.slice(0, 1) }}
            </span>

            <div class="min-w-0 flex-1">
              <p class="truncate text-sm font-semibold">
                {{ user.name }}
                <span v-if="user.id === auth.user?.id" class="ml-1 text-xs font-normal text-ink-muted">{{ t('you') }}</span>
              </p>
              <p class="truncate text-xs text-ink-muted">{{ user.email }}</p>
              <p class="text-xs text-ink-muted">
                {{ t('permissionsCount', { n: user.permissions.length }) }}
                <template v-if="user.lastLoginAt"> · {{ t('lastSignedIn') }} {{ dateTime(user.lastLoginAt) }}</template>
              </p>
            </div>

            <div class="w-52 shrink-0">
              <SearchableSelect
                :model-value="user.roleSlug"
                :options="roleOptions"
                :clearable="false"
                :searchable="false"
                :disabled="!auth.can('users.manage')"
                @update:model-value="setRole(user, String($event))"
              />
            </div>

            <button
              v-if="auth.can('users.manage') && user.id !== auth.user?.id"
              type="button"
              class="shrink-0 rounded border border-breaking px-2 py-1 text-xs text-breaking hover:bg-breaking/5"
              @click="pendingDeactivate = user"
            >{{ t('deactivate') }}</button>
          </li>
        </ul>
      </div>
    </section>

    <!-- ── Roles list ────────────────────────────────────────────────── -->
    <section v-else class="space-y-6">
      <p v-if="!canEditRoles" class="rounded-lg bg-surface-muted px-4 py-3 text-sm text-ink-muted">
        {{ t('rolesReadOnly') }}
      </p>

      <div class="card overflow-hidden">
        <ul class="divide-y divide-line">
          <li
            v-for="role in roles"
            :key="role.id"
            class="flex flex-wrap items-start gap-3 p-4 hover:bg-surface-muted"
          >
            <div class="min-w-0 flex-1">
              <p class="flex flex-wrap items-center gap-2 text-sm font-semibold">
                {{ role.name }}
                <code class="font-mono text-xs font-normal text-ink-muted">{{ role.slug }}</code>
                <span
                  v-if="role.permissionsCustomised"
                  class="rounded bg-warning/15 px-1.5 py-0.5 text-xs font-normal"
                  :title="t('customisedHint')"
                >{{ t('customised') }}</span>
              </p>
              <p class="mt-0.5 text-xs text-ink-muted">{{ role.description }}</p>
              <p class="mt-1 text-xs text-ink-muted">
                {{ permissionCount(role) }} · {{ t('holders', { n: role.userCount }) }}
              </p>
            </div>

            <!-- Super Admin is not linkable: its access is implicit, so the
                 edit route has nothing to show and the API refuses it. -->
            <NuxtLink
              v-if="canEditRoles && !role.holdsEverything"
              :to="`/admin/roles/${role.id}`"
              class="shrink-0 rounded-lg border border-line px-3 py-1.5 text-xs font-semibold hover:bg-surface"
            >{{ t('editPermissions') }}</NuxtLink>
            <span v-else-if="role.holdsEverything" class="shrink-0 text-xs text-ink-muted">
              {{ t('holdsEverythingShort') }}
            </span>
          </li>
        </ul>
      </div>

      <div class="card p-5">
        <h2 class="mb-3 font-bold">{{ t('permissionCatalogue') }}</h2>
        <div class="space-y-4">
          <div v-for="group in groups" :key="group.group">
            <p class="mb-1.5 text-xs font-bold uppercase tracking-wide text-ink-muted">{{ group.group }}</p>
            <ul class="divide-y divide-line">
              <li v-for="entry in group.entries" :key="entry.name" class="flex flex-wrap gap-x-3 py-1.5 text-sm">
                <code class="shrink-0 text-xs text-brand">{{ entry.name }}</code>
                <span class="text-ink-muted">{{ entry.description }}</span>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </section>

    <ConfirmDialog
      :open="!!pendingDeactivate"
      :title="t('deactivateTitle')"
      :message="pendingDeactivate ? `${pendingDeactivate.name} (${pendingDeactivate.email})` : ''"
      :consequences="[t('deactivateSignedOut'), t('deactivateBylines'), t('deactivateReversible')]"
      :confirm-label="t('deactivate')"
      :cancel-label="t('cancel')"
      :busy="busy"
      @confirm="pendingDeactivate && setActive(pendingDeactivate, false)"
      @cancel="pendingDeactivate = null"
    />
  </div>
</template>
