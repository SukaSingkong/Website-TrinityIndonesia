const mysql = require('mysql2/promise');
require('dotenv').config({ path: '.env' });

async function query() {
    const pool = mysql.createPool({
        host: process.env.STORE_DB_HOST,
        port: process.env.STORE_DB_PORT || 3306,
        user: process.env.STORE_DB_USER,
        password: process.env.STORE_DB_PASSWORD,
        database: process.env.STORE_DB_NAME,
    });

    const [rows] = await pool.query('SELECT * FROM store_purchases ORDER BY created_at DESC LIMIT 5');
    console.log("Recent purchases:");
    console.table(rows);
    process.exit(0);
}
query();
