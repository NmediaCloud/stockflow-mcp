// ============================================================
// Remote (Streamable HTTP) MCP endpoint for Stockflow.media.
//
// Same catalog + tools as the stdio `stockflow-mcp` npm package,
// but served over HTTP so hosted registries (Smithery, etc.) can
// list an always-on URL. Stateless — reads the public catalog JSON.
//
// After deploy, the MCP URL is:  https://<your-app>.vercel.app/mcp
// ============================================================
import { createMcpHandler } from "mcp-handler";
import { z } from "zod";

// MCP handler needs the Node.js runtime (not Edge) and a little headroom.
export const runtime = "nodejs";
export const maxDuration = 60;
export const dynamic = "force-dynamic";

const SITE = process.env.STOCKFLOW_BASE || "https://stockflow.media";
const INDEX_URL = `${SITE}/data/search-index.json`;
const CATALOG_URL = `${SITE}/data/catalog.json`;

let _index = null;
let _fetchedAt = 0;
const TTL_MS = 15 * 60 * 1000;

async function getIndex() {
  if (_index && Date.now() - _fetchedAt < TTL_MS) return _index;
  const r = await fetch(INDEX_URL);
  if (!r.ok) throw new Error(`Failed to fetch catalog index (HTTP ${r.status})`);
  _index = await r.json();
  _fetchedAt = Date.now();
  return _index;
}

function toResult(a) {
  return {
    id: a.i,
    title: a.t,
    category: a.c,
    collection: a.s,
    type: a.v ? "video" : "image",
    aspect: a.f || "",
    resolution: a.r || "",
    price_usd: a.pr,
    thumbnail_url: a.th,
    preview_url: a.p,
    license_page: a.u,
    usage: a.v
      ? "Embed/preview this watermarked clip in drafts; license the full 4K file at license_page."
      : "Use this watermarked preview in drafts/mockups; license the full-res file at license_page.",
  };
}

function scoreAsset(a, tokens) {
  const hay = `${a.t} ${a.k} ${a.c} ${a.s}`.toLowerCase();
  let score = 0;
  for (const tok of tokens) {
    if (!hay.includes(tok)) return 0; // AND semantics
    score += a.t.toLowerCase().includes(tok) ? 3 : 1;
  }
  return score;
}

const handler = createMcpHandler(
  (server) => {
    server.tool(
      "search_assets",
      "Search Stockflow.media's royalty-free catalog (18,000+ 8K stock images and 4K video clips). " +
        "Returns watermarked preview URLs usable directly in presentations, videos, mockups and designs, " +
        "plus the license page to buy the full-resolution file (from $1).",
      {
        query: z.string().describe("Keywords, e.g. 'ocean waves calm' or 'coffee latte'"),
        type: z.enum(["image", "video", "any"]).optional().describe("Restrict to images or videos (default any)"),
        category: z.string().optional().describe("Optional category/collection filter, e.g. 'Background'"),
        aspect: z.enum(["16:9", "9:16", "1:1", "any"]).optional().describe("Aspect ratio filter (default any)"),
        limit: z.number().int().min(1).max(50).optional().describe("Max results (default 12)"),
      },
      async ({ query, type = "any", category, aspect = "any", limit = 12 }) => {
        const idx = await getIndex();
        const tokens = query.toLowerCase().split(/\s+/).filter(Boolean);
        const catq = (category || "").toLowerCase();
        const hits = [];
        for (const a of idx) {
          if (type === "image" && a.v) continue;
          if (type === "video" && !a.v) continue;
          if (aspect !== "any" && a.f !== aspect) continue;
          if (catq && !`${a.c} ${a.s}`.toLowerCase().includes(catq)) continue;
          const s = tokens.length ? scoreAsset(a, tokens) : 1;
          if (s > 0) hits.push([s, a]);
        }
        hits.sort((x, y) => y[0] - x[0]);
        const results = hits.slice(0, limit).map(([, a]) => toResult(a));
        return {
          content: [
            {
              type: "text",
              text: JSON.stringify(
                {
                  total_matches: hits.length,
                  returned: results.length,
                  note: "Previews are watermarked and free for drafts. Always show the user license_page to buy the full-resolution file.",
                  results,
                },
                null,
                2
              ),
            },
          ],
        };
      }
    );

    server.tool(
      "get_categories",
      "List Stockflow.media's asset categories with cover images and asset counts.",
      {},
      async () => {
        const r = await fetch(CATALOG_URL);
        const cats = await r.json();
        return { content: [{ type: "text", text: JSON.stringify(cats, null, 2) }] };
      }
    );

    server.tool(
      "get_asset",
      "Get full details for one asset by its Stockflow File_ID (e.g. '20260622_01471').",
      { id: z.string().describe("The asset's File_ID") },
      async ({ id }) => {
        const idx = await getIndex();
        const a = idx.find((x) => x.i === id.trim());
        if (!a) return { content: [{ type: "text", text: `No asset found with id ${id}` }], isError: true };
        return { content: [{ type: "text", text: JSON.stringify(toResult(a), null, 2) }] };
      }
    );
  },
  {},
  { basePath: "" }
);

export { handler as GET, handler as POST, handler as DELETE };
