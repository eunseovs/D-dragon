import * as SQLite from "expo-sqlite";

const db = SQLite.openDatabaseSync("diary.db");

export const initDB = () => {
  db.execSync(`
    CREATE TABLE IF NOT EXISTS diary (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      date TEXT,
      content TEXT,
      photos TEXT
    );
  `);
};

export const saveDiary = (date, content, photos) => {
  db.runSync(
    "INSERT INTO diary (date, content, photos) VALUES (?, ?, ?)",
    [date, content, JSON.stringify(photos)]
  );
};

export const getDiary = (date) => {
  return db.getFirstSync(
    "SELECT * FROM diary WHERE date = ?",
    [date]
  );
};