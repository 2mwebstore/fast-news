import { defineComponent, computed, mergeProps, unref, useSSRContext } from 'vue';
import { ssrRenderAttrs, ssrInterpolate } from 'vue/server-renderer';
import { u as useLocale } from './server.mjs';

const _sfc_main = /* @__PURE__ */ defineComponent({
  __name: "BreakingBadge",
  __ssrInlineRender: true,
  props: {
    small: { type: Boolean, default: false },
    label: {}
  },
  setup(__props) {
    const props = __props;
    const { t } = useLocale();
    const text = computed(() => props.label || t("breaking"));
    return (_ctx, _push, _parent, _attrs) => {
      _push(`<span${ssrRenderAttrs(mergeProps({
        class: ["badge-breaking", __props.small ? "text-[10px]" : "text-xs"]
      }, _attrs))}><span class="inline-block h-1.5 w-1.5 rounded-full bg-white animate-pulse-dot" aria-hidden="true"></span> ${ssrInterpolate(unref(text))}</span>`);
    };
  }
});
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/BreakingBadge.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};

export { _sfc_main as _ };
//# sourceMappingURL=BreakingBadge-BUl44HvT.mjs.map
