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
            popup_bg_image, popup_title, popup_subtitle, popup_discount_text, discount_timer
        } = req.body;

        try {
            await ensurePopupColumns(pool);
            const [rows] = await pool.query('SELECT * FROM store_settings LIMIT 1');
            const wasEnabled = rows.length > 0 ? rows[0].discount_enabled : 0;
            const isEnabledNow = discount_enabled ? 1 : 0;

            if (rows.length > 0) {
                await pool.query(
                    `UPDATE store_settings SET 
                        event_name=?, discount_enabled=?, base_price_per_500=?, discount_percentage=?,
                        popup_bg_image=?, popup_title=?, popup_subtitle=?, popup_discount_text=?, discount_timer=?
                    WHERE id=?`,
                    [
                        event_name, isEnabledNow, base_price_per_500, discount_percentage,
                        popup_bg_image || '', popup_title || '', popup_subtitle || '', popup_discount_text || '', discount_timer || '',
                        rows[0].id
                    ]
                );
            } else {
                await pool.query(
                    `INSERT INTO store_settings 
                        (event_name, discount_enabled, base_price_per_500, discount_percentage, popup_bg_image, popup_title, popup_subtitle, popup_discount_text, discount_timer) 
                    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
                    [
                        event_name, isEnabledNow, base_price_per_500, discount_percentage,
                        popup_bg_image || '', popup_title || '', popup_subtitle || '', popup_discount_text || '', discount_timer || ''
                    ]
                );
            }

            // --- DISCORD WEBHOOK ANNOUNCEMENT LOGIC ---
            // If discount goes from OFF to ON, announce it automatically to Discord
            if (isEnabledNow === 1 && !wasEnabled) {
                const webhookUrl = process.env.DISCORD_UPDATE_WEBHOOK;
                if (webhookUrl) {
                    try {
                        const embed = {
                            title: `🎉 EVENT DISKON DIMULAI: ${event_name} 🎉`,
                            description: popup_subtitle || `Nikmati diskon eksklusif sebesar **${popup_discount_text || (discount_percentage + '%')}** untuk semua pembelian Points selama event berlangsung!`,
                            color: 14839312, // Orange color
                            fields: [
                                { name: "Potongan Harga", value: `**${discount_percentage}% OFF**!`, inline: true }
                            ],
                            timestamp: new Date().toISOString(),
                            footer: { text: "Trinity Indonesia Store" }
                        };

                        if (popup_bg_image) {
                            embed.image = { url: popup_bg_image };
                        }

                        if (discount_timer) {
                            // Convert HTML datetime-local format 'YYYY-MM-DDThh:mm' to discord unix timestamp
                            const targetTime = new Date(discount_timer).getTime() / 1000;
                            embed.fields.push({
                                name: "Berakhir Pada",
                                value: `<t:${Math.floor(targetTime)}:F>\n(<t:${Math.floor(targetTime)}:R>)`,
                                inline: true
                            });
                        }

                        embed.fields.push({
                            name: "🔗 Kunjungi Store",
                            value: "[Klik di sini untuk belanja!](https://www.trinityindonesia.cc/store)",
                            inline: false
                        });

                        const response = await fetch(webhookUrl, {
                            method: 'POST',
                            headers: { 'Content-Type': 'application/json' },
                            body: JSON.stringify({ embeds: [embed] })
                        });

                        if (!response.ok) {
                            console.error(`Store webhook failed: ${response.status} ${response.statusText}`);
                        }
                    } catch (discordErr) {
                        console.error("Failed to send Store Discord notification:", discordErr);
                    }
                }
            }
            // ------------------------------------------

            return res.status(200).json({ success: true, message: 'Settings updated' });
        } catch (error) {
            console.error(error);
            return res.status(500).json({ error: error.message });
        }
    }

    res.status(405).json({ message: 'Method Not Allowed' })
}

