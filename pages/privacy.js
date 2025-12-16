import { Wrapper } from '@layer/components/layout/Wrapper.jsx'

export default function PrivacyPolicy() {
    return (
        <Wrapper seo={{ title: 'Kebijakan Privasi' }}>
            <div className="pt-32 pb-20">
                <div className="container max-w-4xl">
                    {/* Header */}
                    <div className="text-center mb-12">
                        <h1 className="text-4xl md:text-5xl font-bold mb-4">
                            <span className="text-white">Kebijakan</span>
                            <span className="gradient-text"> Privasi</span>
                        </h1>
                        <p className="text-gray-400">Terakhir diperbarui: Desember 2025</p>
                    </div>

                    {/* Content */}
                    <div className="glass-card rounded-3xl p-8 md:p-12 space-y-10">
                        {/* 0 */}
                        <section>
                            <h2 className="text-2xl font-bold text-white mb-4">0. Ruang Lingkup & Persetujuan</h2>
                            <div className="text-gray-400 space-y-3">
                                <p>
                                    Kebijakan Privasi ini menjelaskan cara Trinity Indonesia (“kami”) mengumpulkan, menggunakan, menyimpan,
                                    mengungkapkan, dan melindungi data terkait penggunaan server Minecraft, website, store, layanan pembelian
                                    (termasuk gems), serta kanal dukungan resmi kami.
                                </p>
                                <p>
                                    Dengan mengakses atau menggunakan layanan Trinity Indonesia, Anda menyatakan telah membaca, memahami,
                                    dan menyetujui pemrosesan data sebagaimana dijelaskan di dokumen ini.
                                </p>
                                <p className="text-gray-500">
                                    Catatan: Kebijakan Privasi mengatur data. Aturan bermain, sanksi, dan ketentuan pembelian/produk diatur di
                                    Syarat & Ketentuan/Rules server (jika ada).
                                </p>
                            </div>
                        </section>

                        {/* 1 */}
                        <section>
                            <h2 className="text-2xl font-bold text-white mb-4">1. Definisi Singkat</h2>
                            <div className="text-gray-400 space-y-3">
                                <ul className="list-disc list-inside space-y-2 ml-4">
                                    <li><strong className="text-white">Data Pribadi:</strong> data yang mengidentifikasi atau dapat mengidentifikasi Anda, langsung atau tidak langsung.</li>
                                    <li><strong className="text-white">Layanan:</strong> server Minecraft, website, dashboard, store, sistem top-up/pembelian, dan fitur terkait.</li>
                                    <li><strong className="text-white">Pengguna:</strong> pemain, pengunjung website, pembeli, atau pihak yang menghubungi dukungan kami.</li>
                                    <li><strong className="text-white">Pihak Ketiga:</strong> penyedia pembayaran (mis. TriPay), penyedia hosting/infrastruktur, dan layanan pendukung lain.</li>
                                </ul>
                            </div>
                        </section>

                        {/* 2 */}
                        <section>
                            <h2 className="text-2xl font-bold text-white mb-4">2. Data yang Kami Kumpulkan</h2>
                            <div className="text-gray-400 space-y-4">
                                <p>Kami mengumpulkan data secara terbatas sesuai kebutuhan operasional layanan.</p>

                                <div className="space-y-3">
                                    <p className="text-white font-semibold">2.1 Data Akun & Identitas Game</p>
                                    <ul className="list-disc list-inside space-y-2 ml-4">
                                        <li><strong className="text-white">Username Minecraft</strong> dan <strong className="text-white">UUID</strong> (identifikasi akun di server).</li>
                                        <li><strong className="text-white">Data perangkat/klien seperlunya</strong> (mis. versi game) untuk kompatibilitas dan anti-penyalahgunaan.</li>
                                    </ul>
                                </div>

                                <div className="space-y-3">
                                    <p className="text-white font-semibold">2.2 Data Teknis & Keamanan</p>
                                    <ul className="list-disc list-inside space-y-2 ml-4">
                                        <li><strong className="text-white">Alamat IP</strong>, log koneksi, waktu akses, dan indikator keamanan (anti-bot/anti-abuse).</li>
                                        <li><strong className="text-white">Log aktivitas dalam game</strong> (mis. perintah tertentu, aktivitas ekonomi, laporan moderasi) untuk penegakan rules dan investigasi insiden.</li>
                                    </ul>
                                </div>

                                <div className="space-y-3">
                                    <p className="text-white font-semibold">2.3 Data Transaksi & Store</p>
                                    <ul className="list-disc list-inside space-y-2 ml-4">
                                        <li><strong className="text-white">Riwayat pembelian</strong> (produk, gems, timestamp, nominal, status, ID transaksi).</li>
                                        <li><strong className="text-white">Metadata pembayaran</strong> dari penyedia pembayaran (mis. referensi transaksi/receipt). Kami berusaha tidak menyimpan data pembayaran sensitif melebihi yang diperlukan untuk verifikasi.</li>
                                    </ul>
                                </div>

                                <div className="space-y-3">
                                    <p className="text-white font-semibold">2.4 Data Dukungan & Komunikasi</p>
                                    <ul className="list-disc list-inside space-y-2 ml-4">
                                        <li><strong className="text-white">Email</strong> (jika Anda menghubungi kami via email).</li>
                                        <li><strong className="text-white">Discord ID/username</strong> (jika Anda menghubungi kami via Discord atau melakukan verifikasi/linking).</li>
                                        <li><strong className="text-white">Isi pesan/tiket</strong> yang Anda kirimkan, termasuk lampiran yang Anda berikan.</li>
                                    </ul>
                                </div>

                                <p className="text-gray-500">
                                    Kami tidak pernah meminta password akun Minecraft Anda. Jika ada yang mengaku “staff” dan minta password,
                                    itu penipuan.
                                </p>
                            </div>
                        </section>

                        {/* 3 */}
                        <section>
                            <h2 className="text-2xl font-bold text-white mb-4">3. Sumber Data</h2>
                            <div className="text-gray-400 space-y-3">
                                <ul className="list-disc list-inside space-y-2 ml-4">
                                    <li>Langsung dari Anda (mis. saat transaksi, menghubungi support, mengisi form).</li>
                                    <li>Otomatis dari sistem saat Anda memakai layanan (log server/website).</li>
                                    <li>Dari penyedia pembayaran untuk verifikasi status transaksi.</li>
                                </ul>
                            </div>
                        </section>

                        {/* 4 */}
                        <section>
                            <h2 className="text-2xl font-bold text-white mb-4">4. Tujuan & Dasar Pemrosesan</h2>
                            <div className="text-gray-400 space-y-4">
                                <p>Kami memproses data untuk tujuan berikut:</p>
                                <ul className="list-disc list-inside space-y-2 ml-4">
                                    <li>Menyediakan layanan server dan fitur terkait (login, koneksi, gameplay, stabilitas).</li>
                                    <li>Memproses pembelian, verifikasi pembayaran, pencegahan fraud/chargeback abuse.</li>
                                    <li>Keamanan, anti-cheat/anti-abuse, investigasi insiden, dan penegakan aturan server.</li>
                                    <li>Dukungan pengguna (customer support) dan penyelesaian sengketa.</li>
                                    <li>Analitik internal untuk meningkatkan performa, kualitas layanan, dan pengalaman pengguna.</li>
                                    <li>Kepatuhan terhadap kewajiban hukum yang relevan.</li>
                                </ul>

                                <p>
                                    Dasar pemrosesan dapat berupa: persetujuan Anda, pelaksanaan perjanjian (mis. layanan/pembelian),
                                    kewajiban hukum, kepentingan vital, tugas kepentingan umum, atau kepentingan sah yang seimbang dengan hak Anda.
                                </p>

                                <p className="text-gray-500">
                                    Jika suatu pemrosesan butuh persetujuan eksplisit, kami akan memintanya dengan cara yang jelas.
                                </p>
                            </div>
                        </section>

                        {/* 5 */}
                        <section>
                            <h2 className="text-2xl font-bold text-white mb-4">5. Cookies & Teknologi Serupa</h2>
                            <div className="text-gray-400 space-y-3">
                                <p>
                                    Website kami dapat menggunakan cookies/local storage untuk menjaga sesi login, preferensi tampilan, pencegahan spam,
                                    serta pengukuran performa. Anda dapat membatasi cookies melalui pengaturan browser, namun beberapa fitur mungkin
                                    tidak berfungsi optimal.
                                </p>
                            </div>
                        </section>

                        {/* 6 */}
                        <section>
                            <h2 className="text-2xl font-bold text-white mb-4">6. Berbagi Data kepada Pihak Ketiga</h2>
                            <div className="text-gray-400 space-y-4">
                                <p>
                                    Kami tidak menjual data pribadi Anda. Kami hanya membagikan data secara terbatas pada pihak berikut bila diperlukan:
                                </p>
                                <ul className="list-disc list-inside space-y-2 ml-4">
                                    <li><strong className="text-white">Penyedia pembayaran</strong> (mis. TriPay) untuk memproses dan memverifikasi transaksi.</li>
                                    <li><strong className="text-white">Penyedia infrastruktur</strong> (hosting, database, anti-DDoS, monitoring) untuk menjalankan layanan.</li>
                                    <li><strong className="text-white">Penegakan hukum/otoritas</strong> bila diwajibkan oleh peraturan atau proses hukum yang sah.</li>
                                </ul>
                                <p className="text-gray-500">
                                    Pihak ketiga memproses data sesuai kebutuhan layanan mereka, dengan kebijakan privasi mereka sendiri.
                                </p>
                            </div>
                        </section>

                        {/* 7 */}
                        <section>
                            <h2 className="text-2xl font-bold text-white mb-4">7. Transfer Lintas Negara</h2>
                            <div className="text-gray-400 space-y-3">
                                <p>
                                    Infrastruktur layanan dapat melibatkan pemrosesan data di Indonesia atau negara lain (mis. lokasi server/penyedia layanan).
                                    Jika terjadi transfer lintas negara, kami berupaya menerapkan langkah perlindungan yang wajar dan memenuhi ketentuan yang berlaku.
                                </p>
                            </div>
                        </section>

                        {/* 8 */}
                        <section>
                            <h2 className="text-2xl font-bold text-white mb-4">8. Retensi Data</h2>
                            <div className="text-gray-400 space-y-3">
                                <p>
                                    Kami menyimpan data selama diperlukan untuk menjalankan layanan, memenuhi kewajiban hukum, menyelesaikan sengketa,
                                    mencegah penyalahgunaan, dan menegakkan aturan. Retensi dapat berbeda tergantung jenis data dan konteks.
                                </p>
                                <ul className="list-disc list-inside space-y-2 ml-4">
                                    <li><strong className="text-white">Data akun/identitas game:</strong> selama akun/akses layanan masih aktif dan diperlukan untuk operasional.</li>
                                    <li><strong className="text-white">Data transaksi:</strong> selama diperlukan untuk verifikasi, audit, pencatatan, dan kepatuhan hukum.</li>
                                    <li><strong className="text-white">Log keamanan & moderasi:</strong> selama diperlukan untuk keamanan, investigasi, dan penegakan rules.</li>
                                </ul>
                            </div>
                        </section>

                        {/* 9 */}
                        <section>
                            <h2 className="text-2xl font-bold text-white mb-4">9. Keamanan Data</h2>
                            <div className="text-gray-400 space-y-4">
                                <p>Kami menerapkan langkah teknis dan organisatoris yang wajar untuk melindungi data, termasuk:</p>
                                <ul className="list-disc list-inside space-y-2 ml-4">
                                    <li>Kontrol akses berbasis peran (need-to-know) untuk staf.</li>
                                    <li>Segmentasi akses dan pembatasan kredensial.</li>
                                    <li>Pengamanan server, patching, monitoring, dan audit berkala.</li>
                                    <li>Enkripsi/penyamaran data tertentu saat relevan dan memungkinkan.</li>
                                </ul>
                                <p className="text-gray-500">
                                    Walau begitu, keamanan total tidak ada di semesta ini. Risiko tetap ada pada sistem apa pun, termasuk layanan online.
                                </p>
                            </div>
                        </section>

                        {/* 10 */}
                        <section>
                            <h2 className="text-2xl font-bold text-white mb-4">10. Insiden Keamanan & Kebocoran Data</h2>
                            <div className="text-gray-400 space-y-4">
                                <p>
                                    Jika terjadi insiden keamanan yang berdampak pada kerahasiaan, integritas, atau ketersediaan data pribadi, kami akan melakukan:
                                </p>
                                <ul className="list-disc list-inside space-y-2 ml-4">
                                    <li>Investigasi dan mitigasi (menghentikan sumber insiden, patch, rotasi kredensial, hardening).</li>
                                    <li>Penilaian dampak dan penentuan langkah pemulihan.</li>
                                    <li>Pemberitahuan tertulis kepada pihak yang terdampak dan pihak berwenang terkait sesuai ketentuan yang berlaku.</li>
                                </ul>

                                <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
                                    <p className="text-white font-semibold mb-2">Pembatasan Tanggung Jawab</p>
                                    <p className="text-gray-400">
                                        Sejauh diizinkan oleh hukum yang berlaku, Trinity Indonesia tidak bertanggung jawab atas kerugian tidak langsung
                                        seperti kehilangan profit, kehilangan peluang, kerusakan reputasi, atau kerugian konsekuensial lain yang timbul
                                        dari insiden keamanan, gangguan layanan, atau akses tidak sah.
                                    </p>
                                    <p className="text-gray-400 mt-2">
                                        Pembatasan ini tidak menghapus kewajiban kami yang bersifat wajib menurut peraturan perundang-undangan,
                                        dan tidak berlaku pada hal yang secara hukum tidak dapat dikecualikan.
                                    </p>
                                </div>
                            </div>
                        </section>

                        {/* 11 */}
                        <section>
                            <h2 className="text-2xl font-bold text-white mb-4">11. Hak Anda</h2>
                            <div className="text-gray-400 space-y-3">
                                <p>Anda dapat mengajukan permintaan terkait data pribadi, termasuk:</p>
                                <ul className="list-disc list-inside space-y-2 ml-4">
                                    <li>Mengakses dan memperoleh salinan data Anda.</li>
                                    <li>Memperbarui/memperbaiki data yang tidak akurat.</li>
                                    <li>Menarik persetujuan (untuk pemrosesan berbasis persetujuan).</li>
                                    <li>Meminta penghapusan/pemusnahan sesuai ketentuan yang berlaku.</li>
                                    <li>Mengajukan keberatan terhadap pemrosesan tertentu.</li>
                                </ul>
                                <p className="text-gray-500">
                                    Permintaan dapat kami tolak atau batasi jika terdapat dasar hukum yang sah (mis. kepentingan keamanan, proses hukum,
                                    atau kewajiban penyimpanan tertentu).
                                </p>
                            </div>
                        </section>

                        {/* 12 */}
                        <section>
                            <h2 className="text-2xl font-bold text-white mb-4">12. Data Anak</h2>
                            <div className="text-gray-400 space-y-3">
                                <p>
                                    Pemrosesan data yang tergolong data anak memerlukan persetujuan orang tua/wali sesuai ketentuan yang berlaku.
                                    Jika Anda adalah orang tua/wali dan meyakini anak Anda menggunakan layanan kami tanpa persetujuan yang diperlukan,
                                    hubungi kami agar kami dapat menindaklanjuti.
                                </p>
                            </div>
                        </section>

                        {/* 13 */}
                        <section>
                            <h2 className="text-2xl font-bold text-white mb-4">13. Tanggung Jawab Pengguna</h2>
                            <div className="text-gray-400 space-y-3">
                                <ul className="list-disc list-inside space-y-2 ml-4">
                                    <li>Jaga keamanan akun Anda (perangkat, email, dan kredensial terkait).</li>
                                    <li>Jangan membagikan informasi sensitif di chat publik, papan, atau konten yang dapat diakses pemain lain.</li>
                                    <li>Gunakan mod/launcher pihak ketiga dengan risiko Anda sendiri.</li>
                                </ul>
                                <p className="text-gray-500">
                                    Informasi yang Anda publikasikan secara sukarela kepada pemain lain berada di luar kontrol teknis kami.
                                </p>
                            </div>
                        </section>

                        {/* 14 */}
                        <section>
                            <h2 className="text-2xl font-bold text-white mb-4">14. Perubahan Kebijakan</h2>
                            <div className="text-gray-400 space-y-3">
                                <p>
                                    Kami dapat memperbarui Kebijakan Privasi ini dari waktu ke waktu. Perubahan berlaku saat versi terbaru dipublikasikan
                                    di halaman ini. Untuk perubahan material, kami dapat memberikan pemberitahuan tambahan melalui kanal resmi.
                                </p>
                            </div>
                        </section>

                        {/* 15 */}
                        <section>
                            <h2 className="text-2xl font-bold text-white mb-4">15. Kontak</h2>
                            <div className="text-gray-400">
                                <p>Untuk pertanyaan, permintaan hak data, atau laporan insiden, hubungi:</p>
                                <ul className="list-disc list-inside space-y-2 ml-4 mt-3">
                                    <li>Discord: Trinity Indonesia Official Server</li>
                                    <li>Email: support@trinityindonesia.cc</li>
                                </ul>
                            </div>
                        </section>

                        <div className="pt-2">
                            <p className="text-xs text-gray-500">
                                Dokumen ini disediakan untuk transparansi pemrosesan data pada layanan Trinity Indonesia. Untuk kepastian penerapan
                                spesifik organisasi (retensi, vendor, alur notifikasi), sesuaikan dengan operasional nyata Anda.
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </Wrapper>
    )
}
