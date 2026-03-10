import { getDbConnection } from './lib/db.js';
import dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });
dotenv.config();

async function migrate() {
    try {
        const pool = await getDbConnection();

        console.log("Adding discount_percentage column...");
        try {
            await pool.query('ALTER TABLE store_settings ADD COLUMN discount_percentage INT DEFAULT 0');
            console.log("Column added.");
        } catch (e) {
            console.log("Column might already exist.");
        }

        console.log("Dropping discounted_price_per_500 column...");
        try {
            await pool.query('ALTER TABLE store_settings DROP COLUMN discounted_price_per_500');
            console.log("Column dropped.");
        } catch (e) {
            console.log("Column might have already been dropped.");
        }

        process.exit(0);
    } catch (e) {
        console.error(e);
        process.exit(1);
    }
}

migrate();
