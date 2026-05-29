import {
  View, Text, Image, ScrollView, TouchableOpacity, StyleSheet,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import MapView, { Marker, Polyline } from 'react-native-maps';

const PIN_COLORS = ['#1D9E75', '#378ADD', '#F5A623', '#E95F5F', '#9B59B6'];

const calcRegion = (photos) => {
  const lats = photos.map(p => p.gps.latitude);
  const lngs = photos.map(p => p.gps.longitude);
  const minLat = Math.min(...lats), maxLat = Math.max(...lats);
  const minLng = Math.min(...lngs), maxLng = Math.max(...lngs);
  return {
    latitude:      (minLat + maxLat) / 2,
    longitude:     (minLng + maxLng) / 2,
    latitudeDelta:  Math.max((maxLat - minLat) * 1.6, 0.01),
    longitudeDelta: Math.max((maxLng - minLng) * 1.6, 0.01),
  };
};

const formatDisplayDate = (dateStr) => {
  if (!dateStr) return '';
  const [y, m, d] = dateStr.split('-');
  return `${y}년 ${parseInt(m)}월 ${parseInt(d)}일`;
};

export default function DiaryPreviewCard({ diary, navigation }) {
  /* 일기 없는 날짜 */
  if (!diary) {
    return (
      <View style={styles.emptyCard}>
        <Text style={styles.emptyIcon}>✏️</Text>
        <Text style={styles.emptyText}>아직 기록이 없어요</Text>
        <Text style={styles.emptySubText}>일기 탭에서 오늘의 하루를 기록해보세요.</Text>
      </View>
    );
  }

  const gpsPhotos = (diary.photos ?? [])
    .map((p, i) => ({ ...p, color: p.color ?? PIN_COLORS[i % PIN_COLORS.length] }))
    .filter(p => p.gps);

  return (
    <View style={styles.card}>

      {/* 지도 */}
      {gpsPhotos.length > 0 && (
        <View style={styles.mapContainer}>
          <MapView
            style={styles.map}
            region={calcRegion(gpsPhotos)}
            scrollEnabled={false}
            pitchEnabled={false}
            rotateEnabled={false}
            zoomEnabled={false}
          >
            {gpsPhotos.map((photo, i) => (
              <Marker key={i} coordinate={photo.gps} anchor={{ x: 0.5, y: 1 }}>
                <View style={styles.pinWrapper}>
                  <View style={[styles.pinBox, { borderColor: photo.color }]}>
                    <Image source={{ uri: photo.uri }} style={styles.pinImage} />
                  </View>
                  <View style={[styles.pinTail, { borderTopColor: photo.color }]} />
                </View>
              </Marker>
            ))}
            {gpsPhotos.length > 1 && (
              <Polyline
                coordinates={gpsPhotos.map(p => p.gps)}
                strokeColor="#1D9E75"
                strokeWidth={2}
                lineDashPattern={[6, 4]}
              />
            )}
          </MapView>
        </View>
      )}

      {/* 감정 + 날짜 */}
      <View style={styles.metaRow}>
        {diary.emotion ? (
          <Text style={styles.emotion}>{diary.emotion}</Text>
        ) : null}
        <Text style={styles.dateText}>{formatDisplayDate(diary.date)}</Text>
      </View>

      {/* 키워드 태그 */}
      {diary.keywords?.length > 0 && (
        <View style={styles.tagsRow}>
          {diary.keywords.map((kw, i) => (
            <View key={i} style={styles.tag}>
              <Text style={styles.tagText}>{kw}</Text>
            </View>
          ))}
        </View>
      )}

      {/* 텍스트 미리보기 */}
      {!!diary.text && (
        <Text style={styles.textPreview} numberOfLines={2} ellipsizeMode="tail">
          {diary.text}
        </Text>
      )}

      {!!diary.analysis && (
        <View style={styles.analysisBox}>
          <Ionicons name="sparkles" size={13} color="#1D9E75" />
          <Text style={styles.analysisText} numberOfLines={3} ellipsizeMode="tail">
            {diary.analysis}
          </Text>
        </View>
      )}

      {/* 사진 썸네일 */}
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

      {/* 자세히 보기 버튼 */}
      <TouchableOpacity
        style={styles.detailBtn}
        onPress={() => navigation.navigate('Diary')}
      >
        <Text style={styles.detailText}>자세히 보기</Text>
        <Ionicons name="chevron-forward" size={14} color="#1D9E75" />
      </TouchableOpacity>

    </View>
  );
}

const styles = StyleSheet.create({
  emptyCard: {
    alignItems: 'center', paddingVertical: 28,
    backgroundColor: '#FAFAFA', borderRadius: 16,
    borderWidth: 1, borderColor: '#EEEEEE',
  },
  emptyIcon:    { fontSize: 28, marginBottom: 8 },
  emptyText:    { fontSize: 15, fontWeight: '600', color: '#555', marginBottom: 4 },
  emptySubText: { fontSize: 13, color: '#AAA' },

  card: {
    backgroundColor: '#FFF', borderRadius: 16,
    borderWidth: 1, borderColor: '#EEEEEE',
    overflow: 'hidden',
  },

  mapContainer: { height: 130 },
  map:          { flex: 1 },
  pinWrapper:   { alignItems: 'center' },
  pinBox:       { width: 28, height: 28, borderRadius: 5, borderWidth: 2, overflow: 'hidden', backgroundColor: '#FFF' },
  pinImage:     { width: '100%', height: '100%' },
  pinTail:      { width: 0, height: 0, borderLeftWidth: 5, borderRightWidth: 5, borderTopWidth: 7, borderLeftColor: 'transparent', borderRightColor: 'transparent' },

  metaRow:   { flexDirection: 'row', alignItems: 'center', gap: 8, paddingHorizontal: 14, paddingTop: 12, paddingBottom: 6 },
  emotion:   { fontSize: 20 },
  dateText:  { fontSize: 13, fontWeight: '600', color: '#555' },

  tagsRow:  { flexDirection: 'row', flexWrap: 'wrap', gap: 6, paddingHorizontal: 14, marginBottom: 8 },
  tag:      { backgroundColor: '#E1F5EE', borderRadius: 20, paddingHorizontal: 10, paddingVertical: 4 },
  tagText:  { fontSize: 12, fontWeight: '600', color: '#085041' },

  textPreview: { fontSize: 14, color: '#444', lineHeight: 20, paddingHorizontal: 14, marginBottom: 10 },

  analysisBox: {
    flexDirection: 'row',
    gap: 6,
    backgroundColor: '#F6FBF8',
    borderRadius: 10,
    marginHorizontal: 14,
    marginBottom: 10,
    padding: 10,
  },
  analysisText: { flex: 1, fontSize: 12, color: '#4B6258', lineHeight: 18 },

  photosScroll: { paddingHorizontal: 14, marginBottom: 10 },
  thumb:        { width: 60, height: 60, borderRadius: 8, backgroundColor: '#EEE' },

  detailBtn: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'center',
    gap: 4, paddingVertical: 12,
    borderTopWidth: 1, borderTopColor: '#F0F0F0',
  },
  detailText: { fontSize: 14, fontWeight: '700', color: '#1D9E75' },
});
