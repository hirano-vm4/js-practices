import timers from "timers/promises";
import * as bookTableOperations from "./table_function.js";

// 2. Promise(エラーなし)
bookTableOperations
  .createTable()
  .then(() => bookTableOperations.insertTitle())
  .then(() => bookTableOperations.getId())
  .then(() => bookTableOperations.getRecord())
  .then(() => bookTableOperations.deleteRecord());

await timers.setTimeout(1000);

// 2. Promise(エラーあり)
bookTableOperations
  .createTable()
  .then(() => bookTableOperations.insertTitleErr())
  .catch((err) => console.log(`レコード追加エラー: ${err.message}`))
  .then(() => bookTableOperations.getRecordErr())
  .catch((err) => console.log(`レコードの取得エラー: ${err.message}`))
  .then(() => bookTableOperations.deleteRecord());
