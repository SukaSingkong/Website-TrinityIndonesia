export default async function handler(req, res) {
    res.setHeader('Cache-Control', 'no-store, no-cache, must-revalidate, proxy-revalidate');
    res.setHeader('Pragma', 'no-cache');
    res.setHeader('Expires', '0');

    try {
        const response = await fetch(`http://208.84.103.189:30069/stats.json?t=${new Date().getTime()}`, {
            headers: {
                'Accept': 'application/json',
                'Cache-Control': 'no-cache'
            },
            cache: 'no-store'
        });

        if (!response.ok) {
            throw new Error(`Failed to fetch stats: ${response.status}`);
        }

        const data = await response.json();
        res.status(200).json(data);
    } catch (error) {
        console.error('API Route Error:', error);
        res.status(500).json({ error: 'Failed to load stats data' });
    }
}
