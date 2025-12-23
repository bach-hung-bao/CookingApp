import React from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
  Dimensions,
} from "react-native";
import Ionicons from "@expo/vector-icons/Ionicons";

const GREEN = "#0E6C38";
const BG = "#F5F7FA";
const { width } = Dimensions.get("window");

type Recipe = {
  id: string;
  title: string;
  time?: string;
  image: any;
};

type Category = {
  id: string;
  title: string;
  count: number;
  image: any;
  recipes: Recipe[];
};

type Props = {
  isLoggedIn: boolean;
  savedIds: string[];
  onToggleSave: (recipe: { id: string; title: string; time?: string }) => void;
};

const MENU_CATEGORIES: Category[] = [
  {
    id: "menu-1",
    title: "Món Tết",
    count: 105,
    image: require("../images/chao_suon_sun.jpg"),
    recipes: [
      {
        id: "dish-1",
        title: "Cỗ Tết Hà Nội xưa",
        image: require("../images/chao_suon_sun.jpg"),
      },
      {
        id: "dish-2",
        title: "Bốn món canh trong cỗ Tết Hà Nội xưa",
        image: require("../images/Anh_bigImage.jpeg"),
      },
      {
        id: "dish-3",
        title: "Cách muối dưa hành truyền thống",
        time: "45 phút",
        image: require("../images/xoi_lac.png"),
      },
      {
        id: "dish-4",
        title: "Cá trắm kho riềng kiểu phố cổ Hà Nội",
        time: "50 phút",
        image: require("../images/Anh_bigImage.jpeg"),
      },
    ],
  },
  {
    id: "menu-2",
    title: "Món đãi khách",
    count: 64,
    image: require("../images/Anh_bigImage.jpeg"),
    recipes: [
      {
        id: "dish-5",
        title: "Cá Trắm om ",
        image: require("../images/jollibee.jpg"),
      },
    ],
  },
];

const DETAIL_FALLBACK = {
  ingredients: [
    "1 kg cá trắm đen",
    "200 g thịt ba chỉ",
    "100 g bì lợn",
    "Riềng, hành khô",
    "Gia vị: mắm, muối, đường vàng, tiêu…",
  ],
  steps: [
    "Sơ chế cá, rửa sạch.",
    "Ướp cá với gia vị 20 phút.",
    "Xếp cá vào nồi, thêm nước hàng.",
    "Kho lửa nhỏ cho đến khi cạn sánh.",
  ],
};

