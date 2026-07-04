export default function Home() {
  return (
    <main style={{ maxWidth: 640, margin: "10vh auto", padding: "0 24px", lineHeight: 1.6 }}>
      <h1 style={{ color: "#F97316" }}>Stockflow.media — MCP Server</h1>
      <p>
        Remote <strong>Model Context Protocol</strong> endpoint for the{" "}
        <a href="https://stockflow.media" style={{ color: "#E8834A" }}>Stockflow.media</a>{" "}
        catalog: 18,000+ royalty-free 8K stock images and 4K video clips.
      </p>
      <p>
        <strong>MCP endpoint:</strong> <code>/mcp</code>
      </p>
      <p style={{ color: "#9CA3AF", fontSize: 14 }}>
        Tools: <code>search_assets</code>, <code>get_categories</code>, <code>get_asset</code>.
        Previews are watermarked and free for drafts; license the full-resolution file from $1.
      </p>
      <p style={{ color: "#9CA3AF", fontSize: 14 }}>
        Prefer a local install? <code>npx -y stockflow-mcp</code> ·{" "}
        <a href="https://github.com/NmediaCloud/stockflow-mcp" style={{ color: "#E8834A" }}>GitHub</a>
      </p>
    </main>
  );
}
