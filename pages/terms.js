import { Wrapper } from '@layer/components/layout/Wrapper.jsx'

export default function TermsOfService() {
    return (
        <Wrapper
            title="Terms of Service"
            description="Syarat dan Ketentuan Layanan Trinity Indonesia"
            path="/terms"
        >
            <div className="mc-card p-6 sm:p-10">
                <h1 className="text-3xl sm:text-4xl font-black mb-6" style={{ color: 'var(--brand-secondary)' }}>Terms of Service</h1>

                <div className="space-y-6 text-sm sm:text-base leading-relaxed" style={{ color: 'var(--text-secondary)' }}>
                    <p>
                        Syarat dan Ketentuan Layanan (Terms of Service) ini mengatur akses dan penggunaan Anda terhadap layanan situs web dan server Minecraft Trinity Indonesia. Dengan mengakses layanan kami, Anda menyetujui syarat-syarat berikut:
                    </p>

                    <h2 className="text-xl font-bold mt-8 mb-4" style={{ color: 'var(--text-primary)' }}>1. Akun dan Keamanan</h2>
                    <ul className="list-disc pl-6 space-y-2">
                        <li>Satu player hanya boleh memiliki 1 akun yang terdaftar.</li>
                        <li>Setiap pemain bertanggung jawab penuh atas keamanan akun miliknya sendiri. Segala pelanggaran yang terjadi melalui akun tersebut, termasuk jika akun diretas atau dipinjamkan, tetap dikenakan sanksi tanpa pengecualian.</li>
                        <li>Dilarang membagikan kredensial login (password, dll) kepada siapa pun. Staff tidak pernah dan tidak akan pernah meminta password pemain.</li>
                        <li>Jual-beli akun, transfer kepemilikan akun, atau berpura-pura menjadi staff/pihak resmi server dilarang keras.</li>
                        <li>Kami berhak memberi hukuman kepada pemain tanpa memberikan bukti.</li>
                    </ul>

                    <h2 className="text-xl font-bold mt-8 mb-4" style={{ color: 'var(--text-primary)' }}>2. Transaksi & Kebijakan Points</h2>
                    <ul className="list-disc pl-6 space-y-2">
                        <li>Semua pembelian Points bersifat final. Kebijakan mengenai pengembalian dana selengkapnya dapat dilihat pada halaman <a href="/refund" className="hover:underline" style={{ color: 'var(--brand-secondary)' }}>Refund Policy</a>.</li>
                        <li>Melakukan chargeback atau dispute pembayaran melalui pihak ketiga dianggap sebagai tindakan agresif terhadap server dan akan ditindak tegas.</li>
                        <li>Points tidak dapat dijual, ditukar dengan uang nyata, atau dipindahtangankan ke pemain lain.</li>
                    </ul>

                    <h2 className="text-xl font-bold mt-8 mb-4" style={{ color: 'var(--text-primary)' }}>3. Privasi & Aktivitas Ilegal</h2>
                    <ul className="list-disc pl-6 space-y-2">
                        <li>Dilarang keras melakukan doxxing, yaitu menyebarkan informasi pribadi pemain lain.</li>
                        <li>Serangan DDoS/DoS, peretasan sistem server, dan penyebaran malware, virus, atau link phishing merupakan pelanggaran fatal yang akan ditindak dengan sanksi maksimal dan dapat dilimpahkan ke pihak berwajib.</li>
                    </ul>

                    <h2 className="text-xl font-bold mt-8 mb-4" style={{ color: 'var(--text-primary)' }}>4. Hak Cipta & Konten</h2>
                    <ul className="list-disc pl-6 space-y-2">
                        <li>Seluruh aset server (logo, desain, plugin, peta) adalah milik eksklusif Trinity Indonesia dan tidak boleh digunakan untuk kepentingan komersial tanpa izin tertulis.</li>
                        <li>Pemain boleh membuat konten (video, streaming) yang menampilkan server selama mencantumkan kredit yang jelas.</li>
                        <li>Pembuatan konten yang bertujuan mencemarkan nama baik server, menyebarkan hoaks, atau provokasi merupakan pelanggaran berat.</li>
                    </ul>

                    <h2 className="text-xl font-bold mt-8 mb-4" style={{ color: 'var(--text-primary)' }}>5. Status Verified Player</h2>
                    <ul className="list-disc pl-6 space-y-2">
                        <li>Status Verified adalah bentuk pengakuan resmi dari Trinity Indonesia yang diberikan kepada figur publik, konten kreator aktif, atau anggota komunitas yang memiliki rekam jejak kontribusi positif yang luar biasa.</li>
                        <li><b>Keuntungan:</b> Pemain yang terverifikasi akan mendapatkan badge icon &#10003; biru resmi di Leaderboard website dan juga akan mendapatkan tag khusus [Verified] di dalam game.</li>
                        <li><b>Syarat Pemeliharaan Status:</b>
                            <ul className="list-circle pl-6 mt-2 space-y-1">
                                <li>Pemain harus menjaga nama baik server Trinity Indonesia baik di dalam game maupun di platform luar (sosial media, dll).</li>
                                <li>Tidak boleh terlibat dalam drama toksik, eksploitasi bug fatal, penggunaan program ilegal (cheat), atau pelanggaran berat lainnya.</li>
                            </ul>
                        </li>
                        <li>Pihak manajemen Trinity Indonesia berhak penuh mencabut status Verified kapan saja tanpa pemberitahuan sebelumnya jika pemain terbukti melanggar Syarat dan Ketentuan ini atau merusak citra server.</li>
                    </ul>

                    <h2 className="text-xl font-bold mt-8 mb-4" style={{ color: 'var(--text-primary)' }}>6. Perubahan Syarat dan Ketentuan</h2>
                    <p>
                        Kami berhak untuk memperbarui dan mengubah Syarat dan Layanan ini sewaktu-waktu tanpa pemberitahuan sebelumnya. Penggunaan berkelanjutan atas layanan kami merupakan persetujuan Anda terhadap perubahan ini.
                    </p>

                    <div className="mt-8 pt-6 border-t font-bold" style={{ borderColor: '#e8e0f0', color: 'var(--text-muted)' }}>
                        Pembaruan Terakhir: {new Date().toLocaleDateString('id-ID', { year: 'numeric', month: 'long', day: 'numeric' })}
                    </div>
                </div>
            </div>
        </Wrapper>
    )
}
