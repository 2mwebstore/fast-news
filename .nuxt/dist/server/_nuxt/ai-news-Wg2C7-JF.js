import { defineComponent, reactive, ref, unref, useSSRContext } from "vue";
import { ssrRenderAttrs, ssrInterpolate, ssrRenderAttr, ssrIncludeBooleanAttr } from "vue/server-renderer";
import "/Users/sila/Desktop/fast-news/web/node_modules/hookable/dist/index.mjs";
import { u as useAdminLocale } from "./useAdminLocale-ThlnF2qj.js";
import { u as useAdminApi } from "./useAdminApi-SsuwQDOr.js";
import { i as useRouter, j as useHead } from "../server.mjs";
import "pinia";
import "/Users/sila/Desktop/fast-news/web/node_modules/ofetch/dist/node.mjs";
import "#internal/nuxt/paths";
import "/Users/sila/Desktop/fast-news/web/node_modules/unctx/dist/index.mjs";
import "/Users/sila/Desktop/fast-news/web/node_modules/h3/dist/index.mjs";
import "/Users/sila/Desktop/fast-news/web/node_modules/defu/dist/defu.mjs";
import "vue-router";
import "/Users/sila/Desktop/fast-news/web/node_modules/ufo/dist/index.mjs";
import "/Users/sila/Desktop/fast-news/web/node_modules/klona/dist/index.mjs";
import "/Users/sila/Desktop/fast-news/web/node_modules/@unhead/vue/dist/index.mjs";
import "/Users/sila/Desktop/fast-news/web/node_modules/perfect-debounce/dist/index.mjs";
import "/Users/sila/Desktop/fast-news/web/node_modules/nuxt/node_modules/cookie-es/dist/index.mjs";
import "/Users/sila/Desktop/fast-news/web/node_modules/destr/dist/index.mjs";
import "/Users/sila/Desktop/fast-news/web/node_modules/ohash/dist/index.mjs";
const _sfc_main = /* @__PURE__ */ defineComponent({
  __name: "ai-news",
  __ssrInlineRender: true,
  setup(__props) {
    const { t } = useAdminLocale();
    useAdminApi();
    useRouter();
    const input = reactive({ topic: "", facts: "", source: "", date: "" });
    const draft = ref(null);
    const disclaimer = ref("");
    const busy = ref(false);
    const errorMessage = ref("");
    const aiStatus = ref(null);
    const savingDraft = ref(false);
    useHead({ title: "AI assistant — Newsroom" });
    return (_ctx, _push, _parent, _attrs) => {
      _push(`<div${ssrRenderAttrs(_attrs)}><h1 class="mb-1 text-xl font-bold">${ssrInterpolate(unref(t)("aiAssistant"))}</h1><p class="mb-4 text-sm text-ink-muted">${ssrInterpolate(unref(t)("aiFlow"))}</p>`);
      if (unref(aiStatus) && !unref(aiStatus).configured) {
        _push(`<div class="mb-4 rounded-lg border border-warning/40 bg-warning/5 p-4 text-sm">${ssrInterpolate(unref(t)("aiNotConfigured"))}</div>`);
      } else {
        _push(`<!---->`);
      }
      _push(`<div class="mb-4 rounded-lg border border-line bg-surface-muted p-4 text-sm"><strong>${ssrInterpolate(unref(t)("aiNeverPublishes"))}</strong> ${ssrInterpolate(unref(t)("aiNeverPublishesBody"))} ${ssrInterpolate(unref(t)("aiNoFabrication"))}</div><div class="grid gap-6 lg:grid-cols-2"><form class="card space-y-4 p-5"><h2 class="font-bold">${ssrInterpolate(unref(t)("verifiedFacts"))}</h2><div><label for="topic" class="mb-1 block text-sm font-semibold">${ssrInterpolate(unref(t)("topicLabel"))} *</label><input id="topic"${ssrRenderAttr("value", unref(input).topic)} required class="w-full rounded-lg border border-line px-3 py-2 text-kh-base outline-none focus:border-brand"${ssrRenderAttr("placeholder", unref(t)("topicPlaceholder"))}></div><div><label for="facts" class="mb-1 block text-sm font-semibold">${ssrInterpolate(unref(t)("verifiedFacts"))} *</label><textarea id="facts" rows="8" required class="w-full rounded-lg border border-line px-3 py-2 text-kh-base outline-none focus:border-brand"${ssrRenderAttr("placeholder", unref(t)("factsPlaceholder"))}>${ssrInterpolate(unref(input).facts)}</textarea><p class="mt-1 text-xs text-ink-muted">${ssrInterpolate(unref(t)("aiOnlyUsesFacts"))}</p></div><div><label for="source" class="mb-1 block text-sm font-semibold">${ssrInterpolate(unref(t)("sourceLabel"))} *</label><input id="source"${ssrRenderAttr("value", unref(input).source)} required class="w-full rounded-lg border border-line px-3 py-2 text-kh-base outline-none focus:border-brand"${ssrRenderAttr("placeholder", unref(t)("sourcePlaceholder"))}></div><button type="submit"${ssrIncludeBooleanAttr(unref(busy) || (unref(aiStatus) ? !unref(aiStatus).configured : false)) ? " disabled" : ""} class="w-full rounded-lg bg-brand px-4 py-2.5 font-semibold text-white hover:bg-brand-dark disabled:opacity-50">${ssrInterpolate(unref(busy) ? unref(t)("generating") : unref(t)("generateDraft"))}</button>`);
      if (unref(errorMessage)) {
        _push(`<p class="rounded bg-breaking/10 p-3 text-sm text-breaking">${ssrInterpolate(unref(errorMessage))}</p>`);
      } else {
        _push(`<!---->`);
      }
      _push(`</form>`);
      if (unref(draft)) {
        _push(`<div class="card space-y-4 p-5"><div class="flex items-center justify-between"><h2 class="font-bold">${ssrInterpolate(unref(t)("draftLabel"))}</h2><span class="rounded bg-ink/10 px-2 py-0.5 text-xs font-semibold text-ink-muted">${ssrInterpolate(unref(t)("unsaved"))}</span></div><p class="rounded-lg bg-warning/10 p-3 text-xs">${ssrInterpolate(unref(disclaimer))}</p>`);
        if (unref(draft).editorNote) {
          _push(`<p class="rounded-lg border border-warning/40 bg-warning/5 p-3 text-sm"><strong>${ssrInterpolate(unref(t)("assistantNote"))}</strong> ${ssrInterpolate(unref(draft).editorNote)}</p>`);
        } else {
          _push(`<!---->`);
        }
        _push(`<div><p class="text-xs font-semibold text-ink-muted">${ssrInterpolate(unref(t)("titleKhLabel"))}</p><p class="text-kh-lg font-bold khmer-wrap">${ssrInterpolate(unref(draft).titleKh)}</p></div>`);
        if (unref(draft).titleEn) {
          _push(`<div><p class="text-xs font-semibold text-ink-muted">Headline (English)</p><p class="font-semibold">${ssrInterpolate(unref(draft).titleEn)}</p></div>`);
        } else {
          _push(`<!---->`);
        }
        _push(`<div><p class="text-xs font-semibold text-ink-muted">${ssrInterpolate(unref(t)("summaryLabel"))}</p><p class="text-kh-base khmer-wrap">${ssrInterpolate(unref(draft).summary)}</p></div><div><p class="text-xs font-semibold text-ink-muted">${ssrInterpolate(unref(t)("bodyLabel"))}</p><p class="text-kh-base khmer-wrap">${ssrInterpolate(unref(draft).paragraph1)}</p><p class="mt-2 text-kh-base khmer-wrap">${ssrInterpolate(unref(draft).paragraph2)}</p></div>`);
        if (unref(draft).telegramPost) {
          _push(`<div><p class="text-xs font-semibold text-ink-muted">${ssrInterpolate(unref(t)("telegramMessage"))}</p><p class="whitespace-pre-line rounded-lg bg-surface-muted p-3 text-kh-sm khmer-wrap">${ssrInterpolate(unref(draft).telegramPost)}</p></div>`);
        } else {
          _push(`<!---->`);
        }
        _push(`<button${ssrIncludeBooleanAttr(unref(savingDraft)) ? " disabled" : ""} class="w-full rounded-lg bg-brand px-4 py-2.5 font-semibold text-white hover:bg-brand-dark disabled:opacity-50">${ssrInterpolate(unref(savingDraft) ? unref(t)("saving") : unref(t)("saveAsDraft"))}</button><p class="text-center text-xs text-ink-muted">${ssrInterpolate(unref(t)("draftGoesToQueue"))}</p></div>`);
      } else {
        _push(`<!---->`);
      }
      _push(`</div></div>`);
    };
  }
});
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("pages/admin/ai-news.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
export {
  _sfc_main as default
};
//# sourceMappingURL=ai-news-Wg2C7-JF.js.map
