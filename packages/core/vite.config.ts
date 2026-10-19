import { defineConfig } from "vite-plus";

export default defineConfig({
  pack: {
    platform: "browser",
    // @engraver/vexflow is bundled, its declarations are inlined from the
    // "typings" export condition (vexflow `build` script must run first)
    dts: {},
    exports: {
      customExports: { "./icons/*": "./dist/icons/*" },
    },
    copy: [{ from: "src/modules/icons", to: "dist" }],
  },
  test: {
    passWithNoTests: true,
  },
});
