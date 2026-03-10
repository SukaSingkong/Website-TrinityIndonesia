import { useState, useEffect, useRef } from 'react'
import AdminLayout from '../../components/admin/AdminLayout'
import { Icons } from '../../components/elements/Icons'

export default function AdminSettings() {
    const [settings, setSettings] = useState({
        event_name: 'Idul Fitri',
        discount_enabled: false,
        base_price_per_500: 1000,
        discount_percentage: 0,
        popup_bg_image: '',
        popup_title: '',
        popup_subtitle: '',
        popup_discount_text: '20%',
        discount_timer: ''
    })
    const [isLoading, setIsLoading] = useState(true)
    const [isSaving, setIsSaving] = useState(false)
    const [message, setMessage] = useState('')

    // Track original saved state for dirty detection
    const savedSettingsRef = useRef(null)
    const hasChanges = savedSettingsRef.current !== null && JSON.stringify(settings) !== JSON.stringify(savedSettingsRef.current)

    useEffect(() => {
        fetch('/api/admin/settings')
            .then(res => res.json())
            .then(data => {
                if (data && data.id) {
                    const loaded = {
                        event_name: data.event_name || '',
                        discount_enabled: Boolean(data.discount_enabled),
                        base_price_per_500: data.base_price_per_500 || 1000,
                        discount_percentage: data.discount_percentage || 0,
                        popup_bg_image: data.popup_bg_image || '',
                        popup_title: data.popup_title || '',
                        popup_subtitle: data.popup_subtitle || '',
                        popup_discount_text: data.popup_discount_text || '20%',
                        discount_timer: data.discount_timer || ''
                    }
                    setSettings(loaded)
                    savedSettingsRef.current = loaded
                }
                setIsLoading(false)
            })
            .catch(e => {
                console.error("Failed to fetch settings:", e)
                setIsLoading(false)
            })
    }, [])

    async function handleSave(e) {
        if (e) e.preventDefault()
        setIsSaving(true)
        setMessage('')

        try {
            const res = await fetch('/api/admin/settings', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(settings)
            })
            const data = await res.json()
            if (data.success) {
                setMessage('Settings saved successfully!')
                savedSettingsRef.current = { ...settings }
            } else {
                setMessage('Error: ' + (data.error || data.message))
            }
        } catch (error) {
            setMessage('Error connecting to API')
        }
        setIsSaving(false)
    }

    function handleDiscard() {
        if (savedSettingsRef.current) {
            setSettings({ ...savedSettingsRef.current })
        }
        setMessage('')
    }

    if (isLoading) return (
        <AdminLayout title="Store Settings">
            <div className="grid grid-cols-1 xl:grid-cols-2 gap-6 pb-24 items-start">
                {/* Skeleton for Konfigurasi Toko */}
                <div className="mc-card p-8 relative overflow-hidden bg-white border-0 shadow-lg animate-pulse">
                    <div className="absolute top-0 right-0 w-48 h-48 opacity-5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 bg-gray-300"></div>
                    <div className="h-8 bg-gray-200 rounded w-48 mb-6 relative z-10"></div>
                    <div className="space-y-6 relative z-10">
                        <div>
                            <div className="h-4 bg-gray-200 rounded w-32 mb-2"></div>
                            <div className="h-14 bg-gray-100 rounded-xl w-full border-2 border-gray-100"></div>
                        </div>
                        <div className="h-14 bg-gray-100 rounded-xl w-full border-2 border-gray-100"></div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <div className="h-4 bg-gray-200 rounded w-40 mb-2"></div>
                                <div className="h-14 bg-gray-100 rounded-xl w-full border-2 border-gray-100"></div>
                            </div>
                            <div>
                                <div className="h-4 bg-gray-200 rounded w-48 mb-2"></div>
                                <div className="h-14 bg-gray-100 rounded-xl w-full border-2 border-gray-100"></div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Skeleton for Pengaturan Popup Diskon */}
                <div className="mc-card p-8 relative overflow-hidden bg-white border-0 shadow-lg animate-pulse">
                    <div className="absolute top-0 right-0 w-48 h-48 opacity-5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 bg-gray-300"></div>
                    <div className="h-8 bg-gray-200 rounded w-64 mb-2 relative z-10"></div>
                    <div className="h-4 bg-gray-200 rounded w-72 mb-6 relative z-10"></div>
                    <div className="space-y-4 relative z-10">
                        {[...Array(5)].map((_, i) => (
                            <div key={i}>
                                <div className="h-4 bg-gray-200 rounded w-40 mb-2"></div>
                                <div className={`bg-gray-100 rounded-xl w-full border-2 border-gray-100 ${i === 2 ? 'h-32' : 'h-14'}`}></div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </AdminLayout>
    )

    return (
        <AdminLayout title="Store Settings">
            <div className="grid grid-cols-1 xl:grid-cols-2 gap-6 pb-24 items-start">
                {/* Konfigurasi Toko */}
                <div className="mc-card p-8 relative overflow-hidden bg-white border-0 shadow-lg">
                    <div className="absolute top-0 right-0 w-48 h-48 opacity-5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" style={{ background: 'var(--brand-primary)' }}></div>

                    <h3 className="text-2xl font-black mb-6 relative z-10" style={{ color: 'var(--text-primary)' }}>Konfigurasi Toko</h3>

                    {message && (
                        <div className={`mb-6 p-4 rounded-xl border font-bold relative z-10 ${message.startsWith('Error') ? 'bg-[#fee2e2] border-[#ef4444] text-[#b91c1c]' : 'bg-[#dcfce7] border-[#16a34a] text-[#15803d]'}`}>
                            {message}
                        </div>
                    )}

                    <form onSubmit={handleSave} className="space-y-6 relative z-10">
                        <div>
                            <label className="block text-sm font-extrabold mb-2" style={{ color: 'var(--text-secondary)' }}>Nama Event / Diskon</label>
                            <input
                                type="text"
                                value={settings.event_name}
                                onChange={(e) => setSettings({ ...settings, event_name: e.target.value })}
                                className="w-full p-4 rounded-xl border-2 focus:bg-white focus:outline-none transition-all font-bold"
                                style={{ borderColor: 'var(--bg-body)', background: 'rgba(232,224,240,0.3)', color: 'var(--text-primary)' }}
                                placeholder="Contoh: Idul Fitri"
                            />
                        </div>

                        <div className="flex items-center gap-3 p-4 rounded-xl border-2 cursor-pointer transition-colors"
                            style={{ borderColor: settings.discount_enabled ? 'var(--brand-secondary)' : 'var(--bg-body)', background: settings.discount_enabled ? 'rgba(226,110,16,0.06)' : 'rgba(232,224,240,0.1)' }}
                            onClick={() => setSettings({ ...settings, discount_enabled: !settings.discount_enabled })}>
                            <div className={`w-6 h-6 rounded-md flex items-center justify-center border-2 transition-all ${settings.discount_enabled ? 'text-white' : ''}`}
                                style={{ background: settings.discount_enabled ? 'var(--brand-secondary)' : 'white', borderColor: settings.discount_enabled ? 'var(--brand-secondary)' : 'var(--text-muted)' }}>
                                {settings.discount_enabled && <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" /></svg>}
                            </div>
                            <label className="text-sm font-extrabold cursor-pointer" style={{ color: 'var(--text-primary)' }}>
                                Aktifkan Event Diskon
                            </label>
                        </div>

                        <div className="mt-6">
                            <div>
                                <label className="block text-sm font-extrabold mb-2" style={{ color: 'var(--text-secondary)' }}>Persentase Diskon <span className="text-xs font-bold opacity-70">(%)</span></label>
                                <div className="relative max-w-sm">
                                    <input
                                        type="number"
                                        min="0"
                                        max="100"
                                        value={settings.discount_percentage}
                                        onChange={(e) => setSettings({ ...settings, discount_percentage: Number(e.target.value) })}
                                        className="w-full p-4 pr-10 rounded-xl border-2 focus:bg-white focus:outline-none transition-all font-bold"
                                        style={{ borderColor: 'var(--bg-body)', background: 'rgba(232,224,240,0.3)', color: 'var(--text-primary)' }}
                                    />
                                    <span className="absolute right-4 top-1/2 -translate-y-1/2 font-bold" style={{ color: 'var(--text-muted)' }}>%</span>
                                </div>
                            </div>
                        </div>
                    </form>
                </div>

                {/* Pengaturan Popup Diskon */}
                <div className="mc-card p-8 relative overflow-hidden bg-white border-0 shadow-lg">
                    <div className="absolute top-0 right-0 w-48 h-48 opacity-5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" style={{ background: 'var(--brand-secondary)' }}></div>

                    <h3 className="text-2xl font-black mb-2 relative z-10" style={{ color: 'var(--text-primary)' }}>
                        <Icons.Photo className="w-6 h-6 inline mr-2" style={{ color: 'var(--brand-secondary)' }} />
                        Pengaturan Popup Diskon
                    </h3>
                    <p className="text-sm font-bold mb-6 relative z-10" style={{ color: 'var(--text-muted)' }}>
                        Kustomisasi tampilan banner diskon di halaman Store.
                    </p>

                    <div className="space-y-4 relative z-10">
                        <div>
                            <label className="block text-sm font-extrabold mb-2" style={{ color: 'var(--text-secondary)' }}>
                                URL Background Image <span className="text-xs font-bold opacity-60">(Opsional)</span>
                            </label>
                            <input
                                type="text"
                                value={settings.popup_bg_image}
                                onChange={(e) => setSettings({ ...settings, popup_bg_image: e.target.value })}
                                className="w-full p-4 rounded-xl border-2 focus:bg-white focus:outline-none transition-all font-bold"
                                style={{ borderColor: 'var(--bg-body)', background: 'rgba(232,224,240,0.3)', color: 'var(--text-primary)' }}
                                placeholder="https://example.com/banner.jpg"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-extrabold mb-2" style={{ color: 'var(--text-secondary)' }}>
                                Judul Popup <span className="text-xs font-bold opacity-60">(Kosongkan untuk default)</span>
                            </label>
                            <input
                                type="text"
                                value={settings.popup_title}
                                onChange={(e) => setSettings({ ...settings, popup_title: e.target.value })}
                                className="w-full p-4 rounded-xl border-2 focus:bg-white focus:outline-none transition-all font-bold"
                                style={{ borderColor: 'var(--bg-body)', background: 'rgba(232,224,240,0.3)', color: 'var(--text-primary)' }}
                                placeholder="Contoh: SPESIAL EVENT IDUL FITRI!"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-extrabold mb-2" style={{ color: 'var(--text-secondary)' }}>
                                Subtitle / Deskripsi <span className="text-xs font-bold opacity-60">(Kosongkan untuk default)</span>
                            </label>
                            <textarea
                                value={settings.popup_subtitle}
                                onChange={(e) => setSettings({ ...settings, popup_subtitle: e.target.value })}
                                rows="2"
                                className="w-full p-4 rounded-xl border-2 focus:bg-white focus:outline-none transition-all font-bold resize-none"
                                style={{ borderColor: 'var(--bg-body)', background: 'rgba(232,224,240,0.3)', color: 'var(--text-primary)' }}
                                placeholder="Contoh: Nikmati diskon eksklusif untuk semua pembelian Points!"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-extrabold mb-2" style={{ color: 'var(--text-secondary)' }}>
                                Teks Diskon <span className="text-xs font-bold opacity-60">(mis. 20%)</span>
                            </label>
                            <input
                                type="text"
                                value={settings.popup_discount_text}
                                onChange={(e) => setSettings({ ...settings, popup_discount_text: e.target.value })}
                                className="w-full p-4 rounded-xl border-2 focus:bg-white focus:outline-none transition-all font-bold"
                                style={{ borderColor: 'var(--bg-body)', background: 'rgba(232,224,240,0.3)', color: 'var(--text-primary)' }}
                                placeholder="20%"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-extrabold mb-2" style={{ color: 'var(--text-secondary)' }}>
                                Timer Selesai <span className="text-xs font-bold opacity-60">(Opsional, Target Waktu)</span>
                            </label>
                            <input
                                type="datetime-local"
                                value={settings.discount_timer}
                                onChange={(e) => setSettings({ ...settings, discount_timer: e.target.value })}
                                className="w-full p-4 rounded-xl border-2 focus:bg-white focus:outline-none transition-all font-bold"
                                style={{ borderColor: 'var(--bg-body)', background: 'rgba(232,224,240,0.3)', color: 'var(--text-primary)' }}
                            />
                        </div>
                    </div>

                    {/* Live Preview */}
                    {settings.discount_enabled && (
                        <div className="mt-6 relative z-10">
                            <p className="text-xs font-extrabold uppercase tracking-widest mb-3" style={{ color: 'var(--text-muted)' }}>Preview Banner Diskon</p>
                            <div
                                className="rounded-2xl p-6 sm:p-8 overflow-hidden relative text-white"
                                style={{
                                    background: 'var(--brand-secondary)',
                                    backgroundImage: settings.popup_bg_image ? `url(${settings.popup_bg_image})` : 'none',
                                    backgroundSize: 'cover',
                                    backgroundPosition: 'center'
                                }}
                            >
                                {settings.popup_bg_image && (
                                    <div className="absolute inset-0 bg-black/40"></div>
                                )}
                                <div className="absolute top-0 right-0 w-64 h-64 bg-black opacity-10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/4"></div>
                                <div className="relative z-10">
                                    <h2 className="text-2xl md:text-3xl font-black mb-2" style={{ textShadow: '0 4px 12px rgba(0,0,0,0.4)' }}>
                                        {settings.popup_title || `SPESIAL EVENT ${(settings.event_name || 'DISKON').toUpperCase()}!`}
                                    </h2>
                                    <p className="font-bold text-sm leading-relaxed text-white/90" style={{ textShadow: '0 2px 6px rgba(0,0,0,0.4)' }}>
                                        {settings.popup_subtitle || `Nikmati diskon eksklusif sebesar ${settings.popup_discount_text || '20%'} untuk semua pembelian Points selama event berlangsung.`}
                                    </p>
                                    {settings.popup_discount_text && (
                                        <span className="inline-block mt-3 px-3 py-1 rounded-md font-black text-sm" style={{ background: 'rgba(0,0,0,0.2)', color: '#FFE066' }}>
                                            {settings.popup_discount_text}
                                        </span>
                                    )}
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </div>

            {/* Floating Save Changes Bar */}
            <div
                className="fixed bottom-0 left-0 right-0 z-50 transition-all duration-500 ease-in-out"
                style={{
                    transform: hasChanges ? 'translateY(0)' : 'translateY(100%)',
                    opacity: hasChanges ? 1 : 0,
                    pointerEvents: hasChanges ? 'auto' : 'none'
                }}
            >
                <div className="max-w-3xl mx-auto px-4 pb-6">
                    <div
                        className="flex items-center justify-between gap-4 p-5 rounded-2xl shadow-2xl border overflow-hidden relative"
                        style={{
                            background: 'linear-gradient(135deg, #E26E10 0%, #c55e0d 50%, #a34e0a 100%)',
                            borderColor: 'rgba(255,255,255,0.15)',
                            boxShadow: '0 -4px 30px rgba(226,110,16,0.35), 0 8px 32px rgba(0,0,0,0.2)'
                        }}
                    >
                        {/* Decorative blobs */}
                        <div className="absolute top-0 right-0 w-32 h-32 bg-white opacity-10 rounded-full blur-2xl -translate-y-1/2 translate-x-1/4"></div>
                        <div className="absolute bottom-0 left-0 w-24 h-24 bg-white opacity-5 rounded-full blur-2xl translate-y-1/2 -translate-x-1/4"></div>

                        <div className="flex items-center gap-3 relative z-10">
                            <div className="w-9 h-9 rounded-xl bg-white/20 flex items-center justify-center backdrop-blur-sm border border-white/20">
                                <Icons.Exclamation className="w-5 h-5 text-white" />
                            </div>
                            <div>
                                <span className="text-white font-extrabold text-sm block leading-tight">Perubahan Belum Tersimpan</span>
                                <span className="text-white/60 font-bold text-xs">Simpan sebelum meninggalkan halaman</span>
                            </div>
                        </div>
                        <div className="flex items-center gap-3 relative z-10">
                            <button
                                onClick={handleDiscard}
                                className="px-5 py-2.5 rounded-xl text-sm font-extrabold transition-all hover:bg-white/20 border border-white/30 text-white"
                            >
                                Batalkan
                            </button>
                            <button
                                onClick={handleSave}
                                disabled={isSaving}
                                className="px-6 py-2.5 rounded-xl text-sm font-black transition-all hover:scale-105 disabled:opacity-50 disabled:hover:scale-100"
                                style={{
                                    background: '#fff',
                                    color: '#E26E10',
                                    boxShadow: '0 4px 16px rgba(0,0,0,0.15)'
                                }}
                            >
                                {isSaving ? 'Menyimpan...' : '💾 Simpan Perubahan'}
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </AdminLayout>
    )
}
