import { createContext, useContext, useMemo, useState } from 'react';

const SelectedDateContext = createContext(null);

export function SelectedDateProvider({ children }) {
  const [selectedDate, setSelectedDate] = useState(() => new Date());

  const goToToday = () => {
    setSelectedDate(new Date());
  };

  const shiftSelectedDate = (days) => {
    setSelectedDate(prev => {
      const next = new Date(prev);
      next.setDate(next.getDate() + days);
      return next;
    });
  };

  const value = useMemo(() => ({
    selectedDate,
    setSelectedDate,
    goToToday,
    shiftSelectedDate,
  }), [selectedDate]);

  return (
    <SelectedDateContext.Provider value={value}>
      {children}
    </SelectedDateContext.Provider>
  );
}

export const useSelectedDate = () => useContext(SelectedDateContext);
