import AdminLayout from '../../components/admin/AdminLayout'
import { Icons } from '../../components/elements/Icons'
import Link from 'next/link'
import { useState, useEffect, useRef } from 'react'

// Simple SVG bar chart component (no external deps)
// Simple SVG line chart component (no external deps)
function SalesChart({ data }) {
    const [hoveredPoint, setHoveredPoint] = useState(null);

    if (!data || data.length === 0) {
        return (
            <div className="flex items-center justify-center h-52 text-sm font-bold" style={{ color: 'var(--text-muted)' }}>
                Belum ada data penjualan
            </div>
        )
    }

    const maxVal = Math.max(...data.map(d => d.rupiah_value), 1)
    const padding = 20
    const width = 1000
    const height = 200

    // Calculate points for the line
    const points = data.map((d, i) => {
        const x = (i / (data.length - 1)) * width
        const y = height - ((d.rupiah_value / maxVal) * (height - padding * 2) + padding)
        return { x, y, ...d }
    })

    const linePath = points.map((p, i) => `${i === 0 ? 'M' : 'L'} ${p.x} ${p.y}`).join(' ')
    const areaPath = `${linePath} L ${points[points.length - 1].x} ${height} L ${points[0].x} ${height} Z`

    return (
        <div className="relative pt-4 px-2 select-none group/chart">
            {/* Legend / Info */}
            <div className="absolute top-0 left-4 text-[10px] font-bold text-[var(--text-muted)] flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-[#E26E10]"></div>
                <span>Pendapatan (Rp)</span>
            </div>

            <div className="h-48 relative mt-6">
                <svg
                    viewBox={`0 0 ${width} ${height}`}
                    className="w-full h-full overflow-visible"
                    preserveAspectRatio="none"
                    onMouseLeave={() => setHoveredPoint(null)}
                >
                    <defs>
                        <linearGradient id="areaGradient" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="0%" stopColor="#E26E10" stopOpacity="0.2" />
                            <stop offset="100%" stopColor="#E26E10" stopOpacity="0" />
                        </linearGradient>
                    </defs>

                    {/* Grid Line */}
                    <line x1="0" y1={height} x2={width} y2={height} stroke="var(--bg-body)" strokeWidth="1" />

                    {/* Area Fill */}
                    <path d={areaPath} fill="url(#areaGradient)" />

                    {/* The Line */}
                    <path
                        d={linePath}
                        fill="none"
                        stroke="#E26E10"
                        strokeWidth="3"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        className="transition-all duration-300"
                    />

                    {/* Hover Vertical Line */}
                    {hoveredPoint && (
                        <line
                            x1={hoveredPoint.x} y1="0" x2={hoveredPoint.x} y2={height}
                            stroke="#E26E10" strokeWidth="1" strokeDasharray="4 4" opacity="0.5"
                        />
                    )}

                    {/* Points & Hover Zones */}
                    {points.map((p, i) => (
                        <g key={i}>
                            {/* Point Circle */}
                            <circle
                                cx={p.x}
                                cy={p.y}
                                r={hoveredPoint?.date === p.date ? "6" : "3"}
                                fill={hoveredPoint?.date === p.date ? "#E26E10" : "white"}
                                stroke="#E26E10"
                                strokeWidth="2"
                                className="transition-all duration-200"
                            />

                            {/* Invisible Hover Zone */}
                            <rect
                                x={i === 0 ? 0 : p.x - (width / (data.length - 1) / 2)}
                                y="0"
                                width={width / (data.length - 1)}
                                height={height}
                                fill="transparent"
                                onMouseEnter={() => setHoveredPoint(p)}
                            />
                        </g>
                    ))}
                </svg>

                {/* Tooltip */}
                {hoveredPoint && (
                    <div
                        className="absolute pointer-events-none z-20 transition-all duration-200 ease-out"
                        style={{
                            left: `${(hoveredPoint.x / width) * 100}%`,
                            top: `${(hoveredPoint.y / height) * 100}%`,
                            transform: 'translate(-50%, -120%)'
                        }}
                    >
                        <div className="bg-[#2A1E3A] px-3 py-2 rounded-xl text-white shadow-xl min-w-[120px]">
                            <div className="text-[9px] text-white/50 font-bold mb-1">
                                {new Date(hoveredPoint.date).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })}
                            </div>
                            <div className="flex items-center justify-between gap-4">
                                <span className="text-[10px] font-bold text-white/80">Total Penjualan:</span>
                                <span className="text-sm font-black text-[#E26E10]">
                                    Rp {hoveredPoint.rupiah_value?.toLocaleString('id-ID')}
                                </span>
                            </div>
                            <div className="flex items-center justify-between gap-4 mt-1">
                                <span className="text-[10px] font-bold text-white/80">Transaksi:</span>
                                <span className="text-[10px] font-black">{hoveredPoint.total_transactions}</span>
                            </div>
                        </div>
                        {/* Tooltip Arrow */}
                        <div className="w-3 h-3 bg-[#2A1E3A] translate-y-[-50%] rotate-45 mx-auto rounded-sm mt-[-6px]"></div>
                    </div>
                )}
            </div>

            {/* Labels */}
            <div className="flex justify-between mt-2 pt-2 border-t border-[var(--bg-body)]">
                {data.map((d, i) => {
                    const showLabel = data.length <= 15 || i % Math.ceil(data.length / 10) === 0 || i === data.length - 1
                    if (!showLabel) return <div key={i} className="flex-1"></div>

                    const dateObj = new Date(d.date)
                    const dayLabel = dateObj.toLocaleDateString('id-ID', { day: 'numeric', month: 'short' })

                    return (
                        <div key={i} className="flex-1 flex flex-col items-center">
                            <span className="text-[9px] font-bold leading-none" style={{ color: 'var(--text-muted)' }}>
                                {dayLabel}
                            </span>
                        </div>
                    )
                })}
            </div>
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
                {[{
                    icon: <Icons.CheckCircle className="w-6 h-6 text-[#16a34a]" />,
                    bg: '#dcfce7', label: 'Webhook',
                    value: 'Aktif', loading: false
                }, {
                    icon: <Icons.ShoppingBag className="w-6 h-6 text-[#2563eb]" />,
                    bg: '#dbeafe', label: 'Produk',
                    value: stats.products, loading: stats.loading
                }, {
                    icon: <Icons.Coins className="w-6 h-6 text-[#d97706]" />,
                    bg: '#fef3c7', label: 'Transaksi',
                    value: stats.purchases, loading: stats.loading
                }, {
                    icon: <Icons.Users className="w-6 h-6 text-[#7c3aed]" />,
                    bg: '#f3e8ff', label: 'Pembeli Unik',
                    value: analytics?.totals?.unique_buyers || 0, loading: analyticsLoading
                }].map((stat, i) => (
                    <div key={i} className="mc-card p-5 flex items-center gap-4 hover:-translate-y-1 transition-transform cursor-default">
                        <div className="w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0" style={{ background: stat.bg }}>
                            {stat.icon}
                        </div>
                        <div>
                            <h3 className="font-bold text-[10px] uppercase tracking-wider mb-0.5 text-[var(--text-muted)]">{stat.label}</h3>
                            {stat.loading ? (
                                <div className="h-7 w-12 rounded-lg bg-[var(--bg-body)] animate-pulse"></div>
                            ) : (
                                <p className="text-xl font-black text-[var(--text-primary)]">{stat.value}</p>
                            )}
                        </div>
                    </div>
                ))}
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
                            {analyticsLoading ? (
                                <div className="h-3 w-24 rounded bg-[#E26E10]/20 animate-pulse"></div>
                            ) : (
                                <>Rp {analytics?.totals?.rupiah_value?.toLocaleString('id-ID') || 0} total</>
                            )}
                        </div>
                    </div>
                    <div className="relative z-10">
                        {analyticsLoading ? (
                            <div className="h-52 animate-pulse">
                                <div className="flex items-end gap-1 h-44 pt-4">
                                    {[40, 65, 30, 80, 55, 70, 45, 90, 35, 60, 50, 75, 42, 68].map((h, i) => (
                                        <div key={i} className="flex-1 rounded-t-lg" style={{ height: `${h}%`, background: 'var(--bg-body)' }}></div>
                                    ))}
                                </div>
                                <div className="flex justify-between mt-2 pt-2">
                                    {[...Array(7)].map((_, i) => (
                                        <div key={i} className="h-2 w-8 rounded bg-[var(--bg-body)]"></div>
                                    ))}
                                </div>
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
                            <div className="space-y-2.5 animate-pulse">
                                {[...Array(5)].map((_, i) => (
                                    <div key={i} className="flex items-center gap-3 p-2.5 rounded-xl">
                                        <div className="w-7 h-7 rounded-lg bg-[var(--bg-body)]"></div>
                                        <div className="w-8 h-8 rounded-lg bg-[var(--bg-body)]"></div>
                                        <div className="flex-1">
                                            <div className="h-3.5 w-24 rounded bg-[var(--bg-body)] mb-1.5"></div>
                                            <div className="h-2.5 w-14 rounded bg-[var(--bg-body)]"></div>
                                        </div>
                                        <div className="h-3.5 w-20 rounded bg-[var(--bg-body)]"></div>
                                    </div>
                                ))}
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
                            <div className="space-y-4 animate-pulse">
                                {[80, 60, 45, 30].map((w, i) => (
                                    <div key={i}>
                                        <div className="flex items-center justify-between mb-1.5">
                                            <div className="h-3.5 w-28 rounded bg-[var(--bg-body)]"></div>
                                            <div className="h-3 w-8 rounded bg-[var(--bg-body)]"></div>
                                        </div>
                                        <div className="w-full h-2.5 rounded-full" style={{ background: 'var(--bg-body)' }}>
                                            <div className="h-full rounded-full" style={{ width: `${w}%`, background: '#e8e0f0' }}></div>
                                        </div>
                                    </div>
                                ))}
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
                            <div className="space-y-2.5 animate-pulse">
                                {[...Array(5)].map((_, i) => (
                                    <div key={i} className="flex items-center gap-3 p-3 rounded-xl" style={{ background: 'var(--bg-body)' }}>
                                        <div className="w-9 h-9 rounded-lg bg-white"></div>
                                        <div className="flex-1">
                                            <div className="h-3.5 w-24 rounded bg-white mb-1.5"></div>
                                            <div className="h-2.5 w-36 rounded bg-white"></div>
                                        </div>
                                        <div className="h-5 w-20 rounded-lg bg-white"></div>
                                    </div>
                                ))}
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
