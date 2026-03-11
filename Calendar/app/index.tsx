import Checkbox from 'expo-checkbox';
import { useRouter } from 'expo-router';
import * as SecureStore from 'expo-secure-store';
import React, { useEffect, useState } from 'react';
import {
  ActivityIndicator,
  SafeAreaView,
  StyleSheet, Text,
  TextInput, TouchableOpacity,
  View
} from 'react-native';

export default function LoginScreen() {
  const router = useRouter();
  const [id, setId] = useState('');
  const [pw, setPw] = useState('');
  const [isAutoLogin, setAutoLogin] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    checkAutoLogin();
  }, []);

  const checkAutoLogin = async () => {
    try {
      const autoLoginEnabled = await SecureStore.getItemAsync('auto_login');
      const savedId = await SecureStore.getItemAsync('user_id');
      const savedPw = await SecureStore.getItemAsync('user_pw');

      if (autoLoginEnabled === 'true' && savedId && savedPw) {
        router.replace('/choose-egg');
      }
    } catch (e) {
      console.log('자동 로그인 체크 실패');
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogin = async () => {
    if (id && pw) {
      if (isAutoLogin) {
        await SecureStore.setItemAsync('auto_login', 'true');
        await SecureStore.setItemAsync('user_id', id);
        await SecureStore.setItemAsync('user_pw', pw);
      }
      router.push('/choose-egg');
    } else {
      alert('아이디와 비밀번호를 입력해주세요.');
    }
  };

  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#8BC1AB" />
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        <Text style={styles.title}>나만의 드래곤</Text>
        
        <View style={styles.inputContainer}>
          <TextInput style={styles.input} placeholder="아이디" value={id} onChangeText={setId} />
          <TextInput style={styles.input} placeholder="비밀번호" secureTextEntry value={pw} onChangeText={setPw} />
        </View>

        <View style={styles.autoLoginRow}>
          <Checkbox
            style={styles.checkbox}
            value={isAutoLogin}
            onValueChange={setAutoLogin}
            color={isAutoLogin ? '#8BC1AB' : undefined}
          />
          <TouchableOpacity onPress={() => setAutoLogin(!isAutoLogin)}>
            <Text style={styles.autoLoginText}>자동 로그인</Text>
          </TouchableOpacity>
        </View>

        <TouchableOpacity style={styles.loginButton} onPress={handleLogin}>
          <Text style={styles.loginButtonText}>로그인</Text>
        </TouchableOpacity>

        <View style={styles.subButtons}>
          <TouchableOpacity onPress={() => router.push('/signup')}>
            <Text style={styles.subText}>회원가입</Text>
          </TouchableOpacity>
          <Text style={styles.separatorText}> | </Text>
          <Text style={styles.subText}>아이디/비밀번호 찾기</Text>
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#FFEDEC' }, //
  loadingContainer: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#FFEDEC' },
  content: { flex: 1, justifyContent: 'center', alignItems: 'center', paddingHorizontal: 40 },
  title: { fontSize: 40, fontWeight: 'bold', color: '#444', marginBottom: 50 },
  inputContainer: { width: '100%', marginBottom: 10 },
  input: { width: '100%', height: 55, backgroundColor: 'white', borderRadius: 12, paddingHorizontal: 20, marginBottom: 12, elevation: 2 },
  autoLoginRow: { flexDirection: 'row', alignItems: 'center', alignSelf: 'flex-start', marginBottom: 20, marginLeft: 5 },
  checkbox: { marginRight: 8, width: 20, height: 20 },
  autoLoginText: { color: '#666', fontSize: 14 },
  loginButton: { width: '100%', height: 60, backgroundColor: '#8BC1AB', borderRadius: 12, justifyContent: 'center', alignItems: 'center' },
  loginButtonText: { color: 'white', fontSize: 18, fontWeight: 'bold' },
  subButtons: { flexDirection: 'row', marginTop: 25, alignItems: 'center' },
  subText: { color: '#888', fontSize: 14 },
  separatorText: { color: '#DDD', marginHorizontal: 15 },
});