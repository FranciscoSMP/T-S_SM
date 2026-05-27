require('dotenv').config();
const mysql = require('mysql2/promise');

const config = {
    host: process.env.DB_SERVER, // Se asume que DB_SERVER almacena el host (ej. 'localhost')
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    port: process.env.DB_PORT,
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
};

const poolPromise = mysql.createPool(config);

poolPromise.getConnection()
    .then(connection => {
        console.log(`Conectado a la base de datos MySQL ${process.env.DB_NAME}`);
        connection.release();
    })
    .catch(err => console.log('Error en la conexión a la base de datos:', err));

module.exports = { poolPromise };