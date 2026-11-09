import type { context, getOctokit } from "@actions/github";

/** The `github` and `context` objects that actions/github-script passes to a script. */
type ScriptArgs = {
  github: ReturnType<typeof getOctokit>;
  context: typeof context;
};

const PACKAGES = ["core", "react"];

/** Returns the package label for an issue form body, or null for "Not sure" or a missing answer. */
export function labelFromIssueBody(body: string): string | null {
  // Issue forms render each field as "### <label>\n\n<answer>".
  const answer = body.match(/^### Package\s*\n+(.+)$/m)?.[1].trim();

  return answer && PACKAGES.includes(answer) ? `pkg:${answer}` : null;
}

/** Adds a `pkg:*` label from the issue form's Package dropdown. */
export default async function labelIssuePackage({ github, context }: ScriptArgs) {
  const issue = context.payload.issue!;
  const label = labelFromIssueBody(issue.body ?? "");
  if (!label) return;

  await github.rest.issues.addLabels({
    ...context.repo,
    issue_number: issue.number,
    labels: [label],
  });
}
