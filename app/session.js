import { useEffect, useRef, useState } from "react";
import {
  Animated,
  Easing,
  FlatList,
  Modal,
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
import { brands } from "../constants/brands";
import { ui } from "../constants/ui";
import { useSafeAreaInsets } from "react-native-safe-area-context";

export default function Session() {
  const { users, addCig, removeCig, getUserTotal, getSessionTotal } =
    useStore();
  const router = useRouter();
  const insets = useSafeAreaInsets();

  const [expandedIndex, setExpandedIndex] = useState(null);
  const [selectedBrand, setSelectedBrand] = useState("Royal");
  const [qty, setQty] = useState(1);
  const [pickerOpen, setPickerOpen] = useState(false);
  const brandList = Object.keys(brands);
  const marqueeText =
    "Bondhur taka na thakle , Bondhuke Cigarette deya theke beroto thakun. Nijer cigarette nje khan, Arekta Cigarette ar jonne taka bachan.";
  const [marqueeContainerWidth, setMarqueeContainerWidth] = useState(0);
  const [marqueeTextWidth, setMarqueeTextWidth] = useState(0);
  const fallbackTextWidth = marqueeText.length * 9;
  const effectiveTextWidth = marqueeTextWidth || fallbackTextWidth;
  const marqueeTranslate = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (!marqueeContainerWidth || !effectiveTextWidth) return;
    const gap = ui.spacing.xl;
    const distance = effectiveTextWidth + gap;
    marqueeTranslate.setValue(marqueeContainerWidth);
    const duration = Math.max(9000, distance * 40);
    const loop = Animated.loop(
      Animated.timing(marqueeTranslate, {
        toValue: -distance,
        duration,
        easing: Easing.linear,
        useNativeDriver: true,
      })
    );
    loop.start();
    return () => loop.stop();
  }, [
    marqueeContainerWidth,
    marqueeTextWidth,
    marqueeTranslate,
    fallbackTextWidth,
    effectiveTextWidth,
  ]);

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
          <View style={styles.headerRow}>
            <Text style={styles.title}>Session</Text>
            <Pressable
              onPress={() => router.push("/add-users")}
              style={({ pressed }) => [
                styles.headerAction,
                pressed && styles.buttonPressed,
              ]}
            >
              <Text style={styles.headerActionText}>Add Member</Text>
            </Pressable>
          </View>
          <Text style={styles.subtitle}>Track each person and keep totals.</Text>
          <View
            style={styles.marqueeContainer}
            onLayout={(event) =>
              setMarqueeContainerWidth(event.nativeEvent.layout.width)
            }
          >
            <Animated.View
              style={[
                styles.marqueeTrack,
                { transform: [{ translateX: marqueeTranslate }] },
              ]}
            >
              <Text
                style={[styles.marqueeText, { width: effectiveTextWidth }]}
                numberOfLines={1}
                ellipsizeMode="clip"
              >
                {marqueeText}
              </Text>
              <View style={{ width: ui.spacing.xl }} />
              <Text
                style={[styles.marqueeText, { width: effectiveTextWidth }]}
                numberOfLines={1}
                ellipsizeMode="clip"
              >
                {marqueeText}
              </Text>
            </Animated.View>
          </View>
          <Text
            style={styles.marqueeMeasure}
            numberOfLines={1}
            ellipsizeMode="clip"
            onTextLayout={(event) => {
              const line = event.nativeEvent.lines?.[0];
              if (line?.width) setMarqueeTextWidth(line.width);
            }}
          >
            {marqueeText}
          </Text>
        </View>

        <View style={styles.totalCard}>
          <Text style={styles.totalLabel}>Session Total</Text>
          <Text style={styles.totalValue}>{getSessionTotal()} tk</Text>
        </View>

        {users.length === 0 ? (
          <View style={styles.emptyState}>
            <Text style={styles.emptyTitle}>No participants yet</Text>
            <Text style={styles.emptyBody}>
              Go back and add friends to start logging items.
            </Text>
          </View>
        ) : (
          users.map((user, i) => {
            const isOpen = expandedIndex === i;
            const items = Object.entries(user.counts).filter(
              ([, count]) => count > 0
            );

            return (
              <View key={`${user.name}-${i}`} style={styles.userCard}>
                <Pressable
                  onPress={() => setExpandedIndex(isOpen ? null : i)}
                  style={styles.userHeader}
                >
                  <View>
                    <Text style={styles.userName}>{user.name}</Text>
                    <Text style={styles.userHint}>
                      {isOpen ? "Tap to collapse" : "Tap to expand"}
                    </Text>
                  </View>
                  <View style={styles.totalPill}>
                    <Text style={styles.totalPillText}>
                      {getUserTotal(user.counts)} tk
                    </Text>
                  </View>
                </Pressable>

                {isOpen && (
                  <View style={styles.userBody}>
                    <Text style={styles.sectionLabel}>Current items</Text>
                    {items.length === 0 ? (
                      <Text style={styles.emptyInline}>
                        No items yet for this person.
                      </Text>
                    ) : (
                      items.map(([brand, count]) => (
                        <View key={brand} style={styles.itemRow}>
                          <View>
                            <Text style={styles.itemName}>{brand}</Text>
                            <Text style={styles.itemMeta}>
                              {brands[brand]} tk each
                            </Text>
                          </View>
                          <View style={styles.counter}>
                            <Pressable
                              onPress={() => removeCig(i, brand)}
                              style={({ pressed }) => [
                                styles.counterButton,
                                pressed && styles.buttonPressed,
                              ]}
                            >
                              <Text style={styles.counterButtonText}>-</Text>
                            </Pressable>
                            <Text style={styles.counterValue}>{count}</Text>
                            <Pressable
                              onPress={() => addCig(i, brand)}
                              style={({ pressed }) => [
                                styles.counterButton,
                                pressed && styles.buttonPressed,
                              ]}
                            >
                              <Text style={styles.counterButtonText}>+</Text>
                            </Pressable>
                          </View>
                        </View>
                      ))
                    )}

                    <View style={styles.addCard}>
                      <Text style={styles.sectionLabel}>Add cigarettes</Text>
                      <Pressable
                        onPress={() => setPickerOpen(true)}
                        style={({ pressed }) => [
                          styles.pickerField,
                          pressed && styles.buttonPressed,
                        ]}
                      >
                        <Text style={styles.pickerText}>{selectedBrand}</Text>
                        <Text style={styles.pickerChevron}>v</Text>
                      </Pressable>

                      <View style={styles.qtyRow}>
                        <Text style={styles.qtyLabel}>Quantity</Text>
                        <View style={styles.counter}>
                          <Pressable
                            onPress={() => setQty(Math.max(1, qty - 1))}
                            style={({ pressed }) => [
                              styles.counterButton,
                              pressed && styles.buttonPressed,
                            ]}
                          >
                            <Text style={styles.counterButtonText}>-</Text>
                          </Pressable>
                          <Text style={styles.counterValue}>{qty}</Text>
                          <Pressable
                            onPress={() => setQty(qty + 1)}
                            style={({ pressed }) => [
                              styles.counterButton,
                              pressed && styles.buttonPressed,
                            ]}
                          >
                            <Text style={styles.counterButtonText}>+</Text>
                          </Pressable>
                        </View>
                      </View>

                      <Pressable
                        onPress={() => {
                          for (let j = 0; j < qty; j++) {
                            addCig(i, selectedBrand);
                          }
                          setQty(1);
                        }}
                        style={({ pressed }) => [
                          styles.primaryButton,
                          pressed && styles.buttonPressed,
                        ]}
                      >
                        <Text style={styles.primaryButtonText}>Add items</Text>
                      </Pressable>
                    </View>
                  </View>
                )}
              </View>
            );
          })
        )}

        <Pressable
          onPress={() => router.push("/summary")}
          style={({ pressed }) => [
            styles.reviewButton,
            pressed && styles.buttonPressed,
          ]}
        >
          <Text style={styles.reviewButtonText}>Review Summary</Text>
        </Pressable>
      </ScrollView>
      <Modal
        transparent
        visible={pickerOpen}
        animationType="fade"
        onRequestClose={() => setPickerOpen(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalSheet}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Select brand</Text>
              <Pressable
                onPress={() => setPickerOpen(false)}
                style={({ pressed }) => [
                  styles.modalClose,
                  pressed && styles.buttonPressed,
                ]}
              >
                <Text style={styles.modalCloseText}>Close</Text>
              </Pressable>
            </View>
            <FlatList
              data={brandList}
              keyExtractor={(item) => item}
              showsVerticalScrollIndicator={false}
              contentContainerStyle={styles.modalList}
              renderItem={({ item }) => (
                <Pressable
                  onPress={() => {
                    setSelectedBrand(item);
                    setPickerOpen(false);
                  }}
                  style={({ pressed }) => [
                    styles.modalItem,
                    item === selectedBrand && styles.modalItemActive,
                    pressed && styles.buttonPressed,
                  ]}
                >
                  <Text style={styles.modalItemText}>{item}</Text>
                </Pressable>
              )}
            />
          </View>
        </View>
      </Modal>
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
  headerRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: ui.spacing.s,
  },
  headerAction: {
    backgroundColor: ui.colors.surface,
    paddingHorizontal: ui.spacing.m,
    paddingVertical: ui.spacing.xs,
    borderRadius: ui.radius.m,
    borderWidth: 1,
    borderColor: ui.colors.border,
  },
  headerActionText: {
    color: ui.colors.text,
    fontWeight: "700",
    fontSize: 12,
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
  marqueeContainer: {
    marginTop: ui.spacing.xs,
    paddingVertical: ui.spacing.s,
    paddingHorizontal: ui.spacing.m,
    borderRadius: ui.radius.m,
    backgroundColor: "rgba(255, 90, 31, 0.12)",
    borderWidth: 1,
    borderColor: "rgba(255, 90, 31, 0.3)",
    overflow: "hidden",
  },
  marqueeTrack: {
    flexDirection: "row",
    alignItems: "center",
  },
  marqueeText: {
    color: ui.colors.primary,
    fontSize: 11,
    fontWeight: "700",
    lineHeight: 18,
    includeFontPadding: false,
    flexShrink: 0,
  },
  marqueeMeasure: {
    position: "absolute",
    opacity: 0,
    zIndex: -1,
    left: 0,
    top: 0,
    width: 10000,
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
  userCard: {
    backgroundColor: ui.colors.card,
    borderRadius: ui.radius.l,
    borderWidth: 1,
    borderColor: ui.colors.border,
    overflow: "hidden",
  },
  userHeader: {
    padding: ui.spacing.l,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  userName: {
    color: ui.colors.text,
    fontSize: 18,
    fontWeight: "700",
  },
  userHint: {
    color: ui.colors.muted,
    marginTop: ui.spacing.xs,
    fontSize: 12,
  },
  totalPill: {
    backgroundColor: ui.colors.surface,
    paddingHorizontal: ui.spacing.m,
    paddingVertical: ui.spacing.xs,
    borderRadius: ui.radius.m,
    borderWidth: 1,
    borderColor: ui.colors.border,
  },
  totalPillText: {
    color: ui.colors.text,
    fontWeight: "700",
  },
  userBody: {
    padding: ui.spacing.l,
    borderTopWidth: 1,
    borderTopColor: ui.colors.border,
    gap: ui.spacing.m,
  },
  sectionLabel: {
    color: ui.colors.muted,
    textTransform: "uppercase",
    letterSpacing: 0.6,
    fontSize: 11,
  },
  emptyInline: {
    color: ui.colors.muted,
    fontSize: 13,
  },
  itemRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  itemName: {
    color: ui.colors.text,
    fontWeight: "700",
  },
  itemMeta: {
    color: ui.colors.muted,
    fontSize: 12,
    marginTop: 2,
  },
  counter: {
    flexDirection: "row",
    alignItems: "center",
    gap: ui.spacing.s,
  },
  counterButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: ui.colors.border,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: ui.colors.surface,
  },
  counterButtonText: {
    color: ui.colors.text,
    fontSize: 18,
    fontWeight: "700",
  },
  counterValue: {
    color: ui.colors.text,
    fontWeight: "700",
    minWidth: 22,
    textAlign: "center",
  },
  addCard: {
    backgroundColor: ui.colors.surface,
    borderRadius: ui.radius.l,
    padding: ui.spacing.l,
    borderWidth: 1,
    borderColor: ui.colors.border,
    gap: ui.spacing.s,
  },
  pickerField: {
    borderWidth: 1,
    borderColor: ui.colors.border,
    borderRadius: ui.radius.m,
    paddingHorizontal: ui.spacing.m,
    paddingVertical: ui.spacing.s,
    backgroundColor: ui.colors.card,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  pickerText: {
    color: ui.colors.text,
    fontWeight: "700",
  },
  pickerChevron: {
    color: ui.colors.muted,
    fontWeight: "700",
    fontSize: 12,
  },
  qtyRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: ui.spacing.s,
  },
  qtyLabel: {
    color: ui.colors.text,
    fontWeight: "700",
  },
  primaryButton: {
    backgroundColor: ui.colors.primary,
    paddingVertical: ui.spacing.m,
    borderRadius: ui.radius.m,
    alignItems: "center",
    marginTop: ui.spacing.s,
  },
  primaryButtonText: {
    color: ui.colors.white,
    fontWeight: "700",
  },
  reviewButton: {
    backgroundColor: ui.colors.primary,
    paddingVertical: ui.spacing.m,
    borderRadius: ui.radius.l,
    alignItems: "center",
    marginTop: ui.spacing.s,
  },
  reviewButtonText: {
    color: ui.colors.white,
    fontSize: 16,
    fontWeight: "700",
  },
  buttonPressed: {
    opacity: 0.85,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.65)",
    justifyContent: "flex-end",
  },
  modalSheet: {
    backgroundColor: ui.colors.card,
    borderTopLeftRadius: ui.radius.xl,
    borderTopRightRadius: ui.radius.xl,
    padding: ui.spacing.l,
    maxHeight: "70%",
    borderWidth: 1,
    borderColor: ui.colors.border,
  },
  modalHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: ui.spacing.s,
  },
  modalTitle: {
    color: ui.colors.text,
    fontWeight: "800",
    fontSize: 16,
  },
  modalClose: {
    paddingHorizontal: ui.spacing.m,
    paddingVertical: ui.spacing.xs,
    borderRadius: ui.radius.m,
    backgroundColor: ui.colors.surface,
  },
  modalCloseText: {
    color: ui.colors.muted,
    fontWeight: "700",
  },
  modalList: {
    gap: ui.spacing.s,
    paddingBottom: ui.spacing.l,
  },
  modalItem: {
    paddingVertical: ui.spacing.m,
    paddingHorizontal: ui.spacing.m,
    borderRadius: ui.radius.m,
    backgroundColor: ui.colors.surface,
    borderWidth: 1,
    borderColor: ui.colors.border,
  },
  modalItemActive: {
    borderColor: ui.colors.primary,
  },
  modalItemText: {
    color: ui.colors.text,
    fontWeight: "700",
  },
});
