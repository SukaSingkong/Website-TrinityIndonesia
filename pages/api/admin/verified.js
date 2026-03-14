import { getDbConnection } from '../../../lib/db';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '../auth/[...nextauth]';

export default async function handler(req, res) {
    const session = await getServerSession(req, res, authOptions);
    if (!session) {
        return res.status(401).json({ message: 'Unauthorized' });
    }

    const pool = await getDbConnection();

    if (req.method === 'GET') {
        try {
            const [rows] = await pool.query('SELECT id, nickname, created_at FROM verified_players ORDER BY created_at DESC');
            return res.status(200).json(rows);
        } catch (e) {
            console.error(e);
            return res.status(500).json({ message: 'Internal server error' });
        }
    }

    if (req.method === 'POST') {
        const { nickname } = req.body;
        if (!nickname || !nickname.trim()) {
            return res.status(400).json({ message: 'Nickname diperlukan' });
        }
        try {
            const [result] = await pool.query(
                'INSERT INTO verified_players (nickname) VALUES (?)',
                [nickname.trim()]
            );
            return res.status(200).json({ id: result.insertId, nickname: nickname.trim() });
        } catch (e) {
            if (e.code === 'ER_DUP_ENTRY') {
                return res.status(409).json({ message: 'Nickname sudah ada di daftar verified' });
            }
            console.error(e);
            return res.status(500).json({ message: 'Internal server error' });
        }
    }

    if (req.method === 'DELETE') {
        const { id } = req.body;
        if (!id) {
            return res.status(400).json({ message: 'ID diperlukan' });
        }
        try {
            await pool.query('DELETE FROM verified_players WHERE id = ?', [id]);
            return res.status(200).json({ message: 'Deleted' });
        } catch (e) {
            console.error(e);
            return res.status(500).json({ message: 'Internal server error' });
        }
    }

    return res.status(405).json({ message: 'Method not allowed' });
}
