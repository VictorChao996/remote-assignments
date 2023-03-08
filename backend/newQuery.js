const mysql = require("mysql2");
require("dotenv").config();

const config = {
    connectionLimit: 10, // maximum number of connections to create at once
    host: "appworksprogram.c63rwssh5h5i.ap-northeast-1.rds.amazonaws.com",
    user: process.env.MYSQL_USER,
    password: process.env.PASSWORD,
    database: "assignment",
};
const pool = mysql.createPool(config);
console.log("🚀 ~ file: newQuery.js:12 ~ pool:", pool);

//持續使用query確保連線不會因為長時間idle而自動關閉
setInterval(() => {
    pool.query("SELECT * FROM user WHERE id < 10", (err, rows) => {
        if (err) {
            console.error("Error pinging MySQL database: ", err);
        } else {
            console.log("MySQL database ping successful.");
            const now = new Date();
            console.log(now.toUTCString());
        }
    });
}, 5000);

//TODO: 1. 測試DB是否自動斷開連接  2.將query.js 中的內容改成 pool.query()
//* 使用pool.query()就不需要處理連線錯誤的狀況，因為mysql2 模組會自動處理這些錯誤 *//

/**
 * - 列出DB中所有的Database (SHOW DATABASES)
 * - Async function
 *
 */
const showDatabases = async function () {
    try {
        const promise = await showDatabasesQuery();
    } catch (err) {
        console.error(err);
    }
};

/**
 * - 切換到當前輸入的database (USE [database])
 * - Async function
 * @param {String} databaseName
 * @returns
 */
const useDatabase = async function (databaseName) {
    console.log(databaseName);

    try {
        const result = await useDatabaseQuery(databaseName);
        return result;
    } catch (err) {
        console.error(err);
    }
};

/**
 * - 列出當前database中擁有的table (SHOW TABLES)
 * - Async functions
 * @returns
 */
const showTables = async function () {
    try {
        const tables = await showTablesQuery();
        return tables;
    } catch (err) {
        console.error(err);
    }
};

/**
 * - 檢查user DB中是否存在該email(註: email 欄位為唯一)
 * @param {String} email
 * @return {Boolean} isEmailExist
 */
const checkUserEmail = async function (email) {
    try {
        const emailExist = await getUserEmailQuery(email);
        console.log(
            "🚀 ~ file: query.js:101 ~ checkUserEmail ~ emailExist:",
            emailExist
        );
        return emailExist;
    } catch (err) {
        console.error(err);
    }
};

/**
 * - 根據傳入的user資料建立user，並返回UserId
 * @param {String} name
 * @param {String} email
 * @param {String} password
 * @return {int} userId
 */
const registerUser = async function (name, email, password) {
    try {
        const insertData = await insertUserDataQuery(name, email, password);
        return insertData.insertId;
    } catch (err) {
        console.error(err);
        return -1;
    }
};

/**
 * - 根據UserId去搜尋DB並獲取data(若無會返回null)
 * - Async function
 * @param {String} id
 * @return {object} correspond user object in DB
 */
const getUserData = async function (id) {
    try {
        const userData = await getUserByIdQuery(id);
        console.log(
            "🚀 ~ file: query.js:136 ~ getUserData ~ userData:",
            userData
        );
        // 當找不到userData時
        if (userData.length === 0) {
            return null;
        }
        return userData;
    } catch (err) {
        console.error(err);
        return {};
    }
};
/*
 * -------------我是分隔線----------------------------------
 */

/**
 * - 執行SHOW DATABASE 的 Query 指令
 * @returns {Promise}
 */
function showDatabasesQuery() {
    return new Promise((resolve, reject) => {
        pool.query("SHOW DATABASES", (err, results, fields) => {
            if (err) {
                console.error(err);
                reject(err);
            }
            console.log(results);
            resolve(results);
        });
    });
}
/**
 * - 執行USE DATABASE 的 Query 指令
 * @param {String} databaseName
 * @return {Promise}
 */
function useDatabaseQuery(databaseName) {
    return new Promise((resolve, reject) => {
        pool.query(`USE ${databaseName}`, (err, results) => {
            if (err) {
                console.error(err);
                reject(err);
            }
            console.log(results);
            resolve();
        });
    });
}
/**
 * - 執行SHOW TABLES 的 Query 指令
 * @return {Promise}
 */
function showTablesQuery() {
    return new Promise((resolve, reject) => {
        pool.query("SHOW TABLES", (err, results) => {
            if (err) {
                console.error(err);
                reject(err);
            }
            console.log(results);
            resolve(results);
        });
    });
}

/**
 * - 執行查找email的 Query 指令
 * @param {String} email
 * @returns
 */
function getUserEmailQuery(email) {
    return new Promise((resolve, reject) => {
        pool.query(
            "SELECT email FROM user WHERE email = ?",
            [email],
            (err, results) => {
                if (err) {
                    console.error(err);
                    reject(err);
                }
                if (results.length > 0) {
                    resolve(true);
                    return;
                }
                resolve(false);
            }
        );
    });
}

/**
 * - 執行Query的function，return一個Promise
 * @param {String} id
 * @return {Promise} query執行
 */
function getUserByIdQuery(id) {
    return new Promise((resolve, reject) => {
        pool.query("SELECT * FROM user WHERE id = ?", [id], (err, results) => {
            if (err) {
                console.log(
                    "🚀 ~ file: query.js:153 ~ connection.query ~ err:",
                    err
                );
                console.error(err);
                reject(err);
            }
            console.log(results);
            resolve(results);
        });
    });
}

/**
 * - 執行新增userData的 Query 指令
 * @param {String} name
 * @param {String} email
 * @param {String} password
 * @returns
 */
function insertUserDataQuery(name, email, password) {
    return new Promise((resolve, reject) => {
        pool.query(
            "INSERT INTO user (name, email, password) VALUES (?, ?, ?)",
            [name, email, password],
            (err, results, fields) => {
                if (err) {
                    console.error(err);
                    reject(err);
                }
                console.log(results);
                resolve(results);
            }
        );
    });
}

module.exports = {
    showDatabases,
    useDatabase,
    showTables,
    registerUser,
    getUserData,
    checkUserEmail,
};
