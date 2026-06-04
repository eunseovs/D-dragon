import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { Image, ScrollView, StyleSheet, Text, TouchableOpacity, View } from "react-native";

const formatDisplayDate = (dateStr) => {
  if (!dateStr) return "";
  const [y, m, d] = dateStr.split("-");
  return `${y}년 ${parseInt(m, 10)}월 ${parseInt(d, 10)}일`;
};

export default function DiaryPreviewCard({ diary, onPress }) {
  const router = useRouter();

  if (!diary) {
    return (
      <View style={styles.emptyCard}>
        <Text style={styles.emptyText}>아직 기록이 없어요</Text>
        <Text style={styles.emptySubText}>일기 탭에서 선택한 날짜의 하루를 기록해보세요.</Text>
      </View>
    );
  }

  return (
    <View style={styles.card}>
      <View style={styles.webMapFallback}>
        <Ionicons name="map-outline" size={16} color="#1D9E75" />
        <Text style={styles.webMapFallbackText}>웹에서는 지도 미리보기를 숨겼어요.</Text>
      </View>

      <View style={styles.metaRow}>
        {diary.emotion ? <Text style={styles.emotion}>{diary.emotion}</Text> : null}
        <Text style={styles.dateText}>{formatDisplayDate(diary.date)}</Text>
      </View>

      {diary.keywords?.length > 0 && (
        <View style={styles.tagsRow}>
          {diary.keywords.map((kw, i) => (
            <View key={i} style={styles.tag}>
              <Text style={styles.tagText}>{kw}</Text>
            </View>
          ))}
        </View>
      )}

      {!!diary.text && (
        <Text style={styles.textPreview} numberOfLines={2} ellipsizeMode="tail">
          {diary.text}
        </Text>
      )}

      {diary.photos?.length > 0 && (
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          style={styles.photosScroll}
          contentContainerStyle={{ gap: 8 }}
        >
          {diary.photos.map((p, i) => (
            <Image key={i} source={{ uri: p.uri }} style={styles.thumb} />
          ))}
        </ScrollView>
      )}

      <TouchableOpacity style={styles.detailBtn} onPress={onPress ?? (() => router.push("/social"))}>
        <Text style={styles.detailText}>자세히 보기</Text>
        <Ionicons name="chevron-forward" size={14} color="#1D9E75" />
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  emptyCard: {
    alignItems: "center",
    paddingVertical: 28,
    backgroundColor: "#FAFAFA",
    borderRadius: 16,
    borderWidth: 1,
    borderColor: "#EEEEEE",
  },
  emptyText: { fontSize: 15, fontWeight: "600", color: "#555", marginBottom: 4 },
  emptySubText: { fontSize: 13, color: "#AAA" },
  card: {
    backgroundColor: "#FFF",
    borderRadius: 16,
    borderWidth: 1,
    borderColor: "#EEEEEE",
    overflow: "hidden",
  },
  webMapFallback: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    paddingHorizontal: 14,
    paddingVertical: 12,
    backgroundColor: "#F6FBF8",
  },
  webMapFallbackText: { fontSize: 12, color: "#4B6258" },
  metaRow: { flexDirection: "row", alignItems: "center", gap: 8, paddingHorizontal: 14, paddingTop: 12, paddingBottom: 6 },
  emotion: { fontSize: 20 },
  dateText: { fontSize: 13, fontWeight: "600", color: "#555" },
  tagsRow: { flexDirection: "row", flexWrap: "wrap", gap: 6, paddingHorizontal: 14, marginBottom: 8 },
  tag: { backgroundColor: "#E1F5EE", borderRadius: 20, paddingHorizontal: 10, paddingVertical: 4 },
  tagText: { fontSize: 12, fontWeight: "600", color: "#085041" },
  textPreview: { fontSize: 14, color: "#444", lineHeight: 20, paddingHorizontal: 14, marginBottom: 10 },
  photosScroll: { paddingHorizontal: 14, marginBottom: 10 },
  thumb: { width: 60, height: 60, borderRadius: 8, backgroundColor: "#EEE" },
  detailBtn: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 4,
    paddingVertical: 12,
    borderTopWidth: 1,
    borderTopColor: "#F0F0F0",
  },
  detailText: { fontSize: 14, fontWeight: "700", color: "#1D9E75" },
});
