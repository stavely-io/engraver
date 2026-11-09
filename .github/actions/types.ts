import type { context, getOctokit } from "@actions/github";

/** The `github` and `context` objects that actions/github-script passes to a script. */
export type ScriptArgs = {
  github: ReturnType<typeof getOctokit>;
  context: typeof context;
};
