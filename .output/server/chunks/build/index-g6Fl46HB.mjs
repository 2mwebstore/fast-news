import { f as useRoute, i as useRouter, j as useHead, _ as __nuxt_component_0$1 } from './server.mjs';
import { _ as _sfc_main$1 } from './SearchInput-BSakqtC5.mjs';
import { _ as _sfc_main$2 } from './SelectField-vCKw5R9_.mjs';
import { _ as _sfc_main$3 } from './SmartImage-D_CQTSWD.mjs';
import { _ as _sfc_main$4 } from './AdminStatusBadge-Raz2wPvs.mjs';
import { _ as _sfc_main$5 } from './BreakingBadge-BUl44HvT.mjs';
import { u as usePagedFeed, _ as _sfc_main$6 } from './usePagedFeed-COilPhWI.mjs';
import { _ as __nuxt_component_2 } from './ConfirmDialog-BxaeJdx9.mjs';
import { defineComponent, ref, computed, watch, unref, withCtx, createTextVNode, toDisplayString, isRef, useSSRContext } from 'vue';
import { ssrRenderAttrs, ssrInterpolate, ssrRenderComponent, ssrRenderList, ssrRenderClass } from 'vue/server-renderer';
import { a as useAdminApi, u as useAdminLocale, b as useAuthStore } from './useAdminApi-SsuwQDOr.mjs';
import { u as useFormat } from './useFormat-DT1zbtWM.mjs';
import { u as useMeta } from './useMeta-DYb9wm5F.mjs';
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
import './index-C4JB2zdt.mjs';
import './_plugin-vue_export-helper-1tPrXgE0.mjs';

