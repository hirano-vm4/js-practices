import { DataBase } from "./database.js";
import { readFileSync } from "fs";
import sqlite3 from "sqlite3";
import enquirer from "enquirer";
import minimist from "minimist";

export class MemoApp {
  constructor() {
    const db = new sqlite3.Database("./memo.sqlite3");
    this.memo = new DataBase(db);
  }

  async exec() {
    try {
      const option = this.option();

      if (option.l) {
        this.index();
      } else if (option.r) {
        this.show();
      } else if (option.d) {
        this.delete();
      } else {
        const content = readFileSync("/dev/stdin", "utf-8");
        this.save(content);
      }
    } catch (err) {
      if (err instanceof Error) {
        console.error(err.message);
      } else {
        throw err;
      }
    }
  }

  option = () => {
    const userOption = minimist(process.argv.slice(2));
    const validOptions = ["l", "r", "d"];

    if (
      !Object.keys(userOption).some((option) =>
        validOptions.includes(option)
      ) &&
      process.stdin.isTTY
    ) {
      throw new Error("オプションは -l -r -d のどれかで指定してください");
    }

    return userOption;
  };

  save = async (content) => {
    const id = await this.memo.create(content);
    console.log(`メモが保存されました(ID: ${id})`);
  };

  index = async () => {
    const memos = await this.memo.list();
    memos.forEach((memo) => {
      console.log(memo.content.split("\n")[0]);
    });
  };

  show = async () => {
    const memo = await this.select();
    console.log(`\n${memo.content}`);
  };

  delete = async () => {
    const memo = await this.select();
    await this.memo.delete(memo.id);
    console.log(`\n[以下のメモが削除されました]\n\n${memo.content}`);
  };

  select = async () => {
    const results = await this.memo.list();

    const choices = results.map((result) => ({
      name: result.content.split("\n")[0],
      value: result.id,
    }));

    const response = await enquirer.prompt({
      type: "select",
      name: "id",
      message: "確認したいメモを選してください。",
      choices: choices,
      result() {
        return this.focused.value;
      },
    });

    const selectedMemo = results.find((result) => result.id === response.id);
    return selectedMemo;
  };
}
