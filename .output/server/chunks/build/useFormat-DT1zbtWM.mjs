const TIMEZONE = "Asia/Phnom_Penh";
function useFormat() {
  function parse(value) {
    if (!value) return null;
    const date = new Date(value);
    return Number.isNaN(date.getTime()) ? null : date;
  }
  function time(value) {
    const date = parse(value);
    if (!date) return "";
    return new Intl.DateTimeFormat("en-GB", {
      hour: "2-digit",
      minute: "2-digit",
      hour12: false,
      timeZone: TIMEZONE
    }).format(date);
  }
  function dateKh(value) {
    const date = parse(value);
    if (!date) return "";
    return new Intl.DateTimeFormat("km-KH", {
      day: "numeric",
      month: "long",
      year: "numeric",
      timeZone: TIMEZONE
    }).format(date);
  }
  function dateTime(value) {
    const date = parse(value);
    if (!date) return "";
    const d = new Intl.DateTimeFormat("en-GB", {
      day: "numeric",
      month: "short",
      year: "numeric",
      timeZone: TIMEZONE
    }).format(date);
    return `${d} \u2022 ${time(value)}`;
  }
  function relativeKh(value) {
    const date = parse(value);
    if (!date) return "";
    const seconds = Math.floor((Date.now() - date.getTime()) / 1e3);
    if (seconds < 60) return "\u17A5\u17A1\u17BC\u179C\u1793\u17C1\u17C7";
    if (seconds < 3600) return `${khNumber(Math.floor(seconds / 60))} \u1793\u17B6\u1791\u17B8\u1798\u17BB\u1793`;
    if (seconds < 86400) return `${khNumber(Math.floor(seconds / 3600))} \u1798\u17C9\u17C4\u1784\u1798\u17BB\u1793`;
    if (seconds < 172800) return "\u1798\u17D2\u179F\u17B7\u179B\u1798\u17B7\u1789";
    return dateKh(value);
  }
  function khNumber(n) {
    const digits = ["\u17E0", "\u17E1", "\u17E2", "\u17E3", "\u17E4", "\u17E5", "\u17E6", "\u17E7", "\u17E8", "\u17E9"];
    return String(n).replace(/\d/g, (d) => digits[Number(d)]);
  }
  function compact(n) {
    if (n < 1e3) return String(n);
    if (n < 1e6) return `${(n / 1e3).toFixed(n < 1e4 ? 1 : 0)}K`;
    return `${(n / 1e6).toFixed(1)}M`;
  }
  function duration(seconds) {
    if (!seconds || seconds < 0) return "0:00";
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    if (m < 60) return `${m}:${String(s).padStart(2, "0")}`;
    const h = Math.floor(m / 60);
    return `${h}:${String(m % 60).padStart(2, "0")}:${String(s).padStart(2, "0")}`;
  }
  function iso(value) {
    var _a, _b;
    return (_b = (_a = parse(value)) == null ? void 0 : _a.toISOString()) != null ? _b : "";
  }
  return { time, dateKh, dateTime, relativeKh, khNumber, compact, duration, iso };
}

export { useFormat as u };
//# sourceMappingURL=useFormat-DT1zbtWM.mjs.map
