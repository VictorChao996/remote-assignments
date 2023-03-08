const mysql = require("mysql2");
require("dotenv").config();

//!: 目前沒有處理連線斷開後的動作，預計將此file中的邏輯改成使用createPool來處理
const connection = mysql.createConnection({
    host: "appworksprogram.c63rwssh5h5i.ap-northeast-1.rds.amazonaws.com",
    user: process.env.MYSQL_USER,
    password: process.env.PASSWORD,
    database: "assignment",
});

/**
 * * Connect with the database
 */
connection.connect((err) => {
    if (err) {
        console.error(err);
        return;
    }

    console.log("connection success.......");
});

/**
 * * 檢查connection是否成功建立，在執行query指令之前用。
 * @param {connection} connection
 * @returns
 */
function connectionCheck(connection) {
    if (connection.state === "disconnected") {
        console.error("Database connection is not established.");
        return false;
    }

    return true;
}

/**
 * - 列出DB中所有的Database (SHOW DATABASES)
 * - Async function
 *
 */
const showDatabases = async function () {
    if (!connectionCheck(connection)) return;
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
    if (!connectionCheck(connection)) return;

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
    if (!connectionCheck(connection)) return;
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
    if (!connectionCheck(connection)) return;
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
    if (!connectionCheck(connection)) return false;
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
    if (!connectionCheck(connection)) {
        console.error("Connection check failed--------------");
        return {};
    }
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
        connection.query("SHOW DATABASES", (err, results, fields) => {
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
        connection.query(`USE ${databaseName}`, (err, results) => {
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
        connection.query("SHOW TABLES", (err, results) => {
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
        connection.query(
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
        connection.query(
            "SELECT * FROM user WHERE id = ?",
            [id],
            (err, results) => {
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
            }
        );
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
        connection.query(
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
    connection,
    showDatabases,
    useDatabase,
    showTables,
    registerUser,
    getUserData,
    checkUserEmail,
};
