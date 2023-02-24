const express = require('express');
const db = require('./query');
const validator = require('./validate');
require('dotenv').config();

const {validateDateFormat, checkInputFormat} = validator;

const app = express()
const port = 3000;

db.showDatabases();
db.useDatabase('assignment');

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
app.post('/users', async (req, res) => {

    //* Request Header parts
    const requestDate  = req.get('request-date');
    //若header有誤直接返回status code 400 to client
    if((req.headers['content-type'] !== 'application/json') || (validateDateFormat(requestDate) == false)){
        return res.status(400).json({
            "error": "Client Error Requested"
        });
    }

    //* Request Body parts
    const {name, email, password} = req.body;
    const check = checkInputFormat(name, email, password);
    if(check){
        // const emailExist = checkEmailExist(email);
        const emailExist = await db.checkUserEmail(email);
        console.log("🚀 ~ file: index.js:52 ~ app.post ~ emailExist:", emailExist);
        if(emailExist){
            return res.status(403).json({
                "error": "Email already exists"
            });
        }else{
            const id = await db.registerUser(name, email, password);
            console.log("🚀 ~ file: index.js:59 ~ app.post ~ id:", id)
            if(id < 0)
                return res.send('something went wrong');
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
app.get('/users', async (req,res,err)=>{
    
    //* Request Header parts
    const requestDate  = req.get('request-date');
    //若header有誤直接返回status code 400 to client
    if((req.headers['content-type'] !== 'application/json') || (validateDateFormat(requestDate) == false)){
        return res.status(400).json({
            "error": "Client Error Requested"
        });
    }
    const userId = req.query.id;
    // const user = await getUserDataFromDatabase(userId);
    const user = await db.getUserData(userId);
    console.log("🚀 ~ file: index.js:88 ~ app.get ~ user:", user)

    //* Request Body parts
    //若有結果則返回對應的JSON data，若user=null則回傳403 error
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

});


app.listen(port, () => {
    console.log(`Example app listening on port ${port}`)
});


