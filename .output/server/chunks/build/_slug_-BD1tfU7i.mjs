import { _ as _sfc_main$1 } from './AdSlot-DGDlUSRS.mjs';
import { u as useLocale, f as useRoute, a as useApi, g as useAsyncData, p as pageError, h as createError, s as useCategorySeo, o as useBreadcrumbSchema, _ as __nuxt_component_0$1 } from './server.mjs';
import { _ as _sfc_main$2 } from './NewsCard-HLdAEa9m.mjs';
import { u as usePagedFeed, _ as _sfc_main$3 } from './usePagedFeed-COilPhWI.mjs';
import { _ as _sfc_main$4 } from './ArticleSidebarTrending-DEFecVDy.mjs';
import { _ as _sfc_main$5 } from './NewsPulse--M0PNvod.mjs';
import { defineComponent, computed, withAsyncContext, watch, resolveDirective, mergeProps, unref, withCtx, createTextVNode, toDisplayString, useSSRContext } from 'vue';
import { ssrRenderAttrs, ssrRenderComponent, ssrRenderStyle, ssrRenderAttr, ssrInterpolate, ssrRenderList, ssrGetDirectiveProps } from 'vue/server-renderer';
import './index-C4JB2zdt.mjs';
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
import './SmartImage-D_CQTSWD.mjs';
import './BreakingBadge-BUl44HvT.mjs';
import './useFormat-DT1zbtWM.mjs';
import './TrendingList-BOx8JOT1.mjs';
import './SectionHeading-CJAAYZij.mjs';

