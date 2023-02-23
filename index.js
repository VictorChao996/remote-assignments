const express = require('express');
const mysql = require('mysql2');
const validator = require('./validate');
const {validateName, validateEmail, validatePassword} = validator;
require('dotenv').config();

const app = express()
const port = 3000;
const connection = mysql.createConnection({
    host: 'appworksprogram.c63rwssh5h5i.ap-northeast-1.rds.amazonaws.com',
    user: process.env.PASSWORD,
    password: process.env.PASSWORD,
    datebase: 'assignment'
});

connection.query(
    'SHOW DATABASES',
    function (err,results) {
        // console.log("🚀 ~ file: index.js:15 ~ err:", err)
        // console.log("🚀 ~ file: index.js:14 ~ results:", results);
    }
);

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
    const requestDate  = req.get('request-date');
    const {name, email, password} = req.body;
    const check = checkInputFormat(name, email, password);
    if(check){
        const emailExist = checkEmailExist(email);
        if(emailExist){
            res.status(403).json({
                "error": "Email already exists"
            });
        }
    }
    else{
        res.status(400).json({
            'error':'Input is not valid.',
        });
    }
    

    res.json({
        "data":{
            "user": {id: 8787, email, password},
            "date": requestDate
        }
    });
});

//TODO: User Query API
app.get('/users', (req,res)=>{
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
//TODO: 檢查email是否已經註冊(已存在DB中)
function checkEmailExist(email){
    return false;
}

//TODO: 檢查DB中的user資料並返回，若無則回傳空{}
function getUserDataFromDatabase(userId){
    return {};
}