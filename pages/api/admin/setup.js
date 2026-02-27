import { getDbConnection } from '../../../lib/db'

export default async function handler(req, res) {
    if (req.query.secret !== process.env.SETUP_SECRET) {
        return res.status(401).json({ message: 'Unauthorized' })
    }

    try {
        const pool = await getDbConnection();

        // Create Settings table
        await pool.query(`
            CREATE TABLE IF NOT EXISTS store_settings (
                id INT AUTO_INCREMENT PRIMARY KEY,
                event_name VARCHAR(100) DEFAULT '',
                discount_enabled BOOLEAN DEFAULT false,
                base_price_per_500 INT DEFAULT 5000,
                discounted_price_per_500 INT DEFAULT 4000
            )
        `);

        // Insert default setting if empty
        const [settingsRows] = await pool.query('SELECT COUNT(*) as count FROM store_settings');
        if (settingsRows[0].count === 0) {
            await pool.query(`
                INSERT INTO store_settings (event_name, discount_enabled, base_price_per_500, discounted_price_per_500)
                VALUES ('Idul Fitri', false, 5000, 4000)
            `);
        }

        // Create Products table
        await pool.query(`
            CREATE TABLE IF NOT EXISTS store_products (
                id INT AUTO_INCREMENT PRIMARY KEY,
                name VARCHAR(100),
                points INT,
                quantity INT,
                badge VARCHAR(50),
                popular BOOLEAN DEFAULT false,
                image VARCHAR(255),
                image_filter VARCHAR(255)
            )
        `);

        // Create Commands table
        await pool.query(`
            CREATE TABLE IF NOT EXISTS store_product_commands (
                id INT AUTO_INCREMENT PRIMARY KEY,
                product_id INT,
                command VARCHAR(500),
                FOREIGN KEY (product_id) REFERENCES store_products(id) ON DELETE CASCADE
            )
        `);

        // Insert default products if empty
        const [productRows] = await pool.query('SELECT COUNT(*) as count FROM store_products');
        if (productRows[0].count === 0) {
            const defaultProducts = [
                { name: '500 Points', points: 500, quantity: 1, badge: '', popular: false, image: '/vendor/gift1.webp', filter: '' },
                { name: '1000 Points', points: 1000, quantity: 2, badge: '', popular: false, image: '/vendor/gift2.webp', filter: '' },
                { name: '2000 Points', points: 2000, quantity: 4, badge: '', popular: false, image: '/vendor/gift3.webp', filter: '' },
                { name: '3000 Points', points: 3000, quantity: 6, badge: '', popular: false, image: '/vendor/gift1.webp', filter: 'hue-rotate(90deg)' },
                { name: '4000 Points', points: 4000, quantity: 8, badge: 'PALING LARIS!', popular: true, image: '/vendor/gift3.webp', filter: 'hue-rotate(90deg)' },
                { name: '5000 Points', points: 5000, quantity: 10, badge: '', popular: false, image: '/vendor/gift1.webp', filter: 'hue-rotate(270deg)' },
                { name: '6000 Points', points: 6000, quantity: 12, badge: '', popular: false, image: '/vendor/gift3.webp', filter: 'invert(10%) sepia(80%) saturate(1500%) hue-rotate(300deg)' },
                { name: '7000 Points', points: 7000, quantity: 14, badge: '', popular: false, image: '/vendor/gift1.webp', filter: 'hue-rotate(45deg)' }
            ];

            for (const p of defaultProducts) {
                const [result] = await pool.query(`
                    INSERT INTO store_products (name, points, quantity, badge, popular, image, image_filter)
                    VALUES (?, ?, ?, ?, ?, ?, ?)
                `, [p.name, p.points, p.quantity, p.badge, p.popular, p.image, p.filter]);

                // Also insert a default command placeholder for each product
                await pool.query(`
                    INSERT INTO store_product_commands (product_id, command)
                    VALUES (?, ?)
                `, [result.insertId, `points add {name} ${p.points}`]);
            }
        }

        res.status(200).json({ message: 'Database Setup Complete!' })
    } catch (e) {
        console.error(e)
        res.status(500).json({ message: 'Error setting up DB', error: e.message })
    }
}
