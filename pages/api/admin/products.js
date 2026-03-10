import { getDbConnection } from '../../../lib/db'
import { getServerSession } from "next-auth/next"
import { authOptions } from "../auth/[...nextauth]"

export default async function handler(req, res) {
    const session = await getServerSession(req, res, authOptions)
    if (!session) return res.status(401).json({ message: "Unauthorized" })

    const pool = await getDbConnection();

    if (req.method === 'GET') {
        try {
            const [products] = await pool.query('SELECT * FROM store_products ORDER BY id ASC');
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
        const { action } = req.body;

        // Add a new product
        if (action === 'add_product') {
            const { name, points, quantity, badge, popular, image, image_filter } = req.body;
            try {
                const [result] = await pool.query(
                    'INSERT INTO store_products (name, points, quantity, badge, popular, image, image_filter) VALUES (?, ?, ?, ?, ?, ?, ?)',
                    [name, points, quantity, badge || '', popular || false, image || '/vendor/gift1.webp', image_filter || '']
                );
                return res.status(200).json({ success: true, id: result.insertId });
            } catch (error) {
                return res.status(500).json({ error: error.message });
            }
        }

        // Add a command to a product (original behavior)
        const { productId, command } = req.body;
        try {
            await pool.query('INSERT INTO store_product_commands (product_id, command) VALUES (?, ?)', [productId, command]);
            return res.status(200).json({ success: true });
        } catch (error) {
            return res.status(500).json({ error: error.message });
        }
    }

    if (req.method === 'PUT') {
        const { productId, image_filter } = req.body;
        try {
            await pool.query('UPDATE store_products SET image_filter = ? WHERE id = ?', [image_filter, productId]);
            return res.status(200).json({ success: true });
        } catch (error) {
            return res.status(500).json({ error: error.message });
        }
    }

    if (req.method === 'DELETE') {
        const { commandId, productId } = req.query;

        // Delete a product
        if (productId) {
            try {
                await pool.query('DELETE FROM store_products WHERE id = ?', [productId]);
                return res.status(200).json({ success: true });
            } catch (error) {
                return res.status(500).json({ error: error.message });
            }
        }

        // Delete a command
        if (commandId) {
            try {
                await pool.query('DELETE FROM store_product_commands WHERE id = ?', [commandId]);
                return res.status(200).json({ success: true });
            } catch (error) {
                return res.status(500).json({ error: error.message });
            }
        }

        return res.status(400).json({ message: 'Missing productId or commandId' });
    }

    res.status(405).json({ message: 'Method Not Allowed' })
}