const _sfc_main = /* @__PURE__ */ defineComponent({
  __name: "index",
  __ssrInlineRender: true,
  setup(__props) {
    var _a;
    const api = useAdminApi();
    const route = useRoute();
    const router = useRouter();
    const { dateTime } = useFormat();
    const { t, locale, contentTitle } = useAdminLocale();
    const { meta: platformMeta, toOptions } = useMeta();
    const auth = useAuthStore();
    const pendingDelete = ref(null);
    const deleting = ref(false);
    const deleteError = ref("");
    const articles = ref([]);
    const meta = ref(null);
    const loading = ref(true);
    const search = ref(String((_a = route.query.search) != null ? _a : ""));
    const status = computed(() => {
      var _a2;
      return String((_a2 = route.query.status) != null ? _a2 : "");
    });
    const limit = computed(() => Number(route.query.limit) || 25);
    const statusOptions = computed(() => {
      var _a2;
      return [
        { value: "", label: t("all") },
        ...toOptions((_a2 = platformMeta.value) == null ? void 0 : _a2.articleStatuses, locale.value)
      ];
    });
    const limitOptions = [25, 50, 100].map((n) => ({ value: n, label: String(n) }));
    async function confirmDelete() {
      var _a2;
      if (!pendingDelete.value) return;
      deleting.value = true;
      deleteError.value = "";
      try {
        await api.del(`/api/news/${pendingDelete.value.id}`);
        pendingDelete.value = null;
        await load();
      } catch (e) {
        deleteError.value = ((_a2 = e.data) == null ? void 0 : _a2.message) || "Could not delete the article.";
      } finally {
        deleting.value = false;
      }
    }
    function query(page) {
      var _a2;
      return {
        status: status.value || void 0,
        search: String((_a2 = route.query.search) != null ? _a2 : "") || void 0,
        page,
        limit: limit.value
      };
    }
    async function load() {
      var _a2, _b;
      loading.value = true;
      try {
        const result = await api.list("/api/admin/news", query(1));
        articles.value = (_a2 = result.data) != null ? _a2 : [];
        meta.value = (_b = result.meta) != null ? _b : null;
        resetFeed(result.meta);
      } finally {
        loading.value = false;
      }
    }
    const {
      extra: extraArticles,
      loading: feedLoading,
      hasMore: feedHasMore,
      failed: feedFailed,
      next: loadNextPage,
      reset: resetFeed
    } = usePagedFeed(
      async (page) => {
        var _a2;
        const result = await api.list("/api/admin/news", query(page));
        return { data: (_a2 = result.data) != null ? _a2 : [], meta: result.meta };
      },
      { meta: null }
    );
    const rows = computed(() => [...articles.value, ...extraArticles.value]);
    watch(() => route.query, load);
    function applySearch(value) {
      router.push({ query: { ...route.query, search: value || void 0, page: void 0 } });
    }
    function setLimit(next) {
      router.push({ query: { ...route.query, limit: next, page: void 0 } });
    }
    useHead({ title: "Articles \u2014 Newsroom" });
    return (_ctx, _push, _parent, _attrs) => {
      var _a2;
      const _component_NuxtLink = __nuxt_component_0$1;
      const _component_SearchInput = _sfc_main$1;
      const _component_SelectField = _sfc_main$2;
      const _component_SmartImage = _sfc_main$3;
      const _component_AdminStatusBadge = _sfc_main$4;
      const _component_BreakingBadge = _sfc_main$5;
      const _component_InfiniteFooter = _sfc_main$6;
      const _component_ConfirmDialog = __nuxt_component_2;
      _push(`<div${ssrRenderAttrs(_attrs)}><div class="mb-4 flex flex-wrap items-center justify-between gap-3"><div><h1 class="text-xl font-bold">${ssrInterpolate(unref(t)("articles"))}</h1>`);
      if (unref(meta)) {
        _push(`<p class="text-sm text-ink-muted">${ssrInterpolate(unref(t)("showing", { shown: unref(rows).length, total: unref(meta).total }))}</p>`);
      } else {
        _push(`<!---->`);
      }
      _push(`</div>`);
      _push(ssrRenderComponent(_component_NuxtLink, {
        to: "/admin/news/create",
        class: "rounded-lg bg-brand px-4 py-2 text-sm font-semibold text-white hover:bg-brand-dark"
      }, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(`${ssrInterpolate(unref(t)("newArticle"))}`);
          } else {
            return [
              createTextVNode(toDisplayString(unref(t)("newArticle")), 1)
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(`</div><div class="mb-4 space-y-3"><div class="flex flex-wrap items-center gap-2"><!--[-->`);
      ssrRenderList(unref(statusOptions), (option) => {
        _push(`<button class="${ssrRenderClass([
          "rounded-full border px-3 py-1.5 text-sm transition-colors",
          unref(status) === option.value ? "border-brand bg-brand text-white" : "border-line hover:border-brand"
        ])}">${ssrInterpolate(option.label)}</button>`);
      });
      _push(`<!--]--></div><div class="flex flex-wrap items-center gap-3"><div class="min-w-[16rem] flex-1">`);
      _push(ssrRenderComponent(_component_SearchInput, {
        modelValue: unref(search),
        "onUpdate:modelValue": ($event) => isRef(search) ? search.value = $event : null,
        placeholder: unref(t)("searchArticles"),
        busy: unref(loading),
        onSearch: applySearch,
        onClear: ($event) => applySearch("")
      }, null, _parent));
      _push(`</div>`);
      _push(ssrRenderComponent(_component_SelectField, {
        "model-value": unref(limit),
        options: unref(limitOptions),
        label: unref(t)("perPage"),
        inline: "",
        size: "sm",
        "onUpdate:modelValue": ($event) => setLimit(Number($event))
      }, null, _parent));
      _push(`</div></div>`);
      if (unref(loading)) {
        _push(`<p class="py-12 text-center text-ink-muted">${ssrInterpolate(unref(t)("loading"))}</p>`);
      } else if (!unref(rows).length) {
        _push(`<p class="card py-12 text-center text-ink-muted">${ssrInterpolate(unref(t)("noResults"))}</p>`);
      } else {
        _push(`<!--[--><div class="card overflow-hidden"><ul class="divide-y divide-line"><!--[-->`);
        ssrRenderList(unref(rows), (article) => {
          _push(`<li class="flex items-start gap-3 p-4 hover:bg-surface-muted">`);
          _push(ssrRenderComponent(_component_SmartImage, {
            src: article.imageUrl,
            alt: article.imageAlt || "",
            width: 64,
            height: 36,
            class: "h-9 w-16 shrink-0 rounded"
          }, null, _parent));
          _push(`<div class="min-w-0 flex-1">`);
          _push(ssrRenderComponent(_component_NuxtLink, {
            to: `/admin/news/${article.id}/edit`,
            class: "block truncate text-kh-sm font-semibold hover:text-brand"
          }, {
            default: withCtx((_, _push2, _parent2, _scopeId) => {
              if (_push2) {
                _push2(`${ssrInterpolate(unref(contentTitle)(article))}`);
              } else {
                return [
                  createTextVNode(toDisplayString(unref(contentTitle)(article)), 1)
                ];
              }
            }),
            _: 2
          }, _parent));
          _push(`<div class="mt-1 flex flex-wrap items-center gap-2 text-xs text-ink-muted">`);
          _push(ssrRenderComponent(_component_AdminStatusBadge, {
            status: article.status
          }, null, _parent));
          if (article.category) {
            _push(`<span>${ssrInterpolate(article.category.nameKh)}</span>`);
          } else {
            _push(`<!---->`);
          }
          if (article.author) {
            _push(`<span>\xB7 ${ssrInterpolate(article.author.nameKh)}</span>`);
          } else {
            _push(`<!---->`);
          }
          _push(`<span>\xB7 ${ssrInterpolate(unref(dateTime)(article.publishedAt || article.updatedAt))}</span><span>\xB7 ${ssrInterpolate(article.wordCount)} ${ssrInterpolate(unref(t)("words"))}</span>`);
          if (article.aiAssisted) {
            _push(`<span class="rounded bg-brand/10 px-1.5 py-0.5 text-brand">AI draft</span>`);
          } else {
            _push(`<!---->`);
          }
          if (article.isBreaking) {
            _push(ssrRenderComponent(_component_BreakingBadge, { small: "" }, null, _parent));
          } else {
            _push(`<!---->`);
          }
          _push(`</div></div><div class="flex shrink-0 gap-1.5">`);
          if (article.status === "published") {
            _push(ssrRenderComponent(_component_NuxtLink, {
              to: `/news/${article.slug}`,
              target: "_blank",
              class: "rounded border border-line px-2 py-1 text-xs hover:bg-surface"
            }, {
              default: withCtx((_, _push2, _parent2, _scopeId) => {
                if (_push2) {
                  _push2(`${ssrInterpolate(unref(t)("view"))}`);
                } else {
                  return [
                    createTextVNode(toDisplayString(unref(t)("view")), 1)
                  ];
                }
              }),
              _: 2
            }, _parent));
          } else {
            _push(`<!---->`);
          }
          if (unref(auth).can("news.delete")) {
            _push(`<button class="rounded border border-breaking px-2 py-1 text-xs text-breaking hover:bg-breaking/5">${ssrInterpolate(unref(t)("remove"))}</button>`);
          } else {
            _push(`<!---->`);
          }
          _push(`</div></li>`);
        });
        _push(`<!--]--></ul></div><div aria-hidden="true"></div>`);
        _push(ssrRenderComponent(_component_InfiniteFooter, {
          loading: unref(feedLoading),
          "has-more": unref(feedHasMore),
          failed: unref(feedFailed),
          "show-end": "",
          onNext: unref(loadNextPage)
        }, null, _parent));
        _push(`<!--]-->`);
      }
      _push(ssrRenderComponent(_component_ConfirmDialog, {
        open: !!unref(pendingDelete),
        title: unref(t)("confirmDeleteTitle"),
        message: unref(pendingDelete) ? unref(contentTitle)(unref(pendingDelete)) : "",
        "require-text": ((_a2 = unref(pendingDelete)) == null ? void 0 : _a2.status) === "published" ? "DELETE" : void 0,
        consequences: [
          "The article is removed from the site, feeds and sitemaps.",
          "Existing links to it will stop working \u2014 add a redirect if it was published.",
          "The record is retired, not destroyed, and stays in the audit log."
        ],
        "confirm-label": unref(t)("remove"),
        busy: unref(deleting),
        onConfirm: confirmDelete,
        onCancel: ($event) => pendingDelete.value = null
      }, null, _parent));
      if (unref(deleteError)) {
        _push(`<p class="mt-3 rounded-lg bg-breaking/10 p-3 text-sm text-breaking">${ssrInterpolate(unref(deleteError))}</p>`);
      } else {
        _push(`<!---->`);
      }
      _push(`</div>`);
    };
  }
});
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("pages/admin/news/index.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};

export { _sfc_main as default };
//# sourceMappingURL=index-g6Fl46HB.mjs.map
