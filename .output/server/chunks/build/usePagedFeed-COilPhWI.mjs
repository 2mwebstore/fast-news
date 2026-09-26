import { ref, defineComponent, mergeProps, unref, useSSRContext } from 'vue';
import { ssrRenderAttrs, ssrInterpolate } from 'vue/server-renderer';
import { u as useLocale } from './server.mjs';
import { u as useIntersectionObserver } from './index-C4JB2zdt.mjs';

const _sfc_main = /* @__PURE__ */ defineComponent({
  __name: "InfiniteFooter",
  __ssrInlineRender: true,
  props: {
    loading: { type: Boolean },
    hasMore: { type: Boolean },
    failed: { type: Boolean },
    showEnd: { type: Boolean }
  },
  emits: ["next"],
  setup(__props, { emit: __emit }) {
    const { t } = useLocale();
    return (_ctx, _push, _parent, _attrs) => {
      _push(`<div${ssrRenderAttrs(mergeProps({ class: "py-8 text-center" }, _attrs))}>`);
      if (__props.loading) {
        _push(`<p class="text-sm text-ink-muted" aria-live="polite">${ssrInterpolate(unref(t)("loading"))}</p>`);
      } else if (__props.failed) {
        _push(`<!--[--><p class="mb-3 text-sm text-breaking">${ssrInterpolate(unref(t)("noResults"))}</p><button type="button" class="rounded-lg border border-line px-5 py-2.5 text-kh-sm font-semibold hover:bg-surface-muted">${ssrInterpolate(unref(t)("loadMore"))}</button><!--]-->`);
      } else if (__props.hasMore) {
        _push(`<button type="button" class="rounded-lg border border-line px-6 py-3 text-kh-sm font-semibold hover:bg-surface-muted">${ssrInterpolate(unref(t)("loadMore"))}</button>`);
      } else if (__props.showEnd) {
        _push(`<p class="text-sm text-ink-muted">${ssrInterpolate(unref(t)("endOfList"))}</p>`);
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
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/InfiniteFooter.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
function usePagedFeed(loadPage, initial) {
  var _a, _b, _c, _d, _e, _f;
  const extra = ref([]);
  const page = ref((_b = (_a = initial.meta) == null ? void 0 : _a.page) != null ? _b : 1);
  const hasMore = ref((_d = (_c = initial.meta) == null ? void 0 : _c.hasMore) != null ? _d : false);
  const total = ref((_f = (_e = initial.meta) == null ? void 0 : _e.total) != null ? _f : 0);
  const loading = ref(false);
  const failed = ref(false);
  const sentinel = ref(null);
  async function next() {
    var _a2, _b2, _c2;
    if (loading.value || !hasMore.value) return;
    loading.value = true;
    failed.value = false;
    try {
      const result = await loadPage(page.value + 1);
      extra.value.push(...result.data);
      page.value += 1;
      hasMore.value = (_b2 = (_a2 = result.meta) == null ? void 0 : _a2.hasMore) != null ? _b2 : false;
      if ((_c2 = result.meta) == null ? void 0 : _c2.total) total.value = result.meta.total;
    } catch {
      failed.value = true;
      hasMore.value = true;
    } finally {
      loading.value = false;
    }
  }
  useIntersectionObserver(
    sentinel,
    ([entry]) => {
      if ((entry == null ? void 0 : entry.isIntersecting) && !failed.value) next();
    },
    { rootMargin: "600px 0px" }
  );
  function reset(meta) {
    var _a2, _b2, _c2;
    extra.value = [];
    page.value = (_a2 = meta == null ? void 0 : meta.page) != null ? _a2 : 1;
    hasMore.value = (_b2 = meta == null ? void 0 : meta.hasMore) != null ? _b2 : false;
    total.value = (_c2 = meta == null ? void 0 : meta.total) != null ? _c2 : 0;
    failed.value = false;
  }
  return { extra, page, hasMore, total, loading, failed, sentinel, next, reset };
}

export { _sfc_main as _, usePagedFeed as u };
//# sourceMappingURL=usePagedFeed-COilPhWI.mjs.map
