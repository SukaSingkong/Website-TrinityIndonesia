import { Wrapper } from '@layer/components/layout/Wrapper.jsx'
import { Icons } from '@layer/components/elements/Icons.jsx'
import { useEffect, useState } from "react"
import { useRouter } from 'next/router'
import config from '@layer/theme.config'

function CountdownTimer({ targetDate, onExpire }) {
    const [timeLeft, setTimeLeft] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 });
    const [isClient, setIsClient] = useState(false);
    const [expired, setExpired] = useState(false);

    useEffect(() => {
        setIsClient(true);
        if (!targetDate) return;
        const target = new Date(targetDate).getTime();

        const updateTimer = () => {
            const now = new Date().getTime();
            const difference = target - now;
            if (difference <= 0) {
                setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0 });
                if (!expired) {
                    setExpired(true);
                    if (onExpire) onExpire();
                }
                return;
            }
            setTimeLeft({
                days: Math.floor(difference / (1000 * 60 * 60 * 24)),
                hours: Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
                minutes: Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60)),
                seconds: Math.floor((difference % (1000 * 60)) / 1000)
            });
        };

        updateTimer();
        const interval = setInterval(updateTimer, 1000);
        return () => clearInterval(interval);
    }, [targetDate]);

    if (!targetDate || !isClient || expired) return null;
    const f = (n) => n.toString().padStart(2, '0');

    const TimeBox = ({ value, label }) => (
        <div className="flex flex-col items-center">
            <div className="w-12 h-12 md:w-14 md:h-14 rounded-xl flex items-center justify-center font-black text-xl md:text-2xl text-white"
                style={{ background: 'rgba(8,15,40,0.7)', backdropFilter: 'blur(10px)', border: '1px solid rgba(255,255,255,0.2)', boxShadow: '0 4px 16px rgba(0,0,0,0.5)' }}>
                {f(value)}
            </div>
            <span className="text-[9px] font-bold text-white/80 mt-1.5 uppercase tracking-widest" style={{ textShadow: '0 1px 4px rgba(0,0,0,0.8)' }}>{label}</span>
        </div>
    );

    const Separator = () => (
        <span className="text-white/30 font-black text-xl md:text-2xl pb-3">:</span>
    );

    return (
        <div className="inline-flex items-center gap-2 md:gap-3 mt-5">
            {timeLeft.days > 0 && <>
                <TimeBox value={timeLeft.days} label="Hari" />
                <Separator />
            </>}
            <TimeBox value={timeLeft.hours} label="Jam" />
            <Separator />
            <TimeBox value={timeLeft.minutes} label="Menit" />
            <Separator />
            <TimeBox value={timeLeft.seconds} label="Detik" />
        </div>
    );
}

