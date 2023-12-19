import { DatabaseController } from "./database_controller.js";
import sqlite3 from "sqlite3";
import enquirer from "enquirer";
import minimist from "minimist";
import readline from "readline";

export class MemoApp {
  constructor() {
    const database = new sqlite3.Database("./memo.sqlite3");
    this.databaseController = new DatabaseController(database);
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
        const terminalLines = await this.readTerminalLines();
        const title = terminalLines[0];
        const content = terminalLines.slice(1).join("\n");
        this.save(title, content);
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
    const commandLineOptions = minimist(process.argv.slice(2));
    const validOptions = ["l", "r", "d", "_"];

    const isValidOption = Object.keys(commandLineOptions).every((option) =>
      validOptions.includes(option)
    );

    if (!isValidOption || commandLineOptions._.length > 0) {
      throw new Error(
        "・オプションは '-l'(一覧表示)、'-r'(詳細表示)、'-d'(削除)のいずれかで指定してください"
      );
    }
    return commandLineOptions;
  }

  async readTerminalLines() {
    process.stdin.resume();
    process.stdin.setEncoding("utf8");

    const rl = readline.createInterface({
      input: process.stdin,
    });

    const lines = new Promise((resolve) => {
      const lines = [];

      rl.on("line", (line) => {
        lines.push(line);
      });

      rl.on("close", () => {
        console.log("[入力が終了しました]\n");
        resolve(lines);
      });
    });
    return lines;
  }

  async save(title, content) {
    console.log(title);
    console.log(content);
    const id = await this.databaseController.create(title, content);
    console.log(`メモが保存されました(ID: ${id})`);
  }

  async index() {
    const memos = await this.databaseController.list();
    memos.forEach((memo) => {
      console.log(memo.title);
    });
  }

  async show() {
    const selectedMemoId = await this.selectMemoId();
    const memo = await this.databaseController.find(selectedMemoId);
    console.log(`\n[${memo.title}]\n${memo.content}`);
  }

  async delete() {
    const selectedMemoId = await this.selectMemoId();
    await this.databaseController.delete(selectedMemoId);
    console.log(`\nid:${selectedMemoId} のメモが削除されました`);
  }

  async selectMemoId() {
    const memoLists = await this.databaseController.list();

    const choices = memoLists.map((result) => ({
      name: result.title,
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
