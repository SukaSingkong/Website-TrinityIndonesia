import { getDbConnection } from '../../../lib/db'
import { getServerSession } from "next-auth/next"
import { authOptions } from "../auth/[...nextauth]"

// Auto-migrate: add popup columns if they don't exist
async function ensurePopupColumns(pool) {
    const cols = [
        { name: 'popup_bg_image', type: "VARCHAR(500) DEFAULT ''" },
        { name: 'popup_title', type: "VARCHAR(200) DEFAULT ''" },
        { name: 'popup_subtitle', type: "VARCHAR(500) DEFAULT ''" },
        { name: 'popup_discount_text', type: "VARCHAR(200) DEFAULT '20%'" },
        { name: 'discount_timer', type: "VARCHAR(200) DEFAULT ''" },
        { name: 'discord_webhook_url', type: "VARCHAR(500) DEFAULT ''" },
    ];
    for (const col of cols) {
        try {
            await pool.query(`ALTER TABLE store_settings ADD COLUMN ${col.name} ${col.type}`);
        } catch (e) {
            // Column already exists, ignore
        }
    }
}

export default async function handler(req, res) {
    const session = await getServerSession(req, res, authOptions)
    if (!session) return res.status(401).json({ message: "Unauthorized" })

    const pool = await getDbConnection();

    if (req.method === 'GET') {
        try {
            await ensurePopupColumns(pool);
            const [rows] = await pool.query('SELECT * FROM store_settings LIMIT 1');
            return res.status(200).json(rows[0] || {});
        } catch (error) {
            return res.status(500).json({ error: error.message });
        }
    }

    if (req.method === 'POST') {
        const {
            event_name, discount_enabled, base_price_per_500, discount_percentage,
            popup_bg_image, popup_title, popup_subtitle, popup_discount_text, discount_timer, discord_webhook_url
        } = req.body;

        try {
            await ensurePopupColumns(pool);
            const [rows] = await pool.query('SELECT id FROM store_settings LIMIT 1');

            if (rows.length > 0) {
                await pool.query(
                    `UPDATE store_settings SET 
                        event_name=?, discount_enabled=?, base_price_per_500=?, discount_percentage=?,
                        popup_bg_image=?, popup_title=?, popup_subtitle=?, popup_discount_text=?, discount_timer=?, discord_webhook_url=?
                    WHERE id=?`,
                    [
                        event_name, discount_enabled ? 1 : 0, base_price_per_500, discount_percentage,
                        popup_bg_image || '', popup_title || '', popup_subtitle || '', popup_discount_text || '', discount_timer || '', discord_webhook_url || '',
                        rows[0].id
                    ]
                );
            } else {
                await pool.query(
                    `INSERT INTO store_settings 
                        (event_name, discount_enabled, base_price_per_500, discount_percentage, popup_bg_image, popup_title, popup_subtitle, popup_discount_text, discount_timer, discord_webhook_url) 
                    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
                    [
                        event_name, discount_enabled ? 1 : 0, base_price_per_500, discount_percentage,
                        popup_bg_image || '', popup_title || '', popup_subtitle || '', popup_discount_text || '', discount_timer || '', discord_webhook_url || ''
                    ]
                );
            }

            return res.status(200).json({ success: true, message: 'Settings updated' });
        } catch (error) {
            return res.status(500).json({ error: error.message });
        }
    }

    res.status(405).json({ message: 'Method Not Allowed' })
}
