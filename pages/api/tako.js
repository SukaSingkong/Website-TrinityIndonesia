import { getDbConnection } from '../../lib/db'
import crypto from 'crypto';

export default async function handler(req, res) {
    if (req.method !== 'POST') {
        return res.status(405).json({ message: 'Method Not Allowed' })
    }

    const webhookToken = process.env.TAKO_WEBHOOK_TOKEN;
    const signatureFromHeader = req.headers['x-tako-signature'];

    if (webhookToken && signatureFromHeader) {
        const computedSignature = crypto
            .createHmac("sha256", webhookToken)
            .update(JSON.stringify(req.body))
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
        const payload = req.body;
        console.log("Incoming Tako Webhook payload:", payload);

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

        const [settingsRows] = await pool.query('SELECT discount_enabled, base_price_per_500, discounted_price_per_500 FROM store_settings LIMIT 1');
        const dbSettings = settingsRows[0] || { discount_enabled: 0, base_price_per_500: 5000, discounted_price_per_500: 4000 };

        // Find which quantity this amount corresponds to
        let quantity = 0;
        let matchedProductPoints = 0;
        let matchedProductName = "";
        let productId = null;

        const [productRows] = await pool.query('SELECT id, name, quantity, points FROM store_products');

        for (const p of productRows) {
            const basePrice = p.quantity * dbSettings.base_price_per_500;
            const currentPrice = dbSettings.discount_enabled ? (p.quantity * dbSettings.discounted_price_per_500) : basePrice;

            if (amount === currentPrice) {
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
