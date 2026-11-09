import { transform } from "@svgr/core";
import jsx from "@svgr/plugin-jsx";
import { defineConfig, type Plugin } from "vite-plus";

import { readFile } from "node:fs/promises";

/**
 * Compiles imported SVGs (@engraver/core's icons) into React components at build time,
 * so consumers need no SVG loader.
 */
function svgComponents(): Plugin {
  return {
    name: "engraver:svg-components",
    async load(id) {
      if (!id.endsWith(".svg")) return null;

      const svg = await readFile(id, "utf8");
      const code = await transform(
        svg,
        { plugins: [jsx], jsxRuntime: "automatic" },
        { filePath: id },
      );
      return { code, moduleType: "jsx" };
    },
  };
}

export default defineConfig({
  pack: {
    platform: "browser",
    dts: {},
    exports: true,
    plugins: [svgComponents()],
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
  run: {
    tasks: {
      build: {
        command: "vp pack",
        dependsOn: [{ task: "build", from: ["dependencies", "peerDependencies"] }],
      },
      publint: {
        command: "publint",
        dependsOn: ["build"],
      },
      check: {
        command: ["vp check", "stylelint 'src/**/*.css'"],
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
