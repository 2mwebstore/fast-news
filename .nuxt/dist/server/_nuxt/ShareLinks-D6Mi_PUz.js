import { defineComponent, ref, computed, mergeProps, unref, useSSRContext } from "vue";
import { ssrRenderAttrs, ssrInterpolate, ssrRenderList, ssrRenderAttr, ssrRenderClass } from "vue/server-renderer";
import { a as useApi, u as useLocale, e as useRuntimeConfig } from "../server.mjs";
const _sfc_main = /* @__PURE__ */ defineComponent({
  __name: "ShareLinks",
  __ssrInlineRender: true,
  props: {
    path: {},
    title: {},
    trackPath: {},
    expanded: { type: Boolean, default: false }
  },
  setup(__props) {
    const props = __props;
    const config = useRuntimeConfig();
    useApi();
    const { t } = useLocale();
    const copied = ref(false);
    const shareUrl = computed(() => `${config.public.siteUrl}${props.path}`);
    const targets = computed(() => {
      const url = encodeURIComponent(shareUrl.value);
      const text = encodeURIComponent(props.title);
      const both = encodeURIComponent(`${props.title} ${shareUrl.value}`);
      return [
        { key: "facebook", label: "Facebook", href: `https://www.facebook.com/sharer/sharer.php?u=${url}` },
        { key: "messenger", label: "Messenger", href: `https://www.facebook.com/dialog/send?link=${url}&app_id=0&redirect_uri=${url}` },
        { key: "telegram", label: "Telegram", href: `https://t.me/share/url?url=${url}&text=${text}` },
        { key: "whatsapp", label: "WhatsApp", href: `https://wa.me/?text=${both}` },
        { key: "x", label: "X", href: `https://twitter.com/intent/tweet?url=${url}&text=${text}` }
      ];
    });
    return (_ctx, _push, _parent, _attrs) => {
      _push(`<div${ssrRenderAttrs(mergeProps({
        class: ["flex flex-wrap items-center", __props.expanded ? "gap-3" : "gap-2"]
      }, _attrs))}>`);
      if (__props.expanded) {
        _push(`<span class="text-kh-sm font-semibold">${ssrInterpolate(unref(t)("shareLabel"))}</span>`);
      } else {
        _push(`<!---->`);
      }
      _push(`<!--[-->`);
      ssrRenderList(unref(targets), (target) => {
        _push(`<a${ssrRenderAttr("href", target.href)} target="_blank" rel="noopener noreferrer" class="${ssrRenderClass([
          "rounded-lg border border-line px-3 py-1.5 text-xs font-semibold hover:border-brand hover:text-brand",
          // Narrow screens show only the two networks that matter most in
          // Cambodia; the rest are one tap away in the expanded placement.
          !__props.expanded && target.key !== "facebook" && target.key !== "telegram" ? "hidden sm:block" : ""
        ])}"${ssrRenderAttr("aria-label", unref(t)("shareVia", { network: target.label }))}>${ssrInterpolate(target.label)}</a>`);
      });
      _push(`<!--]--><button type="button" class="rounded-lg border border-line px-3 py-1.5 text-xs font-semibold hover:border-brand hover:text-brand"${ssrRenderAttr("aria-label", unref(copied) ? unref(t)("linkCopied") : unref(t)("copyLink"))}>${ssrInterpolate(unref(copied) ? `✓ ${unref(t)("copied")}` : unref(t)("copyLink"))}</button></div>`);
    };
  }
});
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/ShareLinks.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
export {
  _sfc_main as _
};
//# sourceMappingURL=ShareLinks-D6Mi_PUz.js.map
