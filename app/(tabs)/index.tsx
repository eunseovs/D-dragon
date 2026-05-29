import React, { useState, useEffect, useCallback } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
} from "react-native";
import { Calendar } from "react-native-calendars";
import { useRouter } from "expo-router";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useFocusEffect } from "@react-navigation/native"; 

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

export default function Home() {
  const router = useRouter();
  const today = new Date().toISOString().split("T")[0];

  const [tasks, setTasks] = useState<Tasks>({
    q1: [],
    q2: [],
    q3: [],
    q4: [],
  });

  // ✅ 최초 로딩
  useEffect(() => {
    loadTasks();
  }, []);

  // ✅ 화면 돌아올 때마다 다시 불러오기 
  useFocusEffect(
    useCallback(() => {
      loadTasks();
    }, [])
  );

  const loadTasks = async () => {
    const saved = await AsyncStorage.getItem("tasks");
    if (saved) setTasks(JSON.parse(saved));
  };

  const saveTasks = async (newTasks: Tasks) => {
    setTasks(newTasks);
    await AsyncStorage.setItem("tasks", JSON.stringify(newTasks));
  };

  // 체크
  const toggleTask = (type: keyof Tasks, index: number) => {
    const updated = { ...tasks };
    updated[type][index].done = !updated[type][index].done;
    saveTasks(updated);
  };

  // 삭제
  const deleteTask = (type: keyof Tasks, index: number) => {
    const updated = { ...tasks };
    updated[type].splice(index, 1);
    saveTasks(updated);
  };

  const handleDayPress = (day: any) => {
    const date = day.dateString;

    if (date > today) return;

    if (date === today) {
      router.push("/photoSelect");
    } else {
      alert("기록 없음");
    }
  };

  return (
    <ScrollView style={styles.container}>
      
      {/* 🔥 프로필 */}
      <View style={styles.profileRow}>
        {["민지", "도연", "은서", "예서"].map((name, i) => (
          <View key={i} style={styles.profileItem}>
            <View style={styles.circle} />
            <Text>{name}</Text>
          </View>
        ))}
      </View>

      {/* 🔥 제목 */}
      <Text style={styles.title}>Eisenhower Matrix</Text>

      {/* 🔥 매트릭스 */}
      <View style={styles.matrixContainer}>

        {/* ✅ 중앙 화살표 */}
        <View pointerEvents="none" style={styles.crossOverlay}>
          <View style={styles.verticalTop} />
          <View style={styles.verticalBottom} />
          <View style={styles.horizontalLeft} />
          <View style={styles.horizontalRight} />

          <View style={styles.importanceWrap}>
            <Text style={styles.arrow}>↑</Text>
            <Text style={styles.label}>중요도</Text>
          </View>

          <View style={styles.urgencyWrap}>
            <Text style={styles.arrow}>←</Text>
            <Text style={styles.label}>긴급도</Text>
          </View>
        </View>

        {[
          { key: "q1", label: "DO", color: "#A8D5BA", num: 1 },
          { key: "q2", label: "DECIDE", color: "#F5B7B1", num: 2 },
          { key: "q3", label: "DELEGATE", color: "#AED6F1", num: 3 },
          { key: "q4", label: "DELETE", color: "#F9E79F", num: 4 },
        ].map((item) => (
          <TouchableOpacity
            key={item.key}
            style={styles.box}
            onPress={() => router.push(`/matrix?type=${item.key}`)}
          >
            <View style={[styles.circleNum, { backgroundColor: item.color }]}>
              <Text>{item.num}</Text>
            </View>
            <Text>{item.label}</Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* 🔥 캘린더 */}
      <Calendar onDayPress={handleDayPress} maxDate={today} />

      {/* 🔥 오늘의 할일 */}
   <View style={styles.todoContainer}>
  <Text style={styles.todoTitle}>오늘의 할일</Text>

  {[
    { key: "q1", num: "1", color: "#A8D5BA" },
    { key: "q2", num: "2", color: "#F5B7B1" },
    { key: "q3", num: "3", color: "#AED6F1" },
    { key: "q4", num: "4", color: "#F9E79F" },
  ].map((group) => (
    <View key={group.key} style={{ marginBottom: 20 }}>
      
      {/* 🔥 동그라미 버튼 */}
      <View style={[styles.groupBadge, { backgroundColor: group.color }]}>
        <Text style={styles.groupText}>{group.num}</Text>
      </View>

      {/* 🔥 할일 리스트 */}
      {tasks[group.key as keyof Tasks].map((task, i) => (
        <View key={i} style={styles.taskRow}>
          
          <TouchableOpacity
            onPress={() =>
              toggleTask(group.key as keyof Tasks, i)
            }
          >
            <Text style={styles.checkbox}>
              {task.done ? "☑" : "☐"}
            </Text>
          </TouchableOpacity>

          <Text
            style={[
              styles.taskText,
              task.done && styles.doneText,
            ]}
          >
            {task.text}
          </Text>

          <TouchableOpacity
            onPress={() =>
              deleteTask(group.key as keyof Tasks, i)
            }
          >
            <Text style={styles.deleteBtn}>삭제</Text>
          </TouchableOpacity>

        </View>
      ))}
    </View>
  ))}
</View>

    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#fff" },

  profileRow: {
    flexDirection: "row",
    justifyContent: "space-around",
    paddingVertical: 15,
  },

  profileItem: { alignItems: "center" },

  circle: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: "#ddd",
    marginBottom: 5,
  },

  title: {
    fontSize: 20,
    fontWeight: "bold",
    margin: 15,
    top: -10,
  },

  matrixContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    paddingHorizontal: 10,
    position: "relative",
  },

  box: {
    width: "48%",
    backgroundColor: "#eee",
    borderRadius: 15,
    padding: 15,
    marginBottom: 10,
    flexDirection: "row",
    alignItems: "center",
    zIndex: 1, 
  },

  circleNum: {
    width: 35,
    height: 35,
    borderRadius: 20,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 10,
  },

  crossOverlay: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    alignItems: "center",
    justifyContent: "center",
    zIndex: 10, 
  },

  verticalTop: {
    position: "absolute",
    top: 25,
    height: "40%",
    width: 2,
    backgroundColor: "#bbb",
  },

  verticalBottom: {
    position: "absolute",
    bottom: 10,
    height: "40%",
    width: 2,
    backgroundColor: "#bbb",
  },

  horizontalLeft: {
    position: "absolute",
    left: 55,
    top: "46%",
    width: "50%",
    height: 2,
    backgroundColor: "#bbb",
  },

  horizontalRight: {
    position: "absolute",
    right: 10,
    top: "46%",
    width: "50%",
    height: 2,
    backgroundColor: "#bbb",
  },

  importanceWrap: {
    position: "absolute",
    top: "-15%",
    alignItems: "center",
  },

  urgencyWrap: {
    position: "absolute",
    left: "0%",
    top: "39%",
    flexDirection: "row",
    alignItems: "center",
  },

  arrow: {
    fontSize: 16,
    color: "#555",
  },

  label: {
    fontSize: 12,
    color: "#555",
    marginLeft: 3,
  },

  todoContainer: {
    padding: 15,
  },

  todoTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 25,
  },

  taskRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 8,
  },

  checkbox: {
    fontSize: 18,
    marginRight: 10,
  },

  taskText: {
    flex: 1,
  },

  deleteBtn: {
    color: "#ccc",
    fontSize: 12,
  },

  groupBadge: {
  alignSelf: "flex-start",
  paddingHorizontal: 14,
  paddingVertical: 6,
  borderRadius: 20,
  marginBottom: 8,
},

groupText: {
  fontWeight: "bold",
  color: "#333",
},

doneText: {
  textDecorationLine: "line-through",
  color: "#aaa",
},

});