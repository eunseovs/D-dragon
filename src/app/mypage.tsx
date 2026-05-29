import AsyncStorage from "@react-native-async-storage/async-storage";
import { useRouter } from "expo-router";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";

export default function MyPageScreen() {
  const router = useRouter();

  const handleLogout = async () => {
    await AsyncStorage.removeItem("auth_user");
    router.replace("/signup");
  };

  return (
    <View style={styles.container}>
      <Text style={styles.text}>마이페이지</Text>
      <TouchableOpacity style={styles.button} onPress={handleLogout}>
        <Text style={styles.buttonText}>로그아웃 (테스트용)</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: "center", alignItems: "center", backgroundColor: "#fff" },
  text: { fontSize: 18, color: "#555" },
  button: { marginTop: 24, backgroundColor: "#eee", borderRadius: 8, paddingVertical: 12, paddingHorizontal: 24 },
  buttonText: { fontSize: 14, color: "#888" },
});
