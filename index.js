const express = require('express');
const db = require('./query');
const validator = require('./validate');
require('dotenv').config();

const {validateName, validateEmail, validatePassword} = validator;

const app = express()
const port = 3000;

// connection.connect((err)=>{
//     if(err){
//         console.error(err);
//         return;
//     }
//     console.log(`connection success.......`);
//     connection.query(
//         'SHOW DATABASES',
//         function (err, results){
//             console.log("🚀 ~ file: index.js:27 ~ results:", results);
            
//         }
//     );
//     connection.query(
//         'USE assignment',
//         function (err, results){
//             console.log("🚀 ~ file: index.js:27 ~ results:", results);
            
//         }
//     );
//     connection.query(
//         'SHOW TABLES',
//         function (err, results){
//             console.log("🚀 ~ file: index.js:27 ~ results:", results);
            
//         }
//     );

    // connection.query('INSERT INTO user (name, email, password) VALUES (?, ?, ?)',['Victor', '456@gmail.com', 'Abc123'], (err, results, fields)=>{
    //     if(err){
    //         console.error(err);
    //     }
    // });
// })
// db.showDatabases((err, results) => {
//     console.log("🚀 ~ file: index.js:46 ~ db.showDatabases ~ results:", results)

// });
// db.useDatabase((err, results) => {
//     console.log("🚀 ~ file: index.js:50 ~ db.useDatabase ~ results:", results);
// });

// db.showTables((err, results) => {
//     console.log("🚀 ~ file: index.js:54 ~ db.showTables ~ results:", results);
// });
// db.showDatabases();
db.useDatabase();
// db.showTables();
// const name = "aaa";
const email = "abc12@gmail.com";
// const password = "abcDDD112";
// db.insertUser(name, email, password);

const {userId, userName, userEmail} = db.getUserData(1);

app.use(express.urlencoded({extended: true}));
app.use(express.json());
// app.use(express.json());
app.get('/', (req, res) => {
    res.send('<h1>This is root page.</h1>');
})

app.get('/healthcheck', (req, res) => {
    res.send('OK');
});



//TODO: User Login API
app.post('/users', (req, res) => {

    //若header有誤直接返回status code 400 to client
    if(res.headers['content-type'] !== 'application/json'){
        return res.status(400).json({
            "error": "Client Error Requested"
        });
    }

    const requestDate  = req.get('request-date');
    const {name, email, password} = req.body;
    const check = checkInputFormat(name, email, password);
    if(check){
        const emailExist = checkEmailExist(email);
        if(emailExist){
            return res.status(403).json({
                "error": "Email already exists"
            });
        }else{
            const id = registerUser(name, email, password);
            return res.status(200).json({
                "data":{
                    "user": {id: id, email, password},
                    "date": requestDate
                }
            });
        }
    }
    else{
        return res.status(400).json({
            'error':'Input is not valid.',
        });
    }
    

});

/**
 * TODO: User Login API
 * * app.get(/users): 根據query返回使用者JSON資料
 */
app.get('/users', (req,res,err)=>{
    
    //if the headers content type is wrong, send the 400 error to client.
    if(req.headers['content-type'] !== 'application/json'){
        return res.status(400).json({
            'error': 'Client Error Requested'
        })
    }
    const userId = req.query.id;
    const requestDate  = req.get('request-date');
    const user = getUserDataFromDatabase(userId);

    if(user){
        res.status(200).json({
            "data":{
                user,
                "date": requestDate
            }
        });
    }else{
        res.status(403).json({
            "error": "The user is not exist."
        });
    }

    res.send(`User ${id}`);
});


app.listen(port, () => {
    console.log(`Example app listening on port ${port}`)
});


function checkInputFormat(name, email, password) {
    console.log("🚀 ~ file: index.js:94 ~ checkInputFormat ~ name, email, password:", name, email, password)
    
    //若有一string為空，則回傳false
    if(validateName(name) && validateEmail(email) && validatePassword(password)){
        return true;
    }
    return false;
}

/**
 * * 根據傳入的email檢查是否已經存在DB中
 * TODO: 檢查email是否已經註冊(已存在DB中)
 * @param {String} email 
 * @returns {boolean} 
 */
function checkEmailExist(email){
    if(db.checkUserEmail(email))
        return true;
    return false;
}

/**
 * TODO: 註冊新User資料到DB中
 * * registerUser(): 根據創建的結果返回userID
 * @param {String} name 
 * @param {String} email 
 * @param {String} password 
 * @return {String} id
 */
function registerUser(name, email, password){
    db.insertUserData(name, email, password);
    const id = "1";
    return id;
} 

//TODO: 檢查DB中的user資料並返回，若無則回傳空{}
function getUserDataFromDatabase(userId){
    return {};
}