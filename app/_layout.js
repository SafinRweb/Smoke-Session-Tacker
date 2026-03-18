import Constants from 'expo-constants';
import * as NavigationBar from "expo-navigation-bar";
import { Stack } from "expo-router";
import * as SystemUI from "expo-system-ui";
import { useEffect } from "react";
import { Alert, Linking, Platform } from "react-native"; // Added Alert & Linking here
import { ui } from "../constants/ui";

export default function Layout() {
  // Grab the version number from your app.json
  const currentVersion = Constants.expoConfig.version;

  useEffect(() => {
    // --- YOUR EXISTING UI LOGIC ---
    SystemUI.setBackgroundColorAsync(ui.colors.bg).catch(() => {});
    if (Platform.OS === "android") {
      NavigationBar.setBackgroundColorAsync(ui.colors.bg).catch(() => {});
      NavigationBar.setButtonStyleAsync("light").catch(() => {});
    }

    // --- TRIGGER THE UPDATE CHECK ---
    checkForUpdates();
  }, []);

  // --- THE NEW UPDATE FUNCTIONS ---
const checkForUpdates = () => {
    // ⚠️ Put your raw.githubusercontent URL here!
    fetch("https://raw.githubusercontent.com/username/repo/main/update.json")
      .then((res) => res.json())
      .then((data) => {
        if (data.latest_version !== currentVersion) {
          Alert.alert(
            "Update Available! 🚀",
            // This now reads your custom release notes from GitHub!
            data.release_notes, 
            [
              { text: "Maybe Later", style: "cancel" },
              // We pass the dynamic APK link directly to the download function
              { text: "Download Now", onPress: () => handleDownload(data.apk_url) },
            ]
          );
        }
      })
      .catch((err) => console.log("Couldn't check for updates:", err));
  };

  // We added 'url' inside the parentheses here so it catches the link from GitHub
  const handleDownload = (url) => {
    Linking.openURL(url).catch((err) =>
      console.error("Couldn't open browser to download:", err)
    );
  };

  // --- YOUR EXISTING RENDER LOGIC ---
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