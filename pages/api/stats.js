export default async function handler(req, res) {
    try {
        const response = await fetch('http://160.187.210.22:30069/stats.json', {
            headers: {
                'Accept': 'application/json',
            }
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
