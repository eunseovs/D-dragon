// MY-APP/src/contexts/TodoContext.js

import React, { createContext, useState, useContext } from 'react';

// 초기 할 일 목록 (긴급도/중요도 2차원 매트릭스 기반)
const initialTasks = [
  { id: 1, title: '캡스톤디자인 중간발표 준비', isUrgent: true, isImportant: true },
  { id: 2, title: '팀원 회의 일정 조율', isUrgent: true, isImportant: false },
  { id: 3, title: 'React Native 튜토리얼 학습', isUrgent: false, isImportant: true },
  { id: 4, title: '지난주 드라마 몰아보기', isUrgent: false, isImportant: false },
];

export const TodoContext = createContext();

export const useTodo = () => useContext(TodoContext);

export const TodoProvider = ({ children }) => {
  const [tasks, setTasks] = useState(initialTasks);

  // 할 일 추가 함수
  const addTask = (newTask) => {
    setTasks(currentTasks => [...currentTasks, { ...newTask, id: Date.now() }]);
  };
  
  // 할 일 완료 함수 (완료 시 경험치/다이어리 연동 목표)
  const completeTask = (id) => {
    setTasks(currentTasks => currentTasks.filter(task => task.id !== id));
  };

  const value = { tasks, addTask, completeTask };

  return <TodoContext.Provider value={value}>{children}</TodoContext.Provider>;
};