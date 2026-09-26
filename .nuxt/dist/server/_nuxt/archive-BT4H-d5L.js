import { _ as _sfc_main$1 } from "./SectionHeading-CJAAYZij.js";
import { u as useLocale, f as useRoute, a as useApi, g as useAsyncData, c as useAsyncApi, M as MONTH_NAMES, b as useSiteSeo, _ as __nuxt_component_0 } from "../server.mjs";
import { _ as _sfc_main$2 } from "./NewsCard-HLdAEa9m.js";
import { u as usePagedFeed, _ as _sfc_main$3 } from "./usePagedFeed-COilPhWI.js";
import { defineComponent, computed, withAsyncContext, watch, resolveDirective, mergeProps, unref, withCtx, createTextVNode, toDisplayString, useSSRContext } from "vue";
import { ssrRenderAttrs, ssrInterpolate, ssrRenderComponent, ssrRenderList, ssrGetDirectiveProps } from "vue/server-renderer";
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
import "./SmartImage-D_CQTSWD.js";
import "./BreakingBadge-BUl44HvT.js";
import "./useFormat-DT1zbtWM.js";
import "./index-C4JB2zdt.js";
const FIRST_YEAR = 2025;
const _sfc_main = /* @__PURE__ */ defineComponent({
  __name: "archive",
  __ssrInlineRender: true,
  async setup(__props) {
    let __temp, __restore;
    const { t, locale } = useLocale();
    const route = useRoute();
    const api = useApi();
    const year = computed(() => Number(route.query.year) || 0);
    const month = computed(() => Number(route.query.month) || 0);
    const category = computed(() => String(route.query.category ?? ""));
    const page = computed(() => Math.max(1, Number(route.query.page) || 1));
    const limit = computed(() => Math.min(60, Math.max(5, Number(route.query.limit) || 30)));
    const { data } = ([__temp, __restore] = withAsyncContext(async () => useAsyncData(
      () => `archive-${year.value}-${month.value}-${category.value}-${page.value}`,
      async () => {
        const result = await api.list("/api/archive", {
          year: year.value || void 0,
          month: month.value || void 0,
          category: category.value || void 0,
          page: page.value,
          limit: limit.value
        });
        return { articles: result.data, meta: result.meta };
      },
      { watch: [() => route.query] }
    )), __temp = await __temp, __restore(), __temp);
    const { data: categories } = ([__temp, __restore] = withAsyncContext(() => useAsyncApi("nav-categories", "/api/categories")), __temp = await __temp, __restore(), __temp);
    const articles = computed(() => data.value?.articles ?? []);
    const meta = computed(() => data.value?.meta);
    const {
      extra: extraArticles,
      loading: feedLoading,
      hasMore: feedHasMore,
      failed: feedFailed,
      next: loadNextPage,
      reset: resetFeed
    } = usePagedFeed(
      async (nextPage) => {
        const result = await api.list("/api/archive", {
          year: year.value || void 0,
          month: month.value || void 0,
          category: category.value || void 0,
          page: nextPage,
          limit: limit.value
        });
        return { data: result.data ?? [], meta: result.meta };
      },
      { meta: meta.value }
    );
    watch(meta, (m) => resetFeed(m), { immediate: true });
    const allArticles = computed(() => [...articles.value, ...extraArticles.value]);
    const monthNames = computed(() => MONTH_NAMES[locale.value]);
    const now = /* @__PURE__ */ new Date();
    const currentYear = now.getFullYear();
    const listedYear = computed(() => year.value || currentYear);
    const years = computed(() => {
      const out = [];
      for (let y = currentYear; y >= FIRST_YEAR; y -= 1) out.push(y);
      return out;
    });
    const months = computed(() => {
      const lastMonth = listedYear.value === currentYear ? now.getMonth() + 1 : 12;
      return Array.from({ length: lastMonth }, (_, i) => {
        const monthNumber = lastMonth - i;
        return {
          year: listedYear.value,
          month: monthNumber,
          label: `${monthNames.value[monthNumber - 1]} ${listedYear.value}`
        };
      });
    });
    const hasContent = computed(() => articles.value.length > 0);
    useSiteSeo({
      title: year.value ? t("archiveFor", { month: monthNames.value[month.value - 1] ?? "", year: year.value }) : t("archiveTitle"),
      description: t("archiveDesc"),
      path: "/archive",
      robots: hasContent.value && page.value === 1 ? void 0 : "noindex, follow"
    });
    return (_ctx, _push, _parent, _attrs) => {
      const _component_SectionHeading = _sfc_main$1;
      const _component_NuxtLink = __nuxt_component_0;
      const _component_NewsCard = _sfc_main$2;
      const _component_InfiniteFooter = _sfc_main$3;
      const _directive_reveal = resolveDirective("reveal");
      _push(`<div${ssrRenderAttrs(mergeProps({ class: "container-content" }, _attrs))}><h1 class="text-kh-2xl font-bold">${ssrInterpolate(unref(t)("archiveTitle"))}</h1><div class="mt-6 grid gap-8 lg:grid-cols-4"><aside class="lg:col-span-1">`);
      _push(ssrRenderComponent(_component_SectionHeading, {
        title: unref(t)("byMonth")
      }, null, _parent));
      if (unref(years).length > 1) {
        _push(`<div class="mb-2 flex flex-wrap gap-1"><!--[-->`);
        ssrRenderList(unref(years), (y) => {
          _push(ssrRenderComponent(_component_NuxtLink, {
            key: y,
            to: { path: "/archive", query: { year: y, category: unref(category) || void 0 } },
            class: [
              "rounded px-2 py-1 text-xs font-semibold",
              unref(listedYear) === y ? "bg-brand text-white" : "border border-line hover:border-brand"
            ]
          }, {
            default: withCtx((_, _push2, _parent2, _scopeId) => {
              if (_push2) {
                _push2(`${ssrInterpolate(y)}`);
              } else {
                return [
                  createTextVNode(toDisplayString(y), 1)
                ];
              }
            }),
            _: 2
          }, _parent));
        });
        _push(`<!--]--></div>`);
      } else {
        _push(`<!---->`);
      }
      _push(`<ul class="max-h-80 space-y-1 overflow-y-auto pr-2"><!--[-->`);
      ssrRenderList(unref(months), (m) => {
        _push(`<li>`);
        _push(ssrRenderComponent(_component_NuxtLink, {
          to: { path: "/archive", query: { year: m.year, month: m.month, category: unref(category) || void 0 } },
          class: [
            "block rounded px-2 py-1.5 text-kh-sm",
            unref(year) === m.year && unref(month) === m.month ? "bg-brand text-white" : "hover:bg-surface-muted"
          ]
        }, {
          default: withCtx((_, _push2, _parent2, _scopeId) => {
            if (_push2) {
              _push2(`${ssrInterpolate(m.label)}`);
            } else {
              return [
                createTextVNode(toDisplayString(m.label), 1)
              ];
            }
          }),
          _: 2
        }, _parent));
        _push(`</li>`);
      });
      _push(`<!--]--></ul>`);
      _push(ssrRenderComponent(_component_SectionHeading, {
        title: unref(t)("bySection"),
        class: "mt-6"
      }, null, _parent));
      _push(`<ul class="space-y-1"><li>`);
      _push(ssrRenderComponent(_component_NuxtLink, {
        to: { path: "/archive", query: { year: unref(year) || void 0, month: unref(month) || void 0 } },
        class: ["block rounded px-2 py-1.5 text-kh-sm", !unref(category) ? "bg-brand text-white" : "hover:bg-surface-muted"]
      }, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(`${ssrInterpolate(unref(t)("all"))}`);
          } else {
            return [
              createTextVNode(toDisplayString(unref(t)("all")), 1)
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(`</li><!--[-->`);
      ssrRenderList(unref(categories) ?? [], (c) => {
        _push(`<li>`);
        _push(ssrRenderComponent(_component_NuxtLink, {
          to: { path: "/archive", query: { year: unref(year) || void 0, month: unref(month) || void 0, category: c.slug } },
          class: ["block rounded px-2 py-1.5 text-kh-sm", unref(category) === c.slug ? "bg-brand text-white" : "hover:bg-surface-muted"]
        }, {
          default: withCtx((_, _push2, _parent2, _scopeId) => {
            if (_push2) {
              _push2(`${ssrInterpolate(c.nameKh)}`);
            } else {
              return [
                createTextVNode(toDisplayString(c.nameKh), 1)
              ];
            }
          }),
          _: 2
        }, _parent));
        _push(`</li>`);
      });
      _push(`<!--]--></ul></aside><div class="lg:col-span-3">`);
      if (!unref(hasContent)) {
        _push(`<p class="py-12 text-center text-kh-base text-ink-muted">${ssrInterpolate(unref(t)("noArticlesForSelection"))}</p>`);
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
      if (unref(hasContent)) {
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
      _push(`</div></div></div>`);
    };
  }
});
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("pages/archive.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
export {
  _sfc_main as default
};
//# sourceMappingURL=archive-BT4H-d5L.js.map
