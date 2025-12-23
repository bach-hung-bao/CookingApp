import React from "react";
import {
  ScrollView,
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  Dimensions,
  Image,
  ActivityIndicator,
} from "react-native";
import Ionicons from "@expo/vector-icons/Ionicons";
import { searchRecipeByText, addHistory, getLatestHistory } from "../../api";
import { router } from "expo-router";
import { useFocusEffect } from "expo-router";

const GREEN = "#0E6C38";
const LIGHT_GREEN = "#e9f7ef";
const { width } = Dimensions.get("window");

type Props = {
  onChooseIngredient: () => void;
  onToggleSave: (recipe: { id: string; title: string; time?: string }) => void;
  savedIds: string[];
  isLoggedIn: boolean;
};

export default function HomeScreen({
  onChooseIngredient,
  onToggleSave,
  savedIds,
  isLoggedIn,
}: Props) {

  const bigRecipe = {
    id: "home-big-1",
    title: "Thực đơn gia đình",
    time: "45p",
  };
  const isBigSaved = savedIds.includes(bigRecipe.id);

  const smallCards = [
    { id: "home-small-1", title: "Bữa sáng nhanh", image: require("../images/chao_suon_sun.jpg") },
    { id: "home-small-2", title: "Ăn healthy", image: require("../images/jollibee.jpg") },
    { id: "home-small-3", title: "Cuối tuần", image: require("../images/xoi_lac.png") },
  ];

  const [searchText, setSearchText] = React.useState("");
  const [loadingSearch, setLoadingSearch] = React.useState(false);


  const [history, setHistory] = React.useState([]);
  const [loadingHistory, setLoadingHistory] = React.useState(true);

  React.useEffect(() => {
    const fetchHistory = async () => {
      try {
        const data = await getLatestHistory();
        setHistory(data);
      } catch (err) {
        // Silent catch
      }
      setLoadingHistory(false);
    };
    fetchHistory();
  }, []);

  // Tự động refresh khi quay lại màn hình
  useFocusEffect(
    React.useCallback(() => {
      const refresh = async () => {
        const data = await getLatestHistory();
        setHistory(data);
      };
      refresh();
      return () => {};
    }, [])
  );

  const handleSearch = async () => {
    if (!searchText.trim()) return;
    setLoadingSearch(true);

    try {
      // 🔥 Lưu lịch sử vào backend (thống nhất qua api.js)
      await addHistory(searchText.trim(), "search");

      // cập nhật lịch sử ngay
      const latest = await getLatestHistory();
      setHistory(latest);

      // gọi API tìm kiếm
      const results = await searchRecipeByText(searchText.trim());

      router.push({
        pathname: "/_screens/SearchResultScreen",
        params: { data: JSON.stringify(results) },
      });
    } catch (err) {
      // Silent catch
    }

    setLoadingSearch(false);
  };

  return (
    <>
      <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>

        {/* SEARCH BAR */}
        <View style={styles.searchRow}>
          <View style={styles.searchBar}>
            <Ionicons name="search-outline" size={20} color="#666" style={{ marginRight: 6 }} />

            <TextInput
              style={styles.searchInput}
              placeholder="Tìm món ăn..."
              placeholderTextColor="#777"
              value={searchText}
              onChangeText={setSearchText}
              onSubmitEditing={handleSearch}
            />

            <TouchableOpacity style={styles.iconBtn} onPress={handleSearch}>
              <Ionicons name="search" size={18} color="#fff" />
            </TouchableOpacity>
          </View>
        </View>

        {/* BANNER */}
        <View style={styles.bannerWrap}>
          <Image source={require("../images/Anh_bigImage.jpeg")} style={styles.banner} />
          <View style={styles.bannerOverlay} />

          <View style={styles.bannerFooter}>
            {isLoggedIn && (
              <TouchableOpacity onPress={() => onToggleSave(bigRecipe)}>
                <Ionicons name="bookmark" size={24} color={isBigSaved ? "#fff" : "#ddd"} />
              </TouchableOpacity>
            )}
          </View>
        </View>

        {/* LỊCH SỬ GẦN ĐÂY */}
        <View style={styles.historyCard}>
          <TouchableOpacity 
            style={styles.historyHeader}
            onPress={() => router.push("/_screens/HistoryScreen")}
          >
            <View style={styles.historyTitleRow}>
              <Ionicons name="time" size={22} color={GREEN} style={{ marginRight: 8 }} />
              <Text style={styles.historyTitle}>Lịch sử gần đây</Text>
            </View>
            <Ionicons name="chevron-forward" size={20} color="#999" />
          </TouchableOpacity>

          {loadingHistory ? (
            <ActivityIndicator size="small" color={GREEN} style={{ marginTop: 16 }} />
          ) : history.length === 0 ? (
            <View style={styles.emptyHistory}>
              <Ionicons name="document-text-outline" size={48} color="#ccc" />
              <Text style={styles.noHistory}>Chưa có lịch sử tìm kiếm</Text>
            </View>
          ) : (
            <View style={styles.historyList}>
              {history.slice(0, 3).map((item, index) => {
                // Format thời gian
                const date = new Date(item.timestamp);
                const now = new Date();
                const diffMs = now.getTime() - date.getTime();
                const diffMins = Math.floor(diffMs / 60000);
                const diffHours = Math.floor(diffMs / 3600000);
                const diffDays = Math.floor(diffMs / 86400000);
                
                let timeStr = "";
                if (diffMins < 1) timeStr = "Vừa xong";
                else if (diffMins < 60) timeStr = `${diffMins} phút trước`;
                else if (diffHours < 24) timeStr = `${diffHours} giờ trước`;
                else timeStr = `${diffDays} ngày trước`;

                return (
                  <TouchableOpacity
                    key={index}
                    style={[
                      styles.historyItem,
                      index === history.slice(0, 3).length - 1 && styles.historyItemLast
                    ]}
                    onPress={async () => {
                      const results = await searchRecipeByText(item.recipe_name);
                      router.push({
                        pathname: "/_screens/SearchResultScreen",
                        params: { data: JSON.stringify(results) },
                      });
                    }}
                  >
                    <View style={[
                      styles.historyIcon,
                      item.type === "image" ? styles.historyIconImage : styles.historyIconSearch
                    ]}>
                      <Ionicons 
                        name={item.type === "image" ? "camera" : "search"} 
                        size={20} 
                        color="#fff" 
                      />
                    </View>
                    
                    <View style={styles.historyContent}>
                      <Text style={styles.historyText} numberOfLines={1}>
                        {item.recipe_name}
                      </Text>
                      <Text style={styles.historyTime}>{timeStr}</Text>
                    </View>

                    <Ionicons name="chevron-forward" size={20} color="#bbb" />
                  </TouchableOpacity>
                );
              })}
            </View>
          )}
        </View>

        {/* GỢI Ý HÔM NAY */}
        <Text style={styles.sectionTitle}>Gợi ý hôm nay</Text>

        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.smallScrollContent}>
          {smallCards.map((item, index) => {
            const isSaved = savedIds.includes(item.id);
            return (
              <View key={item.id} style={[styles.smallCard, index === 0 && { marginLeft: 16 }]}>
                <Image source={item.image} style={styles.smallImg} />

                {isLoggedIn && (
                  <TouchableOpacity
                    style={styles.smallBookmark}
                    onPress={() => onToggleSave({ id: item.id, title: item.title })}
                  >
                    <Ionicons name="bookmark" size={20} color={isSaved ? GREEN : "#ccc"} />
                  </TouchableOpacity>
                )}

                <Text style={styles.smallTitle} numberOfLines={1}>
                  {item.title}
                </Text>
              </View>
            );
          })}
        </ScrollView>

        {/* TÌM THEO NGUYÊN LIỆU */}
        <View style={styles.greenCard}>
          <Text style={styles.greenTitle}>Tìm món ăn theo nguyên liệu</Text>
          <TouchableOpacity style={styles.greenBtn} onPress={onChooseIngredient}>
            <Text style={styles.greenBtnText}>Chọn nguyên liệu</Text>
          </TouchableOpacity>
        </View>

      </ScrollView>

      {/* LOADING */}
      {loadingSearch && (
        <View style={styles.loadingOverlay}>
          <View style={styles.loadingBox}>
            <ActivityIndicator size="large" color={GREEN} />
            <Text style={styles.loadingText}>Đang tìm món ăn...</Text>
          </View>
        </View>
      )}
    </>
  );
}


