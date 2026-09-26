import { f as useRoute, i as useRouter, j as useHead, _ as __nuxt_component_0$1 } from './server.mjs';
import { _ as _sfc_main$1 } from './SearchInput-BSakqtC5.mjs';
import { _ as _sfc_main$2 } from './SelectField-vCKw5R9_.mjs';
import { _ as _sfc_main$3 } from './SmartImage-D_CQTSWD.mjs';
import { _ as _sfc_main$4 } from './AdminStatusBadge-Raz2wPvs.mjs';
import { _ as _sfc_main$5 } from './Pagination-BJJJD7ck.mjs';
import { _ as __nuxt_component_2 } from './ConfirmDialog-BxaeJdx9.mjs';
import { defineComponent, ref, computed, watch, unref, withCtx, createTextVNode, toDisplayString, isRef, useSSRContext } from 'vue';
import { ssrRenderAttrs, ssrInterpolate, ssrRenderComponent, ssrRenderList, ssrRenderClass, ssrRenderAttr } from 'vue/server-renderer';
import { a as useAdminApi, b as useAuthStore, u as useAdminLocale } from './useAdminApi-SsuwQDOr.mjs';
import { u as useMeta } from './useMeta-DYb9wm5F.mjs';
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
    const auth = useAuthStore();
    const { t, locale } = useAdminLocale();
    const { meta: platformMeta, toOptions } = useMeta();
    const { dateTime, duration, compact } = useFormat();
    const videos = ref([]);
    const meta = ref(null);
    const loading = ref(true);
    const search = ref(String((_a = route.query.search) != null ? _a : ""));
    const status = computed(() => {
      var _a2;
      return String((_a2 = route.query.status) != null ? _a2 : "");
    });
    const limit = computed(() => Number(route.query.limit) || 25);
    const page = computed(() => Math.max(1, Number(route.query.page) || 1));
    const pendingDelete = ref(null);
    const deleting = ref(false);
    const errorMessage = ref("");
    const statusOptions = computed(() => {
      var _a2;
      return [
        { value: "", label: t("all") },
        ...toOptions((_a2 = platformMeta.value) == null ? void 0 : _a2.videoStatuses, locale.value)
      ];
    });
    const limitOptions = [25, 50, 100].map((n) => ({ value: n, label: String(n) }));
    async function load() {
      var _a2, _b, _c;
      loading.value = true;
      try {
        const result = await api.list("/api/admin/videos", {
          status: status.value || void 0,
          search: String((_a2 = route.query.search) != null ? _a2 : "") || void 0,
          page: page.value,
          limit: limit.value
        });
        videos.value = (_b = result.data) != null ? _b : [];
        meta.value = (_c = result.meta) != null ? _c : null;
      } finally {
        loading.value = false;
      }
    }
    watch(() => route.query, load);
    function setQuery(patch) {
      router.push({ query: { ...route.query, ...patch, page: void 0 } });
    }
    async function confirmDelete() {
      var _a2;
      if (!pendingDelete.value) return;
      deleting.value = true;
      errorMessage.value = "";
      try {
        await api.del(`/api/videos/${pendingDelete.value.id}`);
        pendingDelete.value = null;
        await load();
      } catch (e) {
        errorMessage.value = ((_a2 = e.data) == null ? void 0 : _a2.message) || "Could not delete the video.";
      } finally {
        deleting.value = false;
      }
    }
    function title(video) {
      return locale.value === "en" && video.titleEn ? video.titleEn : video.titleKh;
    }
    useHead({ title: "Videos \u2014 Newsroom" });
    return (_ctx, _push, _parent, _attrs) => {
      const _component_NuxtLink = __nuxt_component_0$1;
      const _component_SearchInput = _sfc_main$1;
      const _component_SelectField = _sfc_main$2;
      const _component_SmartImage = _sfc_main$3;
      const _component_AdminStatusBadge = _sfc_main$4;
      const _component_Pagination = _sfc_main$5;
      const _component_ConfirmDialog = __nuxt_component_2;
      _push(`<div${ssrRenderAttrs(_attrs)}><div class="mb-4 flex flex-wrap items-center justify-between gap-3"><div><h1 class="text-xl font-bold">${ssrInterpolate(unref(t)("videos"))}</h1>`);
      if (unref(meta)) {
        _push(`<p class="text-sm text-ink-muted">${ssrInterpolate(unref(t)("showing", { shown: unref(videos).length, total: unref(meta).total }))}</p>`);
      } else {
        _push(`<!---->`);
      }
      _push(`</div>`);
      _push(ssrRenderComponent(_component_NuxtLink, {
        to: "/admin/videos/create",
        class: "rounded-lg bg-brand px-4 py-2 text-sm font-semibold text-white hover:bg-brand-dark"
      }, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(`+ ${ssrInterpolate(unref(t)("create"))}`);
          } else {
            return [
              createTextVNode("+ " + toDisplayString(unref(t)("create")), 1)
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
        placeholder: unref(t)("searchVideos"),
        busy: unref(loading),
        onSearch: ($event) => setQuery({ search: $event || void 0 }),
        onClear: ($event) => setQuery({ search: void 0 })
      }, null, _parent));
      _push(`</div>`);
      _push(ssrRenderComponent(_component_SelectField, {
        "model-value": unref(limit),
        options: unref(limitOptions),
        label: unref(t)("perPage"),
        inline: "",
        size: "sm",
        "onUpdate:modelValue": ($event) => setQuery({ limit: Number($event) })
      }, null, _parent));
      _push(`</div></div>`);
      if (unref(errorMessage)) {
        _push(`<p class="mb-4 rounded-lg bg-breaking/10 p-3 text-sm text-breaking">${ssrInterpolate(unref(errorMessage))}</p>`);
      } else {
        _push(`<!---->`);
      }
      if (unref(loading)) {
        _push(`<p class="py-12 text-center text-ink-muted">${ssrInterpolate(unref(t)("loading"))}</p>`);
      } else if (!unref(videos).length) {
        _push(`<p class="card py-12 text-center text-ink-muted">${ssrInterpolate(unref(t)("noResults"))}</p>`);
      } else {
        _push(`<!--[--><div class="card overflow-hidden"><ul class="divide-y divide-line"><!--[-->`);
        ssrRenderList(unref(videos), (video) => {
          _push(`<li class="flex flex-wrap items-start gap-3 p-4 hover:bg-surface-muted">`);
          _push(ssrRenderComponent(_component_SmartImage, {
            src: video.thumbnailUrl,
            alt: video.thumbnailAlt || title(video),
            width: 64,
            height: 36,
            class: "h-9 w-16 shrink-0 rounded"
          }, null, _parent));
          _push(`<div class="min-w-0 flex-1">`);
          _push(ssrRenderComponent(_component_NuxtLink, {
            to: `/admin/videos/${video.id}/edit`,
            class: "block truncate text-kh-sm font-semibold hover:text-brand"
          }, {
            default: withCtx((_, _push2, _parent2, _scopeId) => {
              if (_push2) {
                _push2(`${ssrInterpolate(title(video))}`);
              } else {
                return [
                  createTextVNode(toDisplayString(title(video)), 1)
                ];
              }
            }),
            _: 2
          }, _parent));
          _push(`<div class="mt-1 flex flex-wrap items-center gap-2 text-xs text-ink-muted">`);
          _push(ssrRenderComponent(_component_AdminStatusBadge, {
            status: video.status
          }, null, _parent));
          if (video.category) {
            _push(`<span>${ssrInterpolate(unref(locale) === "en" ? video.category.nameEn : video.category.nameKh)}</span>`);
          } else {
            _push(`<!---->`);
          }
          if (video.durationSec) {
            _push(`<span class="tabular-nums">\xB7 ${ssrInterpolate(unref(duration)(video.durationSec))}</span>`);
          } else {
            _push(`<!---->`);
          }
          _push(`<span>\xB7 ${ssrInterpolate(unref(dateTime)(video.publishedAt || video.updatedAt))}</span><span>\xB7 ${ssrInterpolate(unref(compact)(video.viewCount))}</span></div><a${ssrRenderAttr("href", video.watchUrl)} target="_blank" rel="noopener" class="mt-1 block truncate text-xs text-ink-muted hover:text-brand">youtube.com/watch?v=${ssrInterpolate(video.youtubeId)}</a></div><div class="flex shrink-0 flex-wrap gap-1.5">`);
          _push(ssrRenderComponent(_component_NuxtLink, {
            to: `/admin/videos/${video.id}/edit`,
            class: "rounded border border-line px-2 py-1 text-xs hover:bg-surface"
          }, {
            default: withCtx((_, _push2, _parent2, _scopeId) => {
              if (_push2) {
                _push2(`${ssrInterpolate(unref(t)("edit"))}`);
              } else {
                return [
                  createTextVNode(toDisplayString(unref(t)("edit")), 1)
                ];
              }
            }),
            _: 2
          }, _parent));
          if (video.status === "published") {
            _push(ssrRenderComponent(_component_NuxtLink, {
              to: `/video/${video.slug}`,
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
          if (video.status !== "published") {
            _push(`<button class="rounded bg-success px-2 py-1 text-xs font-semibold text-white hover:opacity-90">${ssrInterpolate(unref(t)("statusPublished"))}</button>`);
          } else {
            _push(`<button class="rounded border border-line px-2 py-1 text-xs hover:bg-surface">${ssrInterpolate(unref(t)("statusArchived"))}</button>`);
          }
          if (unref(auth).can("video.manage")) {
            _push(`<button class="rounded border border-breaking px-2 py-1 text-xs text-breaking hover:bg-breaking/5">${ssrInterpolate(unref(t)("remove"))}</button>`);
          } else {
            _push(`<!---->`);
          }
          _push(`</div></li>`);
        });
        _push(`<!--]--></ul></div>`);
        if (unref(meta)) {
          _push(ssrRenderComponent(_component_Pagination, {
            meta: unref(meta),
            "base-path": "/admin/videos"
          }, null, _parent));
        } else {
          _push(`<!---->`);
        }
        _push(`<!--]-->`);
      }
      _push(ssrRenderComponent(_component_ConfirmDialog, {
        open: !!unref(pendingDelete),
        title: unref(t)("confirmDeleteTitle"),
        message: unref(pendingDelete) ? title(unref(pendingDelete)) : "",
        consequences: [
          "The video is removed from the site and from sitemaps.",
          "The YouTube video itself is not affected.",
          "The record is retired, not destroyed \u2014 it stays in the audit log."
        ],
        "confirm-label": unref(t)("remove"),
        busy: unref(deleting),
        onConfirm: confirmDelete,
        onCancel: ($event) => pendingDelete.value = null
      }, null, _parent));
      _push(`</div>`);
    };
  }
});
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("pages/admin/videos/index.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};

export { _sfc_main as default };
//# sourceMappingURL=index-CwyaToed.mjs.map
