import mysql from 'mysql2/promise';

let pool;

export async function getLbDbConnection() {
    if (!pool) {
        pool = mysql.createPool({
            host: process.env.LB_DB_HOST,
            port: process.env.LB_DB_PORT || 3306,
            user: process.env.LB_DB_USER,
            password: process.env.LB_DB_PASSWORD,
            database: process.env.LB_DB_NAME,
            waitForConnections: true,
            connectionLimit: 10,
            queueLimit: 0
        });
    }
    return pool;
}
