import { createContext, useContext, useState } from 'react';

const TodoContext = createContext(null);

const today = new Date();

export function TodoProvider({ children }) {
  const [todos, setTodos] = useState([
    { id: 1, text: '리서치 보고서 제출하기', quadrant: 'DO', completed: true,  date: today },
    { id: 2, text: '프로젝트 핵심 오류 수정',  quadrant: 'DO', completed: false, date: today },
  ]);

  return (
    <TodoContext.Provider value={{ todos, setTodos }}>
      {children}
    </TodoContext.Provider>
  );
}

export const useTodos = () => useContext(TodoContext);
