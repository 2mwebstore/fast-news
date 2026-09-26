import { d as defineEventHandler, g as getRequestIP, s as setHeader, c as createError, u as useRuntimeConfig } from '../nitro/nitro.mjs';
import 'node:http';
import 'node:https';
import 'node:events';
import 'node:buffer';
import 'node:fs';
import 'node:path';
import 'node:crypto';
import 'node:url';

const newsSitemap_xml = defineEventHandler(async (event) => {
  const config = useRuntimeConfig();
  try {
    const xml = await $fetch("/news-sitemap.xml", {
      baseURL: config.apiInternalBase,
      responseType: "text",
      // Attribute the fetch to the crawler that asked, not to this process.
      headers: { "X-CFN-Client-IP": getRequestIP(event, { xForwardedFor: true }) || "" }
    });
    setHeader(event, "Content-Type", "application/xml; charset=utf-8");
    setHeader(event, "Cache-Control", "public, max-age=300, stale-while-revalidate=600");
    return xml;
  } catch {
    throw createError({ statusCode: 503, statusMessage: "News sitemap temporarily unavailable" });
  }
});

export { newsSitemap_xml as default };
//# sourceMappingURL=news-sitemap.xml.mjs.map
