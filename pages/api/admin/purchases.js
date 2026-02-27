import { getDbConnection } from '../../../lib/db'
import { getServerSession } from "next-auth/next"
import { authOptions } from "../auth/[...nextauth]"

export default async function handler(req, res) {
    const session = await getServerSession(req, res, authOptions)
    if (!session) return res.status(401).json({ message: "Unauthorized" })

    const pool = await getDbConnection();

    if (req.method === 'GET') {
        try {
            const [rows] = await pool.query('SELECT * FROM store_purchases ORDER BY created_at DESC LIMIT 100');
            return res.status(200).json(rows);
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
