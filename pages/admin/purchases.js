import { useState, useEffect } from 'react'
import AdminLayout from '../../components/admin/AdminLayout'
import { Icons } from '../../components/elements/Icons'

export default function AdminPurchases() {
    const [purchases, setPurchases] = useState([])
    const [isLoading, setIsLoading] = useState(true)

    useEffect(() => {
        fetchPurchases()
    }, [])

    async function fetchPurchases() {
        try {
            const res = await fetch('/api/admin/purchases')
            const data = await res.json()
            if (Array.isArray(data)) setPurchases(data)
            setIsLoading(false)
        } catch (e) {
            console.error(e)
            setIsLoading(false)
        }
    }

    async function handleDeleteOne(id) {
        if (!confirm('Hapus log pembelian ini?')) return
        await fetch(`/api/admin/purchases?id=${id}`, { method: 'DELETE' })
        fetchPurchases()
    }

    async function handleDeleteAll() {
        if (!confirm('Hapus SEMUA log pembelian? Tindakan ini tidak bisa dibatalkan.')) return
        if (!confirm('Apakah kamu yakin? Semua data riwayat pembelian akan dihapus permanen.')) return
        await fetch('/api/admin/purchases?all=true', { method: 'DELETE' })
        fetchPurchases()
    }

    if (isLoading) return <AdminLayout title="Purchase Logs">Memuat data...</AdminLayout>

    return (
        <AdminLayout title="Purchase Logs">
            <div className="mc-card overflow-hidden border-0 shadow-lg relative z-10 bg-white">
                <div className="p-6 md:p-8 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4" style={{ borderBottom: '1px solid var(--bg-body)', background: 'rgba(232,224,240,0.3)' }}>
                    <div>
                        <h3 className="text-2xl font-black" style={{ color: 'var(--text-primary)' }}>Riwayat Pembelian</h3>
                        <p className="text-sm font-bold mt-2" style={{ color: 'var(--text-muted)' }}>
                            Menampilkan {purchases.length} transaksi terbaru dari Trakteer (maks 100).
                        </p>
                    </div>
                    {purchases.length > 0 && (
                        <button
                            onClick={handleDeleteAll}
                            className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-extrabold transition-colors flex-shrink-0"
                            style={{ background: '#fee2e2', color: '#ef4444' }}
                        >
                            <Icons.X className="w-4 h-4" /> Hapus Semua
                        </button>
                    )}
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr style={{ background: 'var(--bg-card)', color: 'var(--text-secondary)' }} className="text-xs uppercase tracking-widest">
                                <th className="p-5 font-black" style={{ borderBottom: '1px solid var(--bg-body)' }}>Waktu</th>
                                <th className="p-5 font-black" style={{ borderBottom: '1px solid var(--bg-body)' }}>Player</th>
                                <th className="p-5 font-black" style={{ borderBottom: '1px solid var(--bg-body)' }}>Produk</th>
                                <th className="p-5 font-black" style={{ borderBottom: '1px solid var(--bg-body)' }}>Pemasukan</th>
                                <th className="p-5 font-black" style={{ borderBottom: '1px solid var(--bg-body)' }}>Command Logs</th>
                                <th className="p-5 font-black" style={{ borderBottom: '1px solid var(--bg-body)' }}>Status</th>
                                <th className="p-5 font-black" style={{ borderBottom: '1px solid var(--bg-body)' }}>Aksi</th>
                            </tr>
                        </thead>
                        <tbody className="text-sm" style={{ '--tw-divide-opacity': 1 }}>
                            {purchases.length > 0 ? purchases.map(log => (
                                <tr key={log.id} className="hover:bg-[var(--brand-primary)]/5 transition-colors group" style={{ borderBottom: '1px solid var(--bg-body)' }}>
                                    <td className="p-5 font-mono text-xs whitespace-nowrap" style={{ color: 'var(--text-muted)' }}>
                                        {new Date(log.created_at).toLocaleString('id-ID')}
                                    </td>
                                    <td className="p-5">
                                        <div className="flex items-center gap-3">
                                            <div className="w-9 h-9 rounded-lg p-0.5 relative overflow-hidden flex-shrink-0" style={{ background: 'var(--bg-body)' }}>
                                                <img
                                                    src={`https://mc-heads.net/avatar/${log.player_name}/32`}
                                                    alt={log.player_name}
                                                    className="w-full h-full rounded-md object-contain group-hover:scale-110 transition-transform"
                                                />
                                            </div>
                                            <span className="font-extrabold" style={{ color: 'var(--text-primary)' }}>{log.player_name}</span>
                                        </div>
                                    </td>
                                    <td className="p-5 font-bold" style={{ color: 'var(--text-secondary)' }}>{log.product_name}</td>
                                    <td className="p-5 font-black" style={{ color: 'var(--brand-secondary)', background: 'rgba(226,110,16,0.05)' }}>
                                        + Rp {log.rupiah_value?.toLocaleString('id-ID')}
                                    </td>
                                    <td className="p-5">
                                        <div className="max-w-[200px] sm:max-w-[400px] max-h-24 overflow-y-auto p-3 rounded-xl text-xs font-mono border" style={{ background: 'rgba(232,224,240,0.5)', color: 'var(--text-secondary)', borderColor: 'var(--bg-body)' }}>
                                            {(() => {
                                                try {
                                                    const cmds = JSON.parse(log.commands_executed)
                                                    return Array.isArray(cmds) ? cmds.map((c, i) => <div key={i} className="py-0.5 last:border-0" style={{ borderBottom: '1px solid rgba(0,0,0,0.05)' }}>{c}</div>) : cmds
                                                } catch (e) { return log.commands_executed }
                                            })()}
                                        </div>
                                    </td>
                                    <td className="p-5">
                                        {log.status === 'success' ? (
                                            <div className="inline-flex items-center gap-1.5 px-3 py-1.5 font-extrabold text-xs rounded-xl shadow-sm" style={{ background: '#dcfce7', color: '#16a34a' }}>
                                                <Icons.Check className="w-3.5 h-3.5" /> Success
                                            </div>
                                        ) : (
                                            <div className="inline-flex items-center gap-1.5 px-3 py-1.5 font-extrabold text-xs rounded-xl shadow-sm" style={{ background: '#fee2e2', color: '#ef4444' }}>
                                                <Icons.X className="w-3.5 h-3.5" /> Failed
                                            </div>
                                        )}
                                    </td>
                                    <td className="p-5">
                                        <button
                                            onClick={() => handleDeleteOne(log.id)}
                                            className="w-8 h-8 rounded-lg flex items-center justify-center transition-colors hover:opacity-80"
                                            style={{ background: '#fee2e2', color: '#ef4444' }}
                                            title="Hapus log ini"
                                        >
                                            <Icons.X className="w-4 h-4" />
                                        </button>
                                    </td>
                                </tr>
                            )) : (
                                <tr>
                                    <td colSpan="7" className="p-12 text-center font-bold italic" style={{ color: 'var(--text-muted)', background: 'rgba(232,224,240,0.2)' }}>
                                        Belum ada history pembelian tercatat.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </AdminLayout>
    )
}
