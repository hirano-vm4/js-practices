import timers from "timers/promises";
import * as bookTableOperations from "./table_function.js";

// 3. async / await （エラーなし）

const noErr = async () => {
  await bookTableOperations.createTable();
  await bookTableOperations.insertTitle();
  await bookTableOperations.getId();
  await bookTableOperations.getRecord();
  await bookTableOperations.deleteRecord();
};

noErr();

await timers.setTimeout(1000);

// 3. async / await （エラーあり）
const err = async () => {
  await bookTableOperations.createTable();

  try {
    await bookTableOperations.insertTitleErr();
  } catch (err) {
    console.log(`レコード追加エラー: ${err.message}`);
  }

  try {
    await bookTableOperations.getRecordErr();
  } catch (err) {
    console.log(`レコード取得エラー: ${err.message}`);
  }

  await bookTableOperations.deleteRecord();
};

err();
