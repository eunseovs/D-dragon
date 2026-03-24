import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';

// 부모(HomeScreen)에게 버튼 클릭을 알리기 위한 도구
interface Props {
  onSwitchToCalendar: () => void;
}

export default function ModeSwitch({ onSwitchToCalendar }: Props) {
  return (
    <View style={styles.buttonGroup}>
      <TouchableOpacity style={styles.modeBtn} onPress={onSwitchToCalendar}>
         <Text style={styles.btnText}>📅 캘린더전환</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.modeBtn}>
         <Text style={styles.btnText}>📖 일기쓰기</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  buttonGroup: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 10,
    marginTop: 10,
    marginBottom: 20,
  },
  modeBtn: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#ddd',
    backgroundColor: '#fff',
  },
  btnText: {
    fontSize: 14,
    color: '#333',
  }
});