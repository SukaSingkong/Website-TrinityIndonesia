import { getDbConnection } from '../../../lib/db'
import { getServerSession } from "next-auth/next"
import { authOptions } from "../auth/[...nextauth]"

export default async function handler(req, res) {
    const session = await getServerSession(req, res, authOptions)
    if (!session) return res.status(401).json({ message: "Unauthorized" })

    const pool = await getDbConnection();

    if (req.method === 'GET') {
        try {
            const [rows] = await pool.query('SELECT * FROM store_updates ORDER BY created_at DESC');
            return res.status(200).json(rows);
        } catch (error) {
            return res.status(500).json({ error: error.message });
        }
    }

    if (req.method === 'POST') {
        const { month_group, title, type, content } = req.body;
        // content is expected to be an array of objects e.g., [{num: "+", text: "..."}]

        try {
            const [result] = await pool.query(
                'INSERT INTO store_updates (month_group, title, type, content) VALUES (?, ?, ?, ?)',
                [month_group, title, type, JSON.stringify(content)]
            );
            return res.status(200).json({ success: true, id: result.insertId });
        } catch (error) {
            return res.status(500).json({ error: error.message });
        }
    }

    if (req.method === 'PUT') {
        const { id, month_group, title, type, content } = req.body;

        if (!id) return res.status(400).json({ message: "ID is required" });

        try {
            await pool.query(
                'UPDATE store_updates SET month_group = ?, title = ?, type = ?, content = ? WHERE id = ?',
                [month_group, title, type, JSON.stringify(content), id]
            );
            return res.status(200).json({ success: true });
        } catch (error) {
            return res.status(500).json({ error: error.message });
        }
    }

    if (req.method === 'DELETE') {
        const { id } = req.query;

        if (!id) return res.status(400).json({ message: "ID is required" });

        try {
            await pool.query('DELETE FROM store_updates WHERE id = ?', [id]);
            return res.status(200).json({ success: true });
        } catch (error) {
            return res.status(500).json({ error: error.message });
        }
    }

    res.status(405).json({ message: 'Method Not Allowed' })
}