export default function MenuScreen({ isLoggedIn, savedIds, onToggleSave }: Props) {
  const [mode, setMode] = React.useState<"categories" | "list" | "detail">(
    "categories"
  );
  const [currentCategory, setCurrentCategory] =
    React.useState<Category | null>(null);
  const [currentRecipe, setCurrentRecipe] =
    React.useState<Recipe | null>(null);

  const [checkedIngredients, setCheckedIngredients] = React.useState<string[]>([]);

  const toggleIngredient = (ing: string) => {
    setCheckedIngredients((prev) =>
      prev.includes(ing) ? prev.filter((x) => x !== ing) : [...prev, ing]
    );
  };

  /* ==========================================================
      MÀN 3 – CHI TIẾT MÓN ĂN
  ========================================================== */
  if (mode === "detail" && currentRecipe) {
    const isSaved = savedIds.includes(currentRecipe.id);
    const detail = DETAIL_FALLBACK;

    return (
      <View style={styles.screenWhite}>
        <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 80 }}>
          
          {/* ẢNH LỚN + OVERLAY */}
          <View style={styles.detailImgWrap}>
            <Image source={currentRecipe.image} style={styles.detailImg} />
            <View style={styles.detailOverlay} />

            <TouchableOpacity
              style={styles.detailBack}
              onPress={() => setMode("list")}
            >
              <Ionicons name="chevron-back" size={24} color="#fff" />
            </TouchableOpacity>
          </View>

          {/* TIÊU ĐỀ */}
          <Text style={styles.detailTitle}>{currentRecipe.title}</Text>

          {/* NGUYÊN LIỆU */}
          <View style={styles.sectionBox}>
            <Text style={styles.sectionTitle}>Nguyên liệu</Text>

            {detail.ingredients.map((ing) => {
              const checked = checkedIngredients.includes(ing);
              return (
                <TouchableOpacity
                  key={ing}
                  onPress={() => toggleIngredient(ing)}
                  style={[styles.ingItem, checked && styles.ingChecked]}
                >
                  <View
                    style={[
                      styles.checkbox,
                      checked && styles.checkboxChecked,
                    ]}
                  >
                    {checked && (
                      <Ionicons name="checkmark" size={14} color="#fff" />
                    )}
                  </View>
                  <Text style={styles.ingText}>{ing}</Text>
                </TouchableOpacity>
              );
            })}

            {isLoggedIn && (
              <TouchableOpacity
                style={styles.saveBtn}
                onPress={() =>
                  onToggleSave({
                    id: currentRecipe.id,
                    title: currentRecipe.title,
                    time: currentRecipe.time,
                  })
                }
              >
                <Ionicons
                  name="bookmark"
                  size={18}
                  color={isSaved ? "#000" : "#fff"}
                />
                <Text style={styles.saveBtnText}>
                  {isSaved ? "Đã lưu" : "Lưu món"}
                </Text>
              </TouchableOpacity>
            )}
          </View>

          {/* CÁCH LÀM */}
          <View style={styles.sectionBox}>
            <Text style={styles.sectionTitle}>Cách làm</Text>

            {detail.steps.map((step, idx) => (
              <View key={idx} style={styles.stepRow}>
                <View style={styles.stepIndex}>
                  <Text style={{ fontWeight: "700" }}>{idx + 1}</Text>
                </View>
                <Text style={styles.stepText}>{step}</Text>
              </View>
            ))}
          </View>
        </ScrollView>
      </View>
    );
  }

  /* ==========================================================
      MÀN 2 – LIST MÓN TRONG DANH MỤC
  ========================================================== */
  if (mode === "list" && currentCategory) {
    return (
      <View style={styles.screenGrey}>
        <View style={styles.headerRow}>
          <TouchableOpacity onPress={() => setMode("categories")}>
            <Ionicons name="chevron-back" size={22} color="#000" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>{currentCategory.title}</Text>
          <View style={{ width: 28 }} />
        </View>

        <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 80 }}>
          {currentCategory.recipes.map((recipe) => {
            const isSaved = savedIds.includes(recipe.id);
            return (
              <TouchableOpacity
                key={recipe.id}
                style={styles.recipeCard}
                onPress={() => {
                  setCurrentRecipe(recipe);
                  setCheckedIngredients([]);
                  setMode("detail");
                }}
                activeOpacity={0.8}
              >
                <Image source={recipe.image} style={styles.recipeImg} />

                <View style={{ flex: 1, marginLeft: 12 }}>
                  <Text style={styles.recipeTitle}>{recipe.title}</Text>
                  {recipe.time && (
                    <View style={styles.timeRow}>
                      <Ionicons name="time-outline" size={14} color="#666" />
                      <Text style={styles.timeText}>{recipe.time}</Text>
                    </View>
                  )}
                </View>

                {isLoggedIn && (
                  <TouchableOpacity
                    onPress={() =>
                      onToggleSave({
                        id: recipe.id,
                        title: recipe.title,
                        time: recipe.time,
                      })
                    }
                  >
                    <Ionicons
                      name="bookmark"
                      size={22}
                      color={isSaved ? GREEN : "#ccc"}
                    />
                  </TouchableOpacity>
                )}
              </TouchableOpacity>
            );
          })}
        </ScrollView>
      </View>
    );
  }

  /* ==========================================================
      MÀN 1 – DANH SÁCH DANH MỤC (MENU)
  ========================================================== */
  return (
    <ScrollView style={styles.screenGrey} showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 40 }}>
      <View style={styles.headerRow}>
        <Text style={styles.headerTitle}>Thực đơn</Text>
      </View>

      {MENU_CATEGORIES.map((cat) => (
        <TouchableOpacity
          key={cat.id}
          style={styles.categoryCard}
          onPress={() => {
            setCurrentCategory(cat);
            setMode("list");
          }}
          activeOpacity={0.85}
        >
          <View style={styles.categoryImgWrap}>
            <Image source={cat.image} style={styles.categoryImg} />
            <View style={styles.categoryOverlay} />

            <Text style={styles.categoryName}>{cat.title}</Text>
            <Text style={styles.categoryCount}>{cat.count} món</Text>
          </View>
        </TouchableOpacity>
      ))}
    </ScrollView>
  );
}

