import sqlite3 from "sqlite3";
const db = new sqlite3.Database(":memory:");

export const createTable = () => {
  return new Promise((resolve, reject) => {
    db.run(
      "CREATE TABLE books (id INTEGER PRIMARY KEY AUTOINCREMENT, title TEXT NOT NULL UNIQUE)",
      (err) => {
        err ? reject(err) : resolve();
      }
    );
  });
};

export const insertTitle = () => {
  return new Promise((resolve, reject) => {
    db.run(
      "INSERT INTO books(title) VALUES('ゼロからわかるRuby超入門')",
      (err) => {
        err ? reject(err) : resolve();
      }
    );
  });
};

export const insertTitleErr = () => {
  return new Promise((resolve, reject) => {
    db.run("INSERT INTO books(title) VALUES(null)", (err) => {
      err ? reject(err) : resolve();
    });
  });
};

export const getId = () => {
  return new Promise((resolve, reject) => {
    db.get("SELECT id FROM books", (err, row) => {
      err ? reject(err) : resolve(console.log(`id: ${row.id}`));
    });
  });
};

export const getRecord = () => {
  return new Promise((resolve, reject) => {
    db.get("SELECT * FROM books", (err, row) => {
      err ? reject(err) : resolve(console.log(row));
    });
  });
};

export const getRecordErr = () => {
  return new Promise((resolve, reject) => {
    db.get("SELECT * FROM errs", (err) => {
      err ? reject(err) : resolve();
    });
  });
};

export const deleteRecord = () => {
  return new Promise((resolve, reject) => {
    db.run("DROP TABLE books", (err) => {
      err ? reject(err) : resolve(console.log("テーブルを削除しました"));
    });
  });
};
