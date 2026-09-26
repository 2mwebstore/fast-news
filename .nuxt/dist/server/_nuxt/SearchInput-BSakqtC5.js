import { defineComponent, useModel, useId, ref, mergeProps, unref, mergeModels, useSSRContext } from "vue";
import { ssrRenderAttrs, ssrRenderAttr, ssrInterpolate } from "vue/server-renderer";
import { a as useDebounceFn } from "./index-C4JB2zdt.js";
const _sfc_main = /* @__PURE__ */ defineComponent({
  __name: "SearchInput",
  __ssrInlineRender: true,
  props: /* @__PURE__ */ mergeModels({
    placeholder: { default: "Search…" },
    label: {},
    delay: { default: 400 },
    busy: { type: Boolean, default: false },
    autofocus: { type: Boolean, default: false }
  }, {
    "modelValue": { default: "" },
    "modelModifiers": {}
  }),
  emits: /* @__PURE__ */ mergeModels(["search", "clear"], ["update:modelValue"]),
  setup(__props, { emit: __emit }) {
    const model = useModel(__props, "modelValue");
    const props = __props;
    const emit = __emit;
    const inputId = useId();
    ref(null);
    useDebounceFn((value) => emit("search", value), props.delay);
    return (_ctx, _push, _parent, _attrs) => {
      _push(`<div${ssrRenderAttrs(mergeProps({ class: "relative w-full" }, _attrs))}><label${ssrRenderAttr("for", unref(inputId))} class="sr-only">${ssrInterpolate(__props.label || __props.placeholder)}</label><span class="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-ink-muted" aria-hidden="true">`);
      if (!__props.busy) {
        _push(`<svg class="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="11" cy="11" r="7"></circle><path d="M20 20l-3.5-3.5" stroke-linecap="round"></path></svg>`);
      } else {
        _push(`<svg class="h-4 w-4 animate-spin" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="9" stroke-opacity="0.25"></circle><path d="M21 12a9 9 0 00-9-9" stroke-linecap="round"></path></svg>`);
      }
      _push(`</span><input${ssrRenderAttr("id", unref(inputId))}${ssrRenderAttr("value", model.value)} type="search"${ssrRenderAttr("placeholder", __props.placeholder)} class="w-full rounded-lg border border-line bg-surface py-2 pl-9 pr-9 text-kh-sm outline-none transition-colors focus:border-brand">`);
      if (model.value) {
        _push(`<button type="button" class="absolute right-2 top-1/2 -translate-y-1/2 rounded p-1 text-ink-muted transition-colors hover:bg-surface-muted hover:text-ink" aria-label="Clear search"><svg class="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M6 6l12 12M18 6L6 18" stroke-linecap="round"></path></svg></button>`);
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
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/SearchInput.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
export {
  _sfc_main as _
};
//# sourceMappingURL=SearchInput-BSakqtC5.js.map
