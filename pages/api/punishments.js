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
        const nowSeconds = Math.floor(Date.now() / 1000);

        // LibertyBans uses two schemas:
        // - Old: libertybans_punishments + libertybans_victims (IDs 1-4 in this server)
        // - New: libertybans_simple_bans/mutes/warns with victim_uuid directly
        // Newer bans are also tracked in libertybans_bans (id column) — exclude those from old schema to avoid duplicates.

        const [countResult] = await db.execute(`
            SELECT (
                SELECT COUNT(*) 
                FROM libertybans_punishments 
                WHERE id NOT IN (SELECT id FROM libertybans_bans)
                  AND (end = 0 OR end > ?)
            ) + (
                SELECT COUNT(*) FROM libertybans_simple_bans WHERE (end = 0 OR end > ?)
            ) + (
                SELECT COUNT(*) FROM libertybans_simple_mutes WHERE (end = 0 OR end > ?)
            ) + (
                SELECT COUNT(*) FROM libertybans_simple_warns WHERE (end = 0 OR end > ?)
            ) AS total
        `, [nowSeconds, nowSeconds, nowSeconds, nowSeconds]);
        const total = countResult[0].total;
        const totalPages = Math.ceil(total / limit);

        const [rows] = await db.execute(`
            SELECT nickname, reason, start, end, type FROM (
                -- Old schema: only punishments NOT tracked in new libertybans_bans table
                SELECT 
                    (
                        SELECT n.name 
                        FROM libertybans_names n 
                        WHERE n.uuid = v.uuid 
                        ORDER BY n.updated DESC 
                        LIMIT 1
                    ) AS nickname,
                    p.reason,
                    p.start,
                    p.end,
                    p.type
                FROM libertybans_punishments p
                LEFT JOIN libertybans_victims v ON v.id = (p.id - 2147483649)
                WHERE p.id NOT IN (SELECT id FROM libertybans_bans)
                  AND (p.end = 0 OR p.end > ?)

                UNION ALL

                -- New schema: simple_bans (ban)
                SELECT 
                    (
                        SELECT n.name 
                        FROM libertybans_names n 
                        WHERE n.uuid = sb.victim_uuid 
                        ORDER BY n.updated DESC 
                        LIMIT 1
                    ) AS nickname,
                    sb.reason, sb.start, sb.end, sb.type
                FROM libertybans_simple_bans sb
                WHERE (sb.end = 0 OR sb.end > ?)

                UNION ALL

                -- New schema: simple_mutes (mute)
                SELECT 
                    (
                        SELECT n.name 
                        FROM libertybans_names n 
                        WHERE n.uuid = sm.victim_uuid 
                        ORDER BY n.updated DESC 
                        LIMIT 1
                    ) AS nickname,
                    sm.reason, sm.start, sm.end, sm.type
                FROM libertybans_simple_mutes sm
                WHERE (sm.end = 0 OR sm.end > ?)

                UNION ALL

                -- New schema: simple_warns (warn)
                SELECT 
                    (
                        SELECT n.name 
                        FROM libertybans_names n 
                        WHERE n.uuid = sw.victim_uuid 
                        ORDER BY n.updated DESC 
                        LIMIT 1
                    ) AS nickname,
                    sw.reason, sw.start, sw.end, sw.type
                FROM libertybans_simple_warns sw
                WHERE (sw.end = 0 OR sw.end > ?)
            ) combined
            ORDER BY start DESC
            LIMIT ? OFFSET ?
        `, [nowSeconds, nowSeconds, nowSeconds, nowSeconds, limit.toString(), offset.toString()]);

        const punishments = rows.map((row, index) => ({
            id: index,
            nickname: row.nickname || 'Unknown Player',
            reason: row.reason || 'Tidak ada alasan',
            start: row.start ? row.start * 1000 : null,
            end: (row.end && row.end !== 0) ? row.end * 1000 : null,
            type: row.type || 0,
        }));

        res.status(200).json({
            data: punishments,
            pagination: { total, page, totalPages, limit }
        });
    } catch (error) {
        console.error('Database query error:', error);
        res.status(500).json({ message: 'Terjadi kesalahan saat mengambil data hukuman dr database.', error: error.message });
    }
}
