# stockflow-mcp

**Search & use 18,000+ royalty-free stock images and 4K videos from
[Stockflow.media](https://stockflow.media) inside your AI assistant** — Claude Code,
Cursor, OpenCode, Codex CLI, Antigravity, or any MCP-compatible tool.

Building a presentation, video, website or mockup? Ask your assistant for
"a calm ocean background" or "coffee shop b-roll" and it finds matching assets,
embeds the **watermarked previews** (free for drafts), and gives you the link to
**license the full-resolution file** (one-time, from $1, royalty-free forever).

No API key. The catalog is public.

## Tools

| Tool | What it does |
|---|---|
| `search_assets` | Keyword search with type (image/video), category and aspect (16:9 / 9:16 / 1:1) filters |
| `get_categories` | List categories with covers + counts |
| `get_asset` | Full details for one asset by File_ID |
| `download_preview` | Save a watermarked preview locally for embedding in a project |

## Install

### Claude Code (as a plugin — includes the skill)
```
/plugin marketplace add NmediaCloud/stockflow-mcp
/plugin install stockflow-assets@stockflow
```

### Claude Code (MCP only)
```
claude mcp add stockflow -- npx -y stockflow-mcp
```

### Cursor / Windsurf / Cline (mcp.json)
```json
{ "mcpServers": { "stockflow": { "command": "npx", "args": ["-y", "stockflow-mcp"] } } }
```

### OpenCode (`opencode.json`)
```json
{ "mcp": { "stockflow": { "type": "local", "command": ["npx", "-y", "stockflow-mcp"] } } }
```

### OpenAI Codex CLI (`~/.codex/config.toml`)
```toml
[mcp_servers.stockflow]
command = "npx"
args = ["-y", "stockflow-mcp"]
```

### Google Antigravity / Gemini CLI
Add an MCP server with command `npx -y stockflow-mcp` in the agent's MCP settings.

### No MCP at all?
Any agent can use the public catalog directly — see
[llms.txt](https://stockflow.media/llms.txt) and the compact
[search index](https://stockflow.media/data/search-index.json).

## Skill only (no server)

Copy `skills/stockflow-assets/` into `~/.claude/skills/` — it teaches the agent to
query the public catalog JSON with plain fetches.

## Licensing

Previews are watermarked and free for drafts/mockups. Production use requires a
license bought on the asset's page (`https://stockflow.media/gallery/a/<id>.html`).
Full terms: https://help.stockflow.media/license/

MIT-licensed server. Catalog content © NMedia Services & Stockflow.media.
