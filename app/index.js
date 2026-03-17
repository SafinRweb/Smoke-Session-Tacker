import { useRouter } from "expo-router";
import {
  Image,
  ImageBackground,
  Pressable,
  SafeAreaView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { StatusBar } from "expo-status-bar";
import { useFonts, ArchivoBlack_400Regular } from "@expo-google-fonts/archivo-black";
import { ui } from "../constants/ui";

export default function Home() {
  const router = useRouter();
  const [fontsLoaded] = useFonts({
    ArchivoBlack_400Regular,
  });

  if (!fontsLoaded) {
    return <SafeAreaView style={styles.safe} />;
  }

  return (
    <SafeAreaView style={styles.safe}>
      <StatusBar style="light" backgroundColor={ui.colors.bg} />
      <ImageBackground
        source={require("../assets/images/home_bg.jpg")}
        resizeMode="cover"
        style={styles.backgroundImage}
        pointerEvents="none"
      >
        <View style={styles.overlay} />
      </ImageBackground>
      <View style={styles.container}>
        <View style={styles.hero}>
          <Image
            source={require("../assets/images/tracker_logo.png")}
            style={styles.logo}
            resizeMode="cover"
          />
          <Text style={styles.headline}>Aibar Bill na diye palabi kothay?</Text>
          <Text style={styles.subtitle}>
            A clean session tracker for shared smoking costs.
          </Text>
        </View>

        <View style={styles.card}>
          <Text style={styles.cardTitle}>Start a new session</Text>
          <Text style={styles.cardBody}>
            Add friends, choose brands, and log each puff in seconds.
          </Text>

          <Pressable
            onPress={() => router.push("/add-users")}
            style={({ pressed }) => [
              styles.primaryButton,
              pressed && styles.buttonPressed,
            ]}
          >
            <Text style={styles.primaryButtonText}>Add Session</Text>
          </Pressable>
        </View>

        <Pressable
          onPress={() => router.push("/history")}
          style={({ pressed }) => [
            styles.secondaryButton,
            pressed && styles.buttonPressed,
          ]}
        >
          <Text style={styles.secondaryButtonText}>History</Text>
        </Pressable>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: ui.colors.bg,
  },
  container: {
    flex: 1,
    padding: ui.spacing.xl,
    justifyContent: "center",
    gap: ui.spacing.l,
  },
  backgroundImage: {
    ...StyleSheet.absoluteFillObject,
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(0, 0, 0, 0.72)",
  },
  hero: {
    marginBottom: ui.spacing.s,
  },
  logo: {
    width: 72,
    height: 72,
    borderRadius: 36,
    backgroundColor: ui.colors.card,
    marginBottom: ui.spacing.m,
  },
  headline: {
    color: ui.colors.text,
    fontSize: 40,
    fontWeight: "900",
    marginTop: ui.spacing.s,
    lineHeight: 44,
    fontFamily: "ArchivoBlack_400Regular",
  },
  subtitle: {
    color: ui.colors.muted,
    marginTop: ui.spacing.s,
    fontSize: 15,
    lineHeight: 22,
    fontWeight: "600",
  },
  card: {
    backgroundColor: ui.colors.card,
    borderRadius: ui.radius.xl,
    padding: ui.spacing.xl,
    borderWidth: 1,
    borderColor: ui.colors.border,
    ...ui.shadow,
  },
  cardTitle: {
    color: ui.colors.text,
    fontSize: 18,
    fontWeight: "700",
  },
  cardBody: {
    color: ui.colors.muted,
    marginTop: ui.spacing.s,
    marginBottom: ui.spacing.l,
    lineHeight: 20,
  },
  primaryButton: {
    backgroundColor: ui.colors.primary,
    paddingVertical: ui.spacing.m,
    borderRadius: ui.radius.m,
    alignItems: "center",
  },
  primaryButtonText: {
    color: ui.colors.white,
    fontWeight: "700",
    fontSize: 16,
  },
  secondaryButton: {
    borderWidth: 1,
    borderColor: ui.colors.border,
    paddingVertical: ui.spacing.m,
    borderRadius: ui.radius.m,
    alignItems: "center",
    backgroundColor: ui.colors.surface,
  },
  secondaryButtonText: {
    color: ui.colors.text,
    fontWeight: "700",
    fontSize: 15,
  },
  buttonPressed: {
    opacity: 0.85,
  },
});
