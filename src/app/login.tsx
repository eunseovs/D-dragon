import AsyncStorage from "@react-native-async-storage/async-storage";
import { useRouter } from "expo-router";
import React, { useState } from "react";
import { KeyboardAvoidingView, Platform, StyleSheet, Text, TextInput, TouchableOpacity, View } from "react-native";

export default function LoginScreen() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = async () => {
    await AsyncStorage.setItem("auth_user", JSON.stringify({ email }));
    router.replace("/");
  };

  return (
    <KeyboardAvoidingView style={styles.container} behavior={Platform.OS === "ios" ? "padding" : undefined}>
      <View style={styles.inner}>
        <Text style={styles.title}>로그인</Text>
        <TextInput style={styles.input} placeholder="이메일 입력" placeholderTextColor="#C0C0C0" value={email} onChangeText={setEmail} keyboardType="email-address" autoCapitalize="none" />
        <TextInput style={styles.input} placeholder="비밀번호 입력" placeholderTextColor="#C0C0C0" value={password} onChangeText={setPassword} secureTextEntry />
        <TouchableOpacity style={styles.button} onPress={handleLogin}>
          <Text style={styles.buttonText}>Login</Text>
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#fff" },
  inner: { flex: 1, justifyContent: "center", paddingHorizontal: 36 },
  title: { fontSize: 22, fontWeight: "600", textAlign: "center", color: "#222", marginBottom: 48 },
  input: { backgroundColor: "#F2F2F2", borderRadius: 30, paddingVertical: 17, paddingHorizontal: 24, fontSize: 15, color: "#333", marginBottom: 14 },
  button: { backgroundColor: "#A8D5BA", borderRadius: 30, paddingVertical: 18, alignItems: "center", marginTop: 10 },
  buttonText: { color: "#fff", fontSize: 16, fontWeight: "600" },
});
