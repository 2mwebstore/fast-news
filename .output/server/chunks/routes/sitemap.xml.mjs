import { d as defineEventHandler, g as getRequestIP, s as setHeader, c as createError, u as useRuntimeConfig } from '../nitro/nitro.mjs';
import 'node:http';
import 'node:https';
import 'node:events';
import 'node:buffer';
import 'node:fs';
import 'node:path';
import 'node:crypto';
import 'node:url';

const sitemap_xml = defineEventHandler(async (event) => {
  const config = useRuntimeConfig();
  try {
    const xml = await $fetch("/sitemap.xml", {
      baseURL: config.apiInternalBase,
      responseType: "text",
      // Attribute the fetch to the crawler that asked, not to this process.
      headers: { "X-CFN-Client-IP": getRequestIP(event, { xForwardedFor: true }) || "" }
    });
    setHeader(event, "Content-Type", "application/xml; charset=utf-8");
    setHeader(event, "Cache-Control", "public, max-age=1800, stale-while-revalidate=3600");
    return xml;
  } catch {
    throw createError({ statusCode: 503, statusMessage: "Sitemap temporarily unavailable" });
  }
});

export { sitemap_xml as default };
//# sourceMappingURL=sitemap.xml.mjs.map
