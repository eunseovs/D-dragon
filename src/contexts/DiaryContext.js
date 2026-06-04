import AsyncStorage from '@react-native-async-storage/async-storage';
import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';

const DiaryContext = createContext(null);

export function DiaryProvider({ children }) {
  const [diaries, setDiaries] = useState([]);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    AsyncStorage.getItem('diaries')
      .then(saved => {
        if (saved) setDiaries(JSON.parse(saved));
      })
      .catch(error => {
        console.warn('Failed to load diaries:', error);
      })
      .finally(() => setLoaded(true));
  }, []);

  useEffect(() => {
    if (!loaded) return;
    AsyncStorage.setItem('diaries', JSON.stringify(diaries)).catch(error => {
      console.warn('Failed to save diaries:', error);
    });
  }, [diaries, loaded]);

  const addOrUpdateDiary = useCallback((entry) => {
    setDiaries(prev => {
      const idx = prev.findIndex(d => d.date === entry.date);
      if (idx >= 0) {
        const next = [...prev];
        next[idx] = entry;
        return next;
      }
      return [...prev, entry];
    });
  }, []);

  const getDiaryByDate = useCallback((dateStr) =>
    diaries.find(d => d.date === dateStr) ?? null
  , [diaries]);

  const value = useMemo(() => ({
    diaries,
    addOrUpdateDiary,
    getDiaryByDate,
    loaded,
  }), [diaries, addOrUpdateDiary, getDiaryByDate, loaded]);

  return (
    <DiaryContext.Provider value={value}>
      {children}
    </DiaryContext.Provider>
  );
}

export const useDiaries = () => useContext(DiaryContext);
