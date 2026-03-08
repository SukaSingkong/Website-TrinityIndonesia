import { getDbConnection } from '../../lib/db'
import crypto from 'crypto';

export const config = {
    api: {
        bodyParser: false,
    },
};

const getRawBody = (req) => {
    return new Promise((resolve, reject) => {
        let body = [];
        req.on('data', (chunk) => {
            body.push(chunk);
        });
        req.on('end', () => {
            resolve(Buffer.concat(body).toString());
        });
        req.on('error', (err) => {
            reject(err);
        });
    });
};

export default async function handler(req, res) {
    if (req.method !== 'POST') {
        return res.status(405).json({ message: 'Method Not Allowed' })
    }

    const webhookToken = process.env.TAKO_WEBHOOK_TOKEN;
    const signatureFromHeader = req.headers['x-tako-signature'];

    let rawBody;
    try {
        rawBody = await getRawBody(req);
    } catch (e) {
        console.error("Failed to read raw body", e);
        return res.status(500).json({ message: 'Failed to read raw body' });
    }

    // --- TEMPORARY LOGGING FOR DEBUGGING ---
    try {
        const pool = await getDbConnection();
        await pool.query(
            'INSERT INTO tako_webhook_logs (headers, body) VALUES (?, ?)',
            [JSON.stringify(req.headers), rawBody]
        );
    } catch (logErr) {
        console.error("Failed to insert into webhook logs:", logErr);
    }
    // ---------------------------------------

    if (webhookToken && signatureFromHeader) {
        const computedSignature = crypto
            .createHmac("sha256", webhookToken)
            .update(rawBody)
            .digest("hex");

        const isValid = crypto.timingSafeEqual(
            Buffer.from(computedSignature),
            Buffer.from(signatureFromHeader)
        );

        if (!isValid) {
            return res.status(401).json({ message: 'Invalid signature' });
        }
    } else if (webhookToken && !signatureFromHeader) {
        return res.status(401).json({ message: 'Missing signature' });
    }

    try {
        const payload = JSON.parse(rawBody);
        console.log("Incoming Tako Webhook payload:", payload);

        // Handle Tako Webhook Test Notification
        if (payload.test || payload.event === 'test' || !payload.amount) {
            console.log("Received Tako test/invalid payload without amount. Returning 200 OK.");
            return res.status(200).json({ success: true, message: "Webhook received successfully (test mode)" });
        }

        // Tako provides name, amount, message, etc. based on the gift API specs.
        const supporterName = payload.name;
        const amount = parseFloat(payload.amount);

        if (!supporterName || !amount) {
            console.error("Missing supporter name or amount in payload", payload);
            return res.status(400).json({ message: 'Missing supporter name or amount' });
        }

        const pool = await getDbConnection();

        // Find product based on price/amount (handling discounts if necessary, assuming base point = Rp 10 / point -> 500 = 5000)
        // Store saves base_price_per_500 and discounted_price_per_500, we check if this matches any product.
        // Easiest is to find the exact price matched

        const [settingsRows] = await pool.query('SELECT * FROM store_settings LIMIT 1');
        let dbSettings = settingsRows[0] || { discount_enabled: 0, base_price_per_500: 5000, discounted_price_per_500: 4000 };

        // Auto-disable discount if timer has expired
        if (dbSettings.discount_enabled && dbSettings.discount_timer) {
            const timerEnd = new Date(dbSettings.discount_timer).getTime();
            if (Date.now() >= timerEnd) {
                await pool.query(
                    'UPDATE store_settings SET discount_enabled = 0, discount_timer = NULL WHERE id = ?',
                    [dbSettings.id || 1]
                );
                dbSettings = { ...dbSettings, discount_enabled: 0, discount_timer: null };
            }
        }

        // Find which quantity this amount corresponds to
        let quantity = 0;
        let matchedProductPoints = 0;
        let matchedProductName = "";
        let productId = null;

        const [productRows] = await pool.query('SELECT id, name, quantity, points FROM store_products');

        for (const p of productRows) {
            const basePrice = p.quantity * dbSettings.base_price_per_500;
            const currentPrice = dbSettings.discount_enabled ? (p.quantity * dbSettings.discounted_price_per_500) : basePrice;
            const totalWithFee = currentPrice + 1000;

            if (amount === totalWithFee) {
                productId = p.id;
                quantity = p.quantity;
                matchedProductPoints = p.points;
                matchedProductName = p.name;
                break;
            }
        }

        if (!productId) {
            console.error(`No product found corresponding to amount: ${amount}`);
            return res.status(404).json({ message: 'Product not found for that amount', amount });
        }

        const [commands] = await pool.query('SELECT command FROM store_product_commands WHERE product_id = ?', [productId]);

        const panelUrl = process.env.PTERODACTYL_PANEL_URL;
        const apiKey = process.env.PTERODACTYL_API_KEY;
        const serverId = process.env.PTERODACTYL_SERVER_ID;

        const executedCommands = [];

        if (panelUrl && apiKey && serverId) {
            for (const row of commands) {
                const finalCommand = row.command.replace(/{player}/g, supporterName);

                const ptData = await fetch(`${panelUrl.replace(/\/\$/, '')}/api/client/servers/${serverId}/command`, {
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
            console.error("Missing Pterodactyl Environment Variables");
            return res.status(500).json({ message: 'Missing panel credentials configuration' });
        }

        if (executedCommands.length > 0) {
            try {
                await pool.query(`
                    INSERT INTO store_purchases (player_name, product_name, points_purchased, commands_executed, status)
                    VALUES (?, ?, ?, ?, ?)
                `, [supporterName, matchedProductName || `Product ID ${productId}`, matchedProductPoints, JSON.stringify(executedCommands), 'success']);
            } catch (logErr) {
                console.error("Failed to log purchase to DB:", logErr);
            }
        }

        return res.status(200).json({ success: true, executed: executedCommands });
    } catch (e) {
        console.error("Webhook processing error:", e)
        return res.status(500).json({ message: 'Webhook processing error', error: e.message })
    }
}
