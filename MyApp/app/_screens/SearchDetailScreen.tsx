import React from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
} from "react-native";
import Ionicons from "@expo/vector-icons/Ionicons";
import { useLocalSearchParams, router, useRouter } from "expo-router";
import { useSafeAreaInsets } from "react-native-safe-area-context";

const GREEN = "#0E6C38";
const BG = "#F5F7FA";

export default function SearchDetailScreen() {
  const params = useLocalSearchParams();
  const routerHook = useRouter();
  const insets = useSafeAreaInsets();

  let recipe: any = {};
  try {
    if (params.recipe) recipe = JSON.parse(params.recipe as string);
  } catch (e) {
    // Silent catch
  }

  const handleBack = () => {
    if (routerHook.canGoBack()) {
      routerHook.back();
    } else {
      router.replace("/(tabs)");
    }
  };
  
  return (
    <View style={styles.screen}>
      <View style={[styles.header, { paddingTop: insets.top + 8, height: 56 + insets.top }]}>
        <TouchableOpacity onPress={handleBack}>
          <Ionicons name="chevron-back" size={24} color="#000" />
        </TouchableOpacity>

        <Text style={styles.headerTitle}>Chi tiết món ăn</Text>
        <View style={{ width: 30 }} />
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollWrap}>
        <View style={styles.card}>
          <Text style={styles.title}>{recipe.title}</Text>

          {recipe.ingredients && (
            <View style={{ marginTop: 12 }}>
              <Text style={styles.section}>Nguyên liệu</Text>
              {recipe.ingredients.map((ing: string, idx: number) => (
                <Text key={idx} style={styles.textItem}>• {ing}</Text>
              ))}
            </View>
          )}

          {recipe.steps && (
            <View style={{ marginTop: 20 }}>
              <Text style={styles.section}>Cách làm</Text>
              {recipe.steps.map((step: string, idx: number) => (
                <Text key={idx} style={styles.textItem}>
                  {idx + 1}. {step}
                </Text>
              ))}
            </View>
          )}
        </View>

        <View style={{ height: 80 }} />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: BG },
  header: {
    flexDirection: "row",
    alignItems: "flex-end",
    paddingHorizontal: 16,
    paddingBottom: 12,
    backgroundColor: "#fff",
    borderBottomWidth: 1,
    borderBottomColor: "#E5E5E5",
  },
  headerTitle: {
    flex: 1,
    textAlign: "center",
    fontSize: 20,
    fontWeight: "700",
  },
  scrollWrap: { padding: 16, paddingBottom: 120 },
  card: {
    backgroundColor: "#fff",
    borderRadius: 18,
    padding: 20,
  },
  title: { fontSize: 24, fontWeight: "700", color: GREEN },
  section: { fontSize: 18, fontWeight: "700", marginTop: 10 },
  textItem: { fontSize: 15, marginVertical: 3 },
});
