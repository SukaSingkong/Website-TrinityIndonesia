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

    // --- WEBHOOK RAW LOG (for debugging / audit) ---
    try {
        const pool = await getDbConnection();
        await pool.query(
            'INSERT INTO tako_webhook_logs (headers, body) VALUES (?, ?)',
            [JSON.stringify(req.headers), rawBody]
        );
    } catch (logErr) {
        console.error("Failed to insert into webhook logs:", logErr);
    }
    // -----------------------------------------------

    // Verify signature if webhookToken is set
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

        const supporterName = payload.gifterName || payload.name;
        const amount = parseFloat(payload.amount);
        // Tako may send a unique transaction/order ID — use it for deduplication
        const takoTransactionId = payload.transactionId || payload.orderId || payload.id || null;

        if (!supporterName || !amount) {
            console.error("Missing supporter name or amount in payload", payload);
            return res.status(400).json({ message: 'Missing supporter name or amount' });
        }

        const pool = await getDbConnection();

        // --- DUPLICATE WEBHOOK GUARD ---
        // Tako sometimes retries webhooks on timeout. If we already processed this
        // transaction successfully, return 200 immediately so Tako stops retrying.
        if (takoTransactionId) {
            const [dupRows] = await pool.query(
                "SELECT id FROM store_purchases WHERE tako_transaction_id = ? AND status = 'success' LIMIT 1",
                [takoTransactionId]
            );
            if (dupRows.length > 0) {
                console.log(`Duplicate webhook for transaction ${takoTransactionId} — already processed. Returning 200.`);
                return res.status(200).json({ success: true, message: 'Already processed' });
            }
        }
        // --------------------------------

        const [settingsRows] = await pool.query('SELECT * FROM store_settings LIMIT 1');
        let dbSettings = settingsRows[0] || { discount_enabled: 0, base_price_per_500: 1000, discount_percentage: 0 };

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

        // --- PRODUCT MATCHING ---
        // Try to match the received amount to a known product.
        // We use a generous EPSILON to absorb float rounding from Tako's side.
        // We also try BOTH discounted and base price to handle the race condition where:
        //   - Player paid during an active discount
        //   - But the webhook arrived after the discount timer expired
        let quantity = 0;
        let matchedProductPoints = 0;
        let matchedProductName = "";
        let productId = null;
        let matchedRupiahPaid = 0;

        const [productRows] = await pool.query('SELECT id, name, quantity, points FROM store_products');

        // Tolerance: 1.5 covers most float rounding (Tako rounds to nearest rupiah)
        const EPSILON = 1.5;

        for (const p of productRows) {
            const basePrice = p.quantity * dbSettings.base_price_per_500;
            const discountedPrice = dbSettings.discount_percentage > 0
                ? Math.round(basePrice * (1 - (dbSettings.discount_percentage / 100)))
                : null;

            // Candidate prices to try, in order of priority:
            // 1. Currently active price (discounted if ON, base if OFF)
            // 2. Discounted price (fallback for race condition — webhook arrived after expiry)
            // 3. Base price (final fallback)
            const candidatePrices = [];
            if (dbSettings.discount_enabled && discountedPrice !== null) {
                candidatePrices.push(discountedPrice);
            } else {
                candidatePrices.push(basePrice);
            }
            if (!dbSettings.discount_enabled && discountedPrice !== null) {
                candidatePrices.push(discountedPrice); // race condition fallback
            }
            if (!candidatePrices.includes(basePrice)) {
                candidatePrices.push(basePrice);
            }

            let matched = false;
            for (const candidatePrice of candidatePrices) {
                const totalWithFee = candidatePrice + 1000; // +1000 = Tako transfer fee
                if (Math.abs(amount - totalWithFee) < EPSILON) {
                    productId = p.id;
                    quantity = p.quantity;
                    matchedProductPoints = p.points;
                    matchedProductName = p.name;
                    matchedRupiahPaid = candidatePrice;
                    matched = true;
                    break;
                }
            }
            if (matched) break;
        }
        // -------------------------

        if (!productId) {
            console.error(`Product mismatch - Received Amount: ${amount}. No matching product found.`);

            // Log mismatch so admin can manually deliver points
            try {
                await pool.query(`
                    INSERT INTO store_purchases (player_name, product_name, points_purchased, rupiah_paid, commands_executed, status, tako_transaction_id)
                    VALUES (?, ?, ?, ?, ?, ?, ?)
                `, [supporterName, `MISMATCH: Rp ${amount}`, 0, 0, JSON.stringify({ received_amount: amount }), 'mismatch_requires_manual', takoTransactionId]);
            } catch (logErr) {
                console.error("Failed to log mismatching purchase:", logErr);
            }

            return res.status(404).json({ message: 'Product not found for that amount', received_amount: amount });
        }

        const [commands] = await pool.query('SELECT command FROM store_product_commands WHERE product_id = ?', [productId]);

        const panelUrl = process.env.PTERODACTYL_PANEL_URL;
        const apiKey = process.env.PTERODACTYL_API_KEY;
        const serverId = process.env.PTERODACTYL_SERVER_ID;

        if (!panelUrl || !apiKey || !serverId) {
            console.error("Missing Pterodactyl Environment Variables");
            // Log as pending so admin knows to deliver manually
            try {
                await pool.query(`
                    INSERT INTO store_purchases (player_name, product_name, points_purchased, rupiah_paid, commands_executed, status, tako_transaction_id)
                    VALUES (?, ?, ?, ?, ?, ?, ?)
                `, [supporterName, matchedProductName, matchedProductPoints, matchedRupiahPaid, JSON.stringify([]), 'failed_missing_panel_config', takoTransactionId]);
            } catch (logErr) {
                console.error("Failed to log panel config failure:", logErr);
            }
            return res.status(500).json({ message: 'Missing panel credentials configuration' });
        }

        // --- EXECUTE COMMANDS ---
        const executedCommands = [];
        const failedCommands = [];

        for (const row of commands) {
            const finalCommand = row.command.replace(/{player}/g, supporterName);

            try {
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
                    const errText = await ptData.text();
                    console.error("Failed to execute command:", finalCommand, "Pterodactyl:", errText);
                    failedCommands.push({ command: finalCommand, error: errText });
                }
            } catch (fetchErr) {
                console.error("Network error executing command:", finalCommand, fetchErr);
                failedCommands.push({ command: finalCommand, error: fetchErr.message });
            }
        }
        // ------------------------

        // Determine final status:
        // - 'success': all commands executed
        // - 'partial': some commands failed (admin needs to resend missing ones)
        // - 'failed_panel_error': all commands failed (panel offline, etc.)
        let finalStatus;
        if (executedCommands.length === commands.length) {
            finalStatus = 'success';
        } else if (executedCommands.length > 0) {
            finalStatus = 'partial';
        } else {
            finalStatus = 'failed_panel_error';
        }

        // Always log the purchase outcome, regardless of success/failure,
        // so admin can see what happened and manually fix if needed.
        try {
            await pool.query(`
                INSERT INTO store_purchases (player_name, product_name, points_purchased, rupiah_paid, commands_executed, status, tako_transaction_id)
                VALUES (?, ?, ?, ?, ?, ?, ?)
            `, [
                supporterName,
                matchedProductName || `Product ID ${productId}`,
                matchedProductPoints,
                matchedRupiahPaid,
                JSON.stringify({ executed: executedCommands, failed: failedCommands }),
                finalStatus,
                takoTransactionId
            ]);
        } catch (logErr) {
            console.error("Failed to log purchase to DB:", logErr);
        }

        // Always return 200 to Tako so they don't retry already-processed webhooks.
        // If delivery failed, admin can re-send manually from the purchases page.
        return res.status(200).json({
            success: true,
            status: finalStatus,
            executed: executedCommands,
            failed: failedCommands
        });

    } catch (e) {
        console.error("Webhook processing error:", e)
        return res.status(500).json({ message: 'Webhook processing error', error: e.message })
    }
}

