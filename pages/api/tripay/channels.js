// API route to get available Tripay payment channels

const TRIPAY_API_KEY = process.env.TRIPAY_API_KEY
const TRIPAY_MODE = process.env.TRIPAY_MODE || 'sandbox'

const BASE_URL = TRIPAY_MODE === 'production'
    ? 'https://tripay.co.id/api'
    : 'https://tripay.co.id/api-sandbox'

export default async function handler(req, res) {
    if (req.method !== 'GET') {
        return res.status(405).json({ success: false, message: 'Method not allowed' })
    }

    try {
        const response = await fetch(`${BASE_URL}/merchant/payment-channel`, {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${TRIPAY_API_KEY}`
            }
        })

        const data = await response.json()

        if (!data.success) {
            return res.status(400).json({
                success: false,
                message: data.message || 'Failed to fetch payment channels'
            })
        }

        // Filter and format channels
        const channels = data.data
            .filter(channel => channel.active)
            .map(channel => ({
                code: channel.code,
                name: channel.name,
                group: channel.group,
                fee_flat: channel.fee_merchant.flat,
                fee_percent: channel.fee_merchant.percent,
                icon_url: channel.icon_url
            }))

        return res.status(200).json({
            success: true,
            data: channels
        })

    } catch (error) {
        console.error('Fetch channels error:', error)
        return res.status(500).json({
            success: false,
            message: 'Internal server error'
        })
    }
}
