import { EngraverController } from "@engraver/core";

import { useEffect } from "react";

import { useEngraverPrivateAPIStore } from "./use-engraver-api-register-store";

export function useEngraverAPIRegistration(controller: EngraverController) {
  const engraverPrivateAPIStore = useEngraverPrivateAPIStore();

  useEffect(() => {
    if (!engraverPrivateAPIStore) {
      console.info(
        "[EngraverProvider] Running in detached mode: No EngraverAPIContext found. " +
          "Public API (e.g., get.scoreData()) will not be registered. " +
          "This is fine if Engraver is used standalone or in isolation (e.g., for testing).",
      );
    }

    const deregisterFns: ((() => void) | undefined)[] = [];

    deregisterFns.push(
      engraverPrivateAPIStore
        ?.getState()
        .registerGetEngraverScore(controller.getScoreData.bind(controller)),
      // put future deregister functions here
    );

    return () => {
      deregisterFns.forEach((fn) => fn?.());
    };
  }, [controller, engraverPrivateAPIStore]);
}