/* ==========================================================
                    STYLE MỚI – ĐẸP
========================================================== */
const styles = StyleSheet.create({
  screenGrey: {
    flex: 1,
    backgroundColor: BG,
  },
  screenWhite: {
    flex: 1,
    backgroundColor: "#fff",
  },

  /* HEADER */
  headerRow: {
    height: 50,
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    justifyContent: "space-between",
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: "700",
  },

  /* CATEGORY CARD */
  categoryCard: {
    marginHorizontal: 16,
    marginTop: 16,
    borderRadius: 18,
    overflow: "hidden",
    elevation: 3,
    backgroundColor: "#fff",
  },
  categoryImgWrap: {
    width: "100%",
    height: 180,
    borderRadius: 18,
    overflow: "hidden",
    justifyContent: "flex-end",
  },
  categoryImg: {
    width: "100%",
    height: "100%",
  },
  categoryOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(0,0,0,0.28)",
  },
  categoryName: {
    fontSize: 20,
    fontWeight: "700",
    color: "#fff",
    paddingHorizontal: 14,
  },
  categoryCount: {
    fontSize: 13,
    color: "#eee",
    paddingHorizontal: 14,
    marginBottom: 10,
  },

  /* LIST RECIPE CARD */
  recipeCard: {
    flexDirection: "row",
    marginHorizontal: 16,
    marginTop: 14,
    backgroundColor: "#fff",
    borderRadius: 16,
    padding: 12,
    elevation: 2,
  },
  recipeImg: {
    width: 90,
    height: 90,
    borderRadius: 14,
  },
  recipeTitle: {
    fontSize: 16,
    fontWeight: "600",
  },
  timeRow: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 6,
    gap: 6,
  },
  timeText: {
    fontSize: 13,
    color: "#666",
  },

  /* DETAIL IMAGE */
  detailImgWrap: {
    width: width,
    height: 260,
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30,
    overflow: "hidden",
  },
  detailImg: {
    width: "100%",
    height: "100%",
  },
  detailOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(0,0,0,0.25)",
  },
  detailBack: {
    position: "absolute",
    top: 40,
    left: 16,
    backgroundColor: "rgba(0,0,0,0.4)",
    padding: 8,
    borderRadius: 10,
  },
  detailTitle: {
    fontSize: 22,
    fontWeight: "700",
    paddingHorizontal: 16,
    marginTop: 16,
  },

  /* INGREDIENT SECTION */
  sectionBox: {
    marginTop: 20,
    paddingHorizontal: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "700",
    marginBottom: 12,
  },
  ingItem: {
    flexDirection: "row",
    padding: 12,
    borderRadius: 12,
    backgroundColor: "#F1F3F5",
    alignItems: "center",
    marginBottom: 8,
  },
  ingChecked: {
    backgroundColor: "#E3F6E8",
  },
  checkbox: {
    width: 22,
    height: 22,
    borderRadius: 6,
    borderWidth: 1.2,
    borderColor: "#A8A8A8",
    alignItems: "center",
    justifyContent: "center",
    marginRight: 10,
  },
  checkboxChecked: {
    backgroundColor: GREEN,
    borderColor: GREEN,
  },
  ingText: {
    fontSize: 14,
    flex: 1,
  },

  saveBtn: {
    marginTop: 14,
    backgroundColor: GREEN,
    paddingVertical: 10,
    borderRadius: 12,
    flexDirection: "row",
    justifyContent: "center",
    gap: 6,
  },
  saveBtnText: {
    color: "#fff",
    fontWeight: "600",
  },

  /* STEPS */
  stepRow: {
    flexDirection: "row",
    marginBottom: 12,
  },
  stepIndex: {
    width: 26,
    height: 26,
    borderRadius: 13,
    backgroundColor: "#e8efe8",
    alignItems: "center",
    justifyContent: "center",
    marginRight: 12,
  },
  stepText: {
    flex: 1,
    fontSize: 14,
    lineHeight: 20,
  },
});
