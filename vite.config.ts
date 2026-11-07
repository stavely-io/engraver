import { defineConfig } from "vite-plus";

import reactExample from "./apps/react-example/vp.fragment.ts";
import vexflow from "./packages/vexflow/vp.fragment.ts";
import { withPackages } from "./vp.workspace.ts";

const packages = withPackages({
  "apps/react-example": reactExample,
  "packages/vexflow": vexflow,
});

export default defineConfig({
  fmt: {
    ignorePatterns: packages.fmtIgnorePatterns,
    sortImports: {
      customGroups: [
        { groupName: "node", elementNamePattern: ["node:*"] },
        { groupName: "engraver", elementNamePattern: ["@engraver/**"] },
        { groupName: "internal-alias", elementNamePattern: ["@/**"] },
      ],
      groups: [
        "node",
        "engraver",
        "internal-alias",
        ["type-external", "value-external"],
        [
          "type-parent",
          "type-sibling",
          "type-index",
          "value-parent",
          "value-sibling",
          "value-index",
        ],
        "unknown",
      ],
    },
  },
  staged: {
    "*": "vp check --fix",
  },
  lint: {
    plugins: ["typescript", "unicorn", "oxc"],
    jsPlugins: [{ name: "vite-plus", specifier: "vite-plus/oxlint-plugin" }],
    rules: { "vite-plus/prefer-vite-plus-imports": "error" },
    options: { typeAware: true, typeCheck: true },
    ignorePatterns: packages.lintIgnorePatterns,
    overrides: packages.lintOverrides,
  },
  run: {
    tasks: {
      "check-root": {
        command:
          "vp check .github .vscode package.json pnpm-workspace.yaml tsconfig.json vite.config.ts vp.workspace.ts commitlint.config.ts README.md",
      },
      check: {
        command: "vp run check-root && vp run -r check",
      },
      test: {
        command: "vp run -r test",
      },
    },
    cache: true,
  },
});
