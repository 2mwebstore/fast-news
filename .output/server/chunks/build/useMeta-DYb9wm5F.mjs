import { c as useAsyncApi } from './server.mjs';

function useMeta() {
  const { data, refresh } = useAsyncApi("platform-meta", "/api/meta");
  function label(option, locale = "en") {
    if (!option) return "";
    return locale === "km" ? option.labelKh : option.labelEn || option.labelKh;
  }
  function toOptions(list, locale = "en") {
    return (list != null ? list : []).map((option) => ({
      value: option.value,
      label: label(option, locale),
      // Show the other language as secondary text, so an operator working in
      // English still recognises what an editor sees in Khmer.
      sub: locale === "km" ? option.labelEn : option.labelKh
    }));
  }
  function contentType(value) {
    var _a, _b;
    return (_b = (_a = data.value) == null ? void 0 : _a.contentTypes) == null ? void 0 : _b.find((o) => o.value === value);
  }
  function requiresDisclosure(value) {
    var _a, _b;
    return (_b = (_a = contentType(value)) == null ? void 0 : _a.requiresDisclosure) != null ? _b : value !== "editorial";
  }
  function transitionsFrom(status) {
    var _a, _b, _c, _d;
    return (_d = (_c = (_b = (_a = data.value) == null ? void 0 : _a.articleStatuses) == null ? void 0 : _b.find((o) => o.value === status)) == null ? void 0 : _c.canMoveTo) != null ? _d : [];
  }
  function statusLabel(value, locale = "en") {
    var _a, _b, _c, _d, _e;
    const match = (_e = (_b = (_a = data.value) == null ? void 0 : _a.articleStatuses) == null ? void 0 : _b.find((o) => o.value === value)) != null ? _e : (_d = (_c = data.value) == null ? void 0 : _c.videoStatuses) == null ? void 0 : _d.find((o) => o.value === value);
    return label(match, locale) || value;
  }
  return { meta: data, refresh, label, toOptions, contentType, requiresDisclosure, transitionsFrom, statusLabel };
}

export { useMeta as u };
//# sourceMappingURL=useMeta-DYb9wm5F.mjs.map
