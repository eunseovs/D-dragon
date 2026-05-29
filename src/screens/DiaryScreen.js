import { useEffect, useRef, useState } from 'react';
import {
  View, Text, ScrollView, TouchableOpacity, TextInput,
  StyleSheet, Image, Alert, ActivityIndicator,
  KeyboardAvoidingView, Platform,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import * as Location from 'expo-location';
import MapView, { Marker, Polyline } from 'react-native-maps';
import { useDiaries } from '../contexts/DiaryContext';

const EMOTIONS = ['😊', '😎', '😌', '😤', '😡'];
const PIN_COLORS = ['#1D9E75', '#378ADD', '#F5A623', '#E95F5F', '#9B59B6'];
const WEEKDAYS = ['일', '월', '화', '수', '목', '금', '토'];

const dateToStr = (date) => {
  const d = new Date(date);
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, '0');
  const dd = String(d.getDate()).padStart(2, '0');
  return `${y}-${m}-${dd}`;
};

const toDecimal = (val, ref) => {
  if (val == null) return null;
  const toNum = (v) => {
    if (typeof v === 'number') return v;
    if (typeof v === 'string' && v.includes('/')) {
      const [a, b] = v.split('/').map(Number);
      return b ? a / b : Number(v);
    }
    return Number(v);
  };
  let d = Array.isArray(val)
    ? toNum(val[0]) + toNum(val[1]) / 60 + toNum(val[2]) / 3600
    : toNum(val);
  return (ref === 'S' || ref === 'W') ? -d : d;
};

const extractGPS = (exif) => {
  if (!exif) return null;
  const lat = toDecimal(exif.GPSLatitude,  exif.GPSLatitudeRef  ?? 'N');
  const lng = toDecimal(exif.GPSLongitude, exif.GPSLongitudeRef ?? 'E');
  if (lat == null || lng == null || isNaN(lat) || isNaN(lng)) return null;
  if (Math.abs(lat) > 90 || Math.abs(lng) > 180) return null;
  return { latitude: lat, longitude: lng };
};

const calcRegion = (gpsPhotos) => {
  const lats = gpsPhotos.map(p => p.gps.latitude);
  const lngs = gpsPhotos.map(p => p.gps.longitude);
  const minLat = Math.min(...lats), maxLat = Math.max(...lats);
  const minLng = Math.min(...lngs), maxLng = Math.max(...lngs);
  return {
    latitude:      (minLat + maxLat) / 2,
    longitude:     (minLng + maxLng) / 2,
    latitudeDelta:  Math.max((maxLat - minLat) * 1.6, 0.01),
    longitudeDelta: Math.max((maxLng - minLng) * 1.6, 0.01),
  };
};

const spreadCloseMarkers = (items) => {
  const groups = new Map();

  items.forEach((item) => {
    const key = `${item.gps.latitude.toFixed(4)}:${item.gps.longitude.toFixed(4)}`;
    const group = groups.get(key) ?? [];
    group.push(item);
    groups.set(key, group);
  });

  const spread = [];
  groups.forEach((group) => {
    if (group.length === 1) {
      spread.push({ ...group[0], markerGps: group[0].gps });
      return;
    }

    group.forEach((item, index) => {
      const angle = (Math.PI * 2 * index) / group.length;
      const radius = 0.00018 + index * 0.00002;
      spread.push({
        ...item,
        markerGps: {
          latitude: item.gps.latitude + Math.cos(angle) * radius,
          longitude: item.gps.longitude + Math.sin(angle) * radius,
        },
      });
    });
  });

  return spread;
};

const parseExifDate = (asset) => {
  const raw =
    asset.exif?.DateTimeOriginal ||
    asset.exif?.DateTimeDigitized ||
    asset.exif?.DateTime ||
    asset.creationTime;

  if (typeof raw === 'number') return new Date(raw);
  if (typeof raw !== 'string') return new Date();

  const normalized = raw.includes(':')
    ? raw.replace(/^(\d{4}):(\d{2}):(\d{2})/, '$1-$2-$3')
    : raw;
  const parsed = new Date(normalized);
  return Number.isNaN(parsed.getTime()) ? new Date() : parsed;
};

