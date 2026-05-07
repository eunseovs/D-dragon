import { useState, useRef } from 'react';
import {
  View, Text, ScrollView, TouchableOpacity,
  StyleSheet, Modal, TextInput, Dimensions,
  KeyboardAvoidingView, Platform,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useTodos } from '../contexts/TodoContext';

const { width: SCREEN_WIDTH } = Dimensions.get('window');
const AXIS_WIDTH  = 22;
const CELL_MARGIN = 3;
const MAT_H_EXTRA = 10;
const CELL_SIZE   = Math.floor((SCREEN_WIDTH - (36 - MAT_H_EXTRA * 2) - AXIS_WIDTH - CELL_MARGIN * 4) / 2);
const ROW_HEIGHT  = CELL_SIZE + CELL_MARGIN * 2;

const QUADRANTS = [
  { key: 'DO',       label: 'DO',       color: '#C5E8D5', textColor: '#3A9E6A',
    subtitle: '긴급함 - 중요함' },
  { key: 'PLAN',     label: 'PLAN',     color: '#F9D0D0', textColor: '#D95F5F',
    subtitle: '긴급하지 않음 - 중요함' },
  { key: 'DELEGATE', label: 'DELEGATE', color: '#C5D8F0', textColor: '#4A7FC1',
    subtitle: '긴급함 - 중요하지 않음' },
  { key: 'DROP',     label: 'DROP',     color: '#FDECC8', textColor: '#D4913A',
    subtitle: '긴급하지 않음 - 중요하지 않음' },
];

const WEEKDAYS = ['일', '월', '화', '수', '목', '금', '토'];

const isSameDay = (a, b) => {
  const da = new Date(a), db = new Date(b);
  return da.getFullYear() === db.getFullYear()
    && da.getMonth() === db.getMonth()
    && da.getDate() === db.getDate();
};

const formatDate = (date) => {
  const d = new Date(date);
  return `${d.getFullYear()}년 ${d.getMonth() + 1}월 ${d.getDate()}일`;
};

const ColoredGridIcon = () => (
  <View style={{ width: 20, height: 20, flexDirection: 'row', flexWrap: 'wrap', gap: 2 }}>
    {['#C5E8D5', '#F9D0D0', '#C5D8F0', '#FDECC8'].map((c, i) => (
      <View key={i} style={{ width: 9, height: 9, borderRadius: 2, backgroundColor: c }} />
    ))}
  </View>
);

