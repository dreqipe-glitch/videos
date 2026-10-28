# videos

Video and motion-graphics work, built with [HyperFrames](https://hyperframes.heygen.com) and [Remotion](https://www.remotion.dev). Final MP4s go in `output/`.

- `brand.json` — shared brand tokens (colours, Inter, 1920×1080 @ 60 fps, −14 LUFS audio target).
- `hyperframes/` — HyperFrames project (HTML + GSAP). Skills are installed in `.agents/skills/` (symlinked into `.claude/skills/`).
- `remotion/` — Remotion project (React).
- `output/` — rendered videos.

## Render the test videos

```bash
cd hyperframes && npx hyperframes@0.8.211 render --quality delivery --fps 60 --output ../output/hyperframes-test.mp4
```

```bash
cd remotion && npm i && npm run render
```

In a sandbox where Remotion can't download its headless Chrome, add `-- --browser-executable=/path/to/chromium`.
