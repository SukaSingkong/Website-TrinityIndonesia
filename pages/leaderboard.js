import { useState, useEffect, useRef, useCallback } from 'react';
import { Wrapper } from '@layer/components/layout/Wrapper.jsx';
import { Icons } from '@layer/components/elements/Icons.jsx';
import Link from 'next/link';

const CATEGORIES = [
    { id: 'points', label: 'Points', icon: Icons.Star },
    { id: 'money', label: 'Money', icon: Icons.Cash },
    { id: 'playtime', label: 'Jam Bermain', icon: Icons.Clock },
    { id: 'votes', label: 'Votes', icon: Icons.Heart },
    { id: 'level', label: 'Level', icon: Icons.Users }
];

export default function Leaderboard() {
    const [activeCategory, setActiveCategory] = useState('money');
    const [stats, setStats] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [refreshing, setRefreshing] = useState(false);
    const [cooldown, setCooldown] = useState(0);
    const cooldownRef = useRef(null);

    const COOLDOWN_KEY = 'leaderboard_refresh_cooldown';
    const COOLDOWN_DURATION = 60;

    const CATEGORY_MAP = {
        'money': 'Balance',
        'points': 'Points',
        'playtime': 'Hours Played',
        'votes': 'Votes',
        'level': 'Level' // Keeping level here just in case it populates later
    };

    const startCooldownTimer = useCallback((remaining) => {
        setCooldown(remaining);
        if (cooldownRef.current) clearInterval(cooldownRef.current);
        cooldownRef.current = setInterval(() => {
            setCooldown(prev => {
                if (prev <= 1) {
                    clearInterval(cooldownRef.current);
                    cooldownRef.current = null;
                    localStorage.removeItem(COOLDOWN_KEY);
                    return 0;
                }
                return prev - 1;
            });
        }, 1000);
    }, []);

    const startCooldown = useCallback(() => {
        const endTime = Date.now() + COOLDOWN_DURATION * 1000;
        localStorage.setItem(COOLDOWN_KEY, endTime.toString());
        startCooldownTimer(COOLDOWN_DURATION);
    }, [startCooldownTimer]);

    useEffect(() => {
        const saved = localStorage.getItem(COOLDOWN_KEY);
        if (saved) {
            const remaining = Math.ceil((parseInt(saved) - Date.now()) / 1000);
            if (remaining > 0) {
                startCooldownTimer(remaining);
            } else {
                localStorage.removeItem(COOLDOWN_KEY);
            }
        }
        return () => {
            if (cooldownRef.current) clearInterval(cooldownRef.current);
        };
    }, [startCooldownTimer]);

    async function fetchStats(isManual = false) {
        try {
            setRefreshing(true);
            setLoading(true);
            const res = await fetch(`/api/stats?t=${Date.now()}`, {
                cache: 'no-store',
                headers: { 'Pragma': 'no-cache', 'Cache-Control': 'no-cache' }
            });
            if (!res.ok) throw new Error('Failed to fetch data');
            const data = await res.json();
            setStats(data);
            setError(null);
            if (isManual) startCooldown();
        } catch (err) {
            console.error(err);
            setError('Gagal memuat data leaderboard.');
        } finally {
            setLoading(false);
            setRefreshing(false);
        }
    }

    useEffect(() => {
        fetchStats();
        // Removed setInterval logic
    }, []);

    // Helper to format scores
    const formatScore = (score, category) => {
        if (category === 'money' || category === 'points') {
            return new Intl.NumberFormat('id-ID').format(score);
        }
        if (category === 'playtime') {
            return `${score} Jam`;
        }
        if (category === 'votes') {
            return `${new Intl.NumberFormat('id-ID').format(score)} Vote`;
        }
        return score;
    };

    // Helper to get raw leaderboard data sorted
    const getLeaderboardData = (categoryId) => {
        if (!stats || !stats.scoreboard || !stats.scoreboard.scores) return [];

        const targetColumn = CATEGORY_MAP[categoryId];
        const categoryScores = stats.scoreboard.scores[targetColumn] || {};

        const entries = Object.keys(categoryScores)
            .filter(player => !player.includes(' Top ') && !player.endsWith(' Player') && !player.endsWith(' Value'))
            .map(player => {
                let rawScore = categoryScores[player];
                let score = 0;
                if (typeof rawScore === 'number') {
                    score = rawScore;
                } else if (typeof rawScore === 'string') {
                    const parsed = parseFloat(rawScore.replace(/,/g, ''));
                    if (!isNaN(parsed)) score = parsed;
                }

                return {
                    player,
                    score
                };
            })
            .filter(entry => entry.score > 0)
            .sort((a, b) => b.score - a.score) // Descending
            .slice(0, 5); // Limit to top 5

        return entries;
    };

    const currentData = getLeaderboardData(activeCategory);

    return (
        <Wrapper
            title="Leaderboard"
            description="Peringkat pemain teratas di Trinity Indonesia."
            path="/leaderboard"
        >
            <div className="mc-content-card mb-8 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div>
                    <h2 className="text-2xl font-extrabold mb-2" style={{ color: 'var(--text-primary)' }}>
                        Leaderboard
                    </h2>
                    <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>
                        Peringkat pemain teratas berdasarkan aset dan progres yang dicapai.
                    </p>
                </div>
                <button
                    onClick={() => fetchStats(true)}
                    disabled={refreshing || cooldown > 0}
                    className="mc-btn mc-btn-outline flex items-center gap-2 text-sm px-4 py-2"
                    style={{ opacity: cooldown > 0 ? 0.6 : 1 }}
                >
                    <Icons.Refresh className={`w-4 h-4 ${refreshing ? 'animate-spin' : ''}`} />
                    {refreshing ? 'Memuat...' : cooldown > 0 ? `Tunggu ${cooldown}s` : 'Refresh'}
                </button>
            </div>

            {/* Category Tabs */}
            <div className="flex flex-wrap gap-2 mb-8">
                {CATEGORIES.map((category) => {
                    const isActive = activeCategory === category.id;
                    const Icon = category.icon;
                    return (
                        <button
                            key={category.id}
                            onClick={() => setActiveCategory(category.id)}
                            className={`flex items-center gap-2 px-6 py-3 rounded-xl font-bold text-sm transition-all duration-300`}
                            style={{
                                backgroundColor: isActive ? 'var(--brand-secondary)' : '#f0edf4',
                                color: isActive ? '#fff' : 'var(--text-muted)',
                                boxShadow: isActive ? '0 4px 14px rgba(226, 110, 16, 0.3)' : 'none',
                                transform: isActive ? 'translateY(-2px)' : 'none'
                            }}
                        >
                            {Icon && <Icon className="w-5 h-5" />}
                            {category.label}
                        </button>
                    );
                })}
            </div>

            {/* Content Area */}
            <div className="mc-content-card">
                {loading ? (
                    <div className="flex flex-col gap-3 animate-pulse">
                        {[...Array(5)].map((_, index) => (
                            <div key={index} className="flex items-center justify-between p-4 rounded-xl bg-white border border-gray-200">
                                <div className="flex items-center gap-6">
                                    <div className="w-10 h-10 rounded-full bg-gray-200"></div>
                                    <div className="flex items-center gap-5">
                                        <div className="w-8 h-8 rounded bg-gray-200"></div>
                                        <div className="h-4 bg-gray-200 rounded w-24"></div>
                                    </div>
                                </div>
                                <div className="h-4 bg-gray-200 rounded w-16"></div>
                            </div>
                        ))}
                    </div>
                ) : error ? (
                    <div className="py-12 text-center rounded-xl" style={{ backgroundColor: '#fef2f2', border: '1px solid #fecaca' }}>
                        <Icons.Shield className="w-12 h-12 mx-auto mb-4" style={{ color: '#dc2626' }} />
                        <h3 className="font-bold text-lg" style={{ color: '#dc2626' }}>{error}</h3>
                        <p className="text-sm mt-2" style={{ color: '#ef4444' }}>Silakan coba lagi beberapa saat lagi.</p>
                    </div>
                ) : currentData.length === 0 ? (
                    <div className="py-12 text-center rounded-xl" style={{ backgroundColor: '#f9fafb', border: '1px dashed #e5e7eb' }}>
                        <Icons.Users className="w-12 h-12 mx-auto mb-4" style={{ color: 'var(--text-muted)' }} />
                        <h3 className="font-bold text-lg" style={{ color: 'var(--text-secondary)' }}>Belum ada data</h3>
                        <p className="text-sm mt-2" style={{ color: 'var(--text-muted)' }}>Belum ada pemain yang masuk dalam kategori peringkat ini.</p>
                    </div>
                ) : (
                    <div className="flex flex-col gap-3">
                        {currentData.map((row, index) => {
                            const isTop3 = index < 3;
                            const rankColors = [
                                { bg: '#FEF3C7', text: '#D97706', border: '#FDE68A', shadow: 'rgba(252, 211, 77, 0.4)' }, // Gold
                                { bg: '#F3F4F6', text: '#4B5563', border: '#E5E7EB', shadow: 'rgba(156, 163, 175, 0.4)' }, // Silver
                                { bg: '#FEF3C7', text: '#B45309', border: '#FCD34D', shadow: 'rgba(251, 191, 36, 0.4)' }, // Bronze
                            ];

                            const rankStyle = isTop3 ? rankColors[index] : { bg: 'transparent', text: 'var(--text-muted)', border: '#f3f4f6', shadow: 'transparent' };

                            return (
                                <div key={index} className="flex items-center justify-between p-4 rounded-xl transition-all hover:bg-gray-50 bg-white" style={{ border: `1px solid ${isTop3 ? rankStyle.border : '#e5e7eb'}` }}>
                                    <div className="flex items-center gap-6">
                                        {/* Rank Number */}
                                        <div className="flex items-center justify-center w-10 h-10 rounded-full font-bold text-lg"
                                            style={{
                                                backgroundColor: isTop3 ? rankStyle.bg : 'transparent',
                                                color: isTop3 ? rankStyle.text : 'var(--text-muted)',
                                                boxShadow: isTop3 ? `0 0 10px ${rankStyle.shadow}` : 'none'
                                            }}>
                                            {index + 1}
                                        </div>

                                        {/* Player Avatar & Name */}
                                        <div className="flex items-center gap-5">
                                            <img
                                                src={`https://minotar.net/helm/${row.player}/32.png`}
                                                alt={row.player}
                                                className="w-8 h-8 rounded shadow-sm"
                                                onError={(e) => { e.target.src = 'https://minotar.net/helm/Steve/32.png'; }}
                                            />
                                            <span className="font-bold text-base" style={{ color: 'var(--text-primary)' }}>{row.player}</span>
                                        </div>
                                    </div>

                                    {/* Score */}
                                    <div className="font-bold text-right" style={{ color: 'var(--text-secondary)' }}>
                                        {activeCategory === 'money' ? '$' : ''}{formatScore(row.score, activeCategory)}
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                )}
            </div>

            {activeCategory === 'points' && !loading && !error && currentData.length > 0 && (
                <div className="mc-content-card mt-6 flex flex-col sm:flex-row items-center justify-between gap-4">
                    <div className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0" style={{ backgroundColor: 'var(--brand-secondary)', color: 'white', boxShadow: '0 4px 14px rgba(226, 110, 16, 0.3)' }}>
                            <Icons.Star className="w-6 h-6" />
                        </div>
                        <div>
                            <h4 className="font-bold text-lg" style={{ color: 'var(--text-primary)' }}>Ingin masuk leaderboard ini?</h4>
                            <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>Buruan beli Points sekarang dan jadilah yang teratas!</p>
                        </div>
                    </div>
                    <Link href="/store" className="mc-btn mc-btn-primary flex items-center gap-2 whitespace-nowrap">
                        <Icons.ShoppingBag className="w-5 h-5" />
                        Beli Points
                    </Link>
                </div>
            )}

            {activeCategory === 'money' && !loading && !error && currentData.length > 0 && (
                <div className="mc-content-card mt-6 flex flex-col sm:flex-row items-center justify-between gap-4">
                    <div className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0" style={{ backgroundColor: '#10B981', color: 'white', boxShadow: '0 4px 14px rgba(16, 185, 129, 0.3)' }}>
                            <Icons.Cash className="w-6 h-6" />
                        </div>
                        <div>
                            <h4 className="font-bold text-lg" style={{ color: 'var(--text-primary)' }}>Ingin masuk leaderboard ini?</h4>
                            <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>Bermain, berdagang, dan kumpulkan uang sebanyak-banyaknya di dalam game!</p>
                        </div>
                    </div>
                </div>
            )}

            {activeCategory === 'playtime' && !loading && !error && currentData.length > 0 && (
                <div className="mc-content-card mt-6 flex flex-col sm:flex-row items-center justify-between gap-4">
                    <div className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0" style={{ backgroundColor: '#3B82F6', color: 'white', boxShadow: '0 4px 14px rgba(59, 130, 246, 0.3)' }}>
                            <Icons.Clock className="w-6 h-6" />
                        </div>
                        <div>
                            <h4 className="font-bold text-lg" style={{ color: 'var(--text-primary)' }}>Ingin masuk leaderboard ini?</h4>
                            <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>Terus bermain dan jadilah pemain paling aktif di server!</p>
                        </div>
                    </div>
                </div>
            )}

            {activeCategory === 'votes' && !loading && !error && currentData.length > 0 && (
                <div className="mc-content-card mt-6 flex flex-col sm:flex-row items-center justify-between gap-4">
                    <div className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0" style={{ backgroundColor: '#EF4444', color: 'white', boxShadow: '0 4px 14px rgba(239, 68, 68, 0.3)' }}>
                            <Icons.Heart className="w-6 h-6" />
                        </div>
                        <div>
                            <h4 className="font-bold text-lg" style={{ color: 'var(--text-primary)' }}>Ingin masuk leaderboard ini?</h4>
                            <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>Dukung server dengan melakukan vote setiap hari lewat website!</p>
                        </div>
                    </div>
                    <Link href="/vote" className="mc-btn mc-btn-primary flex items-center gap-2 whitespace-nowrap">
                        <Icons.CheckCircle className="w-5 h-5" />
                        Vote Sekarang
                    </Link>
                </div>
            )}

            {activeCategory === 'level' && !loading && !error && currentData.length > 0 && (
                <div className="mc-content-card mt-6 flex flex-col sm:flex-row items-center justify-between gap-4">
                    <div className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0" style={{ backgroundColor: '#8B5CF6', color: 'white', boxShadow: '0 4px 14px rgba(139, 92, 246, 0.3)' }}>
                            <Icons.Users className="w-6 h-6" />
                        </div>
                        <div>
                            <h4 className="font-bold text-lg" style={{ color: 'var(--text-primary)' }}>Ingin masuk leaderboard ini?</h4>
                            <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>Tingkatkan levelmu dengan menyelesaikan berbagai tantangan di dalam game!</p>
                        </div>
                    </div>
                </div>
            )}
        </Wrapper>
    );
}
