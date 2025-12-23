import React from "react";
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
} from "react-native";
import Ionicons from "@expo/vector-icons/Ionicons";
import { useRouter } from "expo-router";
import { useSafeAreaInsets } from "react-native-safe-area-context";

const GREEN = "#0E6C38";
const BG = "#F5F7FA";

export default function DetectResultScreen({ route, navigation, onBack }) {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const data = route?.params || {};
  const ingredients = data.detected_ingredients ?? [];
  const recipes = data.recommended_recipes ?? [];

  const handleBack = () => {
    if (onBack) {
      onBack();
    } else if (navigation?.goBack) {
      navigation.goBack();
    } else {
      if (router.canGoBack()) {
        router.back();
      } else {
        router.replace("/(tabs)");
      }
    }
  };

  return (
    <View style={styles.screen}>
      {/* HEADER */}
      <View style={[styles.header, { paddingTop: insets.top - 100, height: 0 + insets.top }]}>
        <TouchableOpacity onPress={handleBack}>
          <Ionicons name="chevron-back" size={22} color="#000" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Kết quả nhận diện</Text>
        <View style={{ width: 20 }} />
      </View>

      <ScrollView
        style={{ flex: 1 }}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 120 }}
      >
        {/* NGUYÊN LIỆU NHẬN DIỆN */}
        <View style={{ paddingHorizontal: 14, paddingTop: 14 }}>
          <Text style={styles.sectionTitle}>Nguyên liệu nhận diện được</Text>

          {ingredients.length === 0 ? (
            <Text style={styles.noText}>Không nhận diện được nguyên liệu.</Text>
          ) : (
            <View style={styles.chipWrap}>
              {ingredients.map((item, idx) => (
                <View style={styles.chip} key={idx}>
                  <Text style={styles.chipText}>{item}</Text>
                </View>
              ))}
            </View>
          )}
        </View>

        {/* DIVIDER */}
        <View style={styles.divider} />

        {/* MÓN ĂN GỢI Ý */}
        <View style={{ paddingHorizontal: 14, paddingBottom: 20 }}>
          <Text style={styles.sectionTitle}>Món ăn gợi ý</Text>

          {recipes.length === 0 ? (
            <Text style={styles.noText}>Không tìm thấy món ăn phù hợp.</Text>
          ) : (
            recipes.map((recipe, idx) => (
              <TouchableOpacity
                key={idx}
                style={styles.recipeCard}
                onPress={() => {
                  router.push({
                    pathname: "/_screens/SearchDetailScreen",
                    params: { recipe: JSON.stringify(recipe) },
                  });
                }}
              >
                {/* TÊN MÓN */}
                <Text style={styles.recipeName}>
                  {recipe.title || recipe.name || "Không có tên món ăn"}
                </Text>

                {/* THỜI GIAN NẤU */}
                {(recipe.cooking_time || recipe.time || recipe.steps) && (
                  <View style={styles.timeRow}>
                    <Ionicons name="time-outline" size={16} color="#666" />
                    <Text style={styles.timeText}>
                      {recipe.cooking_time || recipe.time || `${recipe.steps?.length * 5 || 20} phút`}
                    </Text>
                  </View>
                )}

                {/* PREVIEW NGUYÊN LIỆU */}
                {recipe.ingredients && recipe.ingredients.length > 0 && (
                  <View style={{ marginTop: 8 }}>
                    <Text style={styles.previewText}>
                      {recipe.ingredients.slice(0, 3).join(" • ")}
                      {recipe.ingredients.length > 3 && " • ..."}
                    </Text>
                  </View>
                )}

                {/* PREVIEW CÁC BƯỚC (2 bước đầu) */}
                {Array.isArray(recipe.steps) && recipe.steps.length > 0 && (
                  <View style={{ marginTop: 10 }}>
                    {recipe.steps.slice(0, 2).map((step, sIdx) => (
                      <View style={styles.stepRowCompact} key={sIdx}>
                        <View style={styles.stepIndexSmall}>
                          <Text style={{ fontSize: 12, fontWeight: "700" }}>
                            {sIdx + 1}
                          </Text>
                        </View>
                        <Text style={styles.stepTextCompact} numberOfLines={1}>
                          {step}
                        </Text>
                      </View>
                    ))}
                    {recipe.steps.length > 2 && (
                      <Text style={styles.moreStepsText}>
                        +{recipe.steps.length - 2} bước nữa
                      </Text>
                    )}
                  </View>
                )}

                {/* XEM CHI TIẾT */}
                <View style={styles.viewDetailRow}>
                  <Text style={styles.viewDetailText}>Xem chi tiết</Text>
                  <Ionicons name="chevron-forward" size={16} color={GREEN} />
                </View>
              </TouchableOpacity>
            ))
          )}
        </View>
      </ScrollView>
    </View>
  );
}

/* STYLES*/
const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: BG,
  },

  /* HEADER */
  header: {
    backgroundColor: "#ffffffff",
    flexDirection: "row",
    alignItems: "flex-end",
    paddingHorizontal: 10,
    paddingBottom: 5,
    justifyContent: "space-between",
    elevation: 3,
    borderBottomWidth: 1,
    borderBottomColor: "#E5E5E5",
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: "700",
  },

  /* TITLE */
  sectionTitle: {
    fontSize: 20,
    fontWeight: "700",
    marginBottom: 10,
  },

  /* CHIPS */
  chipWrap: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
  },
  chip: {
    paddingHorizontal: 12,
    paddingVertical: 7,
    borderRadius: 18,
    backgroundColor: GREEN,
  },
  chipText: {
    color: "#fff",
    fontWeight: "600",
  },

  divider: {
    height: 1,
    backgroundColor: "#E2E4E8",
    marginVertical: 16,
    marginHorizontal: 0,
  },

  /* RECIPE CARD */
  recipeCard: {
    padding: 15,
    backgroundColor: "#fff",
    borderRadius: 12,
    marginTop: 12,
    elevation: 2,
  },
  recipeName: {
    fontSize: 17,
    fontWeight: "800",
    color: GREEN,
  },

  timeRow: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 6,
    gap: 4,
  },

  timeText: {
    fontSize: 13,
    color: "#666",
    fontWeight: "500",
  },

  previewText: {
    fontSize: 14,
    color: "#666",
    lineHeight: 20,
  },

  /* STEPS - Compact version */
  stepRowCompact: {
    flexDirection: "row",
    marginTop: 6,
    alignItems: "center",
  },
  stepIndexSmall: {
    width: 20,
    height: 20,
    backgroundColor: "#E9EFE9",
    borderRadius: 10,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 8,
  },
  stepTextCompact: {
    flex: 1,
    fontSize: 13,
    color: "#555",
    lineHeight: 18,
  },
  moreStepsText: {
    fontSize: 13,
    color: "#888",
    marginTop: 6,
    fontStyle: "italic",
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

  /* STEPS - Old (keep for compatibility) */
  stepRow: {
    flexDirection: "row",
    marginTop: 10,
  },
  stepIndex: {
    width: 26,
    height: 26,
    backgroundColor: "#E9EFE9",
    borderRadius: 14,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 10,
  },
  stepText: {
    flex: 1,
    fontSize: 14,
    lineHeight: 20,
  },

  noText: {
    color: "#777",
    fontSize: 14,
  },
});
