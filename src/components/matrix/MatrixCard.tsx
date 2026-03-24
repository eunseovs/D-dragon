import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

interface Props {
  title: string;
  color: string;
  tasks?: string[];
}

export default function MatrixCard({ title, color, tasks = [] }: Props) {
  return (
    <View style={styles.card}>
      <View style={styles.header}>
        <Text style={[styles.title, { color: color }]}>{title}</Text>
        <TouchableOpacity>
          <Ionicons name="add" size={20} color="#333" />
        </TouchableOpacity>
      </View>

      <View style={styles.content}>
        {tasks.map((task, index) => (
          <View key={index} style={styles.taskRow}>
            <View style={[styles.checkbox, { borderColor: color }]} />
            <Text style={styles.taskText}>{task}</Text>
          </View>
        ))}
        {tasks.length === 0 && (
          <Text style={styles.emptyText}>할 일이 없습니다</Text>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    flex: 1,
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 12,
    borderWidth: 1,
    borderColor: '#E0E0E0',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  title: {
    fontSize: 13,
    fontWeight: 'bold',
  },
  content: {
    flex: 1,
  },
  taskRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  checkbox: {
    width: 16,
    height: 16,
    borderWidth: 1,
    borderRadius: 4,
    marginRight: 8,
  },
  taskText: {
    fontSize: 12,
    color: '#333',
  },
  emptyText: {
    fontSize: 11,
    color: '#999',
    marginTop: 10,
  },
});