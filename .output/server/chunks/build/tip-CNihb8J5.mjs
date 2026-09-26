import { defineComponent, reactive, ref, mergeProps, unref, useSSRContext } from 'vue';
import { ssrRenderAttrs, ssrInterpolate, ssrRenderAttr, ssrIncludeBooleanAttr } from 'vue/server-renderer';
import { u as useLocale, a as useApi, b as useSiteSeo } from './server.mjs';
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
  __name: "tip",
  __ssrInlineRender: true,
  setup(__props) {
    const { t } = useLocale();
    useApi();
    const form = reactive({ name: "", contact: "", location: "", description: "" });
    const submitting = ref(false);
    const submitted = ref(false);
    const errorMessage = ref("");
    useSiteSeo({
      title: t("tipTitle"),
      description: t("tipDesc"),
      path: "/tip"
    });
    return (_ctx, _push, _parent, _attrs) => {
      _push(`<div${ssrRenderAttrs(mergeProps({ class: "container-content max-w-prose" }, _attrs))}><h1 class="text-kh-2xl font-bold">${ssrInterpolate(unref(t)("tipTitle"))}</h1><div class="mt-4 rounded-lg border border-line bg-surface-muted p-4 text-kh-sm khmer-wrap">${ssrInterpolate(unref(t)("tipIntro"))}</div>`);
      if (unref(submitted)) {
        _push(`<div class="mt-6 rounded-lg border border-success/40 bg-success/5 p-6 text-center"><p class="text-kh-lg font-semibold text-success">${ssrInterpolate(unref(t)("tipThanks"))}</p><p class="mt-2 text-kh-base khmer-wrap">${ssrInterpolate(unref(t)("tipReceived"))}</p></div>`);
      } else {
        _push(`<form class="mt-6 space-y-4"><div><label for="tip-description" class="mb-1 block text-kh-sm font-semibold">${ssrInterpolate(unref(t)("tipWhatHappened"))} <span class="text-breaking">*</span></label><textarea id="tip-description" rows="6" required class="w-full rounded-lg border border-line px-3 py-2 text-kh-base outline-none focus:border-brand"${ssrRenderAttr("placeholder", unref(t)("tipDetailPlaceholder"))}>${ssrInterpolate(unref(form).description)}</textarea></div><div><label for="tip-location" class="mb-1 block text-kh-sm font-semibold">${ssrInterpolate(unref(t)("tipLocation"))}</label><input id="tip-location"${ssrRenderAttr("value", unref(form).location)} type="text" class="w-full rounded-lg border border-line px-3 py-2 text-kh-base outline-none focus:border-brand"${ssrRenderAttr("placeholder", unref(t)("tipLocationPlaceholder"))}></div><div class="grid gap-4 sm:grid-cols-2"><div><label for="tip-name" class="mb-1 block text-kh-sm font-semibold">${ssrInterpolate(unref(t)("tipName"))}</label><input id="tip-name"${ssrRenderAttr("value", unref(form).name)} type="text" class="w-full rounded-lg border border-line px-3 py-2 text-kh-base outline-none focus:border-brand"></div><div><label for="tip-contact" class="mb-1 block text-kh-sm font-semibold">${ssrInterpolate(unref(t)("tipContact"))}</label><input id="tip-contact"${ssrRenderAttr("value", unref(form).contact)} type="text" class="w-full rounded-lg border border-line px-3 py-2 text-kh-base outline-none focus:border-brand"${ssrRenderAttr("placeholder", unref(t)("tipContactPlaceholder"))}></div></div><p class="text-xs text-ink-muted khmer-wrap">${ssrInterpolate(unref(t)("tipContactNote"))}</p>`);
        if (unref(errorMessage)) {
          _push(`<p class="rounded-lg bg-breaking/10 p-3 text-kh-sm text-breaking">${ssrInterpolate(unref(errorMessage))}</p>`);
        } else {
          _push(`<!---->`);
        }
        _push(`<button type="submit"${ssrIncludeBooleanAttr(unref(submitting)) ? " disabled" : ""} class="w-full rounded-lg bg-brand px-6 py-3 font-semibold text-white hover:bg-brand-dark disabled:opacity-50 sm:w-auto">${ssrInterpolate(unref(submitting) ? unref(t)("tipSending") : unref(t)("tipSubmit"))}</button></form>`);
      }
      _push(`</div>`);
    };
  }
});
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("pages/tip.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};

export { _sfc_main as default };
//# sourceMappingURL=tip-CNihb8J5.mjs.map
