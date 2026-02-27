import AdminLayout from '../../components/admin/AdminLayout'
import { Icons } from '../../components/elements/Icons'
import Link from 'next/link'
import { useState, useEffect, useRef } from 'react'

// Simple SVG bar chart component (no external deps)
function SalesChart({ data }) {
    if (!data || data.length === 0) {
        return (
            <div className="flex items-center justify-center h-52 text-sm font-bold" style={{ color: 'var(--text-muted)' }}>
                Belum ada data penjualan
            </div>
        )
    }

    const maxVal = Math.max(...data.map(d => d.total_transactions), 1)

    return (
        <div className="flex items-end gap-1.5 h-52 pt-4">
            {data.map((d, i) => {
                const h = Math.max((d.total_transactions / maxVal) * 100, 4)
                const dateObj = new Date(d.date)
                const dayLabel = dateObj.toLocaleDateString('id-ID', { day: 'numeric', month: 'short' })
                return (
                    <div key={i} className="flex-1 flex flex-col items-center gap-1 group relative">
                        {/* Tooltip */}
                        <div className="absolute -top-16 left-1/2 -translate-x-1/2 px-3 py-2 rounded-lg text-xs font-bold text-white opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap z-10"
                            style={{ background: 'rgba(42,30,58,0.95)', boxShadow: '0 4px 12px rgba(0,0,0,0.2)' }}>
                            <span className="font-extrabold">{d.total_transactions}</span> transaksi
                            <br />
                            <span className="font-extrabold" style={{ color: '#E26E10' }}>Rp {d.rupiah_value?.toLocaleString('id-ID')}</span>
                        </div>
                        {/* Bar */}
                        <div
                            className="w-full rounded-t-lg transition-all duration-500 hover:opacity-80 cursor-pointer relative overflow-hidden"
                            style={{
                                height: `${h}%`,
                                background: `linear-gradient(180deg, #E26E10 0%, #c55e0d 100%)`,
                                minHeight: '4px',
                                boxShadow: '0 -2px 8px rgba(226,110,16,0.2)'
                            }}
                        >
                            <div className="absolute inset-0 bg-white/10 opacity-0 group-hover:opacity-100 transition-opacity"></div>
                        </div>
                        {/* Label */}
                        <span className="text-[9px] font-bold leading-none mt-0.5" style={{ color: 'var(--text-muted)' }}>
                            {dayLabel}
                        </span>
                    </div>
                )
            })}
        </div>
    )
}

