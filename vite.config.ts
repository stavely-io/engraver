import { defineConfig } from "vite-plus";

export default defineConfig({
  fmt: {
    // Vendored VexFlow font generators, kept as-is
    ignorePatterns: ["packages/vexflow/tools/**"],
    sortImports: {
      customGroups: [
        // Node.js builtins
        { groupName: "node", elementNamePattern: ["^node:"] },
        // Workspace packages (@engraver/*)
        { groupName: "engraver", elementNamePattern: ["^@engraver/"] },
        // Other external packages
        { groupName: "other-external", elementNamePattern: ["^\\w"] },
        // Internal aliases (like "@/...")
        { groupName: "internal-alias", elementNamePattern: ["^@/"] },
        // Side effect imports
        { groupName: "side-effect", elementNamePattern: ["^\\u0000"] },
        // Relative imports
        { groupName: "relative", elementNamePattern: ["^\\."] },
      ],
      groups: ["node", "engraver", "other-external", "internal-alias", "side-effect", "relative"],
    },
  },
  staged: {
    "*.{js,ts,tsx,vue,svelte}": "vp check --fix",
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
  run: {
    cache: true,
  },
});
