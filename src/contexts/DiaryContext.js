import { createContext, useContext, useState } from 'react';

const DiaryContext = createContext(null);

// diary entry 구조:
// { id, date: 'YYYY-MM-DD', emotion, keywords, text, photos: [{ uri, gps, locationName, color }] }

export function DiaryProvider({ children }) {
  const [diaries, setDiaries] = useState([]);

  const addOrUpdateDiary = (entry) => {
    setDiaries(prev => {
      const idx = prev.findIndex(d => d.date === entry.date);
      if (idx >= 0) {
        const next = [...prev];
        next[idx] = entry;
        return next;
      }
      return [...prev, entry];
    });
  };

  const getDiaryByDate = (dateStr) =>
    diaries.find(d => d.date === dateStr) ?? null;

  return (
    <DiaryContext.Provider value={{ diaries, addOrUpdateDiary, getDiaryByDate }}>
      {children}
    </DiaryContext.Provider>
  );
}

export const useDiaries = () => useContext(DiaryContext);
