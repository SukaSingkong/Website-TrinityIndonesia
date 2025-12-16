// API route to create Tripay transaction
import crypto from 'crypto'

const TRIPAY_API_KEY = process.env.TRIPAY_API_KEY
const TRIPAY_PRIVATE_KEY = process.env.TRIPAY_PRIVATE_KEY
const TRIPAY_MERCHANT_CODE = process.env.TRIPAY_MERCHANT_CODE
const TRIPAY_MODE = process.env.TRIPAY_MODE || 'sandbox'

const BASE_URL = TRIPAY_MODE === 'production'
    ? 'https://tripay.co.id/api'
    : 'https://tripay.co.id/api-sandbox'

export default async function handler(req, res) {
    if (req.method !== 'POST') {
        return res.status(405).json({ success: false, message: 'Method not allowed' })
    }

    // Check for required credentials
    if (!TRIPAY_API_KEY || !TRIPAY_PRIVATE_KEY || !TRIPAY_MERCHANT_CODE) {
        console.error('Missing Tripay credentials. Please set TRIPAY_API_KEY, TRIPAY_PRIVATE_KEY, and TRIPAY_MERCHANT_CODE in .env.local')
        return res.status(500).json({
            success: false,
            message: 'Payment gateway not configured. Please contact administrator.'
        })
    }

    try {
        const { method, amount, nickname, gems, customerEmail, customerPhone } = req.body

        if (!method || !amount || !nickname || !gems) {
            return res.status(400).json({
                success: false,
                message: 'Missing required fields: method, amount, nickname, gems'
            })
        }

        // Generate unique merchant reference
        const merchantRef = `GEMS-${Date.now()}-${nickname}-${gems}`

        // Calculate signature
        const signature = crypto
            .createHmac('sha256', TRIPAY_PRIVATE_KEY)
            .update(TRIPAY_MERCHANT_CODE + merchantRef + amount)
            .digest('hex')

        // Prepare order items
        const orderItems = [
            {
                sku: `GEMS-${gems}`,
                name: `${gems} Gems`,
                price: amount,
                quantity: 1,
                subtotal: amount
            }
        ]

        // Create transaction payload
        const payload = {
            method: method,
            merchant_ref: merchantRef,
            amount: amount,
            customer_name: nickname,
            customer_email: customerEmail || 'noreply@trinityindonesia.cc',
            customer_phone: customerPhone || '08123456789',
            order_items: orderItems,
            return_url: `${process.env.NEXT_PUBLIC_BASE_URL || 'https://www.trinityindonesia.cc'}/store?status=success`,
            expired_time: Math.floor(Date.now() / 1000) + (24 * 60 * 60), // 24 hours
            signature: signature
        }

        // Call Tripay API
        const response = await fetch(`${BASE_URL}/transaction/create`, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${TRIPAY_API_KEY}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(payload)
        })

        const data = await response.json()

        if (!data.success) {
            console.error('Tripay error:', data)
            return res.status(400).json({
                success: false,
                message: data.message || 'Failed to create transaction'
            })
        }

        // Return checkout URL and transaction data
        return res.status(200).json({
            success: true,
            data: {
                reference: data.data.reference,
                merchant_ref: data.data.merchant_ref,
                checkout_url: data.data.checkout_url,
                pay_code: data.data.pay_code,
                pay_url: data.data.pay_url,
                amount: data.data.amount,
                expired_time: data.data.expired_time
            }
        })

    } catch (error) {
        console.error('Create transaction error:', error)
        return res.status(500).json({
            success: false,
            message: 'Internal server error'
        })
    }
}