/* STYLES */
const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#fafafa" },

  /* SEARCH */
  searchRow: { paddingHorizontal: 16, marginTop: 14 },
  searchBar: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#fff",
    borderRadius: 20,
    paddingHorizontal: 12,
    height: 46,
    borderWidth: 1,
    borderColor: "#ddd",
    shadowColor: "#000",
    shadowOpacity: 0.08,
    shadowRadius: 6,
    elevation: 2,
  },
  searchInput: { flex: 1, fontSize: 16 },
  iconBtn: {
    backgroundColor: "#7cc49cff",
    padding: 8,
    borderRadius: 20,
    marginLeft: 6,
  },

  /* BANNER */
  bannerWrap: {
    width: width - 32,
    height: 300,
    alignSelf: "center",
    marginTop: 18,
    borderRadius: 16,
    overflow: "hidden",
  },
  banner: { width: "100%", height: "100%", borderRadius: 16 },
  bannerOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(0,0,0,0.25)",
  },
  bannerFooter: {
    position: "absolute",
    bottom: 12,
    left: 16,
    right: 16,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },

  /* HISTORY */
  historyCard: {
    backgroundColor: "#fff",
    marginHorizontal: 16,
    padding: 18,
    borderRadius: 16,
    marginTop: 20,
    shadowColor: "#000",
    shadowOpacity: 0.08,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 2 },
    elevation: 3,
  },
  historyHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 12,
  },
  historyTitleRow: {
    flexDirection: "row",
    alignItems: "center",
  },
  historyTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: "#222",
  },
  historyList: {
    marginTop: 4,
  },
  historyItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 12,
    paddingHorizontal: 4,
    borderBottomWidth: 1,
    borderColor: "#f5f5f5",
  },
  historyItemLast: {
    borderBottomWidth: 0,
  },
  historyIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: "center",
    justifyContent: "center",
    marginRight: 12,
  },
  historyIconSearch: {
    backgroundColor: "#4CAF50",
  },
  historyIconImage: {
    backgroundColor: "#FF9800",
  },
  historyContent: {
    flex: 1,
    justifyContent: "center",
  },
  historyText: {
    fontSize: 15,
    fontWeight: "600",
    color: "#333",
    marginBottom: 2,
  },
  historyTime: {
    fontSize: 12,
    color: "#999",
  },
  emptyHistory: {
    alignItems: "center",
    paddingVertical: 32,
  },
  noHistory: {
    marginTop: 12,
    fontSize: 14,
    color: "#999",
    fontWeight: "500",
  },

  /* SMALL CARDS */
  sectionTitle: {
    fontSize: 18,
    fontWeight: "700",
    marginLeft: 16,
    marginTop: 22,
  },
  smallScrollContent: { paddingRight: 16, marginTop: 10 },
  smallCard: {
    width: 150,
    marginRight: 14,
  },
  smallImg: {
    width: 150,
    height: 115,
    borderRadius: 14,
  },
  smallBookmark: {
    position: "absolute",
    top: 6,
    right: 6,
    backgroundColor: "#fff",
    padding: 4,
    borderRadius: 20,
    elevation: 3,
  },
  smallTitle: {
    marginTop: 6,
    fontSize: 15,
    fontWeight: "600",
  },

  /* NGUYÊN LIỆU */
  greenCard: {
    backgroundColor: LIGHT_GREEN,
    marginHorizontal: 16,
    padding: 20,
    borderRadius: 16,
    marginTop: 22,
  },
  greenTitle: { fontSize: 17, fontWeight: "700" },
  greenBtn: {
    backgroundColor: GREEN,
    paddingVertical: 12,
    borderRadius: 12,
    marginTop: 12,
  },
  greenBtnText: { color: "#fff", textAlign: "center", fontWeight: "700", fontSize: 16 },

  /* LOADING */
  loadingOverlay: {
    position: "absolute",
    top: 0, left: 0, right: 0, bottom: 0,
    backgroundColor: "rgba(0,0,0,0.3)",
    justifyContent: "center",
    alignItems: "center",
  },
  loadingBox: {
    backgroundColor: "#fff",
    padding: 24,
    borderRadius: 16,
    alignItems: "center",
  },
  loadingText: { marginTop: 10, fontSize: 15, fontWeight: "600" },
});
