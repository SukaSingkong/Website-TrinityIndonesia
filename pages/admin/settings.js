import { useState, useEffect, useRef } from 'react'
import AdminLayout from '../../components/admin/AdminLayout'

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
                        popup_discount_text: data.popup_discount_text || '',
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
                setMessage('Pengaturan berhasil disimpan!')
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
            <div className="flex justify-center py-20">
                <div className="w-12 h-12 border-4 border-[var(--brand-primary)] border-t-transparent rounded-full animate-spin"></div>
            </div>
        </AdminLayout>
    )

    return (
        <AdminLayout title="Store Settings">
            <div className="max-w-7xl mx-auto space-y-6 pb-24">
                
                {message && (
                    <div className={`p-4 rounded-xl border font-bold ${message.startsWith('Error') ? 'bg-[#fee2e2] border-[#ef4444] text-[#b91c1c]' : 'bg-[#dcfce7] border-[#16a34a] text-[#15803d]'}`}>
                        {message}
                    </div>
                )}

                <div className="grid grid-cols-1 xl:grid-cols-2 gap-6 items-start">
                    
                    {/* KOLOM KIRI: PENGATURAN DISKON */}
                    <div className="space-y-6">
                        <div className="mc-card p-8 relative overflow-hidden bg-white border-0 shadow-lg">
                            <div className="absolute top-0 right-0 w-48 h-48 opacity-5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" style={{ background: 'var(--brand-primary)' }}></div>
                            
                            <h3 className="text-2xl font-black mb-1 relative z-10 flex items-center gap-2" style={{ color: 'var(--text-primary)' }}>
                                <i className="ri-price-tag-3-fill" style={{ color: 'var(--brand-primary)' }}></i> Pengaturan Event
                            </h3>
                            <p className="text-sm font-bold mb-6 relative z-10" style={{ color: 'var(--text-muted)' }}>Atur status dan besaran diskon toko.</p>

                            <form onSubmit={handleSave} className="space-y-6 relative z-10">
                                {/* Toggle Diskon */}
                                <div 
                                    className="relative flex items-center justify-between p-5 rounded-xl border-2 cursor-pointer transition-all overflow-hidden"
                                    style={{ 
                                        borderColor: settings.discount_enabled ? 'var(--brand-secondary)' : 'var(--bg-body)', 
                                        background: settings.discount_enabled ? 'rgba(226,110,16,0.06)' : 'rgba(232,224,240,0.1)' 
                                    }}
                                    onClick={() => setSettings({ ...settings, discount_enabled: !settings.discount_enabled })}
                                >
                                    {settings.discount_enabled && (
                                        <div className="absolute top-0 right-0 w-32 h-32 bg-[var(--brand-secondary)] opacity-10 rounded-full blur-2xl -translate-y-1/2 translate-x-1/4"></div>
                                    )}
                                    <div className="flex-1">
                                        <label className="text-lg font-black cursor-pointer flex items-center gap-2" style={{ color: settings.discount_enabled ? 'var(--brand-secondary)' : 'var(--text-primary)' }}>
                                            {settings.discount_enabled ? 'EVENT DISKON AKTIF' : 'EVENT DISKON MATI'}
                                        </label>
                                        <p className="text-xs font-bold opacity-80 mt-1" style={{ color: 'var(--text-muted)' }}>
                                            {settings.discount_enabled 
                                                ? 'Sistem akan mengirim pengumuman otomatis ke Discord saat pengaturan ini disimpan.' 
                                                : 'Klik untuk mengaktifkan event diskon. Harga di toko akan otomatis berubah.'}
                                        </p>
                                    </div>
                                    <div className={`w-14 h-8 rounded-full flex items-center p-1 transition-colors ${settings.discount_enabled ? 'bg-[var(--brand-secondary)]' : 'bg-gray-300'}`}>
                                        <div className={`w-6 h-6 bg-white rounded-full transition-transform shadow-sm ${settings.discount_enabled ? 'translate-x-6' : 'translate-x-0'}`}></div>
                                    </div>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div>
                                        <label className="block text-sm font-extrabold mb-2" style={{ color: 'var(--text-secondary)' }}>Nama Event</label>
                                        <input
                                            type="text"
                                            value={settings.event_name}
                                            onChange={(e) => setSettings({ ...settings, event_name: e.target.value })}
                                            className="w-full p-4 rounded-xl border-2 focus:bg-white focus:outline-none transition-all font-bold"
                                            style={{ borderColor: 'var(--bg-body)', background: 'rgba(232,224,240,0.3)', color: 'var(--text-primary)' }}
                                            placeholder="Contoh: Idul Fitri"
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-sm font-extrabold mb-2" style={{ color: 'var(--text-secondary)' }}>Persentase Diskon <span className="text-xs font-bold opacity-70">(%)</span></label>
                                        <div className="relative">
                                            <input
                                                type="number"
                                                min="0"
                                                max="100"
                                                value={settings.discount_percentage}
                                                onChange={(e) => setSettings({ ...settings, discount_percentage: Number(e.target.value) })}
                                                className="w-full p-4 pr-10 rounded-xl border-2 focus:bg-white focus:outline-none transition-all font-bold"
                                                style={{ borderColor: 'var(--bg-body)', background: 'rgba(232,224,240,0.3)', color: 'var(--text-primary)' }}
                                            />
                                            <span className="absolute right-4 top-1/2 -translate-y-1/2 font-black text-lg" style={{ color: 'var(--text-muted)' }}>%</span>
                                        </div>
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-sm font-extrabold mb-2" style={{ color: 'var(--text-secondary)' }}>
                                        Waktu Selesai <span className="text-xs font-bold opacity-60">(Otomatis mati saat durasi habis)</span>
                                    </label>
                                    <input
                                        type="datetime-local"
                                        value={settings.discount_timer}
                                        onChange={(e) => setSettings({ ...settings, discount_timer: e.target.value })}
                                        className="w-full p-4 rounded-xl border-2 focus:bg-white focus:outline-none transition-all font-bold"
                                        style={{ borderColor: 'var(--bg-body)', background: 'rgba(232,224,240,0.3)', color: 'var(--text-primary)' }}
                                    />
                                </div>
                            </form>
                        </div>
                    </div>

                    {/* KOLOM KANAN: KUSTOMISASI BANNER */}
                    <div className="space-y-6">
                        <div className="mc-card p-8 relative overflow-hidden bg-white border-0 shadow-lg">
                            <div className="absolute top-0 right-0 w-48 h-48 opacity-5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" style={{ background: 'var(--brand-secondary)' }}></div>

                            <h3 className="text-2xl font-black mb-1 relative z-10 flex items-center gap-2" style={{ color: 'var(--text-primary)' }}>
                                <i className="ri-image-edit-line" style={{ color: 'var(--brand-secondary)' }}></i> Desain Banner Pop-up
                            </h3>
                            <p className="text-sm font-bold mb-6 relative z-10" style={{ color: 'var(--text-muted)' }}>
                                Kustomisasi tampilan banner diskon di halaman Store pengunjung.
                            </p>

                            <div className="space-y-4 relative z-10">
                                <div>
                                    <label className="block text-sm font-extrabold mb-2" style={{ color: 'var(--text-secondary)' }}>
                                        URL Background Image <span className="text-xs font-normal opacity-60">(Opsional)</span>
                                    </label>
                                    <input
                                        type="text"
                                        value={settings.popup_bg_image}
                                        onChange={(e) => setSettings({ ...settings, popup_bg_image: e.target.value })}
                                        className="w-full p-3.5 rounded-xl border-2 focus:bg-white focus:outline-none transition-all font-bold text-sm"
                                        style={{ borderColor: 'var(--bg-body)', background: 'rgba(232,224,240,0.3)', color: 'var(--text-primary)' }}
                                        placeholder="https://example.com/banner.jpg"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-extrabold mb-2" style={{ color: 'var(--text-secondary)' }}>
                                        Headline / Judul Popup
                                    </label>
                                    <input
                                        type="text"
                                        value={settings.popup_title}
                                        onChange={(e) => setSettings({ ...settings, popup_title: e.target.value })}
                                        className="w-full p-3.5 rounded-xl border-2 focus:bg-white focus:outline-none transition-all font-bold text-sm"
                                        style={{ borderColor: 'var(--bg-body)', background: 'rgba(232,224,240,0.3)', color: 'var(--text-primary)' }}
                                        placeholder="Contoh: SPESIAL EVENT IDUL FITRI!"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-extrabold mb-2" style={{ color: 'var(--text-secondary)' }}>
                                        Deskripsi Promo
                                    </label>
                                    <textarea
                                        value={settings.popup_subtitle}
                                        onChange={(e) => setSettings({ ...settings, popup_subtitle: e.target.value })}
                                        rows="2"
                                        className="w-full p-3.5 rounded-xl border-2 focus:bg-white focus:outline-none transition-all font-bold text-sm resize-none"
                                        style={{ borderColor: 'var(--bg-body)', background: 'rgba(232,224,240,0.3)', color: 'var(--text-primary)' }}
                                        placeholder="Berikan alasan menarik mengapa player harus beli sekarang..."
                                    />
                                </div>
                                
                                <div className="pt-2">
                                    <label className="block text-sm font-extrabold mb-2" style={{ color: 'var(--text-secondary)' }}>
                                        Label Flash Text <span className="text-xs font-normal opacity-60">(mis: 20% OFF)</span>
                                    </label>
                                    <input
                                        type="text"
                                        value={settings.popup_discount_text}
                                        onChange={(e) => setSettings({ ...settings, popup_discount_text: e.target.value })}
                                        className="w-full p-3.5 rounded-xl border-2 focus:bg-white focus:outline-none transition-all font-bold text-sm"
                                        style={{ borderColor: 'var(--bg-body)', background: 'rgba(232,224,240,0.3)', color: 'var(--text-primary)' }}
                                        placeholder="20% OFF!"
                                    />
                                </div>
                            </div>
                        </div>

                        {/* LIVE PREVIEW BANNER */}
                        <div className="mt-6 animation-fade-in relative z-10">
                            <p className="text-xs font-extrabold uppercase tracking-widest mb-3 flex items-center justify-between" style={{ color: 'var(--text-muted)' }}>
                                <span>Preview Banner</span>
                                <span className={`text-[10px] px-2 py-0.5 rounded-md text-white font-bold ${settings.discount_enabled ? 'bg-green-500' : 'bg-gray-400'}`}>
                                    {settings.discount_enabled ? "LIVE" : "TERSEMBUNYI"}
                                </span>
                            </p>
                            <div
                                className={`rounded-2xl p-6 sm:p-8 overflow-hidden relative text-white transition-all ${!settings.discount_enabled ? 'grayscale opacity-75' : 'shadow-xl'}`}
                                style={{
                                    background: 'var(--brand-secondary)',
                                    backgroundImage: settings.popup_bg_image ? `url(${settings.popup_bg_image})` : 'none',
                                    backgroundSize: 'cover',
                                    backgroundPosition: 'center'
                                }}
                            >
                                {settings.popup_bg_image && <div className="absolute inset-0 bg-black/50"></div>}
                                <div className="absolute top-0 right-0 w-64 h-64 bg-black opacity-20 rounded-full blur-3xl -translate-y-1/2 translate-x-1/4"></div>
                                
                                <div className="relative z-10 text-center flex flex-col items-center">
                                    <div className="w-12 h-12 bg-white/10 rounded-full flex items-center justify-center mb-4 backdrop-blur-md border border-white/20">
                                        <i className="ri-shopping-bag-3-fill text-2xl text-white"></i>
                                    </div>
                                    <h2 className="text-2xl md:text-3xl font-black mb-3 text-white" style={{ textShadow: '0 4px 12px rgba(0,0,0,0.5)' }}>
                                        {settings.popup_title || `EVENT ${(settings.event_name || 'DISKON').toUpperCase()}!`}
                                    </h2>
                                    <p className="font-bold text-sm leading-relaxed text-white/90 max-w-sm mb-5" style={{ textShadow: '0 2px 6px rgba(0,0,0,0.5)' }}>
                                        {settings.popup_subtitle || `Nikmati diskon eksklusif sebesar ${settings.popup_discount_text || '20%'} untuk semua pembelian Points selama event berlangsung.`}
                                    </p>
                                    
                                    {settings.popup_discount_text && (
                                        <div className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl font-black text-sm shadow-lg bounce-subtle" 
                                             style={{ background: 'linear-gradient(135deg, #FFD700 0%, #FFA500 100%)', color: '#000' }}>
                                            <i className="ri-flashlight-fill"></i> {settings.popup_discount_text}
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>

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
                    <div className="max-w-4xl mx-auto px-4 pb-6">
                        <div
                            className="flex items-center justify-between gap-4 p-5 rounded-2xl shadow-2xl border overflow-hidden relative"
                            style={{
                                background: 'linear-gradient(135deg, #4f46e5 0%, #3730a3 100%)',
                                borderColor: 'rgba(255,255,255,0.15)',
                                boxShadow: '0 -4px 30px rgba(79,70,229,0.35), 0 8px 32px rgba(0,0,0,0.2)'
                            }}
                        >
                            {/* Decorative blobs */}
                            <div className="absolute top-0 right-0 w-32 h-32 bg-white opacity-10 rounded-full blur-2xl -translate-y-1/2 translate-x-1/4"></div>

                            <div className="flex items-center gap-4 relative z-10">
                                <div className="w-10 h-10 rounded-xl bg-white/20 flex items-center justify-center backdrop-blur-sm border border-white/20">
                                    <i className="ri-save-3-line text-2xl text-white" />
                                </div>
                                <div>
                                    <span className="text-white font-black text-base block leading-tight">Perubahan Belum Tersimpan</span>
                                    <span className="text-white/70 font-bold text-xs">Anda melakukan perubahan pada konfigurasi toko</span>
                                </div>
                            </div>
                            <div className="flex items-center gap-3 relative z-10">
                                <button
                                    onClick={handleDiscard}
                                    className="px-5 py-2.5 rounded-xl text-sm font-extrabold transition-all hover:bg-white/20 border border-transparent hover:border-white/30 text-white/80 hover:text-white"
                                >
                                    Batal
                                </button>
                                <button
                                    onClick={handleSave}
                                    disabled={isSaving}
                                    className="px-6 py-2.5 rounded-xl text-sm font-black transition-all hover:scale-105 disabled:opacity-50 flex items-center gap-2"
                                    style={{ background: '#fff', color: '#3730a3', boxShadow: '0 4px 16px rgba(0,0,0,0.15)' }}
                                >
                                    {isSaving ? <i className="ri-loader-4-line animate-spin text-lg" /> : <i className="ri-check-line text-lg" />}
                                    {isSaving ? 'Menyimpan...' : 'Simpan Perubahan'}
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </AdminLayout>
    )
}
