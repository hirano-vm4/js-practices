import { DatabaseController } from "./database_controller.js";
import { readFileSync } from "fs";
import sqlite3 from "sqlite3";
import enquirer from "enquirer";
import minimist from "minimist";

export class MemoApp {
  constructor() {
    const databaseInstance = new sqlite3.Database("./memo.sqlite3");
    this.memoController = new DatabaseController(databaseInstance);
  }

  async exec() {
    try {
      const option = await this.option();

      if (option.l) {
        this.index();
      } else if (option.r) {
        this.show();
      } else if (option.d) {
        this.delete();
      } else {
        this.save(option.content);
      }
    } catch (err) {
      if (err instanceof Error) {
        console.error(err.message);
      } else {
        throw err;
      }
    }
  }

  async option() {
    const userOption = minimist(process.argv.slice(2));
    const validOptions = ["l", "r", "d", "content"];

    if (!process.stdin.isTTY) {
      userOption["content"] = readFileSync("/dev/stdin", "utf-8");
    }

    if (
      !Object.keys(userOption).some((option) => validOptions.includes(option))
    ) {
      throw new Error(
        "・オプションは '-l'(一覧表示)、'-r'(詳細表示)、'-d'(削除)のいずれかで指定してください\n・メモの保存は [$echo '保存するメモの内容' | ./main.js] の形式で入力してください"
      );
    }
    return userOption;
  }

  async save(content) {
    const id = await this.memoController.create(content);
    console.log(`メモが保存されました(ID: ${id})`);
  }

  async index() {
    const memos = await this.memoController.list();
    memos.forEach((memo) => {
      console.log(memo.content.split("\n")[0]);
    });
  }

  async show() {
    const selectedMemoId = await this.selectMemoId();
    const memo = await this.memoController.find(selectedMemoId);
    console.log(`\n${memo[0].content}`);
  }

  async delete() {
    const selectedMemoId = await this.selectMemoId();
    await this.memoController.delete(selectedMemoId);
    console.log(`id:${selectedMemoId} のメモが削除されました`);
  }

  async selectMemoId() {
    const results = await this.memoController.list();

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

    return response.id;
  }
}
