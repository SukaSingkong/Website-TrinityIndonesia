import { getDbConnection } from './lib/db.js';
import dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });
dotenv.config();

const packages = [
    { name: 'Paket 1', points: 280, quantity: 5, badge: '', image: '/vendor/gift1.webp', filter: '' },
    { name: 'Paket 2', points: 680, quantity: 12, badge: '', image: '/vendor/gift2.webp', filter: '' },
    { name: 'Paket 3', points: 1520, quantity: 25, badge: '', image: '/vendor/gift3.webp', filter: '' },
    { name: 'Paket 4', points: 3240, quantity: 50, badge: 'PALING LARIS!', image: '/vendor/gift1.webp', filter: 'hue-rotate(90deg)' },
    { name: 'Paket 5', points: 6780, quantity: 100, badge: '', image: '/vendor/gift2.webp', filter: 'hue-rotate(270deg)' },
    { name: 'Paket 6', points: 13820, quantity: 190, badge: '', image: '/vendor/gift3.webp', filter: 'invert(10%) sepia(80%) saturate(1500%) hue-rotate(300deg)' }
];

async function updateDb() {
    try {
        const pool = await getDbConnection();
        console.log("Emptying store_product_commands...");
        await pool.query('DELETE FROM store_product_commands');
        console.log("Emptying store_products...");
        await pool.query('DELETE FROM store_products');

        console.log("Updating base price...");
        await pool.query('UPDATE store_settings SET base_price_per_500 = 1000, discounted_price_per_500 = 1000');

        console.log("Inserting new packages...");
        for (const pkg of packages) {
            const [res] = await pool.query(
                'INSERT INTO store_products (name, points, quantity, badge, popular, image, image_filter) VALUES (?, ?, ?, ?, ?, ?, ?)',
                [pkg.name, pkg.points, pkg.quantity, pkg.badge, pkg.badge !== '' ? 1 : 0, pkg.image, pkg.filter]
            );
            const productId = res.insertId;

            await pool.query(
                'INSERT INTO store_product_commands (product_id, command) VALUES (?, ?)',
                [productId, `points give {player} ${pkg.points}`]
            );
        }

        console.log("Successfully rebuilt point packages.");
        process.exit(0);
    } catch (e) {
        console.error(e);
        process.exit(1);
    }
}

updateDb();