export default function AdminDashboard() {
    const [stats, setStats] = useState({ products: 0, purchases: 0, loading: true })
    const [analytics, setAnalytics] = useState(null)
    const [analyticsLoading, setAnalyticsLoading] = useState(true)
    const [graphRange, setGraphRange] = useState('14d')
    const [donatorRange, setDonatorRange] = useState('all')
    const [productRange, setProductRange] = useState('14d')
    const [recentRange, setRecentRange] = useState('14d')

    useEffect(() => {
        // Fetch basic stats
        Promise.all([
            fetch('/api/admin/products').then(res => res.json()),
            fetch('/api/admin/purchases').then(res => res.json())
        ]).then(([products, purchases]) => {
            setStats({
                products: Array.isArray(products) ? products.length : 0,
                purchases: Array.isArray(purchases) ? purchases.length : 0,
                loading: false
            })
        }).catch(() => setStats(s => ({ ...s, loading: false })))
    }, [])

    useEffect(() => {
        setAnalyticsLoading(true)
        fetch(`/api/admin/analytics?graphRange=${graphRange}&donatorRange=${donatorRange}&productRange=${productRange}&recentRange=${recentRange}`)
            .then(res => res.json())
            .then(data => {
                setAnalytics(data)
                setAnalyticsLoading(false)
            })
            .catch(() => setAnalyticsLoading(false))
    }, [graphRange, donatorRange, productRange, recentRange])

    return (
        <AdminLayout title="Dashboard Overview">
            {/* Welcome Banner */}
            <div className="relative overflow-hidden rounded-3xl p-8 mb-8 text-white shadow-xl" style={{ background: 'var(--brand-secondary)' }}>
                <div className="absolute top-0 right-0 w-64 h-64 bg-white opacity-5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/4"></div>
                <div className="absolute bottom-0 left-0 w-48 h-48 bg-white opacity-5 rounded-full blur-2xl translate-y-1/3 -translate-x-1/4"></div>
                <div className="relative z-10 flex flex-col sm:flex-row items-center justify-between gap-6">
                    <div>
                        <h2 className="text-3xl font-black mb-2">Selamat Datang di Admin Panel!</h2>
                        <p className="text-white/80 font-medium">Pantau performa toko, analisa penjualan, dan kelola produk dari sini.</p>
                    </div>
                    <div className="hidden md:flex w-16 h-16 rounded-2xl bg-white/20 items-center justify-center backdrop-blur-sm border border-white/30 shadow-inner">
                        <Icons.Cube className="w-8 h-8 text-white" />
                    </div>
                </div>
            </div>

            {/* Quick Stats Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-5 mb-8">
                <div className="mc-card p-5 flex items-center gap-4 hover:-translate-y-1 transition-transform cursor-default">
                    <div className="w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0 bg-[#dcfce7]">
                        <Icons.CheckCircle className="w-6 h-6 text-[#16a34a]" />
                    </div>
                    <div>
                        <h3 className="font-bold text-[10px] uppercase tracking-wider mb-0.5 text-[var(--text-muted)]">Webhook</h3>
                        <p className="text-xl font-black text-[var(--text-primary)]">Aktif</p>
                    </div>
                </div>

                <div className="mc-card p-5 flex items-center gap-4 hover:-translate-y-1 transition-transform cursor-default">
                    <div className="w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0 bg-[#dbeafe]">
                        <Icons.ShoppingBag className="w-6 h-6 text-[#2563eb]" />
                    </div>
                    <div>
                        <h3 className="font-bold text-[10px] uppercase tracking-wider mb-0.5 text-[var(--text-muted)]">Produk</h3>
                        <p className="text-xl font-black text-[var(--text-primary)]">{stats.loading ? '...' : stats.products}</p>
                    </div>
                </div>

                <div className="mc-card p-5 flex items-center gap-4 hover:-translate-y-1 transition-transform cursor-default">
                    <div className="w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0 bg-[#fef3c7]">
                        <Icons.Coins className="w-6 h-6 text-[#d97706]" />
                    </div>
                    <div>
                        <h3 className="font-bold text-[10px] uppercase tracking-wider mb-0.5 text-[var(--text-muted)]">Transaksi</h3>
                        <p className="text-xl font-black text-[var(--text-primary)]">{stats.loading ? '...' : stats.purchases}</p>
                    </div>
                </div>

                <div className="mc-card p-5 flex items-center gap-4 hover:-translate-y-1 transition-transform cursor-default">
                    <div className="w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0 bg-[#f3e8ff]">
                        <Icons.Users className="w-6 h-6 text-[#7c3aed]" />
                    </div>
                    <div>
                        <h3 className="font-bold text-[10px] uppercase tracking-wider mb-0.5 text-[var(--text-muted)]">Pembeli Unik</h3>
                        <p className="text-xl font-black text-[var(--text-primary)]">
                            {analyticsLoading ? '...' : (analytics?.totals?.unique_buyers || 0)}
                        </p>
                    </div>
                </div>
            </div>

            {/* Analytics Row: Chart + Top Donators */}
            <div className="grid grid-cols-1 xl:grid-cols-3 gap-6 mb-8">
                {/* Sales Chart - 2 cols wide */}
                <div className="xl:col-span-2 mc-card p-6 relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-48 h-48 opacity-5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" style={{ background: 'var(--brand-secondary)' }}></div>
                    <div className="flex items-center justify-between mb-6 relative z-10 flex-wrap gap-4">
                        <div>
                            <div className="flex items-center gap-3">
                                <h3 className="text-lg font-black" style={{ color: 'var(--text-primary)' }}>Grafik Penjualan</h3>
                            </div>
                            <div className="flex items-center gap-1 mt-2 bg-black/5 p-1 rounded-lg w-fit">
                                {['14d', '30d', '365d', 'all'].map(val => (
                                    <button
                                        key={val}
                                        onClick={() => setGraphRange(val)}
                                        className={`px-3 py-1 rounded-md text-xs font-bold transition-all ${graphRange === val ? 'bg-white shadow-sm text-[#E26E10]' : 'text-[var(--text-muted)] hover:text-[var(--text-primary)]'}`}
                                    >
                                        {val === '14d' ? '14H' : val === '30d' ? '1B' : val === '365d' ? '1T' : 'All'}
                                    </button>
                                ))}
                            </div>
                        </div>
                        <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-extrabold" style={{ background: 'rgba(226,110,16,0.08)', color: '#E26E10' }}>
                            <Icons.Coins className="w-3.5 h-3.5" />
                            Rp {analyticsLoading ? '...' : (analytics?.totals?.rupiah_value?.toLocaleString('id-ID') || 0)} total
                        </div>
                    </div>
                    <div className="relative z-10">
                        {analyticsLoading ? (
                            <div className="flex items-center justify-center h-52">
                                <div className="w-8 h-8 border-3 rounded-full animate-spin border-t-[#E26E10] border-r-transparent border-b-transparent border-l-transparent"></div>
                            </div>
                        ) : (
                            <SalesChart data={analytics?.dailySales || []} />
                        )}
                    </div>
                </div>

                {/* Top Donators */}
                <div className="mc-card p-6 relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-32 h-32 opacity-5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" style={{ background: 'var(--brand-primary)' }}></div>
                    <div className="flex items-center justify-between mb-4 relative z-10">
                        <h3 className="text-lg font-black flex items-center gap-2" style={{ color: 'var(--text-primary)' }}>
                            <Icons.Trophy className="w-5 h-5 text-[#d97706]" />
                            Top Donators
                        </h3>
                        <div className="flex items-center gap-1 bg-black/5 p-1 rounded-lg">
                            {['14d', '30d', '365d', 'all'].map(val => (
                                <button
                                    key={val}
                                    onClick={() => setDonatorRange(val)}
                                    className={`px-2 py-1 rounded-md text-[10px] font-bold transition-all ${donatorRange === val ? 'bg-white shadow-sm text-[#E26E10]' : 'text-[var(--text-muted)] hover:text-[var(--text-primary)]'}`}
                                >
                                    {val === '14d' ? '14H' : val === '30d' ? '1B' : val === '365d' ? '1T' : 'All'}
                                </button>
                            ))}
                        </div>
                    </div>
                    <div className="space-y-2.5 relative z-10 max-h-[300px] overflow-y-auto pr-2">
                        {analyticsLoading ? (
                            <div className="flex items-center justify-center h-40">
                                <div className="w-8 h-8 border-3 rounded-full animate-spin border-t-[#E26E10] border-r-transparent border-b-transparent border-l-transparent"></div>
                            </div>
                        ) : analytics?.topDonators?.length > 0 ? (
                            analytics.topDonators.map((donor, i) => (
                                <div key={i} className="flex items-center gap-3 p-2.5 rounded-xl transition-colors hover:bg-[var(--bg-body)]">
                                    {/* Rank */}
                                    <div className="w-7 h-7 rounded-lg flex items-center justify-center flex-shrink-0 text-xs font-black"
                                        style={i === 0 ? { background: '#fef3c7', color: '#d97706' } : i === 1 ? { background: '#f3f4f6', color: '#6b7280' } : i === 2 ? { background: '#fed7aa', color: '#c2410c' } : { background: 'var(--bg-body)', color: 'var(--text-muted)' }}>
                                        {i + 1}
                                    </div>
                                    {/* Avatar */}
                                    <div className="w-8 h-8 rounded-lg overflow-hidden flex-shrink-0" style={{ background: 'var(--bg-body)' }}>
                                        <img src={`https://mc-heads.net/avatar/${donor.player_name}/32`} alt={donor.player_name} className="w-full h-full object-cover" />
                                    </div>
                                    {/* Info */}
                                    <div className="flex-1 min-w-0">
                                        <p className="text-sm font-extrabold truncate" style={{ color: 'var(--text-primary)' }}>{donor.player_name}</p>
                                        <p className="text-[10px] font-bold" style={{ color: 'var(--text-muted)' }}>{donor.total_purchases}x beli</p>
                                    </div>
                                    {/* Points */}
                                    <span className="text-xs font-black flex-shrink-0" style={{ color: '#E26E10' }}>
                                        Rp {donor.rupiah_value?.toLocaleString('id-ID')}
                                    </span>
                                </div>
                            ))
                        ) : (
                            <div className="text-center py-8 text-sm font-bold" style={{ color: 'var(--text-muted)' }}>Belum ada data</div>
                        )}
                    </div>
                </div>
            </div>

            {/* Bottom Row: Popular Products + Recent Purchases */}
            <div className="grid grid-cols-1 xl:grid-cols-2 gap-6 mb-8">
                {/* Popular Products */}
                <div className="mc-card p-6 relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-32 h-32 opacity-5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" style={{ background: 'var(--brand-secondary)' }}></div>
                    <div className="flex items-start justify-between mb-4 relative z-10">
                        <h3 className="text-lg font-black flex items-center gap-2" style={{ color: 'var(--text-primary)' }}>
                            <Icons.Fire className="w-5 h-5 text-[#ef4444]" />
                            Produk Terlaris
                        </h3>
                        <div className="flex flex-wrap items-center gap-1 bg-black/5 p-1 rounded-lg">
                            {['14d', '30d', '365d', 'all'].map(val => (
                                <button
                                    key={val}
                                    onClick={() => setProductRange(val)}
                                    className={`px-2 py-1 rounded-md text-[10px] font-bold transition-all ${productRange === val ? 'bg-white shadow-sm text-[#E26E10]' : 'text-[var(--text-muted)] hover:text-[var(--text-primary)]'}`}
                                >
                                    {val === '14d' ? '14H' : val === '30d' ? '1B' : val === '365d' ? '1T' : 'All'}
                                </button>
                            ))}
                        </div>
                    </div>
                    <div className="space-y-3 relative z-10 max-h-[300px] overflow-y-auto pr-2">
                        {analyticsLoading ? (
                            <div className="flex items-center justify-center h-32">
                                <div className="w-8 h-8 border-3 rounded-full animate-spin border-t-[#E26E10] border-r-transparent border-b-transparent border-l-transparent"></div>
                            </div>
                        ) : analytics?.popularProducts?.length > 0 ? (
                            analytics.popularProducts.map((prod, i) => {
                                const maxPurchases = analytics.popularProducts[0]?.times_purchased || 1
                                const barWidth = (prod.times_purchased / maxPurchases) * 100
                                return (
                                    <div key={i}>
                                        <div className="flex items-center justify-between mb-1.5">
                                            <span className="text-sm font-extrabold truncate" style={{ color: 'var(--text-primary)' }}>{prod.product_name}</span>
                                            <span className="text-xs font-bold ml-2 flex-shrink-0" style={{ color: 'var(--text-muted)' }}>{prod.times_purchased}x</span>
                                        </div>
                                        <div className="w-full h-2.5 rounded-full overflow-hidden" style={{ background: 'var(--bg-body)' }}>
                                            <div className="h-full rounded-full transition-all duration-700"
                                                style={{ width: `${barWidth}%`, background: 'linear-gradient(90deg, #E26E10, #f59e0b)' }}></div>
                                        </div>
                                    </div>
                                )
                            })
                        ) : (
                            <div className="text-center py-8 text-sm font-bold" style={{ color: 'var(--text-muted)' }}>Belum ada data</div>
                        )}
                    </div>
                </div>

                {/* Recent Purchases */}
                <div className="mc-card p-6 relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-32 h-32 opacity-5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" style={{ background: 'var(--brand-primary)' }}></div>
                    <div className="flex items-start justify-between mb-4 relative z-10">
                        <h3 className="text-lg font-black flex items-center gap-2" style={{ color: 'var(--text-primary)' }}>
                            <Icons.Clock className="w-5 h-5 text-[#6366f1]" />
                            Transaksi Terbaru
                        </h3>
                        <div className="flex flex-wrap items-center gap-1 bg-black/5 p-1 rounded-lg">
                            {['14d', '30d', '365d', 'all'].map(val => (
                                <button
                                    key={val}
                                    onClick={() => setRecentRange(val)}
                                    className={`px-2 py-1 rounded-md text-[10px] font-bold transition-all ${recentRange === val ? 'bg-white shadow-sm text-[#E26E10]' : 'text-[var(--text-muted)] hover:text-[var(--text-primary)]'}`}
                                >
                                    {val === '14d' ? '14H' : val === '30d' ? '1B' : val === '365d' ? '1T' : 'All'}
                                </button>
                            ))}
                        </div>
                    </div>
                    <div className="space-y-2.5 relative z-10 max-h-[300px] overflow-y-auto pr-2">
                        {analyticsLoading ? (
                            <div className="flex items-center justify-center h-32">
                                <div className="w-8 h-8 border-3 rounded-full animate-spin border-t-[#E26E10] border-r-transparent border-b-transparent border-l-transparent"></div>
                            </div>
                        ) : analytics?.recentPurchases?.length > 0 ? (
                            analytics.recentPurchases.map((purchase, i) => (
                                <div key={i} className="flex items-center gap-3 p-3 rounded-xl transition-colors" style={{ background: 'var(--bg-body)' }}>
                                    <div className="w-9 h-9 rounded-lg overflow-hidden flex-shrink-0 bg-white p-0.5">
                                        <img src={`https://mc-heads.net/avatar/${purchase.player_name}/32`} alt={purchase.player_name} className="w-full h-full object-cover rounded-md" />
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <p className="text-sm font-extrabold truncate" style={{ color: 'var(--text-primary)' }}>{purchase.player_name}</p>
                                        <p className="text-[10px] font-bold" style={{ color: 'var(--text-muted)' }}>
                                            {purchase.product_name} • {new Date(purchase.created_at).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' })}
                                        </p>
                                    </div>
                                    <span className="px-2.5 py-1 rounded-lg text-xs font-black flex-shrink-0" style={{ background: 'rgba(226,110,16,0.1)', color: '#E26E10' }}>
                                        + Rp {purchase.rupiah_value?.toLocaleString('id-ID')}
                                    </span>
                                </div>
                            ))
                        ) : (
                            <div className="text-center py-8 text-sm font-bold" style={{ color: 'var(--text-muted)' }}>Belum ada transaksi</div>
                        )}
                    </div>
                </div>
            </div>

            {/* Quick Actions */}
            <h3 className="text-lg font-extrabold mb-4 text-[var(--text-primary)]">Aksi Cepat</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                <Link href="/admin/products" className="mc-card p-5 group hover:shadow-lg transition-all border-2 border-transparent hover:border-[#E26E10]">
                    <div className="flex items-center gap-3 mb-2">
                        <div className="w-9 h-9 rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform bg-[#fff5eb]">
                            <Icons.Terminal className="w-4 h-4 text-[#E26E10]" />
                        </div>
                        <h4 className="font-extrabold text-[var(--text-primary)] group-hover:text-[#E26E10] transition-colors">Products</h4>
                    </div>
                    <p className="text-xs leading-relaxed text-[var(--text-muted)]">Kelola produk & commands</p>
                </Link>

                <Link href="/admin/purchases" className="mc-card p-5 group hover:shadow-lg transition-all border-2 border-transparent hover:border-[#E26E10]">
                    <div className="flex items-center gap-3 mb-2">
                        <div className="w-9 h-9 rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform bg-[#fff5eb]">
                            <Icons.Clipboard className="w-4 h-4 text-[#E26E10]" />
                        </div>
                        <h4 className="font-extrabold text-[var(--text-primary)] group-hover:text-[#E26E10] transition-colors">Purchase Logs</h4>
                    </div>
                    <p className="text-xs leading-relaxed text-[var(--text-muted)]">Lihat & hapus riwayat</p>
                </Link>

                <Link href="/admin/settings" className="mc-card p-5 group hover:shadow-lg transition-all border-2 border-transparent hover:border-[#E26E10]">
                    <div className="flex items-center gap-3 mb-2">
                        <div className="w-9 h-9 rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform bg-[#fff5eb]">
                            <Icons.Cog className="w-4 h-4 text-[#E26E10]" />
                        </div>
                        <h4 className="font-extrabold text-[var(--text-primary)] group-hover:text-[#E26E10] transition-colors">Settings</h4>
                    </div>
                    <p className="text-xs leading-relaxed text-[var(--text-muted)]">Atur diskon & popup</p>
                </Link>
            </div>
        </AdminLayout>
    )
}
