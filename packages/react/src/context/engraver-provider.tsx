import {
  createEngraverStore,
  type EngraverConfig,
  EngraverController,
  type EngraverThemeType,
} from "@engraver/core";

import { type FC, type ReactNode, type RefObject, useEffect, useMemo } from "react";

import { useEngraverAPIRegistration } from "../hooks/api/private/use-engraver-api-registration";
import { usePlayerStore } from "../hooks/context/use-player-store";
import { EngraverContext } from "./engraver-context";

interface EngraverProviderProps {
  config: EngraverConfig;
  theme?: EngraverThemeType;
  children: ReactNode;
  engraverWrapperRef: RefObject<HTMLElement | null>;
}

export const EngraverProvider: FC<EngraverProviderProps> = ({
  config,
  theme,
  children,
  engraverWrapperRef,
}) => {
  const playerStore = usePlayerStore();
  const engraverStore = useMemo(() => createEngraverStore(config), [config]);
  const engraverController = useMemo(
    () => new EngraverController(config.engraverScoreConfig, engraverStore, playerStore),
    [config.engraverScoreConfig, engraverStore, playerStore],
  );

  useEffect(() => {
    if (theme) engraverController.setTheme(theme);
  }, [theme, engraverController]);

  useEffect(() => {
    if (config.engraverThemeConfig) engraverController.setTheme(config.engraverThemeConfig);
  }, [engraverController, config.engraverThemeConfig]);

  useEngraverAPIRegistration(engraverController);

  useEffect(() => {
    if (!engraverWrapperRef.current) return;
    engraverController.onComponentMount(engraverWrapperRef.current);
    return () => {
      engraverController.onComponentUnmount();
    };
  }, [engraverController, engraverWrapperRef]);

  return (
    <EngraverContext.Provider value={{ engraverController, engraverStore }}>
      {children}
    </EngraverContext.Provider>
  );
};
