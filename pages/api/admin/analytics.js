import { getDbConnection } from '../../../lib/db'
import { getServerSession } from "next-auth/next"
import { authOptions } from "../auth/[...nextauth]"

export default async function handler(req, res) {
    const session = await getServerSession(req, res, authOptions)
    if (!session) return res.status(401).json({ message: "Unauthorized" })

    if (req.method !== 'GET') return res.status(405).json({ message: 'Method Not Allowed' })

    const pool = await getDbConnection()

    try {
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

        const [settingsRows] = await pool.query('SELECT discount_enabled, base_price_per_500, discounted_price_per_500 FROM store_settings LIMIT 1')
        const settings = settingsRows[0] || {}
        const discount_enabled = settings.discount_enabled === 1 || settings.discount_enabled === true
        const price_per_500 = discount_enabled ? (settings.discounted_price_per_500 || 4000) : (settings.base_price_per_500 || 5000)
        const pricePerPoint = price_per_500 / 500

        // Daily sales for last 14 days
        const [dailySales] = await pool.query(`
            SELECT 
                DATE(created_at) as date,
                COUNT(*) as total_transactions,
                SUM(points_purchased) as total_points
            FROM store_purchases 
            ${graphFilter}
            GROUP BY DATE(created_at)
            ORDER BY date ASC
        `)

        // Top donators (all time)
        const [topDonators] = await pool.query(`
            SELECT 
                player_name,
                COUNT(*) as total_purchases,
                SUM(points_purchased) as total_points
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
                SUM(points_purchased) as total_points
            FROM store_purchases
            ${productFilter}
            GROUP BY product_name
            ORDER BY times_purchased DESC
            LIMIT 10
        `)

        // Recent 5 transactions
        const [recentPurchases] = await pool.query(`
            SELECT player_name, product_name, points_purchased, created_at
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
                COUNT(DISTINCT player_name) as unique_buyers
            FROM store_purchases
            ${graphFilter}
        `)

        return res.status(200).json({
            dailySales: dailySales.map(d => ({ ...d, rupiah_value: d.total_points * pricePerPoint })),
            topDonators: topDonators.map(d => ({ ...d, rupiah_value: d.total_points * pricePerPoint })),
            popularProducts: popularProducts.map(d => ({ ...d, rupiah_value: d.total_points * pricePerPoint })),
            recentPurchases: recentPurchases.map(d => ({ ...d, rupiah_value: d.points_purchased * pricePerPoint })),
            totals: {
                ...totals[0],
                rupiah_value: (totals[0]?.total_points || 0) * pricePerPoint
            }
        })
    } catch (error) {
        return res.status(500).json({ error: error.message })
    }
}
