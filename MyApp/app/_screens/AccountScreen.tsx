import React from "react";
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  ScrollView,
} from "react-native";
import Ionicons from "@expo/vector-icons/Ionicons";

const GREEN = "#0E6C38";
const BG = "#F5F7FA";

type SavedItem = {
  id: string;
  title: string;
  time?: string;
};

type Props =
  | {
      mode: "login";
      onLoginSuccess: () => void;
      onForgot: () => void;
      onRegister: () => void;
    }
  | {
      mode: "forgot";
      onBackToLogin: () => void;
    }
  | {
      mode: "register";
      onBackToLogin: () => void;
    }
  | {
      mode: "account";
      onLogout: () => void;
      savedRecipes: SavedItem[];
    };

export default function AccountScreen(props: Props) {
  /* LOGIN SCREEN */
  if (props.mode === "login") {
    return (
      <View style={styles.screen}>
        <View style={styles.box}>
          <Text style={styles.bigTitle}>Cooking</Text>
          <Text style={styles.subTitle}>Đăng nhập / Tạo tài khoản</Text>

          <TextInput
            style={styles.input}
            placeholder="Email hoặc Số điện thoại"
            placeholderTextColor="#777"
          />
          <TextInput
            style={styles.input}
            placeholder="Mật khẩu"
            secureTextEntry
            placeholderTextColor="#777"
          />

          <TouchableOpacity
            style={styles.primaryBtn}
            onPress={props.onLoginSuccess}
          >
            <Text style={styles.primaryText}>Đăng nhập</Text>
          </TouchableOpacity>

          <TouchableOpacity onPress={props.onForgot}>
            <Text style={styles.link}>Quên mật khẩu?</Text>
          </TouchableOpacity>

          <TouchableOpacity onPress={props.onRegister}>
            <Text style={styles.link}>
              Chưa có tài khoản?{" "}
              <Text style={{ fontWeight: "700" }}>Đăng ký</Text>
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  /* FORGOT SCREEN */
  if (props.mode === "forgot") {
    return (
      <View style={styles.screen}>
        <View style={styles.box}>
          <Text style={styles.bigTitle}>Quên mật khẩu</Text>

          <TextInput
            style={styles.input}
            placeholder="Email hoặc Số điện thoại"
            placeholderTextColor="#777"
          />
          <TextInput
            style={styles.input}
            placeholder="Mật khẩu mới"
            secureTextEntry
            placeholderTextColor="#777"
          />
          <TextInput
            style={styles.input}
            placeholder="Nhập lại mật khẩu"
            secureTextEntry
            placeholderTextColor="#777"
          />

          <TouchableOpacity
            style={styles.primaryBtn}
            onPress={props.onBackToLogin}
          >
            <Text style={styles.primaryText}>Xác nhận</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  /* REGISTER SCREEN */
  if (props.mode === "register") {
    return (
      <View style={styles.screen}>
        <View style={styles.box}>
          <Text style={styles.bigTitle}>Tạo tài khoản</Text>

          <TextInput style={styles.input} placeholder="Họ và tên" />
          <TextInput
            style={styles.input}
            placeholder="Số điện thoại"
            keyboardType="phone-pad"
          />
          <TextInput
            style={styles.input}
            placeholder="Email"
            keyboardType="email-address"
          />
          <TextInput style={styles.input} placeholder="Mật khẩu" secureTextEntry />
          <TextInput
            style={styles.input}
            placeholder="Nhập lại mật khẩu"
            secureTextEntry
          />

          <TouchableOpacity
            style={styles.primaryBtn}
            onPress={props.onBackToLogin}
          >
            <Text style={styles.primaryText}>Đăng ký</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  /* ACCOUNT MAIN SCREEN */
  const [innerMode, setInnerMode] = React.useState<
    "main" | "saved" | "info"
  >("main");

  if (innerMode === "main") {
    return (
      <View style={styles.screen}>
        <View style={styles.box}>
          <Text style={styles.bigTitle}>Tài khoản</Text>

          <View style={styles.userCard}>
            <View style={styles.avatar} />
            <View>
              <Text style={styles.userName}>Nguyễn Văn A</Text>
              <Text style={styles.userEmail}>nguyenvana@example.com</Text>
            </View>
          </View>

          <View style={styles.divider} />

          <TouchableOpacity
            style={styles.item}
            onPress={() => setInnerMode("info")}
          >
            <Text style={styles.itemText}>Thông tin cá nhân</Text>
            <Ionicons name="chevron-forward" size={18} />
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.item}
            onPress={() => setInnerMode("saved")}
          >
            <Text style={styles.itemText}>Món đã lưu</Text>
            <Ionicons name="chevron-forward" size={18} />
          </TouchableOpacity>

          <TouchableOpacity style={styles.logoutBtn} onPress={props.onLogout}>
            <Text style={styles.logoutText}>Đăng xuất</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  /* SAVED RECIPES */
  if (innerMode === "saved") {
    const list = props.savedRecipes;

    return (
      <View style={styles.screen}>
        <View style={styles.box}>
          <View style={styles.backRow}>
            <TouchableOpacity onPress={() => setInnerMode("main")}>
              <Ionicons name="chevron-back" size={22} />
            </TouchableOpacity>
            <Text style={styles.smallTitle}>Món đã lưu</Text>
          </View>

          <ScrollView showsVerticalScrollIndicator={false}>
            {list.length === 0 ? (
              <Text style={styles.noText}>Chưa có món nào được lưu.</Text>
            ) : (
              list.map((item) => (
                <View key={item.id} style={styles.savedCard}>
                  <View style={styles.savedImg} />
                  <View style={{ flex: 1 }}>
                    <Text style={styles.savedTitle}>{item.title}</Text>
                    <Text style={styles.savedTime}>{item.time ?? "45 phút"}</Text>
                  </View>
                  <Ionicons name="bookmark" size={22} color={GREEN} />
                </View>
              ))
            )}
          </ScrollView>
        </View>
      </View>
    );
  }

  /* PERSONAL INFO */
  return (
    <View style={styles.screen}>
      <View style={styles.box}>
        <View style={styles.backRow}>
          <TouchableOpacity onPress={() => setInnerMode("main")}>
            <Ionicons name="chevron-back" size={22} />
          </TouchableOpacity>
          <Text style={styles.smallTitle}>Thông tin cá nhân</Text>
        </View>

        <View style={styles.centerBox}>
          <View style={styles.bigAvatar} />
          <Text style={styles.infoName}>Nguyễn Văn A</Text>
        </View>

        <View style={styles.divider} />

        {/* SECTION */}
        <View style={styles.infoRow}>
          <Text style={styles.infoLabel}>Email</Text>
          <Text style={styles.infoValue}>nguyenvana@example.com</Text>
        </View>

        <View style={styles.infoRow}>
          <Text style={styles.infoLabel}>Số điện thoại</Text>
          <Text style={styles.infoValue}>**********</Text>
        </View>

        <View style={styles.infoRow}>
          <Text style={styles.infoLabel}>Mật khẩu</Text>
          <Text style={styles.infoValue}>**********</Text>
        </View>

        <TouchableOpacity style={styles.primaryBtn}>
          <Text style={styles.primaryText}>Lưu thay đổi</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

/* STYLES */
const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: BG,
    paddingVertical: 20,
  },

  box: {
    backgroundColor: "#fff",
    marginHorizontal: 16,
    borderRadius: 20,
    padding: 20,
    elevation: 3,
  },

  bigTitle: {
    fontSize: 24,
    fontWeight: "700",
    textAlign: "center",
  },

  subTitle: {
    textAlign: "center",
    marginBottom: 20,
    marginTop: 4,
    color: "#666",
  },

  input: {
    height: 44,
    borderWidth: 1,
    borderColor: "#E2E4E8",
    borderRadius: 12,
    paddingHorizontal: 14,
    marginBottom: 14,
    backgroundColor: "#F9FAFB",
  },

  primaryBtn: {
    backgroundColor: GREEN,
    paddingVertical: 12,
    borderRadius: 14,
    marginTop: 8,
    alignItems: "center",
  },
  primaryText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },

  link: {
    marginTop: 14,
    textAlign: "center",
    color: "#555",
  },

  /* MAIN ACCOUNT */
  userCard: {
    flexDirection: "row",
    alignItems: "center",
    gap: 14,
    marginTop: 10,
  },
  avatar: {
    width: 48,
    height: 48,
    borderRadius: 999,
    backgroundColor: "#D9D9D9",
  },
  userName: {
    fontSize: 16,
    fontWeight: "600",
  },
  userEmail: {
    fontSize: 12,
    color: "#666",
  },

  divider: {
    height: 1,
    backgroundColor: "#E2E4E8",
    marginVertical: 16,
  },

  item: {
    paddingVertical: 14,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  itemText: {
    fontSize: 15,
    fontWeight: "500",
  },

  logoutBtn: {
    marginTop: 20,
    backgroundColor: "#F04444",
    paddingVertical: 12,
    borderRadius: 14,
    alignItems: "center",
  },
  logoutText: {
    color: "#fff",
    fontWeight: "600",
  },

  /* SAVED */
  backRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    marginBottom: 20,
  },
  smallTitle: {
    fontSize: 18,
    fontWeight: "600",
  },
  savedCard: {
    flexDirection: "row",
    alignItems: "center",
    padding: 14,
    backgroundColor: "#fff",
    borderRadius: 16,
    marginBottom: 12,
    elevation: 2,
    gap: 12,
  },
  savedImg: {
    width: 64,
    height: 64,
    backgroundColor: "#D6E5D6",
    borderRadius: 14,
  },
  savedTitle: {
    fontSize: 14,
    fontWeight: "600",
  },
  savedTime: {
    fontSize: 12,
    color: "#777",
  },
  noText: {
    color: "#777",
    fontSize: 14,
  },

  /* INFO */
  centerBox: {
    alignItems: "center",
    marginTop: 10,
  },
  bigAvatar: {
    width: 70,
    height: 70,
    borderRadius: 999,
    backgroundColor: "#D9D9D9",
  },
  infoName: {
    fontSize: 16,
    fontWeight: "600",
    marginTop: 8,
  },

  infoRow: {
    marginBottom: 14,
  },
  infoLabel: {
    fontSize: 13,
    color: "#666",
  },
  infoValue: {
    fontSize: 15,
    fontWeight: "600",
    marginTop: 4,
  },
});
