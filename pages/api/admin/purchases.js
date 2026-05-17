import { getDbConnection } from '../../../lib/db'
import { getServerSession } from "next-auth/next"
import { authOptions } from "../auth/[...nextauth]"

export default async function handler(req, res) {
    const session = await getServerSession(req, res, authOptions)
    if (!session) return res.status(401).json({ message: "Unauthorized" })

    const pool = await getDbConnection();

    if (req.method === 'GET') {
        try {
            // Ensure rupiah_paid column exists (self-healing migration)
            try {
                await pool.query(`ALTER TABLE store_purchases ADD COLUMN rupiah_paid INT DEFAULT 0`);
            } catch (e) { /* column already exists */ }

            const [settingsRows] = await pool.query('SELECT discount_enabled, base_price_per_500, discount_percentage FROM store_settings LIMIT 1')
            const settings = settingsRows[0] || {}
            const discount_enabled = settings.discount_enabled === 1 || settings.discount_enabled === true
            const currentPricePer500 = discount_enabled ? (settings.base_price_per_500 * (1 - (settings.discount_percentage / 100))) : (settings.base_price_per_500 || 1000)

            // Fetch products for fallback calculation on old records
            const [products] = await pool.query('SELECT name, quantity FROM store_products')
            const productMap = {}
            for (const p of products) {
                productMap[p.name] = p.quantity
            }

            const [rows] = await pool.query('SELECT * FROM store_purchases ORDER BY created_at DESC LIMIT 100');
            const data = rows.map(r => {
                let rupiah = r.rupiah_paid || 0;
                // Fallback for old records that don't have rupiah_paid
                if (!rupiah && productMap[r.product_name]) {
                    rupiah = productMap[r.product_name] * currentPricePer500;
                }
                return { ...r, rupiah_value: rupiah };
            });
            return res.status(200).json(data);
        } catch (error) {
            return res.status(500).json({ error: error.message });
        }
    }

    if (req.method === 'DELETE') {
        const { id, all } = req.query;

        // Delete all purchase logs
        if (all === 'true') {
            try {
                await pool.query('DELETE FROM store_purchases');
                return res.status(200).json({ success: true });
            } catch (error) {
                return res.status(500).json({ error: error.message });
            }
        }

        // Delete single purchase log
        if (id) {
            try {
                await pool.query('DELETE FROM store_purchases WHERE id = ?', [id]);
                return res.status(200).json({ success: true });
            } catch (error) {
                return res.status(500).json({ error: error.message });
            }
        }

        return res.status(400).json({ message: 'Missing id or all parameter' });
    }

    res.status(405).json({ message: 'Method Not Allowed' })
}

