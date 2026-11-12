import { createPlayerStore, SmplrInstrumentType } from "@engraver/core";

import { type FC, type ReactNode, useCallback, useEffect, useRef } from "react";
import { AudioContext as StandarizedAudioContext } from "standardized-audio-context";

import { PlayerContext } from "./player-context";

interface PlayerProviderProps {
  children: ReactNode;
}

export const PlayerProvider: FC<PlayerProviderProps> = ({ children }) => {
  const playerStore = useRef(createPlayerStore()).current;

  const initInstrument = useCallback(() => {
    playerStore.setState({
      audioContext: new StandarizedAudioContext() as unknown as AudioContext,
    });
    void playerStore.getState().changeInstrument(SmplrInstrumentType.PIANO);
  }, [playerStore]);

  useEffect(() => {
    initInstrument();
  }, [initInstrument]);

  return <PlayerContext.Provider value={{ playerStore }}>{children}</PlayerContext.Provider>;
};
