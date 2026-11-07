import { defineConfig } from "vite-plus";

export default defineConfig({
  pack: {
    platform: "browser",
    dts: {},
    exports: true,
    // Inline @engraver/core's SVG icons as strings, so consumers need no SVG loader
    loader: { ".svg": "text" },
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
