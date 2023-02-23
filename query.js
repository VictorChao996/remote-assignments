const mysql = require('mysql2');
require('dotenv').config();

const connection = mysql.createConnection({
    host: 'appworksprogram.c63rwssh5h5i.ap-northeast-1.rds.amazonaws.com',
    user: process.env.USER,
    password: process.env.PASSWORD,
    datebase: 'assignment'

});

/**
 * * Connect with the database
 */
connection.connect((err)=>{
    if(err){
        console.error(err);
        return;
    }

    console.log('connection success.......');
});

/**
 * * 檢查connection是否成功建立，在執行query指令之前用。
 * @param {connection} connection 
 * @returns 
 */
function connectionCheck(connection){
    if (connection.state === 'disconnected') {
        console.error('Database connection is not established.');
        return false;
    }

    return true;
}

/**
 * * 列出DB中所有的Database (SHOW DATABASES)
 * @returns 
 */
const showDatabases = function(){
    if(!connectionCheck(connection))
        return;
    connection.query('SHOW DATABASES', (err, results)=>{
        if(err){
            console.error(err);
        }
        console.log(results);
    });
}

/**
 * * 切換到當前輸入的database (USE [database])
 * @param {String} databaseName 
 * @returns 
 */
const useDatabase = function(databaseName="assignment"){
    if(!connectionCheck(connection))
        return;
    connection.query(`USE ${databaseName}`, (err, results)=>{
        if(err){
            console.error(err);
        }
        console.log(results);
    });
}

/**
 * * 列出當前database中擁有的table (SHOW TABLES)
 * @returns 
 */
const showTables = function(){
    if(!connectionCheck(connection))
        return;
    connection.query('SHOW TABLES', (err, results)=>{
        if(err){
            console.error(err);
        }
        console.log(results);
    });
}

/** 
 * TODO: checkUserEmail()s
 * * 檢查user DB中是否存在該email(註: email 欄位為唯一)
 * @param {String} email 
 * @return {Boolean} isEmailExist
 */
const checkUserEmail = function(email){
    if(!connectionCheck(connection))
        return;
    connection.query('SELECT email FROM user WHERE email = ?',[email], (err, results)=>{
        if(err){
            console.error(err);
            return false;
        }
        if(results.length > 0)
            return true;
        return false;
    });
}

/**
 * * 根據傳入的user資料建立user
 * @param {String} name 
 * @param {String} email 
 * @param {String} password 
 * @return {boolean} success
 */
const insertUserData = function(name, email, password){
    if(!connectionCheck(connection))
        return false;
    connection.query('INSERT INTO user (name, email, password) VALUES (?, ?, ?)', [name, email, password], (err, results, fields)=>{
        if(err){
            console.error(err);
            return false;
        }
        console.log(results);
    });
    return true;
}

const getUserData = function(id){
    if(!connectionCheck(connection))
        return;
    connection.query('SELECT * FROM user WHERE id = ?', [id], (err, results)=>{
        if(err){
            console.error(err);
            return {};
        }
        console.log(results);
        return results;
    });
}

module.exports = {
    connection,
    showDatabases,
    useDatabase,
    showTables,
    insertUserData,
    getUserData,
    checkUserEmail
};