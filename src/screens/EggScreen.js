import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';

export default function EggScreen({ navigation }) {
  const selectEgg = () => {
    navigation.navigate('Matrix');
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>알을 선택해주세요!</Text>
      
      <View style={styles.eggContainer}>
        <TouchableOpacity style={[styles.egg, {backgroundColor: '#FFD1D1'}]} onPress={selectEgg}>
          <Text style={styles.eggText}>알 1</Text>
        </TouchableOpacity>
        <TouchableOpacity style={[styles.egg, {backgroundColor: '#D1FFD1'}]} onPress={selectEgg}>
          <Text style={styles.eggText}>알 2</Text>
        </TouchableOpacity>
        <TouchableOpacity style={[styles.egg, {backgroundColor: '#D1D1FF'}]} onPress={selectEgg}>
          <Text style={styles.eggText}>알 3</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#FFEAEA', padding: 20 },
  title: { fontSize: 24, fontWeight: 'bold', color: '#888', marginBottom: 50 },
  eggContainer: { flexDirection: 'row', justifyContent: 'space-around', width: '100%' },
  egg: { width: 90, height: 120, borderRadius: 45, justifyContent: 'center', alignItems: 'center', borderWidth: 2, borderColor: '#ffffff', elevation: 3 },
  eggText: { fontWeight: 'bold', color: '#555' }
});