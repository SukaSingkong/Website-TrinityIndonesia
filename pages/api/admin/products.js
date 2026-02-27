import { getDbConnection } from '../../../lib/db'
import { getServerSession } from "next-auth/next"
import { authOptions } from "../auth/[...nextauth]"

export default async function handler(req, res) {
    const session = await getServerSession(req, res, authOptions)
    if (!session) return res.status(401).json({ message: "Unauthorized" })

    const pool = await getDbConnection();

    if (req.method === 'GET') {
        try {
            const [products] = await pool.query('SELECT * FROM store_products');
            for (let i = 0; i < products.length; i++) {
                const [commands] = await pool.query('SELECT id, command FROM store_product_commands WHERE product_id = ?', [products[i].id]);
                products[i].commands = commands;
            }
            return res.status(200).json(products);
        } catch (error) {
            return res.status(500).json({ error: error.message });
        }
    }

    if (req.method === 'POST') {
        // Add new command to product
        const { productId, command } = req.body;
        try {
            await pool.query('INSERT INTO store_product_commands (product_id, command) VALUES (?, ?)', [productId, command]);
            return res.status(200).json({ success: true });
        } catch (error) {
            return res.status(500).json({ error: error.message });
        }
    }

    if (req.method === 'DELETE') {
        // Delete command
        const { commandId } = req.query;
        try {
            await pool.query('DELETE FROM store_product_commands WHERE id = ?', [commandId]);
            return res.status(200).json({ success: true });
        } catch (error) {
            return res.status(500).json({ error: error.message });
        }
    }

    res.status(405).json({ message: 'Method Not Allowed' })
}
