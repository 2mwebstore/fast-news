import { u as useLocale, _ as __nuxt_component_0 } from "../server.mjs";
import { defineComponent, computed, mergeProps, unref, withCtx, createTextVNode, toDisplayString, useSSRContext } from "vue";
import { ssrRenderAttrs, ssrRenderComponent, ssrInterpolate, ssrRenderList } from "vue/server-renderer";
const _sfc_main = /* @__PURE__ */ defineComponent({
  __name: "Pagination",
  __ssrInlineRender: true,
  props: {
    meta: {},
    basePath: {}
  },
  setup(__props) {
    const { t } = useLocale();
    const props = __props;
    const pages = computed(() => {
      const { page, totalPages } = props.meta;
      const window = 2;
      const start = Math.max(1, page - window);
      const end = Math.min(totalPages, page + window);
      return Array.from({ length: end - start + 1 }, (_, i) => start + i);
    });
    function linkTo(page) {
      return page === 1 ? props.basePath : `${props.basePath}?page=${page}`;
    }
    return (_ctx, _push, _parent, _attrs) => {
      const _component_NuxtLink = __nuxt_component_0;
      if (__props.meta.totalPages > 1) {
        _push(`<nav${ssrRenderAttrs(mergeProps({
          class: "mt-8 flex items-center justify-center gap-1",
          "aria-label": unref(t)("pagination")
        }, _attrs))}>`);
        if (__props.meta.page > 1) {
          _push(ssrRenderComponent(_component_NuxtLink, {
            to: linkTo(__props.meta.page - 1),
            rel: "prev",
            class: "rounded border border-line px-3 py-2 text-sm font-semibold hover:bg-surface-muted"
          }, {
            default: withCtx((_, _push2, _parent2, _scopeId) => {
              if (_push2) {
                _push2(` ← ${ssrInterpolate(unref(t)("previous"))}`);
              } else {
                return [
                  createTextVNode(" ← " + toDisplayString(unref(t)("previous")), 1)
                ];
              }
            }),
            _: 1
          }, _parent));
        } else {
          _push(`<!---->`);
        }
        _push(`<!--[-->`);
        ssrRenderList(unref(pages), (p) => {
          _push(ssrRenderComponent(_component_NuxtLink, {
            key: p,
            to: linkTo(p),
            "aria-current": p === __props.meta.page ? "page" : void 0,
            class: [
              "min-w-[2.5rem] rounded px-3 py-2 text-center text-sm font-semibold",
              p === __props.meta.page ? "bg-brand text-white" : "border border-line hover:bg-surface-muted"
            ]
          }, {
            default: withCtx((_, _push2, _parent2, _scopeId) => {
              if (_push2) {
                _push2(`${ssrInterpolate(p)}`);
              } else {
                return [
                  createTextVNode(toDisplayString(p), 1)
                ];
              }
            }),
            _: 2
          }, _parent));
        });
        _push(`<!--]-->`);
        if (__props.meta.hasMore) {
          _push(ssrRenderComponent(_component_NuxtLink, {
            to: linkTo(__props.meta.page + 1),
            rel: "next",
            class: "rounded border border-line px-3 py-2 text-sm font-semibold hover:bg-surface-muted"
          }, {
            default: withCtx((_, _push2, _parent2, _scopeId) => {
              if (_push2) {
                _push2(`${ssrInterpolate(unref(t)("next"))} → `);
              } else {
                return [
                  createTextVNode(toDisplayString(unref(t)("next")) + " → ", 1)
                ];
              }
            }),
            _: 1
          }, _parent));
        } else {
          _push(`<!---->`);
        }
        _push(`</nav>`);
      } else {
        _push(`<!---->`);
      }
    };
  }
});
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/Pagination.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
export {
  _sfc_main as _
};
//# sourceMappingURL=Pagination-BJJJD7ck.js.map
