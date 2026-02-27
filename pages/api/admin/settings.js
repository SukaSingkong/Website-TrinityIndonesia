import { getDbConnection } from '../../../lib/db'
import { getServerSession } from "next-auth/next"
import { authOptions } from "../auth/[...nextauth]"

export default async function handler(req, res) {
    const session = await getServerSession(req, res, authOptions)
    if (!session) return res.status(401).json({ message: "Unauthorized" })

    const pool = await getDbConnection();

    if (req.method === 'GET') {
        const [rows] = await pool.query('SELECT * FROM store_settings LIMIT 1');
        return res.status(200).json(rows[0] || {});
    }

    if (req.method === 'POST') {
        const { event_name, discount_enabled, base_price_per_500, discounted_price_per_500 } = req.body;

        const [rows] = await pool.query('SELECT id FROM store_settings LIMIT 1');

        if (rows.length > 0) {
            await pool.query(
                'UPDATE store_settings SET event_name=?, discount_enabled=?, base_price_per_500=?, discounted_price_per_500=? WHERE id=?',
                [event_name, discount_enabled ? 1 : 0, base_price_per_500, discounted_price_per_500, rows[0].id]
            );
        } else {
            await pool.query(
                'INSERT INTO store_settings (event_name, discount_enabled, base_price_per_500, discounted_price_per_500) VALUES (?, ?, ?, ?)',
                [event_name, discount_enabled ? 1 : 0, base_price_per_500, discounted_price_per_500]
            );
        }

        return res.status(200).json({ success: true, message: 'Settings updated' });
    }

    res.status(405).json({ message: 'Method Not Allowed' })
}
