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
        const { month_group, title, type, icon, content, patch_date } = req.body;
        // content is expected to be an array of objects e.g., [{num: "+", text: "..."}]

        try {
            const [result] = await pool.query(
                'INSERT INTO store_updates (month_group, title, type, icon, content, patch_date) VALUES (?, ?, ?, ?, ?, ?)',
                [month_group, title, type, icon || 'ri-sparkling-2-line', JSON.stringify(content), patch_date || null]
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
        const { id, month_group, title, type, icon, content, patch_date } = req.body;

        if (!id) return res.status(400).json({ message: "ID is required" });

        try {
            await pool.query(
                'UPDATE store_updates SET month_group = ?, title = ?, type = ?, icon = ?, content = ?, patch_date = ? WHERE id = ?',
                [month_group, title, type, icon || 'ri-sparkling-2-line', JSON.stringify(content), patch_date || null, id]
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
