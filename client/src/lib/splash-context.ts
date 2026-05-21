import { createContext, useContext } from "react";

export const SplashContext = createContext(false);
export const useSplash = () => useContext(SplashContext);
