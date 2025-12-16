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
        gradient: 'from-emerald-500 to-teal-500',
        shadowColor: 'shadow-emerald-500/30',
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
        gradient: 'from-blue-500 to-indigo-500',
        shadowColor: 'shadow-blue-500/30',
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
        gradient: 'from-violet-500 to-purple-500',
        shadowColor: 'shadow-violet-500/30',
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
        gradient: 'from-rose-500 to-pink-500',
        shadowColor: 'shadow-rose-500/30',
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
        gradient: 'from-amber-500 to-orange-500',
        shadowColor: 'shadow-amber-500/30',
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
        gradient: 'from-cyan-500 to-teal-500',
        shadowColor: 'shadow-cyan-500/30',
        badge: '+100% BONUS',
        popular: false
    }
]

// Payment methods with Tripay channel codes
const paymentMethods = [
    {
        id: 'QRIS',
        name: 'QRIS',
        logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/a/a2/Logo_QRIS.svg/2560px-Logo_QRIS.svg.png',
        description: 'Scan QR untuk bayar'
    },
    {
        id: 'OVO',
        name: 'OVO',
        logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/e/eb/Logo_ovo_purple.svg/2560px-Logo_ovo_purple.svg.png',
        description: 'Bayar dengan OVO'
    },
    {
        id: 'DANA',
        name: 'DANA',
        logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/7/72/Logo_dana_blue.svg/2560px-Logo_dana_blue.svg.png',
        description: 'Bayar dengan DANA'
    },
    {
        id: 'BCAVA',
        name: 'BCA Virtual Account',
        logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/5/5c/Bank_Central_Asia.svg/2560px-Bank_Central_Asia.svg.png',
        description: 'Transfer via BCA VA'
    },
    {
        id: 'MANDIRIVA',
        name: 'Mandiri Virtual Account',
        logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/a/ad/Bank_Mandiri_logo_2016.svg/2560px-Bank_Mandiri_logo_2016.svg.png',
        description: 'Transfer via Mandiri VA'
    },
    {
        id: 'BNIVA',
        name: 'BNI Virtual Account',
        logo: 'https://upload.wikimedia.org/wikipedia/commons/f/f0/Bank_Negara_Indonesia_logo_%282004%29.svg',
        description: 'Transfer via BNI VA'
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
    const [selectedPaymentMethod, setSelectedPaymentMethod] = useState('')
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
        setSelectedPaymentMethod('')
        setShowPurchaseModal(true)
    }

    async function confirmPurchase() {
        if (!selectedPaymentMethod) {
            toast("Silakan pilih metode pembayaran!")
            return
        }

        setIsProcessing(true)

        try {
            // Get numeric price from product (remove 'Rp ' and '.')
            const priceString = selectedProduct.price.replace('Rp ', '').replace(/\./g, '')
            const amount = parseInt(priceString, 10)

            const response = await fetch('/api/tripay/create', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    method: selectedPaymentMethod,
                    amount: amount,
                    nickname: savedUsername,
                    gems: selectedProduct.totalGems
                })
            })

            const data = await response.json()

            if (data.success) {
                // Redirect to Tripay checkout
                window.location.href = data.data.checkout_url
            } else {
                toast(data.message || 'Gagal membuat transaksi')
            }
        } catch (err) {
            console.error('Payment error:', err)
            toast('Terjadi kesalahan. Silakan coba lagi.')
        } finally {
            setIsProcessing(false)
        }
    }

    function closePurchaseModal() {
        setShowPurchaseModal(false)
        setSelectedProduct(null)
        setSelectedPaymentMethod('')
    }

    const cleanUsername = savedUsername.replace(".", "")

    return (
        <Wrapper seo={{ title: 'Beli Gems' }}>
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
                        {/* Header */}
                        <div className="p-8 bg-gradient-to-r from-amber-500 to-orange-500">
                            <div className="w-20 h-20 mx-auto bg-white/20 rounded-full flex items-center justify-center mb-4">
                                <Icons.Clock className="h-12 w-12 text-white" />
                            </div>
                            <h3 className="text-2xl font-bold text-white">Pesanan Dibuat!</h3>
                        </div>

                        <div className="p-6 space-y-4">
                            <p className="text-gray-400">
                                Pesanan kamu telah dibuat. Setelah pembayaran dikonfirmasi, gems akan otomatis ditambahkan ke akunmu.
                            </p>

                            <div className="p-4 rounded-2xl bg-white/5 border border-white/10">
                                <p className="text-gray-500 text-sm mb-1">Nickname</p>
                                <p className="text-white font-bold text-lg">{successData.nickname}</p>
                            </div>

                            <div className="p-4 rounded-2xl bg-amber-500/10 border border-amber-500/30">
                                <p className="text-amber-400 text-sm mb-1">Gems yang dipesan</p>
                                <p className="text-white font-bold text-2xl">{successData.gems} Gems 💎</p>
                            </div>

                            <div className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/30">
                                <p className="text-rose-300 text-sm">
                                    ⚠️ Jika kamu belum membayar, gems tidak akan ditambahkan. Silakan selesaikan pembayaran.
                                </p>
                            </div>

                            <p className="text-gray-500 text-sm">
                                Jika dalam 24 jam setelah pembayaran gems belum masuk, silakan hubungi admin.
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

                            {/* Payment Method Selection */}
                            <div>
                                <label className="block text-sm font-semibold text-gray-400 mb-3">Pilih Metode Pembayaran</label>
                                <div className="space-y-3">
                                    {paymentMethods.map((method) => (
                                        <button
                                            key={method.id}
                                            onClick={() => setSelectedPaymentMethod(method.id)}
                                            className={`w-full p-4 rounded-xl border-2 transition-all duration-200 flex items-center gap-4 ${selectedPaymentMethod === method.id
                                                ? 'border-rose-500 bg-rose-500/10'
                                                : 'border-white/10 bg-white/5 hover:border-white/20 hover:bg-white/10'
                                                }`}
                                        >
                                            <div className="w-16 h-12 flex items-center justify-center bg-white rounded-lg p-2">
                                                <img
                                                    src={method.logo}
                                                    alt={method.name}
                                                    className="max-w-full max-h-full object-contain"
                                                />
                                            </div>
                                            <div className="flex-1 text-left">
                                                <p className={`font-bold ${selectedPaymentMethod === method.id ? 'text-rose-400' : 'text-white'}`}>
                                                    {method.name}
                                                </p>
                                                <p className="text-gray-500 text-sm">{method.description}</p>
                                            </div>
                                            {selectedPaymentMethod === method.id && (
                                                <div className="w-6 h-6 rounded-full bg-rose-500 flex items-center justify-center">
                                                    <Icons.CheckCircle className="h-4 w-4 text-white" />
                                                </div>
                                            )}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            {/* Confirm Button */}
                            <button
                                onClick={confirmPurchase}
                                disabled={!selectedPaymentMethod || isProcessing}
                                className={`w-full py-4 rounded-xl font-bold uppercase text-white transition-all duration-300 flex items-center justify-center gap-2 ${selectedPaymentMethod && !isProcessing
                                    ? 'glow-button hover:opacity-90 hover:shadow-lg'
                                    : 'bg-gray-700 cursor-not-allowed'
                                    }`}
                            >
                                {isProcessing ? (
                                    <>
                                        <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                        Memproses...
                                    </>
                                ) : (
                                    'Konfirmasi & Bayar'
                                )}
                            </button>

                            <p className="text-xs text-gray-500 text-center">
                                Dengan melanjutkan, kamu menyetujui <a href="https://blog.trinityindonesia.cc/2025/03/term-and-condition.html" className="text-rose-400 hover:underline">Syarat & Ketentuan</a>
                            </p>
                        </div>
                    </div>
                </div>
            )}

            {/* Hero Section */}
            <section className="relative min-h-[50vh] flex items-center overflow-hidden pt-24">
                <div className="absolute inset-0 bg-cover bg-center" style={{ backgroundImage: 'url("/vendor/bg.jpg")' }} />
                <div className="absolute inset-0 hero-gradient" />
                <div className="absolute inset-0 overflow-hidden pointer-events-none">
                    <div className="particle particle-1" /><div className="particle particle-2" /><div className="particle particle-4" />
                </div>

                <div className="container relative z-10">
                    <div className="max-w-3xl">
                        <span className="inline-block px-4 py-1.5 rounded-full text-xs font-bold uppercase bg-rose-500/10 text-rose-400 border border-rose-500/20 mb-6">Trinity Webstore</span>
                        <h1 className="text-4xl md:text-6xl font-black text-white uppercase mb-6">Beli <span className="gradient-text">Gems</span></h1>
                        <p className="text-lg text-gray-300 mb-8">Support server dan dapatkan gems untuk berbagai keuntungan in-game!</p>
                        <button onClick={() => navigator.clipboard?.writeText(config.serverIpAddress)} className="glow-button font-bold uppercase py-4 px-8 rounded-2xl inline-flex items-center gap-3 text-white">
                            <Icons.ClipboardCopy className="h-5 w-5" />
                            {config.serverIpAddress}
                        </button>
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
                                        className={`group relative rounded-2xl overflow-hidden transition-all duration-300 border border-white/5 hover:border-white/15 hover:-translate-y-2 hover:shadow-2xl ${product.popular ? 'ring-1 ring-rose-500/30' : ''}`}
                                        style={{ background: 'linear-gradient(145deg, rgba(26,26,38,0.95), rgba(18,18,26,0.98))' }}
                                    >
                                        {/* Content */}
                                        <div className="p-8">
                                            {/* Header */}
                                            <div className="flex items-center justify-between mb-6">
                                                <h3 className="text-2xl font-bold text-white group-hover:text-rose-100 transition-colors">{product.totalGems} Gems</h3>
                                                <span className={`px-3 py-1.5 rounded-full text-[11px] font-bold uppercase bg-gradient-to-r ${product.gradient} text-white opacity-90 group-hover:opacity-100 transition-opacity`}>
                                                    {product.badge}
                                                </span>
                                            </div>

                                            {/* Bonus Info */}
                                            <div className="bg-white/5 rounded-xl p-4 mb-6 border border-white/5 group-hover:border-white/10 transition-colors">
                                                <div className="flex items-center justify-between text-sm">
                                                    <span className="text-gray-400">Base</span>
                                                    <span className="text-white font-semibold">{product.baseGems} gems</span>
                                                </div>
                                                <div className="flex items-center justify-between text-sm mt-2">
                                                    <span className="text-gray-400">Bonus</span>
                                                    <span className="text-emerald-400 font-bold">+{product.bonusGems} gems</span>
                                                </div>
                                                <div className="border-t border-white/10 mt-3 pt-3">
                                                    <div className="flex items-center justify-between">
                                                        <span className="text-gray-400 text-sm">Total</span>
                                                        <span className="text-white font-bold text-lg">{product.totalGems} gems</span>
                                                    </div>
                                                </div>
                                            </div>

                                            {/* Price */}
                                            <div className="text-center mb-6">
                                                <p className="text-gray-500 line-through text-sm mb-1">{product.originalPrice}</p>
                                                <p className={`text-3xl font-black bg-gradient-to-r ${product.gradient} bg-clip-text text-transparent`}>
                                                    {product.price}
                                                </p>
                                            </div>

                                            {/* Buy Button */}
                                            <button
                                                onClick={() => openPurchaseModal(product)}
                                                disabled={!loggedIn}
                                                className={`w-full py-4 rounded-xl font-bold uppercase text-sm text-white transition-all duration-300 ${loggedIn ? `bg-gradient-to-r ${product.gradient} hover:opacity-90 hover:shadow-lg group-hover:scale-[1.02]` : 'bg-gray-700 cursor-not-allowed'}`}
                                            >
                                                {loggedIn ? 'Beli Sekarang' : 'Login untuk Beli'}
                                            </button>
                                        </div>
                                    </div>
                                ))}
                            </div>

                            {/* Discord Support Banner */}
                            <div className="mt-12 glass-card rounded-3xl p-8 border border-white/5 flex flex-col md:flex-row items-center justify-between gap-6">
                                <div className="flex items-center gap-4">
                                    <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-indigo-500/20 to-purple-500/20 flex items-center justify-center">
                                        <Icons.Support className="h-7 w-7 text-indigo-400" />
                                    </div>
                                    <div>
                                        <h3 className="font-bold text-white text-lg">Butuh Bantuan?</h3>
                                        <p className="text-gray-400">Hubungi staff kami di Discord untuk bantuan</p>
                                    </div>
                                </div>
                                <a
                                    href="https://discord.gg/6pRQmvtSEW"
                                    target="_blank"
                                    rel="noreferrer"
                                    className="px-8 py-4 rounded-xl font-bold uppercase text-white bg-gradient-to-r from-indigo-500 to-purple-500 hover:opacity-90 transition-all flex items-center gap-2"
                                >
                                    <Icons.ArrowRight className="h-5 w-5" />
                                    Join Discord
                                </a>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </Wrapper>
    )
}
