import conventional from "@commitlint/config-conventional";

import type { ScriptArgs } from "../types.ts";

const TYPES: string[] = conventional.rules["type-enum"][2];
const BREAKING = "breaking-change";
const MANAGED = new Set([...TYPES, BREAKING]);

/** Returns the labels a conventional commit title should have, e.g. `feat(core)!: x` -> ["feat", "breaking-change"]. */
export function labelsFromTitle(title: string): string[] {
  const match = title.match(/^(\w+)(\([^)]*\))?(!)?:/);
  if (!match || !TYPES.includes(match[1])) return [];

  return match[3] ? [match[1], BREAKING] : [match[1]];
}

/** Syncs the type and breaking-change labels on a PR with its title. Leaves other labels alone. */
export default async function labelPrType({ github, context }: ScriptArgs) {
  const { owner, repo } = context.repo;
  const { number: issue_number, title, labels } = context.payload.pull_request!;

  const wanted = labelsFromTitle(title);
  const current = labels.map((label: { name: string }) => label.name);

  for (const name of current) {
    if (MANAGED.has(name) && !wanted.includes(name)) {
      await github.rest.issues.removeLabel({ owner, repo, issue_number, name });
    }
  }

  const toAdd = wanted.filter((name) => !current.includes(name));
  if (toAdd.length > 0) {
    await github.rest.issues.addLabels({ owner, repo, issue_number, labels: toAdd });
  }
}
