import { defineComponent, ref, computed, unref, mergeProps, useSSRContext } from "vue";
import { ssrRenderAttrs, ssrInterpolate, ssrRenderStyle, ssrRenderAttr } from "vue/server-renderer";
import { u as useLocale, a as useApi } from "../server.mjs";
import { u as useIntersectionObserver } from "./index-C4JB2zdt.js";
const _sfc_main = /* @__PURE__ */ defineComponent({
  __name: "AdSlot",
  __ssrInlineRender: true,
  props: {
    position: {},
    category: {},
    collapseWhenEmpty: { type: Boolean, default: false },
    class: {}
  },
  setup(__props) {
    const props = __props;
    const { t, locale } = useLocale();
    const api = useApi();
    const slot = ref(null);
    const loaded = ref(false);
    const impressionSent = ref(false);
    const container = ref(null);
    const { stop } = useIntersectionObserver(
      container,
      ([entry]) => {
        if (!entry?.isIntersecting || impressionSent.value || !slot.value?.ad) return;
        impressionSent.value = true;
        api.beacon(`/api/ads/${slot.value.ad.id}/impression?position=${props.position}`);
        stop();
      },
      { threshold: 0.5 }
    );
    const ad = computed(() => slot.value?.ad ?? null);
    const adLabel = computed(() => {
      const served = ad.value;
      if (!served) return t("advertisement");
      return (locale.value === "en" ? served.labelEn : served.labelKh) || t("advertisement");
    });
    const enabled = computed(() => slot.value?.enabled !== false);
    const reserved = computed(() => ({
      width: ad.value?.width || slot.value?.reservedWidth || 0,
      height: ad.value?.height || slot.value?.reservedHeight || 0
    }));
    const hidden = computed(
      () => !enabled.value || loaded.value && !ad.value && props.collapseWhenEmpty
    );
    return (_ctx, _push, _parent, _attrs) => {
      if (!unref(hidden)) {
        _push(`<div${ssrRenderAttrs(mergeProps({
          ref_key: "container",
          ref: container,
          class: ["my-4 flex flex-col items-center", props.class],
          "data-ad-position": __props.position
        }, _attrs))}><span class="mb-1 text-[10px] uppercase tracking-widest text-ink-muted">${ssrInterpolate(unref(adLabel))}</span><div class="flex max-w-full items-center justify-center overflow-hidden bg-surface-muted" style="${ssrRenderStyle(unref(reserved).height ? {
          width: "100%",
          maxWidth: `${unref(reserved).width}px`,
          aspectRatio: `${unref(reserved).width} / ${unref(reserved).height}`
        } : void 0)}">`);
        if (unref(ad)?.imageUrl) {
          _push(`<a${ssrRenderAttr("href", unref(ad).targetUrl)} target="_blank" rel="noopener sponsored nofollow" class="block h-full w-full"><img${ssrRenderAttr("src", unref(ad).imageUrl)}${ssrRenderAttr("alt", unref(ad).altText || "Advertisement")}${ssrRenderAttr("width", unref(reserved).width || void 0)}${ssrRenderAttr("height", unref(reserved).height || void 0)} class="h-full w-full object-contain" loading="lazy" decoding="async"></a>`);
        } else if (unref(ad)?.htmlSnippet) {
          _push(`<iframe${ssrRenderAttr("srcdoc", unref(ad).htmlSnippet)} sandbox="allow-scripts allow-popups allow-popups-to-escape-sandbox" referrerpolicy="no-referrer" class="h-full w-full border-0"${ssrRenderAttr("title", `Advertisement: ${__props.position}`)} loading="lazy"></iframe>`);
        } else {
          _push(`<!---->`);
        }
        _push(`</div></div>`);
      } else {
        _push(`<!---->`);
      }
    };
  }
});
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/AdSlot.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
export {
  _sfc_main as _
};
//# sourceMappingURL=AdSlot-DGDlUSRS.js.map
