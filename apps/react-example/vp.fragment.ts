import type { PackageFragment } from "../../vp.workspace.ts";

export default {
  lint: {
    overrides: [
      {
        files: ["**"],
        plugins: ["react"],
        rules: {
          "react/rules-of-hooks": "error",
          "react/only-export-components": ["warn", { allowConstantExport: true }],
        },
      },
    ],
  },
} satisfies PackageFragment;
