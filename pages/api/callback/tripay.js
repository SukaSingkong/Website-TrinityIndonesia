// Tripay callback webhook handler at /api/callback/tripay
import crypto from 'crypto'

const TRIPAY_PRIVATE_KEY = process.env.TRIPAY_PRIVATE_KEY

// Disable body parsing to get raw body for signature verification
export const config = {
    api: {
        bodyParser: false
    }
}

// Helper to get raw body
async function getRawBody(req) {
    const chunks = []
    for await (const chunk of req) {
        chunks.push(chunk)
    }
    return Buffer.concat(chunks).toString('utf8')
}

export default async function handler(req, res) {
    if (req.method !== 'POST') {
        return res.status(405).json({ success: false, message: 'Method not allowed' })
    }

    // Check for required credentials
    if (!TRIPAY_PRIVATE_KEY) {
        console.error('Missing TRIPAY_PRIVATE_KEY')
        return res.status(500).json({
            success: false,
            message: 'Callback not configured'
        })
    }

    try {
        const rawBody = await getRawBody(req)
        const data = JSON.parse(rawBody)

        // Verify callback signature
        const callbackSignature = req.headers['x-callback-signature']
        const expectedSignature = crypto
            .createHmac('sha256', TRIPAY_PRIVATE_KEY)
            .update(rawBody)
            .digest('hex')

        if (callbackSignature !== expectedSignature) {
            console.error('Invalid callback signature')
            return res.status(401).json({ success: false, message: 'Invalid signature' })
        }

        // Extract transaction data
        const {
            reference,
            merchant_ref,
            payment_method,
            total_amount,
            status,
            paid_at
        } = data

        console.log('=== TRIPAY CALLBACK RECEIVED ===')
        console.log('Reference:', reference)
        console.log('Merchant Ref:', merchant_ref)
        console.log('Status:', status)
        console.log('Amount:', total_amount)

        // Only process successful payments
        if (status === 'PAID') {
            // Parse merchant_ref to extract nickname and gems
            // Format: GEMS-{timestamp}-{nickname}-{gems}
            const parts = merchant_ref.split('-')
            const gems = parseInt(parts.pop(), 10)
            const nickname = parts.slice(2).join('-') // Handle nicknames with dashes

            console.log('=== PAYMENT SUCCESS ===')
            console.log('Nickname:', nickname)
            console.log('Gems:', gems)
            console.log('Amount Paid:', total_amount)
            console.log('Payment Method:', payment_method)
            console.log('Paid At:', paid_at)

            // Store donation in memory
            const donation = {
                nickname,
                gems,
                amount: total_amount,
                payment_method,
                reference,
                paid_at: paid_at || new Date().toISOString()
            }

            // Initialize global if needed
            if (!global.tripayDonations) {
                global.tripayDonations = []
            }

            // Add to donations list (keep last 100)
            global.tripayDonations.unshift(donation)
            if (global.tripayDonations.length > 100) {
                global.tripayDonations = global.tripayDonations.slice(0, 100)
            }
        }

        // Return success to Tripay
        return res.status(200).json({ success: true })

    } catch (error) {
        console.error('Callback error:', error)
        return res.status(500).json({
            success: false,
            message: 'Internal server error'
        })
    }
}
