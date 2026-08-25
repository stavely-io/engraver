import React, { FC, useCallback, useEffect, useRef } from "react";
import { AudioContext as StandarizedAudioContext } from "standardized-audio-context";

import { usePlayerAPIRegistration } from "../hooks/private/use-player-api-registration.js";
import { SmplrInstrumentType } from "../smplr/index.js";
import { createPlayerStore } from "../store/player-store.js";
import { PlayerContext } from "./player-context.js";

interface PlayerProviderProps {
  children: React.ReactNode;
}

export const PlayerProvider: FC<PlayerProviderProps> = ({ children }) => {
  const playerStore = useRef(createPlayerStore()).current;

  usePlayerAPIRegistration(playerStore);

  const initInstrument = useCallback(() => {
    playerStore.setState({
      audioContext: new StandarizedAudioContext() as unknown as AudioContext,
    });
    playerStore.getState().changeInstrument(SmplrInstrumentType.PIANO);
  }, [playerStore]);

  useEffect(() => {
    initInstrument();
  }, [initInstrument]);

  return (
    <PlayerContext.Provider value={{ playerStore }}>
      {children}
    </PlayerContext.Provider>
  );
};
