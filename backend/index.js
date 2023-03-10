const express = require("express");
const db = require("./query");
const validator = require("./validate");
const cors = require("cors");
require("dotenv").config();

const { validateDateFormat, checkInputFormat } = validator;

const app = express();
const port = 4000; //using port 4000 to avoid frontend development default server port 3000

db.showDatabases();
db.useDatabase("assignment");

app.use(
    cors({
        origin: "*",
        methods: ["GET", "POST", "PUT", "DELETE"],
        allowedHeaders: ["Content-Type", "Request-Date"],
        credentials: true,
    })
);
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

//* For the browser CORS error
// app.use((req, res, next) => {
//     res.setHeader("Access-Control-Allow-Origin", "*");
//     res.setHeader("Access-Control-Allow-Headers", "Content-Type, Request-Date");
//     res.setHeader("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE");
//     res.setHeader("Access-Control-Allow-Credentials", "true");
//     next();
// });
// app.use(express.json());
app.get("/", (req, res) => {
    res.send("<h1>This is root page.</h1>");
});

app.get("/healthcheck", (req, res) => {
    res.send("OK");
});

/**
 * * User Sign Up API
 * * app.post('/users') 註冊使用者資料
 */
app.post("/users", async (req, res) => {
    //* Request Header parts
    const requestDate = req.get("request-date");
    //若header有誤直接返回status code 400 to client
    if (
        req.headers["content-type"] !== "application/json" ||
        validateDateFormat(requestDate) == false
    ) {
        return res.status(400).json({
            error: "Client Error Requested",
        });
    }

    //* Request Body parts
    const { name, email, password } = req.body;
    const check = checkInputFormat(name, email, password);
    if (check) {
        // const emailExist = checkEmailExist(email);
        const emailExist = await db.checkUserEmail(email);
        console.log(
            "🚀 ~ file: index.js:52 ~ app.post ~ emailExist:",
            emailExist
        );
        if (emailExist) {
            return res.status(403).json({
                error: "Email already exists",
            });
        } else {
            const id = await db.registerUser(name, email, password);
            console.log("🚀 ~ file: index.js:59 ~ app.post ~ id:", id);
            if (id < 0) {
                return res
                    .status(500)
                    .send({ error: "something went wrong in MySQL database" });
            }
            return res.status(200).json({
                data: {
                    user: { id: id, name, email },
                    date: requestDate,
                },
            });
        }
    } else {
        return res.status(400).json({
            error: "Input is not valid.",
        });
    }
});

/**
 * * User Login API
 * * app.get(/users): 根據query返回使用者JSON資料
 */
app.get("/users", async (req, res, err) => {
    //* Request Header parts
    const requestDate = req.get("request-date");
    //若header有誤直接返回status code 400 to client
    if (
        req.headers["content-type"] !== "application/json" ||
        validateDateFormat(requestDate) == false
    ) {
        return res.status(400).json({
            error: "Client Error Requested",
        });
    }
    const userId = req.query.id;
    console.log("🚀 ~ file: index.js:95 ~ app.get ~ userId:", userId);
    var user = null;
    if (userId > 0) {
        user = await db.getUserData(userId);
        console.log("🚀 ~ file: index.js:97 ~ app.get ~ user:", user);
    }

    //* Request Body parts
    //若有結果則返回對應的JSON data，若user=null則回傳403 error
    if (user) {
        const { id, name, email } = user[0];
        console.log(
            "🚀 ~ file: index.js:96 ~ app.get ~ id,name,email:",
            id,
            name,
            email
        );
        res.status(200).json({
            data: {
                user: { id, name, email },
                date: requestDate,
            },
        });
    } else {
        res.status(403).json({
            error: "The user is not exist.",
        });
    }
});

app.listen(port, () => {
    console.log(`Example app listening on port ${port}`);
});
