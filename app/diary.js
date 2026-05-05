import React, { useState, useEffect, useRef } from "react";
import {
  View,
  Text,
  Image,
  StyleSheet,
  ScrollView,
  TextInput,
  TouchableOpacity,
  Dimensions,
  ActivityIndicator,
  Alert,
} from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import * as Location from "expo-location";
import { Pedometer } from "expo-sensors";

const { width } = Dimensions.get("window");

export default function Diary() {
  const { photos } = useLocalSearchParams();
  const router = useRouter();
  const parsedPhotos = JSON.parse(photos || "[]");

  // --- 상태 관리 ---
  const [content, setContent] = useState("");
  const [keywords, setKeywords] = useState(["청계산", "벚꽃", "카페"]);
  const [newKeyword, setNewKeyword] = useState("");
  const [selectedMood, setSelectedMood] = useState(null);
  const [step, setStep] = useState(1); 

  const [steps, setSteps] = useState(0);
  const [weather, setWeather] = useState({ temp: "--", desc: "연결 중", city: "" });

  const contentInputRef = useRef(null); 

  // 로딩 화면용 이미지 (파일이 없으면 기본 mood_1로 대체되니 주의하세요!)
  const loadingImg = require("../assets/images/character_1.png");

  const moodImages = [
    require("../assets/images/mood_1.png"),
    require("../assets/images/mood_2.png"),
    require("../assets/images/mood_3.png"),
    require("../assets/images/mood_4.png"),
    require("../assets/images/mood_5.png"),
    require("../assets/images/mood_6.png"),
  ];

  // --- 실시간 데이터 로드 ---
  useEffect(() => {
    async function loadRealTimeData() {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status === "granted") {
        try {
          const loc = await Location.getCurrentPositionAsync({});
          const { latitude, longitude } = loc.coords;
          // ⚠️ 본인의 실제 API Key를 넣거나, 테스트 시에는 에러 방지를 위해 try-catch를 유지하세요.
          const API_KEY = "d7a8b0c29bb42852cdd41497dfded8b9"; 
          const response = await fetch(
            `https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&appid=${API_KEY}&units=metric&lang=kr`
          );
          const data = await response.json();
          if (data.main) {
            setWeather({
              temp: Math.round(data.main.temp),
              desc: data.weather[0].description,
              city: data.name
            });
          }
        } catch (e) { console.log("날씨 로드 실패", e); }
      }

      const isPedometerAvailable = await Pedometer.isAvailableAsync();
      if (isPedometerAvailable) {
        try {
          const start = new Date();
          start.setHours(0, 0, 0, 0);
          const end = new Date();
          const result = await Pedometer.getStepCountAsync(start, end);
          if (result) setSteps(result.steps);
        } catch (e) { console.log("걸음수 로드 실패", e); }
      }
    }
    loadRealTimeData();
  }, []);

  // --- 🤖 일기 생성 함수 ---
  const generateAIReport = () => {
    if (selectedMood === null) {
      Alert.alert("알림", "오늘의 기분을 선택해주세요!");
      return;
    }

    // 1. 즉시 로딩 페이지로 전환
    setStep(2);

    const photoComments = parsedPhotos.map((p) => p.comment).filter((c) => c).join(" ");
    
    
    setTimeout(() => {
      const aiText = `오늘 ${weather.city || "나들이 장소"}의 날씨는 ${weather.desc}이었네요. ${steps.toLocaleString()}보나 걸으며 활기찬 하루를 보내셨군요! ${photoComments ? photoComments + "라는 기억과 함께 " : ""}정말 특별하고 소중한 시간이었습니다.`;
      setContent(aiText);
      setStep(3); 
    }, 3000);
  };

  const addKeyword = () => {
    if (newKeyword.trim()) {
      setKeywords([...keywords, newKeyword]);
      setNewKeyword("");
    }
  };

  const removeKeyword = (index) => {
    setKeywords(keywords.filter((_, i) => i !== index));
  };

  // --- 🟡 [Step 2] 로딩 화면 ---
  if (step === 2) {
    return (
      <View style={styles.loadingContainer}>
        <Image source={loadingImg} style={styles.aiIcon} resizeMode="contain" />
        <View style={styles.keywordBubbleContainer}>
          {keywords.map((k, i) => (
            <View key={i} style={styles.loadingTag}><Text style={styles.tagText}># {k}</Text></View>
          ))}
        </View>
        <Text style={styles.loadingText}>키워드를 바탕으로{"\n"}오늘의 일기를 쓰고있어요</Text>
        <ActivityIndicator size="large" color="#6FAF8F" />
      </View>
    );
  }

  // --- 🔵 [Step 3] 결과 및 수정 화면 ---
  if (step === 3) {
    return (
      <ScrollView style={styles.container}>
        <View style={styles.resultHeader}><Text style={styles.resultTitle}>AI 일기 완성</Text></View>
        
        <View style={styles.sliderContainer}>
          <ScrollView horizontal pagingEnabled showsHorizontalScrollIndicator={false}>
            {parsedPhotos.map((p, i) => (
              <View key={i} style={styles.slideItem}>
                <Image source={{ uri: p.uri }} style={styles.resultMainImage} />
                {p.comment ? (
                  <View style={styles.resultCommentBox}>
                    <Text style={styles.resultCommentText}>{p.comment}</Text>
                  </View>
                ) : null}
              </View>
            ))}
          </ScrollView>
          <Text style={styles.photoCountText}>{parsedPhotos.length}장의 사진</Text>
        </View>

        <View style={styles.card}>
          <View style={styles.resultInfoRow}>
             {selectedMood !== null && (
               <Image source={moodImages[selectedMood]} style={styles.resultMoodIcon} resizeMode="contain" />
             )}
             <View style={styles.infoBadge}><Text style={styles.infoText}>{weather.temp}°C {weather.desc}</Text></View>
             <View style={styles.infoBadge}><Text style={styles.infoText}>{steps.toLocaleString()} 걸음</Text></View>
          </View>
        </View>

        <View style={styles.card}>
          <Text style={styles.title}>AI가 쓴 일기</Text>
          <TextInput
            ref={contentInputRef}
            style={styles.aiContentInput}
            value={content}
            onChangeText={setContent}
            multiline
            scrollEnabled={false} 
          />
          <View style={styles.buttonRow}>
            <TouchableOpacity style={styles.retryBtn} onPress={() => contentInputRef.current?.focus()}>
              <Text style={styles.retryBtnText}>수정하기</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.saveBtn} onPress={() => Alert.alert("알림", "일기가 저장되었습니다!")}>
              <Text style={styles.saveBtnText}>저장하기</Text>
            </TouchableOpacity>
          </View>
        </View>
        <View style={{ height: 40 }} />
      </ScrollView>
    );
  }

  // --- ⚪ [Step 1] 작성 화면 (기본) ---
  return (
    <ScrollView style={styles.container}>
      <View style={styles.headerContainer}>
        <Text style={styles.headerTitle}>Diary</Text>
        <View style={styles.headerLine} />
      </View>

      <View style={styles.dateSection}>
        <Text style={styles.dateText}>2026년 3월 23일 월요일</Text>
        <View style={styles.infoRow}>
          <View style={styles.infoBadge}><Text style={styles.infoText}>{weather.city || "위치 확인 중"}</Text></View>
          <View style={styles.infoBadge}><Text style={styles.infoText}>{weather.temp}°C</Text></View>
          <View style={styles.infoBadge}><Text style={styles.infoText}>{steps.toLocaleString()}보</Text></View>
        </View>
      </View>

      <View style={styles.moodRow}>
        {moodImages.map((img, i) => (
          <TouchableOpacity key={i} onPress={() => setSelectedMood(i)} style={[styles.moodItem, selectedMood === i && styles.selectedMood]}>
            <Image source={img} style={styles.moodImg} resizeMode="contain" />
          </TouchableOpacity>
        ))}
      </View>

      <View style={styles.card}>
        <Text style={styles.title}>오늘의 키워드</Text>
        <View style={styles.inputRow}>
          <TextInput value={newKeyword} onChangeText={setNewKeyword} placeholder="키워드 입력해주세요" style={styles.keywordInput} />
          <TouchableOpacity onPress={addKeyword} style={styles.addBtn}><Text style={styles.addBtnText}>+</Text></TouchableOpacity>
        </View>
        <View style={styles.tagCloud}>
          {keywords.map((k, i) => (
            <TouchableOpacity key={i} onPress={() => removeKeyword(i)} style={styles.tag}><Text style={styles.tagText}>{k} ✕</Text></TouchableOpacity>
          ))}
        </View>
      </View>

      <View style={styles.card}>
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          {parsedPhotos.map((p, i) => (
            <View key={i}>
              <Image source={{ uri: p.uri }} style={styles.diaryImage} />
              {p.comment ? <Text style={styles.photoCommentBadge}>💬</Text> : null}
            </View>
          ))}
          <TouchableOpacity style={styles.addImageBtn} onPress={() => router.back()}>
            <Text style={{color: '#888'}}>+ 사진수정</Text>
          </TouchableOpacity>
        </ScrollView>
      </View>

      <TouchableOpacity style={styles.aiBtn} onPress={generateAIReport}>
        <Text style={styles.aiBtnText}>AI로 일기 써주기</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#fff" },
  headerContainer: { paddingHorizontal: 20, paddingTop: 60, paddingBottom: 15 },
  headerTitle: { fontSize: 28, fontWeight: "600", color: "#888", marginBottom: 12 },
  headerLine: { height: 1, backgroundColor: "#EEE", width: "100%" },
  dateSection: { paddingHorizontal: 20, marginTop: 15 },
  dateText: { fontSize: 20, fontWeight: "bold", marginBottom: 15 },
  infoRow: { flexDirection: "row", flexWrap: "wrap", gap: 8 },
  infoBadge: { backgroundColor: "#DDF2EB", paddingHorizontal: 12, paddingVertical: 6, borderRadius: 20 },
  infoText: { color: "#4A705F", fontWeight: "600", fontSize: 13 },
  moodRow: { flexDirection: "row", justifyContent: "space-around", padding: 20 },
  moodItem: { padding: 5, borderRadius: 25 },
  selectedMood: { backgroundColor: "#C8E6C9" },
  moodImg: { width: 45, height: 45 },
  card: { backgroundColor: "#fff", marginHorizontal: 20, marginVertical: 10, padding: 18, borderRadius: 20, 
          borderWidth: 1, borderColor: '#F0F0F0', elevation: 2 },
  title: { fontSize: 16, fontWeight: "bold", marginBottom: 15 },
  inputRow: { flexDirection: "row", alignItems: "center", backgroundColor: "#F5F5F5", borderRadius: 10, paddingHorizontal: 12, marginBottom: 15 },
  keywordInput: { flex: 1, height: 45 },
  addBtnText: { fontSize: 24, color: "#6FAF8F" },
  tagCloud: { flexDirection: "row", flexWrap: "wrap", gap: 8 },
  tag: { backgroundColor: "#E8F5E9", paddingHorizontal: 12, paddingVertical: 6, borderRadius: 15 },
  tagText: { color: "#4A705F", fontSize: 13 },
  diaryImage: { width: 120, height: 120, borderRadius: 15, marginRight: 10 },
  photoCommentBadge: { position: 'absolute', right: 15, top: 5, backgroundColor: '#fff', borderRadius: 10, padding: 2 },
  addImageBtn: { width: 120, height: 120, backgroundColor: "#F5F5F5", justifyContent: "center", alignItems: "center", borderRadius: 15, borderStyle: 'dashed', borderWidth: 1, borderColor: '#CCC' },
  aiBtn: { backgroundColor: "#000", marginHorizontal: 20, marginVertical: 20, padding: 18, borderRadius: 30, alignItems: "center" },
  aiBtnText: { color: "#fff", fontWeight: "bold", fontSize: 16 },
  loadingContainer: { flex: 1, justifyContent: "center", alignItems: "center", backgroundColor: "#fff" },
  aiIcon: { width: 150, height: 150, marginBottom: 20 },
  loadingText: { textAlign: "center", fontSize: 17, lineHeight: 26, marginBottom: 30, fontWeight: "500" },
  keywordBubbleContainer: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'center', gap: 8, marginBottom: 20, paddingHorizontal: 30 },
  loadingTag: { backgroundColor: '#E8F5E9', paddingHorizontal: 12, paddingVertical: 6, borderRadius: 15 },
  aiContentInput: { fontSize: 15, lineHeight: 24, color: "#444", backgroundColor: '#F9F9F9', borderRadius: 15, padding: 15, minHeight: 120, textAlignVertical: 'top' },
  resultHeader: { paddingHorizontal: 20, paddingTop: 60, paddingBottom: 20, alignItems: 'center' },
  resultTitle: { fontSize: 22, fontWeight: "bold" },
  sliderContainer: { width: width, alignItems: 'center' },
  slideItem: { width: width, alignItems: 'center', paddingHorizontal: 20 },
  resultMainImage: { width: width - 40, height: 250, borderRadius: 20 },
  resultCommentBox: { marginTop: 10, paddingHorizontal: 15, paddingVertical: 8, backgroundColor: '#F9F9F9', borderRadius: 10 },
  resultCommentText: { color: '#666', fontSize: 14, fontStyle: 'italic' },
  photoCountText: { marginTop: 5, color: '#AAA', fontSize: 12 },
  resultInfoRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 10 },
  resultMoodIcon: { width: 35, height: 35 },
  buttonRow: { flexDirection: "row", justifyContent: "space-between", marginTop: 20, gap: 10 },
  retryBtn: { flex: 1, backgroundColor: "#F5F5F5", padding: 16, borderRadius: 15, alignItems: "center" },
  retryBtnText: { color: "#666", fontWeight: "bold" },
  saveBtn: { flex: 1, backgroundColor: "#DDF2EB", padding: 16, borderRadius: 15, alignItems: "center" },
  saveBtnText: { color: "#4A705F", fontWeight: "bold" },
});