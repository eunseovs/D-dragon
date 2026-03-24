import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import * as SecureStore from 'expo-secure-store';
import React, { useEffect, useRef, useState } from 'react';
import {
  Alert,
  Animated, Easing,
  Image,
  SafeAreaView,
  StyleSheet, Text,
  TouchableOpacity,
  View
} from 'react-native';

// 실제 존재하는 파일명으로 복구
const eggImage = require('../assets/images/dragon.png'); 

export default function ChooseEggScreen() {
  const router = useRouter();
  const [selectedEgg, setSelectedEgg] = useState<number | null>(null);
  const anims = useRef([new Animated.Value(0), new Animated.Value(0), new Animated.Value(0)]).current;

  const handleLogout = async () => {
    await SecureStore.deleteItemAsync('auto_login');
    await SecureStore.deleteItemAsync('user_id');
    await SecureStore.deleteItemAsync('user_pw');
    router.replace('/'); 
  };

  useEffect(() => {
    anims.forEach((anim, i) => {
      Animated.loop(
        Animated.sequence([
          Animated.delay(i * 300),
          Animated.timing(anim, { toValue: 1, duration: 1000, easing: Easing.inOut(Easing.sin), useNativeDriver: true }),
          Animated.timing(anim, { toValue: -1, duration: 1000, easing: Easing.inOut(Easing.sin), useNativeDriver: true }),
          Animated.timing(anim, { toValue: 0, duration: 1000, useNativeDriver: true }),
        ])
      ).start();
    });
  }, []);

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.topBar}>
        <TouchableOpacity onPress={handleLogout} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color="#444" />
          <Text style={styles.backText}>로그아웃</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.header}>
        <Text style={styles.titleText}>동반자 알을 선택하세요</Text>
      </View>

      <View style={styles.eggRow}>
        {[0, 1, 2].map((i) => {
          const rotation = anims[i].interpolate({
            inputRange: [-1, 0, 1],
            outputRange: ['-10deg', '0deg', '10deg'],
          });

          return (
            <TouchableOpacity key={i} onPress={() => setSelectedEgg(i)}>
              <Animated.View style={[
                styles.eggWrapper,
                selectedEgg === i && styles.selectedWrapper,
                { transform: [{ rotate: rotation }] }
              ]}>
                <Image source={eggImage} style={styles.eggImage} />
              </Animated.View>
            </TouchableOpacity>
          );
        })}
      </View>

      <TouchableOpacity 
        style={[styles.confirmButton, selectedEgg === null && styles.disabledButton]}
        disabled={selectedEgg === null}
        onPress={() => Alert.alert("선택 완료", `${selectedEgg! + 1}번 알을 선택하셨습니다!`)}
      >
        <Text style={styles.confirmButtonText}>이 알로 결정하기</Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#FFEDEC' },
  topBar: { padding: 20 },
  backButton: { flexDirection: 'row', alignItems: 'center' },
  backText: { marginLeft: 5, fontSize: 16, color: '#444' },
  header: { alignItems: 'center', marginTop: 10 },
  titleText: { fontSize: 24, fontWeight: 'bold', color: '#444' },
  eggRow: { flexDirection: 'row', justifyContent: 'center', marginTop: 80 },
  eggWrapper: { 
    width: 110, height: 110, marginHorizontal: 5, 
    justifyContent: 'center', alignItems: 'center',
    borderRadius: 20, borderWidth: 2, borderColor: 'transparent'
  },
  selectedWrapper: { borderColor: '#8BC1AB', backgroundColor: 'white' },
  eggImage: { width: 80, height: 80, resizeMode: 'contain' }, //
  confirmButton: { 
    backgroundColor: '#8BC1AB', width: '80%', height: 60, 
    borderRadius: 30, justifyContent: 'center', alignItems: 'center', 
    alignSelf: 'center', marginTop: 100 
  },
  disabledButton: { backgroundColor: '#CCC' },
  confirmButtonText: { color: 'white', fontSize: 18, fontWeight: 'bold' },
});