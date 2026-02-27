import { Wrapper } from '@layer/components/layout/Wrapper.jsx'
import { Icons } from '@layer/components/elements/Icons.jsx'
import { useEffect, useState } from "react"
import { useRouter } from 'next/router'
import config from '@layer/theme.config'
import { getDbConnection } from '@layer/lib/db'

export async function getServerSideProps() {
    try {
        const pool = await getDbConnection();
        const [settingsRows] = await pool.query('SELECT * FROM store_settings LIMIT 1');
        const [productRows] = await pool.query('SELECT * FROM store_products ORDER BY id ASC');

        const [topSupporterRows] = await pool.query(`
            SELECT player_name, SUM(points_purchased) as total_points
            FROM store_purchases
            WHERE status = 'success' AND MONTH(created_at) = MONTH(CURRENT_DATE()) AND YEAR(created_at) = YEAR(CURRENT_DATE())
            GROUP BY player_name
            ORDER BY total_points DESC
            LIMIT 1
        `);

        const [topSupporterAllTimeRows] = await pool.query(`
            SELECT player_name, SUM(points_purchased) as total_points
            FROM store_purchases
            WHERE status = 'success'
            GROUP BY player_name
            ORDER BY total_points DESC
            LIMIT 1
        `);

        const [recentPaymentRows] = await pool.query(`
            SELECT player_name, MAX(created_at) as latest_purchase
            FROM store_purchases
            WHERE status = 'success'
            GROUP BY player_name
            ORDER BY latest_purchase DESC
            LIMIT 10
        `);

        const dbSettings = settingsRows[0] || {
            event_name: 'Store', discount_enabled: 0,
            base_price_per_500: 5000, discounted_price_per_500: 4000
        };

        const products = productRows.map(p => {
            const basePrice = p.quantity * dbSettings.base_price_per_500;
            const currentPrice = dbSettings.discount_enabled ? (p.quantity * dbSettings.discounted_price_per_500) : basePrice;

            return {
                ...p,
                imageStyle: { filter: p.image_filter || '' },
                originalPrice: `Rp ${basePrice.toLocaleString('id-ID')}`,
                price: `Rp ${currentPrice.toLocaleString('id-ID')}`
            };
        });

        return {
            props: {
                storeSettings: JSON.parse(JSON.stringify(dbSettings)),
                storeProducts: JSON.parse(JSON.stringify(products)),
                topSupporter: topSupporterRows.length > 0 ? topSupporterRows[0].player_name : null,
                topSupporterAllTime: topSupporterAllTimeRows.length > 0 ? topSupporterAllTimeRows[0].player_name : null,
                recentPayments: recentPaymentRows.map(r => r.player_name)
            }
        }
    } catch (e) {
        console.error(e)
        return {
            props: {
                storeSettings: { event_name: 'Error', discount_enabled: 0 },
                storeProducts: [],
                topSupporter: null,
                topSupporterAllTime: null,
                recentPayments: []
            }
        }
    }
}

