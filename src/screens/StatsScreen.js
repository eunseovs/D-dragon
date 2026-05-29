import { useState } from 'react';
import {
  View, Text, ScrollView, TouchableOpacity,
  StyleSheet,
  KeyboardAvoidingView, Platform,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useTodos } from '../contexts/TodoContext';

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

  const buildInsight = () => {
    if (totalCount === 0) {
      setAiInsight('이번 달에는 아직 등록된 일정이 없어요. 먼저 할 일을 추가하면 카테고리별 집중도와 완료 흐름을 바로 볼 수 있습니다.');
      return;
    }

    const best = [...qStats].sort((a, b) => b.rate - a.rate)[0];
    const weakest = [...qStats].sort((a, b) => a.rate - b.rate)[0];
    const trendText = diff >= 0 ? `전월보다 ${diff}개 더 완료했어요.` : `전월보다 ${Math.abs(diff)}개 적게 완료했어요.`;
    const completionText = completionRate >= 70
      ? '전체적으로 일정 처리 리듬이 꽤 안정적입니다.'
      : '중요한 일정부터 우선순위를 다시 세우면 흐름이 더 좋아질 수 있어요.';

    setAiInsight(
      `${trendText} ${completionText} ${best.label} 영역은 완료율 ${best.rate}%로 가장 잘 관리되고 있고, ${weakest.label} 영역은 ${weakest.rate}%라 다음 달에 보완 여지가 있어요.`
    );
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

        <View style={styles.sectionRow}>
          <Text style={styles.sectionTitle}>월간 통계</Text>
          <TouchableOpacity style={styles.geminiBtn} onPress={buildInsight}>
            <Text style={styles.geminiBtnText}>요약 갱신</Text>
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

        <Text style={styles.sectionTitle2}>AI 요약</Text>
        <View style={styles.insightCard}>
          <View style={styles.insightTitleRow}>
            <Ionicons name="sparkles" size={15} color="#3A9E6A" />
            <Text style={styles.insightTitle}>AI 일정 인사이트</Text>
          </View>
          {aiInsight ? (
            <Text style={styles.insightText}>{aiInsight}</Text>
          ) : (
            <Text style={styles.insightPlaceholder}>
              위의 '요약 갱신' 버튼을 눌러{'\n'}이번 달 일정 흐름을 정리해보세요.
            </Text>
          )}
        </View>

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
});
