import {
  createEngraverStore,
  type EngraverConfig,
  EngraverController,
  type EngraverThemeType,
} from "@engraver/core";

import { type FC, type ReactNode, useEffect, useMemo, useState } from "react";

import { usePlayerStoreApi } from "../hooks/context/use-player-store-api";
import { EngraverContext } from "./engraver-context";

interface EngraverProviderProps {
  config: EngraverConfig;
  theme?: EngraverThemeType;
  children: ReactNode;
}

export const EngraverProvider: FC<EngraverProviderProps> = ({ config, theme, children }) => {
  const playerStore = usePlayerStoreApi();
  // https://react.dev/reference/react/useState#avoiding-recreating-the-initial-state
  // TODO: reconsider how config is created and applied (live updates vs mount-only, docs for consumers)
  const [engraverStore] = useState(() => createEngraverStore(config));
  const [engraverController] = useState(
    () => new EngraverController(config.engraverScoreConfig, engraverStore, playerStore),
  );

  useEffect(() => {
    if (theme) engraverController.setTheme(theme);
  }, [theme, engraverController]);

  useEffect(() => {
    if (config.engraverThemeConfig) engraverController.setTheme(config.engraverThemeConfig);
  }, [engraverController, config.engraverThemeConfig]);

  const contextValue = useMemo(
    () => ({ engraverController, engraverStore }),
    [engraverController, engraverStore],
  );

  return <EngraverContext.Provider value={contextValue}>{children}</EngraverContext.Provider>;
};
