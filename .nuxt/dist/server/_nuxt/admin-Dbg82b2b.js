import { f as useRoute, _ as __nuxt_component_0, l as _sfc_main$1 } from "../server.mjs";
import { defineComponent, ref, computed, watch, mergeProps, unref, withCtx, createVNode, toDisplayString, createTextVNode, useSSRContext } from "vue";
import { ssrRenderAttrs, ssrRenderClass, ssrRenderComponent, ssrInterpolate, ssrRenderList, ssrRenderAttr, ssrRenderSlot } from "vue/server-renderer";
import { a as useAuthStore } from "./useAdminApi-SsuwQDOr.js";
import { u as useAdminLocale } from "./useAdminLocale-ThlnF2qj.js";
import "/Users/sila/Desktop/fast-news/web/node_modules/ofetch/dist/node.mjs";
import "#internal/nuxt/paths";
import "/Users/sila/Desktop/fast-news/web/node_modules/hookable/dist/index.mjs";
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
  __name: "admin",
  __ssrInlineRender: true,
  setup(__props) {
    const auth = useAuthStore();
    const route = useRoute();
    const { locale, t } = useAdminLocale();
    const sidebarOpen = ref(false);
    const sections = computed(() => [
      { path: "/admin", label: t("dashboard"), icon: "◧", permission: null },
      { path: "/admin/news", label: t("articles"), icon: "📰", permission: "news.view" },
      { path: "/admin/news/create", label: t("write"), icon: "✎", permission: "news.create" },
      { path: "/admin/review", label: t("reviewQueue"), icon: "☑", permission: "news.review" },
      { path: "/admin/videos", label: t("videos"), icon: "▶", permission: "video.manage" },
      { path: "/admin/categories", label: t("sections"), icon: "⊞", permission: "categories.manage" },
      { path: "/admin/pages", label: t("pagesNav"), icon: "▤", permission: "pages.manage" },
      { path: "/admin/ai-news", label: t("aiAssistant"), icon: "✦", permission: "ai.use" },
      { path: "/admin/media", label: t("media"), icon: "🖼", permission: "media.upload" },
      { path: "/admin/ads", label: t("advertising"), icon: "◈", permission: "ads.view" },
      { path: "/admin/seo", label: t("seoHealth"), icon: "◎", permission: "seo.manage" },
      { path: "/admin/roles", label: t("rolesAccess"), icon: "⚿", permission: "users.manage" },
      { path: "/admin/settings", label: t("settings"), icon: "⚙", permission: "settings.manage" },
      { path: "/admin/tips", label: t("tips"), icon: "✉", permission: "tips.review" },
      { path: "/admin/analytics", label: t("analytics"), icon: "◑", permission: "analytics.view" },
      { path: "/admin/audit-logs", label: t("auditLog"), icon: "⧉", permission: "users.manage" }
    ].filter((s) => !s.permission || auth.can(s.permission)));
    function isActive(path) {
      return path === "/admin" ? route.path === "/admin" : route.path.startsWith(path);
    }
    watch(() => route.fullPath, () => {
      sidebarOpen.value = false;
    });
    return (_ctx, _push, _parent, _attrs) => {
      const _component_NuxtLink = __nuxt_component_0;
      const _component_TheLogo = _sfc_main$1;
      _push(`<div${ssrRenderAttrs(mergeProps({ class: "flex min-h-screen bg-surface-muted" }, _attrs))}><aside class="${ssrRenderClass([
        "fixed inset-y-0 left-0 z-40 w-64 shrink-0 overflow-y-auto border-r border-line bg-surface transition-transform lg:static lg:translate-x-0",
        unref(sidebarOpen) ? "translate-x-0" : "-translate-x-full"
      ])}"><div class="border-b border-line p-4">`);
      _push(ssrRenderComponent(_component_NuxtLink, { to: "/admin" }, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(ssrRenderComponent(_component_TheLogo, { class: "h-8 w-auto" }, null, _parent2, _scopeId));
          } else {
            return [
              createVNode(_component_TheLogo, { class: "h-8 w-auto" })
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(`<p class="mt-1 text-[10px] uppercase tracking-widest text-ink-muted">${ssrInterpolate(unref(t)("newsroom"))}</p></div><nav class="p-2" aria-label="Admin sections"><ul class="space-y-0.5"><!--[-->`);
      ssrRenderList(unref(sections), (section) => {
        _push(`<li>`);
        _push(ssrRenderComponent(_component_NuxtLink, {
          to: section.path,
          class: [
            "flex items-center gap-2.5 rounded-lg px-3 py-2 text-kh-sm font-medium transition-colors",
            isActive(section.path) ? "bg-brand text-white" : "text-ink hover:bg-surface-muted"
          ]
        }, {
          default: withCtx((_, _push2, _parent2, _scopeId) => {
            if (_push2) {
              _push2(`<span class="w-4 text-center" aria-hidden="true"${_scopeId}>${ssrInterpolate(section.icon)}</span> ${ssrInterpolate(section.label)}`);
            } else {
              return [
                createVNode("span", {
                  class: "w-4 text-center",
                  "aria-hidden": "true"
                }, toDisplayString(section.icon), 1),
                createTextVNode(" " + toDisplayString(section.label), 1)
              ];
            }
          }),
          _: 2
        }, _parent));
        _push(`</li>`);
      });
      _push(`<!--]--></ul></nav><div class="mt-auto border-t border-line p-4"><p class="truncate text-sm font-semibold">${ssrInterpolate(unref(auth).user?.name)}</p><p class="truncate text-xs text-ink-muted">${ssrInterpolate(unref(auth).user?.roleName)}</p><div class="mt-3 flex items-center overflow-hidden rounded border border-line text-xs font-semibold" role="group"${ssrRenderAttr("aria-label", unref(t)("language"))}><button type="button" class="${ssrRenderClass(["flex-1 px-2 py-1.5 transition-colors", unref(locale) === "en" ? "bg-brand text-white" : "text-ink-muted hover:bg-surface-muted"])}"${ssrRenderAttr("aria-pressed", unref(locale) === "en")}>EN</button><button type="button" class="${ssrRenderClass(["flex-1 px-2 py-1.5 transition-colors", unref(locale) === "km" ? "bg-brand text-white" : "text-ink-muted hover:bg-surface-muted"])}"${ssrRenderAttr("aria-pressed", unref(locale) === "km")}>ខ្មែរ</button></div><div class="mt-2 flex gap-2">`);
      _push(ssrRenderComponent(_component_NuxtLink, {
        to: "/",
        target: "_blank",
        class: "flex-1 rounded border border-line px-2 py-1.5 text-center text-xs hover:bg-surface-muted"
      }, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(`${ssrInterpolate(unref(t)("viewSite"))}`);
          } else {
            return [
              createTextVNode(toDisplayString(unref(t)("viewSite")), 1)
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(`<button class="rounded border border-line px-2 py-1.5 text-xs hover:bg-surface-muted">${ssrInterpolate(unref(t)("signOut"))}</button></div></div></aside>`);
      if (unref(sidebarOpen)) {
        _push(`<div class="fixed inset-0 z-30 bg-ink/40 lg:hidden"></div>`);
      } else {
        _push(`<!---->`);
      }
      _push(`<div class="flex min-w-0 flex-1 flex-col"><header class="flex h-14 items-center gap-3 border-b border-line bg-surface px-4 lg:hidden"><button class="rounded p-2 hover:bg-surface-muted" aria-label="Menu"><svg class="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><path d="M3 6h18M3 12h18M3 18h18" stroke-linecap="round"></path></svg></button>`);
      _push(ssrRenderComponent(_component_TheLogo, { class: "h-7 w-auto" }, null, _parent));
      _push(`</header><main class="flex-1 p-4 lg:p-6">`);
      ssrRenderSlot(_ctx.$slots, "default", {}, null, _push, _parent);
      _push(`</main></div></div>`);
    };
  }
});
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("layouts/admin.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
export {
  _sfc_main as default
};
//# sourceMappingURL=admin-Dbg82b2b.js.map
