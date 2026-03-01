import { Wrapper } from '@layer/components/layout/Wrapper.jsx'

export default function RefundPolicy() {
    return (
        <Wrapper
            title="Refund Policy"
            description="Kebijakan Pengembalian Dana (Refund) Trinity Indonesia"
            path="/refund"
        >
            <div className="mc-card p-6 sm:p-10">
                <h1 className="text-3xl sm:text-4xl font-black mb-6" style={{ color: 'var(--brand-secondary)' }}>Refund Policy</h1>

                <div className="space-y-6 text-sm sm:text-base leading-relaxed" style={{ color: 'var(--text-secondary)' }}>
                    <p>
                        Kebijakan pengembalian dana ini menguraikan ketentuan di mana Anda berhak untuk meminta pengembalian dana (refund) untuk pembelian yang dilakukan di store Trinity Indonesia.
                    </p>

                    <h2 className="text-xl font-bold mt-8 mb-4 flex items-center gap-2" style={{ color: '#16a34a' }}>
                        <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
                        Refund Tersedia Jika:
                    </h2>
                    <ul className="list-disc pl-6 space-y-2">
                        <li>
                            <strong style={{ color: 'var(--text-primary)' }}>Produk Tidak Terkirim.</strong> Anda berhasil melakukan pembayaran tetapi produk (Points/Barang) tidak masuk ke akun Anda dalam waktu 24 jam karena kesalahan sistem kami.
                        </li>
                        <li>
                            <strong style={{ color: 'var(--text-primary)' }}>Gangguan Payment Gateway.</strong> Terjadi kesalahan atau gangguan dari pihak Payment Gateway (seperti Tako) yang menyebabkan dana terpotong namun transaksi tercatat gagal di sistem kami.
                        </li>
                        <li>
                            <strong style={{ color: 'var(--text-primary)' }}>Pengiriman Produk Gagal.</strong> Sistem gagal mengirimkan produk ke akun yang dituju meskipun pembayaran telah diverifikasi sepenuhnya.
                        </li>
                    </ul>

                    <h2 className="text-xl font-bold mt-8 mb-4 flex items-center gap-2" style={{ color: '#dc2626' }}>
                        <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
                        Refund TIDAK Diberikan Jika:
                    </h2>
                    <ul className="list-disc pl-6 space-y-2">
                        <li>
                            <strong style={{ color: 'var(--text-primary)' }}>Player Di-Banned.</strong> Akun pembeli di-banned atau dihukum dari jaringan server Trinity Indonesia karena melanggar aturan server setelah pembelian dilakukan.
                        </li>
                        <li>
                            <strong style={{ color: 'var(--text-primary)' }}>Kesalahan Input Nickname/Platform.</strong> Pembeli salah memasukkan target nickname pengiriman (typo) atau salah memilih platform (Java/Bedrock) saat login untuk melakukan pembayaran. Titik pada pengguna Bedrock merupakan tanggung jawab pembeli untuk mengecek ulang di konfirmasi.
                        </li>
                        <li>
                            <strong style={{ color: 'var(--text-primary)' }}>Masa Maintenance.</strong> Produk terkendala terkirim dalam waktu normal dikarenakan server sedang dalam masa pemeliharaan terencana yang telah diumumkan sebelumnya.
                        </li>
                        <li>
                            <strong style={{ color: 'var(--text-primary)' }}>Hal Diluar Kontrol Trinity Indonesia.</strong> Masalah yang disebabkan oleh pihak ketiga di luar kendali dan wewenang kami.
                        </li>
                        <li>
                            <strong style={{ color: 'var(--text-primary)' }}>Perubahan Keputusan.</strong> Anda berubah pikiran setelah produk berhasil diterima, atau jika poin hasil pembelian telah terpakai/dihabiskan untuk transaksi in-game.
                        </li>
                        <li>
                            <strong style={{ color: 'var(--text-primary)' }}>Nama Pengirim Diubah Saat Pembayaran.</strong> Anda dengan sengaja mengubah nama pengirim di laman Payment Gateway, yang mengakibatkan sistem otomatis kami gagal membaca nickname tujuan pengiriman pembelian.
                        </li>
                    </ul>

                    <div className="mt-8 p-6 rounded-xl border" style={{ background: '#fef2f2', borderColor: '#fecaca' }}>
                        <h3 className="font-bold mb-2" style={{ color: '#dc2626' }}>Peringatan Keras (Chargebacks / Disputes)</h3>
                        <p className="text-sm" style={{ color: '#b91c1c' }}>
                            Upaya melakukan sengketa pembayaran (dispute), penarikan dana paksa (chargeback), atau penipuan melalui metode pembayaran Anda tanpa persetujuan atau diskusi terlebih dahulu dengan staf kami akan mengakibatkan akun in-game (termasuk alamat IP dan akun alt) di-banned secara permanen dari seluruh jaringan Trinity Indonesia.
                        </p>
                    </div>

                    <h2 className="text-xl font-bold mt-8 mb-4" style={{ color: 'var(--text-primary)' }}>Proses Permintaan Refund</h2>
                    <p>
                        Jika Anda memenuhi syarat dan ingin mengajukan permohonan pengembalian dana, silakan buka tiket (Open Ticket) melalui Discord resmi kami (<strong>discord.trinityindonesia.cc</strong>). Harap sertakan:
                    </p>
                    <ul className="list-disc pl-6 space-y-2 mb-6">
                        <li>Nickname in-game</li>
                        <li>Bukti transfer/struk pembayaran dari Payment Gateway</li>
                        <li>ID Transaksi (jika ada)</li>
                        <li>Tanggal dan waktu transaksi</li>
                    </ul>

                    <div className="mt-8 pt-6 border-t font-bold" style={{ borderColor: '#e8e0f0', color: 'var(--text-muted)' }}>
                        Pembaruan Terakhir: {new Date().toLocaleDateString('id-ID', { year: 'numeric', month: 'long', day: 'numeric' })}
                    </div>
                </div>
            </div>
        </Wrapper>
    )
}
