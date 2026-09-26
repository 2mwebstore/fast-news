import { _ as _sfc_main$1 } from './NewsCard-HLdAEa9m.mjs';
import { u as usePagedFeed, _ as _sfc_main$2 } from './usePagedFeed-COilPhWI.mjs';
import { _ as _sfc_main$3 } from './SectionHeading-CJAAYZij.mjs';
import { u as useLocale, f as useRoute, i as useRouter, a as useApi, g as useAsyncData, b as useSiteSeo, _ as __nuxt_component_0$1 } from './server.mjs';
import { _ as _sfc_main$4 } from './VideoCard-CM0of8CH.mjs';
import { defineComponent, ref, computed, withAsyncContext, watch, resolveDirective, mergeProps, unref, withCtx, createTextVNode, toDisplayString, useSSRContext } from 'vue';
import { ssrRenderAttrs, ssrInterpolate, ssrRenderAttr, ssrRenderList, ssrGetDirectiveProps, ssrRenderComponent } from 'vue/server-renderer';
import './SmartImage-D_CQTSWD.mjs';
import './BreakingBadge-BUl44HvT.mjs';
import './useFormat-DT1zbtWM.mjs';
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

const _sfc_main = /* @__PURE__ */ defineComponent({
  __name: "search",
  __ssrInlineRender: true,
  async setup(__props) {
    var _a;
    let __temp, __restore;
    const { t } = useLocale();
    const route = useRoute();
    useRouter();
    const api = useApi();
    const term = ref(String((_a = route.query.q) != null ? _a : ""));
    const page = computed(() => Math.max(1, Number(route.query.page) || 1));
    const { data, pending } = ([__temp, __restore] = withAsyncContext(async () => useAsyncData(
      () => `search-${route.query.q}-${page.value}`,
      async () => {
        var _a2;
        const q = String((_a2 = route.query.q) != null ? _a2 : "").trim();
        if (q.length < 2) return null;
        const result = await api.list("/api/search", {
          q,
          page: page.value,
          limit: 20,
          category: route.query.category,
          from: route.query.from,
          to: route.query.to
        });
        return { ...result.data, meta: result.meta };
      },
      { watch: [() => route.query] }
    )), __temp = await __temp, __restore(), __temp);
    const meta = computed(() => {
      var _a2;
      return (_a2 = data.value) == null ? void 0 : _a2.meta;
    });
    const {
      extra: extraArticles,
      loading: feedLoading,
      hasMore: feedHasMore,
      failed: feedFailed,
      next: loadNextPage,
      reset: resetFeed
    } = usePagedFeed(
      async (nextPage) => {
        var _a2, _b;
        const result = await api.list("/api/search", {
          q: String((_a2 = route.query.q) != null ? _a2 : "").trim(),
          page: nextPage,
          limit: 20,
          category: route.query.category,
          from: route.query.from,
          to: route.query.to
        });
        return { data: (_b = result.data.articles) != null ? _b : [], meta: result.meta };
      },
      { meta: meta.value }
    );
    watch(meta, (m) => resetFeed(m), { immediate: true });
    const allArticles = computed(() => {
      var _a2, _b;
      return [...(_b = (_a2 = data.value) == null ? void 0 : _a2.articles) != null ? _b : [], ...extraArticles.value];
    });
    useSiteSeo({
      title: route.query.q ? `${t("searchColon")} ${route.query.q}` : t("searchNews"),
      description: t("searchDesc"),
      path: "/search",
      robots: "noindex, follow"
    });
    return (_ctx, _push, _parent, _attrs) => {
      var _a2, _b;
      const _component_NewsCard = _sfc_main$1;
      const _component_InfiniteFooter = _sfc_main$2;
      const _component_SectionHeading = _sfc_main$3;
      const _component_NuxtLink = __nuxt_component_0$1;
      const _component_VideoCard = _sfc_main$4;
      const _directive_reveal = resolveDirective("reveal");
      _push(`<div${ssrRenderAttrs(mergeProps({ class: "container-content" }, _attrs))}><h1 class="text-kh-2xl font-bold">${ssrInterpolate(unref(t)("search"))}</h1><form class="mt-4 flex gap-2"><input${ssrRenderAttr("value", unref(term))} type="search" name="q"${ssrRenderAttr("placeholder", unref(t)("searchKeyword"))} class="w-full rounded-lg border border-line bg-surface-muted px-4 py-3 text-kh-base outline-none focus:border-brand"><button type="submit" class="rounded-lg bg-brand px-6 py-3 font-semibold text-white hover:bg-brand-dark">${ssrInterpolate(unref(t)("search"))}</button></form>`);
      if (unref(pending)) {
        _push(`<div class="py-12 text-center text-ink-muted">${ssrInterpolate(unref(t)("searching"))}</div>`);
      } else if (!unref(data)) {
        _push(`<div class="py-12 text-center text-kh-base text-ink-muted">${ssrInterpolate(unref(t)("searchMinChars"))}</div>`);
      } else {
        _push(`<!--[--><p class="mt-6 text-sm text-ink-muted">${ssrInterpolate(unref(t)("foundResults", { n: (_b = (_a2 = unref(meta)) == null ? void 0 : _a2.total) != null ? _b : 0, q: unref(data).query }))}</p><div class="mt-4 grid gap-8 lg:grid-cols-3"><div class="lg:col-span-2">`);
        if (unref(allArticles).length) {
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
        } else {
          _push(`<p class="py-12 text-center text-kh-base text-ink-muted">${ssrInterpolate(unref(t)("noArticlesFound"))}</p>`);
        }
        _push(`<div aria-hidden="true"></div>`);
        if (unref(allArticles).length) {
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
        if (unref(data).categories.length) {
          _push(`<section>`);
          _push(ssrRenderComponent(_component_SectionHeading, {
            title: unref(t)("inSections")
          }, null, _parent));
          _push(`<ul class="space-y-2"><!--[-->`);
          ssrRenderList(unref(data).categories, (c) => {
            _push(`<li>`);
            _push(ssrRenderComponent(_component_NuxtLink, {
              to: `/category/${c.slug}`,
              class: "text-kh-sm hover:text-brand"
            }, {
              default: withCtx((_, _push2, _parent2, _scopeId) => {
                if (_push2) {
                  _push2(`${ssrInterpolate(c.icon)} ${ssrInterpolate(c.nameKh)}`);
                } else {
                  return [
                    createTextVNode(toDisplayString(c.icon) + " " + toDisplayString(c.nameKh), 1)
                  ];
                }
              }),
              _: 2
            }, _parent));
            _push(`</li>`);
          });
          _push(`<!--]--></ul></section>`);
        } else {
          _push(`<!---->`);
        }
        if (unref(data).authors.length) {
          _push(`<section>`);
          _push(ssrRenderComponent(_component_SectionHeading, {
            title: unref(t)("authors")
          }, null, _parent));
          _push(`<ul class="space-y-2"><!--[-->`);
          ssrRenderList(unref(data).authors, (a) => {
            _push(`<li>`);
            _push(ssrRenderComponent(_component_NuxtLink, {
              to: `/author/${a.slug}`,
              class: "text-kh-sm hover:text-brand"
            }, {
              default: withCtx((_, _push2, _parent2, _scopeId) => {
                if (_push2) {
                  _push2(`${ssrInterpolate(a.nameKh)}`);
                } else {
                  return [
                    createTextVNode(toDisplayString(a.nameKh), 1)
                  ];
                }
              }),
              _: 2
            }, _parent));
            _push(`</li>`);
          });
          _push(`<!--]--></ul></section>`);
        } else {
          _push(`<!---->`);
        }
        if (unref(data).videos.length) {
          _push(`<section>`);
          _push(ssrRenderComponent(_component_SectionHeading, {
            title: unref(t)("inVideos")
          }, null, _parent));
          _push(`<div class="space-y-4"><!--[-->`);
          ssrRenderList(unref(data).videos, (v) => {
            _push(ssrRenderComponent(_component_VideoCard, {
              key: v.id,
              video: v
            }, null, _parent));
          });
          _push(`<!--]--></div></section>`);
        } else {
          _push(`<!---->`);
        }
        _push(`</aside></div><!--]-->`);
      }
      _push(`</div>`);
    };
  }
});
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("pages/search.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};

export { _sfc_main as default };
//# sourceMappingURL=search-DoOtiKVB.mjs.map
