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

setInterval(() => {
    pool.query("SELECT * FROM user WHERE id < 10", (err, rows) => {
        if (err) {
            console.error("Error pinging MySQL database: ", err);
        } else {
            console.log("MySQL database ping successful.");
        }
    });
}, 5000);
