import {
  KeyboardAvoidingView,
  Platform,
  Pressable,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { StatusBar } from "expo-status-bar";
import { useState } from "react";
import { useStore } from "../store/useStore";
import { useRouter } from "expo-router";
import { ui } from "../constants/ui";

export default function AddUsers() {
  const [name, setName] = useState("");
  const { users, addUser, removeUser } = useStore();
  const router = useRouter();
  const insets = useSafeAreaInsets();

  const canContinue = users.length > 0;

  return (
    <SafeAreaView style={styles.safe}>
      <StatusBar style="light" backgroundColor={ui.colors.bg} />
      <KeyboardAvoidingView
        style={[
          styles.container,
          {
            paddingTop: insets.top + ui.spacing.s,
            paddingBottom: insets.bottom + ui.spacing.l,
          },
        ]}
        behavior={Platform.select({ ios: "padding", android: undefined })}
      >
        <View style={styles.header}>
          <Text style={styles.title}>Add Fuka-Fuki Partners</Text>
          <Text style={styles.subtitle}>
            Add everyone who is sharing this session.
          </Text>
        </View>

        <View style={styles.inputCard}>
          <Text style={styles.label}>Friend name</Text>
          <View style={styles.inputRow}>
            <TextInput
              placeholder="Enter name"
              placeholderTextColor={ui.colors.muted}
              value={name}
              onChangeText={setName}
              style={styles.input}
              autoCorrect={false}
              autoCapitalize="words"
              returnKeyType="done"
            />
            <Pressable
              onPress={() => {
                if (!name.trim()) return;
                addUser(name.trim());
                setName("");
              }}
              style={({ pressed }) => [
                styles.addButton,
                pressed && styles.buttonPressed,
              ]}
            >
              <Text style={styles.addButtonText}>Add</Text>
            </Pressable>
          </View>
        </View>

        <ScrollView
          contentContainerStyle={styles.listContent}
          showsVerticalScrollIndicator={false}
        >
          {users.length === 0 ? (
            <View style={styles.emptyState}>
              <Text style={styles.emptyTitle}>No friends yet</Text>
              <Text style={styles.emptyBody}>
                Add at least one person to start the session.
              </Text>
            </View>
          ) : (
            users.map((u, i) => (
              <View key={`${u.name}-${i}`} style={styles.userRow}>
                <Text style={styles.userName}>{u.name}</Text>
                <Pressable
                  onPress={() => removeUser(i)}
                  style={({ pressed }) => [
                    styles.removeButton,
                    pressed && styles.buttonPressed,
                  ]}
                >
                  <Text style={styles.removeButtonText}>Remove</Text>
                </Pressable>
              </View>
            ))
          )}
        </ScrollView>

        <Pressable
          onPress={() => router.push("/session")}
          disabled={!canContinue}
          style={({ pressed }) => [
            styles.primaryButton,
            !canContinue && styles.primaryButtonDisabled,
            pressed && canContinue && styles.buttonPressed,
          ]}
        >
          <Text style={styles.primaryButtonText}>Start Session</Text>
        </Pressable>
      </KeyboardAvoidingView>
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
  },
  header: {
    marginBottom: ui.spacing.l,
  },
  title: {
    color: ui.colors.text,
    fontSize: 26,
    fontWeight: "800",
  },
  subtitle: {
    color: ui.colors.muted,
    marginTop: ui.spacing.s,
    fontSize: 15,
    fontWeight: "600",
  },
  inputCard: {
    backgroundColor: ui.colors.card,
    borderRadius: ui.radius.l,
    padding: ui.spacing.l,
    borderWidth: 1,
    borderColor: ui.colors.border,
    ...ui.shadow,
  },
  label: {
    color: ui.colors.muted,
    fontSize: 12,
    textTransform: "uppercase",
    letterSpacing: 0.8,
  },
  inputRow: {
    flexDirection: "row",
    gap: ui.spacing.s,
    marginTop: ui.spacing.s,
  },
  input: {
    flex: 1,
    backgroundColor: ui.colors.surface,
    color: ui.colors.text,
    borderRadius: ui.radius.m,
    paddingHorizontal: ui.spacing.m,
    paddingVertical: ui.spacing.s,
    borderWidth: 1,
    borderColor: ui.colors.border,
  },
  addButton: {
    backgroundColor: ui.colors.primary,
    borderRadius: ui.radius.m,
    paddingHorizontal: ui.spacing.l,
    justifyContent: "center",
  },
  addButtonText: {
    color: ui.colors.white,
    fontWeight: "700",
  },
  listContent: {
    paddingVertical: ui.spacing.l,
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
    fontSize: 16,
    fontWeight: "700",
  },
  removeButton: {
    backgroundColor: "transparent",
    borderWidth: 1,
    borderColor: ui.colors.border,
    paddingHorizontal: ui.spacing.m,
    paddingVertical: ui.spacing.xs,
    borderRadius: ui.radius.m,
  },
  removeButtonText: {
    color: ui.colors.danger,
    fontWeight: "600",
    fontSize: 12,
  },
  primaryButton: {
    backgroundColor: ui.colors.primary,
    paddingVertical: ui.spacing.m,
    borderRadius: ui.radius.l,
    alignItems: "center",
  },
  primaryButtonDisabled: {
    opacity: 0.5,
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
