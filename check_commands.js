import { getDbConnection } from './lib/db.js';
import dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });
dotenv.config();

async function check() {
    try {
        const pool = await getDbConnection();
        const [commands] = await pool.query('SELECT * FROM store_product_commands');
        console.log("COMMANDS:\n", JSON.stringify(commands, null, 2));
        process.exit(0);
    } catch (e) {
        console.error(e);
        process.exit(1);
    }
}

check();
