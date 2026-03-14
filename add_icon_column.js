require('dotenv').config();
const mysql = require('mysql2/promise');

async function main() {
    const conn = await mysql.createConnection({
        host: process.env.STORE_DB_HOST,
        port: process.env.STORE_DB_PORT,
        user: process.env.STORE_DB_USER,
        password: process.env.STORE_DB_PASSWORD,
        database: process.env.STORE_DB_NAME,
    });

    try {
        await conn.execute("ALTER TABLE store_updates ADD COLUMN icon VARCHAR(100) DEFAULT 'ri-sparkling-2-line' AFTER type");
        console.log('✅ Column `icon` added to store_updates successfully!');
    } catch (e) {
        if (e.code === 'ER_DUP_FIELDNAME') {
            console.log('ℹ️ Column `icon` already exists, skipping.');
        } else {
            console.error('❌ Error:', e.message);
        }
    }

    await conn.end();
}

main();
