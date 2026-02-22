import { Wrapper } from '@layer/components/layout/Wrapper.jsx'
import { Icons } from '@layer/components/elements/Icons.jsx'
import { useEffect, useState } from "react"
import { useRouter } from 'next/router'
import config from '@layer/theme.config'

const products = [
    {
        id: 1,
        name: '500\n Points',
        points: 500,
        price: 'Rp 5.000',
        quantity: 1,
        badge: '',
        popular: false,
        image: '/vendor/gift1.webp',
        imageStyle: {}
    },
    {
        id: 2,
        name: '1000 Points',
        points: 1000,
        price: 'Rp 10.000',
        quantity: 2,
        badge: '',
        popular: false,
        image: '/vendor/gift2.webp',
        imageStyle: {}
    },
    {
        id: 3,
        name: '2000 Points',
        points: 2000,
        price: 'Rp 20.000',
        quantity: 4,
        badge: '',
        popular: false,
        image: '/vendor/gift3.webp',
        imageStyle: {}
    },
    {
        id: 4,
        name: '2500 Points',
        points: 2500,
        price: 'Rp 25.000',
        quantity: 5,
        badge: 'PALING LARIS!',
        popular: true,
        image: '/vendor/gift4.webp',
        imageStyle: {}
    },
    {
        id: 5,
        name: '3000 Points',
        points: 3000,
        price: 'Rp 30.000',
        quantity: 6,
        badge: '',
        popular: false,
        image: '/vendor/gift1.webp',
        imageStyle: { filter: 'hue-rotate(90deg)' }
    },
    {
        id: 6,
        name: '3500 Points',
        points: 3500,
        price: 'Rp 35.000',
        quantity: 7,
        badge: '',
        popular: false,
        image: '/vendor/gift2.webp',
        imageStyle: { filter: 'hue-rotate(180deg)' }
    }
]

