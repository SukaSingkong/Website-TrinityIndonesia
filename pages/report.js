import { Wrapper } from '@layer/components/layout/Wrapper.jsx'
import { Icons } from '@layer/components/elements/Icons.jsx'
import { useState, useRef } from "react"
import { useRouter } from 'next/router'
import config from '@layer/theme.config'

const reportCategories = [
    { id: 'cheat', name: 'Cheat / Hack', icon: '🎮', color: 'rose' },
    { id: 'exploit', name: 'Exploit / Bug Abuse', icon: '⚠️', color: 'amber' },
    { id: 'toxic', name: 'Toxic / Harassment', icon: '💢', color: 'red' },
    { id: 'scam', name: 'Penipuan', icon: '🦊', color: 'orange' },
    { id: 'account_selling', name: 'Jual Beli Akun', icon: '💰', color: 'yellow' },
    { id: 'rmt', name: 'RMT (Real Money Trading)', icon: '💵', color: 'green' },
    { id: 'other', name: 'Lainnya', icon: '❓', color: 'gray' },
]

const gameModes = [
    { id: 'general', name: 'Umum / General', icon: '🌐' },
    { id: 'oneblock', name: 'OneBlock', icon: '🏝️' },
    { id: 'boxsmp', name: 'BoxSMP', icon: '📦' },
    { id: 'anarchy', name: 'Anarchy Economy', icon: '⚔️' },
    { id: 'discord', name: 'Discord', icon: '💬' },
    { id: 'external', name: 'Di Luar Game', icon: '🌍' },
    { id: 'other', name: 'Lainnya', icon: '❓' },
]

