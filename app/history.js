import { useEffect } from "react";
import {
  Pressable,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { StatusBar } from "expo-status-bar";
import { useRouter } from "expo-router";
import { useStore } from "../store/useStore";
import { ui } from "../constants/ui";
import { useSafeAreaInsets } from "react-native-safe-area-context";

export default function History() {
  const { sessions, loadSessions, getUserTotal } = useStore();
  const router = useRouter();
  const insets = useSafeAreaInsets();

  useEffect(() => {
    loadSessions();
  }, [loadSessions]);

  return (
    <SafeAreaView style={styles.safe}>
      <StatusBar style="light" backgroundColor={ui.colors.bg} />
      <ScrollView
        style={styles.container}
        contentContainerStyle={[
          styles.content,
          { paddingTop: insets.top + ui.spacing.s },
        ]}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.header}>
          <Text style={styles.title}>History</Text>
          <Text style={styles.subtitle}>
            Past sessions saved on this device.
          </Text>
        </View>

        {sessions.length === 0 ? (
          <View style={styles.emptyState}>
            <Text style={styles.emptyTitle}>No sessions yet</Text>
            <Text style={styles.emptyBody}>
              Start a new session to see it listed here.
            </Text>
            <Pressable
              onPress={() => router.push("/add-users")}
              style={({ pressed }) => [
                styles.primaryButton,
                pressed && styles.buttonPressed,
              ]}
            >
              <Text style={styles.primaryButtonText}>Start Session</Text>
            </Pressable>
          </View>
        ) : (
          sessions.map((s) => (
            <View key={s.id} style={styles.sessionCard}>
              <View style={styles.sessionHeader}>
                <Text style={styles.sessionDate}>{s.date}</Text>
                <Text style={styles.sessionTotal}>{s.total} tk</Text>
              </View>

              <View style={styles.participantList}>
                {s.users.map((u, i) => (
                  <View key={`${s.id}-${i}`} style={styles.participantRow}>
                    <Text style={styles.participantName}>{u.name}</Text>
                    <Text style={styles.participantTotal}>
                      {getUserTotal(u.counts)} tk
                    </Text>
                  </View>
                ))}
              </View>
            </View>
          ))
        )}
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
  emptyState: {
    backgroundColor: ui.colors.card,
    borderRadius: ui.radius.l,
    padding: ui.spacing.l,
    borderWidth: 1,
    borderColor: ui.colors.border,
    gap: ui.spacing.s,
  },
  emptyTitle: {
    color: ui.colors.text,
    fontWeight: "600",
  },
  emptyBody: {
    color: ui.colors.muted,
    lineHeight: 20,
  },
  sessionCard: {
    backgroundColor: ui.colors.card,
    borderRadius: ui.radius.l,
    padding: ui.spacing.l,
    borderWidth: 1,
    borderColor: ui.colors.border,
    ...ui.shadow,
  },
  sessionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: ui.spacing.s,
  },
  sessionDate: {
    color: ui.colors.text,
    fontWeight: "700",
    flex: 1,
    marginRight: ui.spacing.s,
  },
  sessionTotal: {
    color: ui.colors.primary,
    fontWeight: "800",
  },
  participantList: {
    gap: ui.spacing.xs,
  },
  participantRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  participantName: {
    color: ui.colors.text,
    fontWeight: "600",
  },
  participantTotal: {
    color: ui.colors.muted,
    fontSize: 12,
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
  buttonPressed: {
    opacity: 0.85,
  },
});
