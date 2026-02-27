import AdminLayout from '../../components/admin/AdminLayout'

export default function AdminDashboard() {
    return (
        <AdminLayout title="Dashboard Overview">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
                <div className="mc-card p-6 border-l-4 border-l-[#16a34a]">
                    <h3 className="text-[#78716c] font-bold text-sm mb-1">Status Webhook</h3>
                    <p className="text-2xl font-black text-[#1c1917]">Aktif</p>
                </div>
                <div className="mc-card p-6 border-l-4 border-l-[#3b82f6]">
                    <h3 className="text-[#78716c] font-bold text-sm mb-1">Total Produk</h3>
                    <p className="text-2xl font-black text-[#1c1917]">8 Produk</p>
                </div>
                <div className="mc-card p-6 border-l-4 border-l-[#E26E10]">
                    <h3 className="text-[#78716c] font-bold text-sm mb-1">Database</h3>
                    <p className="text-2xl font-black text-[#1c1917]">Terkoneksi</p>
                </div>
            </div>

            <div className="mc-card p-6">
                <h3 className="text-xl font-extrabold mb-4 text-[#1c1917]">Langkah Selanjutnya</h3>
                <ul className="list-disc list-inside space-y-2 text-[#44403c] font-medium text-sm">
                    <li>Edit produk dan commands yang akan dijalankan ke Pterodactyl di menu <b>Products & Commands</b>.</li>
                    <li>Update event diskon dan harga points di menu <b>Store Settings</b>.</li>
                    <li>Konfigurasikan webhook URL di akun Trakteer: <code>https://trinityindonesia.cc/api/trakteer?token=YOUR_TOKEN</code></li>
                </ul>
            </div>
        </AdminLayout>
    )
}
