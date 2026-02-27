import { getDbConnection } from '../../../lib/db'
import { getServerSession } from "next-auth/next"
import { authOptions } from "../auth/[...nextauth]"

export default async function handler(req, res) {
    const session = await getServerSession(req, res, authOptions)
    if (!session) return res.status(401).json({ message: "Unauthorized" })

    const pool = await getDbConnection();

    if (req.method === 'GET') {
        try {
            const [settingsRows] = await pool.query('SELECT discount_enabled, base_price_per_500, discounted_price_per_500 FROM store_settings LIMIT 1')
            const settings = settingsRows[0] || {}
            const discount_enabled = settings.discount_enabled === 1 || settings.discount_enabled === true
            const price_per_500 = discount_enabled ? (settings.discounted_price_per_500 || 4000) : (settings.base_price_per_500 || 5000)
            const pricePerPoint = price_per_500 / 500

            const [rows] = await pool.query('SELECT * FROM store_purchases ORDER BY created_at DESC LIMIT 100');
            const data = rows.map(r => ({ ...r, rupiah_value: r.points_purchased * pricePerPoint }));
            return res.status(200).json(data);
        } catch (error) {
            return res.status(500).json({ error: error.message });
        }
    }

    if (req.method === 'DELETE') {
        const { id, all } = req.query;

        // Delete all purchase logs
        if (all === 'true') {
            try {
                await pool.query('DELETE FROM store_purchases');
                return res.status(200).json({ success: true });
            } catch (error) {
                return res.status(500).json({ error: error.message });
            }
        }

        // Delete single purchase log
        if (id) {
            try {
                await pool.query('DELETE FROM store_purchases WHERE id = ?', [id]);
                return res.status(200).json({ success: true });
            } catch (error) {
                return res.status(500).json({ error: error.message });
            }
        }

        return res.status(400).json({ message: 'Missing id or all parameter' });
    }

    res.status(405).json({ message: 'Method Not Allowed' })
}
