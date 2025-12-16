// API endpoint to get donation list
// Returns nickname and gems for each successful donation

export default async function handler(req, res) {
    if (req.method !== 'GET') {
        return res.status(405).json({ success: false, message: 'Method not allowed' })
    }

    try {
        // Get donations from global store
        const donations = global.tripayDonations || []

        // Return donation data
        return res.status(200).json({
            success: true,
            data: donations.map(d => ({
                nickname: d.nickname,
                gems: d.gems,
                amount: d.amount,
                payment_method: d.payment_method,
                paid_at: d.paid_at
            }))
        })

    } catch (error) {
        console.error('Donate API error:', error)
        return res.status(500).json({
            success: false,
            message: 'Internal server error'
        })
    }
}