export default function Store({ storeSettings, storeProducts, topSupporter, topSupporterAllTime, recentPayments }) {
    const { event_name: event, discount_enabled: discountEnabled } = storeSettings || {};
    const products = storeProducts || [];
    const [username, setUsername] = useState('')
    const [referral, setReferral] = useState('')
    const [platform, setPlatform] = useState('java')
    const [loggedIn, setLoggedIn] = useState(false)
    const [savedUsername, setSavedUsername] = useState('')
    const [isLoading, setIsLoading] = useState(true)
    const [error, setError] = useState('')
    const [toastVisible, setToastVisible] = useState(false)
    const [toastMsg, setToastMsg] = useState('')

    // Purchase modal states
    const [showPurchaseModal, setShowPurchaseModal] = useState(false)
    const [selectedProduct, setSelectedProduct] = useState(null)
    const [agreedToTerms, setAgreedToTerms] = useState(false)

    // Pagination
    const PRODUCTS_PER_PAGE = 6
    const [currentPage, setCurrentPage] = useState(1)
    const totalPages = Math.ceil(products.length / PRODUCTS_PER_PAGE)
    const paginatedProducts = products.slice((currentPage - 1) * PRODUCTS_PER_PAGE, currentPage * PRODUCTS_PER_PAGE)

    // Success modal state
    const [showSuccessModal, setShowSuccessModal] = useState(false)
    const [successData, setSuccessData] = useState(null)
    const router = useRouter()



    useEffect(() => {
        const stored = localStorage.getItem("mcUsername")
        if (stored) {
            setSavedUsername(stored)
            setLoggedIn(true)
        }
        setTimeout(() => setIsLoading(false), 500)

        if (router.query.status === 'success') {
            const merchantRef = router.query.tripay_merchant_ref || ''
            const parts = merchantRef.split('-')
            if (parts.length >= 4) {
                const points = parts.pop()
                const nickname = parts.slice(2).join('-')
                setSuccessData({ nickname, points })
                setShowSuccessModal(true)
            }
            router.replace('/store', undefined, { shallow: true })
        }
    }, [router.query])

    function toast(msg) {
        setToastMsg(msg)
        setToastVisible(true)
        setTimeout(() => setToastVisible(false), 3000)
    }

    async function handleLogin(e) {
        e.preventDefault()
        setError('')
        setIsLoading(true)

        let finalUsername = username.trim()
        if (finalUsername.includes(".")) {
            setError("Username tidak boleh mengandung karakter titik (.)")
            setIsLoading(false)
            return
        }

        if (platform === "bedrock") finalUsername = "." + finalUsername

        if (referral.trim()) {
            try {
                const refResponse = await fetch("https://script.google.com/macros/s/AKfycbxBKLvYKN6qY1rLBAknhlnjPaW9qjZ-TwkekYw6WdJTteg1gMWRtvM87_VYGO7JGLT2/exec", {
                    method: "POST",
                    body: new URLSearchParams({ referral: referral.trim() })
                })
                const refData = await refResponse.json()
                if (!refData.success) {
                    setError("Kode referral tidak ditemukan.")
                    setIsLoading(false)
                    return
                }
            } catch {
                setError("Gagal memverifikasi referral code. Coba lagi nanti.")
                setIsLoading(false)
                return
            }
        }

        try {
            const response = await fetch("https://trinityid-data.vercel.app/validate", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ username: finalUsername, platform })
            })
            const data = await response.json()

            if (data.success) {
                localStorage.setItem("mcUsername", finalUsername)
                setSavedUsername(finalUsername)
                setLoggedIn(true)
                toast("Login berhasil! Selamat berbelanja.")
            } else {
                setError(`Username "${finalUsername}" tidak ditemukan. Pastikan kamu sudah pernah login ke dalam server.`)
            }
        } catch {
            setError("Tidak dapat tersambung ke server. Coba lagi nanti.")
        }

        setIsLoading(false)
    }

    function logout() {
        localStorage.removeItem("mcUsername")
        setSavedUsername('')
        setLoggedIn(false)
        setUsername('')
        toast("Logout berhasil!")
    }

    function openPurchaseModal(product) {
        setSelectedProduct(product)
        setAgreedToTerms(false)
        setShowPurchaseModal(true)
    }

    function confirmPurchase() {
        if (!agreedToTerms) {
            toast("Silakan centang persetujuan syarat dan ketentuan!")
            return
        }

        const quantity = selectedProduct.quantity
        const url = `https://trakteer.id/trinity-indonesia/tip/?open=true&step=2&quantity=${quantity}&display_name=${encodeURIComponent(savedUsername)}&unit=points`
        window.open(url, 'trakteerPopup', 'width=500,height=700')
        closePurchaseModal()
    }

    function closePurchaseModal() {
        setShowPurchaseModal(false)
        setSelectedProduct(null)
        setAgreedToTerms(false)
    }

    const cleanUsername = savedUsername.replace(".", "")

    return (
        <Wrapper
            title="Beli Points"
            description="Beli Points Trinity Indonesia untuk mendapatkan keuntungan in-game. Proses cepat, aman, dan berbagai pilihan paket menarik."
            path="/store"
        >
            {/* Toast */}
            <div className={`${toastVisible ? 'translate-y-0 opacity-100 scale-100' : 'translate-y-4 opacity-0 scale-95'} fixed right-6 bottom-6 z-50 mc-card px-6 py-4 shadow-xl transition-all duration-300`} style={{ borderLeft: '4px solid #16a34a' }}>
                <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full flex items-center justify-center" style={{ background: '#dcfce7' }}>
                        <Icons.CheckCircle className="h-5 w-5" style={{ color: '#16a34a' }} />
                    </div>
                    <p className="font-bold text-sm" style={{ color: 'var(--text-primary)' }}>{toastMsg}</p>
                </div>
            </div>

            {/* Loading Overlay */}
            {isLoading && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-white/70 backdrop-blur-sm">
                    <div className="w-12 h-12 border-4 rounded-full animate-spin" style={{ borderColor: 'rgba(226, 110, 16, 0.2)', borderTopColor: 'var(--brand-secondary)' }} />
                </div>
            )}

            {/* Payment Success Modal */}
            {showSuccessModal && successData && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
                    <div className="w-full max-w-md mc-card overflow-hidden text-center">
                        <div className="p-8" style={{ background: 'linear-gradient(135deg, #16a34a, #15803d)' }}>
                            <div className="w-20 h-20 mx-auto rounded-full flex items-center justify-center mb-4" style={{ background: 'rgba(255,255,255,0.2)' }}>
                                <Icons.CheckCircle className="h-12 w-12 text-white" />
                            </div>
                            <h3 className="text-2xl font-extrabold text-white">Pembayaran Berhasil!</h3>
                        </div>

                        <div className="p-6 space-y-4">
                            <p style={{ color: 'var(--text-muted)' }}>
                                Terima kasih sudah membeli points di Trinity Indonesia!
                            </p>

                            <div className="p-4 rounded-xl" style={{ background: '#f5f3f8' }}>
                                <p className="text-xs mb-1" style={{ color: 'var(--text-muted)' }}>Nickname</p>
                                <p className="font-extrabold text-lg" style={{ color: 'var(--text-primary)' }}>{successData.nickname}</p>
                            </div>

                            <div className="p-4 rounded-xl" style={{ background: '#dcfce7' }}>
                                <p className="text-xs mb-1" style={{ color: '#16a34a' }}>Points yang dibeli</p>
                                <p className="font-extrabold text-2xl" style={{ color: 'var(--text-primary)' }}>
                                    {successData.points} Points
                                    <Icons.Gem className="inline w-6 h-6 ml-2" style={{ color: 'var(--brand-secondary)' }} />
                                </p>
                            </div>

                            <p className="text-xs" style={{ color: 'var(--text-muted)' }}>
                                Points kamu akan segera ditambahkan ke akun. Jika dalam 24 jam points belum masuk, silakan hubungi admin.
                            </p>

                            <button
                                onClick={() => setShowSuccessModal(false)}
                                className="w-full py-4 rounded-xl font-extrabold text-white glow-button hover:opacity-90 transition-all"
                            >
                                Tutup
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Purchase Confirmation Modal */}
            {showPurchaseModal && selectedProduct && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm" onClick={closePurchaseModal}>
                    <div
                        className="w-full max-w-lg mc-card overflow-hidden max-h-[90vh] overflow-y-auto"
                        onClick={(e) => e.stopPropagation()}
                    >
                        {/* Modal Header */}
                        <div className="p-6" style={{ background: 'var(--brand-secondary)' }}>
                            <div className="flex items-center justify-between">
                                <div>
                                    <h3 className="text-2xl font-extrabold text-white">Konfirmasi Pembelian</h3>
                                    <p className="text-white/80 text-sm mt-1">{selectedProduct.points} Points - {selectedProduct.price}</p>
                                </div>
                                <button
                                    onClick={closePurchaseModal}
                                    className="w-10 h-10 rounded-xl flex items-center justify-center hover:bg-white/20 transition-colors"
                                    style={{ background: 'rgba(255,255,255,0.1)' }}
                                >
                                    <Icons.X className="h-5 w-5 text-white" />
                                </button>
                            </div>
                        </div>

                        <div className="p-6 space-y-6">
                            {!loggedIn ? (
                                <div>
                                    <div className="mb-6">
                                        <h4 className="font-extrabold text-lg" style={{ color: 'var(--text-primary)' }}>Login ke Akun Kamu</h4>
                                        <p className="text-sm" style={{ color: 'var(--text-muted)' }}>Silakan login terlebih dahulu untuk melanjutkan pembelian.</p>
                                    </div>

                                    {error && (
                                        <div className="mb-4 p-4 rounded-xl" style={{ background: '#fef2f2', border: '1px solid #fecaca' }}>
                                            <p className="text-sm" style={{ color: '#dc2626' }}>{error}</p>
                                        </div>
                                    )}

                                    <form onSubmit={handleLogin} className="space-y-4">
                                        <div className="relative">
                                            <input
                                                type="text"
                                                placeholder="Username"
                                                value={username}
                                                onChange={(e) => setUsername(e.target.value)}
                                                required
                                                className="mc-input"
                                            />
                                            <div className="absolute right-2 top-1/2 -translate-y-1/2 flex items-center gap-2">
                                                <span className="text-xs font-bold px-2 py-1 rounded-lg"
                                                    style={platform === 'java'
                                                        ? { background: '#dcfce7', color: '#16a34a' }
                                                        : { background: '#dbeafe', color: '#2563eb' }
                                                    }
                                                >
                                                    {platform === 'java' ? 'Java' : 'Bedrock'}
                                                </span>
                                            </div>
                                        </div>

                                        {/* Platform Toggle */}
                                        <div className="flex p-1 rounded-xl w-full" style={{ background: '#f5f3f8', border: '1px solid #e8e0f0' }}>
                                            <button
                                                type="button"
                                                onClick={() => setPlatform('java')}
                                                className={`flex-1 py-2.5 text-sm font-bold rounded-lg transition-all ${platform === 'java' ? 'shadow-md shadow-black/10' : 'hover:bg-black/5'}`}
                                                style={platform === 'java' ? { background: '#16a34a', color: 'white' } : { color: 'var(--text-secondary)' }}
                                            >
                                                Java
                                            </button>
                                            <button
                                                type="button"
                                                onClick={() => setPlatform('bedrock')}
                                                className={`flex-1 py-2.5 text-sm font-bold rounded-lg transition-all ${platform === 'bedrock' ? 'shadow-md shadow-black/10' : 'hover:bg-black/5'}`}
                                                style={platform === 'bedrock' ? { background: '#2563eb', color: 'white' } : { color: 'var(--text-secondary)' }}
                                            >
                                                Bedrock
                                            </button>
                                        </div>

                                        {/* Referral Input */}
                                        <input
                                            type="text"
                                            placeholder="Referral Code (Opsional)"
                                            value={referral}
                                            onChange={(e) => setReferral(e.target.value)}
                                            className="mc-input"
                                        />

                                        {/* Submit Button */}
                                        <button
                                            type="submit"
                                            disabled={isLoading}
                                            className="w-full glow-button font-extrabold py-4 rounded-xl text-white disabled:opacity-50 disabled:cursor-not-allowed"
                                        >
                                            {isLoading ? 'Memproses...' : 'Login & Lanjutkan'}
                                        </button>
                                    </form>
                                    <p className="mt-4 text-xs text-center" style={{ color: 'var(--text-muted)' }}>
                                        Dengan login, kamu menyetujui <a href="https://blog.trinityindonesia.cc/2025/03/term-and-condition.html" className="hover:underline" style={{ color: 'var(--brand-secondary)' }} target="_blank" rel="noreferrer">Syarat & Ketentuan</a>
                                    </p>
                                </div>
                            ) : (
                                <>
                                    {/* Nickname Confirmation */}
                                    <div>
                                        <label className="block text-sm font-bold mb-3" style={{ color: 'var(--text-muted)' }}>Konfirmasi Nickname</label>
                                        <div className="flex items-center justify-between gap-4 p-4 rounded-xl" style={{ background: '#f5f3f8' }}>
                                            <div className="flex items-center gap-4">
                                                <img
                                                    src={`https://mc-heads.net/avatar/${cleanUsername}/56`}
                                                    alt="Player Head"
                                                    className="w-14 h-14 rounded-xl"
                                                    style={{ border: '2px solid var(--brand-secondary)' }}
                                                />
                                                <div>
                                                    <p className="font-extrabold text-lg" style={{ color: 'var(--text-primary)' }}>{savedUsername}</p>
                                                    <p className="text-sm" style={{ color: 'var(--text-muted)' }}>{platform === 'java' ? 'Java Edition' : 'Bedrock Edition'}</p>
                                                </div>
                                            </div>
                                            <button
                                                onClick={logout}
                                                className="mc-btn font-extrabold py-2 px-4 rounded-xl shadow-sm hover:shadow"
                                                style={{ background: '#e8e0f0', color: 'var(--text-secondary)' }}
                                            >
                                                Log Out
                                            </button>
                                        </div>
                                    </div>

                                    {/* Warnings */}
                                    <div className="space-y-3">
                                        <div className="p-4 rounded-xl" style={{ background: '#fef2f2', border: '1px solid #fecaca' }}>
                                            <div className="flex items-start gap-3">
                                                <div className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0" style={{ background: '#fee2e2' }}>
                                                    <Icons.Ban className="h-5 w-5" style={{ color: '#dc2626' }} />
                                                </div>
                                                <div>
                                                    <p className="font-bold text-sm" style={{ color: '#dc2626' }}>JANGAN centang "Dukungan sebagai anonim"!</p>
                                                    <p className="text-xs mt-1" style={{ color: '#b91c1c' }}>Jika kamu centang anonim, points tidak akan terkirim karena nickname tidak terbaca.</p>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="p-4 rounded-xl" style={{ background: '#fffbeb', border: '1px solid #fde68a' }}>
                                            <div className="flex items-start gap-3">
                                                <div className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0" style={{ background: '#fef3c7' }}>
                                                    <Icons.ExclamationCircle className="h-5 w-5" style={{ color: '#d97706' }} />
                                                </div>
                                                <div>
                                                    <p className="font-bold text-sm" style={{ color: '#d97706' }}>Pastikan nickname & platform sudah benar!</p>
                                                    <p className="text-xs mt-1" style={{ color: '#92400e' }}>Jika nickname/platform salah, tidak ada refund. Silakan logout dan login ulang dengan nickname yang benar.</p>
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Agreement Checkbox */}
                                    <button
                                        type="button"
                                        onClick={() => setAgreedToTerms(!agreedToTerms)}
                                        className="flex items-center gap-4 p-4 rounded-xl border-2 cursor-pointer transition-all duration-200 text-left w-full"
                                        style={agreedToTerms
                                            ? { background: 'rgba(226,110,16,0.06)', borderColor: 'var(--brand-secondary)' }
                                            : { background: '#f5f3f8', borderColor: '#e8e0f0' }
                                        }
                                    >
                                        <div className="w-6 h-6 rounded-md flex items-center justify-center flex-shrink-0 transition-all duration-200"
                                            style={agreedToTerms
                                                ? { background: 'var(--brand-secondary)' }
                                                : { background: '#e8e0f0', border: '2px solid #cbc3d6' }
                                            }
                                        >
                                            {agreedToTerms && (
                                                <Icons.CheckCircle className="h-4 w-4 text-white" />
                                            )}
                                        </div>
                                        <span className="text-sm leading-relaxed" style={{ color: 'var(--text-secondary)' }}>
                                            Saya sudah membaca dan menyetujui <a href="/rules" className="font-bold hover:underline" style={{ color: 'var(--brand-secondary)' }} onClick={(e) => e.stopPropagation()}>Syarat dan Ketentuan</a>
                                        </span>
                                    </button>

                                    {/* Confirm Button */}
                                    <button
                                        onClick={confirmPurchase}
                                        disabled={!agreedToTerms}
                                        className={`w-full py-4 rounded-xl font-extrabold text-white transition-all duration-300 flex items-center justify-center gap-2 ${agreedToTerms
                                            ? 'glow-button hover:opacity-90 hover:shadow-lg'
                                            : 'cursor-not-allowed'
                                            }`}
                                        style={!agreedToTerms ? { background: '#cbc3d6' } : {}}
                                    >
                                        Lanjutkan ke Pembayaran
                                    </button>
                                </>
                            )}
                        </div>
                    </div>
                </div>
            )}

            {/* Store Header - Full Width */}
            <div className="flex flex-col gap-4 mb-6">


                {Boolean(discountEnabled) && event && (
                    <div
                        className="mc-card p-6 sm:p-8 overflow-hidden relative"
                        style={{
                            background: 'var(--brand-secondary)',
                            backgroundImage: storeSettings.popup_bg_image ? `url(${storeSettings.popup_bg_image})` : 'none',
                            backgroundSize: 'cover',
                            backgroundPosition: 'center',
                            border: 'none'
                        }}
                    >
                        {/* Overlay for readability when using bg image */}
                        {storeSettings.popup_bg_image && (
                            <div className="absolute inset-0 bg-black/40"></div>
                        )}
                        {/* Background Effects */}
                        <div className="absolute top-0 right-0 w-64 h-64 bg-black opacity-10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/4"></div>
                        <div className="absolute bottom-0 left-0 w-48 h-48 bg-black opacity-10 rounded-full blur-2xl translate-y-1/3 -translate-x-1/4"></div>

                        <div className="relative z-10 flex flex-row items-center justify-between gap-6">
                            <div className="flex-1">
                                <h2 className="text-3xl md:text-5xl font-black text-white mb-3" style={{ textShadow: '0 4px 12px rgba(0,0,0,0.4)' }}>
                                    {storeSettings.popup_title || `SPESIAL EVENT ${event.toUpperCase()}!`}
                                </h2>
                                <p className="text-white font-bold text-sm md:text-lg leading-relaxed" style={{ textShadow: '0 2px 6px rgba(0,0,0,0.4)' }}>
                                    {storeSettings.popup_subtitle || (
                                        <>Nikmati diskon eksklusif sebesar <strong className="text-[#FFE066] font-black bg-black/20 px-2 py-1 rounded-md shadow-inner">{storeSettings.popup_discount_text || '20%'}</strong> untuk semua pembelian Points selama event berlangsung.</>
                                    )}
                                </p>
                            </div>
                            <div className="flex-shrink-0">
                                <img
                                    src="/vendor/mascot.webp"
                                    alt="Event Mascot"
                                    className="h-24 sm:h-40 object-contain hover:scale-110 transition-transform duration-300"
                                    style={{ filter: 'drop-shadow(0 10px 15px rgba(0,0,0,0.5))' }}
                                />
                            </div>
                        </div>
                    </div>
                )}

                <div className="mc-content-card">
                    <h2 className="text-2xl font-extrabold mb-2" style={{ color: 'var(--text-primary)' }}>
                        Dukung Server Kami
                    </h2>
                    <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>
                        Semua hasil pembelian di store akan digunakan untuk biaya sewa server, maintanance,
                        dan juga pengembangan server agar menjadi tempat bermain yang lebih baik untuk kita semua.
                        Terima kasih atas dukunganmu!
                    </p>
                </div>
            </div>

            {/* Main Grid: Left Sidebar + Products */}
            <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 xl:gap-8 relative items-start">

                {/* Left Sidebar (Top Supporter Monthly & Recent Payments + All Time) */}
                <div className="lg:col-span-1 flex flex-col gap-6 order-2 lg:order-1">
                    <div className="mc-card p-5 flex flex-col gap-5 relative overflow-hidden" style={{ background: 'var(--bg-card)' }}>
                        {/* Decorative glow */}
                        <div className="absolute top-0 right-0 w-32 h-32 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 pointer-events-none" style={{ background: 'var(--brand-secondary)', opacity: 0.07 }}></div>

                        {/* Top Supporter Pill */}
                        <div className="rounded-xl py-3 px-4 flex items-center justify-center gap-3 relative z-10 mx-1" style={{ background: 'var(--brand-secondary)' }}>
                            <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 21h18M5 18l-1-12 5 3 3-6 3 6 5-3-1 12H5z" />
                            </svg>
                            <span className="text-white font-extrabold text-sm tracking-widest uppercase mt-[2px] text-center">Top Supporter<br /><span className="text-[10px] opacity-80">(Monthly)</span></span>
                        </div>

                        {topSupporter ? (
                            <div className="flex items-center gap-4 px-2 mt-2 relative z-10">
                                <div className="w-16 h-24 relative flex-shrink-0 flex items-start justify-center pl-1 overflow-hidden rounded-lg" style={{ background: '#f5f3f8' }}>
                                    <img src={`https://mc-heads.net/body/${topSupporter}/100`} alt={topSupporter} className="max-w-none h-[140%] object-top drop-shadow-xl absolute top-0 left-1/2 -translate-x-1/2" />
                                </div>
                                <div className="flex flex-col py-2 self-start mt-2">
                                    <h3 className="text-xl font-black tracking-tight truncate max-w-[120px]" style={{ color: 'var(--brand-secondary)' }} title={topSupporter}>{topSupporter}</h3>
                                    <p className="text-[12px] font-bold mt-1 leading-snug" style={{ color: 'var(--text-muted)' }}>Spent the most this month</p>
                                </div>
                            </div>
                        ) : (
                            <div className="py-8 text-center relative z-10">
                                <p className="text-sm font-bold" style={{ color: 'var(--text-muted)' }}>Belum ada donatur bulan ini.</p>
                            </div>
                        )}

                        {/* Recent Payments Pill */}
                        <div className="rounded-xl py-3 px-4 flex items-center justify-center gap-2 mt-1 relative z-10 mx-1" style={{ background: 'var(--brand-secondary)' }}>
                            <svg className="w-5 h-5 text-white opacity-90" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                            <span className="text-white font-extrabold text-sm tracking-wide">Recent Payments</span>
                        </div>

                        {/* Recent Payment Heads Grid */}
                        <div className="grid grid-cols-5 gap-2.5 px-2 pb-1 relative z-10">
                            {recentPayments && recentPayments.length > 0 ? recentPayments.map((player, idx) => (
                                <div key={idx} className="aspect-square rounded-[10px] overflow-hidden border hover:border-[var(--brand-secondary)] transition-colors group/head relative cursor-pointer shadow-sm" style={{ background: '#f5f3f8', borderColor: '#e8e0f0' }}>
                                    <img src={`https://mc-heads.net/avatar/${player}/64`} alt={player} className="w-full h-full object-cover opacity-90 group-hover/head:opacity-100 transition-opacity" />

                                    <div className="absolute top-0 left-1/2 -translate-x-1/2 text-white text-[10px] font-bold px-2.5 py-1.5 rounded-lg opacity-0 group-hover/head:opacity-100 transition-opacity whitespace-nowrap pointer-events-none z-20 shadow-xl" style={{ background: 'var(--brand-primary)', transform: 'translateY(-130%)' }}>
                                        {player}
                                    </div>
                                </div>
                            )) : (
                                <div className="col-span-5 text-center py-4">
                                    <p className="text-xs font-bold" style={{ color: 'var(--text-muted)' }}>Belum ada pembelian.</p>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Top Supporter All Time Box */}
                    <div className="mc-card p-5 flex flex-col gap-5 relative overflow-hidden" style={{ background: 'var(--bg-card)' }}>
                        {/* Decorative glow */}
                        <div className="absolute top-0 right-0 w-32 h-32 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 pointer-events-none" style={{ background: 'var(--brand-secondary)', opacity: 0.07 }}></div>

                        {/* Top Supporter All Time Pill */}
                        <div className="rounded-xl py-3 px-4 flex items-center justify-center gap-3 relative z-10 mx-1" style={{ background: 'var(--brand-secondary)' }}>
                            <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
                            </svg>
                            <span className="text-white font-extrabold text-sm tracking-widest uppercase mt-[2px] text-center">Top Supporter<br /><span className="text-[10px] opacity-80">(All Time)</span></span>
                        </div>

                        {topSupporterAllTime ? (
                            <div className="flex items-center gap-4 px-2 mt-2 relative z-10">
                                <div className="w-16 h-24 relative flex-shrink-0 flex items-start justify-center pl-1 overflow-hidden rounded-lg" style={{ background: '#f5f3f8' }}>
                                    <img src={`https://mc-heads.net/body/${topSupporterAllTime}/100`} alt={topSupporterAllTime} className="max-w-none h-[140%] object-top drop-shadow-xl absolute top-0 left-1/2 -translate-x-1/2" />
                                </div>
                                <div className="flex flex-col py-2 self-start mt-2">
                                    <h3 className="text-xl font-black tracking-tight truncate max-w-[120px]" style={{ color: 'var(--brand-secondary)' }} title={topSupporterAllTime}>{topSupporterAllTime}</h3>
                                    <p className="text-[12px] font-bold mt-1 leading-snug" style={{ color: 'var(--text-muted)' }}>Spent the most all time</p>
                                </div>
                            </div>
                        ) : (
                            <div className="py-8 text-center relative z-10">
                                <p className="text-sm font-bold" style={{ color: 'var(--text-muted)' }}>Belum ada donatur.</p>
                            </div>
                        )}
                    </div>
                </div>

                {/* Products Grid */}
                <div className="lg:col-span-3 order-1 lg:order-2" id="products-grid">
                    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                        {paginatedProducts.map((product) => (
                            <div
                                key={product.id}
                                className={`mc-card relative overflow-hidden transition-all duration-300 hover:-translate-y-1`}
                                style={product.popular ? { border: '2px solid var(--brand-secondary)' } : {}}
                            >
                                {/* Badge */}
                                {product.badge && (
                                    <div
                                        className="absolute top-0 right-0 font-black text-[10px] tracking-wider py-1.5 px-4 z-10"
                                        style={product.popular
                                            ? { background: 'var(--brand-secondary)', color: 'white', borderBottomLeftRadius: '12px' }
                                            : { background: '#f5f3f8', color: 'var(--text-muted)', borderBottomLeftRadius: '12px' }
                                        }
                                    >
                                        {product.badge}
                                    </div>
                                )}

                                {/* Content */}
                                <div className="p-6 flex flex-col items-center">
                                    {/* Image */}
                                    <div className="mb-4 w-32 h-32 relative flex items-center justify-center">
                                        <img
                                            src={product.image}
                                            alt={product.name}
                                            className="w-full h-full object-contain drop-shadow-xl"
                                            style={product.imageStyle}
                                        />
                                    </div>

                                    {/* Points Amount */}
                                    <div className="text-center mb-5">
                                        <h3 className="text-3xl font-black" style={{ color: 'var(--text-primary)' }}>
                                            {product.points === 500 ? (
                                                <>
                                                    {product.points.toLocaleString('id-ID')}
                                                    <br />
                                                    <span style={{ color: 'var(--brand-secondary)' }}>POINTS</span>
                                                </>
                                            ) : (
                                                <>
                                                    {product.points.toLocaleString('id-ID')} <span style={{ color: 'var(--brand-secondary)' }}>POINTS</span>
                                                </>
                                            )}
                                        </h3>
                                    </div>

                                    {/* Price */}
                                    <div className="text-center mb-5 w-full p-3 rounded-xl flex flex-col items-center justify-center gap-1" style={{ background: '#f5f3f8' }}>
                                        {Boolean(discountEnabled) && (
                                            <p className="text-sm font-bold line-through opacity-60" style={{ color: 'var(--text-muted)' }}>
                                                {product.originalPrice}
                                            </p>
                                        )}
                                        <p className="text-2xl font-black" style={{ color: 'var(--brand-secondary)' }}>
                                            {product.price}
                                        </p>
                                    </div>

                                    {/* Buy Button */}
                                    <button
                                        onClick={() => openPurchaseModal(product)}
                                        className="w-full py-3 rounded-xl font-extrabold text-sm transition-all duration-300 text-white glow-button hover:shadow-lg"
                                    >
                                        BELI SEKARANG
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Pagination */}
                    {totalPages > 1 && (
                        <div className="flex items-center justify-center gap-2 mt-8">
                            <button
                                onClick={() => { setCurrentPage(p => Math.max(1, p - 1)); document.getElementById('products-grid')?.scrollIntoView({ behavior: 'smooth', block: 'start' }) }}
                                disabled={currentPage === 1}
                                className="w-10 h-10 rounded-xl flex items-center justify-center font-extrabold text-sm transition-all disabled:opacity-30 disabled:cursor-not-allowed"
                                style={{ background: 'var(--bg-card)', color: 'var(--text-secondary)', border: '1px solid #e8e0f0' }}
                            >
                                ‹
                            </button>
                            {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
                                <button
                                    key={page}
                                    onClick={() => { setCurrentPage(page); document.getElementById('products-grid')?.scrollIntoView({ behavior: 'smooth', block: 'start' }) }}
                                    className="w-10 h-10 rounded-xl flex items-center justify-center font-extrabold text-sm transition-all"
                                    style={currentPage === page
                                        ? { background: 'var(--brand-secondary)', color: '#fff', boxShadow: '0 4px 12px rgba(226,110,16,0.3)' }
                                        : { background: 'var(--bg-card)', color: 'var(--text-secondary)', border: '1px solid #e8e0f0' }
                                    }
                                >
                                    {page}
                                </button>
                            ))}
                            <button
                                onClick={() => { setCurrentPage(p => Math.min(totalPages, p + 1)); document.getElementById('products-grid')?.scrollIntoView({ behavior: 'smooth', block: 'start' }) }}
                                disabled={currentPage === totalPages}
                                className="w-10 h-10 rounded-xl flex items-center justify-center font-extrabold text-sm transition-all disabled:opacity-30 disabled:cursor-not-allowed"
                                style={{ background: 'var(--bg-card)', color: 'var(--text-secondary)', border: '1px solid #e8e0f0' }}
                            >
                                ›
                            </button>
                        </div>
                    )}
                </div>
            </div>
        </Wrapper >
    )
}
