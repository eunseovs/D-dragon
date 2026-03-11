import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import {
  Alert,
  SafeAreaView,
  StatusBar,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View
} from 'react-native';

// 경로 에러를 방지하기 위해 .js 확장자까지 명시합니다.
// 만약 파일 위치를 밖으로 꺼냈다면 아래 경로가 맞습니다.
import { auth, db } from '../firebaseConfig.js';

import { createUserWithEmailAndPassword } from 'firebase/auth';
import { doc, setDoc } from 'firebase/firestore';

export default function SignupScreen() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isAgeAgreed, setIsAgeAgreed] = useState(false);
  const [isMarketingAgreed, setIsMarketingAgreed] = useState(false);

  const handleSignup = async () => {
    if (!email || !password) {
      Alert.alert("알림", "이메일과 비밀번호를 입력해주세요.");
      return;
    }
    if (!isAgeAgreed) {
      Alert.alert("알림", "필수 약관에 동의해주세요.");
      return;
    }

    try {
      // 1. 계정 생성
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      // 2. DB에 정보 저장
      await setDoc(doc(db, "users", user.uid), {
        email: email,
        marketingAgreed: isMarketingAgreed,
        createdAt: new Date(),
      });

      Alert.alert("성공", "회원가입이 완료되었습니다!");
      router.replace('/login'); 
    } catch (error: any) {
      console.log(error.message);
      if (error.code === 'auth/email-already-in-use') {
        Alert.alert("에러", "이미 가입된 이메일입니다.");
      } else {
        Alert.alert("에러", "파일 연결이나 네트워크를 확인해주세요.");
      }
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" />
      
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}>
          <Ionicons name="chevron-back" size={28} color="black" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>회원가입</Text>
        <View style={{ width: 28 }} />
      </View>

      <View style={styles.content}>
        <TextInput
          style={styles.input}
          placeholder="이메일 입력"
          value={email}
          onChangeText={setEmail}
          autoCapitalize="none"
        />

        <TextInput
          style={[styles.input, { marginTop: 15 }]}
          placeholder="비밀번호 입력"
          value={password}
          onChangeText={setPassword}
          secureTextEntry
        />

        <View style={styles.agreementSection}>
          <TouchableOpacity 
            style={styles.checkboxContainer} 
            onPress={() => setIsAgeAgreed(!isAgeAgreed)}
          >
            <View style={[styles.checkbox, isAgeAgreed && styles.checkboxChecked]} />
            <Text style={styles.agreementText}>
              <Text style={{color: 'red', fontWeight: 'bold'}}>필수</Text> | 만 14세 이상입니다.
            </Text>
          </TouchableOpacity>

          <TouchableOpacity 
            style={styles.checkboxContainer} 
            onPress={() => setIsMarketingAgreed(!isMarketingAgreed)}
          >
            <View style={[styles.checkbox, isMarketingAgreed && styles.checkboxChecked]} />
            <Text style={styles.agreementText}>선택 | 마케팅 정보 수신에 동의합니다.</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.buttonWrapper}>
          <TouchableOpacity style={styles.submitButton} onPress={handleSignup}>
            <Text style={styles.submitButtonText}>가입</Text>
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#FFEDEC' },
  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 20, height: 60 },
  headerTitle: { fontSize: 20, fontWeight: 'bold' },
  content: { flex: 1, paddingHorizontal: 30, paddingTop: 50 },
  input: { width: '100%', backgroundColor: '#D9D9D9', height: 60, borderRadius: 15, paddingHorizontal: 20, fontSize: 16 },
  agreementSection: { marginTop: 30 },
  checkboxContainer: { flexDirection: 'row', alignItems: 'center', marginBottom: 15 },
  checkbox: { width: 20, height: 20, backgroundColor: '#D9D9D9', borderRadius: 4, marginRight: 10 },
  checkboxChecked: { backgroundColor: '#8BC1AB' },
  agreementText: { fontSize: 14 },
  buttonWrapper: { flex: 1, justifyContent: 'flex-end', alignItems: 'center', marginBottom: 50 },
  submitButton: { backgroundColor: '#8BC1AB', paddingHorizontal: 60, paddingVertical: 18, borderRadius: 35, minWidth: 150, alignItems: 'center' },
  submitButtonText: { color: 'white', fontSize: 18, fontWeight: 'bold' },
});