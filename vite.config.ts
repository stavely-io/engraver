import { defineConfig } from "vite-plus";

export default defineConfig({
  fmt: {
    ignorePatterns: [],
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
    jsPlugins: [{ name: "vite-plus", specifier: "vite-plus/oxlint-plugin" }],
    rules: { "vite-plus/prefer-vite-plus-imports": "error" },
    options: { typeAware: true, typeCheck: true },
  },
  run: {
    cache: true,
  },
});
