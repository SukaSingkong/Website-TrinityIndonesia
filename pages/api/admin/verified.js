import { getDbConnection } from '../../../lib/db';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '../auth/[...nextauth]';

async function sendMinecraftCommand(command) {
    const panelUrl = process.env.PTERODACTYL_PANEL_URL;
    const apiKey = process.env.PTERODACTYL_API_KEY;
    const serverId = process.env.PTERODACTYL_SERVER_ID;

    if (!panelUrl || !apiKey || !serverId) {
        console.error('[verified] Missing Pterodactyl env vars, skipping command:', command);
        return false;
    }

    const response = await fetch(
        `${panelUrl.replace(/\/+$/, '')}/api/client/servers/${serverId}/command`,
        {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${apiKey}`,
                'Content-Type': 'application/json',
                'Accept': 'Application/vnd.pterodactyl.v1+json',
            },
            body: JSON.stringify({ command }),
        }
    );

    if (!response.ok) {
        console.error('[verified] Pterodactyl command failed:', command, await response.text());
        return false;
    }

    console.log('[verified] Pterodactyl command executed:', command);
    return true;
}

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

            // Jalankan command LuckPerms untuk memberikan permission verified
            await sendMinecraftCommand(
                `lp user ${nickname.trim()} permission set deluxetags.tag.verified true`
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
            // Ambil nickname sebelum dihapus agar bisa dipakai di command
            const [rows] = await pool.query('SELECT nickname FROM verified_players WHERE id = ?', [id]);
            const nickname = rows[0]?.nickname;

            await pool.query('DELETE FROM verified_players WHERE id = ?', [id]);

            // Jalankan command LuckPerms untuk mencabut permission verified
            if (nickname) {
                await sendMinecraftCommand(
                    `lp user ${nickname} permission set deluxetags.tag.verified false`
                );
            }

            return res.status(200).json({ message: 'Deleted' });
        } catch (e) {
            console.error(e);
            return res.status(500).json({ message: 'Internal server error' });
        }
    }

    return res.status(405).json({ message: 'Method not allowed' });
}

