import sqlite from 'sqlite3';

import sqlite from './sqlite.js';

export default class SqliteLinker {
  constructor(filename) {
    this.filename = filename;
    this.db = null;
  }

  // подключает базу данных и если что выводит ошибку
  async connect() {
    this.db = new sqlite.Database(this.filename, function (err) {
      if (err) {
        console.log(JSON.stringify(err));
        return;
      }
      console.log(`Database is started... on the ${this.filename}`);
    });
    return this.db;
  }

  /* 
    Объявляет ассинхронный метод. 
    Делает функцию ассинхронной.
    Выполняет запрос и проверяет наличие ошибки
    Если ошибка есть - reject, если нет - resolve
  */
  async run(sql, params = []) {
    const result = await new Promise(function (resolve, reject) {
      this.db.run(sql, params, function (err) {
        if (err) {
          console.log(err);
          reject(err);
        }
        resolve({
          lastId: this.lastID,
          changes: this.changes,
        });
      });
    });

    return result;
  }

  /* Объявляет ассинхронный метод. 
    Делает функцию ассинхронной.
    Если ошибка есть - reject, то прерывается return
    Если ошибки нет, то через resolve - получаем строку
  */
  async get(sql, params = []) {
    const result = await new Promise(function (resolve, reject) {
      this.db.get(sql, params, function (err, row) {
        if (err) {
          console.log(err);
          reject(err);
          return;
        }

        resolve(row);
      });
    });

    return result;
  }
  /* Объявляет ассинхронный метод для получения всех строк
внутри Promise, который оборачивает вызов this.db.all
Если ошибка есть - reject, то прерывается return
    Если ошибки нет, то через resolve - получаем строки
  */
  async all(sql, params = []) {
    const result = await new Promise(function (resolve, reject) {
      this.db.all(sql, params, function (err, rows) {
        if (err) {
          console.log(err);
          reject(err);
          return;
        }

        resolve(rows);
      });
    });

    return result;
  }
  // закрывает соединение в базой данных.
  async close() {
    return new Promise(function (resolve, reject) {
      this.db.close(function (err) {
        if (err) {
          console.log(err);
          reject(err);
          return;
        }
        resolve();
      });
    });
  }

  createPlaceholders(arr) {
    return arr.map(() => '?').join(',');
  }

  createSetBlock(properties) {
    const values = [];

    const block = Object.entries(properties)
      .map(([key, value]) => {
        if (isEmpty(value)) return null;

        values.push(value);
        return `${key} = ?`;
      })
      .filter((p) => p !== null)
      .join(', ');

    return { block, values };
  }
}
