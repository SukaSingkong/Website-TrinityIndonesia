export default async function handler(req, res) {
    if (req.method !== 'POST') {
        return res.status(405).json({ message: 'Method Not Allowed' })
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
            email: 'buyer@trinityindonesia.cc', // Default email since game only provides username
            amount: amount,
            paymentMethod: paymentMethod,
            message: `Pembelian points untuk username ${name}`
        };

        const response = await fetch(`${apiUrl}/api/gift/TrinityIndonesia`, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${apiKey}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(payload)
        });

        const data = await response.json();

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
