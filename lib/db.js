import mysql from 'mysql2/promise';

let pool;

export async function getDbConnection() {
    if (!pool) {
        pool = mysql.createPool({
            host: process.env.STORE_DB_HOST,
            port: process.env.STORE_DB_PORT || 3306,
            user: process.env.STORE_DB_USER,
            password: process.env.STORE_DB_PASSWORD,
            database: process.env.STORE_DB_NAME,
            waitForConnections: true,
            connectionLimit: 10,
            queueLimit: 0
        });
    }
    return pool;
}
