import { Wrapper } from '@layer/components/layout/Wrapper.jsx'

export default function RefundPolicy() {
    return (
        <Wrapper seo={{ title: 'Kebijakan Refund' }}>
            <div className="pt-32 pb-20">
                <div className="container max-w-4xl">
                    {/* Header */}
                    <div className="text-center mb-12">
                        <h1 className="text-4xl md:text-5xl font-bold mb-4">
                            <span className="text-white">Kebijakan</span>
                            <span className="gradient-text"> Refund</span>
                        </h1>
                        <p className="text-gray-400">Terakhir diperbarui: Desember 2024</p>
                    </div>

                    {/* Content */}
                    <div className="glass-card rounded-3xl p-8 md:p-12 space-y-8">
                        {/* Important Notice */}
                        <div className="p-6 rounded-2xl bg-rose-500/10 border border-rose-500/30">
                            <div className="flex items-start gap-4">
                                <div className="w-10 h-10 rounded-xl bg-rose-500/20 flex items-center justify-center flex-shrink-0">
                                    <span className="text-rose-400 text-xl">⚠️</span>
                                </div>
                                <div>
                                    <h3 className="text-white font-bold mb-2">Penting untuk Diketahui</h3>
                                    <p className="text-gray-400">Semua pembelian gems dan produk digital di Trinity Indonesia bersifat <strong className="text-rose-400">final dan tidak dapat dikembalikan</strong>. Pastikan Anda memahami kebijakan ini sebelum melakukan pembelian.</p>
                                </div>
                            </div>
                        </div>

                        <section>
                            <h2 className="text-2xl font-bold text-white mb-4">1. Kebijakan Umum</h2>
                            <div className="text-gray-400 space-y-3">
                                <p>Karena sifat produk digital (gems, rank, dll) yang tidak dapat dikembalikan setelah diberikan ke akun, kami menerapkan kebijakan <strong className="text-white">no refund</strong> untuk semua pembelian.</p>
                            </div>
                        </section>

                        <section>
                            <h2 className="text-2xl font-bold text-white mb-4">2. Pengecualian Refund</h2>
                            <div className="text-gray-400 space-y-3">
                                <p>Refund <strong className="text-emerald-400">dapat dipertimbangkan</strong> dalam situasi berikut:</p>
                                <ul className="list-disc list-inside space-y-2 ml-4">
                                    <li><strong className="text-white">Pembayaran Ganda:</strong> Jika terjadi pembayaran duplikat untuk produk yang sama</li>
                                    <li><strong className="text-white">Gems Tidak Diterima:</strong> Jika pembayaran sukses tapi gems tidak masuk dalam 24 jam</li>
                                    <li><strong className="text-white">Kesalahan Sistem:</strong> Jika terjadi error pada sistem yang menyebabkan kerugian</li>
                                </ul>
                            </div>
                        </section>

                        <section>
                            <h2 className="text-2xl font-bold text-white mb-4">3. Proses Pengajuan Refund</h2>
                            <div className="text-gray-400 space-y-3">
                                <p>Jika Anda memenuhi kriteria pengecualian di atas:</p>
                                <ol className="list-decimal list-inside space-y-3 ml-4">
                                    <li>Hubungi admin melalui Discord dengan menyertakan:
                                        <ul className="list-disc list-inside ml-6 mt-2 space-y-1">
                                            <li>Username Minecraft</li>
                                            <li>Bukti pembayaran (screenshot)</li>
                                            <li>Nomor referensi transaksi</li>
                                            <li>Penjelasan masalah</li>
                                        </ul>
                                    </li>
                                    <li>Tim kami akan memverifikasi klaim Anda dalam 1-3 hari kerja</li>
                                    <li>Jika disetujui, refund akan diproses ke metode pembayaran asal</li>
                                </ol>
                            </div>
                        </section>

                        <section>
                            <h2 className="text-2xl font-bold text-white mb-4">4. Refund TIDAK Berlaku Untuk</h2>
                            <div className="text-gray-400 space-y-3">
                                <ul className="list-disc list-inside space-y-2 ml-4">
                                    <li>Pembelian yang sudah digunakan (gems sudah dipakai)</li>
                                    <li>Perubahan pikiran setelah pembelian</li>
                                    <li>Akun yang di-ban karena melanggar aturan</li>
                                    <li>Kehilangan item/gems karena kesalahan pemain</li>
                                    <li>Pembelian yang dilakukan lebih dari 7 hari lalu</li>
                                </ul>
                            </div>
                        </section>

                        <section>
                            <h2 className="text-2xl font-bold text-white mb-4">5. Batas Waktu</h2>
                            <div className="text-gray-400 space-y-3">
                                <p>Pengajuan refund harus dilakukan dalam waktu <strong className="text-white">7 hari</strong> sejak tanggal transaksi. Pengajuan setelah periode ini tidak akan diproses.</p>
                            </div>
                        </section>

                        <section>
                            <h2 className="text-2xl font-bold text-white mb-4">6. Kontak</h2>
                            <div className="text-gray-400">
                                <p>Untuk pengajuan refund atau pertanyaan, hubungi:</p>
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
