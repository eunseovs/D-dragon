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

export default function SignupScreen() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");

  const handleSignup = async () => {
    await AsyncStorage.setItem("auth_user", JSON.stringify({ email, phone }));
    router.replace("/");
  };

  return (
    <KeyboardAvoidingView style={styles.screen} behavior={Platform.OS === "ios" ? "padding" : undefined}>
      <View style={styles.hero}>
        <View style={styles.heroBadge}>
          <Ionicons name="sparkles-outline" size={14} color="#2F7D57" />
          <Text style={styles.heroBadgeText}>Start Your Day</Text>
        </View>
        <Text style={styles.heroTitle}>사진과 일정이 한 흐름으로 이어지는 시작점</Text>
        <Text style={styles.heroSubtitle}>
          회원가입을 마치면 홈, 일기, 이동 기록이 같은 톤으로 자연스럽게 이어집니다.
        </Text>
        <View style={styles.previewStrip}>
          <View style={[styles.previewPill, { backgroundColor: "#E6F2EB" }]}>
            <Text style={styles.previewText}>우선순위 정리</Text>
          </View>
          <View style={[styles.previewPill, { backgroundColor: "#FDEFD9" }]}>
            <Text style={styles.previewText}>사진 타임라인</Text>
          </View>
          <View style={[styles.previewPill, { backgroundColor: "#E6EEF9" }]}>
            <Text style={styles.previewText}>월간 통계</Text>
          </View>
        </View>
      </View>

      <View style={styles.formCard}>
        <Text style={styles.formTitle}>회원가입</Text>
        <Text style={styles.formSubtitle}>테스트 단계라 간단히 이메일 기반으로 시작합니다.</Text>

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
          <Text style={styles.inputLabel}>전화번호</Text>
          <TextInput
            style={styles.input}
            placeholder="010-0000-0000"
            placeholderTextColor="#A2AAA5"
            value={phone}
            onChangeText={setPhone}
            keyboardType="phone-pad"
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

        <Pressable style={styles.primaryButton} onPress={handleSignup}>
          <Text style={styles.primaryButtonText}>회원가입 완료</Text>
        </Pressable>

        <Pressable style={styles.secondaryButton} onPress={() => router.push("/login")}>
          <Text style={styles.secondaryButtonText}>이미 계정이 있으면 로그인</Text>
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
    fontSize: 29,
    lineHeight: 37,
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
  previewStrip: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
  },
  previewPill: {
    borderRadius: 999,
    paddingHorizontal: 12,
    paddingVertical: 8,
  },
  previewText: {
    fontSize: 12,
    fontWeight: "700",
    color: "#395345",
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
