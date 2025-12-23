import React, { useEffect } from "react";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
} from "react-native";
import Ionicons from "@expo/vector-icons/Ionicons";
import { useLocalSearchParams, router, useRouter } from "expo-router";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { addHistory, getLatestHistory } from "../../api";

const GREEN = "#0E6C38";
const BG = "#F5F7FA";

export default function SearchResultScreen() {
  const params = useLocalSearchParams();
  const routerHook = useRouter();
  const insets = useSafeAreaInsets();

  let results: any[] = [];
  try {
    if (params.data) results = JSON.parse(params.data as string);
  } catch (err) {
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

      {/* HEADER */}
      <View style={[styles.header, { paddingTop: insets.top + 8, height: 56 + insets.top }]}>
        <TouchableOpacity onPress={handleBack}>
          <Ionicons name="chevron-back" size={24} color="#000" />
        </TouchableOpacity>

        <Text style={styles.headerTitle}>Kết quả tìm kiếm</Text>
        <View style={{ width: 30 }} />
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollWrap}
      >
        {results.map((item, index) => (
          <TouchableOpacity
            key={index}
            style={styles.card}
            onPress={() =>
              router.push({
                pathname: "/_screens/SearchDetailScreen",
                params: { recipe: JSON.stringify(item) },
              })
            }
          >
            {/* TÊN MÓN */}
            <Text style={styles.title}>{item.title}</Text>

            {/* PREVIEW NGUYÊN LIỆU */}
            {item.ingredients && item.ingredients.length > 0 && (
              <View style={{ marginTop: 8 }}>
                <Text style={styles.previewText}>
                  {item.ingredients.slice(0, 3).join(" • ")}
                  {item.ingredients.length > 3 && " • ..."}
                </Text>
              </View>
            )}

            {/* THỜI GIAN (nếu có) */}
            {item.time && (
              <View style={styles.timeRow}>
                <Ionicons name="time-outline" size={16} color="#666" />
                <Text style={styles.timeText}>{item.time}</Text>
              </View>
            )}

            {/* XEM CHI TIẾT */}
            <View style={styles.viewDetailRow}>
              <Text style={styles.viewDetailText}>Xem chi tiết</Text>
              <Ionicons name="chevron-forward" size={16} color={GREEN} />
            </View>
          </TouchableOpacity>
        ))}

        {results.length === 0 && (
          <Text style={styles.noResult}>Không tìm thấy món ăn phù hợp.</Text>
        )}
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
    marginBottom: 18,
    elevation: 3,
  },

  title: {
    fontSize: 22,
    fontWeight: "700",
    color: GREEN,
    marginBottom: 10,
  },

  section: {
    fontSize: 17,
    fontWeight: "700",
    marginBottom: 6,
  },

  textItem: { fontSize: 15, lineHeight: 22, marginBottom: 4 },

  previewText: {
    fontSize: 14,
    color: "#666",
    lineHeight: 20,
  },

  timeRow: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 8,
    gap: 4,
  },

  timeText: {
    fontSize: 13,
    color: "#666",
  },

  viewDetailRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "flex-end",
    marginTop: 12,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: "#f0f0f0",
  },

  viewDetailText: {
    fontSize: 14,
    color: GREEN,
    fontWeight: "600",
    marginRight: 4,
  },

  noResult: {
    marginTop: 40,
    textAlign: "center",
    fontSize: 16,
    color: "#777",
  },
});
