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
    return `${d} • ${time(value)}`;
  }
  function relativeKh(value) {
    const date = parse(value);
    if (!date) return "";
    const seconds = Math.floor((Date.now() - date.getTime()) / 1e3);
    if (seconds < 60) return "ឥឡូវនេះ";
    if (seconds < 3600) return `${khNumber(Math.floor(seconds / 60))} នាទីមុន`;
    if (seconds < 86400) return `${khNumber(Math.floor(seconds / 3600))} ម៉ោងមុន`;
    if (seconds < 172800) return "ម្សិលមិញ";
    return dateKh(value);
  }
  function khNumber(n) {
    const digits = ["០", "១", "២", "៣", "៤", "៥", "៦", "៧", "៨", "៩"];
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
    return parse(value)?.toISOString() ?? "";
  }
  return { time, dateKh, dateTime, relativeKh, khNumber, compact, duration, iso };
}
export {
  useFormat as u
};
//# sourceMappingURL=useFormat-DT1zbtWM.js.map
