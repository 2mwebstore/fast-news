import { _ as _sfc_main$1 } from "./YouTubeEmbed-Dg97tQgT.js";
import { _ as _sfc_main$2 } from "./ShareLinks-D6Mi_PUz.js";
import { _ as _sfc_main$3 } from "./AdSlot-DGDlUSRS.js";
import { _ as _sfc_main$4 } from "./SectionHeading-CJAAYZij.js";
import { _ as _sfc_main$5 } from "./VideoCard-CM0of8CH.js";
import { defineComponent, computed, withAsyncContext, unref, mergeProps, useSSRContext } from "vue";
import { ssrRenderAttrs, ssrRenderComponent, ssrInterpolate, ssrRenderAttr, ssrRenderList } from "vue/server-renderer";
import { f as useRoute, a as useApi, u as useLocale, g as useAsyncData, p as pageError, h as createError, c as useAsyncApi, b as useSiteSeo, q as useJsonLd, e as useRuntimeConfig } from "../server.mjs";
import { u as useFormat } from "./useFormat-DT1zbtWM.js";
import "./index-C4JB2zdt.js";
import "./SmartImage-D_CQTSWD.js";
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
    const config = useRuntimeConfig();
    const api = useApi();
    const { duration, dateTime, compact } = useFormat();
    const { t, title: localTitle, locale } = useLocale();
    const slug = computed(() => String(route.params.slug));
    const { data: video, error } = ([__temp, __restore] = withAsyncContext(() => useAsyncData(
      () => `video-${slug.value}`,
      () => api.get(`/api/video/${slug.value}`),
      { watch: [slug] }
    )), __temp = await __temp, __restore(), __temp);
    if (error.value) throw pageError(error.value, "Video not found");
    if (!video.value) {
      throw createError({ statusCode: 404, statusMessage: "Video not found", fatal: true });
    }
    const { data: more } = ([__temp, __restore] = withAsyncContext(() => useAsyncApi("video-more", "/api/video", { limit: 6 })), __temp = await __temp, __restore(), __temp);
    const seo = video.value.seo;
    useSiteSeo({
      title: seo?.seoTitle || video.value.titleKh,
      description: seo?.seoDescription || video.value.descKh || video.value.titleKh,
      path: `/video/${video.value.slug}`,
      image: seo?.ogImage || video.value.thumbnailUrl,
      type: "article",
      canonical: seo?.canonicalUrl || void 0,
      keywords: seo?.seoKeywords?.length ? seo.seoKeywords : void 0,
      robots: seo?.robots || void 0,
      ogTitle: seo?.ogTitle || void 0,
      ogDescription: seo?.ogDescription || void 0,
      twitterTitle: seo?.twitterTitle || void 0,
      twitterDescription: seo?.twitterDescription || void 0,
      twitterImage: seo?.twitterImage || void 0
    });
    useJsonLd({
      "@context": "https://schema.org",
      "@type": "VideoObject",
      name: seo?.seoTitle || video.value.titleKh,
      description: seo?.seoDescription || video.value.descKh || video.value.titleKh,
      thumbnailUrl: video.value.thumbnailUrl || void 0,
      uploadDate: video.value.publishedAt || void 0,
      // ISO 8601 duration, which is what Google expects here.
      duration: video.value.durationSec ? `PT${video.value.durationSec}S` : void 0,
      contentUrl: video.value.watchUrl || video.value.sourceUrl || void 0,
      embedUrl: video.value.embedUrl || `${config.public.siteUrl}/video/${video.value.slug}`,
      publisher: { "@type": "NewsMediaOrganization", name: config.public.siteName }
    });
    return (_ctx, _push, _parent, _attrs) => {
      const _component_YouTubeEmbed = _sfc_main$1;
      const _component_ShareLinks = _sfc_main$2;
      const _component_AdSlot = _sfc_main$3;
      const _component_SectionHeading = _sfc_main$4;
      const _component_VideoCard = _sfc_main$5;
      if (unref(video)) {
        _push(`<div${ssrRenderAttrs(mergeProps({ class: "container-content" }, _attrs))}><div class="grid gap-8 lg:grid-cols-3 mt-2"><div class="lg:col-span-2">`);
        _push(ssrRenderComponent(_component_YouTubeEmbed, {
          "youtube-id": unref(video).youtubeId,
          "embed-url": unref(video).embedUrl,
          title: unref(localTitle)(unref(video)),
          poster: unref(video).thumbnailUrl,
          "poster-alt": unref(video).thumbnailAlt,
          autoload: ""
        }, null, _parent));
        _push(`<h1 class="mt-4 text-kh-xl font-bold khmer-wrap sm:text-kh-2xl">${ssrInterpolate(unref(localTitle)(unref(video)))}</h1><div class="mt-2 flex flex-wrap items-center gap-2 text-sm text-ink-muted">`);
        if (unref(video).category) {
          _push(`<span class="badge-category">${ssrInterpolate(unref(locale) === "en" && unref(video).category.nameEn ? unref(video).category.nameEn : unref(video).category.nameKh)}</span>`);
        } else {
          _push(`<!---->`);
        }
        if (unref(video).publishedAt) {
          _push(`<time${ssrRenderAttr("datetime", unref(video).publishedAt)}>${ssrInterpolate(unref(dateTime)(unref(video).publishedAt))}</time>`);
        } else {
          _push(`<!---->`);
        }
        if (unref(video).viewCount) {
          _push(`<span>• ${ssrInterpolate(unref(compact)(unref(video).viewCount))} ${ssrInterpolate(unref(t)("views"))}</span>`);
        } else {
          _push(`<!---->`);
        }
        if (unref(video).durationSec) {
          _push(`<span>• ${ssrInterpolate(unref(duration)(unref(video).durationSec))}</span>`);
        } else {
          _push(`<!---->`);
        }
        _push(`</div>`);
        if (unref(video).descKh) {
          _push(`<p class="mt-4 text-kh-base khmer-wrap">${ssrInterpolate(unref(video).descKh)}</p>`);
        } else {
          _push(`<!---->`);
        }
        _push(`<div class="mt-6 border-t border-line pt-4">`);
        _push(ssrRenderComponent(_component_ShareLinks, {
          path: `/video/${unref(video).slug}`,
          title: unref(localTitle)(unref(video)),
          "track-path": `/api/video/${unref(video).slug}/share`,
          expanded: ""
        }, null, _parent));
        _push(`</div>`);
        _push(ssrRenderComponent(_component_AdSlot, {
          position: "ARTICLE_BOTTOM",
          "collapse-when-empty": ""
        }, null, _parent));
        _push(`</div><aside class="space-y-6">`);
        _push(ssrRenderComponent(_component_SectionHeading, {
          title: unref(t)("moreVideos"),
          href: "/video"
        }, null, _parent));
        _push(`<div class="space-y-4"><!--[-->`);
        ssrRenderList((unref(more) ?? []).filter((v) => v.id !== unref(video).id), (item) => {
          _push(ssrRenderComponent(_component_VideoCard, {
            key: item.id,
            video: item
          }, null, _parent));
        });
        _push(`<!--]--></div></aside></div></div>`);
      } else {
        _push(`<!---->`);
      }
    };
  }
});
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("pages/video/[slug].vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
export {
  _sfc_main as default
};
//# sourceMappingURL=_slug_-1hEkuyWE.js.map
