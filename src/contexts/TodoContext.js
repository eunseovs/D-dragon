import AsyncStorage from '@react-native-async-storage/async-storage';
import { createContext, useContext, useEffect, useState } from 'react';

const TodoContext = createContext(null);

const today = new Date();

export function TodoProvider({ children }) {
  const [loaded, setLoaded] = useState(false);
  const [todos, setTodos] = useState([
    { id: 1, text: '리서치 보고서 제출하기', quadrant: 'DO', completed: true,  date: today },
    { id: 2, text: '프로젝트 핵심 오류 수정',  quadrant: 'DO', completed: false, date: today },
  ]);

  useEffect(() => {
    AsyncStorage.getItem('todos')
      .then(saved => {
        if (saved) {
          const parsed = JSON.parse(saved).map(todo => ({
            ...todo,
            date: todo.date ? new Date(todo.date) : new Date(),
          }));
          setTodos(parsed);
        }
      })
      .catch(error => {
        console.warn('Failed to load todos:', error);
      })
      .finally(() => setLoaded(true));
  }, []);

  useEffect(() => {
    if (!loaded) return;
    AsyncStorage.setItem('todos', JSON.stringify(todos)).catch(error => {
      console.warn('Failed to save todos:', error);
    });
  }, [todos, loaded]);

  return (
    <TodoContext.Provider value={{ todos, setTodos }}>
      {children}
    </TodoContext.Provider>
  );
}

export const useTodos = () => useContext(TodoContext);
