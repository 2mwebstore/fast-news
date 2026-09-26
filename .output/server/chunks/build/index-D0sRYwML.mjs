import { _ as _sfc_main$3 } from './AdSlot-DGDlUSRS.mjs';
import { _ as _sfc_main$4 } from './NewsCard-HLdAEa9m.mjs';
import { _ as _sfc_main$5 } from './SectionHeading-CJAAYZij.mjs';
import { u as useLocale, c as useAsyncApi, b as useSiteSeo, d as useOrganizationSchema, _ as __nuxt_component_0$1, e as useRuntimeConfig } from './server.mjs';
import { _ as _sfc_main$6 } from './TrendingList-BOx8JOT1.mjs';
import { _ as _sfc_main$7 } from './FiveMinuteNews-DBAb4Crl.mjs';
import { _ as _sfc_main$8 } from './NewsPulse--M0PNvod.mjs';
import { defineComponent, withAsyncContext, computed, resolveDirective, unref, mergeProps, withCtx, createTextVNode, toDisplayString, useSSRContext } from 'vue';
import { ssrRenderAttrs, ssrRenderComponent, ssrInterpolate, ssrRenderList, ssrGetDirectiveProps } from 'vue/server-renderer';
import { _ as _sfc_main$9 } from './VideoCard-CM0of8CH.mjs';
import './index-C4JB2zdt.mjs';
import './SmartImage-D_CQTSWD.mjs';
import './BreakingBadge-BUl44HvT.mjs';
import './useFormat-DT1zbtWM.mjs';
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

