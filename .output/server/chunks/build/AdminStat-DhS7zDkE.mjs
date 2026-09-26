import { defineComponent, createVNode, resolveDynamicComponent, unref, resolveComponent, mergeProps, withCtx, toDisplayString, useSSRContext } from 'vue';
import { ssrRenderVNode, ssrInterpolate, ssrRenderClass } from 'vue/server-renderer';

const _sfc_main = /* @__PURE__ */ defineComponent({
  __name: "AdminStat",
  __ssrInlineRender: true,
  props: {
    label: {},
    value: {},
    to: {},
    accent: { default: "brand" }
  },
  setup(__props) {
    const accentClass = {
      brand: "text-brand",
      breaking: "text-breaking",
      warning: "text-warning",
      success: "text-success"
    };
    return (_ctx, _push, _parent, _attrs) => {
      ssrRenderVNode(_push, createVNode(resolveDynamicComponent(__props.to ? ("resolveComponent" in _ctx ? _ctx.resolveComponent : unref(resolveComponent))("NuxtLink") : "div"), mergeProps({
        to: __props.to,
        class: ["card block p-4", __props.to ? "transition-shadow hover:shadow-lift" : ""]
      }, _attrs), {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(`<p class="truncate text-xs text-ink-muted"${_scopeId}>${ssrInterpolate(__props.label)}</p><p class="${ssrRenderClass(["mt-1 text-2xl font-extrabold tabular-nums", accentClass[__props.accent]])}"${_scopeId}>${ssrInterpolate(__props.value)}</p>`);
          } else {
            return [
              createVNode("p", { class: "truncate text-xs text-ink-muted" }, toDisplayString(__props.label), 1),
              createVNode("p", {
                class: ["mt-1 text-2xl font-extrabold tabular-nums", accentClass[__props.accent]]
              }, toDisplayString(__props.value), 3)
            ];
          }
        }),
        _: 1
      }), _parent);
    };
  }
});
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/AdminStat.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};

export { _sfc_main as _ };
//# sourceMappingURL=AdminStat-DhS7zDkE.mjs.map
