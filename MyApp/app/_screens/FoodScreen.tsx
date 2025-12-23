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

type Props = {
  isLoggedIn: boolean;
  savedIds: string[];
  onToggleSave: (recipe: { id: string; title: string; time?: string }) => void;
};

export default function FoodScreen({
  isLoggedIn,
  savedIds,
  onToggleSave,
}: Props) {
  /* STATE SCREEN */
  const [mode, setMode] = React.useState<
    "category" | "recipeList" | "recipeDetail"
  >("category");
  const [currentCategory, setCurrentCategory] = React.useState<any>(null);
  const [currentRecipe, setCurrentRecipe] = React.useState<any>(null);
  const [checkedIngredients, setCheckedIngredients] = React.useState<string[]>(
    []
  );

  /* SAMPLE DATA */
  const FOOD_CATEGORIES = [
    {
      id: "bun-ca",
      title: "Bún cá",
      count: 5,
      image: require("../images/Anh_bigImage.jpeg"),
      recipes: [
        {
          id: "bun-ca-hai-phong",
          title: "Bún cá Hải Phòng",
          time: "35 phút",
          image: require("../images/chao_suon_sun.jpg"),
        },
        {
          id: "bun-ca-ha-noi",
          title: "Bún cá Hà Nội",
          time: "30 phút",
          image: require("../images/jollibee.jpg"),
        },
        {
          id: "bun-ca-rieu",
          title: "Bún cá riêu",
          time: "40 phút",
          image: require("../images/xoi_lac.png"),
        },
      ],
    },
    {
      id: "ca-kho",
      title: "Cá kho",
      count: 4,
      image: require("../images/chao_suon_sun.jpg"),
      recipes: [
        {
          id: "ca-kho-rieng",
          title: "Cá kho riềng",
          time: "50 phút",
          image: require("../images/Anh_bigImage.jpeg"),
        },
        {
          id: "ca-kho-to",
          title: "Cá kho tộ",
          time: "45 phút",
          image: require("../images/xoi_lac.png"),
        },
        {
          id: "ca-kho-tieu",
          title: "Cá kho tiêu",
          time: "40 phút",
          image: require("../images/jollibee.jpg"),
        },
      ],
    },
  ];

  const DEF_ING = [
    "500g nguyên liệu chính",
    "Hành tím, tỏi băm",
    "Gia vị cơ bản: muối, đường, nước mắm",
    "Hành lá, rau thơm",
  ];

  const DEF_STEPS = [
    "Sơ chế sạch nguyên liệu.",
    "Ướp gia vị 15 phút.",
    "Nấu theo bước phù hợp.",
    "Dọn ra đĩa và thưởng thức.",
  ];

  const toggleIngredient = (ing: string) => {
    setCheckedIngredients((prev) =>
      prev.includes(ing) ? prev.filter((x) => x !== ing) : [...prev, ing]
    );
  };

    /* MODE 3 → DETAIL RECIPE */
  if (mode === "recipeDetail" && currentRecipe) {
    const isSaved = savedIds.includes(currentRecipe.id);

    return (
      <View style={styles.screenWhite}>
        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ paddingBottom: 90 }}
        >
          {/* HEADER IMAGE + OVERLAY */}
          <View style={styles.detailImgWrap}>
            <Image source={currentRecipe.image} style={styles.detailImg} />
            <View style={styles.overlay} />

            <TouchableOpacity
              style={styles.backTopBtn}
              onPress={() => {
                setMode("recipeList");
                setCheckedIngredients([]);
              }}
            >
              <Ionicons name="chevron-back" size={24} color="#fff" />
            </TouchableOpacity>
          </View>

          {/* TITLE */}
          <Text style={styles.detailTitle}>{currentRecipe.title}</Text>

          {/* INGREDIENTS */}
          <View style={styles.sectionBox}>
            <Text style={styles.sectionTitle}>
              Nguyên liệu ({DEF_ING.length})
            </Text>

            {DEF_ING.map((ing) => {
              const checked = checkedIngredients.includes(ing);
              return (
                <TouchableOpacity
                  key={ing}
                  style={[styles.ingItem, checked && styles.ingChecked]}
                  onPress={() => toggleIngredient(ing)}
                >
                  <View
                    style={[
                      styles.checkbox,
                      checked && styles.checkboxActive,
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

            {/* SAVE BUTTON */}
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
                <Ionicons name="bookmark" color="#fff" size={18} />
                <Text style={styles.saveBtnText}>
                  {isSaved ? "Đã lưu" : "Lưu món"}
                </Text>
              </TouchableOpacity>
            )}
          </View>

          {/* STEPS */}
          <View style={styles.sectionBox}>
            <Text style={styles.sectionTitle}>Cách làm</Text>

            {DEF_STEPS.map((step, idx) => (
              <View key={idx} style={styles.stepRow}>
                <View style={styles.stepIndex}>
                  <Text style={{ fontWeight: "700" }}>{idx + 1}</Text>
                </View>
                <Text style={styles.stepText}>{step}</Text>
              </View>
            ))}
          </View>
        </ScrollView>

        {/* Floating Back */}
        <TouchableOpacity
          style={styles.fab}
          onPress={() => {
            setMode("recipeList");
            setCheckedIngredients([]);
          }}
        >
          <Ionicons name="chevron-up" size={22} color="#fff" />
        </TouchableOpacity>
      </View>
    );
  }

    /* MODE 2 → LIST RECIPES */
  if (mode === "recipeList" && currentCategory) {
    return (
      <View style={styles.screenGrey}>
        {/* HEADER */}
        <View style={styles.headerRow}>
          <TouchableOpacity onPress={() => setMode("category")}>
            <Ionicons name="chevron-back" size={22} color="#000" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>{currentCategory.title}</Text>
          <View style={{ width: 28 }} />
        </View>

        <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 70 }}>
          {currentCategory.recipes.map((recipe) => {
            const isSaved = savedIds.includes(recipe.id);

            return (
              <TouchableOpacity
                key={recipe.id}
                style={styles.recipeCard}
                onPress={() => {
                  setCurrentRecipe(recipe);
                  setMode("recipeDetail");
                }}
                activeOpacity={0.7}
              >
                <Image source={recipe.image} style={styles.recipeImg} />

                <View style={{ flex: 1, marginLeft: 12 }}>
                  <Text style={styles.recipeName}>{recipe.title}</Text>

                  {recipe.time ? (
                    <View style={styles.timeRow}>
                      <Ionicons name="time-outline" size={14} color="#777" />
                      <Text style={styles.timeText}>{recipe.time}</Text>
                    </View>
                  ) : null}
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
                      color={isSaved ? GREEN : "#bbb"}
                    />
                  </TouchableOpacity>
                )}
              </TouchableOpacity>
            );
          })}
        </ScrollView>

        <TouchableOpacity style={styles.fab} onPress={() => setMode("category")}>
          <Ionicons name="chevron-up" size={22} color="#fff" />
        </TouchableOpacity>
      </View>
    );
  }

    /* MODE 1 → CATEGORY LIST */
  return (
    <View style={styles.screenGrey}>
      <View style={styles.headerRow}>
        <Text style={styles.headerTitle}>Món ăn</Text>
        <View style={{ width: 28 }} />
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 50 }}
      >
        {FOOD_CATEGORIES.map((cat) => (
          <TouchableOpacity
            key={cat.id}
            style={styles.categoryCard}
            onPress={() => {
              setCurrentCategory(cat);
              setMode("recipeList");
            }}
          >
            <View style={styles.categoryImgWrap}>
              <Image source={cat.image} style={styles.categoryImg} />
              <View style={styles.overlay} />

              <Text style={styles.categoryTitle}>{cat.title}</Text>
              <Text style={styles.categoryCount}>{cat.count} món</Text>
            </View>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </View>
  );
}

/* STYLES */
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
    backgroundColor: "#fff",
    elevation: 3,
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
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(0,0,0,0.28)",
  },
  categoryTitle: {
    fontSize: 20,
    fontWeight: "700",
    color: "#fff",
    paddingHorizontal: 14,
  },
  categoryCount: {
    fontSize: 13,
    color: "#eee",
    paddingHorizontal: 14,
    marginBottom: 12,
  },

  /* LIST RECIPE CARD */
  recipeCard: {
    flexDirection: "row",
    backgroundColor: "#fff",
    marginHorizontal: 16,
    marginTop: 14,
    borderRadius: 16,
    padding: 12,
    elevation: 2,
    alignItems: "center",
  },
  recipeImg: {
    width: 90,
    height: 90,
    borderRadius: 14,
  },
  recipeName: {
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
    color: "#777",
  },

  /* DETAIL IMAGE */
  detailImgWrap: {
    width: width,
    height: 260,
    overflow: "hidden",
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30,
  },
  detailImg: {
    width: "100%",
    height: "100%",
  },
  backTopBtn: {
    position: "absolute",
    top: 40,
    left: 16,
    padding: 8,
    borderRadius: 12,
    backgroundColor: "rgba(0,0,0,0.4)",
  },

  detailTitle: {
    fontSize: 22,
    fontWeight: "700",
    paddingHorizontal: 16,
    marginTop: 16,
  },

  /* INGREDIENTS */
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
    marginBottom: 10,
    alignItems: "center",
  },
  ingChecked: {
    backgroundColor: "#E3F6E8",
  },
  checkbox: {
    width: 22,
    height: 22,
    borderRadius: 6,
    borderWidth: 1.3,
    borderColor: "#A8A8A8",
    alignItems: "center",
    justifyContent: "center",
    marginRight: 12,
  },
  checkboxActive: {
    backgroundColor: GREEN,
    borderColor: GREEN,
  },

  ingText: {
    fontSize: 14,
    flex: 1,
  },

  saveBtn: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: GREEN,
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 12,
    alignSelf: "flex-start",
    marginTop: 14,
  },
  saveBtnText: {
    color: "#fff",
    fontWeight: "600",
    marginLeft: 8,
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
    backgroundColor: "#E9EFE9",
    alignItems: "center",
    justifyContent: "center",
    marginRight: 12,
  },
  stepText: {
    flex: 1,
    fontSize: 14,
    lineHeight: 20,
  },

  /* FAB BUTTON */
  fab: {
    position: "absolute",
    right: 20,
    bottom: 20,
    width: 50,
    height: 50,
    borderRadius: 18,
    backgroundColor: GREEN,
    justifyContent: "center",
    alignItems: "center",
    elevation: 5,
  },
});
