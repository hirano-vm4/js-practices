export class MemoController {
  constructor(db) {
    this.db = db;
  }

  async createTable() {
    await this.run(
      "CREATE TABLE IF NOT EXISTS memos(id INTEGER PRIMARY KEY AUTOINCREMENT, content TEXT NOT NULL)"
    );
  }

  async create(content) {
    await this.createTable();
    const result = await this.run(
      "INSERT INTO memos(content) VALUES(?)",
      content
    );

    return result.lastID;
  }

  async delete(id) {
    await this.run("DELETE FROM memos WHERE id = ?", id);
  }

  async list() {
    await this.createTable();
    return await this.all("SELECT * FROM memos");
  }

  async find(id) {
    await this.createTable();
    return await this.all("SELECT * FROM memos WHERE id = ?", id);
  }

  run(sql, params = []) {
    return new Promise((resolve, reject) => {
      this.db.run(sql, params, function (err) {
        if (err) {
          reject(err);
        } else {
          resolve(this);
        }
      });
    });
  }

  all(sql, params = []) {
    return new Promise((resolve, reject) => {
      this.db.all(sql, params, (err, rows) => {
        if (err) {
          reject(err);
        } else {
          resolve(rows);
        }
      });
    });
  }
}
