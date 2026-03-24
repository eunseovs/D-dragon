import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

// ★ 여기 'export default'가 꼭 있어야 합니다!
export default function DateHeader() {
  return (
    <View style={styles.container}>
      <Text style={styles.mainTitle}>투두리스트</Text>
      <Text style={styles.dateText}>2025년 12월 2일</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
    backgroundColor: '#fff',
    alignItems: 'center',
  },
  mainTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  dateText: {
    fontSize: 16,
    color: '#666',
  }
});