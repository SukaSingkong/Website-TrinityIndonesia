import { getDbConnection } from '../../lib/db';

export default async function handler(req, res) {
    if (req.method !== 'GET') {
        return res.status(405).json({ message: 'Method not allowed' });
    }

    try {
        const pool = await getDbConnection();
        const [rows] = await pool.query('SELECT nickname FROM verified_players ORDER BY created_at ASC');
        const nicknames = rows.map(r => r.nickname);
        return res.status(200).json({ verified: nicknames });
    } catch (e) {
        console.error(e);
        return res.status(500).json({ message: 'Internal server error' });
    }
}
