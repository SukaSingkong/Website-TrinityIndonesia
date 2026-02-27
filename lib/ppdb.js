import mysql from 'mysql2/promise';

let pool;

export async function getPpDbConnection() {
    if (!pool) {
        pool = mysql.createPool({
            host: process.env.PP_DB_HOST,
            port: process.env.PP_DB_PORT || 3306,
            user: process.env.PP_DB_USER,
            password: process.env.PP_DB_PASSWORD,
            database: process.env.PP_DB_NAME,
            waitForConnections: true,
            connectionLimit: 5,
            queueLimit: 0
        });
    }
    return pool;
}
