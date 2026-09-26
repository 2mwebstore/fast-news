import { _ as _sfc_main$2 } from "./SmartImage-D_CQTSWD.js";
import { defineComponent, ref, unref, useSSRContext, useModel, watch, useId, computed, mergeProps, mergeModels } from "vue";
import { ssrRenderAttrs, ssrInterpolate, ssrRenderClass, ssrRenderAttr, ssrIncludeBooleanAttr, ssrRenderStyle, ssrRenderList, ssrRenderComponent } from "vue/server-renderer";
import { a as useAuthStore } from "./useAdminApi-SsuwQDOr.js";
import "/Users/sila/Desktop/fast-news/web/node_modules/hookable/dist/index.mjs";
import { u as useAdminLocale } from "./useAdminLocale-ThlnF2qj.js";
const _sfc_main$1 = /* @__PURE__ */ defineComponent({
  __name: "FileUpload",
  __ssrInlineRender: true,
  props: {
    folder: { default: "article" },
    accept: { default: "image/*" },
    multiple: { type: Boolean, default: false },
    label: {},
    maxSizeMb: { default: 10 },
    showPreview: { type: Boolean, default: true }
  },
  emits: ["uploaded", "allUploaded", "error"],
  setup(__props, { emit: __emit }) {
    useAuthStore();
    useAdminLocale();
    ref(null);
    const dragging = ref(false);
    const uploading = ref(false);
    const progress = ref(0);
    const currentName = ref("");
    const errorMessage = ref("");
    const uploaded = ref([]);
    function sizeLabel(bytes) {
      return bytes > 1024 * 1024 ? `${(bytes / 1024 / 1024).toFixed(1)} MB` : `${Math.round(bytes / 1024)} KB`;
    }
    return (_ctx, _push, _parent, _attrs) => {
      const _component_SmartImage = _sfc_main$2;
      _push(`<div${ssrRenderAttrs(_attrs)}>`);
      if (__props.label) {
        _push(`<span class="mb-1 block text-sm font-medium">${ssrInterpolate(__props.label)}</span>`);
      } else {
        _push(`<!---->`);
      }
      _push(`<label class="${ssrRenderClass([
        "flex cursor-pointer flex-col items-center justify-center gap-2 rounded-xl border-2 border-dashed px-4 py-8 text-center transition-colors",
        unref(dragging) ? "border-brand bg-brand/5" : "border-line hover:border-brand/50 hover:bg-surface-muted",
        unref(uploading) ? "pointer-events-none opacity-60" : ""
      ])}"><input type="file" class="sr-only"${ssrRenderAttr("accept", __props.accept)}${ssrIncludeBooleanAttr(__props.multiple) ? " multiple" : ""}${ssrIncludeBooleanAttr(unref(uploading)) ? " disabled" : ""}><svg class="h-8 w-8 text-ink-muted" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" aria-hidden="true"><path d="M12 16V4m0 0L8 8m4-4l4 4" stroke-linecap="round" stroke-linejoin="round"></path><path d="M20 16v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2" stroke-linecap="round"></path></svg><span class="text-kh-sm font-medium">${ssrInterpolate(unref(dragging) ? "Drop to upload" : "Drag a file here, or click to choose")}</span><span class="text-xs text-ink-muted">${ssrInterpolate(__props.accept === "image/*" ? "Images" : __props.accept)} · up to ${ssrInterpolate(__props.maxSizeMb)} MB </span></label>`);
      if (unref(uploading)) {
        _push(`<div class="mt-3" aria-live="polite"><div class="mb-1 flex items-center justify-between text-xs text-ink-muted"><span class="min-w-0 truncate">${ssrInterpolate(unref(currentName))}</span><span class="shrink-0 tabular-nums">${ssrInterpolate(unref(progress))}%</span></div><div class="h-1.5 overflow-hidden rounded-full bg-surface-muted"><div class="h-full rounded-full bg-brand transition-[width] duration-200" style="${ssrRenderStyle({ width: `${unref(progress)}%` })}" role="progressbar"${ssrRenderAttr("aria-valuenow", unref(progress))} aria-valuemin="0" aria-valuemax="100"></div></div></div>`);
      } else {
        _push(`<!---->`);
      }
      if (unref(errorMessage)) {
        _push(`<p class="mt-2 rounded-lg bg-breaking/10 p-2.5 text-sm text-breaking">${ssrInterpolate(unref(errorMessage))}</p>`);
      } else {
        _push(`<!---->`);
      }
      if (__props.showPreview && unref(uploaded).length) {
        _push(`<ul class="mt-3 space-y-2"><!--[-->`);
        ssrRenderList(unref(uploaded), (file) => {
          _push(`<li class="flex items-center gap-3 rounded-lg border border-line p-2">`);
          if (file.mimeType.startsWith("image/")) {
            _push(ssrRenderComponent(_component_SmartImage, {
              src: file.url,
              alt: file.filename,
              ratio: "1 / 1",
              class: "h-10 w-10 shrink-0 rounded"
            }, null, _parent));
          } else {
            _push(`<span class="flex h-10 w-10 shrink-0 items-center justify-center rounded bg-surface-muted text-lg" aria-hidden="true">🎬</span>`);
          }
          _push(`<span class="min-w-0 flex-1"><span class="block truncate text-sm font-medium">${ssrInterpolate(file.filename)}</span><span class="block text-xs text-ink-muted">${ssrInterpolate(sizeLabel(file.sizeBytes))}`);
          if (file.width) {
            _push(`<!--[--> · ${ssrInterpolate(file.width)}×${ssrInterpolate(file.height)}<!--]-->`);
          } else {
            _push(`<!---->`);
          }
          _push(`</span></span><span class="shrink-0 text-xs font-semibold text-success">✓</span></li>`);
        });
        _push(`<!--]--></ul>`);
      } else {
        _push(`<!---->`);
      }
      _push(`</div>`);
    };
  }
});
const _sfc_setup$1 = _sfc_main$1.setup;
_sfc_main$1.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/FileUpload.vue");
  return _sfc_setup$1 ? _sfc_setup$1(props, ctx) : void 0;
};
const _sfc_main = /* @__PURE__ */ defineComponent({
  __name: "ImageField",
  __ssrInlineRender: true,
  props: /* @__PURE__ */ mergeModels({
    label: {},
    folder: { default: "article" },
    maxSizeMb: { default: 10 },
    ratio: { default: "16 / 9" },
    placeholder: { default: "https://…" },
    hint: {},
    required: { type: Boolean, default: false }
  }, {
    "modelValue": { default: "" },
    "modelModifiers": {}
  }),
  emits: /* @__PURE__ */ mergeModels(["natural", "error", "uploaded"], ["update:modelValue"]),
  setup(__props, { emit: __emit }) {
    const model = useModel(__props, "modelValue");
    const emit = __emit;
    const mode = ref("upload");
    const failed = ref(false);
    watch(model, () => {
      failed.value = false;
    });
    function onUploaded(file) {
      model.value = file.url;
      if (file.width && file.height) {
        emit("natural", { width: file.width, height: file.height });
      }
      emit("uploaded", file);
    }
    const inputId = useId();
    const { t } = useAdminLocale();
    const showExternalNote = computed(
      () => mode.value === "link" && /^https?:\/\//i.test(model.value.trim())
    );
    return (_ctx, _push, _parent, _attrs) => {
      const _component_FileUpload = _sfc_main$1;
      _push(`<div${ssrRenderAttrs(mergeProps({ class: "space-y-2" }, _attrs))}><div class="flex items-end justify-between gap-2">`);
      if (__props.label) {
        _push(`<label${ssrRenderAttr("for", unref(inputId))} class="block text-sm font-semibold">${ssrInterpolate(__props.label)}`);
        if (__props.required) {
          _push(`<span class="text-breaking"> *</span>`);
        } else {
          _push(`<!---->`);
        }
        _push(`</label>`);
      } else {
        _push(`<!---->`);
      }
      _push(`<div class="flex overflow-hidden rounded-lg border border-line text-xs font-semibold" role="tablist"><!--[-->`);
      ssrRenderList(["upload", "link"], (tab) => {
        _push(`<button type="button" role="tab"${ssrRenderAttr("aria-selected", unref(mode) === tab)} class="${ssrRenderClass([
          "px-3 py-1.5 transition-colors",
          unref(mode) === tab ? "bg-brand text-white" : "bg-surface hover:bg-surface-muted"
        ])}">${ssrInterpolate(tab === "upload" ? unref(t)("upload") : unref(t)("link"))}</button>`);
      });
      _push(`<!--]--></div></div>`);
      if (model.value) {
        _push(`<div class="relative"><div class="overflow-hidden rounded-lg border border-line bg-surface-muted" style="${ssrRenderStyle({ aspectRatio: __props.ratio })}">`);
        if (!unref(failed)) {
          _push(`<img${ssrRenderAttr("src", model.value)} alt="" class="h-full w-full object-cover">`);
        } else {
          _push(`<p class="flex h-full items-center justify-center px-4 text-center text-xs text-breaking">${ssrInterpolate(unref(t)("imageLoadFailed"))}</p>`);
        }
        _push(`</div><button type="button" class="absolute right-2 top-2 rounded-full bg-ink/70 px-2 py-0.5 text-xs font-semibold text-white hover:bg-ink">${ssrInterpolate(unref(t)("removeImage"))}</button>`);
        if (unref(showExternalNote)) {
          _push(`<p class="mt-1 text-xs text-ink-muted">${ssrInterpolate(unref(t)("hostedElsewhere"))}</p>`);
        } else {
          _push(`<!---->`);
        }
        _push(`</div>`);
      } else {
        _push(`<!---->`);
      }
      if (unref(mode) === "upload") {
        _push(ssrRenderComponent(_component_FileUpload, {
          folder: __props.folder,
          accept: "image/*",
          "max-size-mb": __props.maxSizeMb,
          "show-preview": false,
          onUploaded,
          onError: ($event) => emit("error", $event)
        }, null, _parent));
      } else {
        _push(`<input${ssrRenderAttr("id", unref(inputId))}${ssrRenderAttr("value", model.value)} type="url" inputmode="url"${ssrRenderAttr("placeholder", __props.placeholder)} class="w-full rounded-lg border border-line px-3 py-2 text-sm outline-none focus:border-brand">`);
      }
      if (__props.hint) {
        _push(`<p class="text-xs text-ink-muted">${ssrInterpolate(__props.hint)}</p>`);
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
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/ImageField.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
export {
  _sfc_main as _
};
//# sourceMappingURL=ImageField-BjAQOsbw.js.map
