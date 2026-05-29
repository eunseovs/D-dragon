import AsyncStorage from "@react-native-async-storage/async-storage";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import React, { useState } from "react";
import {
  KeyboardAvoidingView,
  Platform,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";

export default function LoginScreen() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = async () => {
    await AsyncStorage.setItem("auth_user", JSON.stringify({ email }));
    router.replace("/");
  };

  return (
    <KeyboardAvoidingView style={styles.screen} behavior={Platform.OS === "ios" ? "padding" : undefined}>
      <View style={styles.hero}>
        <View style={styles.heroBadge}>
          <Ionicons name="leaf-outline" size={14} color="#2F7D57" />
          <Text style={styles.heroBadgeText}>Daily Flow</Text>
        </View>
        <Text style={styles.heroTitle}>오늘의 흐름으로 다시 돌아오기</Text>
        <Text style={styles.heroSubtitle}>
          일정, 사진, 이동 기록을 한 화면에서 이어보는 홈 톤에 맞춰 로그인 경험도 정리했습니다.
        </Text>
        <View style={styles.statRow}>
          <View style={styles.statCard}>
            <Text style={styles.statValue}>Matrix</Text>
            <Text style={styles.statLabel}>우선순위 정리</Text>
          </View>
          <View style={styles.statCard}>
            <Text style={styles.statValue}>Timeline</Text>
            <Text style={styles.statLabel}>사진 이동 기록</Text>
          </View>
        </View>
      </View>

      <View style={styles.formCard}>
        <Text style={styles.formTitle}>로그인</Text>
        <Text style={styles.formSubtitle}>이메일로 이어서 사용할 수 있어요.</Text>

        <View style={styles.inputGroup}>
          <Text style={styles.inputLabel}>이메일</Text>
          <TextInput
            style={styles.input}
            placeholder="name@example.com"
            placeholderTextColor="#A2AAA5"
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
            autoCapitalize="none"
          />
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.inputLabel}>비밀번호</Text>
          <TextInput
            style={styles.input}
            placeholder="비밀번호 입력"
            placeholderTextColor="#A2AAA5"
            value={password}
            onChangeText={setPassword}
            secureTextEntry
          />
        </View>

        <Pressable style={styles.primaryButton} onPress={handleLogin}>
          <Text style={styles.primaryButtonText}>로그인</Text>
        </Pressable>

        <Pressable style={styles.secondaryButton} onPress={() => router.push("/signup")}>
          <Text style={styles.secondaryButtonText}>회원가입으로 이동</Text>
        </Pressable>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: "#F5F8F4",
    paddingHorizontal: 20,
    paddingTop: 36,
    paddingBottom: 28,
    justifyContent: "space-between",
  },
  hero: {
    paddingTop: 22,
  },
  heroBadge: {
    alignSelf: "flex-start",
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    backgroundColor: "#E6F2EB",
    borderRadius: 999,
    paddingHorizontal: 12,
    paddingVertical: 7,
    marginBottom: 18,
  },
  heroBadgeText: {
    color: "#2F7D57",
    fontSize: 12,
    fontWeight: "700",
  },
  heroTitle: {
    fontSize: 30,
    lineHeight: 38,
    fontWeight: "800",
    color: "#1F3127",
    marginBottom: 10,
  },
  heroSubtitle: {
    fontSize: 14,
    lineHeight: 22,
    color: "#66756C",
    marginBottom: 22,
  },
  statRow: {
    flexDirection: "row",
    gap: 10,
  },
  statCard: {
    flex: 1,
    backgroundColor: "#FFFFFF",
    borderRadius: 18,
    padding: 16,
    borderWidth: 1,
    borderColor: "#E5ECE7",
  },
  statValue: {
    fontSize: 16,
    fontWeight: "800",
    color: "#22342A",
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 12,
    color: "#7B8A82",
  },
  formCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 24,
    padding: 22,
    borderWidth: 1,
    borderColor: "#E4ECE6",
  },
  formTitle: {
    fontSize: 22,
    fontWeight: "800",
    color: "#22342A",
    marginBottom: 6,
  },
  formSubtitle: {
    fontSize: 13,
    color: "#7B8A82",
    marginBottom: 18,
  },
  inputGroup: {
    marginBottom: 14,
  },
  inputLabel: {
    fontSize: 12,
    fontWeight: "700",
    color: "#55645B",
    marginBottom: 7,
  },
  input: {
    height: 54,
    backgroundColor: "#F4F7F3",
    borderRadius: 16,
    paddingHorizontal: 16,
    fontSize: 15,
    color: "#22342A",
    borderWidth: 1,
    borderColor: "#E0E8E2",
  },
  primaryButton: {
    height: 54,
    borderRadius: 16,
    backgroundColor: "#2F7D57",
    justifyContent: "center",
    alignItems: "center",
    marginTop: 8,
  },
  primaryButtonText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "800",
  },
  secondaryButton: {
    height: 52,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: "#D6E2DA",
    justifyContent: "center",
    alignItems: "center",
    marginTop: 10,
    backgroundColor: "#F9FCF9",
  },
  secondaryButtonText: {
    color: "#476555",
    fontSize: 14,
    fontWeight: "700",
  },
});
