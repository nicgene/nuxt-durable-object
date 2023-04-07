import "#internal/nitro/virtual/polyfill";
import {
  getAssetFromKV,
  mapRequestToAsset,
} from "@cloudflare/kv-asset-handler";
import { withoutBase } from "ufo";
import type { ExecutionContext } from "@cloudflare/workers-types";
// @ts-ignore Bundled by Wrangler 2. See https://github.com/cloudflare/kv-asset-handler#asset_manifest-required-for-es-modules
import manifest from "__STATIC_CONTENT_MANIFEST";
import { requestHasBody } from "nitropack/dist/runtime/utils";
import { nitroApp } from "#internal/nitro/app";
import { useRuntimeConfig } from "#internal/nitro";
import { getPublicAssetMeta } from "#internal/nitro/virtual/public-assets";

export default {
  async fetch(request, env, ctx: ExecutionContext) {
    try {
      // TODO: Update to new API: https://github.com/cloudflare/kv-asset-handler#es-modules
      return await getAssetFromKV(
        {
          request,
          waitUntil(promise) {
            return ctx.waitUntil(promise);
          },
        },
        {
          cacheControl: assetsCacheControl,
          mapRequestToAsset: baseURLModifier,
          ASSET_NAMESPACE: env.__STATIC_CONTENT,
          ASSET_MANIFEST: JSON.parse(manifest),
        }
      );
    } catch {
      // Ignore
    }

    const url = new URL(request.url);
    let body;
    if (requestHasBody(request)) {
      body = Buffer.from(await request.arrayBuffer());
    }

    const r = await nitroApp.localCall({
      event: { request },
      context: {
        // https://developers.cloudflare.com/workers//runtime-apis/request#incomingrequestcfproperties
        cf: (request as any).cf,
        env,
        ctx,
      },
      url: url.pathname + url.search,
      host: url.hostname,
      protocol: url.protocol,
      headers: Object.fromEntries(request.headers.entries()),
      method: request.method,
      redirect: request.redirect,
      body,
    });

    return new Response(r.body, {
      // @ts-ignore TODO: Should be HeadersInit instead of string[][]
      headers: normalizeOutgoingHeaders(r.headers),
      status: r.status,
      statusText: r.statusText,
    });
  },
};

function assetsCacheControl(_request) {
  const url = new URL(_request.url);
  const meta = getPublicAssetMeta(url.pathname);
  if (meta.maxAge) {
    return {
      browserTTL: meta.maxAge,
      edgeTTL: meta.maxAge,
    };
  }
  return {};
}

const baseURLModifier = (request: Request) => {
  const url = withoutBase(request.url, useRuntimeConfig().app.baseURL);
  return mapRequestToAsset(new Request(url, request));
};

function normalizeOutgoingHeaders(
  headers: Record<string, string | string[] | undefined>
) {
  return Object.entries(headers).map(([k, v]) => [
    k,
    Array.isArray(v) ? v.join(",") : v,
  ]);
}
