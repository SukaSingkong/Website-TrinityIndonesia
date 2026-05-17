// Store rate limit data in memory. Since this is a simple API route, 
// a global Map is sufficient for basic protection against spamming.
const rateLimitCache = new Map();
const RATE_LIMIT_WINDOW_MS = 60 * 1000; // 1 minute
const MAX_REQUESTS_PER_WINDOW = 5; // Max 5 checkout attempts per IP per minute

export default async function handler(req, res) {
    if (req.method !== 'POST') {
        return res.status(405).json({ message: 'Method Not Allowed' })
    }

    // Basic Rate Limiting check based on IP Address
    const ip = req.headers['x-forwarded-for'] || req.connection.remoteAddress || 'unknown';
    const currentTime = Date.now();

    if (rateLimitCache.has(ip)) {
        const data = rateLimitCache.get(ip);
        if (currentTime - data.timestamp < RATE_LIMIT_WINDOW_MS) {
            if (data.count >= MAX_REQUESTS_PER_WINDOW) {
                return res.status(429).json({ message: 'Terlalu banyak permintaan. Silakan tunggu beberapa saat lagi.' });
            }
            data.count += 1;
            rateLimitCache.set(ip, data);
        } else {
            // Reset counter if window has passed
            rateLimitCache.set(ip, { count: 1, timestamp: currentTime });
        }
    } else {
        rateLimitCache.set(ip, { count: 1, timestamp: currentTime });
    }

    const apiKey = process.env.TAKO_API_KEY;
    const apiUrl = process.env.TAKO_API_URL || 'https://api.tako.id';

    if (!apiKey) {
        return res.status(500).json({ message: 'API Key not configured' });
    }

    try {
        const { name, amount, paymentMethod } = req.body;

        if (!name || !amount || !paymentMethod) {
            return res.status(400).json({ message: 'Missing name, amount, or paymentMethod' });
        }

        const payload = {
            name: name,
            email: `${name.toLowerCase().replace(/[^a-z0-9]/g, '')}@buyer-trinity.cc`, // Unique-ish email to avoid anti-fraud blocks
            amount: amount,
            paymentMethod: paymentMethod,
            message: `Pembelian points untuk username ${name}`
        };

        console.log("Sending request to Tako API:", {
            url: `${apiUrl}/api/gift/TrinityIndonesia`,
            paymentMethod: paymentMethod,
            amount: amount,
            name: name
        });

        const response = await fetch(`${apiUrl}/api/gift/TrinityIndonesia`, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${apiKey}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(payload)
        });

        const data = await response.json();
        console.log("Tako API Response Status:", response.status);
        console.log("Tako API Response Data:", JSON.stringify(data, null, 2));

        // Handle Tako API's response structure which wraps success in a `result` object
        // and may use status code 206 for successful creation
        const isSuccess = (response.ok && data.success) ||
            (data.result && data.result.success) ||
            (data.statusCode === 206 && data.result);

        if (isSuccess) {
            const resultData = data.result || data;

            return res.status(200).json({
                success: true,
                paymentUrl: resultData.paymentUrl,
                transactionId: resultData.transactionId
            });
        } else {
            console.error("Tako API Rejection:", data);
            return res.status(400).json({
                message: data.message || (data.error && data.error.message) || 'Failed to create payment URL',
                tako_response: data
            });
        }
    } catch (e) {
        console.error("Tako checkout error:", e);
        return res.status(500).json({ message: 'Internal server error', error: e.message });
    }
}

