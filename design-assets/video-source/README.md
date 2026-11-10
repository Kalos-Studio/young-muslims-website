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
must receive actual video bytes. `.gitattributes` enforces this with a
`public/videos/**` rule placed after the `*.mp4` and `*.mov` LFS rules, so
everything in `public/videos` is stored as regular Git content while the
masters here stay in LFS. Check with `git lfs ls-files`: it should list only
files outside `public/`.

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

# Highlight reel source

The highlight-reel master, `young-muslims-highlight-reel.mov` (3840x2160,
23.976fps, 1:55, H.264 with stereo AAC audio and a timecode track), is kept
here through Git LFS (`*.mov` is LFS-tracked in `.gitattributes`). It never
goes in `public`, and `.mov` does not play in browsers. The landing page's
"show you" card plays these encodes from `public/videos`, with sound (playback
is started by a click):

- `young-muslims-highlight-reel-desktop.mp4`: 1920px wide, H.264 CRF 24,
  maxrate 4M, bufsize 8M. About 42 MB.
- `young-muslims-highlight-reel-mobile.mp4`: 1280px wide, H.264 CRF 26,
  maxrate 2M. About 18 MB.
- `young-muslims-highlight-reel-poster.webp`: the first frame, 1280px wide,
  WebP quality 80 (the video's poster while it loads after the click; the card
  itself shows the Figma photo, `design-assets/figma/landing-2026/highlight-reel.png`).

Unlike the silent hero, the reel keeps its audio: AAC stereo at 128 kbps. Both
encodes use the `slow` preset and `yuv420p`, keep only the video and audio
streams (no timecode track), and move metadata to the front.

```sh
ffmpeg -i young-muslims-highlight-reel.mov -map 0:v:0 -map 0:a:0 \
  -vf scale=1920:-2 -c:v libx264 -preset slow -crf 24 -maxrate 4M -bufsize 8M \
  -pix_fmt yuv420p -c:a aac -b:a 128k -ac 2 -write_tmcd 0 -movflags +faststart \
  ../../public/videos/young-muslims-highlight-reel-desktop.mp4
ffmpeg -i young-muslims-highlight-reel.mov -map 0:v:0 -map 0:a:0 \
  -vf scale=1280:-2 -c:v libx264 -preset slow -crf 26 -maxrate 2M -bufsize 4M \
  -pix_fmt yuv420p -c:a aac -b:a 128k -ac 2 -write_tmcd 0 -movflags +faststart \
  ../../public/videos/young-muslims-highlight-reel-mobile.mp4
```

The poster is the first frame exported as PNG and encoded to WebP at quality
80, as for the hero.
