import type { PackageFragment } from "../../vp.workspace.ts";

export default {
  // Vendored VexFlow font generators, kept as-is
  fmt: { ignorePatterns: ["tools/**"] },
  lint: {
    ignorePatterns: ["tools/**"],
    overrides: [
      {
        // Inherited VexFlow code: method references used as callbacks and
        // objects interpolated into error messages are pervasive and intentional.
        files: ["**"],
        plugins: ["import"],
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
} satisfies PackageFragment;
