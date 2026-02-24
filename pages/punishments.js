import { Wrapper } from '@layer/components/layout/Wrapper.jsx'
import { Icons } from '@layer/components/elements/Icons.jsx'
import { useState, useEffect } from "react"

export default function Punishments() {
    const [punishments, setPunishments] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [refreshing, setRefreshing] = useState(false);
    const [pagination, setPagination] = useState({ page: 1, totalPages: 1, total: 0 });

    const fetchPunishments = async (page = 1) => {
        setRefreshing(true);
        setLoading(true);
        setError(null);
        try {
            const res = await fetch(`/api/punishments?page=${page}&limit=10`);
            if (!res.ok) throw new Error('Gagal mengambil data hukuman dari server.');
            const result = await res.json();
            setPunishments(result.data);
            setPagination(result.pagination);
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
            setRefreshing(false);
        }
    };

    const handlePageChange = (newPage) => {
        if (newPage >= 1 && newPage <= pagination.totalPages) {
            fetchPunishments(newPage);
            window.scrollTo({ top: 0, behavior: 'smooth' });
        }
    };

    useEffect(() => {
        fetchPunishments();
    }, []);

    const formatDate = (timestamp) => {
        if (!timestamp) return '-';
        return new Date(timestamp).toLocaleString('id-ID', {
            day: 'numeric', month: 'short', year: 'numeric',
            hour: '2-digit', minute: '2-digit'
        });
    };

    const formatDuration = (start, end) => {
        if (end === 0 || !end) return 'Permanen';

        const duration = end - start;
        if (duration <= 0) return 'Selesai';

        const days = Math.floor(duration / (1000 * 60 * 60 * 24));
        const hours = Math.floor((duration % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((duration % (1000 * 60 * 60)) / (1000 * 60));

        if (days > 0) return `${days} Hari ${hours} Jam`;
        if (hours > 0) return `${hours} Jam ${minutes} Menit`;
        return `${minutes} Menit`;
    };

    const getStatusInfo = (p) => {
        const isPermanent = p.end === 0 || !p.end;
        const isExpired = !isPermanent && p.end < Date.now();

        if (isPermanent) return { label: 'Permanen', bg: '#fef2f2', text: '#dc2626', border: '#fecaca' };
        if (isExpired) return { label: 'Selesai', bg: '#f3f4f6', text: '#6b7280', border: '#e5e7eb' };
        return { label: 'Aktif', bg: '#fff7ed', text: '#ea580c', border: '#fed7aa' };
    };

    return (
        <Wrapper
            title="Daftar Hukuman"
            description="Daftar pemain yang telah dihukum di server Trinity Indonesia."
            path="/punishments"
        >
            {/* Header Card */}
            <div className="mc-content-card mb-8 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div>
                    <h2 className="text-2xl font-extrabold mb-2" style={{ color: 'var(--text-primary)' }}>
                        Daftar Hukuman
                    </h2>
                    <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>
                        Catatan pemain yang telah menerima sanksi dari staff server.
                    </p>
                </div>
                <button
                    onClick={() => fetchPunishments(pagination.page)}
                    disabled={refreshing}
                    className="mc-btn mc-btn-outline flex items-center gap-2 text-sm px-4 py-2"
                >
                    <Icons.Refresh className={`w-4 h-4 ${refreshing ? 'animate-spin' : ''}`} />
                    {refreshing ? 'Memuat...' : 'Refresh'}
                </button>
            </div>

            {/* Error Banner */}
            {error && (
                <div className="mb-6 p-5 rounded-xl flex items-center gap-4" style={{ backgroundColor: '#fef2f2', border: '1px solid #fecaca' }}>
                    <Icons.Shield className="w-10 h-10 flex-shrink-0" style={{ color: '#dc2626' }} />
                    <div>
                        <h3 className="font-bold text-base" style={{ color: '#dc2626' }}>Terjadi Kesalahan</h3>
                        <p className="text-sm" style={{ color: '#ef4444' }}>{error}</p>
                    </div>
                </div>
            )}

            {/* Content Card */}
            <div className="mc-content-card">
                {loading ? (
                    <div className="flex flex-col items-center justify-center py-12">
                        <div className="animate-spin rounded-full h-12 w-12 border-b-2" style={{ borderColor: 'var(--brand-secondary)' }}></div>
                        <p className="mt-4 font-bold" style={{ color: 'var(--text-muted)' }}>Memuat data hukuman...</p>
                    </div>
                ) : punishments.length === 0 && !error ? (
                    <div className="py-12 text-center rounded-xl" style={{ backgroundColor: '#f9fafb', border: '1px dashed #e5e7eb' }}>
                        <Icons.Shield className="w-12 h-12 mx-auto mb-4" style={{ color: 'var(--text-muted)' }} />
                        <h3 className="font-bold text-lg" style={{ color: 'var(--text-secondary)' }}>Tidak ada data</h3>
                        <p className="text-sm mt-2" style={{ color: 'var(--text-muted)' }}>Belum ada pemain yang menerima hukuman saat ini.</p>
                    </div>
                ) : (
                    <div className="w-full rounded-xl flex flex-col pt-2">
                        <table className="w-full text-left border-collapse table-fixed">
                            <thead>
                                <tr style={{ borderBottom: '1px solid #e5e7eb' }}>
                                    <th className="px-5 py-4 text-[10px] font-black uppercase tracking-wider text-gray-400 w-[20%]">Pemain</th>
                                    <th className="px-5 py-4 text-[10px] font-black uppercase tracking-wider text-gray-400 w-[18%]">Tanggal</th>
                                    <th className="px-5 py-4 text-[10px] font-black uppercase tracking-wider text-gray-400 w-[42%]">Alasan</th>
                                    <th className="px-5 py-4 text-[10px] font-black uppercase tracking-wider text-gray-400 text-right w-[20%]">Masa Hukuman</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-100 bg-white">
                                {punishments.map((p, index) => {
                                    const status = getStatusInfo(p);
                                    const isPermanent = p.end === 0 || !p.end;
                                    const isExpired = !isPermanent && p.end < Date.now();

                                    return (
                                        <tr key={index} className="hover:bg-gray-50 transition-colors group">
                                            {/* Pemain */}
                                            <td className="px-5 py-4">
                                                <div className="flex items-center gap-3">
                                                    <div className="relative flex-shrink-0 group-hover:scale-105 transition-transform duration-300">
                                                        <img
                                                            src={`https://minotar.net/helm/${p.nickname}/36.png`}
                                                            alt={p.nickname}
                                                            className="w-9 h-9 rounded-lg shadow-sm"
                                                            onError={(e) => { e.target.src = 'https://minotar.net/helm/Steve/36.png'; }}
                                                        />
                                                    </div>
                                                    <div className="flex flex-col overflow-hidden justify-center">
                                                        <span className="font-extrabold text-sm truncate leading-none" style={{ color: 'var(--text-primary)' }}>{p.nickname}</span>
                                                    </div>
                                                </div>
                                            </td>

                                            {/* Tanggal */}
                                            <td className="px-5 py-4">
                                                <div className="flex items-center gap-1.5 text-[11px] font-bold" style={{ color: 'var(--text-muted)' }}>
                                                    <Icons.Clock className="w-3.5 h-3.5 opacity-60 flex-shrink-0" />
                                                    <span className="truncate">{formatDate(p.start)}</span>
                                                </div>
                                            </td>

                                            {/* Alasan */}
                                            <td className="px-5 py-4">
                                                <p className="text-xs italic font-medium leading-relaxed truncate" style={{ color: 'var(--text-secondary)' }} title={p.reason}>
                                                    &ldquo;{p.reason}&rdquo;
                                                </p>
                                            </td>

                                            {/* Masa Hukuman */}
                                            <td className="px-6 py-4 text-right whitespace-nowrap">
                                                <div className="flex flex-col items-end">
                                                    <div className="flex items-center gap-1.5 font-bold text-sm" style={{ color: isPermanent ? '#dc2626' : 'var(--text-primary)' }}>
                                                        {isPermanent ? (
                                                            <Icons.Lock className="w-4 h-4 opacity-80" />
                                                        ) : (
                                                            <Icons.Clock className="w-4 h-4 opacity-80" />
                                                        )}
                                                        {formatDuration(p.start, p.end)}
                                                    </div>
                                                    {!isPermanent && !isExpired && p.end && (
                                                        <span className="text-[10px] font-bold mt-0.5 opacity-80" style={{ color: 'var(--text-muted)' }}>
                                                            Hingga {formatDate(p.end)}
                                                        </span>
                                                    )}
                                                </div>
                                            </td>
                                        </tr>
                                    );
                                })}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>

            {/* Pagination */}
            <div className={`mt-8 flex flex-col sm:flex-row items-center justify-between gap-4 p-4 rounded-2xl transition-opacity duration-300 ${loading ? 'opacity-50 pointer-events-none' : 'opacity-100'}`} style={{ backgroundColor: '#fdfdfd', border: '1px solid #f3f4f6' }}>
                <p className="text-sm font-medium" style={{ color: 'var(--text-muted)' }}>
                    Menampilkan <span className="font-extrabold" style={{ color: 'var(--text-primary)' }}>{Math.min((pagination.page - 1) * 10 + 1, pagination.total || 0)}</span> - <span className="font-extrabold" style={{ color: 'var(--text-primary)' }}>{Math.min(pagination.page * 10, pagination.total || 0)}</span> dari <span className="font-extrabold" style={{ color: 'var(--text-primary)' }}>{pagination.total || 0}</span> catatan
                </p>

                <div className="flex items-center p-1 bg-white rounded-xl shadow-sm border border-gray-200/60">
                    {/* Previous Button */}
                    <button
                        onClick={() => handlePageChange(pagination.page - 1)}
                        disabled={pagination.page <= 1}
                        className="flex items-center gap-1.5 px-3 py-2 text-sm font-bold rounded-lg transition-all duration-300 hover:bg-gray-50 disabled:opacity-30 disabled:hover:bg-transparent"
                        style={{ color: 'var(--text-secondary)' }}
                    >
                        <Icons.ChevronDown className="w-4 h-4 rotate-90" />
                        <span className="hidden sm:inline">Prev</span>
                    </button>

                    <div className="h-5 w-px bg-gray-200 mx-1"></div>

                    {/* Page Numbers */}
                    <div className="flex items-center px-1">
                        {(pagination.totalPages <= 0 ? [1] : [...Array(pagination.totalPages)].map((_, i) => i + 1)).map(pageNum => {
                            const isCurrent = pageNum === pagination.page;

                            if (pagination.totalPages > 7) {
                                if (
                                    pageNum !== 1 &&
                                    pageNum !== pagination.totalPages &&
                                    Math.abs(pageNum - pagination.page) > 2
                                ) {
                                    if (Math.abs(pageNum - pagination.page) === 3) {
                                        return <span key={pageNum} className="px-2 font-bold text-xs tracking-widest text-gray-400">...</span>;
                                    }
                                    return null;
                                }
                            }

                            return (
                                <button
                                    key={pageNum}
                                    onClick={() => handlePageChange(pageNum)}
                                    className={`relative flex items-center justify-center w-8 h-8 rounded-lg text-sm font-extrabold transition-all duration-300 mx-0.5 ${isCurrent
                                            ? 'scale-110 shadow-sm z-10'
                                            : 'hover:bg-gray-100 hover:scale-105 active:scale-95 text-gray-500'
                                        }`}
                                    style={isCurrent ? {
                                        backgroundColor: 'var(--brand-secondary)',
                                        color: '#ffffff',
                                        boxShadow: '0 4px 12px rgba(226, 110, 16, 0.3)',
                                    } : {}}
                                >
                                    {pageNum}
                                </button>
                            );
                        })}
                    </div>

                    <div className="h-5 w-px bg-gray-200 mx-1"></div>

                    {/* Next Button */}
                    <button
                        onClick={() => handlePageChange(pagination.page + 1)}
                        disabled={pagination.page >= pagination.totalPages}
                        className="flex items-center gap-1.5 px-3 py-2 text-sm font-bold rounded-lg transition-all duration-300 hover:bg-gray-50 disabled:opacity-30 disabled:hover:bg-transparent"
                        style={{ color: 'var(--text-secondary)' }}
                    >
                        <span className="hidden sm:inline">Next</span>
                        <Icons.ChevronDown className="w-4 h-4 -rotate-90" />
                    </button>
                </div>
            </div>
        </Wrapper>
    )
}