export default function Store() {
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
        if (!loggedIn) {
            toast("Silakan login terlebih dahulu!")
            return
        }
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
                        <div className="p-6" style={{ background: 'linear-gradient(135deg, var(--brand-primary), var(--brand-secondary))' }}>
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
                            {/* Nickname Confirmation */}
                            <div>
                                <label className="block text-sm font-bold mb-3" style={{ color: 'var(--text-muted)' }}>Konfirmasi Nickname</label>
                                <div className="flex items-center gap-4 p-4 rounded-xl" style={{ background: '#f5f3f8' }}>
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
                        </div>
                    </div>
                </div>
            )}

            <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
                {/* Sidebar - Login/Profile */}
                <div className="lg:col-span-1">
                    <div className="sticky top-8">
                        {!loggedIn ? (
                            /* Login Card */
                            <div className="mc-card p-6">
                                <div className="flex items-center gap-3 mb-6">
                                    <div className="w-12 h-12 rounded-xl flex items-center justify-center" style={{ background: 'rgba(226, 110, 16, 0.1)' }}>
                                        <Icons.Lock className="h-6 w-6" style={{ color: 'var(--brand-secondary)' }} />
                                    </div>
                                    <div>
                                        <h3 className="font-extrabold" style={{ color: 'var(--text-primary)' }}>Login</h3>
                                        <p className="text-sm" style={{ color: 'var(--text-muted)' }}>Masukkan username</p>
                                    </div>
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
                                        {isLoading ? 'Memproses...' : 'Login'}
                                    </button>
                                </form>

                                <p className="mt-4 text-xs text-center" style={{ color: 'var(--text-muted)' }}>
                                    Dengan login, kamu menyetujui <a href="https://blog.trinityindonesia.cc/2025/03/term-and-condition.html" className="hover:underline" style={{ color: 'var(--brand-secondary)' }}>Syarat & Ketentuan</a>
                                </p>
                            </div>
                        ) : (
                            /* Profile Card */
                            <div className="mc-card p-6">
                                <div className="text-center">
                                    <div className="relative inline-block mb-4">
                                        <img
                                            src={`https://mc-heads.net/avatar/${cleanUsername}/80`}
                                            alt="Player Head"
                                            className="w-20 h-20 rounded-xl"
                                            style={{ border: '2px solid var(--brand-secondary)' }}
                                        />
                                        <div className="absolute -bottom-1 -right-1 w-6 h-6 rounded-full flex items-center justify-center" style={{ background: '#16a34a', border: '2px solid white' }}>
                                            <Icons.CheckCircle className="h-3 w-3 text-white" />
                                        </div>
                                    </div>
                                    <h3 className="font-extrabold text-lg mb-1" style={{ color: 'var(--text-primary)' }}>{savedUsername}</h3>
                                    <p className="text-sm mb-6" style={{ color: 'var(--text-muted)' }}>Logged in</p>
                                    <button
                                        onClick={logout}
                                        className="w-full py-3 px-4 rounded-xl font-bold transition-all"
                                        style={{ background: '#f5f3f8', color: 'var(--text-secondary)', border: '1px solid #e8e0f0' }}
                                    >
                                        Logout
                                    </button>
                                </div>
                            </div>
                        )}

                        {/* Info Card */}
                        <div className="mc-card p-6 mt-4">
                            <h4 className="font-extrabold mb-4 flex items-center gap-2" style={{ color: 'var(--text-primary)' }}>
                                <Icons.Sparkles className="h-5 w-5" style={{ color: 'var(--brand-secondary)' }} />
                                Info Penting
                            </h4>
                            <ul className="space-y-3 text-sm" style={{ color: 'var(--text-secondary)' }}>
                                <li className="flex items-start gap-2">
                                    <Icons.CheckCircle className="h-4 w-4 mt-0.5 shrink-0" style={{ color: '#16a34a' }} />
                                    <span>Points akan dikirim otomatis setelah pembayaran</span>
                                </li>
                                <li className="flex items-start gap-2">
                                    <Icons.CheckCircle className="h-4 w-4 mt-0.5 shrink-0" style={{ color: '#16a34a' }} />
                                    <span>Pastikan username benar sebelum membeli</span>
                                </li>
                                <li className="flex items-start gap-2">
                                    <Icons.CheckCircle className="h-4 w-4 mt-0.5 shrink-0" style={{ color: '#16a34a' }} />
                                    <span>Hubungi staff jika ada masalah</span>
                                </li>
                            </ul>
                        </div>
                    </div>
                </div>

                {/* Products Grid */}
                <div className="lg:col-span-3">
                    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
                        {products.map((product) => (
                            <div
                                key={product.id}
                                className={`mc-card relative overflow-hidden transition-all duration-300 hover:-translate-y-1 ${product.popular ? '' : ''}`}
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
                                    <div className="text-center mb-5 w-full p-3 rounded-xl" style={{ background: '#f5f3f8' }}>
                                        <p className="text-2xl font-black" style={{ color: 'var(--brand-secondary)' }}>
                                            {product.price}
                                        </p>
                                    </div>

                                    {/* Buy Button */}
                                    <button
                                        onClick={() => openPurchaseModal(product)}
                                        disabled={!loggedIn}
                                        className={`w-full py-3 rounded-xl font-extrabold text-sm transition-all duration-300 ${loggedIn ? 'text-white glow-button hover:shadow-lg' : 'cursor-not-allowed'}`}
                                        style={!loggedIn ? { background: '#e8e0f0', color: 'var(--text-muted)' } : {}}
                                    >
                                        {loggedIn ? 'BELI SEKARANG' : 'LOGIN DULU'}
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Help Card */}
                    <div className="mc-card mt-8 mb-12 overflow-hidden">
                        <div className="p-6 flex flex-col md:flex-row items-center justify-between gap-6">
                            <div className="flex items-center gap-4">
                                <div className="w-12 h-12 rounded-xl flex items-center justify-center" style={{ background: 'rgba(226, 110, 16, 0.1)' }}>
                                    <Icons.Support className="h-6 w-6" style={{ color: 'var(--brand-secondary)' }} />
                                </div>
                                <div>
                                    <h3 className="font-extrabold" style={{ color: 'var(--text-primary)' }}>BUTUH BANTUAN?</h3>
                                    <p className="text-sm" style={{ color: 'var(--text-muted)' }}>Hubungi staff kami di Discord</p>
                                </div>
                            </div>
                            <a
                                href="https://discord.gg/6pRQmvtSEW"
                                target="_blank"
                                rel="noreferrer"
                                className="mc-btn mc-btn-primary"
                            >
                                <Icons.ArrowRight className="h-4 w-4" />
                                JOIN DISCORD
                            </a>
                        </div>
                    </div>
                </div>
            </div>
        </Wrapper>
    )
}
