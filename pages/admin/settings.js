import { useState, useEffect } from 'react'
import AdminLayout from '../../components/admin/AdminLayout'

export default function AdminSettings() {
    const [settings, setSettings] = useState({
        event_name: 'Idul Fitri',
        discount_enabled: false,
        base_price_per_500: 5000,
        discounted_price_per_500: 4000
    })
    const [isLoading, setIsLoading] = useState(true)
    const [isSaving, setIsSaving] = useState(false)
    const [message, setMessage] = useState('')

    useEffect(() => {
        fetch('/api/admin/settings')
            .then(res => res.json())
            .then(data => {
                if (data && data.id) {
                    setSettings({
                        event_name: data.event_name,
                        discount_enabled: Boolean(data.discount_enabled),
                        base_price_per_500: data.base_price_per_500,
                        discounted_price_per_500: data.discounted_price_per_500
                    })
                }
                setIsLoading(false)
            })
            .catch(e => {
                console.error("Failed to fetch settings:", e)
                setIsLoading(false)
            })
    }, [])

    async function handleSave(e) {
        e.preventDefault()
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
            } else {
                setMessage('Error: ' + data.message)
            }
        } catch (error) {
            setMessage('Error connecting to API')
        }
        setIsSaving(false)
    }

    if (isLoading) return <AdminLayout title="Store Settings">Loading...</AdminLayout>

    return (
        <AdminLayout title="Store Settings">
            <div className="mc-card p-6 max-w-2xl">
                {message && (
                    <div className="mb-6 p-4 rounded-xl bg-[#dcfce7] border border-[#16a34a] text-[#15803d] font-bold">
                        {message}
                    </div>
                )}

                <form onSubmit={handleSave} className="space-y-6">
                    <div>
                        <label className="block text-sm font-bold mb-2">Event Name</label>
                        <input
                            type="text"
                            value={settings.event_name}
                            onChange={(e) => setSettings({ ...settings, event_name: e.target.value })}
                            className="w-full p-3 rounded-xl border border-[#e8e0f0] bg-[#f5f3f8] focus:outline-none focus:border-[#E26E10]"
                        />
                    </div>

                    <div className="flex items-center gap-3">
                        <input
                            type="checkbox"
                            checked={settings.discount_enabled}
                            onChange={(e) => setSettings({ ...settings, discount_enabled: e.target.checked })}
                            id="discount_enabled"
                            className="w-5 h-5 rounded border-[#e8e0f0]"
                        />
                        <label htmlFor="discount_enabled" className="text-sm font-bold cursor-pointer">
                            Enable Discount Event
                        </label>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-bold mb-2">Base Price (Per 500 Points)</label>
                            <input
                                type="number"
                                value={settings.base_price_per_500}
                                onChange={(e) => setSettings({ ...settings, base_price_per_500: Number(e.target.value) })}
                                className="w-full p-3 rounded-xl border border-[#e8e0f0] bg-[#f5f3f8] focus:outline-none focus:border-[#E26E10]"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-bold mb-2">Discount Price (Per 500 Points)</label>
                            <input
                                type="number"
                                value={settings.discounted_price_per_500}
                                onChange={(e) => setSettings({ ...settings, discounted_price_per_500: Number(e.target.value) })}
                                className="w-full p-3 rounded-xl border border-[#e8e0f0] bg-[#f5f3f8] focus:outline-none focus:border-[#E26E10]"
                            />
                        </div>
                    </div>

                    <button
                        type="submit"
                        disabled={isSaving}
                        className="w-full py-3 bg-[#E26E10] text-white rounded-xl font-extrabold hover:bg-[#c25e0e] transition-colors disabled:opacity-50"
                    >
                        {isSaving ? 'Saving...' : 'Save Settings'}
                    </button>
                </form>
            </div>
        </AdminLayout>
    )
}
