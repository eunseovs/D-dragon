import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { useEffect, useRef, useState } from "react";
import {
  Dimensions,
  Image,
  KeyboardAvoidingView,
  Modal,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { Swipeable } from "react-native-gesture-handler";
import { SafeAreaView } from "react-native-safe-area-context";
import DiaryPreviewCard from "../components/DiaryPreviewCard";
import { useDiaries } from "../contexts/DiaryContext";
import { useSelectedDate } from "../contexts/SelectedDateContext";
import { useTodos } from "../contexts/TodoContext";

const { width: SCREEN_WIDTH } = Dimensions.get("window");
const AXIS_WIDTH = 22;
const CELL_MARGIN = 3;
const MAT_H_EXTRA = 10;
const CELL_SIZE = Math.floor(
  (SCREEN_WIDTH - (36 - MAT_H_EXTRA * 2) - AXIS_WIDTH - CELL_MARGIN * 4) / 2,
);
const ROW_HEIGHT = CELL_SIZE + CELL_MARGIN * 2;

const QUADRANTS = [
  {
    key: "DO",
    label: "🔥",
    color: "#C5E8D5",
    textColor: "#3A9E6A",
    subtitle: "긴급함 - 중요함",
  },
  {
    key: "PLAN",
    label: "⏳",
    color: "#F9D0D0",
    textColor: "#D95F5F",
    subtitle: "긴급하지 않음 - 중요함",
  },
  {
    key: "DELEGATE",
    label: "🎯",
    color: "#C5D8F0",
    textColor: "#4A7FC1",
    subtitle: "긴급함 - 중요하지 않음",
  },
  {
    key: "DROP",
    label: "🚫",
    color: "#FDECC8",
    textColor: "#D4913A",
    subtitle: "긴급하지 않음 - 중요하지 않음",
  },
];

const QUADRANT_LOOKUP = Object.fromEntries(
  QUADRANTS.map((item) => [item.key, item]),
);

const WEEKDAYS = ["일", "월", "화", "수", "목", "금", "토"];

const isSameDay = (a, b) => {
  const da = new Date(a),
    db = new Date(b);
  return (
    da.getFullYear() === db.getFullYear() &&
    da.getMonth() === db.getMonth() &&
    da.getDate() === db.getDate()
  );
};

const formatDate = (date) => {
  const d = new Date(date);
  return `${d.getFullYear()}년 ${d.getMonth() + 1}월 ${d.getDate()}일`;
};

const dateToKey = (date) => {
  const d = new Date(date);
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const dd = String(d.getDate()).padStart(2, "0");
  return `${y}-${m}-${dd}`;
};

const ColoredGridIcon = () => (
  <View
    style={{
      width: 20,
      height: 20,
      flexDirection: "row",
      flexWrap: "wrap",
      gap: 2,
    }}
  >
    {["#C5E8D5", "#F9D0D0", "#C5D8F0", "#FDECC8"].map((c, i) => (
      <View
        key={i}
        style={{ width: 9, height: 9, borderRadius: 2, backgroundColor: c }}
      />
    ))}
  </View>
);

export default function MatrixScreen() {
  const today = new Date();
  const inlineRef = useRef(null);
  const router = useRouter();
  const { todos, setTodos } = useTodos();
  const { diaries } = useDiaries();
  const { selectedDate, setSelectedDate } = useSelectedDate();
const [showDiary, setShowDiary] = useState(false);
  const [viewMode, setViewMode] = useState("list");
  const [year, setYear] = useState(selectedDate.getFullYear());
  const [month, setMonth] = useState(selectedDate.getMonth());
  const [calendarOpen, setCalendarOpen] = useState(true);
  const [selectedQuadrant, setSelectedQuadrant] = useState("DO");
  const [inlineText, setInlineText] = useState("");
  const [isInlineEditing, setIsInlineEditing] = useState(false);

  const [modalVisible, setModalVisible] = useState(false);
  const [modalQuadrant, setModalQuadrant] = useState("DO");
  const [modalText, setModalText] = useState("");

  useEffect(() => {
    setYear(selectedDate.getFullYear());
    setMonth(selectedDate.getMonth());
  }, [selectedDate]);

  /* ── helpers ── */
  const toggleTodo = (id) =>
    setTodos((prev) => {
      const updated = prev.map((t) =>
        t.id === id ? { ...t, completed: !t.completed } : t,
      );

      return [...updated].sort((a, b) => {
        if (a.completed === b.completed) return 0;
        return a.completed ? 1 : -1;
      });
    });

  const deleteTodo = (id) =>
    setTodos((prev) => prev.filter((t) => t.id !== id));

  const handleInlineAdd = () => {
    if (inlineText.trim()) {
      setTodos((prev) => [
        ...prev,
        {
          id: Date.now(),
          text: inlineText.trim(),
          quadrant: selectedQuadrant,
          completed: false,
          date: selectedDate,
        },
      ]);
    }
    setInlineText("");
    setIsInlineEditing(false);
  };

  const handleTabChange = (key) => {
    setIsInlineEditing(false);
    setInlineText("");
    setSelectedQuadrant(key);
  };

  const openMatrixModal = (q) => {
    setModalQuadrant(q);
    setModalVisible(true);
  };

  const addFromModal = () => {
    if (!modalText.trim()) return;
    setTodos((prev) => [
      ...prev,
      {
        id: Date.now(),
        text: modalText.trim(),
        quadrant: modalQuadrant,
        completed: false,
        date: selectedDate,
      },
    ]);
    setModalText("");
    setModalVisible(false);
  };


const handleSelectDate = (d) => {
  const clickedDate = new Date(year, month, d);

  if (
    selectedDate.getFullYear() === clickedDate.getFullYear() &&
    selectedDate.getMonth() === clickedDate.getMonth() &&
    selectedDate.getDate() === clickedDate.getDate()
  ) {
    setShowDiary((prev) => !prev);
    return;
  }

  setSelectedDate(clickedDate);
  setShowDiary(true);

  setIsInlineEditing(false);
  setInlineText("");
};

  const datesWithTasks = new Set(
    todos
      .filter((t) => {
        const d = new Date(t.date);
        return d.getFullYear() === year && d.getMonth() === month;
      })
      .map((t) => new Date(t.date).getDate()),
  );
  const diaryPhotosByDate = new Map(
    diaries
      .filter(
        (diary) =>
          diary.date?.startsWith(
            `${year}-${String(month + 1).padStart(2, "0")}-`,
          ) && diary.photos?.length > 0,
      )
      .map((diary) => [diary.date, diary.photos[0]]),
  );
  const selectedDiary =
    diaries.find((diary) => diary.date === dateToKey(selectedDate)) ?? null;

  const prevMonth = () => {
    if (month === 0) {
      setMonth(11);
      setYear((y) => y - 1);
    } else setMonth((m) => m - 1);
  };
  const nextMonth = () => {
    if (month === 11) {
      setMonth(0);
      setYear((y) => y + 1);
    } else setMonth((m) => m + 1);
  };

  /* ── calendar grid ── */
  const renderCalendarGrid = () => {
    const firstDay = new Date(year, month, 1).getDay();
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    const cells = [];
    for (let i = 0; i < firstDay; i++) cells.push(null);
    for (let d = 1; d <= daysInMonth; d++) cells.push(d);
    while (cells.length % 7 !== 0) cells.push(null);

    const isToday = (d) =>
      d === today.getDate() &&
      month === today.getMonth() &&
      year === today.getFullYear();
    const isSelected = (d) => isSameDay(new Date(year, month, d), selectedDate);

    const rows = [];
    for (let i = 0; i < cells.length; i += 7) rows.push(cells.slice(i, i + 7));

    return rows.map((row, ri) => (
      <View key={ri} style={styles.calRow}>
        {row.map((d, ci) => (
          <TouchableOpacity
            key={ci}
            style={styles.calCell}
            disabled={d === null}
            onPress={() => d !== null && handleSelectDate(d)}
          >
            {d !== null && (
              <>
                <View
                  style={[
                    styles.dayCircle,
                    isToday(d) && styles.todayCircle,
                    isSelected(d) && !isToday(d) && styles.selectedCircle,
                  ]}
                >
                  <Text
                    style={[
                      styles.dayText,
                      isToday(d) && styles.todayText,
                      isSelected(d) && !isToday(d) && styles.selectedText,
                    ]}
                  >
                    {d}
                  </Text>
                </View>
                {diaryPhotosByDate.has(dateToKey(new Date(year, month, d))) ? (
                  <Image
                    source={{
                      uri: diaryPhotosByDate.get(
                        dateToKey(new Date(year, month, d)),
                      ).uri,
                    }}
                    style={styles.calendarPhotoThumb}
                  />
                ) : (
                  <View
                    style={[
                      styles.taskDot,
                      datesWithTasks.has(d) && styles.taskDotActive,
                    ]}
                  />
                )}
              </>
            )}
          </TouchableOpacity>
        ))}
      </View>
    ));
  };

  /* ── 리스트뷰 ── */
  const renderListView = () => {
    const q = QUADRANTS.find((x) => x.key === selectedQuadrant);

    const filtered = todos
      .filter(
        (t) =>
          t.quadrant === selectedQuadrant && isSameDay(t.date, selectedDate),
      )
      .sort((a, b) => Number(a.completed) - Number(b.completed));

    return (
      <View>
        <Text style={styles.selectedDateLabel}>{formatDate(selectedDate)}</Text>

        <View style={styles.segmentContainer}>
          {QUADRANTS.map((tab) => (
            <TouchableOpacity
              key={tab.key}
              style={[
                styles.segment,
                selectedQuadrant === tab.key && styles.segmentActive,
              ]}
              onPress={() => handleTabChange(tab.key)}
            >
              <Text
                style={[
                  styles.segmentText,
                  selectedQuadrant === tab.key && styles.segmentActiveText,
                ]}
              >
                {tab.label}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        <Text style={styles.quadrantSubtitle}>• {q.subtitle}</Text>

        <View style={styles.todoList}>
          {filtered.map((todo) => (
            <Swipeable
              key={todo.id}
              friction={2.2}
              overshootRight={false}
              rightThreshold={40}
              renderRightActions={() => (
                <TouchableOpacity
                  style={styles.deleteAction}
                  onPress={() => deleteTodo(todo.id)}
                >
                  <Ionicons name="trash-outline" size={18} color="#FFF" />
                  <Text style={styles.deleteActionText}>삭제</Text>
                </TouchableOpacity>
              )}
            >
              <TouchableOpacity
                style={styles.todoItem}
                onPress={() => toggleTodo(todo.id)}
                activeOpacity={0.8}
              >
                <View
                  style={[
                    styles.checkbox,
                    todo.completed && styles.checkboxDone,
                  ]}
                >
                  {todo.completed && (
                    <Ionicons name="checkmark" size={13} color="#fff" />
                  )}
                </View>
                <Text
                  style={[
                    styles.todoText,
                    todo.completed && styles.todoTextDone,
                  ]}
                >
                  {todo.text}
                </Text>
                <Ionicons name="chevron-back" size={16} color="#C7CDC9" />
              </TouchableOpacity>
            </Swipeable>
          ))}

          <View style={styles.todoItem}>
            <View style={[styles.checkbox, styles.checkboxEmpty]} />
            {isInlineEditing ? (
              <TextInput
                ref={inlineRef}
                style={styles.inlineInput}
                value={inlineText}
                onChangeText={setInlineText}
                onSubmitEditing={handleInlineAdd}
                onBlur={handleInlineAdd}
                placeholder="할일을 추가하세요."
                placeholderTextColor="#BBBBBB"
                returnKeyType="done"
                autoFocus
              />
            ) : (
              <TouchableOpacity onPress={() => setIsInlineEditing(true)}>
                <Text style={styles.inlinePlaceholder}>할일을 추가하세요.</Text>
              </TouchableOpacity>
            )}
          </View>
        </View>
      </View>
    );
  };

  /* ── 매트릭스뷰 ── */
  const renderMatrixTasks = (key) => {
    const items = todos.filter(
      (t) => t.quadrant === key && isSameDay(t.date, selectedDate),
    );
    return items.map((todo) => (
      <Swipeable
        key={todo.id}
        friction={2.2}
        overshootRight={false}
        rightThreshold={32}
        renderRightActions={() => (
          <TouchableOpacity
            style={styles.matrixDeleteAction}
            onPress={() => deleteTodo(todo.id)}
          >
            <Text style={styles.matrixDeleteActionText}>삭제</Text>
          </TouchableOpacity>
        )}
      >
        <TouchableOpacity
          style={styles.matrixTodoItem}
          onPress={() => toggleTodo(todo.id)}
          activeOpacity={0.8}
        >
          <View
            style={[
              styles.matrixCheckbox,
              todo.completed && styles.checkboxDone,
            ]}
          >
            {todo.completed && (
              <Ionicons name="checkmark" size={9} color="#fff" />
            )}
          </View>
          <Text
            style={[
              styles.matrixTodoText,
              todo.completed && styles.todoTextDone,
            ]}
            numberOfLines={2}
          >
            {todo.text}
          </Text>
        </TouchableOpacity>
      </Swipeable>
    ));
  };

  const renderMatrixCell = (key) => {
    const quadrant = QUADRANT_LOOKUP[key];
    const items = todos.filter(
      (t) => t.quadrant === key && isSameDay(t.date, selectedDate),
    );

    return (
      <View key={key} style={styles.matrixCell}>
        <View style={styles.matrixCellHeader}>
          <Text style={[styles.matrixCellTitle, { color: quadrant.textColor }]}>
            {quadrant.label}
          </Text>
          <TouchableOpacity
            style={styles.matrixAddBtn}
            onPress={() => openMatrixModal(key)}
          >
            <Ionicons name="add" size={16} color="#55645B" />
          </TouchableOpacity>
        </View>
        {items.length > 0 ? (
          <ScrollView style={{ flex: 1 }} showsVerticalScrollIndicator={false}>
            {renderMatrixTasks(key)}
          </ScrollView>
        ) : (
          <TouchableOpacity
            style={styles.matrixEmptyState}
            onPress={() => openMatrixModal(key)}
            activeOpacity={0.8}
          >
            <Text style={styles.matrixEmptyText}>할 일 추가</Text>
          </TouchableOpacity>
        )}
      </View>
    );
  };

  const renderMatrixView = () => (
    <View>
      <Text style={styles.selectedDateLabel}>{formatDate(selectedDate)}</Text>

      <View style={styles.matrixView}>
        <View style={styles.axisHeaderRow}>
          <View style={styles.axisCorner} />
          <Text style={styles.axisTopLabel}>긴급함</Text>
          <Text style={styles.axisTopLabel}>긴급하지 않음</Text>
        </View>

        <View style={styles.matrixBody}>
          <View style={styles.axisLeftCol}>
            <View style={styles.axisLeftHalf}>
              <Text style={[styles.axisLeftLabel, { width: ROW_HEIGHT }]}>
                중요함
              </Text>
            </View>
            <View style={styles.axisLeftHalf}>
              <Text style={[styles.axisLeftLabel, { width: ROW_HEIGHT }]}>
                중요하지 않음
              </Text>
            </View>
          </View>

          <View style={styles.matrixGrid}>
            <View style={styles.matrixRow}>
              {["DO", "PLAN"].map(renderMatrixCell)}
            </View>
            <View style={styles.matrixRow}>
              {["DELEGATE", "DROP"].map(renderMatrixCell)}
            </View>
          </View>
        </View>
      </View>
    </View>
  );

  return (
    <SafeAreaView style={styles.safeArea} edges={["top", "left", "right"]}>
      <View style={styles.header}>
        <Text style={styles.screenTitle}>Eisenhower Matrix</Text>
        <View style={styles.headerBtns}>
          <TouchableOpacity
            style={[
              styles.headerBtn,
              viewMode === "matrix" && styles.headerBtnActive,
            ]}
            onPress={() => setViewMode("matrix")}
          >
            <ColoredGridIcon />
          </TouchableOpacity>
          <TouchableOpacity
            style={[
              styles.headerBtn,
              viewMode === "list" && styles.headerBtnActive,
            ]}
            onPress={() => setViewMode("list")}
          >
            <Ionicons
              name="list"
              size={20}
              color={viewMode === "list" ? "#333" : "#888"}
            />
          </TouchableOpacity>
        </View>
      </View>

      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === "ios" ? "padding" : "height"}
      >
        <ScrollView
          contentContainerStyle={styles.scroll}
          keyboardShouldPersistTaps="handled"
          keyboardDismissMode="on-drag"
        >
          {viewMode === "list" ? renderListView() : renderMatrixView()}

          <View style={styles.divider} />

          <View style={styles.calendarSection}>
            <View style={styles.calendarHeader}>
              <TouchableOpacity onPress={() => setCalendarOpen((o) => !o)}>
                <Text style={styles.calToggle}>{calendarOpen ? "▼" : "▶"}</Text>
              </TouchableOpacity>
              <Text style={styles.monthLabel}>
                {year}년 {month + 1}월
              </Text>
              <TouchableOpacity onPress={prevMonth}>
                <Text style={styles.arrow}></Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={nextMonth}>
                <Text style={styles.arrow}></Text>
              </TouchableOpacity>
            </View>
            {calendarOpen && (
              <>
                <View style={styles.weekRow}>
                  {WEEKDAYS.map((d) => (
                    <Text key={d} style={styles.weekDay}>
                      {d}
                    </Text>
                  ))}
                </View>
                {renderCalendarGrid()}
              </>
            )}
          </View>
        </ScrollView>
          {showDiary && (
            <View style={styles.diaryPreviewSection}>
              <View style={styles.diaryPreviewHeader}>
                <Text style={styles.diaryPreviewTitle}>
                  {formatDate(selectedDate)} 일기
                </Text>

                <TouchableOpacity onPress={() => router.push("/social")}>
                  <Text style={styles.diaryPreviewLink}>일기 쓰기</Text>
                </TouchableOpacity>
              </View>

              <DiaryPreviewCard
                diary={selectedDiary}
                onPress={() => router.push("/social")}
              />
            </View>
          )}
      </KeyboardAvoidingView>

      <Modal visible={modalVisible} transparent animationType="slide">
        <KeyboardAvoidingView
          style={{ flex: 1 }}
          behavior={Platform.OS === "ios" ? "padding" : "height"}
        >
          <View style={styles.modalOverlay}>
            <View style={styles.modalBox}>
              <Text style={styles.modalTitle}>할 일 추가</Text>
              <Text style={styles.modalDateLabel}>
                {formatDate(selectedDate)}
              </Text>
              <View style={styles.modalTabRow}>
                {QUADRANTS.map((q) => (
                  <TouchableOpacity
                    key={q.key}
                    style={[
                      styles.modalTab,
                      { backgroundColor: q.color },
                      modalQuadrant === q.key && styles.modalTabSelected,
                    ]}
                    onPress={() => setModalQuadrant(q.key)}
                  >
                    <Text style={[styles.modalTabText, { color: q.textColor }]}>
                      {q.label}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
              <TextInput
                style={styles.modalInput}
                placeholder="할 일을 입력하세요"
                placeholderTextColor="#BBBBBB"
                value={modalText}
                onChangeText={setModalText}
                autoFocus
                onSubmitEditing={addFromModal}
              />
              <View style={styles.modalBtns}>
                <TouchableOpacity
                  style={styles.cancelBtn}
                  onPress={() => {
                    setModalVisible(false);
                    setModalText("");
                  }}
                >
                  <Text style={styles.cancelText}>취소</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={styles.confirmBtn}
                  onPress={addFromModal}
                >
                  <Text style={styles.confirmText}>추가</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </KeyboardAvoidingView>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: "#FFFFFF" },

  header: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 18,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#F0F0F0",
  },
  screenTitle: { flex: 1, fontSize: 20, fontWeight: "700", color: "#222" },
  headerBtns: { flexDirection: "row", gap: 6 },
  headerBtn: {
    width: 38,
    height: 38,
    borderRadius: 9,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#F0F0F0",
  },
  headerBtnActive: { backgroundColor: "#E0E0E0" },

  scroll: { paddingHorizontal: 18, paddingBottom: 24, paddingTop: 8 },
  divider: { height: 1, backgroundColor: "#EEEEEE", marginVertical: 18 },

  selectedDateLabel: {
    fontSize: 14,
    fontWeight: "600",
    color: "#3A9E6A",
    marginBottom: 12,
  },

  segmentContainer: {
    flexDirection: "row",
    backgroundColor: "#F0F0F0",
    borderRadius: 10,
    padding: 3,
    marginBottom: 18,
  },
  segment: {
    flex: 1,
    paddingVertical: 9,
    borderRadius: 8,
    alignItems: "center",
  },
  segmentActive: {
    backgroundColor: "#FFFFFF",
    elevation: 2,
    shadowColor: "#000",
    shadowOpacity: 0.08,
    shadowRadius: 3,
    shadowOffset: { width: 0, height: 1 },
  },
  segmentText: { fontSize: 13, fontWeight: "600", color: "#AAAAAA" },
  segmentActiveText: { color: "#222222" },

  quadrantSubtitle: {
    fontSize: 15,
    fontWeight: "600",
    color: "#333",
    marginBottom: 14,
  },

  todoList: { gap: 8 },
  todoItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 12,
    paddingHorizontal: 14,
    gap: 12,
    borderRadius: 14,
    backgroundColor: "#FAFAFA",
    borderWidth: 1,
    borderColor: "#EEEEEE",
  },
  checkbox: {
    width: 22,
    height: 22,
    borderRadius: 5,
    borderWidth: 1.5,
    borderColor: "#CCCCCC",
    justifyContent: "center",
    alignItems: "center",
    flexShrink: 0,
  },
  checkboxDone: { backgroundColor: "#4A90D9", borderColor: "#4A90D9" },
  checkboxEmpty: { borderColor: "#DDDDDD" },
  todoText: { fontSize: 15, fontWeight: "600", color: "#222", flex: 1 },
  todoTextDone: {
    textDecorationLine: "line-through",
    color: "#AAAAAA",
    fontWeight: "400",
  },
  inlineInput: { flex: 1, fontSize: 15, color: "#333", paddingVertical: 0 },
  inlinePlaceholder: { fontSize: 15, color: "#BBBBBB", fontWeight: "400" },
  deleteAction: {
    width: 92,
    borderRadius: 14,
    backgroundColor: "#DE5B52",
    justifyContent: "center",
    alignItems: "center",
    gap: 4,
    marginLeft: 8,
    marginVertical: 2,
  },
  deleteActionText: { color: "#FFF", fontSize: 12, fontWeight: "700" },

  matrixView: { alignSelf: "stretch", marginHorizontal: -MAT_H_EXTRA },
  axisHeaderRow: {
    flexDirection: "row",
    marginBottom: 0,
    paddingHorizontal: MAT_H_EXTRA,
  },
  axisCorner: { width: AXIS_WIDTH },
  axisTopLabel: {
    flex: 1,
    textAlign: "center",
    fontSize: 16,
    fontWeight: "700",
    color: "#333",
    paddingBottom: 4,
  },
  matrixBody: { flexDirection: "row", paddingHorizontal: MAT_H_EXTRA },
  axisLeftCol: { width: AXIS_WIDTH, overflow: "visible" },
  axisLeftHalf: { flex: 1, justifyContent: "center", alignItems: "center" },
  axisLeftLabel: {
    fontSize: 16,
    fontWeight: "700",
    color: "#333",
    textAlign: "center",
    transform: [{ rotate: "-90deg" }],
  },
  matrixGrid: { flex: 1 },
  matrixRow: { flexDirection: "row" },
  matrixCell: {
    flex: 1,
    height: 220,
    margin: CELL_MARGIN,
    borderRadius: 16,
    padding: 10,
    backgroundColor: "#EBEBEB",
  },
  matrixCellHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 8,
  },
  matrixCellTitle: {
    fontSize: 12,
    fontWeight: "800",
  },
  matrixAddBtn: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: "#FFFFFFCC",
    alignItems: "center",
    justifyContent: "center",
  },
  matrixEmptyState: {
    flex: 1,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#D8D8D8",
    borderStyle: "dashed",
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 6,
  },
  matrixEmptyText: {
    fontSize: 12,
    fontWeight: "700",
    color: "#8B8B8B",
  },
  matrixTodoItem: {
    flexDirection: "row",
    alignItems: "flex-start",
    marginBottom: 6,
    gap: 6,
    backgroundColor: "#FFFFFFC8",
    borderRadius: 10,
    paddingHorizontal: 8,
    paddingVertical: 7,
  },
  matrixCheckbox: {
    width: 16,
    height: 16,
    borderRadius: 3,
    marginTop: 1,
    borderWidth: 1.5,
    borderColor: "#AAAAAA",
    justifyContent: "center",
    alignItems: "center",
    flexShrink: 0,
  },
  matrixTodoText: { fontSize: 12, color: "#333", flex: 1, lineHeight: 17 },
  matrixDeleteAction: {
    width: 64,
    borderRadius: 10,
    backgroundColor: "#DE5B52",
    justifyContent: "center",
    alignItems: "center",
    marginLeft: 6,
    marginBottom: 6,
    marginTop: 1,
  },
  matrixDeleteActionText: {
    color: "#FFF",
    fontSize: 12,
    fontWeight: "700",
  },

  calendarSection: {},
  calendarHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 12,
    gap: 6,
  },
  calToggle: { fontSize: 14, color: "#555", marginRight: 4 },
  monthLabel: { fontSize: 17, fontWeight: "600", color: "#222", flex: 1 },
  arrow: { fontSize: 26, color: "#555", paddingHorizontal: 8 },
  weekRow: { flexDirection: "row", marginBottom: 6 },
  weekDay: {
    flex: 1,
    textAlign: "center",
    fontSize: 14,
    color: "#888",
    fontWeight: "600",
  },
  calRow: { flexDirection: "row", marginBottom: 4 },
  calCell: { flex: 1, alignItems: "center", paddingVertical: 6 },
  dayCircle: {
    width: 34,
    height: 34,
    borderRadius: 17,
    justifyContent: "center",
    alignItems: "center",
  },
  todayCircle: { backgroundColor: "#555" },
  selectedCircle: { backgroundColor: "#A8D5BF" },
  dayText: { fontSize: 15, color: "#333" },
  todayText: { color: "#fff", fontWeight: "700" },
  selectedText: { color: "#fff", fontWeight: "700" },
  calendarPhotoThumb: {
    width: 22,
    height: 22,
    borderRadius: 6,
    marginTop: 4,
    backgroundColor: "#E0E0E0",
  },
  taskDot: {
    width: 20,
    height: 5,
    borderRadius: 3,
    backgroundColor: "#E0E0E0",
    marginTop: 3,
  },
  taskDotActive: { backgroundColor: "#A8D5BF" },

diaryPreviewSection: {
  marginTop: 12,

  backgroundColor: "#FFFFFF",

  borderTopLeftRadius: 24,
  borderTopRightRadius: 24,

  paddingTop: 16,
  paddingHorizontal: 18,
  paddingBottom: 20,

  shadowColor: "#000",
  shadowOffset: {
    width: 0,
    height: -4,
  },
  shadowOpacity: 0.08,
  shadowRadius: 12,

  elevation: 8,
},
  diaryPreviewHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  diaryPreviewTitle: { fontSize: 16, fontWeight: "700", color: "#222" },
  diaryPreviewLink: { fontSize: 13, fontWeight: "700", color: "#3A9E6A" },

  modalOverlay: {
    flex: 1,
    justifyContent: "flex-end",
    backgroundColor: "rgba(0,0,0,0.4)",
  },
  modalBox: {
    backgroundColor: "#FFF",
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 24,
    paddingBottom: 40,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: "#222",
    marginBottom: 4,
  },
  modalDateLabel: { fontSize: 14, color: "#888", marginBottom: 16 },
  modalTabRow: {
    flexDirection: "row",
    gap: 8,
    marginBottom: 18,
    flexWrap: "wrap",
  },
  modalTab: { paddingHorizontal: 16, paddingVertical: 10, borderRadius: 22 },
  modalTabSelected: { borderWidth: 2, borderColor: "#555" },
  modalTabText: { fontSize: 14, fontWeight: "700" },
  modalInput: {
    height: 50,
    backgroundColor: "#F2F2F2",
    borderRadius: 10,
    paddingHorizontal: 16,
    fontSize: 16,
    marginBottom: 18,
  },
  modalBtns: { flexDirection: "row", gap: 10 },
  cancelBtn: {
    flex: 1,
    height: 50,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "#DDD",
    justifyContent: "center",
    alignItems: "center",
  },
  cancelText: { fontSize: 16, color: "#888" },
  confirmBtn: {
    flex: 1,
    height: 50,
    borderRadius: 10,
    backgroundColor: "#A8D5BF",
    justifyContent: "center",
    alignItems: "center",
  },
  confirmText: { fontSize: 16, color: "#FFF", fontWeight: "700" },
});
