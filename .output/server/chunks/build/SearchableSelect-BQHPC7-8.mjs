import { useSSRContext, defineComponent, useModel, ref, useId, computed, watch, mergeProps, unref, mergeModels } from 'vue';
import { ssrRenderAttrs, ssrInterpolate, ssrRenderAttr, ssrIncludeBooleanAttr, ssrRenderClass, ssrRenderTeleport, ssrRenderStyle, ssrRenderList } from 'vue/server-renderer';
import { _ as _export_sfc } from './_plugin-vue_export-helper-1tPrXgE0.mjs';

const _sfc_main = /* @__PURE__ */ defineComponent({
  __name: "SearchableSelect",
  __ssrInlineRender: true,
  props: /* @__PURE__ */ mergeModels({
    options: {},
    label: {},
    placeholder: { default: "Select\u2026" },
    emptyLabel: { default: "\u2014 none \u2014" },
    required: { type: Boolean, default: false },
    clearable: { type: Boolean, default: true },
    disabled: { type: Boolean, default: false },
    searchPlaceholder: { default: "Search\u2026" },
    searchable: { type: Boolean, default: true }
  }, {
    "modelValue": { default: null },
    "modelModifiers": {}
  }),
  emits: ["update:modelValue"],
  setup(__props) {
    const model = useModel(__props, "modelValue");
    const props = __props;
    const open = ref(false);
    const query = ref("");
    const highlighted = ref(-1);
    const wrapper = ref(null);
    ref(null);
    ref(null);
    const panelStyle = ref({});
    const listboxId = useId();
    const sameValue = (a, b) => String(a) === String(b);
    const hasValue = computed(() => model.value !== null && model.value !== void 0 && model.value !== "");
    const selected = computed(() => {
      var _a;
      return (_a = props.options.find((o) => sameValue(o.value, model.value))) != null ? _a : null;
    });
    const displayLabel = computed(() => {
      var _a, _b;
      return (_b = (_a = selected.value) == null ? void 0 : _a.label) != null ? _b : hasValue.value ? String(model.value) : props.placeholder;
    });
    const filtered = computed(() => {
      const q = query.value.trim().toLowerCase();
      if (!q) return props.options;
      return props.options.filter(
        (o) => {
          var _a;
          return o.label.toLowerCase().includes(q) || ((_a = o.sub) != null ? _a : "").toLowerCase().includes(q);
        }
      );
    });
    const navigable = computed(() => {
      const rows = [];
      if (props.clearable) rows.push(null);
      rows.push(...filtered.value.filter((o) => !o.disabled));
      return rows;
    });
    watch(filtered, () => {
      highlighted.value = navigable.value.length ? 0 : -1;
    });
    return (_ctx, _push, _parent, _attrs) => {
      _push(`<div${ssrRenderAttrs(mergeProps({
        ref_key: "wrapper",
        ref: wrapper,
        class: "relative"
      }, _attrs))} data-v-065e0d36>`);
      if (__props.label) {
        _push(`<span class="mb-1 block text-sm font-medium text-ink" data-v-065e0d36>${ssrInterpolate(__props.label)}`);
        if (__props.required) {
          _push(`<span class="text-breaking" data-v-065e0d36> *</span>`);
        } else {
          _push(`<!---->`);
        }
        _push(`</span>`);
      } else {
        _push(`<!---->`);
      }
      _push(`<button type="button" role="combobox"${ssrRenderAttr("aria-expanded", unref(open))}${ssrRenderAttr("aria-controls", unref(listboxId))} aria-haspopup="listbox"${ssrIncludeBooleanAttr(__props.disabled) ? " disabled" : ""} class="${ssrRenderClass([
        "flex w-full items-center justify-between gap-2 rounded-lg border bg-surface px-3 py-2 text-left text-kh-sm outline-none transition-colors disabled:cursor-not-allowed disabled:opacity-50",
        unref(open) ? "border-brand ring-1 ring-brand/20" : "border-line hover:border-brand/50"
      ])}" data-v-065e0d36><span class="${ssrRenderClass(["min-w-0 truncate", unref(hasValue) ? "text-ink" : "text-ink-muted"])}" data-v-065e0d36>${ssrInterpolate(unref(displayLabel))}</span><span class="flex shrink-0 items-center gap-1" data-v-065e0d36>`);
      if (unref(hasValue) && __props.clearable) {
        _push(`<span class="rounded p-0.5 text-ink-muted hover:text-ink" role="button" tabindex="-1" aria-label="Clear selection" data-v-065e0d36><svg class="h-3.5 w-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" aria-hidden="true" data-v-065e0d36><path d="M6 6l12 12M18 6L6 18" stroke-linecap="round" data-v-065e0d36></path></svg></span>`);
      } else {
        _push(`<!---->`);
      }
      _push(`<svg class="${ssrRenderClass(["h-4 w-4 text-ink-muted transition-transform", unref(open) ? "rotate-180" : ""])}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true" data-v-065e0d36><path d="M6 9l6 6 6-6" stroke-linecap="round" stroke-linejoin="round" data-v-065e0d36></path></svg></span></button>`);
      ssrRenderTeleport(_push, (_push2) => {
        if (unref(open)) {
          _push2(`<div data-searchable-panel style="${ssrRenderStyle(unref(panelStyle))}" class="fixed z-[120] overflow-hidden rounded-xl border border-line bg-surface shadow-lift" data-v-065e0d36>`);
          if (__props.searchable) {
            _push2(`<div class="border-b border-line p-2" data-v-065e0d36><div class="flex items-center gap-2 rounded-lg border border-line bg-surface-muted px-2.5 py-1.5" data-v-065e0d36><svg class="h-4 w-4 shrink-0 text-ink-muted" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true" data-v-065e0d36><circle cx="11" cy="11" r="7" data-v-065e0d36></circle><path d="M20 20l-3.5-3.5" stroke-linecap="round" data-v-065e0d36></path></svg><input${ssrRenderAttr("value", unref(query))} type="text"${ssrRenderAttr("placeholder", __props.searchPlaceholder)} class="min-w-0 flex-1 bg-transparent text-kh-sm text-ink outline-none" data-v-065e0d36></div></div>`);
          } else {
            _push2(`<!---->`);
          }
          _push2(`<div${ssrRenderAttr("id", unref(listboxId))} role="listbox" class="max-h-60 overflow-y-auto py-1" data-v-065e0d36>`);
          if (!unref(filtered).length) {
            _push2(`<p class="px-3 py-6 text-center text-sm text-ink-muted" data-v-065e0d36> No matches </p>`);
          } else {
            _push2(`<!---->`);
          }
          if (__props.clearable) {
            _push2(`<button type="button" role="option"${ssrRenderAttr("aria-selected", !unref(hasValue))}${ssrRenderAttr("data-highlighted", unref(navigable)[unref(highlighted)] === null)} class="${ssrRenderClass([
              "flex w-full items-center gap-2 px-3 py-2 text-left text-kh-sm transition-colors",
              unref(navigable)[unref(highlighted)] === null ? "bg-surface-muted" : "",
              !unref(hasValue) ? "font-semibold text-brand" : "text-ink-muted"
            ])}" data-v-065e0d36><span class="w-3.5 shrink-0 text-brand" aria-hidden="true" data-v-065e0d36>${ssrInterpolate(!unref(hasValue) ? "\u2713" : "")}</span> ${ssrInterpolate(__props.emptyLabel)}</button>`);
          } else {
            _push2(`<!---->`);
          }
          _push2(`<!--[-->`);
          ssrRenderList(unref(filtered), (option) => {
            _push2(`<button type="button" role="option"${ssrRenderAttr("aria-selected", sameValue(option.value, model.value))}${ssrIncludeBooleanAttr(option.disabled) ? " disabled" : ""}${ssrRenderAttr("data-highlighted", unref(navigable)[unref(highlighted)] === option)} class="${ssrRenderClass([
              "flex w-full items-center gap-2 px-3 py-2 text-left text-kh-sm transition-colors disabled:opacity-40",
              unref(navigable)[unref(highlighted)] === option ? "bg-surface-muted" : "",
              sameValue(option.value, model.value) ? "font-semibold text-brand" : "text-ink"
            ])}" data-v-065e0d36><span class="w-3.5 shrink-0 text-brand" aria-hidden="true" data-v-065e0d36>${ssrInterpolate(sameValue(option.value, model.value) ? "\u2713" : "")}</span><span class="min-w-0 truncate" data-v-065e0d36>${ssrInterpolate(option.label)}</span>`);
            if (option.sub) {
              _push2(`<span class="ml-auto shrink-0 truncate text-xs text-ink-muted" data-v-065e0d36>${ssrInterpolate(option.sub)}</span>`);
            } else {
              _push2(`<!---->`);
            }
            _push2(`</button>`);
          });
          _push2(`<!--]--></div></div>`);
        } else {
          _push2(`<!---->`);
        }
      }, "body", false, _parent);
      _push(`</div>`);
    };
  }
});
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/SearchableSelect.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
const __nuxt_component_0 = /* @__PURE__ */ _export_sfc(_sfc_main, [["__scopeId", "data-v-065e0d36"]]);

export { __nuxt_component_0 as _ };
//# sourceMappingURL=SearchableSelect-BQHPC7-8.mjs.map
