import { getDbConnection } from '../../../lib/db'
import { getServerSession } from "next-auth/next"
import { authOptions } from "../auth/[...nextauth]"

export default async function handler(req, res) {
    const session = await getServerSession(req, res, authOptions)
    if (!session) return res.status(401).json({ message: "Unauthorized" })

    if (req.method !== 'GET') return res.status(405).json({ message: 'Method Not Allowed' })

    const pool = await getDbConnection()

    try {
        // Daily sales for last 14 days
        const [dailySales] = await pool.query(`
            SELECT 
                DATE(created_at) as date,
                COUNT(*) as total_transactions,
                SUM(points_purchased) as total_points
            FROM store_purchases 
            WHERE created_at >= DATE_SUB(NOW(), INTERVAL 14 DAY)
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
            GROUP BY product_name
            ORDER BY times_purchased DESC
            LIMIT 5
        `)

        // Recent 5 transactions
        const [recentPurchases] = await pool.query(`
            SELECT player_name, product_name, points_purchased, created_at
            FROM store_purchases 
            ORDER BY created_at DESC 
            LIMIT 5
        `)

        // Summary totals
        const [totals] = await pool.query(`
            SELECT 
                COUNT(*) as total_transactions,
                COALESCE(SUM(points_purchased), 0) as total_points,
                COUNT(DISTINCT player_name) as unique_buyers
            FROM store_purchases
        `)

        return res.status(200).json({
            dailySales,
            topDonators,
            popularProducts,
            recentPurchases,
            totals: totals[0]
        })
    } catch (error) {
        return res.status(500).json({ error: error.message })
    }
}
