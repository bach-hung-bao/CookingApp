import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet, ActivityIndicator, Animated, Easing } from "react-native";
import { Redirect } from "expo-router";
import Ionicons from "@expo/vector-icons/Ionicons";

const GREEN = "#0E6C38";

export default function Index() {
  const [isReady, setIsReady] = useState(false);
  const [fadeAnim] = useState(new Animated.Value(0));
  const [scaleAnim] = useState(new Animated.Value(0.8));
  const [spinValue] = useState(new Animated.Value(0));

  useEffect(() => {
    // Fade in và scale up animation
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 800,
        useNativeDriver: true,
      }),
      Animated.spring(scaleAnim, {
        toValue: 1,
        friction: 4,
        tension: 40,
        useNativeDriver: true,
      }),
    ]).start();

    // Spinning animation cho icon loading
    Animated.loop(
      Animated.timing(spinValue, {
        toValue: 1,
        duration: 1500,
        easing: Easing.linear,
        useNativeDriver: true,
      })
    ).start();

    // Delay 3.5 giây rồi chuyển sang trang chủ
    const timer = setTimeout(() => {
      setIsReady(true);
    }, 3500);

    return () => clearTimeout(timer);
  }, []);

  const spin = spinValue.interpolate({
    inputRange: [0, 1],
    outputRange: ["0deg", "360deg"],
  });

  if (isReady) {
    return <Redirect href="/(tabs)" />;
  }

  return (
    <View style={styles.container}>
      <Animated.View
        style={[
          styles.content,
          {
            opacity: fadeAnim,
            transform: [{ scale: scaleAnim }],
          },
        ]}
      >
        {/* Icon lá cây */}
        <View style={styles.iconContainer}>
          <Ionicons name="leaf" size={80} color={GREEN} />
        </View>

        {/* Chữ Cooking */}
        <Text style={styles.title}>Cooking</Text>
        <Text style={styles.subtitle}>Nấu ăn dễ dàng mỗi ngày</Text>

        {/* Loading spinner */}
        <Animated.View style={[styles.spinnerContainer, { transform: [{ rotate: spin }] }]}>
          <Ionicons name="sync" size={32} color={GREEN} />
        </Animated.View>

        <Text style={styles.loadingText}>Đang tải...</Text>
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f0f9f4",
    justifyContent: "center",
    alignItems: "center",
  },
  content: {
    alignItems: "center",
    justifyContent: "center",
  },
  iconContainer: {
    width: 140,
    height: 140,
    backgroundColor: "#fff",
    borderRadius: 70,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 24,
    shadowColor: GREEN,
    shadowOpacity: 0.2,
    shadowRadius: 20,
    shadowOffset: { width: 0, height: 4 },
    elevation: 8,
  },
  title: {
    fontSize: 48,
    fontWeight: "bold",
    color: GREEN,
    marginBottom: 8,
    letterSpacing: 1,
  },
  subtitle: {
    fontSize: 16,
    color: "#555",
    marginBottom: 48,
    fontWeight: "500",
  },
  spinnerContainer: {
    marginBottom: 12,
  },
  loadingText: {
    fontSize: 14,
    color: "#777",
    fontWeight: "500",
  },
});