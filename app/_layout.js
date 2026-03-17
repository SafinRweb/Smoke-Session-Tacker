import { useEffect } from "react";
import { Platform } from "react-native";
import { Stack } from "expo-router";
import * as SystemUI from "expo-system-ui";
import * as NavigationBar from "expo-navigation-bar";
import { ui } from "../constants/ui";

export default function Layout() {
  useEffect(() => {
    SystemUI.setBackgroundColorAsync(ui.colors.bg).catch(() => {});
    if (Platform.OS === "android") {
      NavigationBar.setBackgroundColorAsync(ui.colors.bg).catch(() => {});
      NavigationBar.setButtonStyleAsync("light").catch(() => {});
    }
  }, []);

  return (
    <Stack
      screenOptions={{
        headerShown: false,
        animation: "fade",
        animationDuration: 260,
        contentStyle: { backgroundColor: ui.colors.bg },
      }}
    />
  );
}
