import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
} from "react-native";
import { useLocalSearchParams } from "expo-router";
import AsyncStorage from "@react-native-async-storage/async-storage";

type Task = {
  text: string;
  done: boolean;
};

type Tasks = {
  q1: Task[];
  q2: Task[];
  q3: Task[];
  q4: Task[];
};

export default function Matrix() {
  const { type } = useLocalSearchParams();

  const [task, setTask] = useState("");
  const [tasks, setTasks] = useState<Task[]>([]);

  // ✅ 처음 들어왔을 때 기존 데이터 불러오기
  useEffect(() => {
    loadTasks();
  }, []);

  const loadTasks = async () => {
    const saved = await AsyncStorage.getItem("tasks");

    if (saved) {
      const parsed: Tasks = JSON.parse(saved);
      setTasks(parsed[type as keyof Tasks] || []);
    }
  };

  // ✅ 저장 함수 (핵심)
  const saveTasks = async (newList: Task[]) => {
    const saved = await AsyncStorage.getItem("tasks");

    let allTasks: Tasks = {
      q1: [],
      q2: [],
      q3: [],
      q4: [],
    };

    if (saved) {
      allTasks = JSON.parse(saved);
    }

    // 🔥 해당 quadrant만 업데이트
    allTasks[type as keyof Tasks] = newList;

    await AsyncStorage.setItem("tasks", JSON.stringify(allTasks));
  };

  // 🔥 제목
  const getTitle = () => {
    switch (type) {
      case "q1":
        return "중요함 - 긴급함";
      case "q2":
        return "중요함 - 긴급하지 않음";
      case "q3":
        return "중요하지 않음 - 긴급함";
      case "q4":
        return "중요하지 않음 - 긴급하지 않음";
      default:
        return "";
    }
  };

  const getActiveIndex = () => {
    switch (type) {
      case "q1":
        return 0;
      case "q2":
        return 1;
      case "q3":
        return 2;
      case "q4":
        return 3;
      default:
        return 0;
    }
  };

  // ✅ 할일 추가 (🔥 핵심 수정)
  const addTask = async () => {
    if (!task.trim()) return;

    const newList = [...tasks, { text: task, done: false }];

    setTasks(newList);
    setTask("");

    await saveTasks(newList); // 🔥 저장
  };

  // ✅ 체크 토글
  const toggleTask = async (index: number) => {
    const updated = [...tasks];
    updated[index].done = !updated[index].done;

    setTasks(updated);
    await saveTasks(updated);
  };

  // ✅ 삭제
  const deleteTask = async (index: number) => {
    const updated = tasks.filter((_, i) => i !== index);

    setTasks(updated);
    await saveTasks(updated);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Eisenhower Matrix</Text>

      <View style={styles.card}>
        <Text style={styles.sectionTitle}>할일등록</Text>

        <View style={styles.centerArea}>
          <Text style={styles.subTitle}>{getTitle()}</Text>

          <View style={styles.iconRow}>
            {[0, 1, 2, 3].map((i) => (
              <View
                key={i}
                style={[
                  styles.iconBox,
                  getActiveIndex() === i && styles.activeBox,
                ]}
              >
                <View style={styles.miniGrid}>
                  {[0, 1, 2, 3].map((j) => (
                    <View
                      key={j}
                      style={[
                        styles.miniCell,
                        j === i && styles.activeCell,
                      ]}
                    />
                  ))}
                </View>
              </View>
            ))}
          </View>
        </View>

        {/* 입력 */}
        <View style={styles.inputRow}>
          <TextInput
            style={styles.input}
            placeholder="할일을 등록해주세요."
            value={task}
            onChangeText={setTask}
          />
          <TouchableOpacity style={styles.addBtn} onPress={addTask}>
            <Text style={{ color: "#fff", fontSize: 18 }}>+</Text>
          </TouchableOpacity>
        </View>

        {/* 리스트 */}
        {tasks.map((item, index) => (
          <View key={index} style={styles.taskRow}>
            <TouchableOpacity onPress={() => toggleTask(index)}>
              <View
                style={[
                  styles.checkbox,
                  item.done && styles.checked,
                ]}
              />
            </TouchableOpacity>

            <Text
              style={[
                styles.taskText,
                item.done && styles.doneText,
              ]}
            >
              {item.text}
            </Text>

            <TouchableOpacity onPress={() => deleteTask(index)}>
              <Text style={styles.delete}>삭제</Text>
            </TouchableOpacity>
          </View>
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f7f7f7",
    paddingTop: 60,
    paddingHorizontal: 20,
  },

  header: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 20,
  },

  card: {
    backgroundColor: "#fff",
    borderRadius: 20,
    padding: 20,
  },

  sectionTitle: {
    fontSize: 16,
    fontWeight: "bold",
  },

  centerArea: {
    alignItems: "center",
    marginVertical: 15,
  },

  subTitle: {
    color: "#888",
    marginBottom: 10,
    fontSize: 15,
  },

  iconRow: {
    flexDirection: "row",
    alignItems: "center",
  },

  iconBox: {
    padding: 10,
    borderRadius: 12,
    marginHorizontal: 6,
  },

  activeBox: {
    backgroundColor: "#eee",
  },

  miniGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    width: 28,
  },

  miniCell: {
    width: 12,
    height: 12,
    backgroundColor: "#ccc",
    margin: 1,
    borderRadius: 2,
  },

  activeCell: {
    backgroundColor: "#6FAF8F",
  },

  inputRow: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 10,
  },

  input: {
    flex: 1,
    backgroundColor: "#eee",
    borderRadius: 20,
    paddingHorizontal: 15,
    height: 40,
  },

  addBtn: {
    width: 40,
    height: 40,
    backgroundColor: "#A8D5BA",
    borderRadius: 20,
    alignItems: "center",
    justifyContent: "center",
    marginLeft: 10,
  },

  taskRow: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 15,
  },

  checkbox: {
    width: 20,
    height: 20,
    borderWidth: 1,
    borderColor: "#aaa",
    marginRight: 10,
  },

  checked: {
    backgroundColor: "#6FAF8F",
  },

  taskText: {
    flex: 1,
  },

  doneText: {
    textDecorationLine: "line-through",
    color: "#aaa",
  },

  delete: {
    color: "#ccc",
  },
});