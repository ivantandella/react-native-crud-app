// @ts-nocheck
import React, { createContext, useState } from "react";
import { Appearance } from "react-native";
import { Colors } from "@/constants/Colors";

export const ThemeContext = createContext({
  colorScheme: Appearance.getColorScheme(),
  theme: Colors.light,
  setColorScheme: (color: string) => {},
});

export const ThemeProvider = ({ children }: { children: React.ReactNode }) => {
  const [colorScheme, setColorScheme] = useState(Appearance.getColorScheme());
  const theme = colorScheme === "dark" ? Colors.dark : Colors.light;

  return (
    <ThemeContext.Provider value={{ colorScheme, theme, setColorScheme }}>
      {children}
    </ThemeContext.Provider>
  );
};