export default function MatrixScreen() {
  const today = new Date();
  const inlineRef = useRef(null);
  const { todos, setTodos } = useTodos();

  const [viewMode, setViewMode]                 = useState('list');
  const [year, setYear]                         = useState(today.getFullYear());
  const [month, setMonth]                       = useState(today.getMonth());
  const [calendarOpen, setCalendarOpen]         = useState(true);
  const [selectedDate, setSelectedDate]         = useState(today);
  const [selectedQuadrant, setSelectedQuadrant] = useState('DO');
  const [inlineText, setInlineText]             = useState('');
  const [isInlineEditing, setIsInlineEditing]   = useState(false);

  const [modalVisible, setModalVisible]   = useState(false);
  const [modalQuadrant, setModalQuadrant] = useState('DO');
  const [modalText, setModalText]         = useState('');

  /* ── helpers ── */
  const toggleTodo = (id) =>
    setTodos(prev => prev.map(t => t.id === id ? { ...t, completed: !t.completed } : t));

  const handleInlineAdd = () => {
    if (inlineText.trim()) {
      setTodos(prev => [...prev, {
        id: Date.now(),
        text: inlineText.trim(),
        quadrant: selectedQuadrant,
        completed: false,
        date: selectedDate,
      }]);
    }
    setInlineText('');
    setIsInlineEditing(false);
  };

  const handleTabChange = (key) => {
    setIsInlineEditing(false);
    setInlineText('');
    setSelectedQuadrant(key);
  };

  const openMatrixModal = (q) => {
    setModalQuadrant(q);
    setModalVisible(true);
  };

  const addFromModal = () => {
    if (!modalText.trim()) return;
    setTodos(prev => [...prev, {
      id: Date.now(),
      text: modalText.trim(),
      quadrant: modalQuadrant,
      completed: false,
      date: selectedDate,
    }]);
    setModalText('');
    setModalVisible(false);
  };

  const handleSelectDate = (d) => {
    setSelectedDate(new Date(year, month, d));
    setIsInlineEditing(false);
    setInlineText('');
  };

  const datesWithTasks = new Set(
    todos
      .filter(t => { const d = new Date(t.date); return d.getFullYear() === year && d.getMonth() === month; })
      .map(t => new Date(t.date).getDate())
  );

  const prevMonth = () => {
    if (month === 0) { setMonth(11); setYear(y => y - 1); } else setMonth(m => m - 1);
  };
  const nextMonth = () => {
    if (month === 11) { setMonth(0); setYear(y => y + 1); } else setMonth(m => m + 1);
  };

  /* ── calendar grid ── */
  const renderCalendarGrid = () => {
    const firstDay    = new Date(year, month, 1).getDay();
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    const cells = [];
    for (let i = 0; i < firstDay; i++) cells.push(null);
    for (let d = 1; d <= daysInMonth; d++) cells.push(d);
    while (cells.length % 7 !== 0) cells.push(null);

    const isToday    = (d) => d === today.getDate() && month === today.getMonth() && year === today.getFullYear();
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
                <View style={[
                  styles.dayCircle,
                  isToday(d) && styles.todayCircle,
                  isSelected(d) && !isToday(d) && styles.selectedCircle,
                ]}>
                  <Text style={[
                    styles.dayText,
                    isToday(d) && styles.todayText,
                    isSelected(d) && !isToday(d) && styles.selectedText,
                  ]}>
                    {d}
                  </Text>
                </View>
                <View style={[styles.taskDot, datesWithTasks.has(d) && styles.taskDotActive]} />
              </>
            )}
          </TouchableOpacity>
        ))}
      </View>
    ));
  };

  /* ── 리스트뷰 ── */
  const renderListView = () => {
    const q = QUADRANTS.find(x => x.key === selectedQuadrant);
    const filtered = todos.filter(t =>
      t.quadrant === selectedQuadrant && isSameDay(t.date, selectedDate)
    );

    return (
      <View>
        <Text style={styles.selectedDateLabel}>{formatDate(selectedDate)}</Text>

        <View style={styles.segmentContainer}>
          {QUADRANTS.map(tab => (
            <TouchableOpacity
              key={tab.key}
              style={[styles.segment, selectedQuadrant === tab.key && styles.segmentActive]}
              onPress={() => handleTabChange(tab.key)}
            >
              <Text style={[
                styles.segmentText,
                selectedQuadrant === tab.key && styles.segmentActiveText,
              ]}>
                {tab.label}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        <Text style={styles.quadrantSubtitle}>• {q.subtitle}</Text>

        <View style={styles.todoList}>
          {filtered.map(todo => (
            <TouchableOpacity
              key={todo.id}
              style={styles.todoItem}
              onPress={() => toggleTodo(todo.id)}
            >
              <View style={[styles.checkbox, todo.completed && styles.checkboxDone]}>
                {todo.completed && <Ionicons name="checkmark" size={13} color="#fff" />}
              </View>
              <Text style={[styles.todoText, todo.completed && styles.todoTextDone]}>
                {todo.text}
              </Text>
            </TouchableOpacity>
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
    const items = todos.filter(t => t.quadrant === key && isSameDay(t.date, selectedDate));
    return items.map(todo => (
      <TouchableOpacity key={todo.id} style={styles.matrixTodoItem} onPress={() => toggleTodo(todo.id)}>
        <View style={[styles.matrixCheckbox, todo.completed && styles.checkboxDone]}>
          {todo.completed && <Ionicons name="checkmark" size={9} color="#fff" />}
        </View>
        <Text style={[styles.matrixTodoText, todo.completed && styles.todoTextDone]} numberOfLines={2}>
          {todo.text}
        </Text>
      </TouchableOpacity>
    ));
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
              <Text style={[styles.axisLeftLabel, { width: ROW_HEIGHT }]}>중요함</Text>
            </View>
            <View style={styles.axisLeftHalf}>
              <Text style={[styles.axisLeftLabel, { width: ROW_HEIGHT }]}>중요하지 않음</Text>
            </View>
          </View>

          <View style={styles.matrixGrid}>
            <View style={styles.matrixRow}>
              {['DO', 'PLAN'].map(key => (
                <TouchableOpacity
                  key={key}
                  style={styles.matrixCell}
                  onPress={() => openMatrixModal(key)}
                >
                  {renderMatrixTasks(key)}
                </TouchableOpacity>
              ))}
            </View>
            <View style={styles.matrixRow}>
              {['DELEGATE', 'DROP'].map(key => (
                <TouchableOpacity
                  key={key}
                  style={styles.matrixCell}
                  onPress={() => openMatrixModal(key)}
                >
                  {renderMatrixTasks(key)}
                </TouchableOpacity>
              ))}
            </View>
          </View>
        </View>
      </View>
    </View>
  );

  return (
    <SafeAreaView style={styles.safeArea} edges={['top', 'left', 'right']}>

      <View style={styles.header}>
        <Text style={styles.screenTitle}>Eisenhower Matrix</Text>
        <View style={styles.headerBtns}>
          <TouchableOpacity
            style={[styles.headerBtn, viewMode === 'matrix' && styles.headerBtnActive]}
            onPress={() => setViewMode('matrix')}
          >
            <ColoredGridIcon />
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.headerBtn, viewMode === 'list' && styles.headerBtnActive]}
            onPress={() => setViewMode('list')}
          >
            <Ionicons name="list" size={20} color={viewMode === 'list' ? '#333' : '#888'} />
          </TouchableOpacity>
        </View>
      </View>

      <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
      <ScrollView contentContainerStyle={styles.scroll} keyboardShouldPersistTaps="handled" keyboardDismissMode="on-drag">

        {viewMode === 'list' ? renderListView() : renderMatrixView()}

        <View style={styles.divider} />

        <View style={styles.calendarSection}>
          <View style={styles.calendarHeader}>
            <TouchableOpacity onPress={() => setCalendarOpen(o => !o)}>
              <Text style={styles.calToggle}>{calendarOpen ? '▼' : '▶'}</Text>
            </TouchableOpacity>
            <Text style={styles.monthLabel}>{year}년 {month + 1}월</Text>
            <TouchableOpacity onPress={prevMonth}>
              <Text style={styles.arrow}>‹</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={nextMonth}>
              <Text style={styles.arrow}>›</Text>
            </TouchableOpacity>
          </View>
          {calendarOpen && (
            <>
              <View style={styles.weekRow}>
                {WEEKDAYS.map(d => <Text key={d} style={styles.weekDay}>{d}</Text>)}
              </View>
              {renderCalendarGrid()}
            </>
          )}
        </View>

      </ScrollView>
      </KeyboardAvoidingView>

      <Modal visible={modalVisible} transparent animationType="slide">
        <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
        <View style={styles.modalOverlay}>
          <View style={styles.modalBox}>
            <Text style={styles.modalTitle}>할 일 추가</Text>
            <Text style={styles.modalDateLabel}>{formatDate(selectedDate)}</Text>
            <View style={styles.modalTabRow}>
              {QUADRANTS.map(q => (
                <TouchableOpacity
                  key={q.key}
                  style={[styles.modalTab, { backgroundColor: q.color }, modalQuadrant === q.key && styles.modalTabSelected]}
                  onPress={() => setModalQuadrant(q.key)}
                >
                  <Text style={[styles.modalTabText, { color: q.textColor }]}>{q.label}</Text>
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
              <TouchableOpacity style={styles.cancelBtn} onPress={() => { setModalVisible(false); setModalText(''); }}>
                <Text style={styles.cancelText}>취소</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.confirmBtn} onPress={addFromModal}>
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
  safeArea: { flex: 1, backgroundColor: '#FFFFFF' },

  header: {
    flexDirection: 'row', alignItems: 'center',
    paddingHorizontal: 18, paddingVertical: 12,
    borderBottomWidth: 1, borderBottomColor: '#F0F0F0',
  },
  screenTitle:     { flex: 1, fontSize: 20, fontWeight: '700', color: '#222' },
  headerBtns:      { flexDirection: 'row', gap: 6 },
  headerBtn:       { width: 38, height: 38, borderRadius: 9, justifyContent: 'center', alignItems: 'center', backgroundColor: '#F0F0F0' },
  headerBtnActive: { backgroundColor: '#E0E0E0' },

  scroll: { paddingHorizontal: 18, paddingBottom: 24, paddingTop: 8 },
  divider: { height: 1, backgroundColor: '#EEEEEE', marginVertical: 18 },

  selectedDateLabel: { fontSize: 14, fontWeight: '600', color: '#3A9E6A', marginBottom: 12 },

  segmentContainer: { flexDirection: 'row', backgroundColor: '#F0F0F0', borderRadius: 10, padding: 3, marginBottom: 18 },
  segment:          { flex: 1, paddingVertical: 9, borderRadius: 8, alignItems: 'center' },
  segmentActive:    { backgroundColor: '#FFFFFF', elevation: 2, shadowColor: '#000', shadowOpacity: 0.08, shadowRadius: 3, shadowOffset: { width: 0, height: 1 } },
  segmentText:      { fontSize: 13, fontWeight: '600', color: '#AAAAAA' },
  segmentActiveText:{ color: '#222222' },

  quadrantSubtitle: { fontSize: 15, fontWeight: '600', color: '#333', marginBottom: 14 },

  todoList:    { gap: 2 },
  todoItem:    { flexDirection: 'row', alignItems: 'center', paddingVertical: 9, gap: 12 },
  checkbox:    { width: 22, height: 22, borderRadius: 5, borderWidth: 1.5, borderColor: '#CCCCCC', justifyContent: 'center', alignItems: 'center', flexShrink: 0 },
  checkboxDone:  { backgroundColor: '#4A90D9', borderColor: '#4A90D9' },
  checkboxEmpty: { borderColor: '#DDDDDD' },
  todoText:      { fontSize: 15, fontWeight: '600', color: '#222', flex: 1 },
  todoTextDone:  { textDecorationLine: 'line-through', color: '#AAAAAA', fontWeight: '400' },
  inlineInput:       { flex: 1, fontSize: 15, color: '#333', paddingVertical: 0 },
  inlinePlaceholder: { fontSize: 15, color: '#BBBBBB', fontWeight: '400' },

  matrixView:    { alignSelf: 'stretch', marginHorizontal: -MAT_H_EXTRA },
  axisHeaderRow: { flexDirection: 'row', marginBottom: 0, paddingHorizontal: MAT_H_EXTRA },
  axisCorner:    { width: AXIS_WIDTH },
  axisTopLabel:  { flex: 1, textAlign: 'center', fontSize: 16, fontWeight: '700', color: '#333', paddingBottom: 4 },
  matrixBody:    { flexDirection: 'row', paddingHorizontal: MAT_H_EXTRA },
  axisLeftCol:   { width: AXIS_WIDTH, overflow: 'visible' },
  axisLeftHalf:  { flex: 1, justifyContent: 'center', alignItems: 'center' },
  axisLeftLabel: { fontSize: 16, fontWeight: '700', color: '#333', textAlign: 'center', transform: [{ rotate: '-90deg' }] },
  matrixGrid:    { flex: 1 },
  matrixRow:     { flexDirection: 'row' },
  matrixCell:    { flex: 1, aspectRatio: 1, margin: CELL_MARGIN, borderRadius: 16, padding: 12, backgroundColor: '#EBEBEB' },
  matrixTodoItem:{ flexDirection: 'row', alignItems: 'flex-start', marginBottom: 6, gap: 6 },
  matrixCheckbox:{ width: 16, height: 16, borderRadius: 3, marginTop: 1, borderWidth: 1.5, borderColor: '#AAAAAA', justifyContent: 'center', alignItems: 'center', flexShrink: 0 },
  matrixTodoText:{ fontSize: 12, color: '#333', flex: 1, lineHeight: 17 },

  calendarSection: {},
  calendarHeader:  { flexDirection: 'row', alignItems: 'center', marginBottom: 12, gap: 6 },
  calToggle:  { fontSize: 14, color: '#555', marginRight: 4 },
  monthLabel: { fontSize: 17, fontWeight: '600', color: '#222', flex: 1 },
  arrow:      { fontSize: 26, color: '#555', paddingHorizontal: 8 },
  weekRow:    { flexDirection: 'row', marginBottom: 6 },
  weekDay:    { flex: 1, textAlign: 'center', fontSize: 14, color: '#888', fontWeight: '600' },
  calRow:     { flexDirection: 'row', marginBottom: 4 },
  calCell:    { flex: 1, alignItems: 'center', paddingVertical: 6 },
  dayCircle:      { width: 34, height: 34, borderRadius: 17, justifyContent: 'center', alignItems: 'center' },
  todayCircle:    { backgroundColor: '#555' },
  selectedCircle: { backgroundColor: '#A8D5BF' },
  dayText:        { fontSize: 15, color: '#333' },
  todayText:      { color: '#fff', fontWeight: '700' },
  selectedText:   { color: '#fff', fontWeight: '700' },
  taskDot:        { width: 20, height: 5, borderRadius: 3, backgroundColor: '#E0E0E0', marginTop: 3 },
  taskDotActive:  { backgroundColor: '#A8D5BF' },

  modalOverlay:    { flex: 1, justifyContent: 'flex-end', backgroundColor: 'rgba(0,0,0,0.4)' },
  modalBox:        { backgroundColor: '#FFF', borderTopLeftRadius: 20, borderTopRightRadius: 20, padding: 24, paddingBottom: 40 },
  modalTitle:      { fontSize: 18, fontWeight: '700', color: '#222', marginBottom: 4 },
  modalDateLabel:  { fontSize: 14, color: '#888', marginBottom: 16 },
  modalTabRow:     { flexDirection: 'row', gap: 8, marginBottom: 18, flexWrap: 'wrap' },
  modalTab:        { paddingHorizontal: 16, paddingVertical: 10, borderRadius: 22 },
  modalTabSelected:{ borderWidth: 2, borderColor: '#555' },
  modalTabText:    { fontSize: 14, fontWeight: '700' },
  modalInput:      { height: 50, backgroundColor: '#F2F2F2', borderRadius: 10, paddingHorizontal: 16, fontSize: 16, marginBottom: 18 },
  modalBtns:       { flexDirection: 'row', gap: 10 },
  cancelBtn:       { flex: 1, height: 50, borderRadius: 10, borderWidth: 1, borderColor: '#DDD', justifyContent: 'center', alignItems: 'center' },
  cancelText:      { fontSize: 16, color: '#888' },
  confirmBtn:      { flex: 1, height: 50, borderRadius: 10, backgroundColor: '#A8D5BF', justifyContent: 'center', alignItems: 'center' },
  confirmText:     { fontSize: 16, color: '#FFF', fontWeight: '700' },
});
