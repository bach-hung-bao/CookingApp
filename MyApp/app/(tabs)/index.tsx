import React, { useState } from "react";
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator,
  Dimensions,
} from "react-native";

import Ionicons from "@expo/vector-icons/Ionicons";
import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";
import * as ImagePicker from "expo-image-picker";

import HomeScreen from "../_screens/HomeScreen";
import MenuScreen from "../_screens/MenuScreen";
import FoodScreen from "../_screens/FoodScreen";
import IngredientScreen from "../_screens/IngredientScreen";
import AccountScreen from "../_screens/AccountScreen";
import DetectResultScreen from "../_screens/DetectResultScreen";

import { smartRecommend } from "../../api";

const GREEN = "#0E6C38";
const GREEN2 = "#5cae81ff";
const { width } = Dimensions.get("window");

type Recipe = {
  id: string;
  title: string;
  time?: string;
  image?: any;
};

export default function TabsRoot() {
  const insets = useSafeAreaInsets();

  const [activeTab, setActiveTab] = useState("home");
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [detectData, setDetectData] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [savedRecipes, setSavedRecipes] = useState<Recipe[]>([]);

  const toggleSaveRecipe = (recipe: Recipe) => {
    setSavedRecipes((prev) => {
      const exists = prev.some((x) => x.id === recipe.id);
      if (exists) return prev.filter((x) => x.id !== recipe.id);
      return [...prev, recipe];
    });
  };

  const handlePressAccount = () => {
    setActiveTab(isLoggedIn ? "account" : "login");
  };

  const handlePickImage = async () => {
    try {
      const permission = await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (!permission.granted) {
        alert("Bạn cần cấp quyền truy cập ảnh!");
        return;
      }

      const img = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsMultipleSelection: true,
        selectionLimit: 10,
        quality: 1,
      });

      if (img.canceled) return;

      setIsLoading(true);
      const uris = img.assets.map((a) => a.uri);
      const apiData = await smartRecommend(uris);

      setDetectData(apiData);
      setIsLoading(false);
      setActiveTab("detect_result");

    } catch (error) {
      setIsLoading(false);
    }
  };

  return (
    <View style={{ flex: 1, backgroundColor: "#fff" }}>
      <View style={styles.container}>
        
        <View style={[styles.topBar, { paddingTop: insets.top, height: 50 + insets.top }]}>
          <Text style={styles.brandTitle}>Cooking</Text>
        </View>

        <View style={styles.contentContainer}>
          {activeTab === "home" && (
            <HomeScreen
              onChooseIngredient={() => setActiveTab("ingredient")}
              onToggleSave={toggleSaveRecipe}
              savedIds={savedRecipes.map((x) => x.id)}
              isLoggedIn={isLoggedIn}
            />
          )}

          {activeTab === "menu" && (
            <MenuScreen
              onToggleSave={toggleSaveRecipe}
              savedIds={savedRecipes.map((x) => x.id)}
              isLoggedIn={isLoggedIn}
            />
          )}

          {activeTab === "food" && (
            <FoodScreen
              onToggleSave={toggleSaveRecipe}
              savedIds={savedRecipes.map((x) => x.id)}
              isLoggedIn={isLoggedIn}
            />
          )}

          {activeTab === "ingredient" && (
            <IngredientScreen setDetectData={setDetectData} setActiveTab={setActiveTab} />
          )}

          {activeTab === "login" && (
            <AccountScreen
              mode="login"
              onLoginSuccess={() => { setIsLoggedIn(true); setActiveTab("home"); }}
              onForgot={() => setActiveTab("forgot")}
              onRegister={() => setActiveTab("register")}
            />
          )}
          {activeTab === "forgot" && (
            <AccountScreen mode="forgot" onBackToLogin={() => setActiveTab("login")} />
          )}
          {activeTab === "register" && (
            <AccountScreen mode="register" onBackToLogin={() => setActiveTab("login")} />
          )}
          {activeTab === "account" && isLoggedIn && (
            <AccountScreen
              mode="account"
              onLogout={() => { setIsLoggedIn(false); setActiveTab("home"); }}
              savedRecipes={savedRecipes}
            />
          )}

          {activeTab === "detect_result" && detectData && (
            <DetectResultScreen 
              route={{ params: detectData }} 
              navigation={undefined}
              onBack={() => setActiveTab("home")}
            />
          )}
        </View>

        <View style={[
          styles.bottomNavWrapper, 
          { 
            height: 60 + insets.bottom,
            paddingBottom: insets.bottom
          }
        ]}>
          
          <TouchableOpacity style={styles.navItem} onPress={() => setActiveTab("home")}>
            <Ionicons name={activeTab === "home" ? "compass" : "compass-outline"} size={24} color={activeTab === "home" ? GREEN : "#888"} />
            <Text style={[styles.navText, activeTab === "home" && { color: GREEN }]}>Khám phá</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.navItem} onPress={() => setActiveTab("menu")}>
            <Ionicons name={activeTab === "menu" ? "book" : "book-outline"} size={24} color={activeTab === "menu" ? GREEN : "#888"} />
            <Text style={[styles.navText, activeTab === "menu" && { color: GREEN }]}>Thực đơn</Text>
          </TouchableOpacity>
          
          <TouchableOpacity style={styles.navItem} onPress={handlePickImage} activeOpacity={0.8}>
             <View style={styles.centerIconCircle}>
                <MaterialCommunityIcons name="line-scan" size={22} color="#fff" />
             </View>
             <Text style={styles.navText}>Truy cập nhanh</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.navItem} onPress={() => setActiveTab("food")}>
            <Ionicons name={activeTab === "food" ? "restaurant" : "restaurant-outline"} size={24} color={activeTab === "food" ? GREEN : "#888"} />
            <Text style={[styles.navText, activeTab === "food" && { color: GREEN }]}>Món ăn</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.navItem} onPress={handlePressAccount}>
            <Ionicons name={isLoggedIn ? "person" : "person-outline"} size={24} color={(activeTab === "account" || activeTab === "login") ? GREEN : "#888"} />
            <Text style={[styles.navText, (activeTab === "account" || activeTab === "login") && { color: GREEN }]}>Tài khoản</Text>
          </TouchableOpacity>
        </View>

        {isLoading && (
          <View style={styles.loadingOverlay}>
            <View style={styles.loadingBox}>
              <ActivityIndicator size="large" color={GREEN} />
              <Text style={styles.loadingText}>Đang xử lý...</Text>
            </View>
          </View>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  topBar: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 16,
    backgroundColor: "#fff",
    borderBottomWidth: 1,
    borderBottomColor: "#F0F0F0",
  },
  brandTitle: {
    fontSize: 22,
    fontWeight: "700",
    color: GREEN,
  },
  contentContainer: {
    flex: 1,
  },
  bottomNavWrapper: {
    position: "absolute",
    bottom: 0, left: 0, right: 0,
    backgroundColor: "#fff",
    flexDirection: "row",
    justifyContent: "space-between", 
    alignItems: "center", 
    paddingHorizontal: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.08,
    shadowRadius: 4,
    elevation: 10,
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
  },
  navItem: {
    flex: 1, 
    alignItems: "center",
    justifyContent: "center",
    height: "100%",
  },
  navText: {
    fontSize: 10,
    marginTop: 4,
    color: "#888",
    fontWeight: "600",
  },
  centerIconCircle: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: GREEN2,
    alignItems: "center",
    justifyContent: "center",
    shadowColor: GREEN,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 4,
  },
  loadingOverlay: {
    position: "absolute", top: 0, left: 0, right: 0, bottom: 0,
    backgroundColor: "rgba(0,0,0,0.3)",
    justifyContent: "center", alignItems: "center", zIndex: 999,
  },
  loadingBox: {
    width: 150, backgroundColor: "#fff",
    paddingVertical: 20, borderRadius: 16, alignItems: "center",
  },
  loadingText: {
    marginTop: 10, fontSize: 14, fontWeight: "600", color: "#333",
  },
});