import { useState, useEffect } from 'react'
import AdminLayout from '../../components/admin/AdminLayout'

export default function AdminUpdates() {
    const [updates, setUpdates] = useState([])
    const [isLoading, setIsLoading] = useState(true)

    const [isFormOpen, setIsFormOpen] = useState(false)
    const [editId, setEditId] = useState(null)
    const [formData, setFormData] = useState({
        month_group: '',
        title: '',
        type: 'added',
        icon: 'ri-sparkling-2-line',
        contentRaw: '',
        patch_date: ''
    })

    const [isSubmitting, setIsSubmitting] = useState(false)

    useEffect(() => {
        fetchUpdates()
    }, [])

    async function fetchUpdates() {
        try {
            const res = await fetch('/api/admin/updates')
            const data = await res.json()
            if (Array.isArray(data)) setUpdates(data)
            setIsLoading(false)
        } catch (e) {
            console.error(e)
            setIsLoading(false)
        }
    }

    function handleOpenForm(update = null) {
        if (update) {
            setEditId(update.id);
            // Convert JSON array back to text block
            let parsedContent = [];
            try {
                parsedContent = typeof update.content === 'string' ? JSON.parse(update.content) : update.content;
            } catch (e) {
                parsedContent = update.content || [];
            }
            const textContent = Array.isArray(parsedContent) ? parsedContent.map(c => `${c.num} ${c.text}`).join('\n') : '';
            setFormData({
                month_group: update.month_group,
                title: update.title,
                type: update.type || 'added',
                icon: update.icon || 'ri-sparkling-2-line',
                contentRaw: textContent,
                patch_date: update.patch_date ? update.patch_date.split('T')[0] : ''
            });
        } else {
            setEditId(null);
            setFormData({
                month_group: '',
                title: '',
                type: 'added',
                icon: 'ri-sparkling-2-line',
                contentRaw: '',
                patch_date: new Date().toISOString().split('T')[0]
            });
        }
        setIsFormOpen(true);
    }

    async function handleSubmit(e) {
        e.preventDefault();
        setIsSubmitting(true);

        // Parse contentRaw to JSON array
        const lines = formData.contentRaw.split('\n').filter(l => l.trim() !== '');
        const parsedContent = lines.map(line => {
            const match = line.trim().match(/^([+\-*])\s*(.*)$/);
            if (match) return { num: match[1], text: match[2] };
            return { num: "*", text: line.trim() };
        });

        const payload = {
            month_group: formData.month_group,
            title: formData.title,
            type: formData.type,
            icon: formData.icon || 'ri-sparkling-2-line',
            content: parsedContent,
            patch_date: formData.patch_date || null
        };

        try {
            if (editId) {
                payload.id = editId;
                await fetch('/api/admin/updates', {
                    method: 'PUT',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(payload)
                });
            } else {
                await fetch('/api/admin/updates', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(payload)
                });
            }
            setIsFormOpen(false);
            fetchUpdates();
        } catch (err) {
            console.error(err);
            alert("Gagal menahan data.");
        }
        setIsSubmitting(false);
    }

    async function handleDelete(id) {
        if (!confirm('Hapus update ini?')) return;
        await fetch(`/api/admin/updates?id=${id}`, { method: 'DELETE' });
        fetchUpdates();
    }

    if (isLoading) return (
        <AdminLayout title="Server Updates">
            <div className="mc-card overflow-hidden border-0 shadow-lg relative z-10 bg-white">
                <div className="p-6 md:p-8 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4" style={{ borderBottom: '1px solid var(--bg-body)', background: 'rgba(232,224,240,0.3)' }}>
                    <div>
                        <div className="h-8 bg-gray-200 rounded w-48 mb-2 animate-pulse"></div>
                        <div className="h-4 bg-gray-200 rounded w-64 animate-pulse"></div>
                    </div>
                    <div className="h-10 bg-gray-200 rounded-xl w-40 animate-pulse"></div>
                </div>
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr style={{ background: 'var(--bg-card)', color: 'var(--text-secondary)' }} className="text-xs uppercase tracking-widest">
                                <th className="p-5" style={{ borderBottom: '1px solid var(--bg-body)' }}><div className="h-4 bg-gray-200 rounded w-16 animate-pulse"></div></th>
                                <th className="p-5" style={{ borderBottom: '1px solid var(--bg-body)' }}><div className="h-4 bg-gray-200 rounded w-24 animate-pulse"></div></th>
                                <th className="p-5" style={{ borderBottom: '1px solid var(--bg-body)' }}><div className="h-4 bg-gray-200 rounded w-16 animate-pulse"></div></th>
                                <th className="p-5" style={{ borderBottom: '1px solid var(--bg-body)' }}><div className="h-4 bg-gray-200 rounded w-20 animate-pulse"></div></th>
                                <th className="p-5 w-24" style={{ borderBottom: '1px solid var(--bg-body)' }}><div className="h-4 bg-gray-200 rounded w-12 animate-pulse"></div></th>
                            </tr>
                        </thead>
                        <tbody className="text-sm border-t-0 animate-pulse">
                            {[...Array(5)].map((_, i) => (
                                <tr key={i} style={{ borderBottom: '1px solid var(--bg-body)' }}>
                                    <td className="p-5"><div className="h-4 bg-gray-200 rounded w-24"></div></td>
                                    <td className="p-5"><div className="h-5 bg-gray-200 rounded w-32"></div></td>
                                    <td className="p-5"><div className="h-6 bg-gray-200 rounded-lg w-16"></div></td>
                                    <td className="p-5"><div className="h-4 bg-gray-200 rounded w-16"></div></td>
                                    <td className="p-5 flex items-center gap-2">
                                        <div className="w-8 h-8 bg-gray-200 rounded-lg"></div>
                                        <div className="w-8 h-8 bg-gray-200 rounded-lg"></div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </AdminLayout>
    )

    return (
        <AdminLayout title="Server Updates">
            <div className="mc-card overflow-hidden border-0 shadow-lg relative z-10 bg-white">
                <div className="p-6 md:p-8 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4" style={{ borderBottom: '1px solid var(--bg-body)', background: 'rgba(232,224,240,0.3)' }}>
                    <div>
                        <h3 className="text-2xl font-black" style={{ color: 'var(--text-primary)' }}>Server Updates</h3>
                        <p className="text-sm font-bold mt-2" style={{ color: 'var(--text-muted)' }}>
                            Kelola Patch Notes dan Update Log yang tampil di halaman utama.
                        </p>
                    </div>

                    {!isFormOpen && (
                        <button
                            onClick={() => handleOpenForm()}
                            className="mc-btn font-extrabold shadow-sm flex items-center gap-2"
                        >
                            <i className="ri-add-line text-lg" /> Tambah Patch
                        </button>
                    )}
                </div>

                {isFormOpen && (
                    <div className="p-6 border-b" style={{ background: '#faf9fb', borderColor: 'var(--bg-body)' }}>
                        <form onSubmit={handleSubmit} className="space-y-4 max-w-2xl">
                            <h4 className="font-extrabold text-lg mb-4" style={{ color: 'var(--text-primary)' }}>
                                {editId ? 'Edit Patch Note' : 'Tambah Patch Baru'}
                            </h4>

                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-bold mb-1" style={{ color: 'var(--text-secondary)' }}>Bulan (Misal: MARET 2026)</label>
                                    <input required type="text" className="w-full mc-input" value={formData.month_group} onChange={e => setFormData({ ...formData, month_group: e.target.value })} placeholder="MARET 2026" />
                                </div>
                                <div>
                                    <label className="block text-sm font-bold mb-1" style={{ color: 'var(--text-secondary)' }}>Versi / Judul (Misal: 2026.03.1)</label>
                                    <input required type="text" className="w-full mc-input" value={formData.title} onChange={e => setFormData({ ...formData, title: e.target.value })} placeholder="2026.03.1" />
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-bold mb-1" style={{ color: 'var(--text-secondary)' }}>Label Type</label>
                                <select className="w-full mc-input" value={formData.type} onChange={e => setFormData({ ...formData, type: e.target.value })}>
                                    <option value="added">Added (Fitur Baru - Warna Hijau)</option>
                                    <option value="fixed">Fixed (Perbaikan Bug - Warna Biru)</option>
                                    <option value="removed">Removed (Penghapusan - Warna Merah)</option>
                                </select>
                            </div>

                            {/* Icon Picker */}
                            <div>
                                <label className="block text-sm font-bold mb-1" style={{ color: 'var(--text-secondary)' }}>
                                    Icon Remix Icons <span className="font-normal text-xs opacity-70">(class ri-xxx, cari di <a href="https://remixicon.com" target="_blank" rel="noopener noreferrer" style={{ color: 'var(--brand-secondary)' }}>remixicon.com</a>)</span>
                                </label>
                                <div className="flex items-center gap-3">
                                    {/* Preview */}
                                    <div className="w-11 h-11 rounded-xl flex items-center justify-center flex-shrink-0 border-2" style={{ background: '#f0edf4', borderColor: 'var(--bg-body)' }}>
                                        <i className={`${formData.icon || 'ri-sparkling-2-line'} text-2xl`} style={{ color: 'var(--brand-secondary)' }} />
                                    </div>
                                    <input
                                        type="text"
                                        className="flex-1 mc-input font-mono text-sm"
                                        value={formData.icon}
                                        onChange={e => setFormData({ ...formData, icon: e.target.value })}
                                        placeholder="ri-sparkling-2-line"
                                    />
                                </div>
                                {/* Quick picks */}
                                <div className="flex flex-wrap gap-2 mt-2">
                                    {[
                                        'ri-sparkling-2-line', 'ri-sword-line', 'ri-shield-line', 'ri-bug-line',
                                        'ri-fire-line', 'ri-star-line', 'ri-trophy-line', 'ri-settings-3-line',
                                        'ri-user-line', 'ri-hammer-line', 'ri-map-line', 'ri-rocket-line',
                                        'ri-gift-line', 'ri-anchor-line', 'ri-heart-line', 'ri-checkbox-circle-line',
                                        'ri-time-line', 'ri-cloud-line', 'ri-thunderstorms-line', 'ri-leaf-line',
                                    ].map(ic => (
                                        <button
                                            key={ic}
                                            type="button"
                                            title={ic}
                                            onClick={() => setFormData({ ...formData, icon: ic })}
                                            className={`w-9 h-9 rounded-lg flex items-center justify-center transition-all border-2 ${formData.icon === ic ? 'border-[var(--brand-secondary)] bg-[rgba(226,110,16,0.08)]' : 'border-transparent bg-[#f0edf4] hover:bg-[#e8e0f0]'}`}
                                        >
                                            <i className={`${ic} text-lg`} style={{ color: formData.icon === ic ? 'var(--brand-secondary)' : 'var(--text-muted)' }} />
                                        </button>
                                    ))}
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-bold mb-1" style={{ color: 'var(--text-secondary)' }}>Tanggal Patch</label>
                                <input required type="date" className="w-full mc-input" value={formData.patch_date} onChange={e => setFormData({ ...formData, patch_date: e.target.value })} />
                            </div>

                            <div>
                                <label className="block text-sm font-bold mb-1" style={{ color: 'var(--text-secondary)' }}>
                                    Isi Patch Notes <span className="font-normal text-xs">(Gunakan prefix +, -, atau * di awal baris)</span>
                                </label>
                                <textarea
                                    required
                                    className="w-full mc-input h-32"
                                    value={formData.contentRaw}
                                    onChange={e => setFormData({ ...formData, contentRaw: e.target.value })}
                                    placeholder="+ Fitur baru OneBlock&#10;* Perbaikan bug dupe&#10;- Menghapus system lama"
                                />
                            </div>

                            <div className="flex items-center gap-3 pt-2">
                                <button type="submit" disabled={isSubmitting} className="mc-btn font-bold">
                                    {isSubmitting ? 'Menyimpan...' : 'Simpan Patch'}
                                </button>
                                <button type="button" onClick={() => setIsFormOpen(false)} className="mc-btn mc-btn-outline font-bold">
                                    Batal
                                </button>
                            </div>
                        </form>
                    </div>
                )}

                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr style={{ background: 'var(--bg-card)', color: 'var(--text-secondary)' }} className="text-xs uppercase tracking-widest">
                                <th className="p-5 font-black" style={{ borderBottom: '1px solid var(--bg-body)' }}>Bulan</th>
                                <th className="p-5 font-black" style={{ borderBottom: '1px solid var(--bg-body)' }}>Tanggal</th>
                                <th className="p-5 font-black" style={{ borderBottom: '1px solid var(--bg-body)' }}>Title</th>
                                <th className="p-5 font-black" style={{ borderBottom: '1px solid var(--bg-body)' }}>Label</th>
                                <th className="p-5 font-black" style={{ borderBottom: '1px solid var(--bg-body)' }}>Isi Notes</th>
                                <th className="p-5 font-black w-24" style={{ borderBottom: '1px solid var(--bg-body)' }}>Aksi</th>
                            </tr>
                        </thead>
                        <tbody className="text-sm" style={{ '--tw-divide-opacity': 1 }}>
                            {updates.length > 0 ? updates.map(update => (
                                <tr key={update.id} className="hover:bg-[var(--brand-primary)]/5 transition-colors group" style={{ borderBottom: '1px solid var(--bg-body)' }}>
                                    <td className="p-5 font-bold" style={{ color: 'var(--text-secondary)' }}>{update.month_group}</td>
                                    <td className="p-5 font-bold" style={{ color: 'var(--text-secondary)' }}>{update.patch_date ? new Date(update.patch_date).toLocaleDateString('id-ID') : '-'}</td>
                                    <td className="p-5 font-extrabold" style={{ color: 'var(--text-primary)' }}>{update.title}</td>
                                    <td className="p-5">
                                        <div className={`inline-flex px-2 py-1 rounded-md text-xs font-bold uppercase shadow-sm
                                            ${update.type === 'added' ? 'bg-green-100 text-green-700' : update.type === 'removed' ? 'bg-red-100 text-red-700' : 'bg-blue-100 text-blue-700'}
                                        `}>
                                            {update.type || 'added'}
                                        </div>
                                    </td>
                                    <td className="p-5 text-xs font-mono" style={{ color: 'var(--text-muted)' }}>
                                        {update.content.length} Lines
                                    </td>
                                    <td className="p-5 flex items-center gap-2">
                                        <button onClick={() => handleOpenForm(update)} className="p-2 bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100" title="Edit">
                                            <i className="ri-edit-line text-base" />
                                        </button>
                                        <button onClick={() => handleDelete(update.id)} className="p-2 bg-red-50 text-red-600 rounded-lg hover:bg-red-100" title="Hapus">
                                            <i className="ri-delete-bin-6-line text-base" />
                                        </button>
                                    </td>
                                </tr>
                            )) : (
                                <tr>
                                    <td colSpan="5" className="p-12 text-center font-bold italic" style={{ color: 'var(--text-muted)', background: 'rgba(232,224,240,0.2)' }}>
                                        Belum ada data patch notes.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </AdminLayout>
    )
}
