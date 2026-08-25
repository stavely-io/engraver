import reactHooks from "eslint-plugin-react-hooks";
import simpleImportSort from "eslint-plugin-simple-import-sort";

const eslintConfig = [
  {
    ignores: [
      "node_modules/**",
      ".next/**",
      "out/**",
      "build/**",
      "next-env.d.ts",
      "dist",
      "src/vexflow",
      "**/*.test.*",
      "**/*.bench.*",
      "src/**/constants",
      "src/**/enums",
      "src/**/types",
    ],
  },
  {
    plugins: {
      "simple-import-sort": simpleImportSort,
      "react-hooks": reactHooks,
    },
    rules: {
      ...reactHooks.configs.recommended.rules,
      "simple-import-sort/imports": [
        "warn",
        {
          groups: [
            // Node.js builtins
            ["^node:"],
            // Packages starting with @stavely-io or other org packages
            ["^@stavely-io"],
            // Other external packages
            ["^\\w"],
            // Internal aliases (like "@/...")
            ["^@/"],
            // Side effect imports
            ["^\\u0000"],
            // Relative imports
            ["^\\."],
          ],
        },
      ],
      "no-magic-numbers": [
        "error",
        {
          ignore: [0, 1, -1, 2],
          ignoreArrayIndexes: true,
          enforceConst: true,
          detectObjects: false,
          ignoreClassFieldInitialValues: true,
        },
      ],
      "simple-import-sort/exports": "warn",
    },
  },
];

export default eslintConfig;
