import { Platform } from "react-native";

export const ui = {
  colors: {
    bg: "#000000",
    surface: "#0a0a0a",
    card: "#111111",
    border: "#1f1f1f",
    text: "#f5f5f5",
    muted: "#a1a1aa",
    primary: "#ff5a1f",
    primaryDark: "#e14912",
    danger: "#ef4444",
    warning: "#f59e0b",
    white: "#ffffff",
  },
  spacing: {
    xs: 6,
    s: 10,
    m: 14,
    l: 18,
    xl: 24,
    xxl: 32,
  },
  radius: {
    s: 10,
    m: 14,
    l: 18,
    xl: 24,
  },
  shadow: Platform.select({
    ios: {
      shadowColor: "#000000",
      shadowOffset: { width: 0, height: 8 },
      shadowOpacity: 0.18,
      shadowRadius: 12,
    },
    android: {
      elevation: 4,
    },
    default: {},
  }),
};
