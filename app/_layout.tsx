import { ThemeContext, ThemeProvider } from "@/context/ThemeContext";
import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import React from "react";
import { SafeAreaProvider } from "react-native-safe-area-context";

export default function RootLayout() {
  return (
    <ThemeProvider>
      <SafeAreaProvider>
        <Stack screenOptions={{ headerShown: false }}>
          <Stack.Screen name="index" options={{ title: "All Todos" }} />
          <Stack.Screen
            name="todos/[id]"
            options={{ headerShown: true, title: "Edit Todo" }}
          />
        </Stack>
      </SafeAreaProvider>
    </ThemeProvider>
  );
}
