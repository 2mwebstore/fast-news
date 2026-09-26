import { useSSRContext, defineComponent, ref, computed, watch, unref } from 'vue';
import { ssrRenderTeleport, ssrRenderAttr, ssrInterpolate, ssrRenderList, ssrIncludeBooleanAttr } from 'vue/server-renderer';
import { o as onKeyStroke } from './index-C4JB2zdt.mjs';
import { _ as _export_sfc } from './_plugin-vue_export-helper-1tPrXgE0.mjs';

const _sfc_main = /* @__PURE__ */ defineComponent({
  __name: "ConfirmDialog",
  __ssrInlineRender: true,
  props: {
    open: { type: Boolean },
    title: {},
    message: {},
    requireText: {},
    confirmLabel: { default: "Delete" },
    cancelLabel: { default: "Cancel" },
    busy: { type: Boolean, default: false },
    consequences: {}
  },
  emits: ["confirm", "cancel"],
  setup(__props, { emit: __emit }) {
    const props = __props;
    const emit = __emit;
    const typed = ref("");
    ref(null);
    const canConfirm = computed(
      () => !props.busy && (!props.requireText || typed.value.trim() === props.requireText)
    );
    watch(() => props.open, async (open) => {
      return;
    });
    onKeyStroke("Escape", () => {
      if (props.open && !props.busy) emit("cancel");
    });
    return (_ctx, _push, _parent, _attrs) => {
      ssrRenderTeleport(_push, (_push2) => {
        var _a;
        if (__props.open) {
          _push2(`<div class="fixed inset-0 z-[110] flex items-center justify-center bg-ink/60 p-4 backdrop-blur-sm" data-v-cad47650><div class="w-full max-w-md rounded-xl bg-surface p-6 shadow-lift" role="alertdialog" aria-modal="true"${ssrRenderAttr("aria-labelledby", "confirm-title")}${ssrRenderAttr("aria-describedby", "confirm-message")} tabindex="-1" data-v-cad47650><div class="flex items-start gap-3" data-v-cad47650><span class="mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-breaking/10" aria-hidden="true" data-v-cad47650><svg class="h-5 w-5 text-breaking" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" data-v-cad47650><path d="M12 9v4M12 17h.01M10.3 3.9L1.8 18a2 2 0 001.7 3h17a2 2 0 001.7-3L13.7 3.9a2 2 0 00-3.4 0z" stroke-linecap="round" stroke-linejoin="round" data-v-cad47650></path></svg></span><div class="min-w-0 flex-1" data-v-cad47650><h2 id="confirm-title" class="text-lg font-bold" data-v-cad47650>${ssrInterpolate(__props.title)}</h2><p id="confirm-message" class="mt-1 text-kh-sm text-ink-muted khmer-wrap" data-v-cad47650>${ssrInterpolate(__props.message)}</p></div></div>`);
          if ((_a = __props.consequences) == null ? void 0 : _a.length) {
            _push2(`<ul class="mt-4 space-y-1.5 rounded-lg bg-surface-muted p-3" data-v-cad47650><!--[-->`);
            ssrRenderList(__props.consequences, (line) => {
              _push2(`<li class="flex gap-2 text-sm text-ink-muted" data-v-cad47650><span aria-hidden="true" data-v-cad47650>\xB7</span><span class="khmer-wrap" data-v-cad47650>${ssrInterpolate(line)}</span></li>`);
            });
            _push2(`<!--]--></ul>`);
          } else {
            _push2(`<!---->`);
          }
          if (__props.requireText) {
            _push2(`<div class="mt-4" data-v-cad47650><label for="confirm-typed" class="mb-1 block text-sm font-medium" data-v-cad47650> Type <code class="rounded bg-surface-muted px-1.5 py-0.5 font-semibold" data-v-cad47650>${ssrInterpolate(__props.requireText)}</code> to confirm </label><input id="confirm-typed"${ssrRenderAttr("value", unref(typed))} type="text" autocomplete="off" class="w-full rounded-lg border border-line px-3 py-2 outline-none focus:border-breaking" data-v-cad47650></div>`);
          } else {
            _push2(`<!---->`);
          }
          _push2(`<div class="mt-6 flex justify-end gap-2" data-v-cad47650><button type="button" class="rounded-lg border border-line px-4 py-2 text-sm font-semibold hover:bg-surface-muted disabled:opacity-50"${ssrIncludeBooleanAttr(__props.busy) ? " disabled" : ""} data-v-cad47650>${ssrInterpolate(__props.cancelLabel)}</button><button type="button" class="rounded-lg bg-breaking px-4 py-2 text-sm font-semibold text-white hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-40"${ssrIncludeBooleanAttr(!unref(canConfirm)) ? " disabled" : ""} data-v-cad47650>${ssrInterpolate(__props.busy ? "\u2026" : __props.confirmLabel)}</button></div></div></div>`);
        } else {
          _push2(`<!---->`);
        }
      }, "body", false, _parent);
    };
  }
});
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/ConfirmDialog.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
const __nuxt_component_2 = /* @__PURE__ */ _export_sfc(_sfc_main, [["__scopeId", "data-v-cad47650"]]);

export { __nuxt_component_2 as _ };
//# sourceMappingURL=ConfirmDialog-BxaeJdx9.mjs.map
