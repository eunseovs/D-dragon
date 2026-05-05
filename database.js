import * as SQLite from "expo-sqlite";

const db = SQLite.openDatabaseSync("diary.db");

export const initDB = () => {
  // 🔥 기존 테이블 삭제 (핵심)
  db.execSync(`DROP TABLE IF EXISTS diary;`);

  // 🔥 새로 생성
  db.execSync(`
    CREATE TABLE diary (
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