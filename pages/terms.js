import { Wrapper } from '@layer/components/layout/Wrapper.jsx'

export default function TermsOfService() {
    return (
        <Wrapper seo={{ title: 'Ketentuan Layanan' }}>
            <div className="pt-32 pb-20">
                <div className="container max-w-4xl">
                    {/* Header */}
                    <div className="text-center mb-12">
                        <h1 className="text-4xl md:text-5xl font-bold mb-4">
                            <span className="text-white">Ketentuan</span>
                            <span className="gradient-text"> Layanan</span>
                        </h1>
                        <p className="text-gray-400">Terakhir diperbarui: Desember 2025</p>
                    </div>

                    {/* Content */}
                    <div className="glass-card rounded-3xl p-8 md:p-12 space-y-10">
                        <section>
                            <h2 className="text-2xl font-bold text-white mb-4">1. Penerimaan Ketentuan</h2>
                            <div className="text-gray-400 space-y-3">
                                <p>
                                    Dengan mengakses atau menggunakan layanan Trinity Indonesia (“kami”), Anda setuju terikat oleh Ketentuan Layanan ini
                                    (“Ketentuan”). Jika Anda tidak setuju, hentikan penggunaan layanan.
                                </p>
                                <p>
                                    Ketentuan ini berlaku untuk server Minecraft, website, store/pembelian (termasuk gems), Discord resmi, dan fitur/layanan
                                    lain yang kami sediakan dari waktu ke waktu.
                                </p>
                            </div>
                        </section>

                        <section>
                            <h2 className="text-2xl font-bold text-white mb-4">2. Definisi</h2>
                            <div className="text-gray-400 space-y-3">
                                <ul className="list-disc list-inside space-y-2 ml-4">
                                    <li><strong className="text-white">Layanan:</strong> seluruh layanan Trinity Indonesia (server, website, store, Discord, dukungan).</li>
                                    <li><strong className="text-white">Pengguna/Anda:</strong> pihak yang mengakses atau memakai Layanan.</li>
                                    <li><strong className="text-white">Akun:</strong> identitas Minecraft (username/UUID) dan/atau akun terkait pada sistem kami.</li>
                                    <li><strong className="text-white">Gems/Barang Virtual:</strong> mata uang/produk digital dalam game yang tidak memiliki nilai uang nyata.</li>
                                </ul>
                            </div>
                        </section>

                        <section>
                            <h2 className="text-2xl font-bold text-white mb-4">3. Kelayakan & Tanggung Jawab Akun</h2>
                            <div className="text-gray-400 space-y-4">
                                <ul className="list-disc list-inside space-y-2 ml-4">
                                    <li>Anda wajib memastikan penggunaan Layanan sesuai hukum yang berlaku di wilayah Anda.</li>
                                    <li>Anda bertanggung jawab atas keamanan akun Minecraft, perangkat, email/Discord, dan akses apa pun yang Anda gunakan untuk masuk.</li>
                                    <li>Aktivitas pada akun dianggap dilakukan oleh pemilik akun. Jika akun Anda dipinjamkan atau dibagikan, risikonya ada pada Anda.</li>
                                </ul>

                                <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
                                    <p className="text-white font-semibold mb-2">Catatan afiliasi</p>
                                    <p className="text-gray-400">
                                        Trinity Indonesia adalah komunitas/server independen. Kami tidak berafiliasi, tidak didukung, dan tidak disponsori oleh Mojang Studios maupun Microsoft.
                                    </p>
                                </div>
                            </div>
                        </section>

                        <section>
                            <h2 className="text-2xl font-bold text-white mb-4">4. Layanan & Perubahan Fitur</h2>
                            <div className="text-gray-400 space-y-3">
                                <p>
                                    Kami menyediakan server Minecraft dengan berbagai mode permainan, fitur komunitas, sistem pembelian Barang Virtual,
                                    serta dukungan pengguna. Kami dapat menambah, mengubah, membatasi, atau menghentikan bagian mana pun dari Layanan
                                    kapan saja, termasuk mode, item, ekonomi, balancing, dan mekanik permainan.
                                </p>
                            </div>
                        </section>

                        <section>
                            <h2 className="text-2xl font-bold text-white mb-4">5. Aturan Bermain & Penegakan</h2>
                            <div className="text-gray-400 space-y-4">
                                <p>
                                    Anda wajib mematuhi aturan server (Rules) yang kami tetapkan. Rules merupakan bagian dari Ketentuan ini.
                                    Versi terbaru Rules tersedia di halaman <a href="/rules" className="text-rose-400 hover:underline">Aturan Server</a>.
                                </p>
                                <ul className="list-disc list-inside space-y-2 ml-4">
                                    <li>Kami dapat melakukan moderasi, pembatasan fitur, rollback, penghapusan item/uang, reset, kick, mute, ban sementara, atau ban permanen.</li>
                                    <li>Keputusan moderasi dapat bersifat final untuk menjaga ekosistem server, mencegah penyalahgunaan, dan melindungi pemain lain.</li>
                                    <li>Kami dapat meminta bukti tambahan saat meninjau laporan, banding, atau sengketa transaksi.</li>
                                </ul>

                                <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
                                    <p className="text-white font-semibold mb-2">Anti-exploit</p>
                                    <p className="text-gray-400">
                                        Dupe, bug abuse, exploit, scripting, macro, cheating, penyalahgunaan mekanik, dan bypass sistem dianggap pelanggaran serius.
                                        Hasil dari exploit dapat dihapus tanpa kompensasi.
                                    </p>
                                </div>
                            </div>
                        </section>

                        <section>
                            <h2 className="text-2xl font-bold text-white mb-4">6. Larangan Utama</h2>
                            <div className="text-gray-400 space-y-3">
                                <ul className="list-disc list-inside space-y-2 ml-4">
                                    <li>Cheat/hack, mod terlarang, auto-clicker, macro, botting, atau otomatisasi yang memberi keuntungan tidak wajar.</li>
                                    <li>Eksploitasi bug/dupe, merusak ekonomi, scamming yang dilarang, doxxing, atau penguntitan.</li>
                                    <li>Ujaran kebencian, ancaman, pelecehan, konten seksual eksplisit, atau konten yang melanggar hukum.</li>
                                    <li>Serangan terhadap infrastruktur (DDoS, flooding, probing), percobaan akses ilegal, atau gangguan layanan.</li>
                                    <li>Memperjualbelikan akun/Barang Virtual di luar sistem resmi bila dilarang oleh Rules atau kebijakan platform.</li>
                                </ul>
                            </div>
                        </section>

                        <section>
                            <h2 className="text-2xl font-bold text-white mb-4">7. Pembelian, Gems, dan Barang Virtual</h2>
                            <div className="text-gray-400 space-y-4">
                                <p>
                                    Pembelian dalam store menghasilkan Barang Virtual (mis. gems/benefit in-game). Barang Virtual:
                                </p>
                                <ul className="list-disc list-inside space-y-2 ml-4">
                                    <li>Tidak memiliki nilai uang nyata, tidak dapat ditukar menjadi uang, dan tidak dapat dipindahkan keluar dari ekosistem Layanan.</li>
                                    <li>Dapat berubah karena balancing, event, reset/season, atau kebijakan operasional.</li>
                                    <li>Dapat dibatasi, dikurangi, atau dihapus jika terkait pelanggaran, fraud, chargeback, atau exploit.</li>
                                </ul>

                                <div className="space-y-2">
                                    <p className="text-white font-semibold">Pembayaran & verifikasi</p>
                                    <ul className="list-disc list-inside space-y-2 ml-4">
                                        <li>Kami memakai payment gateway pihak ketiga (mis. TriPay). Status transaksi mengikuti verifikasi dari penyedia pembayaran.</li>
                                        <li>Gems diberikan setelah pembayaran terkonfirmasi.</li>
                                        <li>Harga, paket, bonus, dan promo dapat berubah sewaktu-waktu.</li>
                                    </ul>
                                </div>

                                <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
                                    <p className="text-white font-semibold mb-2">Kebijakan refund & chargeback</p>
                                    <p className="text-gray-400">
                                        Semua pembelian bersifat final. Refund tidak diberikan kecuali diwajibkan oleh hukum atau disetujui secara tertulis oleh kami pada kasus tertentu.
                                        Chargeback/dispute pembayaran tanpa alasan yang sah dapat menyebabkan pembekuan akun, penarikan Barang Virtual, dan penolakan layanan di masa depan.
                                    </p>
                                </div>
                            </div>
                        </section>

                        <section>
                            <h2 className="text-2xl font-bold text-white mb-4">8. Ketersediaan, Maintenance, dan Reset</h2>
                            <div className="text-gray-400 space-y-3">
                                <p>
                                    Layanan disediakan “sebagaimana adanya” dan dapat mengalami downtime, maintenance, rollback, reset season, perubahan map,
                                    perubahan ekonomi, atau pembaruan. Kami tidak menjanjikan ketersediaan 100%.
                                </p>
                                <ul className="list-disc list-inside space-y-2 ml-4">
                                    <li>Anda memahami risiko kehilangan progres/item akibat reset, rollback, bug, atau gangguan teknis.</li>
                                    <li>Kami dapat melakukan tindakan darurat untuk melindungi server, termasuk menonaktifkan fitur sementara.</li>
                                </ul>
                            </div>
                        </section>

                        <section>
                            <h2 className="text-2xl font-bold text-white mb-4">9. Konten Pengguna & Komunikasi</h2>
                            <div className="text-gray-400 space-y-3">
                                <p>
                                    Pesan chat, build, nama item, skin, dan konten lain yang Anda buat dapat dimoderasi. Anda bertanggung jawab atas konten Anda.
                                    Kami dapat menghapus atau membatasi konten yang melanggar Rules, hukum, atau standar komunitas.
                                </p>
                            </div>
                        </section>

                        <section>
                            <h2 className="text-2xl font-bold text-white mb-4">10. Privasi</h2>
                            <div className="text-gray-400 space-y-3">
                                <p>
                                    Pemrosesan data Anda mengikuti <a href="/privacy-policy" className="text-rose-400 hover:underline">Kebijakan Privasi</a> kami.
                                    Dengan menggunakan Layanan, Anda menyetujui praktik pemrosesan data yang dijelaskan di sana.
                                </p>
                            </div>
                        </section>

                        <section>
                            <h2 className="text-2xl font-bold text-white mb-4">11. Penangguhan & Penghentian</h2>
                            <div className="text-gray-400 space-y-3">
                                <p>
                                    Kami dapat menangguhkan atau menghentikan akses Anda kapan saja jika terjadi pelanggaran, dugaan fraud, risiko keamanan,
                                    atau alasan operasional. Penghentian dapat dilakukan tanpa pemberitahuan jika diperlukan untuk mencegah kerusakan lebih lanjut.
                                </p>
                                <p className="text-gray-500">
                                    Penghentian akses tidak otomatis membuat Anda berhak atas kompensasi atas Barang Virtual, item, atau progres dalam game.
                                </p>
                            </div>
                        </section>

                        <section>
                            <h2 className="text-2xl font-bold text-white mb-4">12. Penafian Jaminan</h2>
                            <div className="text-gray-400 space-y-3">
                                <p>
                                    Sejauh diizinkan oleh hukum, Layanan disediakan “apa adanya” dan “sesuai ketersediaan”. Kami tidak memberi jaminan bahwa
                                    Layanan bebas gangguan, bebas bug, atau selalu aman dari pihak yang berniat buruk.
                                </p>
                            </div>
                        </section>

                        <section>
                            <h2 className="text-2xl font-bold text-white mb-4">13. Pembatasan Tanggung Jawab</h2>
                            <div className="text-gray-400 space-y-4">
                                <p>
                                    Sejauh diizinkan oleh hukum, Trinity Indonesia tidak bertanggung jawab atas kerugian tidak langsung seperti kehilangan profit,
                                    kehilangan peluang, gangguan bisnis, kehilangan reputasi, atau kerugian konsekuensial lain.
                                </p>
                                <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
                                    <p className="text-white font-semibold mb-2">Batas maksimal</p>
                                    <p className="text-gray-400">
                                        Jika kami tetap dinyatakan bertanggung jawab oleh putusan yang berkekuatan hukum, total tanggung jawab kami dibatasi
                                        sebesar jumlah yang Anda bayarkan kepada kami untuk Layanan dalam 30 (tiga puluh) hari terakhir sebelum kejadian,
                                        atau Rp100.000 (seratus ribu rupiah), mana yang lebih besar.
                                    </p>
                                    <p className="text-gray-400 mt-2">
                                        Pembatasan ini tidak berlaku pada hal yang secara hukum tidak dapat dibatasi atau dikecualikan.
                                    </p>
                                </div>
                            </div>
                        </section>

                        <section>
                            <h2 className="text-2xl font-bold text-white mb-4">14. Ganti Rugi (Indemnity)</h2>
                            <div className="text-gray-400 space-y-3">
                                <p>
                                    Anda setuju untuk membela dan mengganti rugi Trinity Indonesia dari klaim, kerugian, denda, atau biaya (termasuk biaya hukum yang wajar)
                                    yang timbul akibat pelanggaran Ketentuan/Rules oleh Anda, penyalahgunaan Layanan, atau pelanggaran hukum yang Anda lakukan.
                                </p>
                            </div>
                        </section>

                        <section>
                            <h2 className="text-2xl font-bold text-white mb-4">15. Keadaan Kahar (Force Majeure)</h2>
                            <div className="text-gray-400 space-y-3">
                                <p>
                                    Kami tidak bertanggung jawab atas keterlambatan atau kegagalan layanan akibat kejadian di luar kendali wajar kami,
                                    termasuk bencana alam, gangguan jaringan/ISP, kebijakan platform, tindakan pemerintah, atau insiden keamanan skala luas.
                                </p>
                            </div>
                        </section>

                        <section>
                            <h2 className="text-2xl font-bold text-white mb-4">16. Hukum yang Berlaku & Penyelesaian Sengketa</h2>
                            <div className="text-gray-400 space-y-3">
                                <p>
                                    Ketentuan ini tunduk pada hukum Republik Indonesia. Jika terjadi sengketa, Anda setuju untuk mencoba menyelesaikan terlebih dahulu
                                    melalui kanal dukungan kami. Jika tidak selesai, sengketa diselesaikan melalui forum/pengadilan yang berwenang di Indonesia.
                                </p>
                            </div>
                        </section>

                        <section>
                            <h2 className="text-2xl font-bold text-white mb-4">17. Perubahan Ketentuan</h2>
                            <div className="text-gray-400 space-y-3">
                                <p>
                                    Kami dapat memperbarui Ketentuan ini kapan saja. Pembaruan berlaku saat dipublikasikan di halaman ini.
                                    Penggunaan Layanan setelah pembaruan dianggap sebagai persetujuan Anda terhadap versi terbaru.
                                </p>
                            </div>
                        </section>

                        <section>
                            <h2 className="text-2xl font-bold text-white mb-4">18. Kontak</h2>
                            <div className="text-gray-400">
                                <p>Untuk pertanyaan atau laporan terkait Ketentuan ini, hubungi:</p>
                                <ul className="list-disc list-inside space-y-2 ml-4 mt-3">
                                    <li>Discord: Trinity Indonesia Official Server</li>
                                    <li>Email: support@trinityindonesia.cc</li>
                                </ul>
                            </div>
                        </section>
                    </div>
                </div>
            </div>
        </Wrapper>
    )
}
