import { useState } from 'react';
import {
  View, Text, ScrollView, TouchableOpacity,
  StyleSheet, ActivityIndicator, TextInput,
  KeyboardAvoidingView, Platform,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useTodos } from '../contexts/TodoContext';

// https://aistudio.google.com/app/apikey 에서 발급받은 키를 입력하거나
// 앱 내 입력창에서 입력하세요.
const DEFAULT_API_KEY = '';

const Q_CONFIG = [
  { key: 'DO',       label: 'DO',       barColor: '#3A9E6A' },
  { key: 'PLAN',     label: 'PLAN',     barColor: '#D95F5F' },
  { key: 'DELEGATE', label: 'DELEGATE', barColor: '#4A7FC1' },
  { key: 'DROP',     label: 'DROP',     barColor: '#D4913A' },
];

export default function StatsScreen() {
  const today = new Date();
  const { todos } = useTodos();

  const [year, setYear]       = useState(today.getFullYear());
  const [month, setMonth]     = useState(today.getMonth());
  const [aiInsight, setAiInsight] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [apiKey, setApiKey]   = useState(DEFAULT_API_KEY);
  const [editingKey, setEditingKey] = useState(!DEFAULT_API_KEY);

  const filterMonth = (y, m) =>
    todos.filter(t => {
      const d = new Date(t.date);
      return d.getFullYear() === y && d.getMonth() === m;
    });

  const monthTodos     = filterMonth(year, month);
  const completedCount = monthTodos.filter(t => t.completed).length;
  const totalCount     = monthTodos.length;
  const completionRate = totalCount > 0 ? Math.round((completedCount / totalCount) * 100) : 0;

  const prevY = month === 0 ? year - 1 : year;
  const prevM = month === 0 ? 11 : month - 1;
  const prevCompleted = filterMonth(prevY, prevM).filter(t => t.completed).length;
  const diff = completedCount - prevCompleted;

  const qStats = Q_CONFIG.map(q => {
    const items = monthTodos.filter(t => t.quadrant === q.key);
    const done  = items.filter(t => t.completed).length;
    const rate  = items.length > 0 ? Math.round((done / items.length) * 100) : 0;
    return { ...q, total: items.length, completed: done, rate };
  });

  const goToPrev = () => {
    if (month === 0) { setMonth(11); setYear(y => y - 1); } else setMonth(m => m - 1);
  };
  const goToNext = () => {
    if (month === 11) { setMonth(0); setYear(y => y + 1); } else setMonth(m => m + 1);
  };

  const callGemini = async () => {
    const key = apiKey.trim();
    if (!key) { setEditingKey(true); return; }

    setIsLoading(true);
    setAiInsight('');

    const prompt =
      `다음은 사용자의 ${year}년 ${month + 1}월 아이젠하워 매트릭스 앱 통계입니다:\n` +
      `총 할일 ${totalCount}개 중 ${completedCount}개 완료 (완료율 ${completionRate}%, 전월 대비 ${diff >= 0 ? '+' : ''}${diff}개)\n` +
      `카테고리별: DO ${qStats[0].rate}%, PLAN ${qStats[1].rate}%, DELEGATE ${qStats[2].rate}%, DROP ${qStats[3].rate}%\n\n` +
      `이 통계를 바탕으로 잘한 점과 개선할 점을 포함해 격려적인 인사이트를 한국어로 3~4문장으로 작성해주세요.`;

    try {
      const res = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${key}`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            contents: [{ parts: [{ text: prompt }] }],
            generationConfig: { temperature: 0.7, maxOutputTokens: 300 },
          }),
        }
      );
      if (!res.ok) throw new Error(`${res.status}`);
      const data = await res.json();
      const text = data.candidates?.[0]?.content?.parts?.[0]?.text;
      setAiInsight(text ?? '분석 결과를 받아오지 못했습니다.');
    } catch {
      setAiInsight('오류가 발생했습니다. API 키와 네트워크 연결을 확인해주세요.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.safe} edges={['top', 'left', 'right']}>

      <View style={styles.header}>
        <TouchableOpacity onPress={goToPrev} style={styles.arrowBtn}>
          <Ionicons name="chevron-back" size={22} color="#555" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>{year}년 {month + 1}월</Text>
        <TouchableOpacity onPress={goToNext} style={styles.arrowBtn}>
          <Ionicons name="chevron-forward" size={22} color="#555" />
        </TouchableOpacity>
      </View>

      <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
      <ScrollView contentContainerStyle={styles.scroll} keyboardShouldPersistTaps="handled" keyboardDismissMode="on-drag">

        {editingKey && (
          <View style={styles.keyCard}>
            <Text style={styles.keyCardTitle}>Gemini API 키 설정</Text>
            <Text style={styles.keyCardHint}>aistudio.google.com/app/apikey 에서 발급</Text>
            <View style={styles.keyRow}>
              <TextInput
                style={styles.keyInput}
                placeholder="API 키를 입력하세요"
                placeholderTextColor="#BBB"
                value={apiKey}
                onChangeText={setApiKey}
                autoCapitalize="none"
                secureTextEntry
              />
              <TouchableOpacity
                style={[styles.keySaveBtn, !apiKey.trim() && styles.keySaveBtnDisabled]}
                onPress={() => { if (apiKey.trim()) setEditingKey(false); }}
              >
                <Text style={styles.keySaveText}>저장</Text>
              </TouchableOpacity>
            </View>
          </View>
        )}

        <View style={styles.sectionRow}>
          <Text style={styles.sectionTitle}>월간 통계</Text>
          <TouchableOpacity
            style={[styles.geminiBtn, isLoading && { opacity: 0.6 }]}
            onPress={callGemini}
            disabled={isLoading}
          >
            <Text style={styles.geminiBtnText}>✦ Gemini AI</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.statsRow}>
          <View style={styles.statsMain}>
            <Text style={styles.statsMainNum}>{completedCount}</Text>
            <Text style={styles.statsMainLabel}>tasks completed</Text>
            <Text style={styles.statsDiff}>
              전월 대비 {diff >= 0 ? `+${diff}` : `${diff}`}개
            </Text>
          </View>
          <View style={styles.statsRight}>
            <View style={styles.statsSub}>
              <Text style={styles.statsSubNumRed}>0</Text>
              <Text style={styles.statsSubLabel}>일기 기록일</Text>
            </View>
            <View style={styles.statsSub}>
              <Text style={styles.statsSubNumBlue}>{completionRate}%</Text>
              <Text style={styles.statsSubLabel}>완료율</Text>
            </View>
          </View>
        </View>

        <Text style={styles.sectionTitle2}>카테고리별 완료율</Text>
        <View style={styles.categoryCard}>
          {qStats.map((q, i) => (
            <View
              key={q.key}
              style={[styles.catRow, i < qStats.length - 1 && styles.catRowDivider]}
            >
              <Text style={[styles.catLabel, { color: q.barColor }]}>{q.label}</Text>
              <View style={styles.barBg}>
                <View style={[styles.barFill, { width: `${q.rate}%`, backgroundColor: q.barColor }]} />
              </View>
              <Text style={styles.catRate}>{q.rate}%</Text>
            </View>
          ))}
        </View>

        <Text style={styles.sectionTitle2}>AI 일정 분석</Text>
        <View style={styles.insightCard}>
          <View style={styles.insightTitleRow}>
            <Ionicons name="sparkles" size={15} color="#3A9E6A" />
            <Text style={styles.insightTitle}>Gemini 인사이트</Text>
          </View>
          {isLoading ? (
            <View style={styles.loadingRow}>
              <ActivityIndicator color="#3A9E6A" size="small" />
              <Text style={styles.loadingText}>분석 중...</Text>
            </View>
          ) : aiInsight ? (
            <Text style={styles.insightText}>{aiInsight}</Text>
          ) : (
            <Text style={styles.insightPlaceholder}>
              위의 'Gemini AI' 버튼을 눌러{'\n'}이번 달 일정을 분석해보세요.
            </Text>
          )}
        </View>

        {!editingKey && (
          <TouchableOpacity onPress={() => setEditingKey(true)} style={styles.changeKeyBtn}>
            <Text style={styles.changeKeyText}>API 키 변경</Text>
          </TouchableOpacity>
        )}

      </ScrollView>
      </KeyboardAvoidingView>

    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: '#F4F4F4' },

  header: {
    flexDirection: 'row', alignItems: 'center',
    paddingVertical: 14, paddingHorizontal: 8,
    backgroundColor: '#FFF',
    borderBottomWidth: 1, borderBottomColor: '#F0F0F0',
  },
  arrowBtn:    { padding: 10 },
  headerTitle: { flex: 1, textAlign: 'center', fontSize: 18, fontWeight: '700', color: '#222' },

  scroll: { paddingHorizontal: 18, paddingTop: 20, paddingBottom: 32 },

  keyCard: {
    backgroundColor: '#FFF', borderRadius: 14, padding: 16, marginBottom: 20,
    shadowColor: '#000', shadowOpacity: 0.06, shadowRadius: 6, shadowOffset: { width: 0, height: 2 }, elevation: 2,
  },
  keyCardTitle: { fontSize: 15, fontWeight: '700', color: '#222', marginBottom: 4 },
  keyCardHint:  { fontSize: 12, color: '#AAA', marginBottom: 12 },
  keyRow:       { flexDirection: 'row', gap: 8 },
  keyInput:     { flex: 1, height: 44, backgroundColor: '#F2F2F2', borderRadius: 10, paddingHorizontal: 14, fontSize: 14, color: '#333' },
  keySaveBtn:         { height: 44, paddingHorizontal: 18, backgroundColor: '#3A9E6A', borderRadius: 10, justifyContent: 'center', alignItems: 'center' },
  keySaveBtnDisabled: { opacity: 0.4 },
  keySaveText:        { color: '#FFF', fontWeight: '700', fontSize: 14 },

  sectionRow:   { flexDirection: 'row', alignItems: 'center', marginBottom: 14 },
  sectionTitle: { flex: 1, fontSize: 18, fontWeight: '700', color: '#222' },
  geminiBtn:    { backgroundColor: '#EAF7EE', paddingHorizontal: 14, paddingVertical: 7, borderRadius: 20 },
  geminiBtnText:{ fontSize: 13, fontWeight: '700', color: '#3A9E6A' },

  statsRow: { flexDirection: 'row', gap: 12, marginBottom: 24, height: 140 },
  statsMain: {
    flex: 1.3, backgroundColor: '#FFF', borderRadius: 18, padding: 18, justifyContent: 'center',
    shadowColor: '#000', shadowOpacity: 0.06, shadowRadius: 6, shadowOffset: { width: 0, height: 2 }, elevation: 2,
  },
  statsMainNum:   { fontSize: 40, fontWeight: '800', color: '#222', lineHeight: 46 },
  statsMainLabel: { fontSize: 13, color: '#888', marginTop: 2 },
  statsDiff:      { fontSize: 12, color: '#888', marginTop: 6 },
  statsRight:     { flex: 1, gap: 12 },
  statsSub: {
    flex: 1, backgroundColor: '#FFF', borderRadius: 18, paddingHorizontal: 14, justifyContent: 'center',
    shadowColor: '#000', shadowOpacity: 0.06, shadowRadius: 6, shadowOffset: { width: 0, height: 2 }, elevation: 2,
  },
  statsSubNumRed:  { fontSize: 22, fontWeight: '800', color: '#D95F5F' },
  statsSubNumBlue: { fontSize: 22, fontWeight: '800', color: '#4A7FC1' },
  statsSubLabel:   { fontSize: 12, color: '#888', marginTop: 2 },

  sectionTitle2: { fontSize: 16, fontWeight: '700', color: '#222', marginBottom: 12 },

  categoryCard: {
    backgroundColor: '#FFF', borderRadius: 18, paddingHorizontal: 18, marginBottom: 24,
    shadowColor: '#000', shadowOpacity: 0.06, shadowRadius: 6, shadowOffset: { width: 0, height: 2 }, elevation: 2,
  },
  catRow:        { flexDirection: 'row', alignItems: 'center', paddingVertical: 14, gap: 10 },
  catRowDivider: { borderBottomWidth: 1, borderBottomColor: '#F4F4F4' },
  catLabel:      { width: 72, fontSize: 13, fontWeight: '700' },
  barBg:         { flex: 1, height: 8, backgroundColor: '#F0F0F0', borderRadius: 4, overflow: 'hidden' },
  barFill:       { height: '100%', borderRadius: 4 },
  catRate:       { width: 40, textAlign: 'right', fontSize: 13, fontWeight: '600', color: '#555' },

  insightCard: {
    backgroundColor: '#FFF', borderRadius: 18, padding: 18, marginBottom: 16,
    shadowColor: '#000', shadowOpacity: 0.06, shadowRadius: 6, shadowOffset: { width: 0, height: 2 }, elevation: 2,
  },
  insightTitleRow: { flexDirection: 'row', alignItems: 'center', gap: 6, marginBottom: 12 },
  insightTitle:    { fontSize: 15, fontWeight: '700', color: '#222' },
  insightText:     { fontSize: 14, color: '#444', lineHeight: 22 },
  insightPlaceholder: { fontSize: 14, color: '#AAA', lineHeight: 22, textAlign: 'center', paddingVertical: 12 },
  loadingRow:  { flexDirection: 'row', alignItems: 'center', gap: 10, paddingVertical: 8 },
  loadingText: { fontSize: 14, color: '#888' },

  changeKeyBtn: { alignItems: 'center', paddingVertical: 8 },
  changeKeyText:{ fontSize: 13, color: '#AAAAAA' },
});
