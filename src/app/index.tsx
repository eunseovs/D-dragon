import React, { useState } from 'react'; // useState 추가!
import { SafeAreaView, StyleSheet, View } from 'react-native';

import DateHeader from '../components/header/DateHeader';
import ModeSwitch from '../components/header/ModeSwitch';
import MatrixGrid from '../components/matrix/MatrixGrid';
import CalendarView from '../components/calendar/CalendarView'; // 새로 만든 달력 가져오기

export default function HomeScreen() {
  // 화면 상태 관리 (false: 매트릭스, true: 캘린더)
  const [isCalendarMode, setIsCalendarMode] = useState(false);

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        
        {/* 상단 헤더는 항상 표시 */}
        <DateHeader />

        {/* 조건부 렌더링: 캘린더 모드냐 아니냐에 따라 다른 화면을 보여줌 */}
        {isCalendarMode ? (
          // 1. 캘린더 모드일 때
          <CalendarView onBack={() => setIsCalendarMode(false)} />
        ) : (
          // 2. 기본 매트릭스 모드일 때
          <>
            <ModeSwitch onSwitchToCalendar={() => setIsCalendarMode(true)} />
            <MatrixGrid />
          </>
        )}

      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#fff',
  },
  container: {
    flex: 1,
  },
});