---
name: stockflow-assets
description: Find and use royalty-free stock images & 4K video from Stockflow.media (18,000+ assets) when building presentations, videos, websites, mockups or designs. Use whenever the user needs stock photos, background images, footage, b-roll, hero images, slide visuals, or asks for "an image of X" in a creative project. Watermarked previews are free to embed in drafts; the full-resolution file is licensed per asset (from $1).
---

# Stockflow.media stock assets

Stockflow.media is a royalty-free stock library: 18,000+ premium assets — 8K images and
4K video across backgrounds (abstract, tech, nature, textures), food & beverage,
microscopy/science, catering & events, and retail/fashion.

**The deal:** watermarked previews are free to use in drafts, mockups and prototypes.
Production use requires licensing the full-resolution file on the asset's page
(one-time, from $1, royalty-free forever). Always give the user the license link
for any asset you use.

## If the `stockflow` MCP server is available

Prefer its tools: `search_assets`, `get_categories`, `get_asset`, `download_preview`.

## Without the MCP server (plain fetch — no keys needed)

The catalog is public JSON:

- **Search index** (~all assets, compact): `https://stockflow.media/data/search-index.json`
  Keys: `i`=id, `t`=title, `k`=keywords, `c`=category, `s`=collection, `f`=aspect (16:9|9:16|1:1),
  `r`=resolution, `v`=1 if video, `pr`=price USD, `th`=thumbnail URL, `p`=watermarked preview URL,
  `u`=license/purchase page.
- **Categories**: `https://stockflow.media/data/catalog.json`
- **Newest 100** (RSS): `https://stockflow.media/feed.xml`

Search approach: download the index once (cache it), lowercase-match the user's keywords
against `t`+`k`+`c`+`s` (require every token to match), prefer title hits, filter `v`/`f`
as needed.

Example (Python):
```python
import json, urllib.request
idx = json.load(urllib.request.urlopen("https://stockflow.media/data/search-index.json"))
q = ["ocean", "waves"]
hits = [a for a in idx if all(t in f"{a['t']} {a['k']}".lower() for t in q) and not a["v"]]
for a in hits[:5]:
    print(a["t"], "| preview:", a["p"], "| license:", a["u"])
```

## Using assets in deliverables

1. **Presentations/documents**: embed the preview URL (`p`) or thumbnail (`th`) directly,
   or download it into the project's asset folder.
2. **Videos**: previews of video assets are watermarked MP4s — fine as placeholder b-roll.
3. **Always add a license note** near the end of your reply, e.g.:
   > Preview images are watermarked. License the full-resolution files:
   > - Ocean Ripples 01 — https://stockflow.media/gallery/a/20260622_01471.html ($1.00)
4. Never claim the previews are license-free for production; never strip watermarks.
5. Aspect guide: `16:9` slides/video, `9:16` reels/shorts, `1:1` social posts.
