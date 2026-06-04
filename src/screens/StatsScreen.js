import { useEffect, useState } from 'react';
import {
  View, Text, ScrollView, TouchableOpacity,
  StyleSheet,
  KeyboardAvoidingView, Platform,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useTodos } from '../contexts/TodoContext';
import { useDiaries } from '../contexts/DiaryContext';
import { useSelectedDate } from '../contexts/SelectedDateContext';

const Q_CONFIG = [
  { key: 'DO', label: 'DO', barColor: '#3A9E6A' },
  { key: 'PLAN', label: 'PLAN', barColor: '#D95F5F' },
  { key: 'DELEGATE', label: 'DELEGATE', barColor: '#4A7FC1' },
  { key: 'DROP', label: 'DROP', barColor: '#D4913A' },
];

const EMOTION_META = {
  '😊': { bucket: 'positive', score: 2 },
  '😎': { bucket: 'positive', score: 2 },
  '😌': { bucket: 'calm', score: 1 },
  '😤': { bucket: 'negative', score: -1 },
  '😡': { bucket: 'negative', score: -2 },
};

const parseLocalDate = (value) => {
  if (!value) return null;
  if (value instanceof Date) return new Date(value.getFullYear(), value.getMonth(), value.getDate());
  if (typeof value === 'string') {
    const match = value.match(/^(\d{4})-(\d{2})-(\d{2})$/);
    if (match) {
      return new Date(Number(match[1]), Number(match[2]) - 1, Number(match[3]));
    }
  }
  const parsed = new Date(value);
  if (Number.isNaN(parsed.getTime())) return null;
  return new Date(parsed.getFullYear(), parsed.getMonth(), parsed.getDate());
};

const formatDateLabel = (date) =>
  `${date.getMonth() + 1}월 ${date.getDate()}일`;

