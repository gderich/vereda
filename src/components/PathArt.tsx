import React from "react";
import { View, StyleSheet } from "react-native";
import BrandMark from "./BrandMark";
export default function PathArt() {
  return (
    <View style={styles.scene}>
      <BrandMark size={200} />
    </View>
  );
}
const styles = StyleSheet.create({
  scene: {
    alignItems: "center",
    backgroundColor: "#102D39",
    borderRadius: 24,
    paddingVertical: 8,
    marginVertical: 4,
  },
});
