# Blog content files

Blog posts written in the repo. On every backend start, after the migrations,
`src/db/importContent.ts` creates any post here that the database does not have yet,
matched on locale and slug. It never deletes a post and never changes the text of one that
exists, so once a post is live its database copy is the one that counts: correct it in the
admin panel (`/admin/blog`), not here.

**One exception, photos.** Photos often arrive after a post is live, so an existing post takes
them from its file on the next deploy: the `featureImage` when the post has no cover, and the
file's `image` blocks when the post has no image yet and every other block is still exactly
what the file holds (nobody has edited it in admin). If it has been edited, the importer logs
it and you add the photos in the admin editor instead.

## One file per post per language

`<slug>.<locale>.json`, for example `mdac-malaysia.en.json`.

```json
{
  "title": "Shown as the H1 and the page <title>; keep it under 60 characters",
  "slug": "lowercase-latin-and-hyphens",
  "locale": "en",
  "status": "PUBLISHED",
  "metaDescription": "Under 160 characters",
  "featureImage": null,
  "translationOf": { "locale": "en", "slug": "mdac-malaysia" },
  "contentBlocks": [
    { "blockType": "paragraph", "content": "<p>HTML. Links: <a href=\"/travel-sim-malaysia\">text</a></p>" },
    { "blockType": "h2", "content": "Plain text heading" },
    { "blockType": "cta", "content": { "heading": "...", "subheading": "...", "buttonText": "...", "url": "https://ttklia.com/...?utm_source=teeko&utm_medium=blog&utm_campaign=..." } }
  ]
}
```

- `translationOf` only on a BM or 中文 version; it joins the English post's translation group
  (hreflang and the language switcher). The original must exist first.
- Block types: `h2`, `h3`, `h4`, `paragraph` (HTML), `image`, `cta`, `restaurant`.
- Images: put the file in `fe/public/images/blog/<slug>/` (covers in `fe/public/images/blog/covers/`)
  and reference it as `/images/blog/...`, or use an `https://` URL already uploaded in admin. An
  image block is `{ "blockType": "image", "imageSize": "large", "content": { "url": "...", "alt": "...",
  "caption": "..." } }`. `caption` is HTML shown under the photo; a Creative Commons photo must carry
  its credit there (author linked to the file page, licence linked, "via Wikimedia Commons, resized").
  Only use photos whose licence allows commercial use (CC0, CC BY, CC BY-SA), never one copied from
  another website.
- A restaurant card is `{ "blockType": "restaurant", "restaurantId": "<uuid>" }`, no `content`.
  The card shows the restaurant's own database row, so describe it in the paragraph around it
  only from that row. A card whose restaurant is not in the database being imported into
  (staging has different rows from production) is left out with a log line. Tables go in a
  `paragraph` block as HTML with inline styles; the site has no table styling of its own.
- Internal links in BM and 中文 posts must carry `/ms` or `/zh`; paragraph HTML is not
  localised automatically.
- `status: "DRAFT"` imports the post without publishing it.

## Checks

`npm test` in `fe/` runs the guard tests over these files: banned claims, no em or en dashes,
ttklia.com links use `TTKLIA_URL`, internal links resolve and keep the reader's language.
The importer itself skips (and logs) any file that is not valid, so a bad file can never
stop the backend from starting.

To add a photo later, upload it in the admin editor; the post already exists, so the file
here is not re-read.
