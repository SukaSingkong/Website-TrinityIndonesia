import { Wrapper } from '@layer/components/layout/Wrapper.jsx'
import { Icons } from '@layer/components/elements/Icons.jsx'
import { useState } from "react"
import { useRouter } from 'next/router'
import config from '@layer/theme.config'

const gameModes = [
    { id: 'general', name: 'Umum / General', icon: '🌐' },
    { id: 'oneblock', name: 'OneBlock', icon: '🏝️' },
    { id: 'boxsmp', name: 'BoxSMP', icon: '📦' },
    { id: 'anarchy', name: 'Anarchy Economy', icon: '⚔️' },
    { id: 'website', name: 'Website', icon: '🌍' },
    { id: 'other', name: 'Lainnya', icon: '❓' },
]

const categories = [
    { id: 'suggestion', name: 'Saran', color: 'emerald' },
    { id: 'idea', name: 'Ide Fitur', color: 'blue' },
    { id: 'event', name: 'Ide Event', color: 'rose' },
    { id: 'complaint', name: 'Keluhan', color: 'amber' },
    { id: 'appreciation', name: 'Apresiasi', color: 'purple' },
    { id: 'other', name: 'Lainnya', color: 'gray' },
]

export default function Suggestion() {
    const router = useRouter()
    const [nickname, setNickname] = useState('')
    const [platform, setPlatform] = useState('java')
    const [gameMode, setGameMode] = useState('')
    const [category, setCategory] = useState('')
    const [suggestion, setSuggestion] = useState('')
    const [isLoading, setIsLoading] = useState(false)
    const [isVerified, setIsVerified] = useState(false)
    const [verifiedNickname, setVerifiedNickname] = useState('')
    const [isAnonymous, setIsAnonymous] = useState(false)
    const [error, setError] = useState('')
    const [success, setSuccess] = useState(false)
    const [toastVisible, setToastVisible] = useState(false)
    const [toastMsg, setToastMsg] = useState('')

    function toast(msg, d = 2000) {
        setToastMsg(msg)
        setToastVisible(true)
        setTimeout(() => setToastVisible(false), d)
    }

    async function verifyNickname(e) {
        e.preventDefault()

        // If anonymous, skip verification
        if (isAnonymous) {
            setIsVerified(true)
            setVerifiedNickname('Anonymous')
            toast("Melanjutkan sebagai Anonymous")
            return
        }

        if (!nickname.trim()) {
            setError('Nickname tidak boleh kosong')
            return
        }

        setIsLoading(true)
        setError('')

        try {
            const response = await fetch("https://trinityid-data.vercel.app/validate", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ username: nickname.trim(), platform })
            })
            const data = await response.json()

            if (data.success) {
                setIsVerified(true)
                setVerifiedNickname(nickname.trim())
                toast("Nickname terverifikasi!")
            } else {
                setError(`Nickname "${nickname}" tidak ditemukan. Pastikan kamu sudah pernah login ke dalam server.`)
            }
        } catch {
            setError("Tidak dapat tersambung ke server. Coba lagi nanti.")
        } finally {
            setIsLoading(false)
        }
    }

    async function submitSuggestion(e) {
        e.preventDefault()

        if (!gameMode) {
            setError('Pilih mode permainan terlebih dahulu')
            return
        }

        if (!category) {
            setError('Pilih kategori terlebih dahulu')
            return
        }

        if (!suggestion.trim()) {
            setError('Kritik/saran tidak boleh kosong')
            return
        }

        if (suggestion.trim().length < 20) {
            setError('Kritik/saran minimal 20 karakter')
            return
        }

        setIsLoading(true)
        setError('')

        try {
            const response = await fetch('/api/suggestion', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    nickname: verifiedNickname,
                    platform,
                    gameMode,
                    category,
                    suggestion: suggestion.trim()
                })
            })

            const data = await response.json()

            if (data.success) {
                setSuccess(true)
                toast("Kritik/saran berhasil dikirim!")
                setTimeout(() => {
                    router.push('/')
                }, 3000)
            } else {
                setError(data.message || 'Gagal mengirim kritik/saran')
            }
        } catch {
            setError("Tidak dapat mengirim kritik/saran. Coba lagi nanti.")
        } finally {
            setIsLoading(false)
        }
    }

    function resetForm() {
        setNickname('')
        setSuggestion('')
        setGameMode('')
        setCategory('')
        setIsVerified(false)
        setVerifiedNickname('')
        setSuccess(false)
        setError('')
    }

    const selectedMode = gameModes.find(m => m.id === gameMode)
    const selectedCategory = categories.find(c => c.id === category)

    const getCategoryStyle = (cat, isSelected) => {
        if (!isSelected) return {}
        const colors = {
            emerald: { border: '#10b981', bg: 'rgba(16, 185, 129, 0.1)', text: '#34d399' },
            blue: { border: '#3b82f6', bg: 'rgba(59, 130, 246, 0.1)', text: '#60a5fa' },
            rose: { border: '#f43f5e', bg: 'rgba(244, 63, 94, 0.1)', text: '#fb7185' },
            amber: { border: '#f59e0b', bg: 'rgba(245, 158, 11, 0.1)', text: '#fbbf24' },
            purple: { border: '#a855f7', bg: 'rgba(168, 85, 247, 0.1)', text: '#c084fc' },
            gray: { border: '#6b7280', bg: 'rgba(107, 114, 128, 0.1)', text: '#9ca3af' },
        }
        const c = colors[cat.color] || colors.gray
        return { borderColor: c.border, backgroundColor: c.bg, color: c.text }
    }

    return (
        <Wrapper seo={{ title: 'Kritik & Saran', description: 'Kirimkan kritik dan saran untuk membantu meningkatkan kualitas server Trinity Indonesia.', path: '/suggestion' }}>
            {/* Toast */}
            <div className={`${toastVisible ? 'translate-y-0 opacity-100 scale-100' : 'translate-y-4 opacity-0 scale-95'} fixed right-6 bottom-6 z-50 glass-card px-6 py-4 rounded-2xl shadow-2xl transition-all duration-300 border border-emerald-500/30`}>
                <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-emerald-500/20 flex items-center justify-center">
                        <Icons.CheckCircle className="h-5 w-5 text-emerald-400" />
                    </div>
                    <p className="text-white font-semibold">{toastMsg}</p>
                </div>
            </div>

            {/* Hero Section */}
            <section className="relative min-h-[40vh] flex items-center pt-24 border-b border-red-900/30 bg-black overflow-hidden">
                <div className="absolute inset-0 bg-grid opacity-20" />
                <div className="absolute inset-0 bg-gradient-to-b from-transparent to-[var(--surface-900)]"></div>

                <div className="container relative z-10">
                    <div className="max-w-4xl mx-auto text-center">
                        <div className="flex items-center justify-center gap-3 mb-4">
                            <div className="h-px w-8 bg-red-500"></div>
                            <p className="text-xs font-mono text-red-500 uppercase tracking-[0.3em]">MASUKAN & SARAN</p>
                            <div className="h-px w-8 bg-red-500"></div>
                        </div>
                        <h1 className="text-5xl md:text-7xl font-black text-white uppercase mb-6 leading-none glitch-effect">
                            KRITIK & SARAN
                        </h1>
                        <p className="text-lg text-gray-500 mb-8 font-mono max-w-2xl mx-auto">
                            Bantu kami meningkatkan kualitas server dengan memberikan masukan berhargamu!
                        </p>
                    </div>
                </div>
            </section>

            {/* Form Section */}
            <section className="py-24" style={{ background: 'var(--surface-900)' }}>
                <div className="container">
                    <div className="max-w-2xl mx-auto">
                        {success ? (
                            <div className="glass-card p-8 rounded-3xl text-center">
                                <div className="w-20 h-20 mx-auto bg-emerald-500/20 rounded-full flex items-center justify-center mb-6">
                                    <Icons.CheckCircle className="h-10 w-10 text-emerald-400" />
                                </div>
                                <h2 className="text-2xl font-bold text-white mb-4">Terima Kasih!</h2>
                                <p className="text-gray-400 mb-6">Kritik dan saran kamu telah berhasil dikirim ke tim kami. Kami akan meninjau masukanmu.</p>

                                <div className="p-4 rounded-xl bg-white/5 border border-white/10 mb-6">
                                    <div className="flex items-center gap-4">
                                        <img
                                            src={`https://mc-heads.net/avatar/${verifiedNickname}/64`}
                                            alt={verifiedNickname}
                                            className="w-12 h-12 rounded-lg"
                                        />
                                        <div className="text-left flex-1">
                                            <p className="text-white font-bold">{verifiedNickname}</p>
                                            <p className="text-gray-500 text-sm">{selectedMode?.name} • {selectedCategory?.name}</p>
                                        </div>
                                    </div>
                                </div>

                                <p className="text-gray-500 text-sm mb-6">Kamu akan dialihkan ke halaman utama dalam 3 detik...</p>

                                <button
                                    onClick={() => router.push('/')}
                                    className="glow-button px-8 py-4 rounded-xl font-bold uppercase text-white"
                                >
                                    Kembali ke Beranda
                                </button>
                            </div>
                        ) : !isVerified ? (
                            <div className="glass-card p-8 rounded-3xl">
                                <div className="text-center mb-8">
                                    <div className="w-16 h-16 mx-auto bg-rose-500/20 rounded-2xl flex items-center justify-center mb-4">
                                        <Icons.Users className="h-8 w-8 text-rose-400" />
                                    </div>
                                    <h2 className="text-2xl font-bold text-white mb-2">Verifikasi Akun</h2>
                                    <p className="text-gray-400">Masukkan nickname Minecraft kamu untuk melanjutkan</p>
                                </div>

                                <form onSubmit={verifyNickname} className="space-y-6">
                                    <div>
                                        <label className="block text-sm font-semibold text-gray-400 mb-3">Platform</label>
                                        <div className="grid grid-cols-2 gap-3">
                                            <button
                                                type="button"
                                                onClick={() => setPlatform('java')}
                                                className={`p-4 rounded-xl border-2 transition-all duration-200 flex items-center justify-center gap-2 ${platform === 'java'
                                                    ? 'border-rose-500 bg-rose-500/10 text-rose-400'
                                                    : 'border-white/10 bg-white/5 text-gray-400 hover:border-white/20'
                                                    }`}
                                            >
                                                <Icons.Cube className="h-5 w-5" />
                                                <span className="font-semibold">Java</span>
                                            </button>
                                            <button
                                                type="button"
                                                onClick={() => setPlatform('bedrock')}
                                                className={`p-4 rounded-xl border-2 transition-all duration-200 flex items-center justify-center gap-2 ${platform === 'bedrock'
                                                    ? 'border-rose-500 bg-rose-500/10 text-rose-400'
                                                    : 'border-white/10 bg-white/5 text-gray-400 hover:border-white/20'
                                                    }`}
                                            >
                                                <Icons.Cube className="h-5 w-5" />
                                                <span className="font-semibold">Bedrock</span>
                                            </button>
                                        </div>
                                    </div>

                                    <div>
                                        <label className="block text-sm font-semibold text-gray-400 mb-3">Nickname Minecraft</label>
                                        <input
                                            type="text"
                                            value={isAnonymous ? '' : nickname}
                                            onChange={(e) => setNickname(e.target.value)}
                                            placeholder={isAnonymous ? 'Kirim sebagai Anonymous' : 'Masukkan nickname...'}
                                            disabled={isAnonymous}
                                            className={`w-full px-4 py-4 rounded-xl bg-white/5 border border-white/10 text-white placeholder-gray-500 focus:outline-none focus:border-rose-500/50 transition-colors ${isAnonymous ? 'opacity-50 cursor-not-allowed' : ''}`}
                                        />
                                    </div>

                                    {/* Anonymous Checkbox */}
                                    <label className="flex items-center gap-3 cursor-pointer group">
                                        <div className={`w-6 h-6 rounded-lg border-2 flex items-center justify-center transition-all ${isAnonymous ? 'bg-rose-500 border-rose-500' : 'border-white/20 bg-white/5 group-hover:border-white/40'}`}>
                                            {isAnonymous && <Icons.Check className="h-4 w-4 text-white" />}
                                        </div>
                                        <input
                                            type="checkbox"
                                            checked={isAnonymous}
                                            onChange={(e) => {
                                                setIsAnonymous(e.target.checked)
                                                if (e.target.checked) setNickname('')
                                            }}
                                            className="hidden"
                                        />
                                        <span className="text-gray-400 group-hover:text-white transition-colors">Kirim sebagai Anonymous</span>
                                    </label>

                                    {error && (
                                        <div className="p-4 rounded-xl bg-rose-500/10 border border-rose-500/30">
                                            <p className="text-rose-300 text-sm">{error}</p>
                                        </div>
                                    )}

                                    <button
                                        type="submit"
                                        disabled={isLoading || (!isAnonymous && !nickname.trim())}
                                        className={`w-full py-4 rounded-xl font-bold uppercase text-white transition-all duration-300 flex items-center justify-center gap-2 ${(isAnonymous || nickname.trim()) && !isLoading
                                            ? 'glow-button hover:opacity-90'
                                            : 'bg-gray-700 cursor-not-allowed'
                                            }`}
                                    >
                                        {isLoading ? (
                                            <>
                                                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                                Memverifikasi...
                                            </>
                                        ) : isAnonymous ? (
                                            <>
                                                <Icons.ArrowRight className="h-5 w-5" />
                                                Lanjut
                                            </>
                                        ) : (
                                            <>
                                                <Icons.Shield className="h-5 w-5" />
                                                Verifikasi
                                            </>
                                        )}
                                    </button>
                                </form>
                            </div>
                        ) : (
                            <div className="glass-card p-8 rounded-3xl">
                                <div className="flex items-center gap-4 p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/30 mb-8">
                                    <img
                                        src={`https://mc-heads.net/avatar/${verifiedNickname}/64`}
                                        alt={verifiedNickname}
                                        className="w-12 h-12 rounded-lg"
                                    />
                                    <div className="flex-1">
                                        <p className="text-white font-bold">{verifiedNickname}</p>
                                        <p className="text-emerald-400 text-sm flex items-center gap-1">
                                            <Icons.CheckCircle className="h-4 w-4" />
                                            Terverifikasi • {platform === 'java' ? 'Java' : 'Bedrock'}
                                        </p>
                                    </div>
                                    <button
                                        onClick={resetForm}
                                        className="p-2 rounded-lg bg-white/5 hover:bg-white/10 transition-colors"
                                    >
                                        <Icons.X className="h-5 w-5 text-gray-400" />
                                    </button>
                                </div>

                                <form onSubmit={submitSuggestion} className="space-y-6">
                                    <div>
                                        <label className="block text-sm font-semibold text-gray-400 mb-3">Mode Permainan</label>
                                        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                                            {gameModes.map((mode) => (
                                                <button
                                                    type="button"
                                                    key={mode.id}
                                                    onClick={() => setGameMode(mode.id)}
                                                    className={`p-3 rounded-xl border-2 transition-all duration-200 flex items-center gap-2 ${gameMode === mode.id
                                                        ? 'border-rose-500 bg-rose-500/10 text-rose-400'
                                                        : 'border-white/10 bg-white/5 text-gray-400 hover:border-white/20'
                                                        }`}
                                                >
                                                    <span className="text-lg">{mode.icon}</span>
                                                    <span className="font-semibold text-sm truncate">{mode.name}</span>
                                                </button>
                                            ))}
                                        </div>
                                    </div>

                                    <div>
                                        <label className="block text-sm font-semibold text-gray-400 mb-3">Kategori</label>
                                        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                                            {categories.map((cat) => (
                                                <button
                                                    type="button"
                                                    key={cat.id}
                                                    onClick={() => setCategory(cat.id)}
                                                    className={`p-3 rounded-xl border-2 transition-all duration-200 text-center ${category === cat.id
                                                        ? ''
                                                        : 'border-white/10 bg-white/5 text-gray-400 hover:border-white/20'
                                                        }`}
                                                    style={getCategoryStyle(cat, category === cat.id)}
                                                >
                                                    <span className="font-semibold text-sm">{cat.name}</span>
                                                </button>
                                            ))}
                                        </div>
                                    </div>

                                    <div>
                                        <label className="block text-sm font-semibold text-gray-400 mb-3">Kritik / Saran / Ide</label>
                                        <textarea
                                            value={suggestion}
                                            onChange={(e) => setSuggestion(e.target.value)}
                                            placeholder="Tulis kritik, saran, atau ide kamu di sini... (minimal 20 karakter)"
                                            rows={6}
                                            className="w-full px-4 py-4 rounded-xl bg-white/5 border border-white/10 text-white placeholder-gray-500 focus:outline-none focus:border-rose-500/50 transition-colors resize-none"
                                        />
                                        <p className="text-gray-500 text-sm mt-2">{suggestion.length} / 20 karakter minimum</p>
                                    </div>

                                    {error && (
                                        <div className="p-4 rounded-xl bg-rose-500/10 border border-rose-500/30">
                                            <p className="text-rose-300 text-sm">{error}</p>
                                        </div>
                                    )}

                                    <button
                                        type="submit"
                                        disabled={isLoading || !gameMode || !category || suggestion.trim().length < 20}
                                        className={`w-full py-4 rounded-xl font-bold uppercase text-white transition-all duration-300 flex items-center justify-center gap-2 ${gameMode && category && suggestion.trim().length >= 20 && !isLoading
                                            ? 'glow-button hover:opacity-90'
                                            : 'bg-gray-700 cursor-not-allowed'
                                            }`}
                                    >
                                        {isLoading ? (
                                            <>
                                                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                                Mengirim...
                                            </>
                                        ) : (
                                            <>
                                                <Icons.Speakerphone className="h-5 w-5" />
                                                Kirim Kritik & Saran
                                            </>
                                        )}
                                    </button>
                                </form>
                            </div>
                        )}
                    </div>
                </div>
            </section>
        </Wrapper>
    )
}
