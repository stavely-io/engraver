import { defineConfig } from "vite-plus";

export default defineConfig({
  fmt: {
    // Vendored VexFlow font generators, kept as-is
    ignorePatterns: ["packages/vexflow/tools/**"],
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
    // Defaults plus "import" (needed for import/no-cycle in the vexflow override)
    plugins: ["typescript", "unicorn", "oxc", "import"],
    jsPlugins: [{ name: "vite-plus", specifier: "vite-plus/oxlint-plugin" }],
    rules: { "vite-plus/prefer-vite-plus-imports": "error" },
    options: { typeAware: true, typeCheck: true },
    ignorePatterns: ["packages/vexflow/tools/**"],
    overrides: [
      {
        // Inherited VexFlow code: method references used as callbacks and
        // objects interpolated into error messages are pervasive and intentional.
        files: ["packages/vexflow/**"],
        rules: {
          "typescript/unbound-method": "off",
          "typescript/no-base-to-string": "off",
          "typescript/restrict-template-expressions": "off",
          // Report existing cycles without failing, like the old opt-in webpack check.
          "import/no-cycle": "warn",
        },
      },
    ],
  },
  test: {
    // Run each package with its own test config (e.g. vexflow's browser mode).
    projects: ["packages/*"],
  },
  run: {
    cache: true,
  },
});
