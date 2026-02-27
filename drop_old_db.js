const mysql = require('mysql2/promise');
require('dotenv').config({ path: '.env' });

async function dropOldTables() {
    try {
        const pool = await mysql.createPool({
            host: process.env.LB_DB_HOST,
            user: process.env.LB_DB_USER,
            password: process.env.LB_DB_PASSWORD,
            database: process.env.LB_DB_NAME,
            waitForConnections: true,
            connectionLimit: 10,
            queueLimit: 0
        });

        console.log("Connected to old DB.");

        await pool.query('DROP TABLE IF EXISTS store_product_commands');
        await pool.query('DROP TABLE IF EXISTS store_products');
        await pool.query('DROP TABLE IF EXISTS store_settings');
        await pool.query('DROP TABLE IF EXISTS store_purchases'); // Just in case

        console.log("Old tables successfully dropped from LibertyBans DB!");
        process.exit(0);
    } catch (e) {
        console.error("Error dropping tables from old DB:", e);
        process.exit(1);
    }
}

dropOldTables();
