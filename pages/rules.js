import { Wrapper } from '@layer/components/layout/Wrapper.jsx'
import { Icons } from '@layer/components/elements/Icons.jsx'
import { useState } from "react"

const allRules = [
	{
		title: 'Pasal 1: Persetujuan dan Ketentuan Bermain',
		content: [
			{ num: '1.1', text: 'Dengan masuk ke server Trinity Indonesia melalui IP server resmi, pemain secara otomatis dan tanpa syarat dianggap telah membaca, memahami sepenuhnya, menerima, dan menyetujui seluruh aturan yang tercantum dalam dokumen ini beserta segala pembaruan yang dilakukan di kemudian hari.' },
			{ num: '1.2', text: 'Ketidaktahuan atau klaim tidak mengetahui terhadap aturan yang berlaku BUKAN merupakan alasan yang sah dan tidak akan diterima sebagai pembelaan untuk menghindari, mengurangi, atau membatalkan sanksi yang dijatuhkan oleh staff.' },
			{ num: '1.3', text: 'Aturan yang tercantum dalam dokumen ini dapat diubah, ditambah, dikurangi, atau dimodifikasi sewaktu-waktu oleh pihak pengelola server tanpa pemberitahuan terlebih dahulu kepada pemain. Perubahan aturan berlaku efektif dan mengikat sejak saat diumumkan melalui platform resmi server (Discord, Website, atau pengumuman in-game).' },
			{ num: '1.4', text: 'Tim Staff server memiliki wewenang penuh dan kebijaksanaan untuk mengambil tindakan terhadap perilaku, tindakan, atau aktivitas yang dianggap merugikan, mengganggu, atau bertentangan dengan semangat fair play dan kenyamanan bermain, meskipun tindakan tersebut tidak secara eksplisit dan spesifik disebutkan dalam aturan tertulis ini.' },
			{ num: '1.5', text: 'Segala keputusan yang diambil oleh Staff bersifat final dan mengikat. Banding atau keberatan hanya dapat diajukan satu kali melalui sistem tiket resmi di Discord server dalam waktu maksimal 7 (tujuh) hari kalender sejak sanksi dijatuhkan. Keputusan banding bersifat final dan tidak dapat diganggu gugat.' },
			{ num: '1.6', text: 'Dengan bermain di server ini, pemain juga menyatakan bahwa mereka berusia minimal 13 tahun atau memiliki izin dari orang tua/wali untuk bermain. Server tidak bertanggung jawab atas pelanggaran ketentuan usia ini.' }
		]
	},
	{
		title: 'Pasal 2: Keamanan dan Tanggung Jawab Akun',
		content: [
			{ num: '2.1', text: 'Setiap pemain bertanggung jawab penuh dan mutlak atas keamanan akun Minecraft yang mereka gunakan untuk mengakses server. Segala aktivitas, tindakan, transaksi, atau pelanggaran yang dilakukan menggunakan akun tersebut sepenuhnya menjadi tanggung jawab pemilik akun yang terdaftar.' },
			{ num: '2.2', text: 'Dilarang keras dan tanpa pengecualian untuk membagikan, memberitahukan, atau mengekspos informasi login akun termasuk namun tidak terbatas pada: password, session token, access token, refresh token, atau data autentikasi lainnya kepada pihak manapun.' },
			{ num: '2.3', text: 'Staff Trinity Indonesia TIDAK PERNAH dan TIDAK AKAN PERNAH meminta password atau informasi login akun pemain dalam situasi apapun. Segala permintaan password yang mengatasnamakan staff adalah penipuan dan wajib dilaporkan.' },
			{ num: '2.4', text: 'Apabila akun pemain diretas, dikompromikan, atau disalahgunakan oleh pihak lain dan digunakan untuk melakukan pelanggaran aturan, sanksi tetap berlaku dan dikenakan pada akun tersebut tanpa pengecualian.' },
			{ num: '2.5', text: 'Penggunaan akun alternatif (alt account) dengan tujuan menghindari sanksi akan mengakibatkan ban permanen pada SELURUH akun yang terdeteksi terkait.' },
			{ num: '2.6', text: 'Aktivitas jual-beli atau transfer kepemilikan akun yang terhubung dengan server dilarang. Pemain yang terlibat akan dikenakan ban permanen.' },
			{ num: '2.7', text: 'Pemain wajib menggunakan nama akun yang tidak mengandung unsur SARA, kata-kata kasar, nama tokoh kontroversial, atau konten tidak pantas.' },
			{ num: '2.8', text: 'DILARANG KERAS berpura-pura menjadi Admin, Staff, atau pihak resmi server. Sanksi: BAN PERMANEN tanpa peringatan.' }
		]
	},
	{
		title: 'Pasal 3: Privasi dan Keamanan Data',
		content: [
			{ num: '3.1', text: 'Dilarang keras membagikan, menyebarkan, atau mengekspos informasi pribadi (doxxing) milik pemain lain termasuk: nama asli, alamat, nomor telepon, email, foto pribadi, akun media sosial, atau data sensitif lainnya.' },
			{ num: '3.2', text: 'Dilarang meminta atau menggunakan teknik social engineering untuk mendapatkan informasi pribadi dari pemain lain.' },
			{ num: '3.3', text: 'Server menyimpan data aktivitas pemain untuk keperluan moderasi dan keamanan. Data dijaga kerahasiaannya dan tidak dibagikan ke pihak ketiga.' },
			{ num: '3.4', text: 'Melaporkan aktivitas mencurigakan seperti phishing atau penipuan adalah kewajiban moral setiap pemain. Laporan melalui sistem tiket Discord.' },
			{ num: '3.5', text: 'Dilarang menyebarkan link atau file yang mengandung malware, virus, atau program berbahaya melalui media apapun di dalam server.' }
		]
	},
	{
		title: 'Pasal 4: Kebijakan Pembelian Gems dan Transaksi',
		content: [
			{ num: '4.1', text: 'Semua pembelian Gems bersifat FINAL dan TIDAK DAPAT DIKEMBALIKAN (non-refundable) dalam keadaan apapun.' },
			{ num: '4.2', text: 'TIDAK ADA REFUND untuk kesalahan pembeli, termasuk: kesalahan input nickname, kesalahan platform, atau kesalahan jumlah pembelian.' },
			{ num: '4.3', text: 'Pembeli WAJIB memastikan nickname dan platform sudah benar sebelum melakukan pembayaran.' },
			{ num: '4.4', text: 'Melakukan chargeback atau dispute pembayaran akan mengakibatkan ban permanen dan dapat dituntut secara hukum.' },
			{ num: '4.5', text: 'Gems tidak dapat dipindahtangankan, dijual kembali, atau ditukar dengan uang nyata.' },
			{ num: '4.6', text: 'Refund hanya dipertimbangkan jika terjadi kesalahan teknis dari server. Pengajuan melalui tiket Discord dalam 7 hari.' },
			{ num: '4.7', text: 'Harga dan ketersediaan paket Gems dapat berubah sewaktu-waktu tanpa pemberitahuan.' }
		]
	},
	{
		title: 'Pasal 5: Hak Kekayaan Intelektual dan Konten',
		content: [
			{ num: '5.1', text: 'Seluruh aset server termasuk logo, nama brand, desain, plugin custom, dan konten original adalah hak milik eksklusif Trinity Indonesia.' },
			{ num: '5.2', text: 'Pemain diperbolehkan membuat konten kreatif yang menampilkan gameplay di server dengan syarat mencantumkan kredit yang jelas.' },
			{ num: '5.3', text: 'Dilarang menggunakan aset atau brand Trinity Indonesia untuk tujuan komersial tanpa izin tertulis resmi.' },
			{ num: '5.4', text: 'Pembuatan konten yang bertujuan mencemarkan nama baik server akan ditindak tegas termasuk kemungkinan tuntutan hukum.' }
		]
	},
	{
		title: 'Pasal 6: Pelanggaran Cyber dan Aktivitas Ilegal',
		content: [
			{ num: '6.1', text: 'Dilarang keras melakukan serangan DDoS/DoS terhadap server, staff, atau pemain lain. Pelanggaran dilaporkan ke pihak berwenang.' },
			{ num: '6.2', text: 'Dilarang melakukan hacking atau percobaan akses tidak sah ke sistem server.' },
			{ num: '6.3', text: 'Dilarang menyebarkan malware, virus, atau link phishing melalui media apapun di server.' },
			{ num: '6.4', text: 'Dilarang mengeksploitasi bug untuk merusak server atau mendapatkan keuntungan tidak adil. Bug WAJIB dilaporkan melalui tiket.' },
			{ num: '6.5', text: 'Pelanggaran pasal ini: ban permanen tanpa peringatan dan laporan resmi ke kepolisian.' },
			{ num: '6.6', text: 'Membantu atau menutup-nutupi aktivitas yang melanggar pasal ini juga merupakan pelanggaran.' }
		]
	},
	{
		title: 'Pasal 7: Promosi dan Periklanan',
		content: [
			{ num: '7.1', text: 'Dilarang keras mempromosikan server Minecraft lain dalam bentuk apapun di dalam server.' },
			{ num: '7.2', text: 'Dilarang mempromosikan situs judi online, pinjaman ilegal, atau aktivitas ilegal lainnya. Sanksi: ban permanen.' },
			{ num: '7.3', text: 'Promosi pribadi hanya diperbolehkan di channel yang ditentukan di Discord server.' },
			{ num: '7.4', text: 'Spam promosi: mute 24 jam → mute 7 hari → ban permanen.' }
		]
	},
	{
		title: 'Pasal 8: Pelaporan, Banding, dan Bantuan',
		content: [
			{ num: '8.1', text: 'Pelaporan pelanggaran wajib disertai bukti yang valid berupa screenshot atau video dengan timestamp.' },
			{ num: '8.2', text: 'Pembuatan laporan palsu atau manipulasi bukti adalah pelanggaran serius.' },
			{ num: '8.3', text: 'Tim Staff akan merespons tiket dalam waktu maksimal 48 jam kerja.' },
			{ num: '8.4', text: 'Dilarang spam mention atau DM berulang ke staff. Gunakan sistem tiket resmi.' },
			{ num: '8.5', text: 'Kritik dan saran konstruktif sangat dihargai selama disampaikan dengan sopan.' }
		]
	},
	{
		title: 'Pasal 9: Kebijakan Cheat (AnarchyRPG)',
		type: 'warning',
		content: [
			{ num: '9.1', text: 'Hack client seperti KillAura, Fly, Speed, dll DIPERBOLEHKAN di server ini.' },
			{ num: '9.2', text: 'TETAP DILARANG: Exploit yang crash server, lag machine, duplication glitch, packet exploit.' },
			{ num: '9.3', text: 'Bot atau automation massal yang membebani server tetap DILARANG.' },
			{ num: '9.4', text: 'SANKSI: Pelanggaran 9.2 dan 9.3 = Ban Permanen tanpa banding.' }
		]
	},
	{
		title: 'Pasal 10: Kebijakan Chat dan Toxic (AnarchyRPG)',
		type: 'warning',
		content: [
			{ num: '10.1', text: 'Trash talk dan toxic chat DIPERBOLEHKAN sebagai bagian dari pengalaman anarchy.' },
			{ num: '10.2', text: 'TETAP DILARANG MUTLAK: Doxxing, ancaman kekerasan nyata, konten CSAM/pedofilia, hate speech ekstrem.' },
			{ num: '10.3', text: 'Konten NSFW yang eksplisit tetap DILARANG.' },
			{ num: '10.4', text: 'SANKSI: Pelanggaran 10.2 = Ban Permanen + Laporan ke pihak berwajib.' }
		]
	},
	{
		title: 'Pasal 11: Gameplay dan Mekanisme (AnarchyRPG)',
		type: 'info',
		content: [
			{ num: '11.1', text: 'Griefing, raiding, stealing, dan PvP legal di server ini.' },
			{ num: '11.2', text: 'PvP bebas kecuali dalam radius 100 block dari spawn point.' },
			{ num: '11.3', text: 'Server TIDAK BERTANGGUNG JAWAB atas kehilangan item atau progress.' },
			{ num: '11.4', text: 'Scamming dalam trading DIPERBOLEHKAN.' },
			{ num: '11.5', text: 'Mode ini bukan untuk semua orang. Kalau belum siap, pertimbangkan matang-matang.' }
		]
	},
	{
		title: 'Pasal 12: Batasan Absolut',
		type: 'danger',
		content: [
			{ num: '12.1', text: 'DDoS/DoS attack = Ban Permanen + Laporan Kepolisian.' },
			{ num: '12.2', text: 'Hacking/mencuri akun pemain lain = Ban Permanen + Laporan Kepolisian.' },
			{ num: '12.3', text: 'Penyebaran malware atau link phishing = Ban Permanen + Laporan Kepolisian.' },
			{ num: '12.4', text: 'Server crash exploit = Ban Permanen.' },
			{ num: '12.5', text: 'Promosi judi online atau aktivitas kriminal = Ban Permanen.' }
		]
	}
]

