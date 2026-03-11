import { Wrapper } from '@layer/components/layout/Wrapper.jsx'

export default function PrivacyPolicy() {
    return (
        <Wrapper
            title="Privacy Policy"
            description="Kebijakan Privasi Trinity Indonesia"
            path="/privacy"
        >
            <div className="mc-card p-6 sm:p-10">
                <h1 className="text-3xl sm:text-4xl font-black mb-6" style={{ color: 'var(--brand-secondary)' }}>Privacy Policy</h1>

                <div className="space-y-6 text-sm sm:text-base leading-relaxed" style={{ color: 'var(--text-secondary)' }}>
                    <p>
                        Kebijakan privasi ini menjelaskan bagaimana informasi pribadi Anda dikumpulkan, digunakan, dan dibagikan saat Anda mengunjungi atau melakukan pembelian di Trinity Indonesia ("Situs" atau "Layanan").
                    </p>

                    <h2 className="text-xl font-bold mt-8 mb-4" style={{ color: 'var(--text-primary)' }}>1. Informasi Pribadi yang Kami Kumpulkan</h2>
                    <p>
                        Saat Anda mengunjungi Situs, kami dapat mengumpulkan informasi tertentu tentang perangkat Anda, termasuk informasi tentang browser web Anda, alamat IP, zona waktu, dan beberapa cookie yang terpasang di perangkat Anda. Selain itu, saat Anda menjelajahi Situs, kami mengumpulkan informasi tentang halaman web individu atau produk yang Anda lihat, situs web atau istilah pencarian apa yang merujuk Anda ke Situs, dan informasi tentang bagaimana Anda berinteraksi dengan Situs.
                    </p>
                    <p>
                        Selain itu, saat Anda melakukan pembelian atau mencoba melakukan pembelian melalui Situs, kami mengumpulkan informasi tertentu dari Anda, termasuk nama Anda (Username Minecraft), alamat email, dan informasi pembayaran. Kami menyebut informasi ini sebagai "Informasi Pemesanan".
                    </p>
                    <p>
                        Saat Anda terhubung dan bermain di server Minecraft kami, kami juga secara aktif mengumpulkan data terkait aktivitas in-game Anda. Ini mencakup, namun tidak terbatas pada, waktu bermain (playtime), riwayat aktivitas, perilaku saat bermain (in-game behavior), interaksi dengan pemain lain maupun fitur server, serta statistik in-game lainnya.
                    </p>

                    <h2 className="text-xl font-bold mt-8 mb-4" style={{ color: 'var(--text-primary)' }}>2. Bagaimana Kami Menggunakan Informasi Pribadi Anda?</h2>
                    <p>
                        Kami menggunakan Informasi Pemesanan yang kami kumpulkan secara umum untuk memenuhi setiap pesanan yang ditempatkan melalui Situs (termasuk memproses informasi pembayaran Anda, menyediakan produk atau layanan in-game, dan memberi Anda faktur dan/atau konfirmasi pesanan).
                    </p>
                    <p>
                        Selain itu, kami menggunakan informasi yang dikumpulkan untuk:
                    </p>
                    <ul className="list-disc pl-6 space-y-2">
                        <li>Berkomunikasi dengan Anda;</li>
                        <li>Memeriksa akun dan pesanan untuk potensi risiko, pelanggaran aturan server, atau penipuan;</li>
                        <li>Menganalisis data waktu bermain dan perilaku in-game untuk meningkatkan pengalaman bermain, menjaga moderasi dan keamanan server, serta merencanakan pembaruan fitur; dan</li>
                        <li>Saat sesuai dengan preferensi yang Anda bagikan dengan kami, memberikan Anda informasi atau iklan yang berkaitan dengan produk atau layanan kami.</li>
                    </ul>

                    <h2 className="text-xl font-bold mt-8 mb-4" style={{ color: 'var(--text-primary)' }}>3. Berbagi Informasi Pribadi Anda</h2>
                    <p>
                        Kami mungkin membagikan Informasi Pribadi Anda dengan pihak ketiga untuk membantu kami memproses pembayaran, mengelola layanan kami, dan mematuhi hukum atau menanggapi permintaan yang sah. Misalnya, kami menggunakan gateway pembayaran (seperti Tako) untuk memproses transaksi.
                    </p>
                    <p>
                        Kami juga dapat membagikan Informasi Pribadi Anda untuk mematuhi hukum dan peraturan yang berlaku, untuk menanggapi panggilan pengadilan, surat perintah penggeledahan, atau permintaan sah lainnya untuk informasi yang kami terima, atau untuk melindungi hak-hak kami.
                    </p>

                    <h2 className="text-xl font-bold mt-8 mb-4" style={{ color: 'var(--text-primary)' }}>4. Penyimpanan Data</h2>
                    <p>
                        Saat Anda melakukan pemesanan melalui Situs, kami akan menyimpan Informasi Pemesanan Anda untuk catatan kami kecuali dan sampai Anda meminta kami untuk menghapus informasi tersebut.
                    </p>

                    <h2 className="text-xl font-bold mt-8 mb-4" style={{ color: 'var(--text-primary)' }}>5. Perubahan</h2>
                    <p>
                        Kami dapat memperbarui kebijakan privasi ini dari waktu ke waktu untuk mencerminkan, misalnya, perubahan pada praktik kami atau untuk alasan operasional, hukum, atau peraturan lainnya.
                    </p>

                    <h2 className="text-xl font-bold mt-8 mb-4" style={{ color: 'var(--text-primary)' }}>6. Hubungi Kami</h2>
                    <p>
                        Untuk informasi lebih lanjut tentang praktik privasi kami, jika Anda memiliki pertanyaan, atau jika Anda ingin mengajukan keluhan, silakan hubungi kami melalui Discord server kami.
                    </p>

                    <div className="mt-8 pt-6 border-t font-bold" style={{ borderColor: '#e8e0f0', color: 'var(--text-muted)' }}>
                        Pembaruan Terakhir: {new Date().toLocaleDateString('id-ID', { year: 'numeric', month: 'long', day: 'numeric' })}
                    </div>
                </div>
            </div>
        </Wrapper>
    )
}
