import React from "react";
import { View, Text, StyleSheet, ActivityIndicator } from "react-native";

const GREEN = "#0E6C38";

export default function LoadingOverlay({ text = "Đang xử lý..." }) {
  return (
    <View style={styles.overlay}>
      <View style={styles.box}>
        <ActivityIndicator size="large" color={GREEN} />
        <Text style={styles.text}>{text}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  overlay: {
    position: "absolute",
    top: 0, left: 0, right: 0, bottom: 0,
    backgroundColor: "rgba(0,0,0,0.35)",
    justifyContent: "center",
    alignItems: "center",
    zIndex: 999,
  },
  box: {
    backgroundColor: "#fff",
    padding: 22,
    borderRadius: 16,
    alignItems: "center",
    width: 180,
  },
  text: {
    marginTop: 10,
    fontWeight: "600",
    fontSize: 15,
    color: "#333",
  },
});
