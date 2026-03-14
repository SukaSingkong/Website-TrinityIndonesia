import AdminLayout from '../../components/admin/AdminLayout';
import { useState, useEffect } from 'react';

export default function VerifiedPlayers() {
    const [players, setPlayers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [nicknameInput, setNicknameInput] = useState('');
    const [adding, setAdding] = useState(false);
    const [error, setError] = useState(null);
    const [success, setSuccess] = useState(null);

    async function fetchPlayers() {
        setLoading(true);
        try {
            const res = await fetch('/api/admin/verified');
            const data = await res.json();
            setPlayers(Array.isArray(data) ? data : []);
        } catch (e) {
            setError('Gagal memuat data.');
        } finally {
            setLoading(false);
        }
    }

    useEffect(() => {
        fetchPlayers();
    }, []);

    async function handleAdd(e) {
        e.preventDefault();
        if (!nicknameInput.trim()) return;
        setAdding(true);
        setError(null);
        setSuccess(null);
        try {
            const res = await fetch('/api/admin/verified', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ nickname: nicknameInput.trim() })
            });
            const data = await res.json();
            if (!res.ok) {
                setError(data.message || 'Gagal menambahkan.');
            } else {
                setSuccess(`${nicknameInput.trim()} berhasil ditambahkan!`);
                setNicknameInput('');
                fetchPlayers();
            }
        } catch {
            setError('Terjadi kesalahan.');
        } finally {
            setAdding(false);
        }
    }

    async function handleDelete(id, nickname) {
        if (!confirm(`Hapus verified untuk "${nickname}"?`)) return;
        setError(null);
        setSuccess(null);
        try {
            const res = await fetch('/api/admin/verified', {
                method: 'DELETE',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ id })
            });
            if (res.ok) {
                setSuccess(`${nickname} dihapus dari daftar verified.`);
                fetchPlayers();
            } else {
                const data = await res.json();
                setError(data.message || 'Gagal menghapus.');
            }
        } catch {
            setError('Terjadi kesalahan.');
        }
    }

    return (
        <AdminLayout title="Verified Players">
            {/* Header Card */}
            <div className="relative overflow-hidden rounded-3xl p-8 mb-8 text-white shadow-xl" style={{ background: 'linear-gradient(135deg, #2563eb, #1d4ed8)' }}>
                <div className="absolute top-0 right-0 w-64 h-64 bg-white opacity-5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/4"></div>
                <div className="absolute bottom-0 left-0 w-48 h-48 bg-white opacity-5 rounded-full blur-2xl translate-y-1/3 -translate-x-1/4"></div>
                <div className="relative z-10 flex flex-col sm:flex-row items-center justify-between gap-6">
                    <div>
                        <h2 className="text-3xl font-black mb-2 flex items-center gap-3">
                            <i className="ri-shield-check-line" />
                            Verified Players
                        </h2>
                        <p className="text-white/80 font-medium">
                            Kelola daftar nickname yang mendapatkan badge verified di leaderboard.
                        </p>
                    </div>
                    <div className="hidden md:flex w-16 h-16 rounded-2xl bg-white/20 items-center justify-center backdrop-blur-sm border border-white/30 shadow-inner">
                        <i className="ri-vip-crown-line text-3xl text-white" />
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
                {/* Add Form */}
                <div className="xl:col-span-1">
                    <div className="mc-card p-6">
                        <h3 className="text-base font-black mb-4 flex items-center gap-2" style={{ color: 'var(--text-primary)' }}>
                            <i className="ri-add-circle-line text-[#2563eb]" />
                            Tambah Verified
                        </h3>

                        {error && (
                            <div className="mb-4 px-4 py-3 rounded-xl text-sm font-bold flex items-center gap-2" style={{ background: '#fef2f2', color: '#dc2626', border: '1px solid #fecaca' }}>
                                <i className="ri-error-warning-line" />
                                {error}
                            </div>
                        )}
                        {success && (
                            <div className="mb-4 px-4 py-3 rounded-xl text-sm font-bold flex items-center gap-2" style={{ background: '#f0fdf4', color: '#16a34a', border: '1px solid #bbf7d0' }}>
                                <i className="ri-checkbox-circle-line" />
                                {success}
                            </div>
                        )}

                        <form onSubmit={handleAdd} className="flex flex-col gap-3">
                            <div>
                                <label className="text-xs font-black uppercase tracking-wider mb-1.5 block" style={{ color: 'var(--text-muted)' }}>
                                    Nickname (case-sensitive)
                                </label>
                                <input
                                    type="text"
                                    value={nicknameInput}
                                    onChange={e => setNicknameInput(e.target.value)}
                                    placeholder="Contoh: LouYz_"
                                    className="w-full px-4 py-3 rounded-xl text-sm font-bold outline-none transition-all"
                                    style={{
                                        background: 'var(--bg-body)',
                                        color: 'var(--text-primary)',
                                        border: '2px solid var(--bg-body)'
                                    }}
                                    onFocus={e => e.target.style.borderColor = '#2563eb'}
                                    onBlur={e => e.target.style.borderColor = 'var(--bg-body)'}
                                    disabled={adding}
                                />
                            </div>
                            <button
                                type="submit"
                                disabled={adding || !nicknameInput.trim()}
                                className="w-full py-3 rounded-xl text-sm font-black text-white transition-all flex items-center justify-center gap-2"
                                style={{
                                    background: adding || !nicknameInput.trim() ? '#93c5fd' : '#2563eb',
                                    cursor: adding || !nicknameInput.trim() ? 'not-allowed' : 'pointer',
                                    boxShadow: adding || !nicknameInput.trim() ? 'none' : '0 4px 14px rgba(37,99,235,0.35)'
                                }}
                            >
                                {adding ? (
                                    <>
                                        <i className="ri-loader-4-line animate-spin" />
                                        Menambahkan...
                                    </>
                                ) : (
                                    <>
                                        <i className="ri-shield-check-line" />
                                        Tambah Verified
                                    </>
                                )}
                            </button>
                        </form>

                        <div className="mt-5 p-3 rounded-xl" style={{ background: 'rgba(37,99,235,0.06)', border: '1px solid rgba(37,99,235,0.15)' }}>
                            <p className="text-xs font-bold" style={{ color: '#2563eb' }}>
                                <i className="ri-information-line mr-1" />
                                Nickname bersifat case-sensitive dan harus persis sama dengan nama di leaderboard. Icon ✓ akan muncul otomatis di samping nama mereka.
                            </p>
                        </div>
                    </div>
                </div>

                {/* Players List */}
                <div className="xl:col-span-2">
                    <div className="mc-card p-6">
                        <div className="flex items-center justify-between mb-4">
                            <h3 className="text-base font-black flex items-center gap-2" style={{ color: 'var(--text-primary)' }}>
                                <i className="ri-list-check-2 text-[#2563eb]" />
                                Daftar Verified
                            </h3>
                            <span className="text-xs font-black px-3 py-1 rounded-full" style={{ background: 'rgba(37,99,235,0.1)', color: '#2563eb' }}>
                                {players.length} player
                            </span>
                        </div>

                        {loading ? (
                            <div className="space-y-3 animate-pulse">
                                {[...Array(3)].map((_, i) => (
                                    <div key={i} className="flex items-center gap-4 p-4 rounded-xl" style={{ background: 'var(--bg-body)' }}>
                                        <div className="w-10 h-10 rounded-xl bg-gray-200"></div>
                                        <div className="flex-1">
                                            <div className="h-4 bg-gray-200 rounded w-32 mb-2"></div>
                                            <div className="h-3 bg-gray-200 rounded w-48"></div>
                                        </div>
                                        <div className="w-16 h-8 bg-gray-200 rounded-xl"></div>
                                    </div>
                                ))}
                            </div>
                        ) : players.length === 0 ? (
                            <div className="py-12 text-center rounded-xl" style={{ background: 'var(--bg-body)' }}>
                                <i className="ri-shield-line text-5xl mb-3 block" style={{ color: 'var(--text-muted)' }} />
                                <p className="font-bold text-sm" style={{ color: 'var(--text-muted)' }}>Belum ada verified player</p>
                            </div>
                        ) : (
                            <div className="space-y-3">
                                {players.map((p, i) => (
                                    <div key={p.id} className="flex items-center gap-4 p-4 rounded-xl transition-colors hover:bg-[var(--bg-body)]" style={{ border: '1px solid var(--bg-body)' }}>
                                        {/* Avatar */}
                                        <div className="w-10 h-10 rounded-xl overflow-hidden flex-shrink-0 bg-[var(--bg-body)]">
                                            <img
                                                src={`https://minotar.net/helm/${p.nickname}/40.png`}
                                                alt={p.nickname}
                                                className="w-full h-full object-cover"
                                                onError={e => { e.target.src = 'https://minotar.net/helm/Steve/40.png'; }}
                                            />
                                        </div>

                                        {/* Info */}
                                        <div className="flex-1 min-w-0">
                                            <div className="flex items-center gap-2">
                                                <span className="font-black text-sm" style={{ color: 'var(--text-primary)' }}>{p.nickname}</span>
                                                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-black" style={{ background: '#dbeafe', color: '#1d4ed8' }}>
                                                    <i className="ri-shield-check-fill text-xs" />
                                                    VERIFIED
                                                </span>
                                            </div>
                                            <p className="text-[10px] font-bold mt-0.5" style={{ color: 'var(--text-muted)' }}>
                                                Ditambahkan: {new Date(p.created_at).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })}
                                            </p>
                                        </div>

                                        {/* Delete */}
                                        <button
                                            onClick={() => handleDelete(p.id, p.nickname)}
                                            className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-black transition-all hover:shadow-md"
                                            style={{ background: '#fef2f2', color: '#dc2626' }}
                                        >
                                            <i className="ri-delete-bin-6-line" />
                                            Hapus
                                        </button>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </AdminLayout>
    );
}
