import React, { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import { useColorScheme } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";

import { palettes } from "./palettes";

const STORAGE_KEY = "@brasileirao2026/theme-preference";

const ThemeContext = createContext(null);

// preference: "system" | "light" | "dark"
export function ThemeProvider({ children }) {
  const systemScheme = useColorScheme();
  const [preference, setPreference] = useState("system");

  useEffect(() => {
    AsyncStorage.getItem(STORAGE_KEY)
      .then((value) => {
        if (value === "light" || value === "dark" || value === "system") {
          setPreference(value);
        }
      })
      .catch(() => {});
  }, []);

  const setThemePreference = useCallback((value) => {
    setPreference(value);
    AsyncStorage.setItem(STORAGE_KEY, value).catch(() => {});
  }, []);

  const resolvedMode = preference === "system" ? (systemScheme === "dark" ? "dark" : "light") : preference;
  const colors = palettes[resolvedMode];

  const value = useMemo(
    () => ({ preference, resolvedMode, colors, setThemePreference }),
    [preference, resolvedMode, colors, setThemePreference]
  );

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
}

export function useAppTheme() {
  const ctx = useContext(ThemeContext);
  if (!ctx) {
    throw new Error("useAppTheme precisa ser usado dentro de um ThemeProvider");
  }
  return ctx;
}
