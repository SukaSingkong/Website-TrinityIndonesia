const mysql = require('mysql2/promise');
require('dotenv').config({ path: '.env' });

async function updateDB() {
    try {
        const pool = await mysql.createPool({
            host: process.env.DB_HOST,
            user: process.env.DB_USER,
            password: process.env.DB_PASSWORD,
            database: process.env.DB_NAME,
            waitForConnections: true,
            connectionLimit: 10,
            queueLimit: 0
        });

        console.log("Connected to DB.");

        await pool.query(`
            UPDATE store_product_commands 
            SET command = REPLACE(command, '{name}', '{player}')
        `);

        console.log("Commands successfully updated to use {player} instead of {name}!");
        process.exit(0);
    } catch (e) {
        console.error("Error updating DB:", e);
        process.exit(1);
    }
}

updateDB();
