import { _ as _sfc_main$1 } from "./SearchInput-BSakqtC5.js";
import { _ as __nuxt_component_0 } from "./SearchableSelect-BQHPC7-8.js";
import { f as useRoute, j as useHead, _ as __nuxt_component_0$1 } from "../server.mjs";
import { _ as __nuxt_component_2 } from "./ConfirmDialog-BxaeJdx9.js";
import { defineComponent, ref, computed, unref, isRef, withCtx, createTextVNode, toDisplayString, useSSRContext } from "vue";
import { ssrRenderAttrs, ssrInterpolate, ssrRenderList, ssrRenderClass, ssrRenderComponent, ssrRenderAttr } from "vue/server-renderer";
import "/Users/sila/Desktop/fast-news/web/node_modules/hookable/dist/index.mjs";
import { u as useAdminApi, a as useAuthStore } from "./useAdminApi-SsuwQDOr.js";
import { u as useAdminLocale } from "./useAdminLocale-ThlnF2qj.js";
import { u as useFormat } from "./useFormat-DT1zbtWM.js";
import "./index-C4JB2zdt.js";
import "./_plugin-vue_export-helper-1tPrXgE0.js";
import "/Users/sila/Desktop/fast-news/web/node_modules/ofetch/dist/node.mjs";
import "#internal/nuxt/paths";
import "/Users/sila/Desktop/fast-news/web/node_modules/unctx/dist/index.mjs";
import "/Users/sila/Desktop/fast-news/web/node_modules/h3/dist/index.mjs";
import "pinia";
import "/Users/sila/Desktop/fast-news/web/node_modules/defu/dist/defu.mjs";
import "vue-router";
import "/Users/sila/Desktop/fast-news/web/node_modules/ufo/dist/index.mjs";
import "/Users/sila/Desktop/fast-news/web/node_modules/klona/dist/index.mjs";
import "/Users/sila/Desktop/fast-news/web/node_modules/@unhead/vue/dist/index.mjs";
import "/Users/sila/Desktop/fast-news/web/node_modules/perfect-debounce/dist/index.mjs";
import "/Users/sila/Desktop/fast-news/web/node_modules/nuxt/node_modules/cookie-es/dist/index.mjs";
import "/Users/sila/Desktop/fast-news/web/node_modules/destr/dist/index.mjs";
import "/Users/sila/Desktop/fast-news/web/node_modules/ohash/dist/index.mjs";
const _sfc_main = /* @__PURE__ */ defineComponent({
  __name: "index",
  __ssrInlineRender: true,
  setup(__props) {
    const api = useAdminApi();
    const auth = useAuthStore();
    const { t } = useAdminLocale();
    const { dateTime } = useFormat();
    const roles = ref([]);
    const groups = ref([]);
    const users = ref([]);
    const userMeta = ref(null);
    const loading = ref(true);
    const errorMessage = ref("");
    const notice = ref("");
    const search = ref("");
    const tab = ref("people");
    const pendingDeactivate = ref(null);
    const busy = ref(false);
    const canEditRoles = computed(() => auth.can("roles.manage"));
    const tabs = computed(() => [
      { key: "people", label: t("people") },
      { key: "roles", label: t("rolesAndPermissions") }
    ]);
    const roleOptions = computed(
      () => roles.value.map((r) => ({ value: r.slug, label: r.name, sub: t("holders", { n: r.userCount }) }))
    );
    async function load() {
      loading.value = true;
      errorMessage.value = "";
      try {
        const [r, p, u] = await Promise.all([
          api.get("/api/admin/roles"),
          api.get("/api/admin/permissions"),
          api.list("/api/admin/users", { limit: 100, search: search.value || void 0 })
        ]);
        roles.value = r ?? [];
        groups.value = p ?? [];
        users.value = u.data ?? [];
        userMeta.value = u.meta ?? null;
      } catch (e) {
        errorMessage.value = e.data?.message || t("rolesLoadFailed");
      } finally {
        loading.value = false;
      }
    }
    useRoute();
    async function setRole(user, roleSlug) {
      if (roleSlug === user.roleSlug) return;
      errorMessage.value = "";
      notice.value = "";
      try {
        await api.put(`/api/admin/users/${user.id}/role`, { roleSlug });
        notice.value = `${user.name} → ${roles.value.find((r) => r.slug === roleSlug)?.name ?? roleSlug}`;
        await load();
      } catch (e) {
        errorMessage.value = e.data?.message || t("roleSaveFailed");
        await load();
      }
    }
    async function setActive(user, isActive) {
      errorMessage.value = "";
      busy.value = true;
      try {
        await api.put(`/api/admin/users/${user.id}/active`, { isActive });
        notice.value = `${user.name} — ${isActive ? t("activeSection") : t("deactivate")}`;
        pendingDeactivate.value = null;
        await load();
      } catch (e) {
        errorMessage.value = e.data?.message || t("roleSaveFailed");
      } finally {
        busy.value = false;
      }
    }
    function permissionCount(role) {
      return role.holdsEverything ? t("holdsEverythingShort") : t("permissionsCount", { n: role.permissions.length });
    }
    useHead({ title: `${t("rolesAccess")} · CFN Admin` });
    return (_ctx, _push, _parent, _attrs) => {
      const _component_SearchInput = _sfc_main$1;
      const _component_SearchableSelect = __nuxt_component_0;
      const _component_NuxtLink = __nuxt_component_0$1;
      const _component_ConfirmDialog = __nuxt_component_2;
      _push(`<div${ssrRenderAttrs(_attrs)}><h1 class="mb-1 text-xl font-bold">${ssrInterpolate(unref(t)("rolesAccess"))}</h1><p class="mb-4 max-w-prose text-sm text-ink-muted">${ssrInterpolate(unref(t)("rolesIntro"))}</p><div class="mb-4 flex gap-2"><!--[-->`);
      ssrRenderList(unref(tabs), (item) => {
        _push(`<button type="button" class="${ssrRenderClass([
          "rounded-full border px-4 py-1.5 text-sm transition-colors",
          unref(tab) === item.key ? "border-brand bg-brand text-white" : "border-line hover:border-brand"
        ])}">${ssrInterpolate(item.label)}</button>`);
      });
      _push(`<!--]--></div>`);
      if (unref(notice)) {
        _push(`<p role="status" class="mb-4 rounded-lg bg-success/10 p-3 text-sm text-success">${ssrInterpolate(unref(notice))}</p>`);
      } else {
        _push(`<!---->`);
      }
      if (unref(errorMessage)) {
        _push(`<p role="alert" class="mb-4 rounded-lg bg-breaking/10 p-3 text-sm text-breaking">${ssrInterpolate(unref(errorMessage))}</p>`);
      } else {
        _push(`<!---->`);
      }
      if (unref(loading)) {
        _push(`<p class="py-12 text-center text-ink-muted">${ssrInterpolate(unref(t)("loading"))}</p>`);
      } else if (unref(tab) === "people") {
        _push(`<section><div class="mb-4 max-w-md">`);
        _push(ssrRenderComponent(_component_SearchInput, {
          modelValue: unref(search),
          "onUpdate:modelValue": ($event) => isRef(search) ? search.value = $event : null,
          placeholder: unref(t)("searchPeople"),
          busy: unref(loading),
          onSearch: load,
          onClear: load
        }, null, _parent));
        _push(`</div>`);
        if (!unref(users).length) {
          _push(`<p class="card p-8 text-center text-ink-muted">${ssrInterpolate(unref(t)("noResults"))}</p>`);
        } else {
          _push(`<div class="card overflow-hidden"><ul class="divide-y divide-line"><!--[-->`);
          ssrRenderList(unref(users), (user) => {
            _push(`<li class="flex flex-wrap items-center gap-3 p-4"><span class="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-brand/10 text-sm font-bold text-brand">${ssrInterpolate(user.name.slice(0, 1))}</span><div class="min-w-0 flex-1"><p class="truncate text-sm font-semibold">${ssrInterpolate(user.name)} `);
            if (user.id === unref(auth).user?.id) {
              _push(`<span class="ml-1 text-xs font-normal text-ink-muted">${ssrInterpolate(unref(t)("you"))}</span>`);
            } else {
              _push(`<!---->`);
            }
            _push(`</p><p class="truncate text-xs text-ink-muted">${ssrInterpolate(user.email)}</p><p class="text-xs text-ink-muted">${ssrInterpolate(unref(t)("permissionsCount", { n: user.permissions.length }))} `);
            if (user.lastLoginAt) {
              _push(`<!--[--> · ${ssrInterpolate(unref(t)("lastSignedIn"))} ${ssrInterpolate(unref(dateTime)(user.lastLoginAt))}<!--]-->`);
            } else {
              _push(`<!---->`);
            }
            _push(`</p></div><div class="w-52 shrink-0">`);
            _push(ssrRenderComponent(_component_SearchableSelect, {
              "model-value": user.roleSlug,
              options: unref(roleOptions),
              clearable: false,
              searchable: false,
              disabled: !unref(auth).can("users.manage"),
              "onUpdate:modelValue": ($event) => setRole(user, String($event))
            }, null, _parent));
            _push(`</div>`);
            if (unref(auth).can("users.manage") && user.id !== unref(auth).user?.id) {
              _push(`<button type="button" class="shrink-0 rounded border border-breaking px-2 py-1 text-xs text-breaking hover:bg-breaking/5">${ssrInterpolate(unref(t)("deactivate"))}</button>`);
            } else {
              _push(`<!---->`);
            }
            _push(`</li>`);
          });
          _push(`<!--]--></ul></div>`);
        }
        _push(`</section>`);
      } else {
        _push(`<section class="space-y-6">`);
        if (!unref(canEditRoles)) {
          _push(`<p class="rounded-lg bg-surface-muted px-4 py-3 text-sm text-ink-muted">${ssrInterpolate(unref(t)("rolesReadOnly"))}</p>`);
        } else {
          _push(`<!---->`);
        }
        _push(`<div class="card overflow-hidden"><ul class="divide-y divide-line"><!--[-->`);
        ssrRenderList(unref(roles), (role) => {
          _push(`<li class="flex flex-wrap items-start gap-3 p-4 hover:bg-surface-muted"><div class="min-w-0 flex-1"><p class="flex flex-wrap items-center gap-2 text-sm font-semibold">${ssrInterpolate(role.name)} <code class="font-mono text-xs font-normal text-ink-muted">${ssrInterpolate(role.slug)}</code>`);
          if (role.permissionsCustomised) {
            _push(`<span class="rounded bg-warning/15 px-1.5 py-0.5 text-xs font-normal"${ssrRenderAttr("title", unref(t)("customisedHint"))}>${ssrInterpolate(unref(t)("customised"))}</span>`);
          } else {
            _push(`<!---->`);
          }
          _push(`</p><p class="mt-0.5 text-xs text-ink-muted">${ssrInterpolate(role.description)}</p><p class="mt-1 text-xs text-ink-muted">${ssrInterpolate(permissionCount(role))} · ${ssrInterpolate(unref(t)("holders", { n: role.userCount }))}</p></div>`);
          if (unref(canEditRoles) && !role.holdsEverything) {
            _push(ssrRenderComponent(_component_NuxtLink, {
              to: `/admin/roles/${role.id}`,
              class: "shrink-0 rounded-lg border border-line px-3 py-1.5 text-xs font-semibold hover:bg-surface"
            }, {
              default: withCtx((_, _push2, _parent2, _scopeId) => {
                if (_push2) {
                  _push2(`${ssrInterpolate(unref(t)("editPermissions"))}`);
                } else {
                  return [
                    createTextVNode(toDisplayString(unref(t)("editPermissions")), 1)
                  ];
                }
              }),
              _: 2
            }, _parent));
          } else if (role.holdsEverything) {
            _push(`<span class="shrink-0 text-xs text-ink-muted">${ssrInterpolate(unref(t)("holdsEverythingShort"))}</span>`);
          } else {
            _push(`<!---->`);
          }
          _push(`</li>`);
        });
        _push(`<!--]--></ul></div><div class="card p-5"><h2 class="mb-3 font-bold">${ssrInterpolate(unref(t)("permissionCatalogue"))}</h2><div class="space-y-4"><!--[-->`);
        ssrRenderList(unref(groups), (group) => {
          _push(`<div><p class="mb-1.5 text-xs font-bold uppercase tracking-wide text-ink-muted">${ssrInterpolate(group.group)}</p><ul class="divide-y divide-line"><!--[-->`);
          ssrRenderList(group.entries, (entry) => {
            _push(`<li class="flex flex-wrap gap-x-3 py-1.5 text-sm"><code class="shrink-0 text-xs text-brand">${ssrInterpolate(entry.name)}</code><span class="text-ink-muted">${ssrInterpolate(entry.description)}</span></li>`);
          });
          _push(`<!--]--></ul></div>`);
        });
        _push(`<!--]--></div></div></section>`);
      }
      _push(ssrRenderComponent(_component_ConfirmDialog, {
        open: !!unref(pendingDeactivate),
        title: unref(t)("deactivateTitle"),
        message: unref(pendingDeactivate) ? `${unref(pendingDeactivate).name} (${unref(pendingDeactivate).email})` : "",
        consequences: [unref(t)("deactivateSignedOut"), unref(t)("deactivateBylines"), unref(t)("deactivateReversible")],
        "confirm-label": unref(t)("deactivate"),
        "cancel-label": unref(t)("cancel"),
        busy: unref(busy),
        onConfirm: ($event) => unref(pendingDeactivate) && setActive(unref(pendingDeactivate), false),
        onCancel: ($event) => pendingDeactivate.value = null
      }, null, _parent));
      _push(`</div>`);
    };
  }
});
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("pages/admin/roles/index.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
export {
  _sfc_main as default
};
//# sourceMappingURL=index-CQ7CIhhW.js.map
