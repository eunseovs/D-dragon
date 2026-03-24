import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

export default function CharacterScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.text}>🦸 내 캐릭터 화면입니다</Text>
      {/* 여기에 나중에 캐릭터 이미지나 레벨 등을 넣으면 됩니다 */}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { 
    flex: 1, 
    justifyContent: 'center', 
    alignItems: 'center',
    backgroundColor: '#fff',
  },
  text: { 
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333'
  },
});