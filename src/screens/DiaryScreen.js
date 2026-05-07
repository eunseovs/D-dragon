import { useState } from 'react';
import {
  View, Text, ScrollView, TouchableOpacity, TextInput,
  StyleSheet, Image, Alert, ActivityIndicator,
  KeyboardAvoidingView, Platform,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
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
  let d = Array.isArray(val) ? val[0] + val[1] / 60 + val[2] / 3600 : val;
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

export default function DiaryScreen() {
  const today = new Date();
  const { addOrUpdateDiary } = useDiaries();

  const [photos, setPhotos]                   = useState([]);
  const [selectedEmotion, setSelectedEmotion] = useState(null);
  const [keywords, setKeywords]               = useState([]);
  const [keywordInput, setKeywordInput]       = useState('');
  const [diaryText, setDiaryText]             = useState('');
  const [isGeocoding, setIsGeocoding]         = useState(false);
  const [googleApiKey, setGoogleApiKey]       = useState('');
  const [showKeyInput, setShowKeyInput]       = useState(false);

  const gpsPhotos = photos.filter(p => p.gps);

  const reverseGeocode = async (lat, lng) => {
    if (!googleApiKey.trim()) return null;
    try {
      const res = await fetch(
        `https://maps.googleapis.com/maps/api/geocode/json?latlng=${lat},${lng}&key=${googleApiKey}&language=ko`
      );
      const data = await res.json();
      if (!data.results?.[0]) return null;
      const comps = data.results[0].address_components;
      return (
        comps.find(c => c.types.includes('sublocality_level_1'))?.long_name ||
        comps.find(c => c.types.includes('locality'))?.long_name ||
        comps.find(c => c.types.includes('route'))?.long_name ||
        data.results[0].formatted_address
      );
    } catch {
      return null;
    }
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

    const newPhotos = await Promise.all(
      result.assets.map(async (asset, i) => {
        const gps = extractGPS(asset.exif);
        const locationName = gps ? await reverseGeocode(gps.latitude, gps.longitude) : null;
        return {
          id:   Date.now() + i,
          uri:  asset.uri,
          gps,
          locationName,
          color: PIN_COLORS[(photos.length + i) % PIN_COLORS.length],
        };
      })
    );

    setPhotos(prev => [...prev, ...newPhotos]);
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
      photos:  photos.map(p => ({
        uri: p.uri, gps: p.gps, locationName: p.locationName, color: p.color,
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
                {gpsPhotos.length}장에서 GPS 위치 추출 완료
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
            <MapView style={styles.map} region={calcRegion(gpsPhotos)} scrollEnabled={false}>
              {gpsPhotos.map(photo => (
                <Marker key={photo.id} coordinate={photo.gps} anchor={{ x: 0.5, y: 1 }}>
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

        {/* Google API 키 설정 */}
        {showKeyInput ? (
          <View style={styles.apiKeyCard}>
            <Text style={styles.apiKeyLabel}>Google API 키 (장소명 변환용)</Text>
            <Text style={styles.apiKeyHint}>
              console.cloud.google.com → Geocoding API 활성화 후 발급
            </Text>
            <View style={styles.apiKeyRow}>
              <TextInput
                style={styles.apiKeyInput}
                placeholder="API 키 입력"
                placeholderTextColor="#BBB"
                value={googleApiKey}
                onChangeText={setGoogleApiKey}
                autoCapitalize="none"
                secureTextEntry
              />
              <TouchableOpacity
                style={[styles.apiKeySaveBtn, !googleApiKey.trim() && { opacity: 0.4 }]}
                onPress={() => { if (googleApiKey.trim()) setShowKeyInput(false); }}
              >
                <Text style={styles.apiKeySaveText}>저장</Text>
              </TouchableOpacity>
            </View>
          </View>
        ) : (
          <TouchableOpacity onPress={() => setShowKeyInput(true)} style={styles.apiKeyToggle}>
            <Ionicons name="key-outline" size={14} color="#AAA" />
            <Text style={styles.apiKeyToggleText}>
              {googleApiKey ? 'Google API 키 변경' : 'Google API 키 설정 (장소명 표시용)'}
            </Text>
          </TouchableOpacity>
        )}

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

  mapContainer: { marginTop: 12, borderRadius: 14, overflow: 'hidden', height: 130 },
  map:          { flex: 1 },

  pinWrapper: { alignItems: 'center' },
  pinBox: {
    width: 36, height: 36, borderRadius: 6,
    borderWidth: 2, overflow: 'hidden',
    backgroundColor: '#FFF',
  },
  pinImage: { width: '100%', height: '100%' },
  pinTail: {
    width: 0, height: 0,
    borderLeftWidth: 6, borderRightWidth: 6, borderTopWidth: 8,
    borderLeftColor: 'transparent', borderRightColor: 'transparent',
  },

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

  apiKeyCard:     { backgroundColor: '#F9F9F9', borderRadius: 12, padding: 14, marginTop: 16, borderWidth: 1, borderColor: '#EEE' },
  apiKeyLabel:    { fontSize: 13, fontWeight: '700', color: '#333', marginBottom: 2 },
  apiKeyHint:     { fontSize: 11, color: '#AAA', marginBottom: 10 },
  apiKeyRow:      { flexDirection: 'row', gap: 8 },
  apiKeyInput:    { flex: 1, height: 40, backgroundColor: '#FFF', borderRadius: 8, paddingHorizontal: 12, fontSize: 13, color: '#333', borderWidth: 1, borderColor: '#DDD' },
  apiKeySaveBtn:  { height: 40, paddingHorizontal: 14, backgroundColor: '#1D9E75', borderRadius: 8, justifyContent: 'center', alignItems: 'center' },
  apiKeySaveText: { color: '#FFF', fontWeight: '700', fontSize: 13 },
  apiKeyToggle:   { flexDirection: 'row', alignItems: 'center', gap: 5, marginTop: 14, alignSelf: 'center' },
  apiKeyToggleText: { fontSize: 12, color: '#AAAAAA' },

  saveBtn:     { marginTop: 24, height: 54, backgroundColor: '#1D9E75', borderRadius: 16, justifyContent: 'center', alignItems: 'center' },
  saveBtnText: { color: '#FFF', fontSize: 16, fontWeight: '800' },
});
