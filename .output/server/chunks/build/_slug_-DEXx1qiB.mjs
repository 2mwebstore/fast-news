import { defineComponent, computed, withAsyncContext, unref, mergeProps, useSSRContext } from 'vue';
import { ssrRenderAttrs, ssrInterpolate } from 'vue/server-renderer';
import { f as useRoute, a as useApi, u as useLocale, g as useAsyncData, p as pageError, h as createError, b as useSiteSeo } from './server.mjs';
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

const _sfc_main = /* @__PURE__ */ defineComponent({
  __name: "[slug]",
  __ssrInlineRender: true,
  async setup(__props) {
    let __temp, __restore;
    const route = useRoute();
    const api = useApi();
    const { t, locale } = useLocale();
    const { dateTime } = useFormat();
    const slug = computed(() => String(route.params.slug));
    const { data: page, error } = ([__temp, __restore] = withAsyncContext(() => useAsyncData(
      () => `page-${slug.value}`,
      () => api.get(`/api/pages/${slug.value}`),
      { watch: [slug] }
    )), __temp = await __temp, __restore(), __temp);
    if (error.value) throw pageError(error.value, "Page not found");
    if (!page.value) {
      throw createError({ statusCode: 404, statusMessage: "Page not found", fatal: true });
    }
    const isEnglish = computed(() => locale.value === "en");
    const title = computed(
      () => {
        var _a;
        return isEnglish.value && ((_a = page.value) == null ? void 0 : _a.titleEn) ? page.value.titleEn : page.value.titleKh;
      }
    );
    const body = computed(
      () => {
        var _a;
        return isEnglish.value && ((_a = page.value) == null ? void 0 : _a.bodyEn) ? page.value.bodyEn : page.value.bodyKh;
      }
    );
    const description = computed(() => {
      const p = page.value;
      return (isEnglish.value ? p.metaDescEn : p.metaDescKh) || p.metaDescKh || title.value;
    });
    const showTranslationNotice = computed(() => {
      var _a;
      return isEnglish.value && !((_a = page.value) == null ? void 0 : _a.hasEnglish);
    });
    useSiteSeo({
      title: title.value,
      description: description.value,
      path: `/${page.value.slug}`,
      // Policy pages are indexable but carry no images and change rarely.
      type: "website"
    });
    return (_ctx, _push, _parent, _attrs) => {
      var _a;
      if (unref(page)) {
        _push(`<div${ssrRenderAttrs(mergeProps({ class: "container-content max-w-prose py-2" }, _attrs))}><h1 class="text-kh-2xl font-bold sm:text-kh-3xl">${ssrInterpolate(unref(title))}</h1><p class="mt-2 text-sm text-ink-muted">${ssrInterpolate(unref(t)("policyUpdated"))} ${ssrInterpolate(unref(dateTime)(unref(page).updatedAt))}</p>`);
        if (unref(showTranslationNotice)) {
          _push(`<p class="mt-4 rounded-lg border border-line bg-surface-muted px-4 py-3 text-sm text-ink-muted" role="note">${ssrInterpolate(unref(t)("policyOnlyKhmer"))}</p>`);
        } else {
          _push(`<!---->`);
        }
        _push(`<div class="article-body mt-6">${(_a = unref(body)) != null ? _a : ""}</div></div>`);
      } else {
        _push(`<!---->`);
      }
    };
  }
});
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("pages/[slug].vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};

export { _sfc_main as default };
//# sourceMappingURL=_slug_-DEXx1qiB.mjs.map
