import { useRouter } from "expo-router";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";

export default function SubScreen() {
  const router = useRouter();
  return (
    <View style={styles.container}>
      <Text style={styles.title}>준비 중인 화면입니다! 🐲</Text>
      <TouchableOpacity
        style={styles.backButton}
        onPress={() => router.replace("/character")} // 무조건 캐릭터 방으로!
      >
        <Text style={styles.backText}>🏠 방으로 돌아가기</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#f0f0f0",
  },
  title: { fontSize: 20, fontWeight: "bold", marginBottom: 20 },
  backButton: { backgroundColor: "#4D96FF", padding: 15, borderRadius: 10 },
  backText: { color: "white", fontWeight: "bold" },
});
