import { useRouter } from "expo-router";
import {
  Pressable,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { StatusBar } from "expo-status-bar";
import { useStore } from "../store/useStore";
import { ui } from "../constants/ui";
import { useSafeAreaInsets } from "react-native-safe-area-context";

export default function Summary() {
  const { users, getUserTotal, getSessionTotal, saveSession } = useStore();
  const router = useRouter();
  const insets = useSafeAreaInsets();

  return (
    <SafeAreaView style={styles.safe}>
      <StatusBar style="light" backgroundColor={ui.colors.bg} />
      <ScrollView
        style={styles.container}
        contentContainerStyle={[
          styles.content,
          {
            paddingTop: insets.top + ui.spacing.s,
            paddingBottom: insets.bottom + ui.spacing.xl,
          },
        ]}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.header}>
          <Text style={styles.title}>Summary</Text>
          <Text style={styles.subtitle}>
            Review totals before saving this session.
          </Text>
        </View>

        <View style={styles.totalCard}>
          <Text style={styles.totalLabel}>Total cost</Text>
          <Text style={styles.totalValue}>{getSessionTotal()} tk</Text>
        </View>

        <View style={styles.list}>
          {users.length === 0 ? (
            <View style={styles.emptyState}>
              <Text style={styles.emptyTitle}>Nothing to summarize</Text>
              <Text style={styles.emptyBody}>
                Add participants and log items to see totals here.
              </Text>
            </View>
          ) : (
            users.map((u, i) => (
              <View key={`${u.name}-${i}`} style={styles.userRow}>
                <View>
                  <Text style={styles.userName}>{u.name}</Text>
                  <Text style={styles.userMeta}>
                    {Object.keys(u.counts).length} brands
                  </Text>
                </View>
                <Text style={styles.userTotal}>
                  {getUserTotal(u.counts)} tk
                </Text>
              </View>
            ))
          )}
        </View>

        <Pressable
          onPress={async () => {
            await saveSession();
            router.replace("/");
          }}
          style={({ pressed }) => [
            styles.primaryButton,
            pressed && styles.buttonPressed,
          ]}
        >
          <Text style={styles.primaryButtonText}>Save Session</Text>
        </Pressable>

        <Pressable
          onPress={() => router.replace("/")}
          style={({ pressed }) => [
            styles.secondaryButton,
            pressed && styles.buttonPressed,
          ]}
        >
          <Text style={styles.secondaryButtonText}>Maf kor bhai !</Text>
        </Pressable>
      </ScrollView>
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
  },
  content: {
    padding: ui.spacing.xl,
    paddingBottom: ui.spacing.xxl,
    gap: ui.spacing.l,
  },
  header: {
    gap: ui.spacing.s,
  },
  title: {
    color: ui.colors.text,
    fontSize: 26,
    fontWeight: "800",
  },
  subtitle: {
    color: ui.colors.muted,
    fontSize: 15,
    fontWeight: "600",
  },
  totalCard: {
    backgroundColor: ui.colors.card,
    borderRadius: ui.radius.l,
    padding: ui.spacing.l,
    borderWidth: 1,
    borderColor: ui.colors.border,
    ...ui.shadow,
  },
  totalLabel: {
    color: ui.colors.muted,
    textTransform: "uppercase",
    letterSpacing: 0.8,
    fontSize: 11,
  },
  totalValue: {
    color: ui.colors.text,
    fontSize: 24,
    fontWeight: "800",
    marginTop: ui.spacing.s,
  },
  list: {
    gap: ui.spacing.s,
  },
  emptyState: {
    backgroundColor: ui.colors.surface,
    borderRadius: ui.radius.l,
    padding: ui.spacing.l,
    borderWidth: 1,
    borderColor: ui.colors.border,
  },
  emptyTitle: {
    color: ui.colors.text,
    fontWeight: "600",
    marginBottom: ui.spacing.xs,
  },
  emptyBody: {
    color: ui.colors.muted,
    lineHeight: 20,
  },
  userRow: {
    backgroundColor: ui.colors.card,
    borderRadius: ui.radius.l,
    padding: ui.spacing.m,
    borderWidth: 1,
    borderColor: ui.colors.border,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  userName: {
    color: ui.colors.text,
    fontWeight: "700",
    fontSize: 16,
  },
  userMeta: {
    color: ui.colors.muted,
    marginTop: 2,
    fontSize: 12,
  },
  userTotal: {
    color: ui.colors.text,
    fontWeight: "800",
  },
  primaryButton: {
    backgroundColor: ui.colors.primary,
    paddingVertical: ui.spacing.m,
    borderRadius: ui.radius.l,
    alignItems: "center",
    marginTop: ui.spacing.s,
  },
  primaryButtonText: {
    color: ui.colors.white,
    fontSize: 16,
    fontWeight: "700",
  },
  secondaryButton: {
    borderWidth: 1,
    borderColor: ui.colors.border,
    paddingVertical: ui.spacing.m,
    borderRadius: ui.radius.l,
    alignItems: "center",
    backgroundColor: ui.colors.surface,
  },
  secondaryButtonText: {
    color: ui.colors.text,
    fontSize: 15,
    fontWeight: "700",
  },
  buttonPressed: {
    opacity: 0.85,
  },
});
