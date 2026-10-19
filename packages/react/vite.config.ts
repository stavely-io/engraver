import { defineConfig } from "vite-plus";

export default defineConfig({
  pack: {
    platform: "browser",
    dts: {},
    exports: true,
    // Inline @engraver/core's SVG icons as strings, so consumers need no SVG loader
    loader: { ".svg": "text" },
    deps: { alwaysBundle: [/^@engraver\/core\/icons\//] },
  },
  test: {
    passWithNoTests: true,
  },
});
