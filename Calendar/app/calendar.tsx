import { useRouter } from 'expo-router';
import React from 'react';
import { SafeAreaView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { auth } from '../firebaseConfig';

export default function CalendarScreen() {
  const router = useRouter();

  const handleLogout = async () => {
    await auth.signOut();
    // 로그아웃 시 다시 로그인 대문(index.tsx)으로 이동
    router.replace('/'); 
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>나의 캘린더</Text>
        <TouchableOpacity onPress={handleLogout}>
          <Text style={styles.logoutText}>로그아웃</Text>
        </TouchableOpacity>
      </View>
      
      <View style={styles.content}>
        {/* 기존코드 */}
        <Text>캘린더</Text>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: 'white' },
  header: { flexDirection: 'row', justifyContent: 'space-between', padding: 20, alignItems: 'center' },
  title: { fontSize: 24, fontWeight: 'bold' },
  logoutText: { color: 'red' },
  content: { flex: 1, justifyContent: 'center', alignItems: 'center' }
});