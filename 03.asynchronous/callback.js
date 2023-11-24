import sqlite3 from "sqlite3";
import timers from "timers/promises";

const db = new sqlite3.Database(":memory:");

// 1. コールバック（エラーなし）
db.run(
  "CREATE TABLE books (id INTEGER PRIMARY KEY AUTOINCREMENT, title TEXT NOT NULL UNIQUE)",
  () => {
    db.run(
      "INSERT INTO books(title) VALUES('ゼロからわかるRuby超入門')",
      () => {
        db.get("SELECT id FROM books", (_err, row) => {
          console.log(`id: ${row.id}`);
          db.get("SELECT * FROM books", (_err, row) => {
            console.log(row);
            db.run("DROP TABLE books", () => {
              console.log("テーブルを削除しました");
            });
          });
        });
      }
    );
  }
);

await timers.setTimeout(1000);

// 1. コールバック（エラーあり）
db.run(
  "CREATE TABLE books (id INTEGER PRIMARY KEY AUTOINCREMENT, title TEXT NOT NULL UNIQUE)",
  () => {
    db.run("INSERT INTO books(title) VALUES(null)", (err) => {
      if (err) console.log(`レコード追加エラー: ${err.message}`);
      db.get("SELECT * FROM errs", (err) => {
        if (err) console.log(`レコード取得エラー: ${err.message}`);
        db.run("DROP TABLE books", () => {
          console.log("テーブルを削除しました");
        });
      });
    });
  }
);
