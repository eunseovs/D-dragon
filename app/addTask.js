import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import { useRouter, useLocalSearchParams } from "expo-router";

export default function AddTask() {
  const router = useRouter();
  const { type } = useLocalSearchParams();

  const [text, setText] = useState("");

  const onAdd = () => {
    if (!text.trim()) return;

    router.replace({
      pathname: "/(tabs)",
      params: { newTask: text, type },
    });
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === "ios" ? "padding" : undefined}
    >
      <Text style={styles.title}>할일등록</Text>

      {/* 🔥 상단 선택 UI 느낌 */}
      <View style={styles.selector}>
        <View style={styles.selectedBox} />
      </View>

      {/* 🔥 입력창 */}
      <View style={styles.inputRow}>
        <TextInput
          placeholder="할일을 등록해주세요."
          value={text}
          onChangeText={setText}
          style={styles.input}
        />

        <TouchableOpacity style={styles.addBtn} onPress={onAdd}>
          <Text style={{ color: "#fff", fontSize: 20 }}>+</Text>
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    padding: 20,
  },
  title: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 20,
  },
  selector: {
    height: 60,
    backgroundColor: "#eee",
    borderRadius: 15,
    justifyContent: "center",
    padding: 10,
    marginBottom: 20,
  },
  selectedBox: {
    width: 40,
    height: 40,
    backgroundColor: "#A8D5BA",
    borderRadius: 8,
  },
  inputRow: {
    flexDirection: "row",
    alignItems: "center",
  },
  input: {
    flex: 1,
    backgroundColor: "#eee",
    borderRadius: 20,
    padding: 15,
  },
  addBtn: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: "#6FAF8F",
    justifyContent: "center",
    alignItems: "center",
    marginLeft: 10,
  },
});