const formatTime = (date) =>
  `${String(date.getHours()).padStart(2, '0')}:${String(date.getMinutes()).padStart(2, '0')}`;

const distanceKm = (a, b) => {
  if (!a?.gps || !b?.gps) return 0;
  const toRad = deg => deg * Math.PI / 180;
  const R = 6371;
  const dLat = toRad(b.gps.latitude - a.gps.latitude);
  const dLng = toRad(b.gps.longitude - a.gps.longitude);
  const lat1 = toRad(a.gps.latitude);
  const lat2 = toRad(b.gps.latitude);
  const h = Math.sin(dLat / 2) ** 2 + Math.cos(lat1) * Math.cos(lat2) * Math.sin(dLng / 2) ** 2;
  return 2 * R * Math.asin(Math.sqrt(h));
};

const buildTimeline = (items) =>
  [...items]
    .sort((a, b) => new Date(a.takenAt).getTime() - new Date(b.takenAt).getTime())
    .map((p, i, arr) => ({
      ...p,
      time: formatTime(new Date(p.takenAt)),
      order: i + 1,
      distanceFromPrevKm: i === 0 ? 0 : distanceKm(arr[i - 1], p),
    }));

const makeLocalInsight = (timeline, diaryText, keywords) => {
  if (timeline.length === 0) {
    return '사진의 위치 정보가 아직 없어요. 위치 정보가 포함된 사진을 추가하면 하루 동선과 머문 장소를 분석할 수 있습니다.';
  }

  const places = timeline.map(p => p.locationName || '이름 없는 장소');
  const uniquePlaces = [...new Set(places)];
  const totalDistance = timeline.reduce((sum, p) => sum + p.distanceFromPrevKm, 0);
  const start = timeline[0];
  const end = timeline[timeline.length - 1];
  const keywordText = keywords.length ? ` 키워드는 ${keywords.join(', ')}로 기록됐어요.` : '';
  const diaryHint = diaryText.trim()
    ? ' 일기 내용까지 보면 사진 동선과 감정 기록이 함께 남아 있어 회고하기 좋은 하루입니다.'
    : ' 일기 내용을 조금 더 적으면 장소 이동과 감정 흐름을 더 선명하게 볼 수 있어요.';

  return `${start.time} ${places[0]}에서 시작해 ${end.time} ${places[places.length - 1]}까지 이어진 일정이에요. ` +
    `${uniquePlaces.length}곳의 장소가 확인됐고, 사진 기준 이동 거리는 약 ${totalDistance.toFixed(1)}km입니다.` +
    `${keywordText}${diaryHint}`;
};

