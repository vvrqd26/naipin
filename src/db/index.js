var db
import { syncDb } from "../state";
const openDb = window.indexedDB.open("milk", 1);
openDb.onsuccess = function (event) {
    db = event.target.result;
    console.log("db opened");
    // 确保数据库初始化完成后再导出
    window.dbReady = true;
    syncDb();
}
openDb.onupgradeneeded = function (event) {
  db = event.target.result;
  if (!db.objectStoreNames.contains("milk")) {
      const dbStore = db.createObjectStore("milk", { keyPath: "id", autoIncrement: true });
      dbStore.createIndex("date", "date", { unique: true });
      dbStore.createIndex("volume", "volume", { unique: false });
      dbStore.createIndex("remarks", "remarks", { unique: false });
  }
}
openDb.onerror = function (event) {
    console.log("db error", event.target.errorCode);
}

export async function addMilkHistoryToDb(volume, remarks) {
  return new Promise((resolve,reject)=> {
    if (!window.dbReady) {
      return reject(new Error('Database not initialized yet'));
    }
    const transaction = db.transaction(["milk"], "readwrite");
    const store = transaction.objectStore("milk");
    
    store.add({
        date: Date.now(),
        volume: volume,
        remarks: remarks,
    });

    transaction.oncomplete = function () {
        resolve()
    }
    transaction.onerror = function () {
        reject()
    }
  })
}

export async function removeMilkHistoryFromDb(id) {
  return new Promise((resolve,reject)=> {
    if (!window.dbReady) {
      return reject(new Error('Database not initialized yet'));
    }
    const transaction = db.transaction(["milk"], "readwrite");
    const store = transaction.objectStore("milk");
    store.delete(id);

    transaction.oncomplete = function () {
        resolve()
    }
    transaction.onerror = function () {
        reject()
    }
  })
}

export async function getMilkHistoryFromDb() {
  return new Promise((resolve,reject)=> {
    if (!window.dbReady) {
      return reject(new Error('Database not initialized yet'));
    }
    const transaction = db.transaction(["milk"], "readonly");
    const store = transaction.objectStore("milk");
    const request = store.getAll();
    request.onsuccess = function () {
      resolve(request.result)
    }
    request.onerror = function () {
      reject(request.error)
    }
  })
}

export {
    db
}