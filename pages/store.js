import { Wrapper } from '@layer/components/layout/Wrapper.jsx'
import { Icons } from '@layer/components/elements/Icons.jsx'
import { useEffect, useState } from "react"
import { useRouter } from 'next/router'
import config from '@layer/theme.config'

const products = [
    {
        id: 1,
        name: '5 Gems',
        baseGems: 3,
        bonusGems: 2,
        totalGems: 5,
        price: 'Rp 5.000',
        originalPrice: 'Rp 8.000',
        quantity: 5,
        gradient: 'from-red-600 to-red-500',
        shadowColor: 'shadow-red-500/30',
        badge: '+67% BONUS',
        popular: false
    },
    {
        id: 2,
        name: '10 Gems',
        baseGems: 7,
        bonusGems: 3,
        totalGems: 10,
        price: 'Rp 10.000',
        originalPrice: 'Rp 15.000',
        quantity: 10,
        gradient: 'from-red-600 to-red-500',
        shadowColor: 'shadow-red-500/30',
        badge: '+43% BONUS',
        popular: false
    },
    {
        id: 3,
        name: '25 Gems',
        baseGems: 15,
        bonusGems: 10,
        totalGems: 25,
        price: 'Rp 25.000',
        originalPrice: 'Rp 40.000',
        quantity: 25,
        gradient: 'from-red-600 to-red-500',
        shadowColor: 'shadow-red-500/30',
        badge: '+67% BONUS',
        popular: false
    },
    {
        id: 4,
        name: '50 Gems',
        baseGems: 25,
        bonusGems: 25,
        totalGems: 50,
        price: 'Rp 50.000',
        originalPrice: 'Rp 100.000',
        quantity: 50,
        gradient: 'from-red-600 to-red-500',
        shadowColor: 'shadow-red-500/30',
        badge: 'BEST VALUE',
        popular: true
    },
    {
        id: 5,
        name: '100 Gems',
        baseGems: 60,
        bonusGems: 40,
        totalGems: 100,
        price: 'Rp 100.000',
        originalPrice: 'Rp 165.000',
        quantity: 100,
        gradient: 'from-red-600 to-red-500',
        shadowColor: 'shadow-red-500/30',
        badge: '+67% BONUS',
        popular: false
    },
    {
        id: 6,
        name: '250 Gems',
        baseGems: 125,
        bonusGems: 125,
        totalGems: 250,
        price: 'Rp 250.000',
        originalPrice: 'Rp 500.000',
        quantity: 250,
        gradient: 'from-red-600 to-red-500',
        shadowColor: 'shadow-red-500/30',
        badge: '+100% BONUS',
        popular: false
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
    const [isProcessing, setIsProcessing] = useState(false)

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

        // Check for payment success from URL
        if (router.query.status === 'success') {
            const merchantRef = router.query.tripay_merchant_ref || ''
            // Parse merchant_ref: GEMS-{timestamp}-{nickname}-{gems}
            const parts = merchantRef.split('-')
            if (parts.length >= 4) {
                const gems = parts.pop()
                const nickname = parts.slice(2).join('-')
                setSuccessData({ nickname, gems })
                setShowSuccessModal(true)
            }
            // Clear URL params
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

        // Validate referral if provided
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

        // Validate username
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
        const url = `https://trakteer.id/trinity-indonesia/tip/?open=true&step=2&quantity=${quantity}&display_name=${encodeURIComponent(savedUsername)}&unit=gems`
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
        <Wrapper seo={{ 
            title: 'Beli Gems',
            description: 'Beli Gems Trinity Indonesia untuk mendapatkan keuntungan in-game. Proses cepat, aman, dan berbagai pilihan paket menarik.',
            path: '/store'
        }}>
            {/* Toast */}
            <div className={`${toastVisible ? 'translate-y-0 opacity-100 scale-100' : 'translate-y-4 opacity-0 scale-95'} fixed right-6 bottom-6 z-50 glass-card px-6 py-4 rounded-2xl shadow-2xl transition-all duration-300 border border-emerald-500/30`}>
                <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-emerald-500/20 flex items-center justify-center">
                        <Icons.CheckCircle className="h-5 w-5 text-emerald-400" />
                    </div>
                    <p className="text-white font-semibold">{toastMsg}</p>
                </div>
            </div>

            {/* Loading Overlay */}
            {isLoading && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm">
                    <div className="w-12 h-12 border-4 border-rose-500/30 border-t-rose-500 rounded-full animate-spin" />
                </div>
            )}

            {/* Payment Success Modal */}
            {showSuccessModal && successData && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
                    <div className="w-full max-w-md glass-card rounded-3xl border border-white/10 overflow-hidden text-center">
                        {/* Success Header */}
                        <div className="p-8 bg-gradient-to-r from-emerald-500 to-emerald-600">
                            <div className="w-20 h-20 mx-auto bg-white/20 rounded-full flex items-center justify-center mb-4">
                                <Icons.CheckCircle className="h-12 w-12 text-white" />
                            </div>
                            <h3 className="text-2xl font-bold text-white">Pembayaran Berhasil!</h3>
                        </div>

                        <div className="p-6 space-y-4">
                            <p className="text-gray-400">
                                Terima kasih sudah membeli gems di Trinity Indonesia!
                            </p>

                            <div className="p-4 rounded-2xl bg-white/5 border border-white/10">
                                <p className="text-gray-500 text-sm mb-1">Nickname</p>
                                <p className="text-white font-bold text-lg">{successData.nickname}</p>
                            </div>

                            <div className="p-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/30">
                                <p className="text-emerald-400 text-sm mb-1">Gems yang dibeli</p>
                                <p className="text-white font-bold text-2xl">{successData.gems} Gems 💎</p>
                            </div>

                            <p className="text-gray-500 text-sm">
                                Gems kamu akan segera ditambahkan ke akun. Jika dalam 24 jam gems belum masuk, silakan hubungi admin.
                            </p>

                            <button
                                onClick={() => setShowSuccessModal(false)}
                                className="w-full py-4 rounded-xl font-bold uppercase text-white glow-button hover:opacity-90 transition-all"
                            >
                                Tutup
                            </button>
                        </div>
                    </div>
                </div>
            )}


            {/* Purchase Confirmation Modal */}
            {showPurchaseModal && selectedProduct && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm" onClick={closePurchaseModal}>
                    <div
                        className="w-full max-w-lg glass-card rounded-3xl border border-white/10 overflow-hidden max-h-[90vh] overflow-y-auto modal-scroll"
                        onClick={(e) => e.stopPropagation()}
                    >
                        {/* Modal Header */}
                        <div className="p-6 bg-gradient-to-r from-rose-500 to-rose-600">
                            <div className="flex items-center justify-between">
                                <div>
                                    <h3 className="text-2xl font-bold text-white">Konfirmasi Pembelian</h3>
                                    <p className="text-white/80 text-sm mt-1">{selectedProduct.totalGems} Gems - {selectedProduct.price}</p>
                                </div>
                                <button
                                    onClick={closePurchaseModal}
                                    className="w-10 h-10 rounded-xl bg-white/20 flex items-center justify-center hover:bg-white/30 transition-colors"
                                >
                                    <Icons.X className="h-5 w-5 text-white" />
                                </button>
                            </div>
                        </div>

                        <div className="p-6 space-y-6">
                            {/* Nickname Confirmation */}
                            <div>
                                <label className="block text-sm font-semibold text-gray-400 mb-3">Konfirmasi Nickname</label>
                                <div className="flex items-center gap-4 p-4 rounded-2xl bg-white/5 border border-white/10">
                                    <img
                                        src={`https://mc-heads.net/avatar/${cleanUsername}/56`}
                                        alt="Player Head"
                                        className="w-14 h-14 rounded-xl border-2 border-rose-500/30"
                                    />
                                    <div>
                                        <p className="text-white font-bold text-lg">{savedUsername}</p>
                                        <p className="text-gray-500 text-sm">{platform === 'java' ? 'Java Edition' : 'Bedrock Edition'}</p>
                                    </div>
                                </div>
                            </div>

                            {/* Important Warnings */}
                            <div className="space-y-3">
                                <div className="p-4 rounded-xl bg-rose-500/10 border border-rose-500/30">
                                    <div className="flex items-start gap-3">
                                        <div className="w-8 h-8 rounded-lg bg-rose-500/20 flex items-center justify-center flex-shrink-0">
                                            <Icons.Ban className="h-5 w-5 text-rose-400" />
                                        </div>
                                        <div>
                                            <p className="text-rose-300 font-semibold text-sm">JANGAN centang "Dukungan sebagai anonim"!</p>
                                            <p className="text-rose-300/70 text-xs mt-1">Jika kamu centang anonim, gems tidak akan terkirim karena nickname tidak terbaca.</p>
                                        </div>
                                    </div>
                                </div>
                                <div className="p-4 rounded-xl bg-amber-500/10 border border-amber-500/30">
                                    <div className="flex items-start gap-3">
                                        <div className="w-8 h-8 rounded-lg bg-amber-500/20 flex items-center justify-center flex-shrink-0">
                                            <Icons.ExclamationCircle className="h-5 w-5 text-amber-400" />
                                        </div>
                                        <div>
                                            <p className="text-amber-300 font-semibold text-sm">Pastikan nickname & platform sudah benar!</p>
                                            <p className="text-amber-300/70 text-xs mt-1">Jika nickname/platform salah, tidak ada refund. Silakan logout dan login ulang dengan nickname yang benar.</p>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Agreement Checkbox */}
                            <button
                                type="button"
                                onClick={() => setAgreedToTerms(!agreedToTerms)}
                                className={`flex items-center gap-4 p-4 rounded-xl border-2 cursor-pointer transition-all duration-200 text-left ${agreedToTerms
                                    ? 'bg-rose-500/10 border-rose-500/50'
                                    : 'bg-white/5 border-white/10 hover:bg-white/10 hover:border-white/20'
                                    }`}
                            >
                                <div className={`w-6 h-6 rounded-md flex items-center justify-center flex-shrink-0 transition-all duration-200 ${agreedToTerms
                                    ? 'bg-rose-500'
                                    : 'bg-white/10 border-2 border-white/20'
                                    }`}>
                                    {agreedToTerms && (
                                        <Icons.CheckCircle className="h-4 w-4 text-white" />
                                    )}
                                </div>
                                <span className="text-gray-400 text-sm leading-relaxed">
                                    Saya sudah membaca dan menyetujui <a href="/rules" className="text-rose-400 hover:underline font-semibold" onClick={(e) => e.stopPropagation()}>Syarat dan Ketentuan</a>
                                </span>
                            </button>

                            {/* Confirm Button */}
                            <button
                                onClick={confirmPurchase}
                                disabled={!agreedToTerms}
                                className={`w-full py-4 rounded-xl font-bold uppercase text-white transition-all duration-300 flex items-center justify-center gap-2 ${agreedToTerms
                                    ? 'glow-button hover:opacity-90 hover:shadow-lg'
                                    : 'bg-gray-700 cursor-not-allowed'
                                    }`}
                            >
                                Lanjutkan ke Pembayaran
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Hero Section */}
            <section className="relative min-h-[40vh] flex items-center pt-24 border-b border-red-900/30 bg-black overflow-hidden">
                <div className="absolute inset-0 bg-grid opacity-20" />
                <div className="absolute inset-0 bg-gradient-to-b from-transparent to-[var(--surface-900)]"></div>

                <div className="container relative z-10">
                    <div className="max-w-4xl mx-auto text-center">
                        <div className="flex items-center justify-center gap-3 mb-4">
                            <div className="h-px w-8 bg-red-500"></div>
                            <p className="text-xs font-mono text-red-500 uppercase tracking-[0.3em]">TRINITY WEBSTORE</p>
                            <div className="h-px w-8 bg-red-500"></div>
                        </div>
                        <h1 className="text-5xl md:text-7xl font-black text-white uppercase mb-6 leading-none glitch-effect">
                            BUY GEMS
                        </h1>
                        <p className="text-lg text-gray-500 font-mono max-w-2xl mx-auto">
                            Support server dan dapatkan gems untuk berbagai keuntungan in-game!
                        </p>
                    </div>
                </div>
            </section>

            {/* Main Content */}
            <section className="py-16 relative" style={{ background: 'var(--surface-900)' }}>
                <div className="container">
                    <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
                        {/* Sidebar - Login/Profile */}
                        <div className="lg:col-span-1">
                            <div className="sticky top-28">
                                {!loggedIn ? (
                                    /* Login Card */
                                    <div className="glass-card rounded-3xl p-6 border border-white/5">
                                        <div className="flex items-center gap-3 mb-6">
                                            <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-rose-500/20 to-orange-500/20 flex items-center justify-center">
                                                <Icons.Lock className="h-6 w-6 text-rose-400" />
                                            </div>
                                            <div>
                                                <h3 className="font-bold text-white">Login</h3>
                                                <p className="text-sm text-gray-500">Masukkan username</p>
                                            </div>
                                        </div>

                                        {error && (
                                            <div className="mb-4 p-4 rounded-xl bg-red-500/10 border border-red-500/20">
                                                <p className="text-sm text-red-400">{error}</p>
                                            </div>
                                        )}

                                        <form onSubmit={handleLogin} className="space-y-4">
                                            {/* Username Input */}
                                            <div className="relative">
                                                <input
                                                    type="text"
                                                    placeholder="Username"
                                                    value={username}
                                                    onChange={(e) => setUsername(e.target.value)}
                                                    required
                                                    className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder-gray-500 focus:border-rose-500/50 focus:outline-none transition-all"
                                                />
                                                <div className="absolute right-2 top-1/2 -translate-y-1/2 flex items-center gap-2">
                                                    <span className={`text-xs font-bold px-2 py-1 rounded-lg ${platform === 'java' ? 'bg-emerald-500/20 text-emerald-400' : 'bg-blue-500/20 text-blue-400'}`}>
                                                        {platform === 'java' ? 'Java' : 'Bedrock'}
                                                    </span>
                                                </div>
                                            </div>

                                            {/* Platform Toggle */}
                                            <div className="flex items-center justify-between p-3 rounded-xl bg-white/5 border border-white/10">
                                                <span className="text-sm text-gray-400">Platform</span>
                                                <button
                                                    type="button"
                                                    onClick={() => setPlatform(p => p === 'java' ? 'bedrock' : 'java')}
                                                    className={`relative w-14 h-7 rounded-full transition-all ${platform === 'bedrock' ? 'bg-blue-500' : 'bg-emerald-500'}`}
                                                >
                                                    <span className={`absolute top-1 w-5 h-5 rounded-full bg-white transition-all ${platform === 'bedrock' ? 'left-8' : 'left-1'}`} />
                                                </button>
                                            </div>

                                            {/* Referral Input */}
                                            <input
                                                type="text"
                                                placeholder="Referral Code (Opsional)"
                                                value={referral}
                                                onChange={(e) => setReferral(e.target.value)}
                                                className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder-gray-500 focus:border-rose-500/50 focus:outline-none transition-all"
                                            />

                                            {/* Submit Button */}
                                            <button
                                                type="submit"
                                                disabled={isLoading}
                                                className="w-full glow-button font-bold uppercase py-4 rounded-xl text-white disabled:opacity-50 disabled:cursor-not-allowed"
                                            >
                                                {isLoading ? 'Memproses...' : 'Login'}
                                            </button>
                                        </form>

                                        <p className="mt-4 text-xs text-gray-500 text-center">
                                            Dengan login, kamu menyetujui <a href="https://blog.trinityindonesia.cc/2025/03/term-and-condition.html" className="text-rose-400 hover:underline">Syarat & Ketentuan</a>
                                        </p>
                                    </div>
                                ) : (
                                    /* Profile Card */
                                    <div className="glass-card rounded-3xl p-6 border border-white/5">
                                        <div className="text-center">
                                            <div className="relative inline-block mb-4">
                                                <img
                                                    src={`https://mc-heads.net/avatar/${cleanUsername}/80`}
                                                    alt="Player Head"
                                                    className="w-20 h-20 rounded-2xl border-2 border-rose-500/30"
                                                />
                                                <div className="absolute -bottom-1 -right-1 w-6 h-6 rounded-full bg-emerald-500 flex items-center justify-center border-2 border-[var(--surface-900)]">
                                                    <Icons.CheckCircle className="h-3 w-3 text-white" />
                                                </div>
                                            </div>
                                            <h3 className="font-bold text-white text-lg mb-1">{savedUsername}</h3>
                                            <p className="text-sm text-gray-500 mb-6">Logged in</p>
                                            <button
                                                onClick={logout}
                                                className="w-full py-3 px-4 rounded-xl bg-white/5 border border-white/10 text-gray-400 hover:text-white hover:bg-white/10 hover:border-white/20 transition-all font-semibold"
                                            >
                                                Logout
                                            </button>
                                        </div>
                                    </div>
                                )}

                                {/* Info Card */}
                                <div className="glass-card rounded-3xl p-6 border border-white/5 mt-6">
                                    <h4 className="font-bold text-white mb-4 flex items-center gap-2">
                                        <Icons.Sparkles className="h-5 w-5 text-rose-400" />
                                        Info Penting
                                    </h4>
                                    <ul className="space-y-3 text-sm text-gray-400">
                                        <li className="flex items-start gap-2">
                                            <Icons.CheckCircle className="h-4 w-4 text-emerald-400 mt-0.5 shrink-0" />
                                            <span>Gems akan dikirim otomatis setelah pembayaran</span>
                                        </li>
                                        <li className="flex items-start gap-2">
                                            <Icons.CheckCircle className="h-4 w-4 text-emerald-400 mt-0.5 shrink-0" />
                                            <span>Pastikan username benar sebelum membeli</span>
                                        </li>
                                        <li className="flex items-start gap-2">
                                            <Icons.CheckCircle className="h-4 w-4 text-emerald-400 mt-0.5 shrink-0" />
                                            <span>Hubungi staff jika ada masalah</span>
                                        </li>
                                    </ul>
                                </div>
                            </div>
                        </div>

                        {/* Products Grid */}
                        <div className="lg:col-span-3">
                            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                            {products.map((product) => (
                                    <div
                                        key={product.id}
                                        className={`group relative overflow-hidden transition-all duration-300 border hover:border-red-500/50 hover:-translate-y-1 ${product.popular ? 'border-red-500/50 bg-red-900/10' : 'border-white/10 bg-black'}`}
                                    >
                                        {/* Classified Header */}
                                        <div className="bg-red-900/30 border-b border-red-900/50 px-4 py-2 flex items-center justify-between">
                                            <div className="flex items-center gap-2">
                                                <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse"></div>
                                                <span className="text-[10px] font-mono text-red-500 uppercase tracking-widest">PAKET #{String(product.id).padStart(3, '0')}</span>
                                            </div>
                                            <span className="text-[10px] font-mono text-red-400 uppercase px-2 py-0.5 border border-red-500/50 bg-red-900/20">
                                                {product.badge}
                                            </span>
                                        </div>

                                        {/* Content */}
                                        <div className="p-6">
                                            {/* Gems Amount */}
                                            <div className="text-center mb-6">
                                                <p className="text-[10px] font-mono text-gray-500 uppercase tracking-widest mb-1">TOTAL GEMS</p>
                                                <h3 className="text-3xl font-black font-mono text-white uppercase tracking-tight">
                                                    {product.totalGems} <span className="text-red-500">GEMS</span>
                                                </h3>
                                            </div>

                                            {/* Intel Data */}
                                            <div className="border border-white/10 bg-white/5 mb-6">
                                                <div className="border-b border-white/10 px-4 py-2 flex items-center justify-between">
                                                    <span className="text-[10px] font-mono text-gray-500 uppercase">GEMS DASAR</span>
                                                    <span className="text-sm font-mono text-white">{product.baseGems} GEMS</span>
                                                </div>
                                                <div className="border-b border-white/10 px-4 py-2 flex items-center justify-between">
                                                    <span className="text-[10px] font-mono text-gray-500 uppercase">BONUS</span>
                                                    <span className="text-sm font-mono text-red-400">+{product.bonusGems} GEMS</span>
                                                </div>
                                                <div className="px-4 py-2 flex items-center justify-between bg-red-900/20">
                                                    <span className="text-[10px] font-mono text-red-400 uppercase">TOTAL</span>
                                                    <span className="text-sm font-mono text-white font-bold">{product.totalGems} GEMS</span>
                                                </div>
                                            </div>

                                            {/* Price */}
                                            <div className="text-center mb-6 border border-white/10 py-4 bg-black">
                                                <p className="text-gray-600 line-through text-xs font-mono mb-1">{product.originalPrice}</p>
                                                <p className="text-2xl font-black font-mono text-red-500">
                                                    {product.price}
                                                </p>
                                            </div>

                                            {/* Buy Button */}
                                            <button
                                                onClick={() => openPurchaseModal(product)}
                                                disabled={!loggedIn}
                                                className={`w-full py-3 font-bold uppercase text-xs font-mono tracking-widest transition-all duration-300 border ${loggedIn ? 'bg-red-600 hover:bg-red-700 text-white border-red-500 hover:border-red-400 shadow-[0_0_10px_rgba(220,38,38,0.3)]' : 'bg-gray-900 text-gray-600 border-gray-700 cursor-not-allowed'}`}
                                            >
                                                {loggedIn ? '[ BELI SEKARANG ]' : '[ LOGIN DULU ]'}
                                            </button>
                                        </div>

                                        {/* Scan line effect */}
                                        <div className="absolute inset-0 pointer-events-none opacity-5 bg-[repeating-linear-gradient(0deg,transparent,transparent_2px,rgba(255,255,255,0.03)_2px,rgba(255,255,255,0.03)_4px)]"></div>
                                    </div>
                                ))}
                            </div>

                            <div className="mt-12 border border-red-900/30 bg-black">
                                <div className="bg-red-900/30 border-b border-red-900/50 px-4 py-2">
                                    <span className="text-[10px] font-mono text-red-500 uppercase tracking-widest">BANTUAN</span>
                                </div>
                                <div className="p-6 flex flex-col md:flex-row items-center justify-between gap-6">
                                    <div className="flex items-center gap-4">
                                        <div className="w-12 h-12 border border-red-500/30 bg-red-900/20 flex items-center justify-center">
                                            <Icons.Support className="h-6 w-6 text-red-500" />
                                        </div>
                                        <div>
                                            <h3 className="font-bold font-mono text-white uppercase">BUTUH BANTUAN?</h3>
                                            <p className="text-gray-500 text-sm font-mono">Hubungi staff kami di Discord</p>
                                        </div>
                                    </div>
                                    <a
                                        href="https://discord.gg/6pRQmvtSEW"
                                        target="_blank"
                                        rel="noreferrer"
                                        className="px-6 py-3 font-bold uppercase text-xs font-mono tracking-widest text-white bg-red-600 hover:bg-red-700 border border-red-500 hover:border-red-400 shadow-[0_0_10px_rgba(220,38,38,0.3)] transition-all flex items-center gap-2"
                                    >
                                        <Icons.ArrowRight className="h-4 w-4" />
                                        [ JOIN DISCORD ]
                                    </a>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </Wrapper>
    )
}
