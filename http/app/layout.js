export const metadata = {
  title: "Stockflow.media MCP Server",
  description:
    "Remote MCP server for the Stockflow.media catalog — 18,000+ royalty-free 8K images & 4K videos.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body style={{ fontFamily: "system-ui, sans-serif", background: "#111", color: "#eee", margin: 0 }}>
        {children}
      </body>
    </html>
  );
}
