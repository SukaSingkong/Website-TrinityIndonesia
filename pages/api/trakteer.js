import { getDbConnection } from '../../lib/db'

export default async function handler(req, res) {
    if (req.method !== 'POST') {
        return res.status(405).json({ message: 'Method Not Allowed' })
    }

    if (req.query.token !== process.env.TRAKTEER_WEBHOOK_TOKEN) {
        return res.status(401).json({ message: 'Unauthorized token' })
    }

    try {
        const payload = req.body
        console.log("Incoming Webhook payload:", payload)

        // Adjust based on exact Trakteer POST body. Commonly `supporter_name` and `quantity`.
        const supporterName = payload.supporter_name || payload.display_name || payload.name;
        const quantity = parseFloat(payload.quantity);

        if (!supporterName || !quantity) {
            console.error("Missing supporter name or quantity in payload", payload);
            return res.status(400).json({ message: 'Missing supporter name or quantity' })
        }

        const pool = await getDbConnection();
        // Cari produk berdasarkan quantity (karena Store mengirim quantity ke Trakteer)
        const [products] = await pool.query('SELECT id FROM store_products WHERE quantity = ? LIMIT 1', [quantity]);

        if (products.length === 0) {
            console.error(`No product found for quantity: ${quantity}`);
            return res.status(404).json({ message: 'Product not found for that quantity', quantity });
        }

        const productId = products[0].id;
        const [commands] = await pool.query('SELECT command FROM store_product_commands WHERE product_id = ?', [productId]);

        const panelUrl = process.env.PTERODACTYL_PANEL_URL;
        const apiKey = process.env.PTERODACTYL_API_KEY;
        const serverId = process.env.PTERODACTYL_SERVER_ID;

        const executedCommands = [];

        if (panelUrl && apiKey && serverId) {
            for (const row of commands) {
                // Replace {name} dengan Nickname Player yang diinput di Trakteer
                const finalCommand = row.command.replace(/{name}/g, supporterName);

                const ptData = await fetch(`${panelUrl.replace(/\/$/, '')}/api/client/servers/${serverId}/command`, {
                    method: 'POST',
                    headers: {
                        'Authorization': `Bearer ${apiKey}`,
                        'Content-Type': 'application/json',
                        'Accept': 'Application/vnd.pterodactyl.v1+json'
                    },
                    body: JSON.stringify({ command: finalCommand })
                });

                if (ptData.ok) {
                    executedCommands.push(finalCommand);
                } else {
                    console.error("Failed to execute command:", finalCommand, "Pterodactyl Response:", await ptData.text());
                }
            }
        } else {
            console.error("Missing Pterodactyl Environment Variables (.env variables: PTERODACTYL_PANEL_URL, PTERODACTYL_API_KEY, PTERODACTYL_SERVER_ID)");
            return res.status(500).json({ message: 'Missing panel credentials configuration' });
        }

        return res.status(200).json({ success: true, executed: executedCommands });
    } catch (e) {
        console.error("Webhook processing error:", e)
        return res.status(500).json({ message: 'Webhook processing error', error: e.message })
    }
}