export default function DiaryScreen() {
  const today = new Date();
  const { addOrUpdateDiary } = useDiaries();
  const mapRef = useRef(null);

  const [photos, setPhotos]                   = useState([]);
  const [selectedEmotion, setSelectedEmotion] = useState(null);
  const [keywords, setKeywords]               = useState([]);
  const [keywordInput, setKeywordInput]       = useState('');
  const [diaryText, setDiaryText]             = useState('');
  const [isGeocoding, setIsGeocoding]         = useState(false);
  const [analysis, setAnalysis]               = useState('');

  const gpsPhotos = photos.filter(p => p.gps);
  const timeline = buildTimeline(gpsPhotos);
  const mapMarkers = spreadCloseMarkers(timeline);

  useEffect(() => {
    setAnalysis(makeLocalInsight(timeline, diaryText, keywords));
  }, [timeline, diaryText, keywords]);

  useEffect(() => {
    if (!mapRef.current || mapMarkers.length === 0) return;
    if (mapMarkers.length === 1) return;

    const timer = setTimeout(() => {
      mapRef.current?.fitToCoordinates(
        mapMarkers.map(item => item.markerGps),
        {
          edgePadding: { top: 48, right: 48, bottom: 48, left: 48 },
          animated: true,
        }
      );
    }, 180);

    return () => clearTimeout(timer);
  }, [mapMarkers]);

  const reverseGeocode = async (lat, lng) => {
    try {
      const results = await Location.reverseGeocodeAsync({ latitude: lat, longitude: lng });
      const place = results?.[0];
      if (!place) return null;
      return place.name || place.street || place.district || place.city || place.region || place.country || null;
    } catch {
      return null;
    }
  };

  const analyzeTimeline = async () => {
    if (timeline.length === 0) {
      setAnalysis(makeLocalInsight(timeline, diaryText, keywords));
      Alert.alert('위치 사진 필요', '위치 정보가 포함된 사진을 추가하면 일정 분석을 할 수 있어요.');
      return;
    }
    setAnalysis(makeLocalInsight(timeline, diaryText, keywords));
  };

  const handleAddPhoto = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert('권한 필요', '사진 접근 권한이 필요합니다.');
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: 'images',
      allowsMultipleSelection: true,
      exif: true,
      quality: 0.8,
    });

    if (result.canceled) return;

    setIsGeocoding(true);

    const hasGps = result.assets.some(asset => extractGPS(asset.exif));
    if (hasGps && Platform.OS === 'android') {
      await Location.requestForegroundPermissionsAsync();
    }

    const newPhotos = await Promise.all(
      result.assets.map(async (asset, i) => {
        const gps = extractGPS(asset.exif);
        const locationName = gps ? await reverseGeocode(gps.latitude, gps.longitude) : null;
        const takenAt = parseExifDate(asset).toISOString();
        return {
          id:   Date.now() + i,
          uri:  asset.uri,
          gps,
          locationName,
          takenAt,
          fileName: asset.fileName ?? null,
          color: PIN_COLORS[(photos.length + i) % PIN_COLORS.length],
        };
      })
    );

    setPhotos(prev => [...prev, ...newPhotos]);
    if (newPhotos.some(photo => photo.gps)) {
      const nextPhotos = [...photos, ...newPhotos];
      setAnalysis(makeLocalInsight(buildTimeline(nextPhotos.filter(photo => photo.gps)), diaryText, keywords));
    }
    setIsGeocoding(false);
  };

  const handleAddKeyword = () => {
    const kw = keywordInput.trim();
    if (kw && !keywords.includes(kw)) setKeywords(prev => [...prev, kw]);
    setKeywordInput('');
  };

  const handleSave = () => {
    if (!diaryText.trim()) {
      Alert.alert('알림', '일기 내용을 입력해주세요.');
      return;
    }
    const entry = {
      id:      Date.now(),
      date:    dateToStr(today),
      emotion: selectedEmotion !== null ? EMOTIONS[selectedEmotion] : null,
      keywords,
      text:    diaryText,
      analysis,
      timeline: timeline.map(p => ({
        time: p.time,
        takenAt: p.takenAt,
        gps: p.gps,
        locationName: p.locationName,
        distanceFromPrevKm: p.distanceFromPrevKm,
      })),
      photos:  photos.map(p => ({
        uri: p.uri,
        gps: p.gps,
        locationName: p.locationName,
        takenAt: p.takenAt,
        fileName: p.fileName,
        color: p.color,
      })),
    };
    addOrUpdateDiary(entry);
    Alert.alert('저장 완료', '일기가 저장되었습니다. 🎉');
  };

  const locationNames = [...new Set(gpsPhotos.map(p => p.locationName).filter(Boolean))];

  return (
    <SafeAreaView style={styles.safe} edges={['top', 'left', 'right']}>

      <View style={styles.header}>
        <View style={{ flex: 1 }}>
          <Text style={styles.headerDate}>
            {today.getFullYear()}년 {today.getMonth() + 1}월 {today.getDate()}일{' '}
            {WEEKDAYS[today.getDay()]}요일
          </Text>
          <Text style={styles.headerTitle}>Diary</Text>
        </View>
        <View style={styles.weatherTag}>
          <Text style={styles.weatherText}>⛅ 23°C</Text>
        </View>
      </View>

      <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
      <ScrollView contentContainerStyle={styles.scroll} keyboardShouldPersistTaps="handled" keyboardDismissMode="on-drag">

        {/* 사진 가로 스크롤 */}
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.photoScroll}
        >
          {photos.map(photo => (
            <View key={photo.id} style={styles.photoWrapper}>
              <Image source={{ uri: photo.uri }} style={styles.photo} />
              <View style={[styles.gpsBadge, photo.gps ? styles.gpsBadgeYes : styles.gpsBadgeNo]}>
                <Text style={styles.gpsBadgeText}>{photo.gps ? 'GPS' : '없음'}</Text>
              </View>
              <TouchableOpacity
                style={styles.removeBtn}
                onPress={() => setPhotos(prev => prev.filter(p => p.id !== photo.id))}
              >
                <Ionicons name="close-circle" size={18} color="#FFF" />
              </TouchableOpacity>
            </View>
          ))}
          <TouchableOpacity style={styles.addPhotoBtn} onPress={handleAddPhoto}>
            {isGeocoding
              ? <ActivityIndicator color="#1D9E75" />
              : <Ionicons name="add" size={32} color="#1D9E75" />
            }
          </TouchableOpacity>
        </ScrollView>

        {/* GPS 배너 */}
        {gpsPhotos.length > 0 && (
          <View style={styles.gpsBanner}>
            <Ionicons name="location" size={16} color="#085041" style={{ marginTop: 2 }} />
            <View style={{ flex: 1 }}>
              <Text style={styles.gpsBannerTitle}>
                {dateToStr(today)} 동선 정리 완료!
              </Text>
              {locationNames.length > 0 && (
                <Text style={styles.gpsBannerLocation}>
                  📍 {locationNames.join(' · ')}
                </Text>
              )}
            </View>
          </View>
        )}

        {/* 지도 */}
        {gpsPhotos.length > 0 && (
          <View style={styles.mapContainer}>
            <MapView
              ref={mapRef}
              style={styles.map}
              initialRegion={calcRegion(gpsPhotos)}
              scrollEnabled={false}
            >
              {mapMarkers.map((photo, index) => (
                <Marker key={photo.id} coordinate={photo.markerGps} anchor={{ x: 0.5, y: 1 }}>
                  <View style={styles.pinWrapper}>
                    <View style={styles.pinCountBadge}>
                      <Text style={styles.pinCountText}>{index + 1}</Text>
                    </View>
                    <View style={[styles.pinBox, { borderColor: photo.color }]}>
                      <Image source={{ uri: photo.uri }} style={styles.pinImage} />
                    </View>
                    <View style={[styles.pinTail, { borderTopColor: photo.color }]} />
                  </View>
                </Marker>
              ))}
              {mapMarkers.length > 1 && (
                <Polyline
                  coordinates={mapMarkers.map(p => p.markerGps)}
                  strokeColor="#1D9E75"
                  strokeWidth={2}
                  lineDashPattern={[6, 4]}
                />
              )}
            </MapView>
          </View>
        )}

        {timeline.length > 0 && (
          <View style={styles.timelineCard}>
            <View style={styles.timelineHeader}>
              <Text style={styles.timelineTitle}>사진 위치 타임라인</Text>
              <Text style={styles.timelineCount}>{timeline.length} stops</Text>
            </View>
            {timeline.map((item, i) => (
              <View key={item.id} style={styles.timelineRow}>
                <View style={styles.timelineRail}>
                  <View style={[styles.timelineDot, { backgroundColor: item.color }]} />
                  {i < timeline.length - 1 && <View style={styles.timelineLine} />}
                </View>
                <View style={styles.timelineBody}>
                  <View style={styles.timelineTop}>
                    <Text style={styles.timelineTime}>{item.time}</Text>
                    {item.distanceFromPrevKm > 0 && (
                      <Text style={styles.timelineDistance}>
                        +{item.distanceFromPrevKm.toFixed(1)}km
                      </Text>
                    )}
                  </View>
                  <Text style={styles.timelinePlace}>
                    {item.locationName || '장소 이름 확인 중'}
                  </Text>
                  <Text style={styles.timelineCoord}>
                    {item.gps.latitude.toFixed(5)}, {item.gps.longitude.toFixed(5)}
                  </Text>
                </View>
              </View>
            ))}
          </View>
        )}

        <View style={styles.analysisCard}>
          <View style={styles.analysisHeader}>
            <View style={styles.analysisTitleRow}>
              <Ionicons name="sparkles" size={15} color="#1D9E75" />
              <Text style={styles.analysisTitle}>AI 요약</Text>
            </View>
            <TouchableOpacity
              style={[styles.analysisBtn, timeline.length === 0 && styles.analysisBtnDisabled]}
              onPress={analyzeTimeline}
              disabled={false}
            >
              <Text style={styles.analysisBtnText}>새로고침</Text>
            </TouchableOpacity>
          </View>
          <Text style={styles.analysisCaption}>
            사진 위치와 촬영 시간을 기준으로 자동 정리됩니다.
          </Text>
          {analysis ? (
            <Text style={styles.analysisText}>{analysis}</Text>
          ) : (
            <Text style={styles.analysisPlaceholder}>
              위치 정보가 있는 사진을 추가하면 지도와 시간순 이동이 바로 보입니다.
            </Text>
          )}
        </View>

        {/* 오늘의 감정 */}
        <Text style={styles.sectionLabel}>오늘의 감정</Text>
        <View style={styles.emotionRow}>
          {EMOTIONS.map((em, i) => (
            <TouchableOpacity
              key={i}
              style={[styles.emotionBtn, selectedEmotion === i && styles.emotionBtnSelected]}
              onPress={() => setSelectedEmotion(selectedEmotion === i ? null : i)}
            >
              <Text style={styles.emotionEmoji}>{em}</Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* 키워드 */}
        <Text style={styles.sectionLabel}>키워드</Text>
        <View style={styles.keywordRow}>
          <TextInput
            style={styles.keywordInput}
            placeholder="태그 입력"
            placeholderTextColor="#BBB"
            value={keywordInput}
            onChangeText={setKeywordInput}
            onSubmitEditing={handleAddKeyword}
            returnKeyType="done"
          />
          <TouchableOpacity style={styles.keywordAddBtn} onPress={handleAddKeyword}>
            <Text style={styles.keywordAddText}>추가</Text>
          </TouchableOpacity>
        </View>
        {keywords.length > 0 && (
          <View style={styles.tagsWrap}>
            {keywords.map((kw, i) => (
              <View key={i} style={styles.tag}>
                <Text style={styles.tagText}>{kw}</Text>
                <TouchableOpacity onPress={() => setKeywords(prev => prev.filter((_, j) => j !== i))}>
                  <Ionicons name="close" size={13} color="#085041" />
                </TouchableOpacity>
              </View>
            ))}
          </View>
        )}

        {/* 일기 입력 */}
        <Text style={styles.sectionLabel}>일기</Text>
        <TextInput
          style={styles.diaryInput}
          placeholder="오늘 하루를 기록해보세요..."
          placeholderTextColor="#BBB"
          multiline
          value={diaryText}
          onChangeText={setDiaryText}
          textAlignVertical="top"
        />

        {/* 저장 버튼 */}
        <TouchableOpacity style={styles.saveBtn} onPress={handleSave}>
          <Text style={styles.saveBtnText}>일기 저장하기</Text>
        </TouchableOpacity>

      </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: '#FFF' },

  header: {
    flexDirection: 'row', alignItems: 'center',
    paddingHorizontal: 20, paddingVertical: 14,
    borderBottomWidth: 1, borderBottomColor: '#F0F0F0',
  },
  headerDate:  { fontSize: 12, color: '#888', marginBottom: 2 },
  headerTitle: { fontSize: 22, fontWeight: '800', color: '#111' },
  weatherTag:  { backgroundColor: '#E1F5EE', borderRadius: 20, paddingHorizontal: 12, paddingVertical: 6 },
  weatherText: { fontSize: 13, fontWeight: '700', color: '#085041' },

  scroll: { paddingHorizontal: 20, paddingTop: 16, paddingBottom: 40 },

  photoScroll:  { paddingBottom: 8, gap: 10 },
  photoWrapper: { width: 72, height: 72, borderRadius: 10, overflow: 'visible', marginRight: 2 },
  photo:        { width: 72, height: 72, borderRadius: 10, backgroundColor: '#EEE' },
  gpsBadge:     { position: 'absolute', bottom: 4, left: 4, borderRadius: 4, paddingHorizontal: 4, paddingVertical: 1 },
  gpsBadgeYes:  { backgroundColor: '#1D9E75' },
  gpsBadgeNo:   { backgroundColor: '#AAAAAA' },
  gpsBadgeText: { fontSize: 9, fontWeight: '800', color: '#FFF' },
  removeBtn:    { position: 'absolute', top: -6, right: -6 },
  addPhotoBtn:  {
    width: 72, height: 72, borderRadius: 10,
    borderWidth: 1.5, borderColor: '#CCC', borderStyle: 'dashed',
    justifyContent: 'center', alignItems: 'center',
    backgroundColor: '#FAFAFA',
  },

  gpsBanner: {
    flexDirection: 'row', alignItems: 'flex-start', gap: 8,
    backgroundColor: '#E1F5EE', borderRadius: 12,
    padding: 12, marginTop: 14,
  },
  gpsBannerTitle:    { fontSize: 13, fontWeight: '700', color: '#085041' },
  gpsBannerLocation: { fontSize: 12, color: '#1D9E75', marginTop: 2 },

  mapContainer: { marginTop: 12, borderRadius: 14, overflow: 'hidden', height: 220 },
  map:          { flex: 1 },

  pinWrapper: { alignItems: 'center' },
  pinCountBadge: {
    position: 'absolute',
    top: -8,
    left: -8,
    minWidth: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: '#22342A',
    paddingHorizontal: 5,
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 2,
  },
  pinCountText: { color: '#FFF', fontSize: 11, fontWeight: '800' },
  pinBox: {
    width: 42, height: 42, borderRadius: 8,
    borderWidth: 2.5, overflow: 'hidden',
    backgroundColor: '#FFF',
  },
  pinImage: { width: '100%', height: '100%' },
  pinTail: {
    width: 0, height: 0,
    borderLeftWidth: 6, borderRightWidth: 6, borderTopWidth: 8,
    borderLeftColor: 'transparent', borderRightColor: 'transparent',
  },

  timelineCard: {
    backgroundColor: '#FAFAFA',
    borderRadius: 14,
    borderWidth: 1,
    borderColor: '#EEEEEE',
    padding: 14,
    marginTop: 12,
  },
  timelineHeader: { flexDirection: 'row', alignItems: 'center', marginBottom: 12 },
  timelineTitle:  { flex: 1, fontSize: 15, fontWeight: '800', color: '#222' },
  timelineCount:  { fontSize: 12, fontWeight: '700', color: '#1D9E75' },
  timelineRow:    { flexDirection: 'row' },
  timelineRail:   { width: 18, alignItems: 'center' },
  timelineDot:    { width: 10, height: 10, borderRadius: 5, marginTop: 4 },
  timelineLine:   { width: 2, flex: 1, minHeight: 42, backgroundColor: '#DCEBE5', marginTop: 4 },
  timelineBody:   { flex: 1, paddingBottom: 14 },
  timelineTop:    { flexDirection: 'row', alignItems: 'center', marginBottom: 2 },
  timelineTime:   { fontSize: 13, fontWeight: '800', color: '#222', marginRight: 8 },
  timelineDistance: { fontSize: 11, fontWeight: '700', color: '#1D9E75', backgroundColor: '#E1F5EE', borderRadius: 10, paddingHorizontal: 7, paddingVertical: 2 },
  timelinePlace:  { fontSize: 14, fontWeight: '700', color: '#444', marginBottom: 2 },
  timelineCoord:  { fontSize: 11, color: '#999' },

  analysisCard: {
    backgroundColor: '#FFF',
    borderRadius: 14,
    borderWidth: 1,
    borderColor: '#EEEEEE',
    padding: 14,
    marginTop: 12,
  },
  analysisHeader:   { flexDirection: 'row', alignItems: 'center', marginBottom: 10 },
  analysisTitleRow: { flex: 1, flexDirection: 'row', alignItems: 'center', gap: 6 },
  analysisTitle:    { fontSize: 15, fontWeight: '800', color: '#222' },
  analysisCaption:  { fontSize: 12, color: '#7A8E86', lineHeight: 18, marginBottom: 10 },
  analysisBtn:      { minWidth: 58, height: 34, borderRadius: 17, backgroundColor: '#1D9E75', justifyContent: 'center', alignItems: 'center', paddingHorizontal: 12 },
  analysisBtnDisabled: { opacity: 0.45 },
  analysisBtnText:  { color: '#FFF', fontSize: 13, fontWeight: '800' },
  analysisText:     { fontSize: 14, color: '#444', lineHeight: 22 },
  analysisPlaceholder: { fontSize: 13, color: '#AAA', lineHeight: 20 },

  sectionLabel: { fontSize: 15, fontWeight: '700', color: '#222', marginTop: 20, marginBottom: 10 },

  emotionRow:         { flexDirection: 'row', gap: 10 },
  emotionBtn:         { width: 52, height: 52, borderRadius: 26, backgroundColor: '#F5F5F5', justifyContent: 'center', alignItems: 'center' },
  emotionBtnSelected: { backgroundColor: '#E1F5EE', borderWidth: 2, borderColor: '#1D9E75' },
  emotionEmoji:       { fontSize: 26 },

  keywordRow:     { flexDirection: 'row', gap: 8 },
  keywordInput:   { flex: 1, height: 44, backgroundColor: '#F5F5F5', borderRadius: 10, paddingHorizontal: 14, fontSize: 14, color: '#333' },
  keywordAddBtn:  { height: 44, paddingHorizontal: 18, backgroundColor: '#1D9E75', borderRadius: 10, justifyContent: 'center', alignItems: 'center' },
  keywordAddText: { color: '#FFF', fontWeight: '700', fontSize: 14 },
  tagsWrap:       { flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginTop: 10 },
  tag:            { flexDirection: 'row', alignItems: 'center', gap: 5, backgroundColor: '#E1F5EE', borderRadius: 20, paddingHorizontal: 12, paddingVertical: 6 },
  tagText:        { fontSize: 13, fontWeight: '600', color: '#085041' },

  diaryInput: {
    minHeight: 140, backgroundColor: '#F9F9F9',
    borderRadius: 14, padding: 14,
    fontSize: 15, color: '#333', lineHeight: 22,
    borderWidth: 1, borderColor: '#EEEEEE',
  },

  saveBtn:     { marginTop: 24, height: 54, backgroundColor: '#1D9E75', borderRadius: 16, justifyContent: 'center', alignItems: 'center' },
  saveBtnText: { color: '#FFF', fontSize: 16, fontWeight: '800' },
});
