import { createPlayerAPIStore } from "@engraver/core";

import { type FC, type ReactNode, useRef } from "react";

import { PlayerAPIContext } from "./player-api";

interface PlayerAPIProviderProps {
  children: ReactNode;
}

export const PlayerAPIProvider: FC<PlayerAPIProviderProps> = ({ children }) => {
  const playerAPIStore = useRef(createPlayerAPIStore()).current;

  return (
    <PlayerAPIContext.Provider value={{ playerAPIStore }}>{children}</PlayerAPIContext.Provider>
  );
};
