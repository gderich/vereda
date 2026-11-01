import React from "react";
import { View, Text, Pressable, StyleSheet, ScrollView } from "react-native";
export const colors = {
  paper: "#0B1D29",
  ink: "#F5E8C8",
  muted: "#AEC0C9",
  green: "#F2C66D",
  pale: "#213E4B",
  gold: "#E9BC62",
  line: "#35505D",
  white: "#FFFFFF",
  surface: "#142F3E",
  night: "#102D39",
};
export const ui = StyleSheet.create({
  page: { flex: 1, backgroundColor: colors.paper },
  content: {
    padding: 20,
    paddingBottom: 40,
    gap: 20,
    width: "100%",
    maxWidth: 680,
    alignSelf: "center",
  },
  title: {
    fontSize: 32,
    fontWeight: "800",
    color: colors.ink,
    letterSpacing: -1,
  },
  heading: { fontSize: 22, fontWeight: "700", color: colors.ink },
  body: { fontSize: 16, lineHeight: 25, color: colors.muted },
  small: { fontSize: 13, lineHeight: 20, color: colors.muted },
  eyebrow: {
    fontSize: 12,
    letterSpacing: 2,
    fontWeight: "700",
    color: colors.green,
  },
  card: {
    backgroundColor: colors.surface,
    borderRadius: 16,
    padding: 20,
    gap: 12,
    borderWidth: 1,
    borderColor: colors.line,
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    flexWrap: "wrap",
  },
  button: {
    backgroundColor: colors.green,
    borderRadius: 14,
    padding: 16,
    minHeight: 52,
    alignItems: "center",
    borderBottomWidth: 4,
    borderBottomColor: "#B58A3D",
  },
  buttonText: {
    color: colors.night,
    fontSize: 16,
    fontWeight: "700",
    textAlign: "center",
  },
  secondary: { backgroundColor: colors.pale, borderBottomColor: "#152D37" },
  input: {
    borderWidth: 1,
    borderColor: colors.line,
    borderRadius: 12,
    padding: 16,
    color: colors.ink,
    backgroundColor: colors.surface,
    fontSize: 16,
    minHeight: 120,
    textAlignVertical: "top",
  },
});
export function Page({ children }: React.PropsWithChildren) {
  return (
    <ScrollView
      style={ui.page}
      contentContainerStyle={ui.content}
      keyboardShouldPersistTaps="handled"
    >
      {children}
    </ScrollView>
  );
}
export function Button({
  title,
  onPress,
  secondary = false,
  disabled = false,
}: {
  title: string;
  onPress: () => void;
  secondary?: boolean;
  disabled?: boolean;
}) {
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityState={{ disabled }}
      disabled={disabled}
      onPress={onPress}
      style={({ pressed }) => [
        ui.button,
        secondary && ui.secondary,
        { opacity: disabled ? 0.5 : pressed ? 0.8 : 1 },
      ]}
    >
      <Text style={[ui.buttonText, secondary && { color: colors.green }]}>
        {title}
      </Text>
    </Pressable>
  );
}
export function Progress({ value, label }: { value: number; label: string }) {
  return (
    <View
      accessible
      accessibilityRole="progressbar"
      accessibilityLabel={label}
      accessibilityValue={{ min: 0, max: 100, now: Math.round(value * 100) }}
      style={{
        height: 10,
        backgroundColor: colors.line,
        borderRadius: 5,
        overflow: "hidden",
      }}
    >
      <View
        style={{
          height: 10,
          width: `${Math.min(100, Math.max(0, value * 100))}%`,
          backgroundColor: colors.green,
          borderRadius: 5,
        }}
      />
    </View>
  );
}
