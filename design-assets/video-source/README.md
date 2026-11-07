# Hero video source

The original 4K hero master, `young-muslims-hero-4k.mp4` (3840x2160, 31.6s,
H.264 with AAC audio), is kept here through Git LFS, outside the deployed
`public` directory. Make sure `git lfs install` has run before committing it,
or the 244 MB file goes into Git history directly. The website serves regular
Git assets from `public/videos`:

- `young-muslims-hero-desktop.mp4`: 1920px wide, H.264, CRF 27, maxrate 3M,
  bufsize 6M.
- `young-muslims-hero-mobile.mp4`: 1280px wide, H.264, CRF 26.
- `young-muslims-hero-poster.webp`: the first frame, 1280px wide, WebP quality 80.

Both MP4s retain the source duration and frame rate, use the `slow` encoder
preset and `yuv420p`, omit audio (`-an`), and move metadata to the front
(`-movflags +faststart`). Do not apply Git LFS to these playback files: deploys
must receive actual video bytes.

```sh
ffmpeg -i young-muslims-hero-4k.mp4 -vf scale=1920:-2 -c:v libx264 -preset slow \
  -crf 27 -maxrate 3M -bufsize 6M -pix_fmt yuv420p -an -movflags +faststart \
  ../../public/videos/young-muslims-hero-desktop.mp4
ffmpeg -i young-muslims-hero-4k.mp4 -vf scale=1280:-2 -c:v libx264 -preset slow \
  -crf 26 -pix_fmt yuv420p -an -movflags +faststart \
  ../../public/videos/young-muslims-hero-mobile.mp4
```

The Homebrew ffmpeg build has no WebP encoder, so the poster is the first frame
exported as PNG (`ffmpeg -i young-muslims-hero-4k.mp4 -frames:v 1 -vf
scale=1280:-2 frame.png`) and encoded to WebP at quality 80 (any WebP encoder,
such as `cwebp -q 80`).

`ym-website-hero-dark-overlay.mp4` is the LFS pointer for the previous hero's
master, kept for reference.
