// Smoke test: spawn the server over stdio, list tools, run a search.
// NOTE: search_assets hits the LIVE index at stockflow.media — after the site's
// next publish. Until then it may 404 (expected before first deploy).
import { Client } from "@modelcontextprotocol/sdk/client/index.js";
import { StdioClientTransport } from "@modelcontextprotocol/sdk/client/stdio.js";

const transport = new StdioClientTransport({
  command: "node",
  args: ["server.js"],
  env: { ...process.env },   // forward STOCKFLOW_BASE for local testing
});
const client = new Client({ name: "smoke", version: "0.0.1" });
await client.connect(transport);

const tools = await client.listTools();
console.log("TOOLS:", tools.tools.map(t => t.name).join(", "));

try {
  const res = await client.callTool({ name: "search_assets", arguments: { query: "ocean ripples", type: "image", limit: 3 } });
  const data = JSON.parse(res.content[0].text);
  console.log("SEARCH: total =", data.total_matches, "| first:", data.results[0]?.title, "->", data.results[0]?.license_page);
} catch (e) {
  console.log("SEARCH FAILED (index not deployed yet?):", e.message);
}

try {
  const cats = await client.callTool({ name: "get_categories", arguments: {} });
  console.log("CATEGORIES:", JSON.parse(cats.content[0].text).map(c => c.name).join(", "));
} catch (e) {
  console.log("CATEGORIES FAILED:", e.message);
}

await client.close();
console.log("SMOKE TEST DONE");