const _sfc_main$2 = /* @__PURE__ */ defineComponent({
  __name: "CategorySection",
  __ssrInlineRender: true,
  props: {
    category: {}
  },
  async setup(__props) {
    let __temp, __restore;
    const props = __props;
    const { data: articles } = ([__temp, __restore] = withAsyncContext(() => useAsyncApi(
      `section-${props.category.slug}`,
      "/api/news",
      { category: props.category.slug, limit: 5 }
    )), __temp = await __temp, __restore(), __temp);
    const lead = computed(() => {
      var _a, _b;
      return (_b = (_a = articles.value) == null ? void 0 : _a[0]) != null ? _b : null;
    });
    const rest = computed(() => {
      var _a, _b;
      return (_b = (_a = articles.value) == null ? void 0 : _a.slice(1, 5)) != null ? _b : [];
    });
    return (_ctx, _push, _parent, _attrs) => {
      const _component_SectionHeading = _sfc_main$5;
      const _component_NewsCard = _sfc_main$4;
      if (unref(lead)) {
        _push(`<section${ssrRenderAttrs(mergeProps({
          "aria-labelledby": `section-${__props.category.slug}`
        }, _attrs))}>`);
        _push(ssrRenderComponent(_component_SectionHeading, {
          id: `section-${__props.category.slug}`,
          title: __props.category.nameKh,
          icon: __props.category.icon,
          href: `/category/${__props.category.slug}`,
          accent: __props.category.color
        }, null, _parent));
        _push(`<div class="grid gap-6 md:grid-cols-2">`);
        _push(ssrRenderComponent(_component_NewsCard, {
          article: unref(lead),
          variant: "grid"
        }, null, _parent));
        _push(`<div class="space-y-4"><!--[-->`);
        ssrRenderList(unref(rest), (article) => {
          _push(ssrRenderComponent(_component_NewsCard, {
            key: article.id,
            article,
            variant: "compact"
          }, null, _parent));
        });
        _push(`<!--]--></div></div></section>`);
      } else {
        _push(`<!---->`);
      }
    };
  }
});
const _sfc_setup$2 = _sfc_main$2.setup;
_sfc_main$2.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/CategorySection.vue");
  return _sfc_setup$2 ? _sfc_setup$2(props, ctx) : void 0;
};
const _sfc_main$1 = /* @__PURE__ */ defineComponent({
  __name: "VideoSection",
  __ssrInlineRender: true,
  async setup(__props) {
    let __temp, __restore;
    const { data: videos } = ([__temp, __restore] = withAsyncContext(() => useAsyncApi("home-video", "/api/video", { limit: 6 })), __temp = await __temp, __restore(), __temp);
    const { t } = useLocale();
    return (_ctx, _push, _parent, _attrs) => {
      var _a;
      const _component_SectionHeading = _sfc_main$5;
      const _component_VideoCard = _sfc_main$9;
      if ((_a = unref(videos)) == null ? void 0 : _a.length) {
        _push(`<section${ssrRenderAttrs(mergeProps({ "aria-labelledby": "video-heading" }, _attrs))}>`);
        _push(ssrRenderComponent(_component_SectionHeading, {
          id: "video-heading",
          title: unref(t)("videoNews"),
          icon: "\u{1F3A5}",
          href: "/video"
        }, null, _parent));
        _push(`<div class="grid gap-5 sm:grid-cols-2 lg:grid-cols-3"><!--[-->`);
        ssrRenderList(unref(videos), (video) => {
          _push(ssrRenderComponent(_component_VideoCard, {
            key: video.id,
            video
          }, null, _parent));
        });
        _push(`<!--]--></div></section>`);
      } else {
        _push(`<!---->`);
      }
    };
  }
});
const _sfc_setup$1 = _sfc_main$1.setup;
_sfc_main$1.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/VideoSection.vue");
  return _sfc_setup$1 ? _sfc_setup$1(props, ctx) : void 0;
};
const _sfc_main = /* @__PURE__ */ defineComponent({
  __name: "index",
  __ssrInlineRender: true,
  async setup(__props) {
    let __temp, __restore;
    const config = useRuntimeConfig();
    const { t, locale } = useLocale();
    const [{ data: featured }, { data: latest }, { data: trending }, { data: categories }] = ([__temp, __restore] = withAsyncContext(() => Promise.all([
      useAsyncApi("home-featured", "/api/featured", { limit: 5 }),
      useAsyncApi("home-latest", "/api/news", { limit: 12 }),
      useAsyncApi("home-trending", "/api/trending", { limit: 8 }),
      useAsyncApi("nav-categories", "/api/categories")
    ])), __temp = await __temp, __restore(), __temp);
    const hero = computed(() => {
      var _a, _b;
      return (_b = (_a = featured.value) == null ? void 0 : _a[0]) != null ? _b : null;
    });
    const secondary = computed(() => {
      var _a, _b;
      return (_b = (_a = featured.value) == null ? void 0 : _a.slice(1, 5)) != null ? _b : [];
    });
    const homeSections = ["cambodia", "business", "sports", "technology", "entertainment"];
    const sectionsToRender = computed(
      () => homeSections.map((slug) => {
        var _a;
        return ((_a = categories.value) != null ? _a : []).find((c) => c.slug === slug);
      }).filter((c) => Boolean(c))
    );
    useSiteSeo({
      // Already carries the brand, so the title template will not re-append it.
      title: `${locale.value === "en" ? config.public.siteName : config.public.siteNameKh} | Cambodia Fast News`,
      description: t("homeDesc"),
      path: "/",
      image: `${config.public.siteUrl}/og-default.png`
    });
    useOrganizationSchema();
    return (_ctx, _push, _parent, _attrs) => {
      var _a, _b;
      const _component_AdSlot = _sfc_main$3;
      const _component_NewsCard = _sfc_main$4;
      const _component_SectionHeading = _sfc_main$5;
      const _component_NuxtLink = __nuxt_component_0$1;
      const _component_TrendingList = _sfc_main$6;
      const _component_FiveMinuteNews = _sfc_main$7;
      const _component_NewsPulse = _sfc_main$8;
      const _component_CategorySection = _sfc_main$2;
      const _component_VideoSection = _sfc_main$1;
      const _directive_reveal = resolveDirective("reveal");
      _push(`<div${ssrRenderAttrs(_attrs)}><div class="container-content">`);
      _push(ssrRenderComponent(_component_AdSlot, {
        position: "HOME_TOP",
        "collapse-when-empty": ""
      }, null, _parent));
      _push(`</div>`);
      if (unref(hero)) {
        _push(`<section class="container-content" aria-labelledby="featured-heading"><h1 id="featured-heading" class="sr-only">${ssrInterpolate(unref(t)("latestNews"))}</h1><div class="grid gap-6 lg:grid-cols-3"><div class="lg:col-span-2">`);
        _push(ssrRenderComponent(_component_NewsCard, {
          article: unref(hero),
          variant: "hero",
          priority: ""
        }, null, _parent));
        _push(`</div><div class="space-y-4 lg:border-l lg:border-line lg:pl-6"><!--[-->`);
        ssrRenderList(unref(secondary), (article) => {
          _push(ssrRenderComponent(_component_NewsCard, {
            key: article.id,
            article,
            variant: "compact"
          }, null, _parent));
        });
        _push(`<!--]-->`);
        _push(ssrRenderComponent(_component_AdSlot, {
          position: "HOME_SIDEBAR",
          "collapse-when-empty": "",
          class: "hidden lg:flex"
        }, null, _parent));
        _push(`</div></div></section>`);
      } else {
        _push(`<!---->`);
      }
      _push(`<div class="container-content">`);
      _push(ssrRenderComponent(_component_AdSlot, {
        position: "HOME_AFTER_HERO",
        "collapse-when-empty": ""
      }, null, _parent));
      _push(`</div><div class="container-content mt-8 grid gap-8 lg:grid-cols-3"><section class="lg:col-span-2" aria-labelledby="latest-heading">`);
      _push(ssrRenderComponent(_component_SectionHeading, {
        id: "latest-heading",
        title: unref(t)("latestNews"),
        href: "/archive"
      }, null, _parent));
      _push(`<ul class="divide-y divide-line"><!--[-->`);
      ssrRenderList((_a = unref(latest)) != null ? _a : [], (article, i) => {
        _push(`<li${ssrRenderAttrs(mergeProps({
          key: article.id,
          class: "py-4 first:pt-0"
        }, ssrGetDirectiveProps(_ctx, _directive_reveal)))}>`);
        _push(ssrRenderComponent(_component_NewsCard, {
          article,
          variant: "list",
          "show-time": ""
        }, null, _parent));
        if (i === 4) {
          _push(ssrRenderComponent(_component_AdSlot, {
            position: "HOME_IN_FEED",
            "collapse-when-empty": "",
            class: "pt-4"
          }, null, _parent));
        } else {
          _push(`<!---->`);
        }
        _push(`</li>`);
      });
      _push(`<!--]--></ul>`);
      _push(ssrRenderComponent(_component_NuxtLink, {
        to: "/archive",
        class: "mt-6 block rounded-lg border border-line py-3 text-center text-kh-sm font-semibold hover:bg-surface-muted"
      }, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(`${ssrInterpolate(unref(t)("loadMore"))}`);
          } else {
            return [
              createTextVNode(toDisplayString(unref(t)("loadMore")), 1)
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(`</section><aside class="space-y-8">`);
      _push(ssrRenderComponent(_component_TrendingList, {
        articles: (_b = unref(trending)) != null ? _b : []
      }, null, _parent));
      _push(ssrRenderComponent(_component_FiveMinuteNews, null, null, _parent));
      _push(ssrRenderComponent(_component_NewsPulse, null, null, _parent));
      _push(`</aside></div><div class="container-content mt-10 space-y-10"><!--[-->`);
      ssrRenderList(unref(sectionsToRender), (section, i) => {
        _push(`<!--[-->`);
        _push(ssrRenderComponent(_component_CategorySection, { category: section }, null, _parent));
        if (i === 1) {
          _push(ssrRenderComponent(_component_AdSlot, {
            position: "HOME_IN_FEED",
            "collapse-when-empty": ""
          }, null, _parent));
        } else {
          _push(`<!---->`);
        }
        _push(`<!--]-->`);
      });
      _push(`<!--]--></div><div class="container-content mt-10">`);
      _push(ssrRenderComponent(_component_VideoSection, null, null, _parent));
      _push(`</div></div>`);
    };
  }
});
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("pages/index.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};

export { _sfc_main as default };
//# sourceMappingURL=index-D0sRYwML.mjs.map
