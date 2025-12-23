import React from "react";
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from "react-native";

const GREEN = "#0E6C38";
const PLACEHOLDER = "#8EB19F";

type Recipe = {
  id: string;
  name: string;
  desc?: string;
  time?: string;
  ingredients?: string[];
  steps?: string[];
};

type Props = {
  recipe: Recipe;
  onBack: () => void;
};

export default function RecipeDetailScreen({ recipe, onBack }: Props) {
  const ingList = recipe.ingredients ?? [];
  const steps =
    recipe.steps ?? ["Sơ chế nguyên liệu", "Nấu theo hướng dẫn", "Trình bày và thưởng thức"];

  return (
    <View style={styles.wrapper}>
      <View style={styles.card}>
        {/* header nhỏ */}
        <View style={styles.headerRow}>
          <TouchableOpacity onPress={onBack} style={styles.backBtn}>
            <View style={styles.backArrow} />
          </TouchableOpacity>
          <Text style={styles.headerText}>Cooking</Text>
          <View style={{ width: 28 }} />
        </View>

        <ScrollView contentContainerStyle={{ paddingBottom: 30 }}>
          {/* ảnh xanh */}
          <View style={styles.bigImage} />

          {/* tiêu đề + mô tả */}
          <View style={{ paddingHorizontal: 14, paddingTop: 12 }}>
            <Text style={styles.title}>
              {recipe.name || "Cách làm cá hấp bia đơn giản ngon hơn ngoài chợ"}
            </Text>
            <Text style={styles.desc}>
              {recipe.desc ||
                "Đổi vị món ăn dịp Lễ Độc lập với món cá trắm hấp bia thơm ngon mà lại đơn giản. Một vài bí quyết giúp món ăn ngon như ngoài chợ."}
            </Text>
          </View>

          <View style={styles.line} />

          {/* nguyên liệu */}
          <View style={{ paddingHorizontal: 14 }}>
            <Text style={styles.sectionTitle}>Nguyên liệu ({ingList.length})</Text>
            {ingList.map((ing, idx) => (
              <View key={idx} style={styles.ingRow}>
                <View style={styles.ingCheck} />
                <Text style={styles.ingText}>{ing}</Text>
              </View>
            ))}

            <TouchableOpacity style={styles.saveBtn}>
              <View style={styles.saveDot} />
              <Text style={styles.saveText}>Lưu</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.line} />

          {/* cách làm */}
          <View style={{ paddingHorizontal: 14, paddingBottom: 18 }}>
            <Text style={styles.sectionTitle}>Cách làm</Text>
            {steps.map((step, idx) => (
              <View key={idx} style={styles.stepRow}>
                <View style={styles.stepCircle}>
                  <Text style={{ fontWeight: "600" }}>{idx + 1}</Text>
                </View>
                <Text style={styles.stepText}>{step}</Text>
              </View>
            ))}
          </View>
        </ScrollView>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    flex: 1,
    backgroundColor: "#BDAFAF",
  },
  card: {
    flex: 1,
    backgroundColor: "#fff",
    marginTop: 8,
    marginHorizontal: 8,
    borderRadius: 16,
    overflow: "hidden",
  },
  headerRow: {
    flexDirection: "row",
    alignItems: "center",
    height: 44,
    borderBottomWidth: 1,
    borderBottomColor: "#EAEAEA",
    paddingHorizontal: 14,
  },
  backBtn: {
    width: 28,
    height: 28,
    justifyContent: "center",
    alignItems: "center",
  },
  backArrow: {
    width: 12,
    height: 12,
    borderLeftWidth: 2,
    borderBottomWidth: 2,
    borderColor: "#000",
    transform: [{ rotate: "45deg" }],
  },
  headerText: {
    flex: 1,
    textAlign: "center",
    fontWeight: "600",
  },
  bigImage: {
    height: 120,
    backgroundColor: PLACEHOLDER,
  },
  title: {
    fontSize: 15,
    fontWeight: "700",
    marginBottom: 4,
  },
  desc: {
    fontSize: 11,
    color: "#555",
  },
  line: {
    height: 1,
    backgroundColor: "#E5E5E5",
    marginVertical: 12,
  },
  sectionTitle: {
    fontWeight: "600",
    marginBottom: 8,
  },
  ingRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    marginBottom: 6,
  },
  ingCheck: {
    width: 16,
    height: 16,
    borderWidth: 1,
    borderColor: "#B9B9B9",
    borderRadius: 4,
  },
  ingText: {
    flex: 1,
    fontSize: 12,
  },
  saveBtn: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    marginTop: 6,
  },
  saveDot: {
    width: 22,
    height: 22,
    borderRadius: 999,
    backgroundColor: GREEN,
  },
  saveText: {
    fontSize: 12,
    fontWeight: "600",
  },
  stepRow: {
    flexDirection: "row",
    gap: 8,
    marginBottom: 10,
  },
  stepCircle: {
    width: 22,
    height: 22,
    borderRadius: 999,
    borderWidth: 1,
    borderColor: "#B9B9B9",
    alignItems: "center",
    justifyContent: "center",
  },
  stepText: {
    flex: 1,
    fontSize: 12,
  },
});
