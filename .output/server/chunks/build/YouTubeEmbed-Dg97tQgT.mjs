import { defineComponent, ref, computed, mergeProps, unref, useSSRContext } from 'vue';
import { ssrRenderAttrs, ssrRenderAttr, ssrInterpolate } from 'vue/server-renderer';
import { u as useLocale } from './server.mjs';

const _sfc_main = /* @__PURE__ */ defineComponent({
  __name: "YouTubeEmbed",
  __ssrInlineRender: true,
  props: {
    youtubeId: {},
    embedUrl: {},
    title: {},
    poster: {},
    posterAlt: {},
    autoload: { type: Boolean, default: false }
  },
  setup(__props) {
    const { t } = useLocale();
    const props = __props;
    const playing = ref(props.autoload);
    const src = computed(() => {
      if (!props.youtubeId && !props.embedUrl) return "";
      const base = props.embedUrl || `https://www.youtube-nocookie.com/embed/${props.youtubeId}?rel=0&modestbranding=1`;
      return playing.value && !props.autoload ? `${base}&autoplay=1` : base;
    });
    const posterSrc = computed(
      () => props.poster || (props.youtubeId ? `https://i.ytimg.com/vi/${props.youtubeId}/hqdefault.jpg` : "")
    );
    return (_ctx, _push, _parent, _attrs) => {
      _push(`<div${ssrRenderAttrs(mergeProps({ class: "relative aspect-video overflow-hidden rounded-lg bg-ink" }, _attrs))}>`);
      if (unref(playing) && unref(src)) {
        _push(`<iframe${ssrRenderAttr("src", unref(src))}${ssrRenderAttr("title", __props.title)} class="absolute inset-0 h-full w-full border-0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" referrerpolicy="strict-origin-when-cross-origin" allowfullscreen loading="lazy"></iframe>`);
      } else if (unref(src)) {
        _push(`<button type="button" class="group absolute inset-0 h-full w-full"${ssrRenderAttr("aria-label", unref(t)("playVideoAria", { title: __props.title }))}>`);
        if (unref(posterSrc)) {
          _push(`<img${ssrRenderAttr("src", unref(posterSrc))}${ssrRenderAttr("alt", __props.posterAlt || __props.title)} class="h-full w-full object-cover" loading="lazy" decoding="async">`);
        } else {
          _push(`<!---->`);
        }
        _push(`<span class="absolute inset-0 flex items-center justify-center bg-ink/20 transition-colors group-hover:bg-ink/10"><span class="flex h-16 w-16 items-center justify-center rounded-full bg-breaking/90 shadow-lift transition-transform group-hover:scale-110"><svg class="ml-1 h-7 w-7 text-white" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M8 5v14l11-7z"></path></svg></span></span></button>`);
      } else {
        _push(`<div class="absolute inset-0 flex items-center justify-center p-6 text-center"><p class="text-kh-sm text-white/70 khmer-wrap">${ssrInterpolate(unref(t)("noVideoAttached"))}</p></div>`);
      }
      _push(`</div>`);
    };
  }
});
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/YouTubeEmbed.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};

export { _sfc_main as _ };
//# sourceMappingURL=YouTubeEmbed-Dg97tQgT.mjs.map
