import AsyncStorage from "@react-native-async-storage/async-storage";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useDiaries } from "../contexts/DiaryContext";
import { useSelectedDate } from "../contexts/SelectedDateContext";

type DiaryEntry = {
  date: string;
  emotion?: string | null;
  text?: string;
  photos?: Array<{ uri: string }>;
  timeline?: Array<{ locationName?: string | null }>;
  keywords?: string[];
};

const parseLocalDate = (value: string | Date | null | undefined) => {
  if (!value) return null;
  if (value instanceof Date) return new Date(value.getFullYear(), value.getMonth(), value.getDate());
  if (typeof value === "string") {
    const match = value.match(/^(\d{4})-(\d{2})-(\d{2})$/);
    if (match) {
      return new Date(Number(match[1]), Number(match[2]) - 1, Number(match[3]));
    }
  }
  const parsed = new Date(value);
  if (Number.isNaN(parsed.getTime())) return null;
  return new Date(parsed.getFullYear(), parsed.getMonth(), parsed.getDate());
};

const formatDisplayDate = (value: string | Date | null | undefined) => {
  const date = parseLocalDate(value);
  if (!date) return typeof value === "string" ? value : "";
  return `${date.getFullYear()}년 ${date.getMonth() + 1}월 ${date.getDate()}일`;
};

export default function MyPageScreen() {
  const router = useRouter();
  const diaryContext = useDiaries() as unknown as { diaries: DiaryEntry[] } | null;
  const selectedDateContext = useSelectedDate() as unknown as { setSelectedDate: (date: Date) => void } | null;
  const diaries = diaryContext?.diaries ?? [];
  const setSelectedDate = selectedDateContext?.setSelectedDate;

  const sortedDiaries = [...diaries].sort((a, b) => {
    const aTime = parseLocalDate(a.date)?.getTime() ?? 0;
    const bTime = parseLocalDate(b.date)?.getTime() ?? 0;
    return bTime - aTime;
  });

  const handleOpenDiary = (dateStr: string) => {
    const date = parseLocalDate(dateStr);
    if (date && setSelectedDate) {
      setSelectedDate(date);
    }
    router.push("/social");
  };

  const handleLogout = async () => {
    await AsyncStorage.removeItem("auth_user");
    router.replace("/signup");
  };

  return (
    <SafeAreaView style={styles.safe} edges={["top", "left", "right"]}>
      <ScrollView contentContainerStyle={styles.scroll}>
        <Text style={styles.title}>기록 보관함</Text>
        <Text style={styles.subtitle}>지금까지 저장한 일기를 날짜별로 다시 볼 수 있어요.</Text>

        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>저장한 일기</Text>
          <Text style={styles.sectionCount}>{sortedDiaries.length}건</Text>
        </View>

        {sortedDiaries.length > 0 ? (
          <View style={styles.list}>
            {sortedDiaries.map((diary) => (
              <TouchableOpacity
                key={diary.date}
                style={styles.card}
                activeOpacity={0.85}
                onPress={() => handleOpenDiary(diary.date)}
              >
                <View style={styles.cardTop}>
                  <View style={styles.dateRow}>
                    <Text style={styles.emoji}>{diary.emotion ?? "📝"}</Text>
                    <Text style={styles.dateText}>{formatDisplayDate(diary.date)}</Text>
                  </View>
                  <Ionicons name="chevron-forward" size={16} color="#7B8A82" />
                </View>

                <Text style={styles.previewText} numberOfLines={2}>
                  {diary.text?.trim() || "아직 적은 내용이 없어요."}
                </Text>

                <View style={styles.metaRow}>
                  <Text style={styles.metaText}>사진 {(diary.photos?.length ?? 0)}장</Text>
                  <Text style={styles.metaText}>장소 {(diary.timeline?.length ?? 0)}곳</Text>
                  {!!diary.keywords?.length && (
                    <Text style={styles.metaText}>#{diary.keywords[0]}</Text>
                  )}
                </View>
              </TouchableOpacity>
            ))}
          </View>
        ) : (
          <View style={styles.emptyCard}>
            <Text style={styles.emptyTitle}>아직 저장된 일기가 없어요</Text>
            <Text style={styles.emptyText}>일기작성 탭에서 하루를 기록하면 여기서 다시 확인할 수 있어요.</Text>
          </View>
        )}

        <TouchableOpacity style={styles.logoutBtn} onPress={handleLogout}>
          <Text style={styles.logoutText}>로그아웃</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: "#FFFFFF" },
  scroll: { paddingHorizontal: 20, paddingTop: 20, paddingBottom: 32 },
  title: { fontSize: 24, fontWeight: "800", color: "#1F2521", marginBottom: 6 },
  subtitle: { fontSize: 14, lineHeight: 21, color: "#75837C", marginBottom: 20 },
  sectionHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 12,
  },
  sectionTitle: { fontSize: 16, fontWeight: "700", color: "#222" },
  sectionCount: { fontSize: 13, fontWeight: "700", color: "#3A9E6A" },
  list: { gap: 12 },
  card: {
    backgroundColor: "#FFF",
    borderRadius: 18,
    borderWidth: 1,
    borderColor: "#EEF2F0",
    padding: 16,
  },
  cardTop: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 10,
  },
  dateRow: { flexDirection: "row", alignItems: "center", gap: 8 },
  emoji: { fontSize: 20 },
  dateText: { fontSize: 14, fontWeight: "700", color: "#22342A" },
  previewText: { fontSize: 14, lineHeight: 22, color: "#47554E", marginBottom: 10 },
  metaRow: { flexDirection: "row", flexWrap: "wrap", gap: 8 },
  metaText: {
    fontSize: 12,
    fontWeight: "600",
    color: "#6D7B74",
    backgroundColor: "#F5F8F6",
    borderRadius: 999,
    paddingHorizontal: 10,
    paddingVertical: 6,
  },
  emptyCard: {
    backgroundColor: "#FAFAFA",
    borderRadius: 18,
    borderWidth: 1,
    borderColor: "#EEEEEE",
    padding: 20,
    alignItems: "center",
  },
  emptyTitle: { fontSize: 15, fontWeight: "700", color: "#4D5C55", marginBottom: 6 },
  emptyText: { fontSize: 13, lineHeight: 20, color: "#8B9791", textAlign: "center" },
  logoutBtn: {
    marginTop: 24,
    alignSelf: "center",
    backgroundColor: "#F3F3F3",
    borderRadius: 12,
    paddingHorizontal: 18,
    paddingVertical: 12,
  },
  logoutText: { fontSize: 14, fontWeight: "700", color: "#6B6B6B" },
});
