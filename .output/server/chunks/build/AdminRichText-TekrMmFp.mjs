import { defineComponent, useModel, ref, watch, computed, mergeProps, unref, useSSRContext } from 'vue';
import { ssrRenderAttrs, ssrRenderList, ssrRenderAttr, ssrRenderClass, ssrInterpolate } from 'vue/server-renderer';
import { u as useAdminLocale } from './useAdminApi-SsuwQDOr.mjs';

const _sfc_main = /* @__PURE__ */ defineComponent({
  __name: "AdminRichText",
  __ssrInlineRender: true,
  props: {
    "modelValue": { required: true },
    "modelModifiers": {}
  },
  emits: ["update:modelValue"],
  setup(__props) {
    const model = useModel(__props, "modelValue");
    const { t } = useAdminLocale();
    const editor = ref(null);
    const showHtml = ref(false);
    watch(model, (next) => {
      if (editor.value && !showHtml.value && editor.value.innerHTML !== next) {
        editor.value.innerHTML = next || "<p><br></p>";
      }
    });
    function sync() {
      if (editor.value) model.value = editor.value.innerHTML;
    }
    function exec(command, value) {
      var _a;
      (_a = editor.value) == null ? void 0 : _a.focus();
      (void 0).execCommand(command, false, value);
      sync();
    }
    function insertLink() {
      const url = (void 0).prompt("\u178F\u17C6\u178E URL:");
      if (!url) return;
      if (!/^https?:\/\//i.test(url)) {
        (void 0).alert("\u179F\u17BC\u1798\u1794\u1789\u17D2\u1785\u17BC\u179B URL \u178A\u17C2\u179B\u1785\u17B6\u1794\u17CB\u1795\u17D2\u178F\u17BE\u1798\u178A\u17C4\u1799 http:// \u17AC https://");
        return;
      }
      exec("createLink", url);
    }
    function insertBlock(html) {
      exec("insertHTML", html);
    }
    const toolbar = computed(() => [
      { label: "H2", title: t("rtHeading"), action: () => exec("formatBlock", "<h2>") },
      { label: "H3", title: t("rtSubheading"), action: () => exec("formatBlock", "<h3>") },
      { label: "\xB6", title: t("rtParagraph"), action: () => exec("formatBlock", "<p>") },
      { label: "B", title: t("rtBold"), action: () => exec("bold"), cls: "font-bold" },
      { label: "I", title: t("rtItalic"), action: () => exec("italic"), cls: "italic" },
      { label: "\u275D", title: t("rtQuote"), action: () => exec("formatBlock", "<blockquote>") },
      { label: "\u2022", title: t("rtBullets"), action: () => exec("insertUnorderedList") },
      { label: "1.", title: t("rtNumbers"), action: () => exec("insertOrderedList") },
      { label: "\u{1F517}", title: t("rtLink"), action: insertLink },
      { label: "\u2015", title: t("rtDivider"), action: () => insertBlock("<hr>") },
      { label: "\u25A6", title: t("rtTable"), action: () => insertBlock(
        // Empty header cells: whatever placeholder text went here would have to
        // be deleted in every table, in whichever language it was written.
        "<table><thead><tr><th></th><th></th></tr></thead><tbody><tr><td></td><td></td></tr></tbody></table><p><br></p>"
      ) }
    ]);
    return (_ctx, _push, _parent, _attrs) => {
      _push(`<div${ssrRenderAttrs(mergeProps({ class: "rounded-lg border border-line" }, _attrs))}><div class="flex flex-wrap items-center gap-1 border-b border-line bg-surface-muted p-1.5"><!--[-->`);
      ssrRenderList(unref(toolbar), (item) => {
        _push(`<button type="button"${ssrRenderAttr("title", item.title)} class="${ssrRenderClass(["min-w-[2rem] rounded px-2 py-1 text-sm hover:bg-surface", item.cls])}">${ssrInterpolate(item.label)}</button>`);
      });
      _push(`<!--]--><button type="button" class="${ssrRenderClass(["ml-auto rounded px-2 py-1 text-xs", unref(showHtml) ? "bg-brand text-white" : "hover:bg-surface"])}">HTML</button></div>`);
      if (unref(showHtml)) {
        _push(`<textarea rows="18" class="w-full p-3 font-mono text-xs outline-none" spellcheck="false">${ssrInterpolate(model.value)}</textarea>`);
      } else {
        _push(`<div class="article-body min-h-[26rem] p-4 outline-none" contenteditable="true" role="textbox" aria-multiline="true"${ssrRenderAttr("aria-label", unref(t)("bodyLabel"))}></div>`);
      }
      _push(`</div>`);
    };
  }
});
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/AdminRichText.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};

export { _sfc_main as _ };
//# sourceMappingURL=AdminRichText-TekrMmFp.mjs.map
