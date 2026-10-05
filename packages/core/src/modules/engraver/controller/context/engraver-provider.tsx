import { useEngraverAPIRegistration } from "../../api/hooks/private/use-engraver-api-registration";
import { EngraverConfig } from "../../view/types/config/engraver-config";
import { EngraverController } from "../engraver-controller";
import { createEngraverStore } from "../store/engraver-store";
import { EngraverThemeType } from "../theme/theme.types";
import { EngraverContext } from "./engraver-context";
import { usePlayerStore } from "@/modules/player";
import React, { FC, useEffect, useMemo } from "react";

interface EngraverProviderProps {
  config: EngraverConfig;
  theme?: EngraverThemeType;
  children: React.ReactNode;
  engraverWrapperRef: React.RefObject<HTMLElement | null>;
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
