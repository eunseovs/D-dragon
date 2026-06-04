import { SafeAreaView } from "react-native-safe-area-context";
import { StyleSheet, Text, View } from "react-native";

export default function DiaryScreenWebFallback() {
  return (
    <SafeAreaView style={styles.safe} edges={["top", "left", "right"]}>
      <View style={styles.container}>
        <Text style={styles.title}>Diary</Text>
        <Text style={styles.body}>
          웹에서는 지도 기반 일기 작성 화면을 간단히 숨겼어요. 모바일 Expo Go나 빌드에서 전체 기능을 사용할 수 있습니다.
        </Text>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: "#FFFFFF" },
  container: { flex: 1, justifyContent: "center", alignItems: "center", padding: 24 },
  title: { fontSize: 24, fontWeight: "800", color: "#22342A", marginBottom: 10 },
  body: { fontSize: 14, lineHeight: 22, color: "#66756C", textAlign: "center" },
});
