import { f as useRoute, j as useHead, _ as __nuxt_component_0$1 } from './server.mjs';
import { _ as __nuxt_component_2 } from './ConfirmDialog-BxaeJdx9.mjs';
import { defineComponent, ref, mergeProps, unref, withCtx, createTextVNode, toDisplayString, useSSRContext } from 'vue';
import { ssrRenderAttrs, ssrInterpolate, ssrRenderComponent, ssrRenderList, ssrRenderClass, ssrRenderAttr } from 'vue/server-renderer';
import { a as useAdminApi, u as useAdminLocale } from './useAdminApi-SsuwQDOr.mjs';
import { u as useFormat } from './useFormat-DT1zbtWM.mjs';
import '../nitro/nitro.mjs';
import 'node:http';
import 'node:https';
import 'node:events';
import 'node:buffer';
import 'node:fs';
import 'node:path';
import 'node:crypto';
import 'node:url';
import '../routes/renderer.mjs';
import 'vue-bundle-renderer/runtime';
import 'unhead/server';
import 'devalue';
import 'unhead/plugins';
import 'unhead/utils';
import 'pinia';
import 'vue-router';
import 'perfect-debounce';
import './index-C4JB2zdt.mjs';
import './_plugin-vue_export-helper-1tPrXgE0.mjs';

