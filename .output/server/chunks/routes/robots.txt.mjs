import { d as defineEventHandler, s as setHeader, g as getRequestIP, u as useRuntimeConfig } from '../nitro/nitro.mjs';
import 'node:http';
import 'node:https';
import 'node:events';
import 'node:buffer';
import 'node:fs';
import 'node:path';
import 'node:crypto';
import 'node:url';

const robots_txt = defineEventHandler(async (event) => {
  const config = useRuntimeConfig();
  setHeader(event, "Content-Type", "text/plain; charset=utf-8");
  try {
    const body = await $fetch("/robots.txt", {
      baseURL: config.apiInternalBase,
      responseType: "text",
      // Attribute the fetch to the crawler that asked, not to this process.
      headers: { "X-CFN-Client-IP": getRequestIP(event, { xForwardedFor: true }) || "" }
    });
    setHeader(event, "Cache-Control", "public, max-age=3600");
    return body;
  } catch {
    setHeader(event, "Cache-Control", "public, max-age=60");
    return "User-agent: *\nDisallow: /\n";
  }
});

export { robots_txt as default };
//# sourceMappingURL=robots.txt.mjs.map
