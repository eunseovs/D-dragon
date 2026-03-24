import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import { SafeAreaView, StatusBar, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';

export default function LoginInputScreen() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" />
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}>
          <Ionicons name="chevron-back" size={28} color="black" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>로그인</Text>
        <View style={{ width: 28 }} />
      </View>

      <View style={styles.content}>
        <TextInput
          style={styles.input}
          placeholder="이메일 입력"
          value={email}
          onChangeText={setEmail}
          placeholderTextColor="#999"
        />
        <TextInput
          style={[styles.input, { marginTop: 15 }]}
          placeholder="비밀번호 입력"
          value={password}
          onChangeText={setPassword}
          secureTextEntry
          placeholderTextColor="#999"
        />
        <TouchableOpacity 
          style={styles.confirmButton}
          onPress={() => router.replace('/(tabs)')}
        >
          <Text style={styles.confirmButtonText}>확인</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#FFEDEC' },
  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 20, height: 60 },
  headerTitle: { fontSize: 20, fontWeight: 'bold' },
  content: { flex: 1, paddingHorizontal: 30, paddingTop: 50, alignItems: 'center' },
  input: { width: '100%', backgroundColor: '#D9D9D9', height: 60, borderRadius: 15, paddingHorizontal: 20, fontSize: 16 },
  confirmButton: { backgroundColor: '#8BC1AB', width: 120, height: 60, borderRadius: 30, justifyContent: 'center', alignItems: 'center', marginTop: 50 },
  confirmButtonText: { color: 'white', fontSize: 18, fontWeight: 'bold' },
});