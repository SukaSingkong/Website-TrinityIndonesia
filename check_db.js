import { getDbConnection } from './lib/db.js';
import dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });
dotenv.config();

async function check() {
    try {
        const pool = await getDbConnection();
        const [products] = await pool.query('SELECT * FROM store_products');
        const [settings] = await pool.query('SELECT * FROM store_settings');
        console.log("PRODUCTS:\n", JSON.stringify(products, null, 2));
        console.log("SETTINGS:\n", JSON.stringify(settings, null, 2));
        process.exit(0);
    } catch (e) {
        console.error(e);
        process.exit(1);
    }
}

check();
