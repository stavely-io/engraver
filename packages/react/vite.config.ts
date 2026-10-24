import { defineConfig } from "vite-plus";

export default defineConfig({
  pack: {
    platform: "browser",
    dts: {},
    exports: true,
    // Inline @engraver/core's SVG icons as strings, so consumers need no SVG loader
    loader: { ".svg": "text" },
    // Bundle all component CSS into dist/style.css and keep its import in the JS output,
    // so consumers get the styles without importing them manually
    css: { inject: true },
    deps: {
      // tsdown <0.23 compatibility: resolve external dependency subpaths.
      // Remove to preserve subpath imports as written (the new default).
      // https://tsdown.dev/options/dependencies#deps-resolvedepsubpath
      resolveDepSubpath: true,
      alwaysBundle: [/^@engraver\/core\/icons\//],
    },
  },
  test: {
    passWithNoTests: true,
  },
});
