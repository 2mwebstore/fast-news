import { defineComponent, computed, withAsyncContext, unref, mergeProps, useSSRContext } from "vue";
import { ssrRenderAttrs, ssrInterpolate } from "vue/server-renderer";
import { f as useRoute, a as useApi, u as useLocale, g as useAsyncData, p as pageError, h as createError, b as useSiteSeo } from "../server.mjs";
import { u as useFormat } from "./useFormat-DT1zbtWM.js";
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
      () => isEnglish.value && page.value?.titleEn ? page.value.titleEn : page.value.titleKh
    );
    const body = computed(
      () => isEnglish.value && page.value?.bodyEn ? page.value.bodyEn : page.value.bodyKh
    );
    const description = computed(() => {
      const p = page.value;
      return (isEnglish.value ? p.metaDescEn : p.metaDescKh) || p.metaDescKh || title.value;
    });
    const showTranslationNotice = computed(() => isEnglish.value && !page.value?.hasEnglish);
    useSiteSeo({
      title: title.value,
      description: description.value,
      path: `/${page.value.slug}`,
      // Policy pages are indexable but carry no images and change rarely.
      type: "website"
    });
    return (_ctx, _push, _parent, _attrs) => {
      if (unref(page)) {
        _push(`<div${ssrRenderAttrs(mergeProps({ class: "container-content max-w-prose py-2" }, _attrs))}><h1 class="text-kh-2xl font-bold sm:text-kh-3xl">${ssrInterpolate(unref(title))}</h1><p class="mt-2 text-sm text-ink-muted">${ssrInterpolate(unref(t)("policyUpdated"))} ${ssrInterpolate(unref(dateTime)(unref(page).updatedAt))}</p>`);
        if (unref(showTranslationNotice)) {
          _push(`<p class="mt-4 rounded-lg border border-line bg-surface-muted px-4 py-3 text-sm text-ink-muted" role="note">${ssrInterpolate(unref(t)("policyOnlyKhmer"))}</p>`);
        } else {
          _push(`<!---->`);
        }
        _push(`<div class="article-body mt-6">${unref(body) ?? ""}</div></div>`);
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
export {
  _sfc_main as default
};
//# sourceMappingURL=_slug_-DEXx1qiB.js.map
