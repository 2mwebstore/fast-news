import { _ as _sfc_main$1 } from './AdminStat-DhS7zDkE.mjs';
import { j as useHead, _ as __nuxt_component_0$1 } from './server.mjs';
import { defineComponent, ref, unref, withCtx, createTextVNode, toDisplayString, useSSRContext } from 'vue';
import { ssrRenderAttrs, ssrInterpolate, ssrRenderComponent, ssrRenderList, ssrRenderClass } from 'vue/server-renderer';
import { u as useAdminLocale, a as useAdminApi } from './useAdminApi-SsuwQDOr.mjs';
import '../nitro/nitro.mjs';
import 'node:http';
import 'node:https';
import 'node:events';
import 'node:buffer';
import 'node:fs';
import 'node:path';
import 'node:crypto';
import 'node:url';
import '../routes/renderer.mjs';
import 'vue-bundle-renderer/runtime';
import 'unhead/server';
import 'devalue';
import 'unhead/plugins';
import 'unhead/utils';
import 'pinia';
import 'vue-router';
import 'perfect-debounce';

const _sfc_main = /* @__PURE__ */ defineComponent({
  __name: "seo",
  __ssrInlineRender: true,
  setup(__props) {
    const { t } = useAdminLocale();
    useAdminApi();
    const report = ref(null);
    const loading = ref(true);
    useHead({ title: "SEO health \u2014 Newsroom" });
    return (_ctx, _push, _parent, _attrs) => {
      const _component_AdminStat = _sfc_main$1;
      const _component_NuxtLink = __nuxt_component_0$1;
      _push(`<div${ssrRenderAttrs(_attrs)}><h1 class="mb-1 text-xl font-bold">SEO Health</h1>`);
      if (unref(report)) {
        _push(`<p class="mb-4 max-w-prose text-sm text-ink-muted">${ssrInterpolate(unref(report).note)}</p>`);
      } else {
        _push(`<!---->`);
      }
      if (unref(loading)) {
        _push(`<p class="py-12 text-center text-ink-muted">${ssrInterpolate(unref(t)("checking"))}</p>`);
      } else if (unref(report)) {
        _push(`<div class="space-y-6"><div class="grid gap-3 sm:grid-cols-4">`);
        _push(ssrRenderComponent(_component_AdminStat, {
          label: unref(t)("publishedArticles"),
          value: unref(report).publishedArticles
        }, null, _parent));
        _push(ssrRenderComponent(_component_AdminStat, {
          label: "Sitemap",
          value: unref(report).sitemapOk ? "\u2713" : "\u2014",
          accent: unref(report).sitemapOk ? "success" : "warning"
        }, null, _parent));
        _push(ssrRenderComponent(_component_AdminStat, {
          label: unref(t)("newsSitemap48h"),
          value: unref(report).newsSitemapCount
        }, null, _parent));
        _push(ssrRenderComponent(_component_AdminStat, {
          label: "robots.txt",
          value: unref(report).robotsOk ? "\u2713" : "\u2014",
          accent: unref(report).robotsOk ? "success" : "warning"
        }, null, _parent));
        _push(`</div><section><h2 class="mb-3 text-sm font-bold uppercase tracking-wide text-ink-muted">${ssrInterpolate(unref(t)("issuesFound"))}</h2>`);
        if (!unref(report).issues.length) {
          _push(`<p class="card p-6 text-center text-success">${ssrInterpolate(unref(t)("noIssues"))}</p>`);
        } else {
          _push(`<ul class="space-y-3"><!--[-->`);
          ssrRenderList(unref(report).issues, (issue) => {
            var _a;
            _push(`<li class="card p-4"><div class="flex items-center gap-2"><span class="${ssrRenderClass([
              "rounded px-2 py-0.5 text-xs font-bold uppercase",
              issue.severity === "error" ? "bg-breaking/15 text-breaking" : "bg-warning/15 text-warning"
            ])}">${ssrInterpolate(issue.severity)}</span><span class="font-semibold">${ssrInterpolate(issue.label)}</span><span class="ml-auto text-lg font-extrabold tabular-nums">${ssrInterpolate(issue.count)}</span></div>`);
            if ((_a = issue.samples) == null ? void 0 : _a.length) {
              _push(`<ul class="mt-3 space-y-1 border-t border-line pt-3"><!--[-->`);
              ssrRenderList(issue.samples, (sample) => {
                _push(`<li>`);
                _push(ssrRenderComponent(_component_NuxtLink, {
                  to: `/admin/news/${sample.id}/edit`,
                  class: "block truncate text-kh-sm text-brand hover:underline"
                }, {
                  default: withCtx((_, _push2, _parent2, _scopeId) => {
                    if (_push2) {
                      _push2(`${ssrInterpolate(sample.titleKh)}`);
                    } else {
                      return [
                        createTextVNode(toDisplayString(sample.titleKh), 1)
                      ];
                    }
                  }),
                  _: 2
                }, _parent));
                _push(`</li>`);
              });
              _push(`<!--]--></ul>`);
            } else {
              _push(`<!---->`);
            }
            _push(`</li>`);
          });
          _push(`<!--]--></ul>`);
        }
        _push(`</section><section class="card p-5"><h2 class="mb-2 font-bold">Google Search Console</h2><p class="mb-3 text-sm text-ink-muted">${ssrInterpolate(unref(t)("afterLaunchSteps"))}</p><ol class="list-decimal space-y-1 pl-5 text-sm"><li>${ssrInterpolate(unref(t)("gscAddDomain"))}</li><li>${ssrInterpolate(unref(t)("gscVerify"))}</li><li>${ssrInterpolate(unref(t)("gscSubmit"))} <code>/sitemap.xml</code></li><li>${ssrInterpolate(unref(t)("gscSubmit"))} <code>/news-sitemap.xml</code></li><li>${ssrInterpolate(unref(t)("gscIndexing"))}</li><li>${ssrInterpolate(unref(t)("gscCwv"))}</li><li>${ssrInterpolate(unref(t)("gscStructured"))}</li><li>${ssrInterpolate(unref(t)("gscQueries"))}</li></ol></section></div>`);
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
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("pages/admin/seo.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};

export { _sfc_main as default };
//# sourceMappingURL=seo-DGPGVbXT.mjs.map