const _sfc_main = /* @__PURE__ */ defineComponent({
  __name: "[slug]",
  __ssrInlineRender: true,
  async setup(__props) {
    var _a;
    let __temp, __restore;
    const { t } = useLocale();
    const route = useRoute();
    const api = useApi();
    const slug = computed(() => String(route.params.slug));
    const page = computed(() => Math.max(1, Number(route.query.page) || 1));
    const limit = computed(() => Math.min(60, Math.max(5, Number(route.query.limit) || 20)));
    const { data, error } = ([__temp, __restore] = withAsyncContext(async () => useAsyncData(
      () => `category-${slug.value}-${page.value}`,
      async () => {
        const result = await api.list(
          `/api/categories/${slug.value}`,
          { page: page.value, limit: limit.value }
        );
        return { ...result.data, meta: result.meta };
      },
      { watch: [slug, page, limit] }
    )), __temp = await __temp, __restore(), __temp);
    if (error.value) throw pageError(error.value, "Category not found");
    if (!((_a = data.value) == null ? void 0 : _a.category)) {
      throw createError({ statusCode: 404, statusMessage: "Category not found", fatal: true });
    }
    const category = computed(() => data.value.category);
    const articles = computed(() => {
      var _a2;
      return (_a2 = data.value.articles) != null ? _a2 : [];
    });
    const meta = computed(() => data.value.meta);
    const {
      extra: extraArticles,
      loading: feedLoading,
      hasMore: feedHasMore,
      failed: feedFailed,
      next: loadNextPage,
      reset: resetFeed
    } = usePagedFeed(
      async (nextPage) => {
        var _a2;
        const result = await api.list(
          `/api/categories/${slug.value}`,
          { page: nextPage, limit: limit.value }
        );
        return { data: (_a2 = result.data.articles) != null ? _a2 : [], meta: result.meta };
      },
      { meta: meta.value }
    );
    watch(meta, (m) => resetFeed(m), { immediate: true });
    const allArticles = computed(() => [...articles.value, ...extraArticles.value]);
    useCategorySeo(category.value, page.value);
    useBreadcrumbSchema([
      { name: t("home"), path: "/" },
      ...category.value.parent ? [{ name: category.value.parent.nameKh, path: `/category/${category.value.parent.slug}` }] : [],
      { name: category.value.nameKh, path: `/category/${category.value.slug}` }
    ]);
    return (_ctx, _push, _parent, _attrs) => {
      var _a2;
      const _component_AdSlot = _sfc_main$1;
      const _component_NuxtLink = __nuxt_component_0$1;
      const _component_NewsCard = _sfc_main$2;
      const _component_InfiniteFooter = _sfc_main$3;
      const _component_ArticleSidebarTrending = _sfc_main$4;
      const _component_NewsPulse = _sfc_main$5;
      const _directive_reveal = resolveDirective("reveal");
      _push(`<div${ssrRenderAttrs(mergeProps({ class: "container-content" }, _attrs))}>`);
      _push(ssrRenderComponent(_component_AdSlot, {
        position: "CATEGORY_TOP",
        category: unref(slug),
        "collapse-when-empty": ""
      }, null, _parent));
      _push(`<header class="border-b-2 border-brand pb-4" style="${ssrRenderStyle(unref(category).color ? { borderColor: unref(category).color } : void 0)}"><nav${ssrRenderAttr("aria-label", unref(t)("breadcrumb"))} class="mb-2 flex items-center gap-1.5 text-xs text-ink-muted">`);
      _push(ssrRenderComponent(_component_NuxtLink, {
        to: "/",
        class: "hover:text-brand"
      }, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(`${ssrInterpolate(unref(t)("home"))}`);
          } else {
            return [
              createTextVNode(toDisplayString(unref(t)("home")), 1)
            ];
          }
        }),
        _: 1
      }, _parent));
      if (unref(category).parent) {
        _push(`<!--[--><span aria-hidden="true">\u203A</span>`);
        _push(ssrRenderComponent(_component_NuxtLink, {
          to: `/category/${unref(category).parent.slug}`,
          class: "hover:text-brand"
        }, {
          default: withCtx((_, _push2, _parent2, _scopeId) => {
            if (_push2) {
              _push2(`${ssrInterpolate(unref(category).parent.nameKh)}`);
            } else {
              return [
                createTextVNode(toDisplayString(unref(category).parent.nameKh), 1)
              ];
            }
          }),
          _: 1
        }, _parent));
        _push(`<!--]-->`);
      } else {
        _push(`<!---->`);
      }
      _push(`</nav><h1 class="flex items-center gap-2 text-kh-2xl font-bold sm:text-kh-3xl">`);
      if (unref(category).icon) {
        _push(`<span aria-hidden="true">${ssrInterpolate(unref(category).icon)}</span>`);
      } else {
        _push(`<!---->`);
      }
      _push(` ${ssrInterpolate(unref(category).nameKh)}</h1>`);
      if (unref(category).descKh) {
        _push(`<p class="mt-2 max-w-prose text-kh-base text-ink-muted khmer-wrap">${ssrInterpolate(unref(category).descKh)}</p>`);
      } else {
        _push(`<!---->`);
      }
      if ((_a2 = unref(category).children) == null ? void 0 : _a2.length) {
        _push(`<nav class="mt-4 flex flex-wrap gap-2"${ssrRenderAttr("aria-label", unref(t)("subsections"))}><!--[-->`);
        ssrRenderList(unref(category).children, (child) => {
          _push(ssrRenderComponent(_component_NuxtLink, {
            key: child.slug,
            to: `/category/${child.slug}`,
            class: "rounded-full border border-line px-3 py-1 text-kh-sm hover:border-brand hover:text-brand"
          }, {
            default: withCtx((_, _push2, _parent2, _scopeId) => {
              if (_push2) {
                _push2(`${ssrInterpolate(child.nameKh)}`);
              } else {
                return [
                  createTextVNode(toDisplayString(child.nameKh), 1)
                ];
              }
            }),
            _: 2
          }, _parent));
        });
        _push(`<!--]--></nav>`);
      } else {
        _push(`<!---->`);
      }
      _push(`</header><div class="mt-6 grid gap-8 lg:grid-cols-3"><div class="lg:col-span-2">`);
      if (!unref(articles).length) {
        _push(`<p class="py-12 text-center text-kh-base text-ink-muted">${ssrInterpolate(unref(t)("noArticlesInSection"))}</p>`);
      } else {
        _push(`<ul class="divide-y divide-line"><!--[-->`);
        ssrRenderList(unref(allArticles), (article) => {
          _push(`<li${ssrRenderAttrs(mergeProps({
            key: article.id,
            class: "py-4 first:pt-0"
          }, ssrGetDirectiveProps(_ctx, _directive_reveal)))}>`);
          _push(ssrRenderComponent(_component_NewsCard, {
            article,
            variant: "list",
            "show-time": ""
          }, null, _parent));
          _push(`</li>`);
        });
        _push(`<!--]--></ul>`);
      }
      _push(`<div aria-hidden="true"></div>`);
      if (unref(articles).length) {
        _push(ssrRenderComponent(_component_InfiniteFooter, {
          loading: unref(feedLoading),
          "has-more": unref(feedHasMore),
          failed: unref(feedFailed),
          "show-end": "",
          onNext: unref(loadNextPage)
        }, null, _parent));
      } else {
        _push(`<!---->`);
      }
      _push(`</div><aside class="space-y-8">`);
      _push(ssrRenderComponent(_component_AdSlot, {
        position: "CATEGORY_SIDEBAR",
        category: unref(slug),
        "collapse-when-empty": ""
      }, null, _parent));
      _push(ssrRenderComponent(_component_ArticleSidebarTrending, null, null, _parent));
      _push(ssrRenderComponent(_component_NewsPulse, null, null, _parent));
      _push(`</aside></div></div>`);
    };
  }
});
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("pages/category/[slug].vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};

export { _sfc_main as default };
//# sourceMappingURL=_slug_-BD1tfU7i.mjs.map