export default function Store() {
    const [storeData, setStoreData] = useState(null)
    const [isFetching, setIsFetching] = useState(true)

    const { storeSettings, storeProducts, topSupporter, topSupporterPoints, topSupporterAllTime, topSupporterAllTimePoints, recentPayments } = storeData || {};
    const { event_name: event, discount_enabled: discountEnabled } = storeSettings || {};
    const products = storeProducts || [];

    const [username, setUsername] = useState('')
    const [referral, setReferral] = useState('')
    const [platform, setPlatform] = useState('java')
    const [loggedIn, setLoggedIn] = useState(false)
    const [savedUsername, setSavedUsername] = useState('')
    const [isProcessing, setIsProcessing] = useState(false)
    const [error, setError] = useState('')
    const [toasts, setToasts] = useState([])

    // Purchase modal states
    const [showPurchaseModal, setShowPurchaseModal] = useState(false)
    const [selectedProduct, setSelectedProduct] = useState(null)
    const [agreedToTerms, setAgreedToTerms] = useState(false)
    const [paymentMethod, setPaymentMethod] = useState('qris')
    const [selectedCountry, setSelectedCountry] = useState('indonesia')



    const paymentMethodsByCountry = {
        indonesia: [
            { id: 'qris', label: 'QRIS', logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/a/a2/Logo_QRIS.svg/1920px-Logo_QRIS.svg.png' },
            { id: 'gopay', label: 'GoPay', logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/8/86/Gopay_logo.svg/1920px-Gopay_logo.svg.png' },
            { id: 'paypal', label: 'PayPal', logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/b/b5/PayPal.svg/1920px-PayPal.svg.png' }
        ],
        malaysia: [
            { id: 'qris', label: 'QRIS', logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/a/a2/Logo_QRIS.svg/1920px-Logo_QRIS.svg.png' },
            { id: 'paypal', label: 'PayPal', logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/b/b5/PayPal.svg/1920px-PayPal.svg.png' },
            { id: 'touchngo', label: "Touch 'n Go", logo: 'https://upload.wikimedia.org/wikipedia/commons/1/1a/Touch_%27n_Go_logo.svg' },
            { id: 'shopeepay', label: 'ShopeePay', logo: 'https://fintechid-bucket.s3.ap-southeast-3.amazonaws.com/aftech/assets/files/shares/logo/logofi2/ShopeePay.png' },
            { id: 'grabpay', label: 'GrabPay', logo: 'https://brandlogos.net/wp-content/uploads/2025/11/grabpay_vertical-logo_brandlogos.net_ptzen.png' }
        ],
        singapore: [
            { id: 'qris', label: 'QRIS', logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/a/a2/Logo_QRIS.svg/1920px-Logo_QRIS.svg.png' },
            { id: 'paypal', label: 'PayPal', logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/b/b5/PayPal.svg/1920px-PayPal.svg.png' }
        ],
        united_states: [
            { id: 'paypal', label: 'PayPal', logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/b/b5/PayPal.svg/1920px-PayPal.svg.png' }
        ]
    }

    const availablePaymentMethods = paymentMethodsByCountry[selectedCountry] || paymentMethodsByCountry.indonesia


    // Pagination
    const PRODUCTS_PER_PAGE = 6
    const [currentPage, setCurrentPage] = useState(1)
    const totalPages = Math.ceil(products.length / PRODUCTS_PER_PAGE)
    const paginatedProducts = products.slice((currentPage - 1) * PRODUCTS_PER_PAGE, currentPage * PRODUCTS_PER_PAGE)

    // Success modal state
    const [showSuccessModal, setShowSuccessModal] = useState(false)
    const [successData, setSuccessData] = useState(null)
    const router = useRouter()



    async function fetchStore() {
        try {
            const res = await fetch('/api/store')
            const data = await res.json()
            setStoreData(data)
        } catch (err) {
            console.error("Failed to load store data", err)
        } finally {
            setIsFetching(false)
        }
    }

    useEffect(() => {
        const stored = localStorage.getItem("mcUsername")
        if (stored) {
            setSavedUsername(stored)
            setLoggedIn(true)
        }



        fetchStore()

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
        const id = Date.now()
        setToasts(prev => [...prev, { id, msg }])
        setTimeout(() => removeToast(id), 3000)
    }

    function removeToast(id) {
        setToasts(prev => prev.filter(t => t.id !== id))
    }

    async function handleLogin(e) {
        e.preventDefault()
        setError('')
        setIsProcessing(true)

        let finalUsername = username.trim()
        if (finalUsername.includes(".")) {
            setError("Username tidak boleh mengandung karakter titik (.)")
            setIsProcessing(false)
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
                    setIsProcessing(false)
                    return
                }
            } catch {
                setError("Gagal memverifikasi referral code. Coba lagi nanti.")
                setIsProcessing(false)
                return
            }
        }

        try {
            const response = await fetch("/api/validate-player", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ username: finalUsername })
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

        setIsProcessing(false)
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

    async function confirmPurchase() {
        if (!agreedToTerms) {
            toast("Silakan centang persetujuan syarat dan ketentuan!")
            return
        }

        if (!selectedProduct) return

        setIsProcessing(true)

        const { discount_enabled: de, base_price_per_500: basePrice, discount_percentage: dp } = storeSettings || { discount_enabled: 0, base_price_per_500: 1000, discount_percentage: 0 };
        const pricePerUnit = de ? basePrice * (1 - (dp / 100)) : basePrice;
        const subtotal = selectedProduct.quantity * pricePerUnit;
        const serviceFee = 1000;
        const totalAmount = subtotal + serviceFee;

        try {
            const response = await fetch('/api/tako-checkout', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    name: savedUsername,
                    amount: totalAmount,
                    paymentMethod: paymentMethod
                })
            });

            const data = await response.json();

            if (data.success && data.paymentUrl) {
                window.location.href = data.paymentUrl;
                closePurchaseModal()
            } else {
                toast(data.message || "Gagal membuat link pembayaran Tako!");
            }
        } catch (error) {
            toast("Terjadi kesalahan sistem saat memproses pembayaran.");
        } finally {
            setIsProcessing(false)
        }
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
            {/* Toasts Container */}
            <div className="fixed left-6 top-6 z-50 flex flex-col gap-3">
                {toasts.map(t => (
                    <div
                        key={t.id}
                        className="mc-card px-6 py-4 shadow-xl transition-all duration-300 animate-slide-in-left relative pr-12"
                        style={{ borderLeft: '4px solid #16a34a' }}
                    >
                        <div className="flex items-center gap-3">
                            <div className="w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0" style={{ background: '#dcfce7' }}>
                                <Icons.CheckCircle className="h-5 w-5" style={{ color: '#16a34a' }} />
                            </div>
                            <p className="font-bold text-sm" style={{ color: 'var(--text-primary)' }}>{t.msg}</p>
                        </div>
                        <button
                            onClick={() => removeToast(t.id)}
                            className="absolute right-4 top-1/2 -translate-y-1/2 rounded-full p-1 opacity-50 hover:opacity-100 hover:bg-gray-100 transition-all"
                        >
                            <Icons.X className="w-4 h-4" />
                        </button>
                    </div>
                ))}
            </div>

            {isProcessing && (
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
                                            disabled={isProcessing}
                                            className="w-full glow-button font-extrabold py-4 rounded-xl text-white disabled:opacity-50 disabled:cursor-not-allowed"
                                        >
                                            {isProcessing ? 'Memproses...' : 'Login & Lanjutkan'}
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
                                    <div className="space-y-3 mb-6">
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

                                    {/* Country Selection */}
                                    <div className="mb-6">
                                        <label className="block text-sm font-bold mb-3" style={{ color: 'var(--text-muted)' }}>Pilih Negara Pembayaran</label>
                                        <div className="relative">
                                            <select
                                                value={selectedCountry}
                                                onChange={(e) => {
                                                    const newCountry = e.target.value;
                                                    setSelectedCountry(newCountry);
                                                    setPaymentMethod(paymentMethodsByCountry[newCountry][0].id);
                                                }}
                                                className="mc-input appearance-none pr-10"
                                                style={{ background: '#f5f3f8' }}
                                            >
                                                <option value="indonesia">Indonesia</option>
                                                <option value="malaysia">Malaysia</option>
                                                <option value="singapore">Singapore</option>
                                                <option value="united_states">United States</option>
                                            </select>
                                            <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none">
                                                <Icons.ChevronDown className="h-5 w-5" style={{ color: 'var(--text-muted)' }} />
                                            </div>
                                        </div>
                                    </div>

                                    {/* Payment Method Selection */}
                                    <div>
                                        <label className="block text-sm font-bold mb-3" style={{ color: 'var(--text-muted)' }}>Pilih Metode Pembayaran</label>
                                        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
                                            {availablePaymentMethods.map((method) => (
                                                <button
                                                    key={method.id}
                                                    type="button"
                                                    onClick={() => setPaymentMethod(method.id)}
                                                    className={`py-3 px-4 rounded-xl flex items-center justify-center transition-all bg-white border-2 ${paymentMethod === method.id ? 'shadow-md scale-105 opacity-100 ring-2 ring-offset-2' : 'opacity-60 hover:opacity-100'}`}
                                                    style={{
                                                        borderColor: paymentMethod === method.id ? 'var(--brand-secondary)' : '#e8e0f0',
                                                        ringColor: 'var(--brand-secondary)'
                                                    }}
                                                    title={method.label}
                                                >
                                                    <div className="h-6 w-full flex items-center justify-center">
                                                        <img src={method.logo} alt={method.label} className="max-h-full max-w-full object-contain" />
                                                    </div>
                                                </button>
                                            ))}
                                        </div>
                                    </div>



                                    <div className="p-4 rounded-xl space-y-3" style={{ background: '#f5f3f8' }}>
                                        <div className="flex justify-between items-center text-sm">
                                            <span style={{ color: 'var(--text-muted)' }}>Subtotal</span>
                                            <span className="font-bold" style={{ color: 'var(--text-primary)' }}>
                                                Rp {(selectedProduct.quantity * (storeSettings?.discount_enabled ? storeSettings?.base_price_per_500 * (1 - (storeSettings?.discount_percentage / 100)) : storeSettings?.base_price_per_500 || 1000)).toLocaleString('id-ID')}
                                            </span>
                                        </div>
                                        <div className="flex justify-between items-center text-sm">
                                            <span style={{ color: 'var(--text-muted)' }}>Service Fee</span>
                                            <span className="font-bold" style={{ color: 'var(--text-primary)' }}>Rp 1.000</span>
                                        </div>
                                        <div className="pt-3 flex justify-between items-center border-t border-gray-200">
                                            <span className="font-bold text-base" style={{ color: 'var(--text-primary)' }}>Total Pembayaran</span>
                                            <span className="font-black text-lg" style={{ color: 'var(--brand-secondary)' }}>
                                                Rp {((selectedProduct.quantity * (storeSettings?.discount_enabled ? storeSettings?.base_price_per_500 * (1 - (storeSettings?.discount_percentage / 100)) : storeSettings?.base_price_per_500 || 1000)) + 1000).toLocaleString('id-ID')}
                                            </span>
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
                                            Saya sudah membaca dan menyetujui <a href="/terms" className="font-bold hover:underline" style={{ color: 'var(--brand-secondary)' }} onClick={(e) => e.stopPropagation()}>Syarat dan Ketentuan</a>
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

            {isFetching ? (
                <>
                    {/* Skeleton Banner */}
                    <div className="flex flex-col gap-4 mb-6">
                        <div className="mc-card p-6 sm:p-8 h-48 md:h-56 overflow-hidden relative" style={{ background: '#f5f3f8' }}>
                            <div className="animate-pulse w-full h-full flex flex-row items-center justify-between">
                                <div className="flex-1 space-y-4 max-w-md">
                                    <div className="h-10 bg-gray-200 rounded-lg w-3/4"></div>
                                    <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                                    <div className="h-4 bg-gray-200 rounded w-1/3"></div>
                                    <div className="h-10 bg-gray-200 rounded-lg w-48 mt-8"></div>
                                </div>

                            </div>
                        </div>
                    </div>

                    {/* Skeleton Main Grid */}
                    <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 xl:gap-8 relative items-start animate-pulse mb-8">
                        <div className="lg:col-span-1 flex flex-col gap-6 order-2 lg:order-1">
                            <div className="mc-card h-[280px] bg-[#f5f3f8]"></div>
                            <div className="mc-card h-[240px] bg-[#f5f3f8]"></div>
                        </div>
                        <div className="lg:col-span-3 order-1 lg:order-2">
                            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                                {[...Array(6)].map((_, i) => (
                                    <div key={i} className="mc-card h-[380px] bg-[#f5f3f8] border-0 flex flex-col p-6 items-center">
                                        <div className="w-32 h-32 bg-gray-200 rounded-xl mb-6 mt-4"></div>
                                        <div className="h-8 w-24 bg-gray-200 rounded-lg mb-3"></div>
                                        <div className="h-6 w-32 bg-gray-200 rounded mb-6"></div>
                                        <div className="w-full h-12 bg-gray-200 rounded-xl mt-auto"></div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </>
            ) : (
                <>
                    {/* Store Header - Full Width */}
                    <div className="flex flex-col gap-4 mb-6">


                        {Boolean(discountEnabled) && event && (
                            <div
                                className="mc-card p-5 sm:p-7 overflow-hidden relative shadow-lg transition-all duration-300 border-0"
                                style={{
                                    background: 'var(--brand-secondary)',
                                    backgroundImage: storeSettings.popup_bg_image ? `url(${storeSettings.popup_bg_image})` : 'none',
                                    backgroundSize: 'cover',
                                    backgroundPosition: 'center',
                                    borderRadius: '16px'
                                }}
                            >
                                {/* Premium Gradient Overlay Fade */}
                                {storeSettings.popup_bg_image && (
                                    <div 
                                        className="absolute inset-0" 
                                        style={{ background: 'linear-gradient(90deg, rgba(8,15,40,0.95) 0%, rgba(8,15,40,0.7) 45%, rgba(8,15,40,0.2) 100%)' }}
                                    ></div>
                                )}
                                
                                <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
                                    <div className="flex-1 max-w-xl">
                                        <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded-md bg-[#FFE066] text-amber-900 border border-amber-500/30 text-[10px] font-black uppercase tracking-wider mb-2 shadow-sm">
                                            <i className="ri-flashlight-fill"></i> Spesial Event
                                        </div>
                                        <h2 className="text-2xl md:text-3xl font-black text-white mb-1.5 leading-tight" style={{ textShadow: '0 2px 8px rgba(0,0,0,0.6)' }}>
                                            {storeSettings.popup_title || event.toUpperCase()}
                                        </h2>
                                        <p className="text-white/95 font-bold text-sm leading-relaxed max-w-lg" style={{ textShadow: '0 1px 4px rgba(0,0,0,0.6)' }}>
                                            {storeSettings.popup_subtitle || (
                                                <>Nikmati diskon spesial <strong className="text-[#FFE066] font-black">{storeSettings.popup_discount_text || '20%'}</strong> untuk pembelian Points selama event ini.</>
                                            )}
                                        </p>
                                    </div>
                                    
                                    {storeSettings.discount_timer && (
                                        <div className="shrink-0 md:-mt-5">
                                            <CountdownTimer targetDate={storeSettings.discount_timer} onExpire={() => fetchStore()} />
                                        </div>
                                    )}
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
                                        <div className="w-16 h-24 relative flex-shrink-0 flex items-start justify-center pl-1 overflow-hidden rounded-lg">
                                            <img src={`https://mc-heads.net/body/${topSupporter}/100`} alt={topSupporter} className="max-w-none h-[140%] object-top drop-shadow-xl absolute top-0 left-1/2 -translate-x-1/2" />
                                        </div>
                                        <div className="flex flex-col py-2 self-start mt-2">
                                            <h3 className="text-xl font-black tracking-tight truncate max-w-[120px]" style={{ color: 'var(--brand-secondary)' }} title={topSupporter}>{topSupporter}</h3>
                                            <p className="text-[12px] font-bold mt-1 leading-snug" style={{ color: 'var(--text-muted)' }}>Top supporter bulan ini</p>
                                            <p className="text-[10px] font-black tracking-wide mt-1 uppercase" style={{ color: 'var(--brand-secondary)' }}>{topSupporterPoints?.toLocaleString('id-ID')} Points</p>
                                        </div>
                                    </div>
                                ) : (
                                    <div className="py-8 text-center relative z-10">
                                        <p className="text-sm font-bold" style={{ color: 'var(--text-muted)' }}>Belum ada supporter bulan ini.</p>
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
                                        <div key={idx} className="relative group cursor-pointer z-10 hover:z-50">
                                            <div className="aspect-square rounded-[10px] overflow-hidden border transition-colors shadow-sm group-hover:border-[var(--brand-secondary)]" style={{ background: '#f5f3f8', borderColor: '#e8e0f0' }}>
                                                <img src={`https://mc-heads.net/avatar/${player}/64`} alt={player} className="w-full h-full object-cover opacity-90 group-hover:opacity-100 transition-opacity" />
                                            </div>
                                            <div
                                                className="absolute top-0 left-1/2 text-white text-[10px] font-bold px-2.5 py-1.5 rounded-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all whitespace-nowrap pointer-events-none shadow-xl mt-[-5px]"
                                                style={{ background: 'var(--brand-secondary)', transform: 'translate(-50%, -100%)' }}
                                            >
                                                {player}
                                                <div className="absolute top-full left-1/2 -translate-x-1/2 border-[4px] border-transparent" style={{ borderTopColor: 'var(--brand-secondary)' }}></div>
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
                                        <div className="w-16 h-24 relative flex-shrink-0 flex items-start justify-center pl-1 overflow-hidden rounded-lg">
                                            <img src={`https://mc-heads.net/body/${topSupporterAllTime}/100`} alt={topSupporterAllTime} className="max-w-none h-[140%] object-top drop-shadow-xl absolute top-0 left-1/2 -translate-x-1/2" />
                                        </div>
                                        <div className="flex flex-col py-2 self-start mt-2">
                                            <h3 className="text-xl font-black tracking-tight truncate max-w-[120px]" style={{ color: 'var(--brand-secondary)' }} title={topSupporterAllTime}>{topSupporterAllTime}</h3>
                                            <p className="text-[12px] font-bold mt-1 leading-snug" style={{ color: 'var(--text-muted)' }}>Top supporter sepanjang masa</p>
                                            <p className="text-[10px] font-black tracking-wide mt-1 uppercase" style={{ color: 'var(--brand-secondary)' }}>{topSupporterAllTimePoints?.toLocaleString('id-ID')} Points</p>
                                        </div>
                                    </div>
                                ) : (
                                    <div className="py-8 text-center relative z-10">
                                        <p className="text-sm font-bold" style={{ color: 'var(--text-muted)' }}>Belum ada supporter.</p>
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
                                                <h3 className="text-3xl font-black flex flex-col items-center gap-1" style={{ color: 'var(--text-primary)' }}>
                                                    <span>
                                                        {product.points.toLocaleString('id-ID')}
                                                        <span style={{ color: 'var(--brand-secondary)', marginLeft: '4px' }}>POINTS</span>
                                                    </span>
                                                    {product.points > 100 && (
                                                        <span className="text-sm font-bold opacity-80" style={{ color: 'var(--text-muted)' }}>
                                                            ({(() => {
                                                                let base;
                                                                if (product.points <= 500) base = Math.floor(product.points / 100) * 100;
                                                                else if (product.points <= 1000) base = Math.floor(product.points / 500) * 500;
                                                                else if (product.points <= 5000) base = Math.floor(product.points / 1000) * 1000;
                                                                else base = Math.floor(product.points / 5000) * 5000;

                                                                if (base >= product.points) {
                                                                    if (product.points <= 500) base -= 100;
                                                                    else if (product.points <= 1000) base -= 500;
                                                                    else if (product.points <= 5000) base -= 1000;
                                                                    else base -= 5000;
                                                                }
                                                                if (product.points === 280) base = 200;

                                                                const bonus = product.points - base;
                                                                return `${base.toLocaleString('id-ID')} + ${bonus.toLocaleString('id-ID')} Bonus`;
                                                            })()})
                                                        </span>
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
                                                className="w-full py-3 px-2 rounded-xl font-extrabold text-sm transition-all duration-300 text-white glow-button hover:shadow-lg flex items-center justify-center gap-1.5"
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
                                        className="px-4 py-2 rounded-xl text-sm font-bold transition-all"
                                        style={{
                                            background: currentPage === 1 ? '#f0edf4' : 'var(--brand-secondary)',
                                            color: currentPage === 1 ? 'var(--text-muted)' : '#fff',
                                            cursor: currentPage === 1 ? 'not-allowed' : 'pointer',
                                            opacity: currentPage === 1 ? 0.5 : 1
                                        }}
                                    >
                                        ← Sebelumnya
                                    </button>
                                    {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
                                        <button
                                            key={page}
                                            onClick={() => { setCurrentPage(page); document.getElementById('products-grid')?.scrollIntoView({ behavior: 'smooth', block: 'start' }) }}
                                            className="w-10 h-10 rounded-xl text-sm font-bold transition-all"
                                            style={{
                                                background: page === currentPage ? 'var(--brand-secondary)' : '#f0edf4',
                                                color: page === currentPage ? '#fff' : 'var(--text-secondary)',
                                                fontWeight: page === currentPage ? 800 : 600
                                            }}
                                        >
                                            {page}
                                        </button>
                                    ))}
                                    <button
                                        onClick={() => { setCurrentPage(p => Math.min(totalPages, p + 1)); document.getElementById('products-grid')?.scrollIntoView({ behavior: 'smooth', block: 'start' }) }}
                                        disabled={currentPage === totalPages}
                                        className="px-4 py-2 rounded-xl text-sm font-bold transition-all"
                                        style={{
                                            background: currentPage === totalPages ? '#f0edf4' : 'var(--brand-secondary)',
                                            color: currentPage === totalPages ? 'var(--text-muted)' : '#fff',
                                            cursor: currentPage === totalPages ? 'not-allowed' : 'pointer',
                                            opacity: currentPage === totalPages ? 0.5 : 1
                                        }}
                                    >
                                        Selanjutnya →
                                    </button>
                                </div>
                            )}
                        </div>
                    </div>
                </>
            )}


        </Wrapper>
    )
}
