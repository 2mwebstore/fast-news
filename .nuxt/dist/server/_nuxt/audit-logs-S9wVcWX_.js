import { _ as _sfc_main$1 } from "./SelectField-vCKw5R9_.js";
import { f as useRoute, i as useRouter, j as useHead, _ as __nuxt_component_0 } from "../server.mjs";
import { _ as __nuxt_component_2 } from "./ConfirmDialog-BxaeJdx9.js";
import { defineComponent, computed, ref, watch, unref, withCtx, createVNode, toDisplayString, useSSRContext } from "vue";
import { ssrRenderAttrs, ssrInterpolate, ssrRenderList, ssrIncludeBooleanAttr, ssrRenderComponent, ssrRenderAttr, ssrRenderClass } from "vue/server-renderer";
import "/Users/sila/Desktop/fast-news/web/node_modules/hookable/dist/index.mjs";
import { u as useAdminLocale } from "./useAdminLocale-ThlnF2qj.js";
import { u as useAdminApi, a as useAuthStore } from "./useAdminApi-SsuwQDOr.js";
import { u as useFormat } from "./useFormat-DT1zbtWM.js";
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
import "./index-C4JB2zdt.js";
import "./_plugin-vue_export-helper-1tPrXgE0.js";
const _sfc_main = /* @__PURE__ */ defineComponent({
  __name: "audit-logs",
  __ssrInlineRender: true,
  setup(__props) {
    const { t } = useAdminLocale();
    const api = useAdminApi();
    const { dateTime } = useFormat();
    const auth = useAuthStore();
    const route = useRoute();
    const router = useRouter();
    const page = computed(() => Math.max(1, Number(route.query.page) || 1));
    const limit = computed(() => {
      const value = Number(route.query.limit) || 50;
      return [25, 50, 100].includes(value) ? value : 50;
    });
    const limitOptions = [25, 50, 100].map((n) => ({ value: n, label: String(n) }));
    const meta = ref(null);
    const entries = ref([]);
    const retention = ref(null);
    const loading = ref(true);
    const purging = ref(false);
    const notice = ref("");
    const errorMessage = ref("");
    const pending = ref(null);
    const canPurge = computed(() => auth.can("roles.manage"));
    async function load() {
      loading.value = true;
      try {
        const [result, stats] = await Promise.all([
          api.list("/api/admin/audit-logs", { page: page.value, limit: limit.value }),
          api.get("/api/admin/audit-logs/retention").catch(() => null)
        ]);
        entries.value = result.data ?? [];
        meta.value = result.meta ?? null;
        retention.value = stats;
      } finally {
        loading.value = false;
      }
    }
    watch([page, limit], load);
    const pageNumbers = computed(() => {
      if (!meta.value) return [];
      const { page: current, totalPages } = meta.value;
      const start = Math.max(1, current - 2);
      const end = Math.min(totalPages, current + 2);
      return Array.from({ length: end - start + 1 }, (_, i) => start + i);
    });
    function linkTo(target) {
      return {
        path: "/admin/audit-logs",
        query: {
          ...route.query,
          page: target === 1 ? void 0 : target,
          limit: limit.value === 50 ? void 0 : limit.value
        }
      };
    }
    function setLimit(next) {
      router.push({ path: "/admin/audit-logs", query: { ...route.query, limit: Number(next), page: void 0 } });
    }
    async function purge() {
      const window = pending.value;
      if (!window) return;
      purging.value = true;
      errorMessage.value = "";
      try {
        const result = await api.del(
          `/api/admin/audit-logs?months=${window.months}`
        );
        notice.value = t("purgeDone", { n: result.removed });
        pending.value = null;
        if (page.value > 1) {
          await router.push(linkTo(1));
        } else {
          await load();
        }
      } catch (e) {
        errorMessage.value = e.data?.message || t("purgeFailed");
        pending.value = null;
      } finally {
        purging.value = false;
      }
    }
    useHead({ title: "Audit log — Newsroom" });
    return (_ctx, _push, _parent, _attrs) => {
      const _component_SelectField = _sfc_main$1;
      const _component_NuxtLink = __nuxt_component_0;
      const _component_ConfirmDialog = __nuxt_component_2;
      _push(`<div${ssrRenderAttrs(_attrs)}><h1 class="mb-4 text-xl font-bold">${ssrInterpolate(unref(t)("auditLogTitle"))}</h1>`);
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
      if (unref(canPurge) && unref(retention)) {
        _push(`<section class="card mb-6 p-5"><h2 class="mb-1 font-bold">${ssrInterpolate(unref(t)("retention"))}</h2><p class="mb-3 max-w-2xl text-sm text-ink-muted">${ssrInterpolate(unref(t)("retentionIntro"))}</p><p class="mb-3 text-xs text-ink-muted">${ssrInterpolate(unref(t)("entriesTotal", { n: unref(retention).total }))} `);
        if (unref(retention).oldest) {
          _push(`<!--[--> · ${ssrInterpolate(unref(t)("oldestEntry"))} ${ssrInterpolate(unref(dateTime)(unref(retention).oldest))}<!--]-->`);
        } else {
          _push(`<!---->`);
        }
        _push(`</p><div class="flex flex-wrap gap-2"><!--[-->`);
        ssrRenderList(unref(retention).windows, (w) => {
          _push(`<button type="button" class="rounded-lg border border-line px-3 py-2 text-left text-sm hover:border-brand disabled:opacity-40"${ssrIncludeBooleanAttr(unref(purging) || w.removable === 0) ? " disabled" : ""}><span class="block font-semibold">${ssrInterpolate(w.label)}</span><span class="block text-xs text-ink-muted">${ssrInterpolate(w.removable > 0 ? unref(t)("wouldRemove", { n: w.removable }) : unref(t)("purgeNothing"))}</span></button>`);
        });
        _push(`<!--]--></div></section>`);
      } else {
        _push(`<!---->`);
      }
      if (unref(meta)) {
        _push(`<div class="mb-3 flex flex-wrap items-center justify-between gap-3"><p class="text-sm text-ink-muted">${ssrInterpolate(unref(t)("showing", { shown: unref(entries).length, total: unref(meta).total }))} `);
        if (unref(meta).totalPages > 1) {
          _push(`<span>· ${ssrInterpolate(unref(t)("pageOf", { page: unref(meta).page, total: unref(meta).totalPages }))}</span>`);
        } else {
          _push(`<!---->`);
        }
        _push(`</p>`);
        _push(ssrRenderComponent(_component_SelectField, {
          "model-value": unref(limit),
          options: unref(limitOptions),
          label: unref(t)("perPage"),
          inline: "",
          size: "sm",
          "onUpdate:modelValue": ($event) => setLimit($event)
        }, null, _parent));
        _push(`</div>`);
      } else {
        _push(`<!---->`);
      }
      if (unref(loading)) {
        _push(`<p class="py-12 text-center text-ink-muted">${ssrInterpolate(unref(t)("loading"))}</p>`);
      } else if (!unref(entries).length) {
        _push(`<p class="card py-12 text-center text-ink-muted">${ssrInterpolate(unref(t)("noAuditEntries"))}</p>`);
      } else {
        _push(`<div class="card overflow-x-auto"><table class="w-full text-sm"><thead class="border-b border-line bg-surface-muted text-left text-xs uppercase text-ink-muted"><tr><th class="px-4 py-2">${ssrInterpolate(unref(t)("colTime"))}</th><th class="px-4 py-2">${ssrInterpolate(unref(t)("colUser"))}</th><th class="px-4 py-2">${ssrInterpolate(unref(t)("colAction"))}</th><th class="px-4 py-2">${ssrInterpolate(unref(t)("colDetails"))}</th></tr></thead><tbody class="divide-y divide-line"><!--[-->`);
        ssrRenderList(unref(entries), (entry) => {
          _push(`<tr><td class="whitespace-nowrap px-4 py-2 text-xs text-ink-muted">${ssrInterpolate(unref(dateTime)(entry.createdAt))}</td><td class="px-4 py-2 text-xs">${ssrInterpolate(entry.userEmail || "—")}</td><td class="px-4 py-2"><code class="text-xs">${ssrInterpolate(entry.action)}</code></td><td class="max-w-md truncate px-4 py-2 text-kh-sm"${ssrRenderAttr("title", entry.summary)}>${ssrInterpolate(entry.summary)}</td></tr>`);
        });
        _push(`<!--]--></tbody></table></div>`);
      }
      if (unref(meta) && unref(meta).totalPages > 1) {
        _push(`<nav class="mt-6 flex flex-wrap items-center justify-center gap-1"${ssrRenderAttr("aria-label", unref(t)("pagination"))}>`);
        if (unref(meta).page > 1) {
          _push(ssrRenderComponent(_component_NuxtLink, {
            to: linkTo(unref(meta).page - 1),
            custom: ""
          }, {
            default: withCtx(({ href, navigate }, _push2, _parent2, _scopeId) => {
              if (_push2) {
                _push2(`<a${ssrRenderAttr("href", href ?? void 0)} class="rounded-lg border border-line px-3 py-1.5 text-sm font-semibold hover:border-brand"${_scopeId}>← ${ssrInterpolate(unref(t)("previous"))}</a>`);
              } else {
                return [
                  createVNode("a", {
                    href: href ?? void 0,
                    class: "rounded-lg border border-line px-3 py-1.5 text-sm font-semibold hover:border-brand",
                    onClick: navigate
                  }, "← " + toDisplayString(unref(t)("previous")), 9, ["href", "onClick"])
                ];
              }
            }),
            _: 1
          }, _parent));
        } else {
          _push(`<!---->`);
        }
        if (unref(pageNumbers)[0] > 1) {
          _push(ssrRenderComponent(_component_NuxtLink, {
            to: linkTo(1),
            custom: ""
          }, {
            default: withCtx(({ href, navigate }, _push2, _parent2, _scopeId) => {
              if (_push2) {
                _push2(`<a${ssrRenderAttr("href", href ?? void 0)} class="rounded px-3 py-1.5 text-sm hover:bg-surface-muted"${_scopeId}>1</a>`);
              } else {
                return [
                  createVNode("a", {
                    href: href ?? void 0,
                    class: "rounded px-3 py-1.5 text-sm hover:bg-surface-muted",
                    onClick: navigate
                  }, "1", 8, ["href", "onClick"])
                ];
              }
            }),
            _: 1
          }, _parent));
        } else {
          _push(`<!---->`);
        }
        if (unref(pageNumbers)[0] > 2) {
          _push(`<span class="px-1 text-sm text-ink-muted">…</span>`);
        } else {
          _push(`<!---->`);
        }
        _push(`<!--[-->`);
        ssrRenderList(unref(pageNumbers), (n) => {
          _push(ssrRenderComponent(_component_NuxtLink, {
            key: n,
            to: linkTo(n),
            custom: ""
          }, {
            default: withCtx(({ href, navigate }, _push2, _parent2, _scopeId) => {
              if (_push2) {
                _push2(`<a${ssrRenderAttr("href", href ?? void 0)} class="${ssrRenderClass([
                  "rounded px-3 py-1.5 text-sm tabular-nums",
                  n === unref(meta).page ? "bg-brand font-semibold text-white" : "hover:bg-surface-muted"
                ])}"${ssrRenderAttr("aria-current", n === unref(meta).page ? "page" : void 0)}${_scopeId}>${ssrInterpolate(n)}</a>`);
              } else {
                return [
                  createVNode("a", {
                    href: href ?? void 0,
                    class: [
                      "rounded px-3 py-1.5 text-sm tabular-nums",
                      n === unref(meta).page ? "bg-brand font-semibold text-white" : "hover:bg-surface-muted"
                    ],
                    "aria-current": n === unref(meta).page ? "page" : void 0,
                    onClick: navigate
                  }, toDisplayString(n), 11, ["href", "aria-current", "onClick"])
                ];
              }
            }),
            _: 2
          }, _parent));
        });
        _push(`<!--]-->`);
        if (unref(pageNumbers)[unref(pageNumbers).length - 1] < unref(meta).totalPages - 1) {
          _push(`<span class="px-1 text-sm text-ink-muted">…</span>`);
        } else {
          _push(`<!---->`);
        }
        if (unref(pageNumbers)[unref(pageNumbers).length - 1] < unref(meta).totalPages) {
          _push(ssrRenderComponent(_component_NuxtLink, {
            to: linkTo(unref(meta).totalPages),
            custom: ""
          }, {
            default: withCtx(({ href, navigate }, _push2, _parent2, _scopeId) => {
              if (_push2) {
                _push2(`<a${ssrRenderAttr("href", href ?? void 0)} class="rounded px-3 py-1.5 text-sm hover:bg-surface-muted"${_scopeId}>${ssrInterpolate(unref(meta).totalPages)}</a>`);
              } else {
                return [
                  createVNode("a", {
                    href: href ?? void 0,
                    class: "rounded px-3 py-1.5 text-sm hover:bg-surface-muted",
                    onClick: navigate
                  }, toDisplayString(unref(meta).totalPages), 9, ["href", "onClick"])
                ];
              }
            }),
            _: 1
          }, _parent));
        } else {
          _push(`<!---->`);
        }
        if (unref(meta).hasMore) {
          _push(ssrRenderComponent(_component_NuxtLink, {
            to: linkTo(unref(meta).page + 1),
            custom: ""
          }, {
            default: withCtx(({ href, navigate }, _push2, _parent2, _scopeId) => {
              if (_push2) {
                _push2(`<a${ssrRenderAttr("href", href ?? void 0)} class="rounded-lg border border-line px-3 py-1.5 text-sm font-semibold hover:border-brand"${_scopeId}>${ssrInterpolate(unref(t)("next"))} →</a>`);
              } else {
                return [
                  createVNode("a", {
                    href: href ?? void 0,
                    class: "rounded-lg border border-line px-3 py-1.5 text-sm font-semibold hover:border-brand",
                    onClick: navigate
                  }, toDisplayString(unref(t)("next")) + " →", 9, ["href", "onClick"])
                ];
              }
            }),
            _: 1
          }, _parent));
        } else {
          _push(`<!---->`);
        }
        _push(`</nav>`);
      } else {
        _push(`<!---->`);
      }
      _push(ssrRenderComponent(_component_ConfirmDialog, {
        open: !!unref(pending),
        title: unref(t)("purgeTitle"),
        message: unref(pending) ? unref(t)("purgeMessage", { months: unref(pending).months, n: unref(pending).removable }) : "",
        "confirm-label": unref(t)("purge"),
        "cancel-label": unref(t)("cancel"),
        busy: unref(purging),
        onConfirm: purge,
        onCancel: ($event) => pending.value = null
      }, null, _parent));
      _push(`</div>`);
    };
  }
});
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("pages/admin/audit-logs.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
export {
  _sfc_main as default
};
//# sourceMappingURL=audit-logs-S9wVcWX_.js.map
