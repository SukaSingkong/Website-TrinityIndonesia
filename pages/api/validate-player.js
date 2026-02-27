import { getPpDbConnection } from '../../lib/ppdb';

export default async function handler(req, res) {
    if (req.method !== 'POST') {
        return res.status(405).json({ message: 'Method Not Allowed' });
    }

    const { username } = req.body;

    if (!username || typeof username !== 'string' || username.trim().length === 0) {
        return res.status(400).json({ success: false, message: 'Username is required.' });
    }

    const cleanUsername = username.trim();

    try {
        const db = await getPpDbConnection();

        // Use indexed 'username' column for fast lookup (exact match, case-insensitive by default in MySQL)
        const [rows] = await db.execute(
            'SELECT uuid FROM playerpoints_username_cache WHERE username = ? LIMIT 1',
            [cleanUsername]
        );

        if (rows.length > 0) {
            return res.status(200).json({ success: true, uuid: rows[0].uuid });
        } else {
            return res.status(200).json({ success: false, message: 'Player not found.' });
        }
    } catch (error) {
        console.error('Player validation error:', error);
        return res.status(500).json({ success: false, message: 'Database error.' });
    }
}
