import { API_URL } from "./config";
import NetInfo from "@react-native-community/netinfo";

export async function searchRecipeByText(query) {
  try {
    const res = await fetch(`${API_URL}/search`, {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: `query=${encodeURIComponent(query)}`,
    });

    const json = await res.json();

    if (json.recipes && Array.isArray(json.recipes)) return json.recipes;

    if (json.raw_output) {
      try {
        return JSON.parse(json.raw_output);
      } catch (e) {
        // Silent catch
      }
    }

    if (Array.isArray(json) && json[0]?.raw_output) {
      try {
        return JSON.parse(json[0].raw_output);
      } catch (e) {
        // Silent catch
      }
    }

    return [];
  } catch (err) {
    return [];
  }
}

export async function smartRecommend(imageUris) {
  const state = await NetInfo.fetch();

  try {
    const formPredict = new FormData();

    imageUris.forEach((uri, idx) => {
      formPredict.append("files", {
        uri,
        name: `image_${idx}.jpg`,
        type: "image/jpeg",
      });
    });

    const resPredict = await fetch(`${API_URL}/predict`, {
      method: "POST",
      body: formPredict,
    });

    const jsonPredict = await resPredict.json();

    let allIngredients = jsonPredict.detected_ingredients ?? [];
    allIngredients = [...new Set(allIngredients)];

    if (state.isConnected) {
      const formLLM = new FormData();
      imageUris.forEach((uri, idx) => {
        formLLM.append("files", {
          uri,
          name: `image_${idx}.jpg`,
          type: "image/jpeg",
        });
      });

      const resLLM = await fetch(`${API_URL}/recommend_llm`, {
        method: "POST",
        body: formLLM,
      });

      const out = await resLLM.json();

      let recipes = out.recommended_recipes ?? [];

      if (recipes.length === 1 && recipes[0]?.raw_output) {
        try {
          recipes = JSON.parse(recipes[0].raw_output);
        } catch (e) {
          // Silent catch
        }
      }

      // Lưu lịch sử từ ảnh: ưu tiên tên món đầu tiên nếu có
      try {
        const firstName = Array.isArray(recipes) && recipes[0]?.name ? recipes[0].name : (allIngredients.slice(0,3).join(", ") || "Ảnh nguyên liệu");
        await addHistory(firstName, "image");
      } catch (e) {
        // Silent catch
      }

      return {
        detected_ingredients: allIngredients,
        recommended_recipes: recipes,
      };
    }

    const offlineJSON = require("./assets/data/recipes.json");

    const filtered = offlineJSON.filter((item) =>
      allIngredients.some((i) => item.ingredients.includes(i))
    );

    // Offline cũng lưu lịch sử theo nhóm nguyên liệu
    try {
      const firstName = filtered[0]?.name ?? (allIngredients.slice(0,3).join(", ") || "Ảnh nguyên liệu");
      await addHistory(firstName, "image");
    } catch (e) {
      // Silent catch
    }

    return {
      detected_ingredients: allIngredients,
      recommended_recipes: filtered,
    };
  } catch (err) {
    return {
      detected_ingredients: [],
      recommended_recipes: [],
    };
  }
}

export async function addHistory(recipe_name, type = "search") {
  try {
    const form = new FormData();
    form.append("recipe_name", recipe_name);
    form.append("hist_type", type);

    const res = await fetch(`${API_URL}/history/add`, {
      method: "POST",
      body: form,
    });

    const json = await res.json();
  } catch (err) {
    // Silent catch
  }
}

export async function getLatestHistory() {
  try {
    const res = await fetch(`${API_URL}/history/latest`);
    const json = await res.json();
    return json;
  } catch (err) {
    return [];
  }
}

export async function getAllHistory() {
  try {
    const res = await fetch(`${API_URL}/history`);
    const json = await res.json();
    return json;
  } catch (err) {
    return [];
  }
}
