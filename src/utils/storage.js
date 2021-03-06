
import SQLite from 'react-native-sqlite-2';

const db = SQLite.openDatabase('main.db', '1.0', '', 1);

//query execution function with promise
const ExecuteQuery = (sql, params = []) => {
  return new Promise((resolve, reject) => {
    db.transaction(trans => {
      trans.executeSql(
        sql,
        params,
        (trans, results) => {
          resolve(results);
        },
        error => {
          console.warn("error in databse")
          reject(error);
        },
      );
    });
  });
};

const dropTable = async () => {
  return await ExecuteQuery(
    `DROP TABLE IF EXISTS tempData`,
  );
};

// look here for sqlite time formatting - https://sqlite.org/lang_datefunc.html

const createTable = async () => {
  return await ExecuteQuery(
    `CREATE TABLE IF NOT EXISTS tempData(time DATETIME DEFAULT (datetime('now','localtime')) PRIMARY KEY, temperature REAL, humidity REAL)`,
  );
};

// function for adding temp data into the table with promise
export const addTempData = async (temperature, humidity) => {
  return await ExecuteQuery(
    `INSERT INTO tempData (temperature, humidity) VALUES (${temperature}, ${humidity});`,
  );
};

export const logAllTempData = async () => {
  const res = await ExecuteQuery(
    `select time, temperature, humidity from tempData`,
  );
  res.rows._array.forEach(el => {
    console.log(el.time, el.temperature, el.humidity);
  });
};

export const setMQTTAuthToken = async(val=>{

})

const task = async () => {
  // await dropTable()
  await createTable()
  // await addTempData(102.2, 50.5);
  logAllTempData();
};
task();



