import { getDbConnection } from '../../lib/db'

export default async function handler(req, res) {
    if (req.method !== 'GET') {
        return res.status(405).json({ message: 'Method not allowed' })
    }

    try {
        const pool = await getDbConnection();
        const [settingsRows] = await pool.query('SELECT * FROM store_settings LIMIT 1');
        const [productRows] = await pool.query('SELECT * FROM store_products ORDER BY id ASC');

        const [topSupporterRows] = await pool.query(`
            SELECT player_name, SUM(points_purchased) as total_points
            FROM store_purchases
            WHERE status = 'success' AND MONTH(created_at) = MONTH(CURRENT_DATE()) AND YEAR(created_at) = YEAR(CURRENT_DATE())
            GROUP BY player_name
            ORDER BY total_points DESC
            LIMIT 1
        `);

        const [topSupporterAllTimeRows] = await pool.query(`
            SELECT player_name, SUM(points_purchased) as total_points
            FROM store_purchases
            WHERE status = 'success'
            GROUP BY player_name
            ORDER BY total_points DESC
            LIMIT 1
        `);

        const [recentPaymentRows] = await pool.query(`
            SELECT player_name, MAX(created_at) as latest_purchase
            FROM store_purchases
            WHERE status = 'success'
            GROUP BY player_name
            ORDER BY latest_purchase DESC
            LIMIT 10
        `);

        const dbSettings = settingsRows[0] || {
            event_name: 'Store', discount_enabled: 0,
            base_price_per_500: 5000, discounted_price_per_500: 4000
        };

        const products = productRows.map(p => {
            const basePrice = p.quantity * dbSettings.base_price_per_500;
            const currentPrice = dbSettings.discount_enabled ? (p.quantity * dbSettings.discounted_price_per_500) : basePrice;

            return {
                ...p,
                imageStyle: { filter: p.image_filter || '' },
                originalPrice: `Rp ${basePrice.toLocaleString('id-ID')}`,
                price: `Rp ${currentPrice.toLocaleString('id-ID')}`
            };
        });

        res.status(200).json({
            storeSettings: dbSettings,
            storeProducts: products,
            topSupporter: topSupporterRows.length > 0 ? topSupporterRows[0].player_name : null,
            topSupporterPoints: topSupporterRows.length > 0 ? topSupporterRows[0].total_points : null,
            topSupporterAllTime: topSupporterAllTimeRows.length > 0 ? topSupporterAllTimeRows[0].player_name : null,
            topSupporterAllTimePoints: topSupporterAllTimeRows.length > 0 ? topSupporterAllTimeRows[0].total_points : null,
            recentPayments: recentPaymentRows.map(r => r.player_name)
        });
    } catch (e) {
        console.error(e);
        res.status(500).json({
            error: true,
            storeSettings: { event_name: 'Error', discount_enabled: 0 },
            storeProducts: [],
            topSupporter: null,
            topSupporterPoints: null,
            topSupporterAllTime: null,
            topSupporterAllTimePoints: null,
            recentPayments: []
        });
    }
}
