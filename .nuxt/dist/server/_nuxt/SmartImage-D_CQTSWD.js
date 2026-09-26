import { defineComponent, ref, watch, computed, mergeProps, unref, useSSRContext } from "vue";
import { ssrRenderAttrs, ssrRenderAttr, ssrRenderClass, ssrRenderSlot } from "vue/server-renderer";
const _sfc_main = /* @__PURE__ */ defineComponent({
  __name: "SmartImage",
  __ssrInlineRender: true,
  props: {
    src: {},
    alt: {},
    width: {},
    height: {},
    ratio: { default: "16 / 9" },
    priority: { type: Boolean, default: false },
    imgClass: { default: "" }
  },
  setup(__props) {
    const props = __props;
    const loaded = ref(false);
    const failed = ref(false);
    ref(null);
    watch(() => props.src, () => {
      loaded.value = false;
      failed.value = false;
    });
    const showPlaceholder = computed(() => !props.src || failed.value);
    return (_ctx, _push, _parent, _attrs) => {
      _push(`<div${ssrRenderAttrs(mergeProps({
        class: "relative overflow-hidden bg-surface-muted",
        style: { aspectRatio: __props.ratio }
      }, _attrs))}>`);
      if (!unref(loaded) && !unref(showPlaceholder)) {
        _push(`<div class="absolute inset-0 animate-shimmer bg-[linear-gradient(90deg,transparent,rgba(15,23,42,0.06),transparent)] bg-[length:200%_100%]" aria-hidden="true"></div>`);
      } else {
        _push(`<!---->`);
      }
      if (__props.src && !unref(failed)) {
        _push(`<img${ssrRenderAttr("src", __props.src)}${ssrRenderAttr("alt", __props.alt)}${ssrRenderAttr("width", __props.width)}${ssrRenderAttr("height", __props.height)}${ssrRenderAttr("loading", __props.priority ? "eager" : "lazy")}${ssrRenderAttr("fetchpriority", __props.priority ? "high" : void 0)} decoding="async" class="${ssrRenderClass([
          "h-full w-full object-cover transition-opacity duration-500",
          unref(loaded) ? "opacity-100" : "opacity-0",
          __props.imgClass
        ])}">`);
      } else {
        _push(`<!---->`);
      }
      if (unref(showPlaceholder)) {
        _push(`<div class="absolute inset-0 flex items-center justify-center bg-brand/5" aria-hidden="true"><svg class="h-8 w-8 text-brand/25" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><rect x="3" y="4" width="18" height="16" rx="2"></rect><circle cx="8.5" cy="9.5" r="1.5"></circle><path d="M21 16l-5-5-4 4-2-2-5 5" stroke-linecap="round" stroke-linejoin="round"></path></svg></div>`);
      } else {
        _push(`<!---->`);
      }
      ssrRenderSlot(_ctx.$slots, "default", {}, null, _push, _parent);
      _push(`</div>`);
    };
  }
});
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/SmartImage.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
export {
  _sfc_main as _
};
//# sourceMappingURL=SmartImage-D_CQTSWD.js.map