export default function PlayerReport() {
    const router = useRouter()
    const fileInputRef = useRef(null)

    const [nickname, setNickname] = useState('')
    const [platform, setPlatform] = useState('java')
    const [reportedPlayer, setReportedPlayer] = useState('')
    const [gameMode, setGameMode] = useState('')
    const [category, setCategory] = useState('')
    const [description, setDescription] = useState('')
    const [files, setFiles] = useState([])
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

    function handleFileSelect(e) {
        const selectedFiles = Array.from(e.target.files)
        const imageFiles = selectedFiles.filter(file => file.type.startsWith('image/'))

        if (imageFiles.length !== selectedFiles.length) {
            toast("Hanya file gambar yang diperbolehkan!")
        }

        const newFiles = [...files, ...imageFiles].slice(0, 5)
        setFiles(newFiles)

        if (newFiles.length >= 5) {
            toast("Maksimal 5 foto!")
        }
    }

    function removeFile(index) {
        setFiles(files.filter((_, i) => i !== index))
    }

    async function submitReport(e) {
        e.preventDefault()

        if (!reportedPlayer.trim()) {
            setError('Nickname player yang dilaporkan tidak boleh kosong')
            return
        }

        if (!gameMode) {
            setError('Pilih lokasi kejadian terlebih dahulu')
            return
        }

        if (!category) {
            setError('Pilih kategori pelanggaran terlebih dahulu')
            return
        }

        if (!description.trim()) {
            setError('Deskripsi laporan tidak boleh kosong')
            return
        }

        if (description.trim().length < 100) {
            setError('Deskripsi laporan minimal 100 karakter')
            return
        }

        if (files.length === 0) {
            setError('Bukti foto/screenshot wajib dilampirkan')
            return
        }

        setIsLoading(true)
        setError('')

        try {
            const formData = new FormData()
            formData.append('reporter', verifiedNickname)
            formData.append('platform', platform)
            formData.append('reportedPlayer', reportedPlayer.trim())
            formData.append('gameMode', gameMode)
            formData.append('category', category)
            formData.append('description', description.trim())

            files.forEach((file, index) => {
                formData.append(`file${index}`, file)
            })

            const response = await fetch('/api/playerreport', {
                method: 'POST',
                body: formData
            })

            const data = await response.json()

            if (data.success) {
                setSuccess(true)
                toast("Laporan berhasil dikirim!")
                setTimeout(() => {
                    router.push('/')
                }, 3000)
            } else {
                setError(data.message || 'Gagal mengirim laporan')
            }
        } catch {
            setError("Tidak dapat mengirim laporan. Coba lagi nanti.")
        } finally {
            setIsLoading(false)
        }
    }

    function resetForm() {
        setNickname('')
        setReportedPlayer('')
        setDescription('')
        setGameMode('')
        setCategory('')
        setFiles([])
        setIsVerified(false)
        setVerifiedNickname('')
        setSuccess(false)
        setError('')
    }

    const selectedMode = gameModes.find(m => m.id === gameMode)
    const selectedCategory = reportCategories.find(c => c.id === category)

    return (
        <Wrapper seo={{ title: 'Report Player' }}>
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
            <section className="relative min-h-[50vh] flex items-center overflow-hidden pt-24">
                <div className="absolute inset-0 bg-cover bg-center" style={{ backgroundImage: 'url("/vendor/bg.jpg")' }} />
                <div className="absolute inset-0 hero-gradient" />
                <div className="absolute inset-0 overflow-hidden pointer-events-none">
                    <div className="particle particle-1" /><div className="particle particle-2" /><div className="particle particle-4" />
                </div>

                <div className="container relative z-10">
                    <div className="max-w-3xl">
                        <span className="inline-block px-4 py-1.5 rounded-full text-xs font-bold uppercase bg-rose-500/10 text-rose-400 border border-rose-500/20 mb-6">Report</span>
                        <h1 className="text-4xl md:text-6xl font-black text-white uppercase mb-6">Report <span className="gradient-text">Player</span></h1>
                        <p className="text-lg text-gray-300 mb-8">Laporkan pemain yang melanggar aturan untuk menjaga komunitas tetap sehat!</p>
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
                                <h2 className="text-2xl font-bold text-white mb-4">Laporan Terkirim!</h2>
                                <p className="text-gray-400 mb-6">Laporan kamu telah berhasil dikirim ke tim moderator. Kami akan meninjau dan mengambil tindakan yang diperlukan.</p>

                                <div className="p-4 rounded-xl bg-white/5 border border-white/10 mb-6">
                                    <div className="flex items-center gap-4">
                                        <img
                                            src={`https://mc-heads.net/avatar/${verifiedNickname}/64`}
                                            alt={verifiedNickname}
                                            className="w-12 h-12 rounded-lg"
                                        />
                                        <div className="text-left flex-1">
                                            <p className="text-white font-bold">{verifiedNickname}</p>
                                            <p className="text-gray-500 text-sm">Melaporkan: {reportedPlayer}</p>
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
                                        <label className="block text-sm font-semibold text-gray-400 mb-3">Nickname Minecraft Kamu</label>
                                        <input
                                            type="text"
                                            value={isAnonymous ? '' : nickname}
                                            onChange={(e) => setNickname(e.target.value)}
                                            placeholder={isAnonymous ? 'Report sebagai Anonymous' : 'Masukkan nickname kamu...'}
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
                                        <span className="text-gray-400 group-hover:text-white transition-colors">Report sebagai Anonymous</span>
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

                                <form onSubmit={submitReport} className="space-y-6">
                                    {/* Reported Player */}
                                    <div>
                                        <label className="block text-sm font-semibold text-gray-400 mb-3">Nickname Player yang Dilaporkan</label>
                                        <input
                                            type="text"
                                            value={reportedPlayer}
                                            onChange={(e) => setReportedPlayer(e.target.value)}
                                            placeholder="Masukkan nickname player..."
                                            className="w-full px-4 py-4 rounded-xl bg-white/5 border border-white/10 text-white placeholder-gray-500 focus:outline-none focus:border-rose-500/50 transition-colors"
                                        />
                                    </div>

                                    {/* Location Selection */}
                                    <div>
                                        <label className="block text-sm font-semibold text-gray-400 mb-3">Lokasi Kejadian</label>
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

                                    {/* Category Selection */}
                                    <div>
                                        <label className="block text-sm font-semibold text-gray-400 mb-3">Kategori Pelanggaran</label>
                                        <div className="grid grid-cols-2 gap-2">
                                            {reportCategories.map((cat) => (
                                                <button
                                                    type="button"
                                                    key={cat.id}
                                                    onClick={() => setCategory(cat.id)}
                                                    className={`p-3 rounded-xl border-2 transition-all duration-200 flex items-center gap-2 ${category === cat.id
                                                        ? 'border-amber-500 bg-amber-500/10 text-amber-400'
                                                        : 'border-white/10 bg-white/5 text-gray-400 hover:border-white/20'
                                                        }`}
                                                >
                                                    <span className="text-lg">{cat.icon}</span>
                                                    <span className="font-semibold text-sm truncate">{cat.name}</span>
                                                </button>
                                            ))}
                                        </div>
                                    </div>

                                    {/* Description */}
                                    <div>
                                        <label className="block text-sm font-semibold text-gray-400 mb-3">Kronologi Kejadian</label>
                                        <textarea
                                            value={description}
                                            onChange={(e) => setDescription(e.target.value)}
                                            placeholder="Jelaskan kronologi kejadian secara detail: kapan, dimana, apa yang terjadi... (minimal 100 karakter)"
                                            rows={6}
                                            className="w-full px-4 py-4 rounded-xl bg-white/5 border border-white/10 text-white placeholder-gray-500 focus:outline-none focus:border-rose-500/50 transition-colors resize-none"
                                        />
                                        <p className={`text-sm mt-2 ${description.length >= 100 ? 'text-emerald-400' : 'text-gray-500'}`}>
                                            {description.length} / 100 karakter minimum {description.length >= 100 && '✓'}
                                        </p>
                                    </div>

                                    {/* File Upload */}
                                    <div>
                                        <label className="block text-sm font-semibold text-gray-400 mb-3">
                                            Bukti Screenshot (Wajib, max 5 foto)
                                        </label>

                                        {files.length > 0 && (
                                            <div className="grid grid-cols-3 sm:grid-cols-5 gap-2 mb-3">
                                                {files.map((file, index) => (
                                                    <div key={index} className="relative group">
                                                        <img
                                                            src={URL.createObjectURL(file)}
                                                            alt={`Preview ${index + 1}`}
                                                            className="w-full h-20 object-cover rounded-lg border border-white/10"
                                                        />
                                                        <button
                                                            type="button"
                                                            onClick={() => removeFile(index)}
                                                            className="absolute -top-2 -right-2 w-6 h-6 bg-rose-500 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                                                        >
                                                            <Icons.X className="h-3 w-3 text-white" />
                                                        </button>
                                                    </div>
                                                ))}
                                            </div>
                                        )}

                                        {files.length < 5 && (
                                            <button
                                                type="button"
                                                onClick={() => fileInputRef.current?.click()}
                                                className={`w-full p-6 rounded-xl border-2 border-dashed transition-colors flex flex-col items-center gap-2 ${files.length === 0
                                                    ? 'border-rose-500/50 hover:border-rose-500 text-rose-400'
                                                    : 'border-white/20 hover:border-rose-500/50 text-gray-400 hover:text-rose-400'
                                                    }`}
                                            >
                                                <Icons.Photo className="h-8 w-8" />
                                                <span className="font-semibold">Klik untuk upload bukti</span>
                                                <span className="text-xs">{files.length}/5 foto {files.length === 0 && '(wajib)'}</span>
                                            </button>
                                        )}

                                        <input
                                            ref={fileInputRef}
                                            type="file"
                                            accept="image/*"
                                            multiple
                                            onChange={handleFileSelect}
                                            className="hidden"
                                        />
                                    </div>

                                    {/* Warning */}
                                    <div className="p-4 rounded-xl bg-amber-500/10 border border-amber-500/30">
                                        <div className="flex items-start gap-3">
                                            <div className="w-8 h-8 rounded-lg bg-amber-500/20 flex items-center justify-center flex-shrink-0">
                                                <Icons.ExclamationCircle className="h-5 w-5 text-amber-400" />
                                            </div>
                                            <div>
                                                <p className="text-amber-300 font-semibold text-sm">Peringatan</p>
                                                <p className="text-amber-300/70 text-xs mt-1">Laporan palsu atau fitnah dapat dikenakan sanksi. Pastikan bukti yang kamu kirim valid dan tidak direkayasa.</p>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Error Message */}
                                    {error && (
                                        <div className="p-4 rounded-xl bg-rose-500/10 border border-rose-500/30">
                                            <p className="text-rose-300 text-sm">{error}</p>
                                        </div>
                                    )}

                                    {/* Submit Button */}
                                    <button
                                        type="submit"
                                        disabled={isLoading || !reportedPlayer.trim() || !gameMode || !category || description.trim().length < 100 || files.length === 0}
                                        className={`w-full py-4 rounded-xl font-bold uppercase text-white transition-all duration-300 flex items-center justify-center gap-2 ${reportedPlayer.trim() && gameMode && category && description.trim().length >= 100 && files.length > 0 && !isLoading
                                            ? 'glow-button hover:opacity-90'
                                            : 'bg-gray-700 cursor-not-allowed'
                                            }`}
                                    >
                                        {isLoading ? (
                                            <>
                                                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                                Mengirim Laporan...
                                            </>
                                        ) : (
                                            <>
                                                <Icons.Flag className="h-5 w-5" />
                                                Kirim Laporan
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
