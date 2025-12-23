import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  ScrollView,
  Image,
  Dimensions,
} from "react-native";
import * as ImagePicker from "expo-image-picker";
import Ionicons from "@expo/vector-icons/Ionicons";

import { smartRecommend } from "../../api";

const GREEN = "#0E6C38";
const BG = "#F5F7FA";
const { width } = Dimensions.get("window");

type Recipe = {
  id?: string;
  title: string;
  time?: string;
  ingredients?: string[];
  steps?: string[];
  image?: any;
};

const INGREDIENTS_DATA = [
  { key: "Thịt gà" },
  { key: "Trứng" },
  { key: "Bò" },
  { key: "Lợn" },
  { key: "Cá" },
  { key: "Hải sản" },
  { key: "Mì/đồ sợi" },
  { key: "Sữa" },
  { key: "Ốc" },
  { key: "Vịt" },
  { key: "Bánh mì" },
  { key: "Cơm" },
];

export default function IngredientScreen({
  isLoggedIn,
  savedIds,
  onToggleSave,
  onBackToTabs,
}: any) {
  const [mode, setMode] = useState<"select" | "results" | "detail">("select");
  const [selected, setSelected] = useState<string[]>([]);
  const [apiResult, setApiResult] = useState<any>(null);
  const [selectedRecipe, setSelectedRecipe] = useState<any>(null);

    /* Chọn nguyên liệu bằng tay */
  const toggleIngredient = (name: string) => {
    if (!name) return;
    setSelected((prev) =>
      prev.includes(name) ? prev.filter((x) => x !== name) : [...prev, name]
    );
  };

    /* Pick ảnh → detect → recommend */
  const pickImages = async () => {
    try {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsMultipleSelection: true,
        quality: 1,
      });

      if (result.canceled) return;

      const uris = result.assets.map((a) => a.uri);
      
      await fetchRecipes(uris);
      setMode("results");
    } catch (err) {
      // Silent catch
    }
  };

  const fetchRecipes = async (uris: string[]) => {
    if (!uris.length) return;

    const res = await smartRecommend(uris);

    setApiResult({
      type: res.recommended_recipes.length > 0 ? "online" : "offline",
      results: res.recommended_recipes,
      ingredients: res.detected_ingredients,
    });

    setSelected(res.detected_ingredients);
  };

  /* RESULTS SCREEN */
  if (mode === "results") {
    const isOffline = apiResult?.type === "offline";

    return (
      <View style={{ flex: 1, backgroundColor: BG }}>
        {/* HEADER */}
        <View style={styles.headerRow}>
          <TouchableOpacity onPress={() => setMode("select")}>
            <Ionicons name="chevron-back" size={24} color="#000" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Kết quả</Text>
          <View style={{ width: 28 }} />
        </View>

        <ScrollView showsVerticalScrollIndicator={false}>
          {/* Title */}
          <View style={{ paddingHorizontal: 16, paddingTop: 16 }}>
            <Text style={styles.bigTitle}>Gợi ý món ăn</Text>
            <Text style={styles.subText}>
              Dựa trên{" "}
              <Text style={{ fontWeight: "700" }}>{selected.length}</Text> nguyên
              liệu của bạn
            </Text>
          </View>

          {/* CHIPS */}
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            style={{ marginTop: 12, paddingLeft: 16 }}
          >
            {selected.map((item) => (
              <View key={item} style={styles.chip}>
                <Text style={styles.chipText}>{item}</Text>
                <TouchableOpacity
                  onPress={() => toggleIngredient(item)}
                  style={styles.chipClose}
                >
                  <Ionicons name="close" size={14} color="#000" />
                </TouchableOpacity>
              </View>
            ))}
          </ScrollView>

          {/* RESULTS CARD */}
          <View style={{ marginTop: 20 }}>
            {isOffline &&
              apiResult?.results?.map((item: Recipe, idx: number) => {
                const isSaved = savedIds.includes(item.id ?? "");

                return (
                  <TouchableOpacity
                    key={idx}
                    style={styles.recipeCard}
                    onPress={() => {
                      setSelectedRecipe(item);
                      setMode("detail");
                    }}
                  >
                    <View style={styles.recipeImgBox} />

                    <View style={{ flex: 1, marginLeft: 12 }}>
                      <Text style={styles.recipeName}>{item.title}</Text>
                    </View>

                    {isLoggedIn && (
                      <TouchableOpacity
                        onPress={() => onToggleSave(item)}
                        style={{ padding: 6 }}
                      >
                        <Ionicons
                          name="bookmark"
                          size={22}
                          color={isSaved ? GREEN : "#aaa"}
                        />
                      </TouchableOpacity>
                    )}
                  </TouchableOpacity>
                );
              })}
          </View>
        </ScrollView>

        {/* FLOATING BTN */}
        <TouchableOpacity
          style={styles.floatBtn}
          onPress={() => setMode("select")}
        >
          <Ionicons name="options-outline" size={18} color="#fff" />
          <Text style={{ color: "#fff", marginLeft: 6, fontWeight: "600" }}>
            Chọn lại
          </Text>
        </TouchableOpacity>
      </View>
    );
  }

  /* DETAIL RECIPE */
  if (mode === "detail" && selectedRecipe) {
    return (
      <View style={{ flex: 1, backgroundColor: "#fff" }}>
        <ScrollView contentContainerStyle={{ paddingBottom: 80 }}>
          {/* IMAGE HEADER */}
          <View style={styles.detailImgWrap}>
            <View style={styles.detailImg} />
            <View style={styles.overlay} />

            <TouchableOpacity
              style={styles.backTopBtn}
              onPress={() => setMode("results")}
            >
              <Ionicons name="chevron-back" size={24} color="#fff" />
            </TouchableOpacity>
          </View>

          {/* TITLE */}
          <Text style={styles.detailTitle}>{selectedRecipe.title}</Text>

          {/* INGREDIENTS */}
          <View style={styles.sectionBox}>
            <Text style={styles.sectionTitle}>Nguyên liệu</Text>

            {(selectedRecipe.ingredients ?? ["500g nguyên liệu"]).map(
              (ing: string, idx: number) => (
                <View key={idx} style={styles.ingRow}>
                  <View style={styles.checkbox} />
                  <Text style={styles.ingText}>{ing}</Text>
                </View>
              )
            )}
          </View>

          {/* STEPS */}
          <View style={styles.sectionBox}>
            <Text style={styles.sectionTitle}>Cách làm</Text>

            {(selectedRecipe.steps ?? ["Trộn", "Nấu", "Dọn ra"]).map(
              (s: string, idx: number) => (
                <View key={idx} style={styles.stepRow}>
                  <View style={styles.stepIndex}>
                    <Text>{idx + 1}</Text>
                  </View>
                  <Text style={styles.stepText}>{s}</Text>
                </View>
              )
            )}
          </View>
        </ScrollView>
      </View>
    );
  }

  /* SELECT INGREDIENTS */
  return (
    <View style={{ flex: 1, backgroundColor: BG }}>
      {/* HEADER */}
      <View style={styles.headerRow}>
        <TouchableOpacity onPress={onBackToTabs}>
          <Ionicons name="chevron-back" size={24} color="#000" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Nguyên liệu</Text>
        <View style={{ width: 28 }} />
      </View>

      {/* SEARCH */}
      <View style={styles.searchBar}>
        <TextInput style={{ flex: 1 }} placeholder="Tìm nguyên liệu..." />
        <Ionicons name="search" size={18} />
      </View>

      {/* GRID */}
      <ScrollView contentContainerStyle={styles.grid}>
        {INGREDIENTS_DATA.map((item) => {
          const isSelected = selected.includes(item.key);

          return (
            <TouchableOpacity
              key={item.key}
              style={[
                styles.itemCard,
                isSelected && { borderColor: GREEN, borderWidth: 2 },
              ]}
              onPress={() => toggleIngredient(item.key)}
            >
              <View style={styles.itemImg} />
              <Text style={styles.itemText}>{item.key}</Text>

              <View
                style={[
                  styles.itemCheck,
                  isSelected && {
                    backgroundColor: GREEN,
                    borderColor: GREEN,
                  },
                ]}
              >
                {isSelected && (
                  <Ionicons name="checkmark" size={14} color="#fff" />
                )}
              </View>
            </TouchableOpacity>
          );
        })}
      </ScrollView>

      {/* UPLOAD FAB */}
      <TouchableOpacity style={styles.uploadBtn} onPress={pickImages}>
        <Ionicons name="cloud-upload-outline" size={26} color="#fff" />
      </TouchableOpacity>

      {/* VIEW RESULTS BTN */}
      <TouchableOpacity
        style={[styles.viewBtn, selected.length === 0 && { opacity: 0.4 }]}
        disabled={selected.length === 0}
        onPress={() => {
          fetchRecipes(selected);
          setMode("results");
        }}
      >
        <Text style={styles.viewBtnText}>Xem món ăn</Text>
      </TouchableOpacity>
    </View>
  );
}