const _sfc_main = /* @__PURE__ */ defineComponent({
  __name: "index",
  __ssrInlineRender: true,
  setup(__props) {
    const api = useAdminApi();
    const { t, locale } = useAdminLocale();
    const { dateTime } = useFormat();
    const pages = ref([]);
    const loading = ref(true);
    const errorMessage = ref("");
    const notice = ref("");
    const deleteTarget = ref(null);
    const deleting = ref(false);
    useRoute();
    function title(page) {
      return locale.value === "en" && page.titleEn ? page.titleEn : page.titleKh;
    }
    async function load() {
      var _a;
      loading.value = true;
      errorMessage.value = "";
      try {
        pages.value = await api.get("/api/admin/pages");
      } catch (e) {
        errorMessage.value = ((_a = e.data) == null ? void 0 : _a.message) || t("pagesLoadFailed");
      } finally {
        loading.value = false;
      }
    }
    async function confirmDelete() {
      var _a;
      const target = deleteTarget.value;
      if (!target) return;
      deleting.value = true;
      errorMessage.value = "";
      try {
        await api.del(`/api/admin/pages/${target.id}?confirm=permanent`);
        deleteTarget.value = null;
        notice.value = t("saved");
        await load();
      } catch (e) {
        errorMessage.value = ((_a = e.data) == null ? void 0 : _a.message) || t("pageDeleteFailed");
        deleteTarget.value = null;
      } finally {
        deleting.value = false;
      }
    }
    useHead({ title: `${t("pagesNav")} \xB7 CFN Admin` });
    return (_ctx, _push, _parent, _attrs) => {
      var _a, _b;
      const _component_NuxtLink = __nuxt_component_0$1;
      const _component_ConfirmDialog = __nuxt_component_2;
      _push(`<div${ssrRenderAttrs(mergeProps({ class: "space-y-6" }, _attrs))}><header class="flex flex-wrap items-start justify-between gap-3"><div><h1 class="text-xl font-bold">${ssrInterpolate(unref(t)("pagesNav"))}</h1><p class="mt-1 max-w-2xl text-sm text-ink-muted">${ssrInterpolate(unref(t)("pagesIntro"))}</p></div>`);
      _push(ssrRenderComponent(_component_NuxtLink, {
        to: "/admin/pages/new",
        class: "rounded-lg bg-brand px-4 py-2 text-sm font-semibold text-white hover:bg-brand-dark"
      }, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(`+ ${ssrInterpolate(unref(t)("newPage"))}`);
          } else {
            return [
              createTextVNode("+ " + toDisplayString(unref(t)("newPage")), 1)
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(`</header>`);
      if (unref(notice)) {
        _push(`<p role="status" class="rounded-lg bg-success/10 px-4 py-3 text-sm text-success">${ssrInterpolate(unref(notice))}</p>`);
      } else {
        _push(`<!---->`);
      }
      if (unref(errorMessage)) {
        _push(`<p role="alert" class="rounded-lg bg-breaking/10 px-4 py-3 text-sm text-breaking">${ssrInterpolate(unref(errorMessage))}</p>`);
      } else {
        _push(`<!---->`);
      }
      if (unref(loading)) {
        _push(`<p class="py-12 text-center text-sm text-ink-muted">${ssrInterpolate(unref(t)("loading"))}</p>`);
      } else if (!unref(pages).length) {
        _push(`<p class="card p-8 text-center text-sm text-ink-muted">${ssrInterpolate(unref(t)("noPages"))}</p>`);
      } else {
        _push(`<div class="card overflow-hidden"><ul class="divide-y divide-line"><!--[-->`);
        ssrRenderList(unref(pages), (page) => {
          _push(`<li class="flex flex-wrap items-start gap-3 p-4 hover:bg-surface-muted"><div class="min-w-0 flex-1"><p class="flex flex-wrap items-center gap-2 text-kh-sm font-semibold">`);
          _push(ssrRenderComponent(_component_NuxtLink, {
            to: `/admin/pages/${page.id}`,
            class: "hover:text-brand"
          }, {
            default: withCtx((_, _push2, _parent2, _scopeId) => {
              if (_push2) {
                _push2(`${ssrInterpolate(title(page))}`);
              } else {
                return [
                  createTextVNode(toDisplayString(title(page)), 1)
                ];
              }
            }),
            _: 2
          }, _parent));
          if (page.isSystem) {
            _push(`<span class="rounded bg-ink/10 px-1.5 py-0.5 text-xs font-normal text-ink-muted">${ssrInterpolate(unref(t)("required"))}</span>`);
          } else {
            _push(`<!---->`);
          }
          if (!page.isPublished) {
            _push(`<span class="rounded bg-warning/15 px-1.5 py-0.5 text-xs font-normal">${ssrInterpolate(unref(t)("hidden"))}</span>`);
          } else {
            _push(`<!---->`);
          }
          _push(`<span class="${ssrRenderClass([
            "rounded px-1.5 py-0.5 text-xs font-normal",
            page.hasEnglish ? "bg-success/10 text-success" : "bg-surface-muted text-ink-muted"
          ])}">${ssrInterpolate(page.hasEnglish ? unref(t)("translated") : unref(t)("noTranslationYet"))}</span></p><div class="mt-1 flex flex-wrap items-center gap-2 text-xs text-ink-muted"><code class="font-mono">/${ssrInterpolate(page.slug)}</code><span>\xB7 ${ssrInterpolate(page.showInFooter ? unref(t)("inFooter") : unref(t)("notInMenu"))}</span><span>\xB7 ${ssrInterpolate(unref(t)("wordsKh", { n: page.wordsKh }))}</span><span>\xB7 ${ssrInterpolate(unref(dateTime)(page.updatedAt))}</span></div></div><div class="flex shrink-0 items-center gap-1">`);
          if (page.isPublished) {
            _push(`<a${ssrRenderAttr("href", `/${page.slug}`)} target="_blank" rel="noopener" class="rounded px-2 py-1 text-sm text-ink-muted hover:text-brand">${ssrInterpolate(unref(t)("viewPage"))}</a>`);
          } else {
            _push(`<!---->`);
          }
          _push(ssrRenderComponent(_component_NuxtLink, {
            to: `/admin/pages/${page.id}`,
            class: "rounded-lg border border-line px-3 py-1 text-sm font-semibold hover:bg-surface"
          }, {
            default: withCtx((_, _push2, _parent2, _scopeId) => {
              if (_push2) {
                _push2(`${ssrInterpolate(unref(t)("edit"))}`);
              } else {
                return [
                  createTextVNode(toDisplayString(unref(t)("edit")), 1)
                ];
              }
            }),
            _: 2
          }, _parent));
          _push(`<button type="button" class="rounded px-2 py-1 text-sm text-breaking hover:bg-breaking/10">${ssrInterpolate(unref(t)("remove"))}</button></div></li>`);
        });
        _push(`<!--]--></ul></div>`);
      }
      _push(ssrRenderComponent(_component_ConfirmDialog, {
        open: !!unref(deleteTarget),
        title: unref(t)("deletePageTitle"),
        message: unref(deleteTarget) ? unref(t)("deletePageMessage", { name: title(unref(deleteTarget)) }) : "",
        "require-text": ((_a = unref(deleteTarget)) == null ? void 0 : _a.isSystem) ? unref(deleteTarget).slug : void 0,
        consequences: ((_b = unref(deleteTarget)) == null ? void 0 : _b.isSystem) ? [unref(t)("deleteRequiredWarning"), unref(t)("deleteRequiredUnpublish")] : [],
        "confirm-label": unref(t)("remove"),
        "cancel-label": unref(t)("cancel"),
        busy: unref(deleting),
        onConfirm: confirmDelete,
        onCancel: ($event) => deleteTarget.value = null
      }, null, _parent));
      _push(`</div>`);
    };
  }
});
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("pages/admin/pages/index.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};

export { _sfc_main as default };
//# sourceMappingURL=index-CEnW5ZPI.mjs.map
