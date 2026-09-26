import { _ as _sfc_main$1 } from './YouTubeEmbed-Dg97tQgT.mjs';
import { _ as _sfc_main$2 } from './SelectField-vCKw5R9_.mjs';
import { _ as _sfc_main$3 } from './ImageField-BjAQOsbw.mjs';
import { i as useRouter, _ as __nuxt_component_0$1 } from './server.mjs';
import { _ as __nuxt_component_0 } from './SearchableSelect-BQHPC7-8.mjs';
import { defineComponent, reactive, computed, ref, watch, unref, mergeProps, withCtx, createTextVNode, toDisplayString, useSSRContext } from 'vue';
import { ssrRenderAttrs, ssrInterpolate, ssrRenderAttr, ssrRenderClass, ssrRenderComponent, ssrIncludeBooleanAttr } from 'vue/server-renderer';
import { a as useAdminApi, u as useAdminLocale } from './useAdminApi-SsuwQDOr.mjs';

const _sfc_main = /* @__PURE__ */ defineComponent({
  __name: "AdminVideoForm",
  __ssrInlineRender: true,
  props: {
    videoId: {}
  },
  setup(__props) {
    const props = __props;
    useAdminApi();
    useRouter();
    const { t } = useAdminLocale();
    const form = reactive({
      titleKh: "",
      titleEn: "",
      descKh: "",
      descEn: "",
      youtubeUrl: "",
      categoryId: "",
      durationSec: 0,
      thumbnailUrl: "",
      thumbnailAlt: "",
      slug: ""
    });
    const seo = reactive({
      seoTitle: "",
      seoDescription: "",
      seoKeywords: [],
      canonicalUrl: "",
      robots: "",
      ogTitle: "",
      ogDescription: "",
      ogImage: "",
      twitterTitle: "",
      twitterDescription: "",
      twitterImage: ""
    });
    const keywordText = computed({
      get: () => seo.seoKeywords.join(", "),
      set: (value) => {
        seo.seoKeywords = value.split(",").map((k) => k.trim()).filter(Boolean);
      }
    });
    const robotsOptions = computed(() => [
      { value: "", label: t("robotsDefault") },
      { value: "index,follow", label: "index, follow" },
      { value: "noindex,follow", label: "noindex, follow" },
      { value: "index,nofollow", label: "index, nofollow" },
      { value: "noindex,nofollow", label: "noindex, nofollow" }
    ]);
    const categories = ref([]);
    const loading = ref(Boolean(props.videoId));
    const saving = ref(false);
    const message = ref("");
    const errorMessage = ref("");
    ref(props.videoId);
    const youtubeId = ref("");
    const YOUTUBE_PATTERN = /(?:youtu\.be\/|v=|\/embed\/|\/shorts\/|\/live\/|\/v\/)([A-Za-z0-9_-]{11})/;
    function parseId(input) {
      var _a, _b;
      const trimmed = input.trim();
      if (/^[A-Za-z0-9_-]{11}$/.test(trimmed)) return trimmed;
      return (_b = (_a = YOUTUBE_PATTERN.exec(trimmed)) == null ? void 0 : _a[1]) != null ? _b : "";
    }
    watch(() => form.youtubeUrl, (value) => {
      youtubeId.value = parseId(value);
    });
    const categoryOptions = computed(
      () => categories.value.map((c) => ({
        value: c.id,
        // Show the parent so a subsection does not read like a top-level one.
        label: c.parentNameKh ? `${c.parentNameKh} \u203A ${c.nameKh}` : c.nameKh,
        sub: c.inNav ? c.nameEn : `${c.nameEn} \xB7 hidden from nav`
      }))
    );
    return (_ctx, _push, _parent, _attrs) => {
      const _component_YouTubeEmbed = _sfc_main$1;
      const _component_SelectField = _sfc_main$2;
      const _component_ImageField = _sfc_main$3;
      const _component_NuxtLink = __nuxt_component_0$1;
      const _component_SearchableSelect = __nuxt_component_0;
      if (unref(loading)) {
        _push(`<p${ssrRenderAttrs(mergeProps({ class: "py-12 text-center text-ink-muted" }, _attrs))}>${ssrInterpolate(unref(t)("loading"))}</p>`);
      } else {
        _push(`<form${ssrRenderAttrs(mergeProps({ class: "grid gap-6 lg:grid-cols-3" }, _attrs))}><div class="space-y-4 lg:col-span-2"><div class="card space-y-4 p-5"><div><label for="yt-url" class="mb-1 block text-sm font-medium">YouTube link *</label><input id="yt-url"${ssrRenderAttr("value", unref(form).youtubeUrl)} type="text" placeholder="https://www.youtube.com/watch?v=\u2026 or https://youtu.be/\u2026" class="w-full rounded-lg border border-line px-3 py-2 font-mono text-sm outline-none focus:border-brand"><p class="${ssrRenderClass([unref(youtubeId) ? "text-success" : "text-ink-muted", "mt-1 text-xs"])}">`);
        if (unref(youtubeId)) {
          _push(`<!--[-->\u2713 Video id: <code>${ssrInterpolate(unref(youtubeId))}</code><!--]-->`);
        } else {
          _push(`<!--[-->${ssrInterpolate(unref(t)("youtubeHint"))}<!--]-->`);
        }
        _push(`</p></div>`);
        if (unref(youtubeId)) {
          _push(`<div><span class="mb-1 block text-sm font-medium">Preview</span>`);
          _push(ssrRenderComponent(_component_YouTubeEmbed, {
            "youtube-id": unref(youtubeId),
            title: unref(form).titleKh || "Preview"
          }, null, _parent));
          _push(`</div>`);
        } else {
          _push(`<!---->`);
        }
        _push(`<div><label for="v-title-kh" class="mb-1 block text-sm font-medium">${ssrInterpolate(unref(t)("titleKhLabel"))} *</label><input id="v-title-kh"${ssrRenderAttr("value", unref(form).titleKh)} required class="w-full rounded-lg border border-line px-3 py-2 text-kh-base outline-none focus:border-brand"></div><div><label for="v-title-en" class="mb-1 block text-sm font-medium">Title (English)</label><input id="v-title-en"${ssrRenderAttr("value", unref(form).titleEn)} class="w-full rounded-lg border border-line px-3 py-2 outline-none focus:border-brand"></div><div><label for="v-desc" class="mb-1 block text-sm font-medium">${ssrInterpolate(unref(t)("descKhLabelVideo"))}</label><textarea id="v-desc" rows="4" class="w-full rounded-lg border border-line px-3 py-2 text-kh-base outline-none focus:border-brand">${ssrInterpolate(unref(form).descKh)}</textarea></div></div><div class="card space-y-4 p-5"><h2 class="font-bold">SEO</h2><div><label for="v-seo-title" class="mb-1 block text-sm font-medium">${ssrInterpolate(unref(t)("seoTitleLabel"))} <span class="font-normal text-ink-muted">(${ssrInterpolate(unref(seo).seoTitle.length)}/60)</span></label><input id="v-seo-title"${ssrRenderAttr("value", unref(seo).seoTitle)} maxlength="120"${ssrRenderAttr("placeholder", unref(form).titleKh || unref(t)("seoFallbackTitle"))} class="w-full rounded-lg border border-line px-3 py-2 text-sm outline-none focus:border-brand"><p class="mt-1 text-xs text-ink-muted">${ssrInterpolate(unref(t)("seoOverrideHint"))}</p></div><div><label for="v-seo-desc" class="mb-1 block text-sm font-medium">${ssrInterpolate(unref(t)("seoDescLabel"))} <span class="font-normal text-ink-muted">(${ssrInterpolate(unref(seo).seoDescription.length)}/155)</span></label><textarea id="v-seo-desc" rows="2" maxlength="320"${ssrRenderAttr("placeholder", unref(form).descKh || unref(t)("seoFallbackDesc"))} class="w-full rounded-lg border border-line px-3 py-2 text-sm outline-none focus:border-brand">${ssrInterpolate(unref(seo).seoDescription)}</textarea></div><div><label for="v-seo-keywords" class="mb-1 block text-sm font-medium">${ssrInterpolate(unref(t)("seoKeywords"))}</label><input id="v-seo-keywords"${ssrRenderAttr("value", unref(keywordText))} placeholder="kun khmer, phnom penh" class="w-full rounded-lg border border-line px-3 py-2 text-sm outline-none focus:border-brand"><p class="mt-1 text-xs text-ink-muted">${ssrInterpolate(unref(t)("seoKeywordsHint"))}</p></div><div><label for="v-canonical" class="mb-1 block text-sm font-medium">${ssrInterpolate(unref(t)("canonicalUrl"))}</label><input id="v-canonical"${ssrRenderAttr("value", unref(seo).canonicalUrl)} type="url" class="w-full rounded-lg border border-line px-3 py-2 font-mono text-xs outline-none focus:border-brand"><p class="mt-1 text-xs text-ink-muted">${ssrInterpolate(unref(t)("canonicalHint"))}</p></div>`);
        _push(ssrRenderComponent(_component_SelectField, {
          modelValue: unref(seo).robots,
          "onUpdate:modelValue": ($event) => unref(seo).robots = $event,
          options: unref(robotsOptions),
          label: unref(t)("robotsLabel")
        }, null, _parent));
        _push(`<details class="rounded-lg border border-line p-3"><summary class="cursor-pointer text-sm font-medium">${ssrInterpolate(unref(t)("socialCards"))}</summary><div class="mt-3 space-y-3"><input${ssrRenderAttr("value", unref(seo).ogTitle)}${ssrRenderAttr("placeholder", unref(t)("ogTitle"))} class="w-full rounded-lg border border-line px-3 py-2 text-sm outline-none focus:border-brand"><textarea rows="2"${ssrRenderAttr("placeholder", unref(t)("ogDescription"))} class="w-full rounded-lg border border-line px-3 py-2 text-sm outline-none focus:border-brand">${ssrInterpolate(unref(seo).ogDescription)}</textarea>`);
        _push(ssrRenderComponent(_component_ImageField, {
          modelValue: unref(seo).ogImage,
          "onUpdate:modelValue": ($event) => unref(seo).ogImage = $event,
          folder: "video",
          label: unref(t)("ogImage"),
          hint: unref(t)("ogImageHint"),
          onError: ($event) => errorMessage.value = $event
        }, null, _parent));
        _push(`<input${ssrRenderAttr("value", unref(seo).twitterTitle)}${ssrRenderAttr("placeholder", unref(t)("twitterTitle"))} class="w-full rounded-lg border border-line px-3 py-2 text-sm outline-none focus:border-brand"><textarea rows="2"${ssrRenderAttr("placeholder", unref(t)("twitterDescription"))} class="w-full rounded-lg border border-line px-3 py-2 text-sm outline-none focus:border-brand">${ssrInterpolate(unref(seo).twitterDescription)}</textarea>`);
        _push(ssrRenderComponent(_component_ImageField, {
          modelValue: unref(seo).twitterImage,
          "onUpdate:modelValue": ($event) => unref(seo).twitterImage = $event,
          folder: "video",
          label: unref(t)("twitterImage"),
          hint: unref(t)("twitterImageHint"),
          onError: ($event) => errorMessage.value = $event
        }, null, _parent));
        _push(`</div></details></div></div><aside class="space-y-4"><div class="card space-y-3 p-5"><button type="submit"${ssrIncludeBooleanAttr(unref(saving) || !unref(youtubeId)) ? " disabled" : ""} class="w-full rounded-lg bg-brand px-4 py-2.5 font-semibold text-white hover:bg-brand-dark disabled:opacity-50">${ssrInterpolate(unref(saving) ? unref(t)("saving") : unref(t)("save"))}</button>`);
        if (unref(message)) {
          _push(`<p class="rounded bg-success/10 p-2 text-sm text-success">${ssrInterpolate(unref(message))}</p>`);
        } else {
          _push(`<!---->`);
        }
        if (unref(errorMessage)) {
          _push(`<p class="rounded bg-breaking/10 p-2 text-sm text-breaking">${ssrInterpolate(unref(errorMessage))}</p>`);
        } else {
          _push(`<!---->`);
        }
        _push(ssrRenderComponent(_component_NuxtLink, {
          to: "/admin/videos",
          class: "block text-center text-sm text-brand hover:underline"
        }, {
          default: withCtx((_, _push2, _parent2, _scopeId) => {
            if (_push2) {
              _push2(` \u2190 ${ssrInterpolate(unref(t)("videos"))}`);
            } else {
              return [
                createTextVNode(" \u2190 " + toDisplayString(unref(t)("videos")), 1)
              ];
            }
          }),
          _: 1
        }, _parent));
        _push(`</div><div class="card space-y-3 p-5">`);
        _push(ssrRenderComponent(_component_SearchableSelect, {
          modelValue: unref(form).categoryId,
          "onUpdate:modelValue": ($event) => unref(form).categoryId = $event,
          options: unref(categoryOptions),
          label: unref(t)("section"),
          placeholder: unref(t)("chooseSection"),
          "search-placeholder": unref(t)("searchSection")
        }, null, _parent));
        _push(`<div><label for="v-duration" class="mb-1 block text-sm font-medium">${ssrInterpolate(unref(t)("durationSeconds"))}</label><input id="v-duration"${ssrRenderAttr("value", unref(form).durationSec)} type="number" min="0" class="w-full rounded-lg border border-line px-3 py-2 text-sm outline-none focus:border-brand"></div>`);
        _push(ssrRenderComponent(_component_ImageField, {
          modelValue: unref(form).thumbnailUrl,
          "onUpdate:modelValue": ($event) => unref(form).thumbnailUrl = $event,
          folder: "video",
          label: unref(t)("thumbnail"),
          placeholder: "https://\u2026 (defaults to YouTube's poster)",
          hint: unref(t)("thumbnailHint"),
          onError: ($event) => errorMessage.value = $event
        }, null, _parent));
        _push(`<div><label for="v-thumb-alt" class="mb-1 block text-sm font-medium">${ssrInterpolate(unref(t)("altText"))}</label><input id="v-thumb-alt"${ssrRenderAttr("value", unref(form).thumbnailAlt)} class="w-full rounded-lg border border-line px-3 py-2 text-sm outline-none focus:border-brand"></div></div></aside></form>`);
      }
    };
  }
});
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/AdminVideoForm.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};

export { _sfc_main as _ };
//# sourceMappingURL=AdminVideoForm-BfH4VZzr.mjs.map
