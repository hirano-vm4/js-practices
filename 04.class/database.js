export class DataBase {
  constructor(db) {
    this.db = db;
  }

  createTable = async () => {
    await this.run(
      "CREATE TABLE IF NOT EXISTS memos(id INTEGER PRIMARY KEY AUTOINCREMENT, content TEXT NOT NULL)"
    );
  };

  create = async (content) => {
    await this.createTable();
    const result = await this.run(
      "INSERT INTO memos(content) VALUES(?)",
      content
    );

    return result.lastID;
  };

  delete = async (id) => {
    await this.run("DELETE FROM memos WHERE id = ?", id);
  };

  list = async () => {
    await this.createTable();
    return await this.all("SELECT * FROM memos");
  };

  run = (sql, params = []) => {
    return new Promise((resolve, reject) => {
      this.db.run(sql, params, function (err) {
        if (err) {
          reject(err);
        } else {
          resolve(this);
        }
      });
    });
  };

  all = (sql) => {
    return new Promise((resolve, reject) => {
      this.db.all(sql, (err, rows) => {
        if (err) {
          reject(err);
        } else {
          resolve(rows);
        }
      });
    });
  };
}