export default function StatsScreen() {
  const { selectedDate } = useSelectedDate();
  const { todos } = useTodos();
  const { diaries } = useDiaries();

  const [year, setYear] = useState(selectedDate.getFullYear());
  const [month, setMonth] = useState(selectedDate.getMonth());
  const [aiInsight, setAiInsight] = useState('');

  useEffect(() => {
    setYear(selectedDate.getFullYear());
    setMonth(selectedDate.getMonth());
  }, [selectedDate]);

  const filterMonth = (y, m) =>
    todos.filter(t => {
      const d = parseLocalDate(t.date);
      return d && d.getFullYear() === y && d.getMonth() === m;
    });

  const filterDiaryMonth = (y, m) =>
    diaries.filter(diary => {
      const d = parseLocalDate(diary.date);
      return d && d.getFullYear() === y && d.getMonth() === m;
    });

  const monthTodos = filterMonth(year, month);
  const monthDiaries = filterDiaryMonth(year, month);
  const completedCount = monthTodos.filter(t => t.completed).length;
  const totalCount = monthTodos.length;
  const completionRate = totalCount > 0 ? Math.round((completedCount / totalCount) * 100) : 0;

  const prevY = month === 0 ? year - 1 : year;
  const prevM = month === 0 ? 11 : month - 1;
  const prevCompleted = filterMonth(prevY, prevM).filter(t => t.completed).length;
  const prevDiaryCount = filterDiaryMonth(prevY, prevM).length;
  const diff = completedCount - prevCompleted;
  const diaryDiff = monthDiaries.length - prevDiaryCount;

  const qStats = Q_CONFIG.map(q => {
    const items = monthTodos.filter(t => t.quadrant === q.key);
    const done = items.filter(t => t.completed).length;
    const rate = items.length > 0 ? Math.round((done / items.length) * 100) : 0;
    return { ...q, total: items.length, completed: done, rate };
  });

  const weekEnd = parseLocalDate(selectedDate) ?? new Date();
  const weekStart = new Date(weekEnd);
  weekStart.setDate(weekEnd.getDate() - 6);
  const weekDiaries = diaries
    .filter(diary => {
      const date = parseLocalDate(diary.date);
      return date && date >= weekStart && date <= weekEnd;
    })
    .sort((a, b) => (parseLocalDate(a.date)?.getTime() ?? 0) - (parseLocalDate(b.date)?.getTime() ?? 0));

  const weeklyMood = weekDiaries.reduce((acc, diary) => {
    const meta = EMOTION_META[diary.emotion];
    if (!meta) return acc;
    acc.score += meta.score;
    acc[meta.bucket] += 1;
    return acc;
  }, { positive: 0, negative: 0, calm: 0, score: 0 });

  const weeklyCharacters = weekDiaries.reduce((sum, diary) => sum + (diary.text?.trim().length ?? 0), 0);
  const weeklySummary = (() => {
    if (weekDiaries.length === 0) {
      return '최근 1주일 기록이 아직 없어요. 하루 한 줄씩만 적어도 감정 흐름을 보기 쉬워져요.';
    }
    if (weeklyMood.negative >= weeklyMood.positive + 2) {
      return '최근 1주일은 답답하거나 지친 감정이 조금 더 많이 남아 있어요. 무리한 일정이 있었는지 돌아보면 좋아요.';
    }
    if (weeklyMood.positive > weeklyMood.negative) {
      return '최근 1주일은 기쁘거나 만족스러운 날이 더 많았어요. 좋은 흐름이 이어지고 있어요.';
    }
    if (weeklyMood.calm >= weeklyMood.positive && weeklyMood.calm >= weeklyMood.negative) {
      return '최근 1주일은 비교적 차분하게 흘렀어요. 일상의 리듬이 안정적인 편이에요.';
    }
    return '최근 1주일 감정은 긍정과 긴장이 섞여 있었어요. 기록 수가 더 쌓이면 흐름이 더 또렷하게 보여요.';
  })();

  const goToPrev = () => {
    if (month === 0) { setMonth(11); setYear(y => y - 1); } else setMonth(m => m - 1);
  };
  const goToNext = () => {
    if (month === 11) { setMonth(0); setYear(y => y + 1); } else setMonth(m => m + 1);
  };

  const buildInsight = () => {
    if (totalCount === 0 && weekDiaries.length === 0) {
      setAiInsight('아직 이번 달 완료한 할 일이나 최근 1주 일기 기록이 없어요. 기록이 쌓이면 일정과 감정 흐름을 함께 볼 수 있어요.');
      return;
    }

    const completedText = totalCount > 0
      ? `이번 달에는 할 일 ${totalCount}개 중 ${completedCount}개를 완료해서 완료율은 ${completionRate}%예요. ${diff >= 0 ? `전월보다 ${diff}개 더 완료했어요.` : `전월보다 ${Math.abs(diff)}개 적게 완료했어요.`}`
      : '이번 달 완료한 할 일 기록은 아직 없어요.';

    const weeklyText = weekDiaries.length > 0
      ? `최근 1주 일기를 보면 ${weeklySummary}`
      : '최근 1주 일기 기록은 아직 없어요.';

    setAiInsight(`${completedText} ${weeklyText}`.trim());
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
                <Text style={styles.statsSubNumRed}>{monthDiaries.length}</Text>
                <Text style={styles.statsSubLabel}>일기 기록일</Text>
              </View>
              <View style={styles.statsSub}>
                <Text style={styles.statsSubNumBlue}>{completionRate}%</Text>
                <Text style={styles.statsSubLabel}>완료율</Text>
              </View>
            </View>
          </View>

          <Text style={styles.sectionTitle2}>최근 1주 감정 흐름</Text>
          <View style={styles.weeklyCard}>
            <Text style={styles.weeklyRange}>
              {formatDateLabel(weekStart)} - {formatDateLabel(weekEnd)}
            </Text>
            <View style={styles.weeklyStatsRow}>
              <View style={styles.weeklyStatChip}>
                <Text style={styles.weeklyStatValue}>{weekDiaries.length}</Text>
                <Text style={styles.weeklyStatLabel}>기록일</Text>
              </View>
              <View style={styles.weeklyStatChip}>
                <Text style={styles.weeklyStatValue}>{weeklyMood.positive}</Text>
                <Text style={styles.weeklyStatLabel}>긍정</Text>
              </View>
              <View style={styles.weeklyStatChip}>
                <Text style={styles.weeklyStatValue}>{weeklyMood.negative}</Text>
                <Text style={styles.weeklyStatLabel}>긴장</Text>
              </View>
              <View style={styles.weeklyStatChip}>
                <Text style={styles.weeklyStatValue}>{weeklyMood.calm}</Text>
                <Text style={styles.weeklyStatLabel}>안정</Text>
              </View>
            </View>
            <Text style={styles.weeklySummary}>{weeklySummary}</Text>
            <Text style={styles.weeklyCaption}>
              일기 글자 수 {weeklyCharacters}자 · 선택한 날짜 기준 최근 7일 분석
            </Text>
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
                위의 '요약 갱신' 버튼을 눌러{'\n'}완료량과 최근 1주 일기 분위기를 확인해보세요.
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
  arrowBtn: { padding: 10 },
  headerTitle: { flex: 1, textAlign: 'center', fontSize: 18, fontWeight: '700', color: '#222' },

  scroll: { paddingHorizontal: 18, paddingTop: 20, paddingBottom: 32 },

  sectionRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 14 },
  sectionTitle: { flex: 1, fontSize: 18, fontWeight: '700', color: '#222' },
  geminiBtn: { backgroundColor: '#EAF7EE', paddingHorizontal: 14, paddingVertical: 7, borderRadius: 20 },
  geminiBtnText: { fontSize: 13, fontWeight: '700', color: '#3A9E6A' },

  statsRow: { flexDirection: 'row', gap: 12, marginBottom: 24, height: 140 },
  statsMain: {
    flex: 1.3, backgroundColor: '#FFF', borderRadius: 18, padding: 18, justifyContent: 'center',
    shadowColor: '#000', shadowOpacity: 0.06, shadowRadius: 6, shadowOffset: { width: 0, height: 2 }, elevation: 2,
  },
  statsMainNum: { fontSize: 40, fontWeight: '800', color: '#222', lineHeight: 46 },
  statsMainLabel: { fontSize: 13, color: '#888', marginTop: 2 },
  statsDiff: { fontSize: 12, color: '#888', marginTop: 6 },
  statsRight: { flex: 1, gap: 12 },
  statsSub: {
    flex: 1, backgroundColor: '#FFF', borderRadius: 18, paddingHorizontal: 14, justifyContent: 'center',
    shadowColor: '#000', shadowOpacity: 0.06, shadowRadius: 6, shadowOffset: { width: 0, height: 2 }, elevation: 2,
  },
  statsSubNumRed: { fontSize: 22, fontWeight: '800', color: '#D95F5F' },
  statsSubNumBlue: { fontSize: 22, fontWeight: '800', color: '#4A7FC1' },
  statsSubLabel: { fontSize: 12, color: '#888', marginTop: 2 },

  weeklyCard: {
    backgroundColor: '#FFF', borderRadius: 18, padding: 18, marginBottom: 24,
    shadowColor: '#000', shadowOpacity: 0.06, shadowRadius: 6, shadowOffset: { width: 0, height: 2 }, elevation: 2,
  },
  weeklyRange: { fontSize: 13, fontWeight: '700', color: '#6F7F77', marginBottom: 12 },
  weeklyStatsRow: { flexDirection: 'row', gap: 8, marginBottom: 12 },
  weeklyStatChip: {
    flex: 1,
    backgroundColor: '#F8FAF9',
    borderRadius: 14,
    paddingVertical: 12,
    alignItems: 'center',
  },
  weeklyStatValue: { fontSize: 20, fontWeight: '800', color: '#22342A' },
  weeklyStatLabel: { fontSize: 11, color: '#7B8A82', marginTop: 4 },
  weeklySummary: { fontSize: 14, lineHeight: 22, color: '#3F4D46', marginBottom: 8 },
  weeklyCaption: { fontSize: 12, color: '#8A9891' },

  sectionTitle2: { fontSize: 16, fontWeight: '700', color: '#222', marginBottom: 12 },

  categoryCard: {
    backgroundColor: '#FFF', borderRadius: 18, paddingHorizontal: 18, marginBottom: 24,
    shadowColor: '#000', shadowOpacity: 0.06, shadowRadius: 6, shadowOffset: { width: 0, height: 2 }, elevation: 2,
  },
  catRow: { flexDirection: 'row', alignItems: 'center', paddingVertical: 14, gap: 10 },
  catRowDivider: { borderBottomWidth: 1, borderBottomColor: '#F4F4F4' },
  catLabel: { width: 72, fontSize: 13, fontWeight: '700' },
  barBg: { flex: 1, height: 8, backgroundColor: '#F0F0F0', borderRadius: 4, overflow: 'hidden' },
  barFill: { height: '100%', borderRadius: 4 },
  catRate: { width: 40, textAlign: 'right', fontSize: 13, fontWeight: '600', color: '#555' },

  insightCard: {
    backgroundColor: '#FFF', borderRadius: 18, padding: 18, marginBottom: 16,
    shadowColor: '#000', shadowOpacity: 0.06, shadowRadius: 6, shadowOffset: { width: 0, height: 2 }, elevation: 2,
  },
  insightTitleRow: { flexDirection: 'row', alignItems: 'center', gap: 6, marginBottom: 12 },
  insightTitle: { fontSize: 15, fontWeight: '700', color: '#222' },
  insightText: { fontSize: 14, color: '#444', lineHeight: 22 },
  insightPlaceholder: { fontSize: 14, color: '#AAA', lineHeight: 22, textAlign: 'center', paddingVertical: 12 },
});
