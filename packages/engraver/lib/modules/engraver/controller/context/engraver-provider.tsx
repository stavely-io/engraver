import React, { FC, useEffect, useMemo } from "react";

import { usePlayerStore } from "@/lib/modules/player";

import { useEngraverAPIRegistration } from "../../api/hooks/private/use-engraver-api-registration.js";
import { EngraverConfig } from "../../view/types/config/engraver-config.js";
import { EngraverController } from "../engraver-controller.js";
import { createEngraverStore } from "../store/engraver-store.js";
import { EngraverThemeType } from "../theme/theme.types.js";
import { EngraverContext } from "./engraver-context.js";

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
    () =>
      new EngraverController(
        config.engraverScoreConfig,
        engraverStore,
        playerStore,
      ),
    [config.engraverScoreConfig, engraverStore, playerStore],
  );

  useEffect(() => {
    if (theme) engraverController.setTheme(theme);
  }, [theme, engraverController]);

  useEffect(() => {
    if (config.engraverThemeConfig)
      engraverController.setTheme(config.engraverThemeConfig);
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