/* STYLES */
const styles = StyleSheet.create({
  headerRow: {
    height: 52,
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    backgroundColor: "#fff",
    justifyContent: "space-between",
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: "700",
  },

  searchBar: {
    margin: 16,
    backgroundColor: "#E8ECF2",
    borderRadius: 30,
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    height: 44,
  },

  grid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 16,
    paddingHorizontal: 16,
    paddingBottom: 140,
  },

  itemCard: {
    width: "30%",
    backgroundColor: "#fff",
    borderRadius: 18,
    padding: 10,
    elevation: 2,
    shadowColor: "#000",
    shadowOpacity: 0.08,
    shadowRadius: 5,
    borderColor: "#fff",
  },
  itemImg: {
    width: "100%",
    height: 48,
    backgroundColor: "#E1E4E8",
    borderRadius: 12,
    marginBottom: 8,
  },
  itemText: {
    fontWeight: "500",
    fontSize: 13,
  },
  itemCheck: {
    position: "absolute",
    top: 6,
    right: 6,
    width: 22,
    height: 22,
    borderRadius: 999,
    borderWidth: 1,
    borderColor: "#BFC4C9",
    backgroundColor: "#fff",
    justifyContent: "center",
    alignItems: "center",
  },

  /* RESULTS */
  bigTitle: {
    fontSize: 24,
    fontWeight: "700",
  },
  subText: {
    color: "#555",
    fontSize: 14,
  },
  chip: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#fff",
    borderRadius: 999,
    paddingHorizontal: 12,
    paddingVertical: 6,
    marginRight: 8,
    elevation: 2,
  },
  chipText: {
    fontWeight: "600",
  },
  chipClose: {
    marginLeft: 6,
  },

  recipeCard: {
    flexDirection: "row",
    backgroundColor: "#fff",
    padding: 12,
    marginHorizontal: 16,
    marginBottom: 14,
    borderRadius: 16,
    elevation: 2,
    alignItems: "center",
  },
  recipeImgBox: {
    width: 68,
    height: 68,
    borderRadius: 14,
    backgroundColor: "#D8D8D8",
  },
  recipeName: {
    fontSize: 16,
    fontWeight: "600",
  },

  floatBtn: {
    position: "absolute",
    bottom: 84,
    right: 16,
    backgroundColor: GREEN,
    flexDirection: "row",
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: 28,
    alignItems: "center",
    elevation: 5,
  },

  /* DETAIL */
  detailImgWrap: {
    width: width,
    height: 260,
    borderBottomLeftRadius: 28,
    borderBottomRightRadius: 28,
    overflow: "hidden",
  },
  detailImg: {
    flex: 1,
    backgroundColor: "#E2E2E2",
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(0,0,0,0.28)",
  },
  backTopBtn: {
    position: "absolute",
    top: 40,
    left: 16,
    padding: 8,
    backgroundColor: "rgba(0,0,0,0.4)",
    borderRadius: 12,
  },
  detailTitle: {
    fontSize: 22,
    fontWeight: "700",
    marginTop: 16,
    paddingHorizontal: 16,
  },

  sectionBox: {
    marginTop: 20,
    paddingHorizontal: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "700",
    marginBottom: 12,
  },

  ingRow: {
    flexDirection: "row",
    paddingVertical: 10,
    backgroundColor: "#F1F3F5",
    borderRadius: 12,
    marginBottom: 10,
    paddingHorizontal: 14,
  },
  ingText: {
    marginLeft: 10,
    fontSize: 14,
  },
  checkbox: {
    width: 22,
    height: 22,
    borderRadius: 6,
    borderWidth: 1.4,
    borderColor: "#A8A8A8",
  },

  stepRow: {
    flexDirection: "row",
    marginBottom: 12,
  },
  stepIndex: {
    width: 26,
    height: 26,
    borderRadius: 13,
    backgroundColor: "#E9EFE9",
    alignItems: "center",
    justifyContent: "center",
    marginRight: 12,
  },
  stepText: {
    flex: 1,
    fontSize: 14,
  },

  /* VIEW BTN */
  viewBtn: {
    position: "absolute",
    bottom: 20,
    alignSelf: "center",
    backgroundColor: GREEN,
    width: width * 0.85,
    height: 50,
    borderRadius: 14,
    justifyContent: "center",
    alignItems: "center",
    elevation: 6,
  },
  viewBtnText: {
    color: "#fff",
    fontWeight: "700",
    fontSize: 16,
  },

  uploadBtn: {
    position: "absolute",
    bottom: 90,
    left: width / 2 - 32,
    width: 64,
    height: 64,
    backgroundColor: GREEN,
    borderRadius: 999,
    justifyContent: "center",
    alignItems: "center",
    elevation: 8,
  },
});
