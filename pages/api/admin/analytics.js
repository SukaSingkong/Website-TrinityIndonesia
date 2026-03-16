import { getDbConnection } from '../../../lib/db'
import { getServerSession } from "next-auth/next"
import { authOptions } from "../auth/[...nextauth]"

export default async function handler(req, res) {
    const session = await getServerSession(req, res, authOptions)
    if (!session) return res.status(401).json({ message: "Unauthorized" })

    if (req.method !== 'GET') return res.status(405).json({ message: 'Method Not Allowed' })

    const pool = await getDbConnection()

    try {
        // Ensure rupiah_paid column exists and backfill old records
        try {
            await pool.query(`ALTER TABLE store_purchases ADD COLUMN rupiah_paid INT DEFAULT 0`);
        } catch (e) { /* column already exists */ }
        try {
            const [stRows] = await pool.query('SELECT base_price_per_500 FROM store_settings LIMIT 1');
            const bpp = stRows[0]?.base_price_per_500 || 1000;
            await pool.query(`
                UPDATE store_purchases sp
                INNER JOIN store_products prod ON sp.product_name = prod.name
                SET sp.rupiah_paid = prod.quantity * ?
                WHERE (sp.rupiah_paid IS NULL OR sp.rupiah_paid = 0)
                  AND sp.product_name IS NOT NULL
            `, [bpp]);
        } catch (e) { /* backfill non-fatal */ }

        const getFilter = (range) => {
            const r = range || '14d';
            if (r === '1d') return 'WHERE created_at >= DATE_SUB(NOW(), INTERVAL 1 DAY)';
            if (r === '14d') return 'WHERE created_at >= DATE_SUB(NOW(), INTERVAL 14 DAY)';
            if (r === '30d') return 'WHERE created_at >= DATE_SUB(NOW(), INTERVAL 30 DAY)';
            if (r === '365d') return 'WHERE created_at >= DATE_SUB(NOW(), INTERVAL 365 DAY)';
            if (r === 'all') return '';
            return 'WHERE created_at >= DATE_SUB(NOW(), INTERVAL 14 DAY)';
        };

        const graphFilter = getFilter(req.query.graphRange);
        const donatorFilter = getFilter(req.query.donatorRange);
        const productFilter = getFilter(req.query.productRange);
        const recentFilter = getFilter(req.query.recentRange);

        const [settingsRows] = await pool.query('SELECT discount_enabled, base_price_per_500, discount_percentage FROM store_settings LIMIT 1')
        const settings = settingsRows[0] || {}
        const discount_enabled = settings.discount_enabled === 1 || settings.discount_enabled === true
        const currentPricePer500 = discount_enabled ? (settings.base_price_per_500 * (1 - (settings.discount_percentage / 100))) : (settings.base_price_per_500 || 1000)

        // Fetch products for fallback calculation on old records without rupiah_paid
        const [productsList] = await pool.query('SELECT name, quantity FROM store_products')
        const productMap = {}
        for (const p of productsList) {
            productMap[p.name] = p.quantity
        }

        // Helper: calculate rupiah for a row/aggregate, with fallback
        const calcRupiah = (rupiahPaid, productName, pointsFallback) => {
            if (rupiahPaid && rupiahPaid > 0) return rupiahPaid;
            if (productMap[productName]) return productMap[productName] * currentPricePer500;
            return 0;
        }

        // Daily sales for last 14 days
        const [dailySalesRaw] = await pool.query(`
            SELECT 
                DATE(created_at) as date,
                COUNT(*) as total_transactions,
                SUM(points_purchased) as total_points,
                SUM(rupiah_paid) as total_rupiah
            FROM store_purchases 
            ${graphFilter}
            GROUP BY DATE(created_at)
            ORDER BY date ASC
        `)

        // Fill in missing dates with zero sales
        let filledDailySales = [];
        const range = req.query.graphRange || '14d';

        if (range !== 'all') {
            const days = range === '1d' ? 1 : range === '14d' ? 14 : range === '30d' ? 30 : range === '365d' ? 365 : 14;
            const now = new Date();

            for (let i = days; i >= 0; i--) {
                const date = new Date(now);
                date.setDate(date.getDate() - i);
                const dateString = date.toISOString().split('T')[0];

                const existingData = dailySalesRaw.find(d => {
                    const dDate = new Date(d.date);
                    return dDate.toISOString().split('T')[0] === dateString;
                });

                if (existingData) {
                    filledDailySales.push({
                        ...existingData,
                        date: dateString,
                        total_points: parseFloat(existingData.total_points || 0),
                        total_rupiah: parseFloat(existingData.total_rupiah || 0)
                    });
                } else {
                    filledDailySales.push({
                        date: dateString,
                        total_transactions: 0,
                        total_points: 0,
                        total_rupiah: 0
                    });
                }
            }
        } else {
            filledDailySales = dailySalesRaw.map(d => ({
                ...d,
                date: new Date(d.date).toISOString().split('T')[0],
                total_points: parseFloat(d.total_points || 0),
                total_rupiah: parseFloat(d.total_rupiah || 0)
            }));
        }

        // Top donators (all time)
        const [topDonators] = await pool.query(`
            SELECT 
                player_name,
                COUNT(*) as total_purchases,
                SUM(points_purchased) as total_points,
                SUM(rupiah_paid) as total_rupiah
            FROM store_purchases
            ${donatorFilter}
            GROUP BY player_name
            ORDER BY total_points DESC
            LIMIT 10
        `)

        // Most popular products
        const [popularProducts] = await pool.query(`
            SELECT 
                product_name,
                COUNT(*) as times_purchased,
                SUM(points_purchased) as total_points,
                SUM(rupiah_paid) as total_rupiah
            FROM store_purchases
            ${productFilter}
            GROUP BY product_name
            ORDER BY times_purchased DESC
            LIMIT 10
        `)

        // Recent 5 transactions
        const [recentPurchases] = await pool.query(`
            SELECT player_name, product_name, points_purchased, rupiah_paid, created_at
            FROM store_purchases 
            ${recentFilter}
            ORDER BY created_at DESC 
            LIMIT 10
        `)

        // Summary totals
        const [totals] = await pool.query(`
            SELECT 
                COUNT(*) as total_transactions,
                COALESCE(SUM(points_purchased), 0) as total_points,
                COALESCE(SUM(rupiah_paid), 0) as total_rupiah,
                COUNT(DISTINCT player_name) as unique_buyers
            FROM store_purchases
            ${graphFilter}
        `)

        return res.status(200).json({
            dailySales: filledDailySales.map(d => ({ ...d, rupiah_value: d.total_rupiah || 0 })),
            topDonators: topDonators.map(d => ({ ...d, rupiah_value: d.total_rupiah || 0 })),
            popularProducts: popularProducts.map(d => {
                let rupiah = parseFloat(d.total_rupiah || 0);
                // Fallback: if no rupiah_paid stored, calculate from product quantity
                if (!rupiah && productMap[d.product_name]) {
                    rupiah = productMap[d.product_name] * currentPricePer500 * d.times_purchased;
                }
                return { ...d, rupiah_value: rupiah };
            }),
            recentPurchases: recentPurchases.map(d => ({ ...d, rupiah_value: calcRupiah(d.rupiah_paid, d.product_name, d.points_purchased) })),
            totals: {
                ...totals[0],
                rupiah_value: parseFloat(totals[0]?.total_rupiah || 0) || 0
            }
        })
    } catch (error) {
        return res.status(500).json({ error: error.message })
    }
}
