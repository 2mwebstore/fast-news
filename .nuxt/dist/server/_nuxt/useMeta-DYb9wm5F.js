import { c as useAsyncApi } from "../server.mjs";
function useMeta() {
  const { data, refresh } = useAsyncApi("platform-meta", "/api/meta");
  function label(option, locale = "en") {
    if (!option) return "";
    return locale === "km" ? option.labelKh : option.labelEn || option.labelKh;
  }
  function toOptions(list, locale = "en") {
    return (list ?? []).map((option) => ({
      value: option.value,
      label: label(option, locale),
      // Show the other language as secondary text, so an operator working in
      // English still recognises what an editor sees in Khmer.
      sub: locale === "km" ? option.labelEn : option.labelKh
    }));
  }
  function contentType(value) {
    return data.value?.contentTypes?.find((o) => o.value === value);
  }
  function requiresDisclosure(value) {
    return contentType(value)?.requiresDisclosure ?? value !== "editorial";
  }
  function transitionsFrom(status) {
    return data.value?.articleStatuses?.find((o) => o.value === status)?.canMoveTo ?? [];
  }
  function statusLabel(value, locale = "en") {
    const match = data.value?.articleStatuses?.find((o) => o.value === value) ?? data.value?.videoStatuses?.find((o) => o.value === value);
    return label(match, locale) || value;
  }
  return { meta: data, refresh, label, toOptions, contentType, requiresDisclosure, transitionsFrom, statusLabel };
}
export {
  useMeta as u
};
//# sourceMappingURL=useMeta-DYb9wm5F.js.map
