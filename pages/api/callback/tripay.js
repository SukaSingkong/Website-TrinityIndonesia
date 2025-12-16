// Tripay callback webhook handler at /api/callback/tripay
import crypto from 'crypto'

const TRIPAY_PRIVATE_KEY = process.env.TRIPAY_PRIVATE_KEY

// Disable body parsing to get raw body for signature verification
export const config = {
    api: {
        bodyParser: false
    }
}

// Helper to get raw body with timeout
async function getRawBody(req) {
    return new Promise((resolve, reject) => {
        const chunks = []
        const timeout = setTimeout(() => {
            reject(new Error('Body read timeout'))
        }, 3000)

        req.on('data', (chunk) => chunks.push(chunk))
        req.on('end', () => {
            clearTimeout(timeout)
            resolve(Buffer.concat(chunks).toString('utf8'))
        })
        req.on('error', (err) => {
            clearTimeout(timeout)
            reject(err)
        })
    })
}

export default async function handler(req, res) {
    // Immediately acknowledge for non-POST
    if (req.method !== 'POST') {
        return res.status(405).json({ success: false })
    }

    // Check for required credentials
    if (!TRIPAY_PRIVATE_KEY) {
        console.error('Missing TRIPAY_PRIVATE_KEY')
        return res.status(200).json({ success: true }) // Still return success to prevent retries
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
            console.error('Invalid signature - received:', callbackSignature, 'expected:', expectedSignature)
            // Return success anyway to prevent Tripay from retrying
            return res.status(200).json({ success: true })
        }

        const { reference, merchant_ref, payment_method, total_amount, status, paid_at } = data

        console.log('Callback:', status, merchant_ref, total_amount)

        // Process successful payments
        if (status === 'PAID') {
            const parts = merchant_ref.split('-')
            const gems = parseInt(parts.pop(), 10)
            const nickname = parts.slice(2).join('-')

            console.log('PAID:', nickname, gems, 'gems')

            // Store donation
            if (!global.tripayDonations) global.tripayDonations = []
            global.tripayDonations.unshift({
                nickname,
                gems,
                amount: total_amount,
                payment_method,
                reference,
                paid_at: paid_at || new Date().toISOString()
            })
            if (global.tripayDonations.length > 100) {
                global.tripayDonations = global.tripayDonations.slice(0, 100)
            }
        }

        // Return success immediately
        return res.status(200).json({ success: true })

    } catch (error) {
        console.error('Callback error:', error.message)
        // Return success to prevent Tripay retries
        return res.status(200).json({ success: true })
    }
}
