import sqlite3 from "sqlite3";
import timers from "timers/promises";
import { run, get } from "./sqlite3-wrapper.js";

const db = new sqlite3.Database(":memory:");

// 2. Promise(エラーなし)
run(
  db,
  "CREATE TABLE books (id INTEGER PRIMARY KEY AUTOINCREMENT, title TEXT NOT NULL UNIQUE)"
)
  .then(() =>
    run(db, "INSERT INTO books(title) VALUES('ゼロからわかるRuby超入門')")
  )
  .then((insertedBook) => {
    console.log(`id: ${insertedBook.lastID}`);
    return get(db, "SELECT * FROM books");
  })
  .then((selectedBook) => {
    console.log(selectedBook);
    return run(db, "DROP TABLE books");
  })
  .then(() => {
    console.log("テーブルを削除しました");
  });

await timers.setTimeout(1000);

// 2. Promise(エラーあり)
run(
  db,
  "CREATE TABLE books (id INTEGER PRIMARY KEY AUTOINCREMENT, title TEXT NOT NULL UNIQUE)"
)
  .then(() => run(db, "INSERT INTO books (title) VALUES (null)"))
  .catch((err) => {
    console.error(`レコード追加エラー: ${err.message}`);
    return get(db, "SELECT * FROM titles");
  })
  .catch((err) => {
    console.error(`レコード取得エラー: ${err.message}`);
    return run(db, "DROP TABLE books");
  })
  .then(() => {
    console.log("テーブルを削除しました");
  });
