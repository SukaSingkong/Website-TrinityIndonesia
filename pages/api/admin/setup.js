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
                base_price_per_500 INT DEFAULT 1000,
                discount_percentage INT DEFAULT 0,
                popup_bg_image VARCHAR(500) DEFAULT '',
                popup_title VARCHAR(200) DEFAULT '',
                popup_subtitle VARCHAR(500) DEFAULT '',
                popup_discount_text VARCHAR(200) DEFAULT '20%'
            )
        `);

        // Add popup columns if they don't exist (migration for existing tables)
        const columnsToAdd = [
            { name: 'popup_bg_image', type: "VARCHAR(500) DEFAULT ''" },
            { name: 'popup_title', type: "VARCHAR(200) DEFAULT ''" },
            { name: 'popup_subtitle', type: "VARCHAR(500) DEFAULT ''" },
            { name: 'popup_discount_text', type: "VARCHAR(200) DEFAULT '20%'" },
        ];
        for (const col of columnsToAdd) {
            try {
                await pool.query(`ALTER TABLE store_settings ADD COLUMN ${col.name} ${col.type}`);
            } catch (e) {
                // Column likely already exists, ignore
            }
        }

        // Insert default setting if empty
        const [settingsRows] = await pool.query('SELECT COUNT(*) as count FROM store_settings');
        if (settingsRows[0].count === 0) {
            await pool.query(`
                INSERT INTO store_settings (event_name, discount_enabled, base_price_per_500, discount_percentage)
                VALUES ('Idul Fitri', false, 1000, 0)
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

        // Create Purchases Log table
        await pool.query(`
            CREATE TABLE IF NOT EXISTS store_purchases (
                id INT AUTO_INCREMENT PRIMARY KEY,
                player_name VARCHAR(100),
                product_name VARCHAR(100),
                points_purchased INT,
                commands_executed TEXT,
                status VARCHAR(50) DEFAULT 'success',
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            )
        `);

        // Insert default products if empty
        const [productRows] = await pool.query('SELECT COUNT(*) as count FROM store_products');
        if (productRows[0].count === 0) {
            const defaultProducts = [
                { name: 'Paket 1', points: 280, quantity: 5, badge: '', popular: false, image: '/vendor/gift1.webp', filter: '' },
                { name: 'Paket 2', points: 680, quantity: 12, badge: '', popular: false, image: '/vendor/gift2.webp', filter: '' },
                { name: 'Paket 3', points: 1520, quantity: 25, badge: '', popular: false, image: '/vendor/gift3.webp', filter: '' },
                { name: 'Paket 4', points: 3240, quantity: 50, badge: 'PALING LARIS!', popular: true, image: '/vendor/gift1.webp', filter: 'hue-rotate(90deg)' },
                { name: 'Paket 5', points: 6780, quantity: 100, badge: '', popular: false, image: '/vendor/gift2.webp', filter: 'hue-rotate(270deg)' },
                { name: 'Paket 6', points: 13820, quantity: 190, badge: '', popular: false, image: '/vendor/gift3.webp', filter: 'invert(10%) sepia(80%) saturate(1500%) hue-rotate(300deg)' }
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
                `, [result.insertId, `points give {player} ${p.points}`]);
            }
        }

        // Create Updates table
        await pool.query(`
            CREATE TABLE IF NOT EXISTS store_updates (
                id INT AUTO_INCREMENT PRIMARY KEY,
                month_group VARCHAR(100),
                title VARCHAR(200),
                type VARCHAR(50),
                content JSON,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            )
        `);

        // Create Verified Players table
        await pool.query(`
            CREATE TABLE IF NOT EXISTS verified_players (
                id INT AUTO_INCREMENT PRIMARY KEY,
                nickname VARCHAR(100) NOT NULL UNIQUE,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            )
        `);

        // Seed first verified player
        const [verifiedRows] = await pool.query('SELECT COUNT(*) as count FROM verified_players');
        if (verifiedRows[0].count === 0) {
            await pool.query(`INSERT INTO verified_players (nickname) VALUES (?)`, ['LouYz_']);
        }

        res.status(200).json({ message: 'Database Setup Complete!' })
    } catch (e) {
        console.error(e)
        res.status(500).json({ message: 'Error setting up DB', error: e.message })
    }
}
