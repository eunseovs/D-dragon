import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Colors } from '../../constants/Colors';

// props로 '뒤로가기 함수'를 받습니다.
export default function CalendarView({ onBack }: { onBack: () => void }) {
  const days = ['일', '월', '화', '수', '목', '금', '토'];
  // 11월 예시 날짜 데이터 (빈칸 + 1~30일)
  const dates = [
    null, null, null, null, null, null, 1, 
    2, 3, 4, 5, 6, 7, 8, 
    9, 10, 11, 12, 13, 14, 15, 
    16, 17, 18, 19, 20, 21, 22, 
    23, 24, 25, 26, 27, 28, 29, 
    30
  ];

  return (
    <View style={styles.container}>
      {/* 1. 상단 날짜 및 뒤로가기 버튼 */}
      <View style={styles.header}>
        <Text style={styles.monthText}>2025년 11월</Text>
        <TouchableOpacity style={styles.backBtn} onPress={onBack}>
          <Ionicons name="chevron-back" size={16} color="#333" />
          <Text style={styles.backText}>매트릭스 보기</Text>
        </TouchableOpacity>
      </View>

      {/* 2. 요일 헤더 (일~토) */}
      <View style={styles.weekRow}>
        {days.map((day, idx) => (
          <Text key={idx} style={[styles.dayText, idx === 0 && { color: '#FF6B6B' }, idx === 6 && { color: '#4D96FF' }]}>
            {day}
          </Text>
        ))}
      </View>

      {/* 3. 날짜 그리드 */}
      <View style={styles.grid}>
        {dates.map((date, idx) => (
          <View key={idx} style={styles.dateCell}>
            {date && (
              <>
                <Text style={[
                  styles.dateNum, 
                  date === 12 && styles.selectedDateNum // 12일 선택 효과
                ]}>
                  {date}
                </Text>
                {/* 12일 선택 배경 효과 */}
                {date === 12 && <View style={styles.selectedBg} />}
                
                {/* 일정 점 표시 (예시) */}
                <View style={styles.dotContainer}>
                  {date === 3 && <View style={[styles.dot, { backgroundColor: Colors.urgentImportant }]} />}
                  {date === 7 && <View style={[styles.dot, { backgroundColor: Colors.urgent }]} />}
                  {date === 12 && <View style={[styles.dot, { backgroundColor: Colors.important }]} />}
                </View>
              </>
            )}
          </View>
        ))}
      </View>

      {/* 4. 하단 범례 */}
      <View style={styles.legendContainer}>
        <View style={styles.legendItem}>
            <View style={[styles.dot, { backgroundColor: Colors.urgentImportant }]} />
            <Text style={styles.legendText}>중요하고 급함</Text>
        </View>
        <View style={styles.legendItem}>
            <View style={[styles.dot, { backgroundColor: Colors.important }]} />
            <Text style={styles.legendText}>중요하지만 급하지 않음</Text>
        </View>
        <View style={styles.legendItem}>
            <View style={[styles.dot, { backgroundColor: Colors.urgent }]} />
            <Text style={styles.legendText}>급하지만 중요하지 않음</Text>
        </View>
        <View style={styles.legendItem}>
            <View style={[styles.dot, { backgroundColor: Colors.neither }]} />
            <Text style={styles.legendText}>급하지도 중요하지도 않음</Text>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff', paddingHorizontal: 16 },
  header: { alignItems: 'center', marginVertical: 20 },
  monthText: { fontSize: 18, marginBottom: 10, color: '#333' },
  backBtn: { flexDirection: 'row', alignItems: 'center', padding: 8, borderWidth: 1, borderColor: '#ddd', borderRadius: 20 },
  backText: { fontSize: 14, color: '#333', marginLeft: 4 },
  weekRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 10 },
  dayText: { width: 40, textAlign: 'center', fontSize: 14, color: '#333' },
  grid: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between' },
  dateCell: { width: 40, height: 50, alignItems: 'center', marginBottom: 10 },
  dateNum: { fontSize: 16, color: '#333', zIndex: 1 },
  selectedDateNum: { color: '#fff', fontWeight: 'bold' },
  selectedBg: { position: 'absolute', top: -4, width: 32, height: 32, borderRadius: 16, backgroundColor: '#4D96FF', zIndex: 0 },
  dotContainer: { flexDirection: 'row', gap: 2, marginTop: 4 },
  dot: { width: 6, height: 6, borderRadius: 3 },
  legendContainer: { marginTop: 20, flexDirection: 'row', flexWrap: 'wrap', gap: 15 },
  legendItem: { flexDirection: 'row', alignItems: 'center', width: '45%' },
  legendText: { fontSize: 11, color: '#333', marginLeft: 6 },
});