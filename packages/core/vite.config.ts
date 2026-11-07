import { defineConfig } from "vite-plus";

export default defineConfig({
  pack: {
    deps: {
      // tsdown <0.23 compatibility: resolve external dependency subpaths.
      // Remove to preserve subpath imports as written (the new default).
      // https://tsdown.dev/options/dependencies#deps-resolvedepsubpath
      resolveDepSubpath: true,
    },
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
  run: {
    tasks: {
      publint: {
        command: "publint",
        dependsOn: ["build"],
      },
      check: {
        command: "vp check",
        dependsOn: [
          "publint",
          { task: "build", from: ["dependencies", "devDependencies", "peerDependencies"] },
        ],
      },
      test: {
        command: "vp test",
        dependsOn: [
          { task: "build", from: ["dependencies", "devDependencies", "peerDependencies"] },
        ],
      },
    },
  },
});
