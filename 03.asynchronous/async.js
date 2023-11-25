import sqlite3 from "sqlite3";
import timers from "timers/promises";
import { run, get } from "./sqlite3-wrapper.js";

const db = new sqlite3.Database(":memory:");

// 3. async / await （エラーなし）
await run(
  db,
  "CREATE TABLE books (id INTEGER PRIMARY KEY AUTOINCREMENT, title TEXT NOT NULL UNIQUE)"
);

const result = await run(
  db,
  "INSERT INTO books(title) VALUES('ゼロからわかるRuby超入門')"
);
console.log(`id: ${result.lastID}`);

const book = await get(db, "SELECT * FROM books");
console.log(book);

await run(db, "DROP TABLE books");
console.log("テーブルを削除しました");

await timers.setTimeout(1000);

// 3. async / await （エラーあり）
await run(
  db,
  "CREATE TABLE books (id INTEGER PRIMARY KEY AUTOINCREMENT, title TEXT NOT NULL UNIQUE)"
);

try {
  await run(db, "INSERT INTO books (title) VALUES (null)");
} catch (err) {
  if (err.code === "SQLITE_CONSTRAINT") {
    console.error(`制約違反エラー: ${err.message}`);
  } else {
    throw err;
  }
}

try {
  await get(db, "SELECT * FROM titles");
} catch (err) {
  if (err.code === "SQLITE_ERROR") {
    console.error(`レコード取得エラー: ${err.message}`);
  } else {
    throw err;
  }
}

await run(db, "DROP TABLE books");
console.log("テーブルを削除しました");
