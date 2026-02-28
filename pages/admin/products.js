import { useState, useEffect } from 'react'
import AdminLayout from '../../components/admin/AdminLayout'
import { Icons } from '../../components/elements/Icons'

const GIFT_IMAGES = [
    '/vendor/gift1.webp',
    '/vendor/gift2.webp',
    '/vendor/gift3.webp',
]

function randomHue() {
    const deg = Math.floor(Math.random() * 360)
    return `hue-rotate(${deg}deg)`
}

export default function AdminProducts() {
    const [products, setProducts] = useState([])
    const [isLoading, setIsLoading] = useState(true)
    const [newCommand, setNewCommand] = useState('')
    const [activeProductId, setActiveProductId] = useState(null)
    const [editingBadgeId, setEditingBadgeId] = useState(null)
    const [editBadgeText, setEditBadgeText] = useState('')

    // Pagination
    const PRODUCTS_PER_PAGE = 4
    const [currentPage, setCurrentPage] = useState(1)
    const totalPages = Math.ceil(products.length / PRODUCTS_PER_PAGE)
    const paginatedProducts = products.slice((currentPage - 1) * PRODUCTS_PER_PAGE, currentPage * PRODUCTS_PER_PAGE)

    // New product form
    const [showAddForm, setShowAddForm] = useState(false)
    const [newProduct, setNewProduct] = useState({
        name: '', points: 500, quantity: 1, badge: '', popular: false,
        image: '/vendor/gift1.webp', image_filter: ''
    })

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

    async function handleAddProduct(e) {
        e.preventDefault()
        if (!newProduct.name.trim()) return

        await fetch('/api/admin/products', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ action: 'add_product', ...newProduct })
        })

        setNewProduct({ name: '', points: 500, quantity: 1, badge: '', popular: false, image: '/vendor/gift1.webp', image_filter: '' })
        setShowAddForm(false)
        fetchProducts()
    }

    async function handleDeleteProduct(productId, productName) {
        if (!confirm(`Hapus produk "${productName}"? Semua commands terkait juga akan dihapus.`)) return

        await fetch(`/api/admin/products?productId=${productId}`, { method: 'DELETE' })
        fetchProducts()
    }

    async function handleRandomizeHue(productId) {
        const filter = randomHue()
        await fetch('/api/admin/products', {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ action: 'randomize_hue', productId, image_filter: filter })
        })
        fetchProducts()
    }

    async function handleEditBadge(e, productId) {
        e.preventDefault()
        await fetch('/api/admin/products', {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ action: 'edit_badge', productId, badge: editBadgeText.trim() })
        })
        setEditingBadgeId(null)
        setEditBadgeText('')
        fetchProducts()
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
        if (!confirm('Hapus command ini?')) return

        await fetch(`/api/admin/products?commandId=${commandId}`, { method: 'DELETE' })
        fetchProducts()
    }

    if (isLoading) return (
        <AdminLayout title="Kelola Products & Commands">
            <div className="mb-6 flex items-center justify-between animate-pulse">
                <div className="h-4 bg-gray-200 rounded w-32"></div>
                <div className="h-10 bg-gray-200 rounded-xl w-36"></div>
            </div>
            <div className="grid grid-cols-1 xl:grid-cols-2 gap-6 animate-pulse">
                {[...Array(4)].map((_, i) => (
                    <div key={i} className="mc-card p-6 flex flex-col gap-4 relative overflow-hidden">
                        <div className="flex items-center gap-4 border-b pb-4" style={{ borderColor: 'var(--bg-body)' }}>
                            <div className="w-16 h-16 bg-gray-200 rounded-xl"></div>
                            <div className="flex-1 min-w-0 flex flex-col gap-2">
                                <div className="h-6 bg-gray-200 rounded w-48"></div>
                                <div className="h-4 bg-gray-200 rounded w-32"></div>
                            </div>
                            <div className="flex gap-2">
                                <div className="w-9 h-9 bg-gray-200 rounded-lg"></div>
                                <div className="w-9 h-9 bg-gray-200 rounded-lg"></div>
                            </div>
                        </div>
                        <div className="rounded-xl p-4" style={{ background: 'var(--bg-body)' }}>
                            <div className="h-4 bg-gray-200 rounded w-48 mb-4"></div>
                            <div className="space-y-2 mb-4">
                                <div className="h-10 bg-white rounded-xl border" style={{ borderColor: 'var(--bg-body)' }}></div>
                                <div className="h-10 bg-white rounded-xl border" style={{ borderColor: 'var(--bg-body)' }}></div>
                            </div>
                            <div className="h-10 bg-gray-200 rounded-xl w-32 mt-2"></div>
                        </div>
                    </div>
                ))}
            </div>
        </AdminLayout>
    )

    return (
        <AdminLayout title="Kelola Products & Commands">
            {/* Add Product Button */}
            <div className="mb-6 flex items-center justify-between">
                <p className="text-sm font-bold" style={{ color: 'var(--text-muted)' }}>
                    {products.length} produk terdaftar
                </p>
                <button
                    onClick={() => setShowAddForm(!showAddForm)}
                    className="flex items-center gap-2 px-5 py-3 rounded-xl text-sm font-extrabold text-white transition-all hover:opacity-90 shadow-md"
                    style={{ background: 'var(--brand-secondary)' }}
                >
                    {showAddForm ? (
                        <><Icons.X className="w-4 h-4" /> Batal</>
                    ) : (
                        <><span className="text-lg leading-none">+</span> Tambah Produk</>
                    )}
                </button>
            </div>

            {/* Add Product Form */}
            {showAddForm && (
                <div className="mc-card p-6 mb-6 relative overflow-hidden border-2 border-dashed" style={{ borderColor: 'var(--brand-secondary)' }}>
                    <div className="absolute top-0 right-0 w-48 h-48 bg-[var(--brand-primary)] opacity-5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2"></div>

                    <h3 className="text-lg font-black mb-4 relative z-10" style={{ color: 'var(--text-primary)' }}>
                        <Icons.ShoppingBag className="w-5 h-5 inline mr-2" style={{ color: 'var(--brand-secondary)' }} />
                        Tambah Produk Baru
                    </h3>

                    <form onSubmit={handleAddProduct} className="space-y-4 relative z-10">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-extrabold mb-1" style={{ color: 'var(--text-secondary)' }}>Nama Produk</label>
                                <input
                                    type="text" required
                                    value={newProduct.name}
                                    onChange={(e) => setNewProduct({ ...newProduct, name: e.target.value })}
                                    placeholder="Contoh: 500 Points"
                                    className="w-full p-3 rounded-xl border-2 bg-white text-sm font-bold focus:outline-none transition-colors"
                                    style={{ borderColor: 'var(--bg-body)', color: 'var(--text-primary)' }}
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-extrabold mb-1" style={{ color: 'var(--text-secondary)' }}>Badge <span className="text-xs font-bold opacity-60">(Opsional)</span></label>
                                <input
                                    type="text"
                                    value={newProduct.badge}
                                    onChange={(e) => setNewProduct({ ...newProduct, badge: e.target.value })}
                                    placeholder="Contoh: PALING LARIS!"
                                    className="w-full p-3 rounded-xl border-2 bg-white text-sm font-bold focus:outline-none transition-colors"
                                    style={{ borderColor: 'var(--bg-body)', color: 'var(--text-primary)' }}
                                />
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            <div>
                                <label className="block text-sm font-extrabold mb-1" style={{ color: 'var(--text-secondary)' }}>Points</label>
                                <input
                                    type="number" required min="1"
                                    value={newProduct.points}
                                    onChange={(e) => setNewProduct({ ...newProduct, points: Number(e.target.value) })}
                                    className="w-full p-3 rounded-xl border-2 bg-white text-sm font-bold focus:outline-none transition-colors"
                                    style={{ borderColor: 'var(--bg-body)', color: 'var(--text-primary)' }}
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-extrabold mb-1" style={{ color: 'var(--text-secondary)' }}>Quantity <span className="text-xs font-bold opacity-60">(kelipatan 500)</span></label>
                                <input
                                    type="number" required min="1"
                                    value={newProduct.quantity}
                                    onChange={(e) => setNewProduct({ ...newProduct, quantity: Number(e.target.value) })}
                                    className="w-full p-3 rounded-xl border-2 bg-white text-sm font-bold focus:outline-none transition-colors"
                                    style={{ borderColor: 'var(--bg-body)', color: 'var(--text-primary)' }}
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-extrabold mb-1" style={{ color: 'var(--text-secondary)' }}>Gambar</label>
                                <select
                                    value={newProduct.image}
                                    onChange={(e) => setNewProduct({ ...newProduct, image: e.target.value })}
                                    className="w-full p-3 rounded-xl border-2 bg-white text-sm font-bold focus:outline-none transition-colors cursor-pointer"
                                    style={{ borderColor: 'var(--bg-body)', color: 'var(--text-primary)' }}
                                >
                                    {GIFT_IMAGES.map(img => (
                                        <option key={img} value={img}>{img.split('/').pop()}</option>
                                    ))}
                                </select>
                            </div>
                        </div>

                        {/* Image Preview + Hue Randomize */}
                        <div className="flex items-center gap-4 p-4 rounded-xl" style={{ background: 'var(--bg-body)' }}>
                            <div className="w-20 h-20 rounded-xl flex items-center justify-center bg-white shadow-inner p-2">
                                <img src={newProduct.image} alt="Preview" className="w-full h-full object-contain" style={{ filter: newProduct.image_filter }} />
                            </div>
                            <div className="flex flex-col gap-2">
                                <button
                                    type="button"
                                    onClick={() => setNewProduct({ ...newProduct, image_filter: randomHue() })}
                                    className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-extrabold transition-all hover:opacity-90"
                                    style={{ background: 'var(--brand-primary)', color: 'var(--text-primary)' }}
                                >
                                    <Icons.Refresh className="w-4 h-4" /> Randomize Hue
                                </button>
                                <p className="text-xs font-mono" style={{ color: 'var(--text-muted)' }}>
                                    {newProduct.image_filter || 'Tidak ada filter'}
                                </p>
                            </div>
                        </div>

                        {/* Popular Toggle */}
                        <div
                            className="flex items-center gap-3 p-3 rounded-xl border-2 cursor-pointer transition-colors"
                            style={{ borderColor: newProduct.popular ? 'var(--brand-secondary)' : 'var(--bg-body)', background: newProduct.popular ? 'rgba(226,110,16,0.06)' : 'white' }}
                            onClick={() => setNewProduct({ ...newProduct, popular: !newProduct.popular })}
                        >
                            <div className={`w-5 h-5 rounded-md flex items-center justify-center border-2 transition-all ${newProduct.popular ? 'text-white' : ''}`}
                                style={{ background: newProduct.popular ? 'var(--brand-secondary)' : 'white', borderColor: newProduct.popular ? 'var(--brand-secondary)' : 'var(--text-muted)' }}>
                                {newProduct.popular && <Icons.Check className="w-3 h-3" />}
                            </div>
                            <span className="text-sm font-extrabold" style={{ color: 'var(--text-primary)' }}>Tandai sebagai Populer</span>
                        </div>

                        <button
                            type="submit"
                            className="w-full py-3 rounded-xl text-white font-extrabold text-sm transition-all hover:opacity-90 shadow-md"
                            style={{ background: 'var(--brand-secondary)' }}
                        >
                            Simpan Produk
                        </button>
                    </form>
                </div>
            )}

            {/* Products Grid */}
            <div className="grid grid-cols-1 xl:grid-cols-2 gap-6" id="admin-products-grid">
                {paginatedProducts.map(product => (
                    <div key={product.id} className="mc-card p-6 flex flex-col gap-4 relative overflow-hidden group">
                        {/* Title Bar */}
                        <div className="flex items-center gap-4 border-b pb-4 relative z-10" style={{ borderColor: 'var(--bg-body)' }}>
                            <div className="w-16 h-16 relative flex items-center justify-center rounded-xl shadow-inner" style={{ background: 'var(--bg-body)' }}>
                                <img src={product.image} alt={product.name} className="w-12 h-12 object-contain group-hover:scale-110 transition-transform" style={{ filter: product.image_filter }} />
                            </div>
                            <div className="flex-1 min-w-0">
                                <h3 className="font-extrabold text-xl" style={{ color: 'var(--text-primary)' }}>{product.name}</h3>
                                <p className="text-sm font-bold mt-1 flex items-center gap-2" style={{ color: 'var(--text-muted)' }}>
                                    <span style={{ color: 'var(--text-secondary)' }}>Qty:</span> {product.quantity}x &bull; <span style={{ color: 'var(--brand-secondary)' }}>{product.points} Points</span>
                                    {editingBadgeId === product.id ? (
                                        <form onSubmit={(e) => handleEditBadge(e, product.id)} className="inline-flex items-center gap-1 ml-1">
                                            <input
                                                type="text"
                                                autoFocus
                                                value={editBadgeText}
                                                onChange={(e) => setEditBadgeText(e.target.value)}
                                                placeholder="Kosongkan u/ hapus"
                                                className="px-2 py-0.5 rounded-md text-[10px] font-black outline-none border w-32"
                                                style={{ background: 'white', color: 'var(--text-primary)', borderColor: 'var(--brand-secondary)' }}
                                            />
                                            <button type="submit" className="text-green-600 hover:text-green-700 p-1" title="Simpan Badge"><Icons.Check className="w-3 h-3" /></button>
                                            <button type="button" onClick={() => setEditingBadgeId(null)} className="text-red-500 hover:text-red-600 p-1" title="Batal"><Icons.X className="w-3 h-3" /></button>
                                        </form>
                                    ) : (
                                        <span className="flex items-center gap-1 group/badge ml-1 relative">
                                            {product.badge && <span className="px-2 py-0.5 rounded-md text-[10px] font-black" style={{ background: 'var(--brand-primary)', color: 'var(--text-primary)' }}>{product.badge}</span>}
                                            <button
                                                onClick={() => { setEditingBadgeId(product.id); setEditBadgeText(product.badge || '') }}
                                                className={`p-1 text-gray-400 hover:text-[var(--brand-secondary)] transition-all ${product.badge ? 'opacity-0 group-hover/badge:opacity-100 absolute -right-6' : ''}`}
                                                title="Edit Badge"
                                            >
                                                <Icons.Pencil className="w-3 h-3" />
                                            </button>
                                        </span>
                                    )}
                                </p>
                            </div>
                            <div className="flex gap-2">
                                {/* Randomize Hue Button */}
                                <button
                                    onClick={() => handleRandomizeHue(product.id)}
                                    className="w-9 h-9 rounded-lg flex items-center justify-center transition-colors hover:opacity-80"
                                    style={{ background: 'var(--brand-primary)', color: 'var(--text-primary)' }}
                                    title="Randomize Hue"
                                >
                                    <Icons.Refresh className="w-4 h-4" />
                                </button>
                                {/* Delete Product Button */}
                                <button
                                    onClick={() => handleDeleteProduct(product.id, product.name)}
                                    className="w-9 h-9 rounded-lg flex items-center justify-center transition-colors"
                                    style={{ background: '#fee2e2', color: '#ef4444' }}
                                    title="Hapus Produk"
                                >
                                    <Icons.X className="w-4 h-4" />
                                </button>
                            </div>
                        </div>

                        <div className="relative z-10 rounded-xl p-4" style={{ background: 'var(--bg-body)' }}>
                            <h4 className="font-bold text-sm mb-3 flex items-center gap-2" style={{ color: 'var(--text-secondary)' }}>
                                <Icons.Terminal className="w-4 h-4" style={{ color: 'var(--brand-secondary)' }} />
                                Commands to run on Tako Gift:
                            </h4>
                            {product.commands && product.commands.length > 0 ? (
                                <ul className="space-y-2 mb-4">
                                    {product.commands.map(cmd => (
                                        <li key={cmd.id} className="flex items-center justify-between p-3 bg-white rounded-xl text-sm font-mono shadow-sm" style={{ color: 'var(--text-primary)', border: '1px solid var(--bg-body)' }}>
                                            <span className="truncate pr-4 break-all whitespace-normal">{cmd.command}</span>
                                            <button
                                                onClick={() => handleDeleteCommand(cmd.id)}
                                                className="p-2 rounded-lg transition-colors flex-shrink-0"
                                                style={{ color: '#ef4444' }}
                                                title="Hapus Command"
                                            >
                                                <Icons.X className="w-4 h-4" />
                                            </button>
                                        </li>
                                    ))}
                                </ul>
                            ) : (
                                <p className="text-sm font-medium italic mb-4" style={{ color: 'var(--text-muted)' }}>Belum ada command untuk produk ini.</p>
                            )}

                            {activeProductId === product.id ? (
                                <form onSubmit={(e) => handleAddCommand(e, product.id)} className="flex flex-col sm:flex-row gap-2 mt-4">
                                    <input
                                        type="text"
                                        value={newCommand}
                                        onChange={(e) => setNewCommand(e.target.value)}
                                        placeholder="e.g. points give {player} 500"
                                        className="flex-1 p-3 rounded-xl border-2 bg-white text-sm focus:outline-none font-mono transition-colors"
                                        style={{ borderColor: 'var(--bg-body)', color: 'var(--text-primary)' }}
                                        autoFocus
                                    />
                                    <div className="flex gap-2">
                                        <button type="submit" className="text-white px-5 py-3 rounded-xl text-sm font-extrabold hover:opacity-90 transition-opacity shadow-sm whitespace-nowrap" style={{ background: 'var(--brand-secondary)' }}>Simpan</button>
                                        <button type="button" onClick={() => setActiveProductId(null)} className="bg-white px-5 py-3 rounded-xl text-sm font-extrabold hover:bg-gray-50 transition-colors whitespace-nowrap" style={{ color: 'var(--text-secondary)' }}>Batal</button>
                                    </div>
                                </form>
                            ) : (
                                <button
                                    onClick={() => setActiveProductId(product.id)}
                                    className="text-sm font-extrabold py-2 px-4 rounded-xl flex items-center justify-center gap-2 mt-2 w-full sm:w-auto text-white transition-colors"
                                    style={{ background: 'var(--text-primary)' }}
                                    onMouseEnter={(e) => e.currentTarget.style.background = 'var(--brand-secondary)'}
                                    onMouseLeave={(e) => e.currentTarget.style.background = 'var(--text-primary)'}
                                >
                                    <span className="text-lg leading-none mb-0.5">+</span> Tambah Command
                                </button>
                            )}
                        </div>
                    </div>
                ))}
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
                <div className="flex items-center justify-center gap-2 mt-8">
                    <button
                        onClick={() => { setCurrentPage(p => Math.max(1, p - 1)); document.getElementById('admin-products-grid')?.scrollIntoView({ behavior: 'smooth', block: 'start' }) }}
                        disabled={currentPage === 1}
                        className="w-10 h-10 rounded-xl flex items-center justify-center font-extrabold text-sm transition-all disabled:opacity-30 disabled:cursor-not-allowed"
                        style={{ background: 'var(--bg-card)', color: 'var(--text-secondary)', border: '1px solid #e8e0f0' }}
                    >
                        ‹
                    </button>
                    {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
                        <button
                            key={page}
                            onClick={() => { setCurrentPage(page); document.getElementById('admin-products-grid')?.scrollIntoView({ behavior: 'smooth', block: 'start' }) }}
                            className="w-10 h-10 rounded-xl flex items-center justify-center font-extrabold text-sm transition-all"
                            style={currentPage === page
                                ? { background: '#E26E10', color: '#fff', boxShadow: '0 4px 12px rgba(226,110,16,0.3)' }
                                : { background: 'var(--bg-card)', color: 'var(--text-secondary)', border: '1px solid #e8e0f0' }
                            }
                        >
                            {page}
                        </button>
                    ))}
                    <button
                        onClick={() => { setCurrentPage(p => Math.min(totalPages, p + 1)); document.getElementById('admin-products-grid')?.scrollIntoView({ behavior: 'smooth', block: 'start' }) }}
                        disabled={currentPage === totalPages}
                        className="w-10 h-10 rounded-xl flex items-center justify-center font-extrabold text-sm transition-all disabled:opacity-30 disabled:cursor-not-allowed"
                        style={{ background: 'var(--bg-card)', color: 'var(--text-secondary)', border: '1px solid #e8e0f0' }}
                    >
                        ›
                    </button>
                </div>
            )}
        </AdminLayout>
    )
}
