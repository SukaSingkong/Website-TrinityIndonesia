import { getLbDbConnection } from '../../lib/lbdb';

export default async function handler(req, res) {
    if (req.method !== 'GET') {
        return res.status(405).json({ message: 'Method Not Allowed' });
    }

    try {
        const db = await getLbDbConnection();
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;
        const offset = (page - 1) * limit;

        // Get total count for pagination
        const [countResult] = await db.execute('SELECT COUNT(*) as total FROM libertybans_punishments');
        const total = countResult[0].total;
        const totalPages = Math.ceil(total / limit);

        // Fetch paginated records
        const [rows] = await db.execute(`
            SELECT 
                n.name AS nickname, 
                p.reason, 
                p.start, 
                p.end, 
                p.type
            FROM libertybans_punishments p
            LEFT JOIN libertybans_victims v 
                ON p.id = v.id OR p.id = (v.id + 2147483649)
            LEFT JOIN libertybans_names n 
                ON v.uuid = n.uuid
            ORDER BY p.start DESC
            LIMIT ? OFFSET ?
        `, [limit.toString(), offset.toString()]);

        // Format data tanggal
        const punishments = rows.map((row, index) => ({
            id: row.id || index,
            nickname: row.nickname || 'Unknown Player',
            reason: row.reason || 'Tidak ada alasan',
            start: row.start ? row.start * 1000 : null,
            end: row.end ? row.end * 1000 : null,
            type: row.type || 0,
        }));

        res.status(200).json({
            data: punishments,
            pagination: {
                total,
                page,
                totalPages,
                limit
            }
        });
    } catch (error) {
        console.error('Database query error:', error);
        res.status(500).json({ message: 'Terjadi kesalahan saat mengambil data hukuman dr database.' });
    }
}
