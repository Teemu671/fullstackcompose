let mysql = require('mysql2');

const newPool = mysql.createPool({
    user: process.env.MYSQL_USER,
    host: process.env.MYSQL_HOST,
    database: process.env.MYSQL_NAME,
    password: process.env.MYSQL_PASSWORD,
    port: 3306
})

module.exports = {
  newPool
}
