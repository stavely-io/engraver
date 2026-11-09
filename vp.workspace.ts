import type { OxlintOverride } from "vite-plus/lint";

/**
 * Package-owned fmt/lint settings, contributed to the root config.
 * All globs are relative to the package directory.
 */
export interface PackageFragment {
  fmt?: { ignorePatterns?: string[] };
  lint?: { ignorePatterns?: string[]; overrides?: OxlintOverride[] };
}

/** `vp check` only reads the root config, so packages contribute through it. */
export function withPackages(fragments: Record<string, PackageFragment>) {
  const entries = Object.entries(fragments);
  const prefix = (dir: string, globs: string[] = []) => globs.map((glob) => `${dir}/${glob}`);

  return {
    fmtIgnorePatterns: entries.flatMap(([dir, f]) => prefix(dir, f.fmt?.ignorePatterns)),
    lintIgnorePatterns: entries.flatMap(([dir, f]) => prefix(dir, f.lint?.ignorePatterns)),
    lintOverrides: entries.flatMap(([dir, f]) =>
      (f.lint?.overrides ?? []).map((override) => ({
        ...override,
        files: prefix(dir, override.files),
      })),
    ),
  };
}
