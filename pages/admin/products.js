import { useState, useEffect } from 'react'
import AdminLayout from '../../components/admin/AdminLayout'
import { Icons } from '../../components/elements/Icons'

export default function AdminProducts() {
    const [products, setProducts] = useState([])
    const [isLoading, setIsLoading] = useState(true)
    const [newCommand, setNewCommand] = useState('')
    const [activeProductId, setActiveProductId] = useState(null)

    useEffect(() => {
        fetchProducts()
    }, [])

    async function fetchProducts() {
        try {
            const res = await fetch('/api/admin/products')
            const data = await res.json()
            if (Array.isArray(data)) {
                setProducts(data)
            } else {
                console.error("Failed to fetch products:", data)
                setProducts([])
            }
        } catch (error) {
            console.error(error)
            setProducts([])
        }
        setIsLoading(false)
    }

    async function handleAddCommand(e, productId) {
        e.preventDefault()
        if (!newCommand.trim()) return

        await fetch('/api/admin/products', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ productId, command: newCommand })
        })

        setNewCommand('')
        setActiveProductId(null)
        fetchProducts()
    }

    async function handleDeleteCommand(commandId) {
        if (!confirm('Are you sure you want to delete this command?')) return

        await fetch(`/api/admin/products?commandId=${commandId}`, {
            method: 'DELETE'
        })

        fetchProducts()
    }

    if (isLoading) return <AdminLayout title="Products & Commands">Loading...</AdminLayout>

    return (
        <AdminLayout title="Products & Commands">
            <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
                {products.map(product => (
                    <div key={product.id} className="mc-card p-6 flex flex-col gap-4">
                        <div className="flex items-center gap-4 border-b border-[#e8e0f0] pb-4">
                            <div className="w-16 h-16 relative flex items-center justify-center bg-[#f5f3f8] rounded-xl">
                                <img src={product.image} alt={product.name} className="w-12 h-12 object-contain" style={{ filter: product.image_filter }} />
                            </div>
                            <div>
                                <h3 className="font-extrabold text-lg">{product.name}</h3>
                                <p className="text-sm text-[#78716c]">Quantity: {product.quantity}x | Points: {product.points}</p>
                            </div>
                        </div>

                        <div>
                            <h4 className="font-bold text-sm mb-3">Commands to run on Trakteer Tip:</h4>
                            {product.commands && product.commands.length > 0 ? (
                                <ul className="space-y-2 mb-4">
                                    {product.commands.map(cmd => (
                                        <li key={cmd.id} className="flex items-center justify-between p-3 bg-[#f5f3f8] rounded-xl text-sm font-mono text-[#44403c] border border-[#e8e0f0]">
                                            <span className="truncate pr-4">{cmd.command}</span>
                                            <button
                                                onClick={() => handleDeleteCommand(cmd.id)}
                                                className="text-[#ef4444] hover:bg-[#fee2e2] p-1.5 rounded-lg transition-colors flex-shrink-0"
                                            >
                                                <Icons.X className="w-4 h-4" />
                                            </button>
                                        </li>
                                    ))}
                                </ul>
                            ) : (
                                <p className="text-sm text-[#a8a29e] mb-4">No commands set for this product.</p>
                            )}

                            {activeProductId === product.id ? (
                                <form onSubmit={(e) => handleAddCommand(e, product.id)} className="flex gap-2">
                                    <input
                                        type="text"
                                        value={newCommand}
                                        onChange={(e) => setNewCommand(e.target.value)}
                                        placeholder="e.g. points add {name} 500"
                                        className="flex-1 p-2 rounded-xl border border-[#e8e0f0] bg-[#f5f3f8] text-sm focus:outline-none focus:border-[#E26E10] font-mono"
                                        autoFocus
                                    />
                                    <button type="submit" className="bg-[#16a34a] text-white px-4 py-2 rounded-xl text-sm font-bold hover:bg-[#15803d]">Save</button>
                                    <button type="button" onClick={() => setActiveProductId(null)} className="bg-[#f5f3f8] text-[#78716c] px-4 py-2 rounded-xl text-sm font-bold hover:bg-[#e8e0f0]">Cancel</button>
                                </form>
                            ) : (
                                <button
                                    onClick={() => setActiveProductId(product.id)}
                                    className="text-sm font-bold text-[#E26E10] hover:text-[#c25e0e] flex items-center gap-1"
                                >
                                    + Add Command
                                </button>
                            )}
                        </div>
                    </div>
                ))}
            </div>
        </AdminLayout>
    )
}
