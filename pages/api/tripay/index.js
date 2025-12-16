// API endpoint to check Tripay status and get latest donator
// GET /api/tripay - Returns status and latest donation

export default async function handler(req, res) {
    if (req.method !== 'GET') {
        return res.status(405).json({ success: false, message: 'Method not allowed' })
    }

    // Get donations from global store
    const donations = global.tripayDonations || []
    const latestDonator = donations.length > 0 ? donations[0] : null

    return res.status(200).json({
        status: 'ok',
        message: 'Tripay integration is running',
        latest_donator: latestDonator ? {
            nickname: latestDonator.nickname,
            gems: latestDonator.gems,
            amount: latestDonator.amount,
            payment_method: latestDonator.payment_method,
            paid_at: latestDonator.paid_at
        } : null,
        total_donations: donations.length
    })
}