function RuleAccordion({ title, content, type }) {
	const [isOpen, setIsOpen] = useState(false);

	// Color based on type
	const typeStyles = {
		danger: { bg: '#fef2f2', color: '#dc2626', border: '#fecaca' },
		warning: { bg: '#fffbeb', color: '#d97706', border: '#fde68a' },
		info: { bg: '#eff6ff', color: '#2563eb', border: '#bfdbfe' }
	};
	const style = type ? typeStyles[type] : null;
	const accentColor = style ? style.color : 'var(--brand-secondary)';
	const iconBg = style && isOpen ? style.bg : (isOpen ? 'var(--brand-secondary)' : '#f0edf4');
	const iconColor = style && isOpen ? style.color : (isOpen ? '#fff' : 'var(--text-muted)');

	return (
		<div className={`mc-accordion ${isOpen ? 'open' : ''}`}
			style={isOpen && style ? { borderColor: style.border } : {}}
		>
			<button
				onClick={() => setIsOpen(!isOpen)}
				className="w-full p-5 flex items-center gap-4 text-left"
			>
				<div className="flex-shrink-0 w-10 h-10 rounded-xl flex items-center justify-center transition-all duration-300"
					style={{ background: iconBg, color: iconColor }}
				>
					<Icons.Shield className="h-5 w-5" />
				</div>
				<div className="flex-1">
					<h3 className="font-bold text-sm" style={{ color: isOpen ? accentColor : 'var(--text-primary)' }}>
						{title}
					</h3>
				</div>
				<div className={`flex-shrink-0 transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`}>
					<Icons.ChevronDown className="h-5 w-5" style={{ color: isOpen ? accentColor : 'var(--text-muted)' }} />
				</div>
			</button>

			<div className={`grid transition-all duration-300 ease-in-out ${isOpen ? 'grid-rows-[1fr] opacity-100' : 'grid-rows-[0fr] opacity-0'}`}>
				<div className="overflow-hidden">
					<div className="px-5 pb-5 pt-0">
						<div className="ml-14 space-y-3 border-l-2 pl-4" style={{ borderColor: style ? style.border : 'rgba(226, 110, 16, 0.2)' }}>
							{content.map((item, i) => (
								<div key={i} className="text-sm leading-relaxed" style={{ color: 'var(--text-secondary)' }}>
									<span className="font-bold mr-2" style={{ color: accentColor }}>{item.num}</span>
									{item.text}
								</div>
							))}
						</div>
					</div>
				</div>
			</div>
		</div>
	);
}

export default function Rules() {
	return (
		<Wrapper
			title="Aturan Server"
			description="Aturan dan ketentuan server Trinity Indonesia. Baca dan pahami sebelum bermain."
			path="/rules"
		>
			{/* Header */}
			<div className="mc-content-card mb-8">
				<h2 className="text-2xl font-extrabold mb-2" style={{ color: 'var(--text-primary)' }}>
					Aturan Server
				</h2>
				<p className="text-sm" style={{ color: 'var(--text-secondary)' }}>
					Dengan bermain di Trinity Indonesia, kamu dianggap telah membaca dan menyetujui seluruh aturan berikut. Aturan dapat berubah sewaktu-waktu tanpa pemberitahuan.
				</p>
			</div>

			{/* All Rules */}
			<div className="flex flex-col mb-12">
				{allRules.map((rule, i) => (
					<RuleAccordion key={i} title={rule.title} content={rule.content} type={rule.type} />
				))}
			</div>
		</Wrapper>
	)
}
