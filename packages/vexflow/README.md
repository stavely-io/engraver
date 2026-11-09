# @engraver/vexflow

Stavely's fork of [VexFlow](https://vexflow.com), a library for rendering music notation and guitar tablature.

This is a private, source-only workspace package: `exports` point at the TypeScript entries in `entry/`, and `core` bundles it. There is no separate build step.

## Development

- Install dependencies:

```bash
vp install
```

- Install the browser used by the tests (once per machine):

```bash
vp exec playwright install chromium
```

- Run the tests (Vitest browser mode, headless Chromium):

```bash
vp test
```

- Format, lint and type check:

```bash
vp check
```

## Fonts

`tools/fonts/` contains the scripts that generate `src/fonts/*.ts` from the font files (ES modules, run with `node` from that directory). See `tools/fonts/README.md`. The scripts write plain JSON, so run `vp fmt src/fonts` afterwards.
