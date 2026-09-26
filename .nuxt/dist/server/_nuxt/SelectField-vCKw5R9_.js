import { defineComponent, useModel, useId, mergeProps, unref, mergeModels, useSSRContext } from "vue";
import { ssrRenderAttrs, ssrRenderAttr, ssrRenderClass, ssrInterpolate, ssrIncludeBooleanAttr, ssrLooseContain, ssrLooseEqual, ssrRenderList } from "vue/server-renderer";
const _sfc_main = /* @__PURE__ */ defineComponent({
  __name: "SelectField",
  __ssrInlineRender: true,
  props: /* @__PURE__ */ mergeModels({
    options: {},
    label: {},
    inline: { type: Boolean, default: false },
    placeholder: {},
    disabled: { type: Boolean, default: false },
    size: { default: "md" }
  }, {
    "modelValue": { default: "" },
    "modelModifiers": {}
  }),
  emits: ["update:modelValue"],
  setup(__props) {
    const model = useModel(__props, "modelValue");
    const selectId = useId();
    return (_ctx, _push, _parent, _attrs) => {
      _push(`<div${ssrRenderAttrs(mergeProps({
        class: __props.inline ? "flex items-center gap-2" : ""
      }, _attrs))}>`);
      if (__props.label) {
        _push(`<label${ssrRenderAttr("for", unref(selectId))} class="${ssrRenderClass(__props.inline ? "shrink-0 text-sm text-ink-muted" : "mb-1 block text-sm font-medium")}">${ssrInterpolate(__props.label)}</label>`);
      } else {
        _push(`<!---->`);
      }
      _push(`<div class="relative"><select${ssrRenderAttr("id", unref(selectId))}${ssrIncludeBooleanAttr(__props.disabled) ? " disabled" : ""} class="${ssrRenderClass([
        "w-full appearance-none rounded-lg border border-line bg-surface pr-8 outline-none transition-colors focus:border-brand disabled:opacity-50",
        __props.size === "sm" ? "py-1.5 pl-2.5 text-sm" : "py-2 pl-3 text-kh-sm"
      ])}">`);
      if (__props.placeholder) {
        _push(`<option value="" disabled${ssrIncludeBooleanAttr(Array.isArray(model.value) ? ssrLooseContain(model.value, "") : ssrLooseEqual(model.value, "")) ? " selected" : ""}>${ssrInterpolate(__props.placeholder)}</option>`);
      } else {
        _push(`<!---->`);
      }
      _push(`<!--[-->`);
      ssrRenderList(__props.options, (option) => {
        _push(`<option${ssrRenderAttr("value", option.value)}${ssrIncludeBooleanAttr(option.disabled) ? " disabled" : ""}${ssrIncludeBooleanAttr(Array.isArray(model.value) ? ssrLooseContain(model.value, option.value) : ssrLooseEqual(model.value, option.value)) ? " selected" : ""}>${ssrInterpolate(option.label)}</option>`);
      });
      _push(`<!--]--></select><span class="pointer-events-none absolute right-2.5 top-1/2 -translate-y-1/2 text-ink-muted" aria-hidden="true"><svg class="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M6 9l6 6 6-6" stroke-linecap="round" stroke-linejoin="round"></path></svg></span></div></div>`);
    };
  }
});
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/SelectField.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
export {
  _sfc_main as _
};
//# sourceMappingURL=SelectField-vCKw5R9_.js.map
