import React, { FC, useRef } from "react";

import { createPlayerAPIStore } from "../store/player-api-store.js";
import { PlayerAPIContext } from "./player-api.js";

interface PlayerProviderProps {
  children: React.ReactNode;
}

export const PlayerAPIProvider: FC<PlayerProviderProps> = ({ children }) => {
  const playerAPIStore = useRef(createPlayerAPIStore()).current;

  return (
    <PlayerAPIContext.Provider value={{ playerAPIStore }}>
      {" "}
      {children}{" "}
    </PlayerAPIContext.Provider>
  );
};
