require("dotenv").config();
const mysql = require("mysql2");

const pool = mysql.createPool({
  uri: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false
  },
  waitForConnections: true,
  connectionLimit: 10
});

console.log("DB connection done");

module.exports = pool.promise();