import { createContext, useContext, useState } from "react";

const CharacterContext = createContext(null);

export function CharacterProvider({ children }) {
  const [level, setLevel] = useState(1);
  const [exp, setExp] = useState(0);
  const [coin, setCoin] = useState(0);

  const addExp = (amount) => {
    let newExp = exp + amount;
    let newLevel = level;

    while (newExp >= newLevel * 20) {
      newExp -= newLevel * 20;
      newLevel += 1;

      if (newLevel > 30) {
        newLevel = 30;
        newExp = 0;
        break;
      }
    }

    setLevel(newLevel);
    setExp(newExp);
  };

  const addCoin = (amount) => {
    setCoin((prev) => prev + amount);
  };

  return (
    <CharacterContext.Provider
      value={{
        level,
        exp,
        coin,
        setLevel,
        setExp,
        setCoin,
        addExp,
        addCoin,
      }}
    >
      {children}
    </CharacterContext.Provider>
  );
}

export const useCharacter = () => useContext(CharacterContext);