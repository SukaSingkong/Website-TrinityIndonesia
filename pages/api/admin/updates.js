import { getDbConnection } from '../../../lib/db'
import { getServerSession } from "next-auth/next"
import { authOptions } from "../auth/[...nextauth]"

const MONTH_NAMES_ID = [
    'JANUARI', 'FEBRUARI', 'MARET', 'APRIL', 'MEI', 'JUNI',
    'JULI', 'AGUSTUS', 'SEPTEMBER', 'OKTOBER', 'NOVEMBER', 'DESEMBER'
];

function generateMonthGroup(patchDate) {
    // Parse from YYYY-MM-DD string directly to avoid timezone issues
    const parts = String(patchDate).split('-');
    const monthIndex = parseInt(parts[1], 10) - 1;
    const year = parts[0];
    return `${MONTH_NAMES_ID[monthIndex]} ${year}`;
}

async function getNextBuildNumber(pool) {
    // Get the highest build number ever used
    const [rows] = await pool.query(
        `SELECT title FROM store_updates WHERE title REGEXP '^[0-9]{4}\\.[0-9]{2}\\.[0-9]+$' ORDER BY CAST(SUBSTRING_INDEX(title, '.', -1) AS UNSIGNED) DESC LIMIT 1`
    );
    if (rows.length > 0) {
        const parts = rows[0].title.split('.');
        const lastBuild = parseInt(parts[2], 10);
        return lastBuild + 1;
    }
    return 1;
}

function generateVersion(patchDate, buildNumber) {
    // Parse from YYYY-MM-DD string directly to avoid timezone issues
    const parts = String(patchDate).split('-');
    const year = parts[0];
    const month = parts[1];
    return `${year}.${month}.${buildNumber}`;
}

export default async function handler(req, res) {
    const session = await getServerSession(req, res, authOptions)
    if (!session) return res.status(401).json({ message: "Unauthorized" })

    const pool = await getDbConnection();

    if (req.method === 'GET') {
        try {
            // Return next build number if requested
            if (req.query.nextBuild) {
                const nextBuild = await getNextBuildNumber(pool);
                return res.status(200).json({ nextBuild });
            }
            const [rows] = await pool.query('SELECT * FROM store_updates ORDER BY created_at DESC');
            return res.status(200).json(rows);
        } catch (error) {
            return res.status(500).json({ error: error.message });
        }
    }

    if (req.method === 'POST') {
        const { type, icon, content, patch_date } = req.body;
        // content is expected to be an array of objects e.g., [{num: "+", text: "..."}]

        try {
            // Auto-generate month_group and version title
            const effectiveDate = patch_date || new Date().toISOString().split('T')[0];
            const month_group = generateMonthGroup(effectiveDate);
            const buildNumber = await getNextBuildNumber(pool);
            const title = generateVersion(effectiveDate, buildNumber);

            const [result] = await pool.query(
                'INSERT INTO store_updates (month_group, title, type, icon, content, patch_date) VALUES (?, ?, ?, ?, ?, ?)',
                [month_group, title, type, icon || 'ri-sparkling-2-line', JSON.stringify(content), effectiveDate]
            );

            // Send Discord Notification if webhook is configured
            try {
                // Strictly use the global Update Webhook from .env
                const webhookUrl = process.env.DISCORD_UPDATE_WEBHOOK;

                if (webhookUrl) {
                    const color = type === 'added' ? 3066993 : (type === 'removed' ? 15158332 : 3447003); // Green, Red, Blue
                    
                    const embed = {
                        title: `📢 New Update: ${title}`,
                        description: `Patch notes for **${month_group}** have been updated!`,
                        color: color,
                        fields: [
                            {
                                name: "Type",
                                value: type.toUpperCase(),
                                inline: true
                            }
                        ],
                        timestamp: new Date().toISOString(),
                        footer: {
                            text: "Trinity Indonesia Updates"
                        }
                    };
 
                    if (patch_date) {
                        embed.fields.push({
                            name: "Patch Date",
                            value: patch_date,
                            inline: true
                        });
                    }

                    // Add content preview (limit to 10 lines for better detail)
                    if (Array.isArray(content) && content.length > 0) {
                        const preview = content.slice(0, 10).map(c => `${c.num} ${c.text}`).join('\n');
                        embed.fields.push({
                            name: "Highlights",
                            value: preview + (content.length > 10 ? "\n..." : ""),
                        });
                    }

                    const response = await fetch(webhookUrl, {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({
                            embeds: [embed]
                        })
                    });

                    if (!response.ok) {
                        console.error(`Discord Webhook failed: ${response.status} ${response.statusText}`);
                    }
                }
            } catch (discordErr) {
                console.error("Failed to send Discord notification:", discordErr);
            }

            return res.status(200).json({ success: true, id: result.insertId });
        } catch (error) {
            return res.status(500).json({ error: error.message });
        }
    }

    if (req.method === 'PUT') {
        const { id, type, icon, content, patch_date } = req.body;

        if (!id) return res.status(400).json({ message: "ID is required" });

        try {
            // Auto-generate month_group from patch_date, keep existing title/version
            const effectiveDate = patch_date || new Date().toISOString().split('T')[0];
            const month_group = generateMonthGroup(effectiveDate);

            await pool.query(
                'UPDATE store_updates SET month_group = ?, type = ?, icon = ?, content = ?, patch_date = ? WHERE id = ?',
                [month_group, type, icon || 'ri-sparkling-2-line', JSON.stringify(content), effectiveDate, id]
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

            // Renumber all remaining patches' build numbers sequentially
            const [remaining] = await pool.query(
                `SELECT id, title, patch_date FROM store_updates WHERE title REGEXP '^[0-9]{4}\\.[0-9]{2}\\.[0-9]+$' ORDER BY created_at ASC`
            );
            for (let i = 0; i < remaining.length; i++) {
                const row = remaining[i];
                // Handle both Date objects and strings from MySQL
                const dateStr = row.patch_date instanceof Date
                    ? row.patch_date.toISOString().split('T')[0]
                    : String(row.patch_date).split('T')[0];
                const dateParts = dateStr.split('-');
                if (dateParts.length === 3) {
                    const newTitle = `${dateParts[0]}.${dateParts[1]}.${i + 1}`;
                    if (newTitle !== row.title) {
                        await pool.query('UPDATE store_updates SET title = ? WHERE id = ?', [newTitle, row.id]);
                    }
                }
            }

            return res.status(200).json({ success: true });
        } catch (error) {
            return res.status(500).json({ error: error.message });
        }
    }

    res.status(405).json({ message: 'Method Not Allowed' })
}

