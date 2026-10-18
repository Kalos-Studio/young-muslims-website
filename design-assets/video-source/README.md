# Hero video source

The original 4K hero master is retained here through Git LFS, outside the deployed
`public` directory. The website serves regular Git assets from `public/videos`:

- `hero-desktop.mp4`: 1920px wide, H.264, CRF 27, maxrate 3M, bufsize 6M.
- `hero-mobile.mp4`: 1280px wide, H.264, CRF 26.
- `hero-poster.webp`: frame at 2 seconds, 1280px wide, WebP quality 80.

Both MP4s retain the source duration and frame rate, use the `slow` encoder preset
and `yuv420p`, omit audio (`-an`), and move metadata to the front (`-movflags +faststart`).
Do not apply Git LFS to these playback files: deploys must receive actual video bytes.
