# stockflow-mcp (hosted HTTP)

Remote **Streamable HTTP** MCP server for the [Stockflow.media](https://stockflow.media)
catalog — the always-on counterpart to the stdio `stockflow-mcp` npm package, for
registries (like Smithery) that require a live server URL.

Same tools, same public catalog (`/data/search-index.json`), stateless.

## Deploy (Vercel)

1. [vercel.com/new](https://vercel.com/new) → import `NmediaCloud/stockflow-mcp`
2. **Root Directory:** `http`
3. Framework auto-detects **Next.js** → **Deploy**
4. MCP endpoint is then: `https://<your-app>.vercel.app/mcp`

No env vars required. Optional: `STOCKFLOW_BASE` to point at a different catalog host.

## Tools

`search_assets` · `get_categories` · `get_asset`

Local (stdio) version: [`stockflow-mcp` on npm](https://www.npmjs.com/package/stockflow-mcp).
