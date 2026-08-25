import React, { FC, useRef } from "react";

import { createEngraverAPIStore } from "../store/engraver-api-store.js";
import { EngraverAPIContext } from "./engraver-api.js";

interface EngraverProviderProps {
  children: React.ReactNode;
}

export const EngraverAPIProvider: FC<EngraverProviderProps> = ({
  children,
}) => {
  const engraverAPIStore = useRef(createEngraverAPIStore()).current;

  return (
    <EngraverAPIContext.Provider value={{ engraverAPIStore }}>
      {children}
    </EngraverAPIContext.Provider>
  );
};
