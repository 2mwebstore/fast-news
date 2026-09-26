import { f as useRoute, i as useRouter, j as useHead, _ as __nuxt_component_0$1 } from './server.mjs';
import { _ as _sfc_main$1 } from './AdminRichText-TekrMmFp.mjs';
import { defineComponent, computed, reactive, ref, mergeProps, withCtx, unref, createTextVNode, toDisplayString, useSSRContext } from 'vue';
import { ssrRenderAttrs, ssrRenderComponent, ssrInterpolate, ssrRenderAttr, ssrIncludeBooleanAttr, ssrLooseContain } from 'vue/server-renderer';
import { a as useAdminApi, u as useAdminLocale } from './useAdminApi-SsuwQDOr.mjs';
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

const _sfc_main = /* @__PURE__ */ defineComponent({
  __name: "[id]",
  __ssrInlineRender: true,
  setup(__props) {
    useAdminApi();
    const route = useRoute();
    useRouter();
    const { t } = useAdminLocale();
    const isNew = computed(() => route.params.id === "new");
    computed(() => isNew.value ? 0 : Number(route.params.id));
    const form = reactive({
      slug: "",
      titleKh: "",
      titleEn: "",
      bodyKh: "",
      bodyEn: "",
      metaDescKh: "",
      metaDescEn: "",
      isPublished: false,
      showInFooter: true,
      position: 0
    });
    const isSystem = ref(false);
    const loading = ref(!isNew.value);
    const saving = ref(false);
    const errorMessage = ref("");
    const canSave = computed(() => !saving.value && form.titleKh.trim() !== "");
    useHead({ title: `${isNew.value ? t("newPage") : t("editPage")} \xB7 CFN Admin` });
    return (_ctx, _push, _parent, _attrs) => {
      const _component_NuxtLink = __nuxt_component_0$1;
      const _component_AdminRichText = _sfc_main$1;
      _push(`<div${ssrRenderAttrs(mergeProps({ class: "space-y-5" }, _attrs))}><div>`);
      _push(ssrRenderComponent(_component_NuxtLink, {
        to: "/admin/pages",
        class: "text-sm text-brand hover:underline"
      }, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(`\u2190 ${ssrInterpolate(unref(t)("backToPages"))}`);
          } else {
            return [
              createTextVNode("\u2190 " + toDisplayString(unref(t)("backToPages")), 1)
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(`</div>`);
      if (unref(errorMessage)) {
        _push(`<p role="alert" class="rounded-lg bg-breaking/10 p-3 text-sm text-breaking">${ssrInterpolate(unref(errorMessage))}</p>`);
      } else {
        _push(`<!---->`);
      }
      if (unref(loading)) {
        _push(`<p class="py-12 text-center text-ink-muted">${ssrInterpolate(unref(t)("loading"))}</p>`);
      } else {
        _push(`<form class="space-y-5"><h1 class="text-xl font-bold">${ssrInterpolate(unref(isNew) ? unref(t)("newPage") : unref(t)("editPage"))}</h1><div class="card space-y-4 p-5"><div class="grid gap-4 sm:grid-cols-2"><div><label for="p-title-kh" class="mb-1 block text-sm font-medium">${ssrInterpolate(unref(t)("titleKh"))} *</label><input id="p-title-kh"${ssrRenderAttr("value", unref(form).titleKh)} required class="w-full rounded-lg border border-line px-3 py-2 text-kh-sm outline-none focus:border-brand"></div><div><label for="p-title-en" class="mb-1 block text-sm font-medium">${ssrInterpolate(unref(t)("titleEn"))}</label><input id="p-title-en"${ssrRenderAttr("value", unref(form).titleEn)} class="w-full rounded-lg border border-line px-3 py-2 text-sm outline-none focus:border-brand"></div></div><div><label for="p-slug" class="mb-1 block text-sm font-medium">${ssrInterpolate(unref(t)("pageAddress"))}</label><div class="flex items-center gap-1"><span class="shrink-0 text-sm text-ink-muted">/</span><input id="p-slug"${ssrRenderAttr("value", unref(form).slug)}${ssrIncludeBooleanAttr(unref(isSystem)) ? " disabled" : ""} placeholder="privacy" class="w-full rounded-lg border border-line px-3 py-2 font-mono text-sm outline-none focus:border-brand disabled:bg-surface-muted disabled:text-ink-muted"></div>`);
        if (unref(isSystem)) {
          _push(`<p class="mt-1 text-xs text-ink-muted">${ssrInterpolate(unref(t)("pageAddressFixed"))}</p>`);
        } else {
          _push(`<p class="mt-1 text-xs text-ink-muted">${ssrInterpolate(unref(t)("slugHint"))}</p>`);
        }
        _push(`</div><div class="flex flex-wrap gap-5"><label class="flex items-start gap-2 text-sm"><input${ssrIncludeBooleanAttr(Array.isArray(unref(form).isPublished) ? ssrLooseContain(unref(form).isPublished, null) : unref(form).isPublished) ? " checked" : ""} type="checkbox" class="mt-0.5 rounded border-line"><span>${ssrInterpolate(unref(t)("published"))} <span class="block text-xs text-ink-muted">${ssrInterpolate(unref(t)("publishedHint"))}</span></span></label><label class="flex items-center gap-2 text-sm"><input${ssrIncludeBooleanAttr(Array.isArray(unref(form).showInFooter) ? ssrLooseContain(unref(form).showInFooter, null) : unref(form).showInFooter) ? " checked" : ""} type="checkbox" class="rounded border-line"> ${ssrInterpolate(unref(t)("inFooter"))}</label><div><label for="p-position" class="mb-1 block text-sm font-medium">${ssrInterpolate(unref(t)("positionLabel"))}</label><input id="p-position"${ssrRenderAttr("value", unref(form).position)} type="number" min="0" class="w-24 rounded-lg border border-line px-3 py-2 text-sm outline-none focus:border-brand"></div></div></div><div class="card space-y-3 p-5"><label class="block text-sm font-medium">${ssrInterpolate(unref(t)("bodyKhLabel"))}</label>`);
        _push(ssrRenderComponent(_component_AdminRichText, {
          modelValue: unref(form).bodyKh,
          "onUpdate:modelValue": ($event) => unref(form).bodyKh = $event
        }, null, _parent));
        _push(`</div><div class="card space-y-3 p-5"><label class="block text-sm font-medium">${ssrInterpolate(unref(t)("bodyEnLabel"))}</label><p class="text-xs text-ink-muted">${ssrInterpolate(unref(t)("bodyEnHint"))}</p>`);
        _push(ssrRenderComponent(_component_AdminRichText, {
          modelValue: unref(form).bodyEn,
          "onUpdate:modelValue": ($event) => unref(form).bodyEn = $event
        }, null, _parent));
        _push(`</div><details class="card p-5"><summary class="cursor-pointer text-sm font-bold">SEO</summary><div class="mt-4 grid gap-3 sm:grid-cols-2"><textarea rows="2"${ssrRenderAttr("placeholder", `${unref(t)("metaDescription")} (\u1781\u17D2\u1798\u17C2\u179A)`)} class="w-full rounded-lg border border-line px-3 py-2 text-kh-sm outline-none focus:border-brand">${ssrInterpolate(unref(form).metaDescKh)}</textarea><textarea rows="2"${ssrRenderAttr("placeholder", `${unref(t)("metaDescription")} (EN)`)} class="w-full rounded-lg border border-line px-3 py-2 text-sm outline-none focus:border-brand">${ssrInterpolate(unref(form).metaDescEn)}</textarea></div></details><div class="flex flex-wrap items-center gap-2"><button type="submit" class="rounded-lg bg-brand px-4 py-2 text-sm font-semibold text-white hover:bg-brand-dark disabled:opacity-50"${ssrIncludeBooleanAttr(!unref(canSave)) ? " disabled" : ""}>${ssrInterpolate(unref(saving) ? unref(t)("saving") : unref(t)("save"))}</button>`);
        _push(ssrRenderComponent(_component_NuxtLink, {
          to: "/admin/pages",
          class: "rounded-lg border border-line px-4 py-2 text-sm font-semibold hover:bg-surface-muted"
        }, {
          default: withCtx((_, _push2, _parent2, _scopeId) => {
            if (_push2) {
              _push2(`${ssrInterpolate(unref(t)("cancel"))}`);
            } else {
              return [
                createTextVNode(toDisplayString(unref(t)("cancel")), 1)
              ];
            }
          }),
          _: 1
        }, _parent));
        if (!unref(isNew) && unref(form).isPublished) {
          _push(`<a${ssrRenderAttr("href", `/${unref(form).slug}`)} target="_blank" rel="noopener" class="text-sm text-brand hover:underline">${ssrInterpolate(unref(t)("viewPage"))} \u2192</a>`);
        } else {
          _push(`<!---->`);
        }
        _push(`</div></form>`);
      }
      _push(`</div>`);
    };
  }
});
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("pages/admin/pages/[id].vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};

export { _sfc_main as default };
//# sourceMappingURL=_id_-B453LwOs.mjs.map
