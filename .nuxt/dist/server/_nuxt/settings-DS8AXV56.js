import { _ as __nuxt_component_2 } from "./ConfirmDialog-BxaeJdx9.js";
import { defineComponent, ref, reactive, computed, mergeProps, unref, useSSRContext } from "vue";
import { ssrRenderAttrs, ssrInterpolate, ssrRenderList, ssrRenderAttr, ssrRenderDynamicModel, ssrIncludeBooleanAttr, ssrRenderClass, ssrLooseContain, ssrRenderComponent } from "vue/server-renderer";
import "/Users/sila/Desktop/fast-news/web/node_modules/hookable/dist/index.mjs";
import { u as useAdminApi } from "./useAdminApi-SsuwQDOr.js";
import { u as useAdminLocale } from "./useAdminLocale-ThlnF2qj.js";
import { u as useFormat } from "./useFormat-DT1zbtWM.js";
import { j as useHead } from "../server.mjs";
import "./index-C4JB2zdt.js";
import "./_plugin-vue_export-helper-1tPrXgE0.js";
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
  __name: "settings",
  __ssrInlineRender: true,
  setup(__props) {
    const api = useAdminApi();
    const { t } = useAdminLocale();
    const settings = ref(null);
    const loading = ref(true);
    const saving = ref(false);
    const testing = ref(false);
    const message = ref("");
    const errorMessage = ref("");
    const confirmClear = ref(false);
    const clearing = ref(false);
    const form = reactive({ botToken: "", channelId: "", autoPublish: false });
    const recentPosts = ref([]);
    const siteKeys = [
      { key: "site.tagline_kh", label: "Tagline (Khmer)", type: "text" },
      { key: "site.tagline_en", label: "Tagline (English)", type: "text" },
      { key: "site.contact_email", label: "Contact email", type: "email" },
      { key: "site.contact_phone", label: "Contact phone", type: "tel" },
      { key: "site.address_kh", label: "Address (Khmer)", type: "text" },
      { key: "site.address_en", label: "Address (English)", type: "text" },
      { key: "site.facebook_url", label: "Facebook page", type: "url" },
      { key: "site.youtube_url", label: "YouTube channel", type: "url" },
      { key: "site.telegram_url", label: "Telegram channel", type: "url" },
      { key: "site.tiktok_url", label: "TikTok", type: "url" },
      { key: "site.x_url", label: "X (Twitter)", type: "url" }
    ];
    const site = ref({});
    const savingSite = ref(false);
    const { dateTime } = useFormat();
    async function clearToken() {
      clearing.value = true;
      try {
        settings.value = await api.del("/api/admin/settings/telegram/token");
        message.value = "Stored token cleared.";
      } catch (e) {
        errorMessage.value = e.data?.message || "Could not clear the token.";
      } finally {
        clearing.value = false;
        confirmClear.value = false;
      }
    }
    const sourceLabel = computed(() => {
      switch (settings.value?.botTokenSource) {
        case "database":
          return "Saved here in the admin";
        case "environment":
          return "From TELEGRAM_BOT_TOKEN in the environment";
        default:
          return "Not configured";
      }
    });
    useHead({ title: "Settings — Newsroom" });
    return (_ctx, _push, _parent, _attrs) => {
      const _component_ConfirmDialog = __nuxt_component_2;
      _push(`<div${ssrRenderAttrs(mergeProps({ class: "max-w-2xl" }, _attrs))}><h1 class="mb-1 text-xl font-bold">${ssrInterpolate(unref(t)("settings"))}</h1><p class="mb-6 text-sm text-ink-muted"> Values saved here override the environment and take effect immediately — no redeploy. </p>`);
      if (unref(loading)) {
        _push(`<p class="py-12 text-center text-ink-muted">${ssrInterpolate(unref(t)("loading"))}</p>`);
      } else {
        _push(`<!---->`);
      }
      if (!unref(loading)) {
        _push(`<section class="card mb-6 p-6"><h2 class="mb-1 font-bold">Site details</h2><p class="mb-4 text-sm text-ink-muted"> Shown in the public footer. Leave a field empty to hide that row — an unset social profile must not become a dead link, and these also feed the Organization schema, so only list profiles the newsroom actually owns. </p><div class="space-y-3"><!--[-->`);
        ssrRenderList(siteKeys, (field) => {
          _push(`<div><label${ssrRenderAttr("for", field.key)} class="mb-1 block text-sm font-medium">${ssrInterpolate(field.label)}</label><input${ssrRenderAttr("id", field.key)}${ssrRenderDynamicModel(field.type, unref(site)[field.key], null)}${ssrRenderAttr("type", field.type)}${ssrRenderAttr("placeholder", field.type === "url" ? "https://…" : "")} class="w-full rounded-lg border border-line px-3 py-2 text-sm outline-none focus:border-brand"></div>`);
        });
        _push(`<!--]--></div><button type="button" class="mt-4 rounded-lg bg-brand px-4 py-2 text-sm font-semibold text-white hover:bg-brand-dark disabled:opacity-50"${ssrIncludeBooleanAttr(unref(savingSite)) ? " disabled" : ""}>${ssrInterpolate(unref(savingSite) ? unref(t)("saving") : unref(t)("save"))}</button></section>`);
      } else {
        _push(`<!---->`);
      }
      if (!unref(loading)) {
        _push(`<section class="card p-6"><div class="mb-4 flex items-center justify-between gap-3"><h2 class="font-bold">Telegram</h2><span class="${ssrRenderClass([
          "rounded-full px-2.5 py-1 text-xs font-semibold",
          unref(settings)?.botTokenSet ? "bg-success/10 text-success" : "bg-ink/10 text-ink-muted"
        ])}">${ssrInterpolate(unref(settings)?.botTokenSet ? "Configured" : "Not configured")}</span></div><form class="space-y-5"><div><label for="bot-token" class="mb-1 block text-sm font-medium">Bot token</label><input id="bot-token"${ssrRenderAttr("value", unref(form).botToken)} type="password" autocomplete="off"${ssrRenderAttr("placeholder", unref(settings)?.botTokenSet ? unref(settings).botTokenMasked : "123456789:AA…")} class="w-full rounded-lg border border-line px-3 py-2 font-mono text-sm outline-none focus:border-brand"><p class="mt-1.5 text-xs text-ink-muted"> Source: ${ssrInterpolate(unref(sourceLabel))}. `);
        if (unref(settings)?.botTokenSet) {
          _push(`<!--[--> Leave blank to keep the current token — it is stored encrypted and never shown again. <!--]-->`);
        } else {
          _push(`<!---->`);
        }
        _push(` The token is verified with Telegram before it is saved. </p></div><div><label for="channel-id" class="mb-1 block text-sm font-medium">Channel</label><input id="channel-id"${ssrRenderAttr("value", unref(form).channelId)} type="text" placeholder="@cambodiafastnews" class="w-full rounded-lg border border-line px-3 py-2 text-sm outline-none focus:border-brand"></div><label class="flex items-start gap-2.5 text-sm"><input${ssrIncludeBooleanAttr(Array.isArray(unref(form).autoPublish) ? ssrLooseContain(unref(form).autoPublish, null) : unref(form).autoPublish) ? " checked" : ""} type="checkbox" class="mt-0.5 rounded border-line"><span> Post automatically when an article is published <span class="block text-xs text-ink-muted"> Off by default. With this on, every published article goes to the channel. </span></span></label>`);
        if (unref(message)) {
          _push(`<p class="rounded-lg bg-success/10 p-3 text-sm text-success">${ssrInterpolate(unref(message))}</p>`);
        } else {
          _push(`<!---->`);
        }
        if (unref(errorMessage)) {
          _push(`<p class="rounded-lg bg-breaking/10 p-3 text-sm text-breaking">${ssrInterpolate(unref(errorMessage))}</p>`);
        } else {
          _push(`<!---->`);
        }
        _push(`<div class="flex flex-wrap gap-2 border-t border-line pt-4"><button type="submit"${ssrIncludeBooleanAttr(unref(saving)) ? " disabled" : ""} class="rounded-lg bg-brand px-5 py-2.5 text-sm font-semibold text-white hover:bg-brand-dark disabled:opacity-50">${ssrInterpolate(unref(saving) ? unref(t)("saving") : unref(t)("save"))}</button><button type="button"${ssrIncludeBooleanAttr(unref(testing) || !unref(settings)?.botTokenSet) ? " disabled" : ""} class="rounded-lg border border-line px-4 py-2.5 text-sm font-semibold hover:bg-surface-muted disabled:opacity-50">${ssrInterpolate(unref(testing) ? "…" : unref(t)("test"))}</button>`);
        if (unref(settings)?.botTokenSource === "database") {
          _push(`<button type="button" class="ml-auto rounded-lg border border-breaking px-4 py-2.5 text-sm font-semibold text-breaking hover:bg-breaking/5">Clear stored token</button>`);
        } else {
          _push(`<!---->`);
        }
        _push(`</div></form></section>`);
      } else {
        _push(`<!---->`);
      }
      if (!unref(loading)) {
        _push(`<section class="card mt-6 p-6"><h2 class="mb-3 font-bold">Recent Telegram posts</h2>`);
        if (!unref(recentPosts).length) {
          _push(`<p class="py-6 text-center text-sm text-ink-muted"> Nothing sent yet. </p>`);
        } else {
          _push(`<ul class="divide-y divide-line"><!--[-->`);
          ssrRenderList(unref(recentPosts), (post) => {
            _push(`<li class="py-3 first:pt-0"><div class="mb-1 flex flex-wrap items-center gap-2 text-xs"><span class="${ssrRenderClass([
              "rounded px-1.5 py-0.5 font-semibold",
              post.status === "sent" ? "bg-success/15 text-success" : post.status === "failed" ? "bg-breaking/15 text-breaking" : "bg-ink/10 text-ink-muted"
            ])}">${ssrInterpolate(post.status)}</span><span class="text-ink-muted">${ssrInterpolate(post.kind)}</span><span class="text-ink-muted">${ssrInterpolate(unref(dateTime)(post.sentAt || post.createdAt))}</span></div><p class="line-clamp-2 whitespace-pre-line text-kh-sm khmer-wrap">${ssrInterpolate(post.text)}</p>`);
            if (post.errorMessage) {
              _push(`<p class="mt-1 text-xs text-breaking">${ssrInterpolate(post.errorMessage)}</p>`);
            } else {
              _push(`<!---->`);
            }
            _push(`</li>`);
          });
          _push(`<!--]--></ul>`);
        }
        _push(`</section>`);
      } else {
        _push(`<!---->`);
      }
      _push(ssrRenderComponent(_component_ConfirmDialog, {
        open: unref(confirmClear),
        title: "Clear the stored bot token?",
        message: "Publishing to Telegram will stop unless TELEGRAM_BOT_TOKEN is set in the environment.",
        consequences: [
          "The encrypted token is removed from the database.",
          "Any environment value takes over again.",
          "You will need to paste the token to restore it."
        ],
        "confirm-label": "Clear token",
        busy: unref(clearing),
        onConfirm: clearToken,
        onCancel: ($event) => confirmClear.value = false
      }, null, _parent));
      _push(`</div>`);
    };
  }
});
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("pages/admin/settings.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
export {
  _sfc_main as default
};
//# sourceMappingURL=settings-DS8AXV56.js.map
