import { Wrapper } from '@layer/components/layout/Wrapper.jsx'
import { Icons } from '@layer/components/elements/Icons.jsx'
import { useState } from "react"

const allRules = [
	{
		title: 'Pasal 1: Ketentuan Umum & Wewenang Staff',
		content: [
			{ num: '1.1', text: 'Dengan masuk ke server Trinity Indonesia, pemain dianggap telah membaca, memahami, dan menyetujui seluruh aturan yang berlaku tanpa pengecualian. Ketidaktahuan terhadap aturan tidak dapat dijadikan alasan untuk menghindari sanksi.' },
			{ num: '1.2', text: 'Aturan dapat diubah, ditambah, atau dihapus sewaktu-waktu oleh pihak pengelola tanpa pemberitahuan sebelumnya. Perubahan berlaku efektif sejak dipublikasikan di platform resmi (Discord, Website, atau in-game).' },
			{ num: '1.3', text: 'Staff memiliki wewenang penuh untuk menindak segala perilaku yang merugikan server, meskipun perilaku tersebut belum tercantum secara spesifik dalam aturan tertulis. Keputusan staff bersifat final dan hanya dapat dibanding satu kali melalui tiket Discord.' },
			{ num: '1.4', text: 'Melawan, menghasut pihak lain, atau mencemarkan nama baik server karena tidak menerima hasil hukuman dianggap sebagai pelanggaran berat tersendiri. Tindakan seperti ini akan mengakibatkan eskalasi sanksi yang jauh lebih berat dari hukuman awal.' },
			{ num: '1.5', text: 'Jenis dan durasi hukuman untuk setiap pelanggaran sepenuhnya menjadi kebijakan internal staff dan tidak dipublikasikan. Pemain tidak berhak menuntut transparansi mengenai rincian sanksi yang dijatuhkan.' }
		]
	},
	{
		title: 'Pasal 2: Keamanan Akun',
		content: [
			{ num: '2.1', text: 'Setiap pemain bertanggung jawab penuh atas keamanan akun miliknya sendiri. Segala pelanggaran yang terjadi melalui akun tersebut, termasuk jika akun diretas atau dipinjamkan, tetap dikenakan sanksi tanpa pengecualian.' },
			{ num: '2.2', text: 'Dilarang membagikan kredensial login (password, token, atau data autentikasi lainnya) kepada siapa pun. Staff tidak pernah dan tidak akan pernah meminta password pemain dalam kondisi apa pun.' },
			{ num: '2.3', text: 'Penggunaan akun alternatif untuk menghindari sanksi yang sedang berjalan akan mengakibatkan seluruh akun terkait terkena eskalasi hukuman. Server menggunakan pelacakan IP dan identitas perangkat untuk mendeteksi pelanggaran ini.' },
			{ num: '2.4', text: 'Jual-beli akun, transfer kepemilikan akun, atau berpura-pura menjadi staff/pihak resmi server dilarang keras. Username yang mengandung unsur SARA, vulgar, atau provokatif juga tidak diperkenankan dan akan ditindak langsung oleh staff.' }
		]
	},
	{
		title: 'Pasal 3: Privasi, Keamanan Data & Aktivitas Ilegal',
		content: [
			{ num: '3.1', text: 'Dilarang keras melakukan doxxing, yaitu menyebarkan informasi pribadi pemain lain seperti nama asli, alamat, nomor telepon, foto, atau akun media sosial. Hal ini juga mencakup penggunaan social engineering untuk mendapatkan data pribadi seseorang.' },
			{ num: '3.2', text: 'Serangan DDoS/DoS, peretasan sistem server, dan penyebaran malware, virus, atau link phishing merupakan pelanggaran fatal yang akan ditindak dengan sanksi maksimal. Jika diperlukan, bukti pelanggaran akan dilimpahkan ke pihak berwajib.' },
			{ num: '3.3', text: 'Bug atau celah dalam permainan wajib dilaporkan melalui tiket Discord dan dilarang dieksploitasi untuk keuntungan pribadi. Membantu, melindungi, atau menutup-nutupi pelaku pelanggaran siber juga termasuk pelanggaran dengan bobot hukuman setara.' },
			{ num: '3.4', text: 'Server menyimpan log aktivitas pemain untuk keperluan moderasi dan keamanan. Data ini dijaga kerahasiaannya dan tidak akan dibagikan ke pihak ketiga di luar kebutuhan penegakan aturan.' }
		]
	},
	{
		title: 'Pasal 4: Transaksi & Kebijakan Points',
		content: [
			{ num: '4.1', text: 'Semua pembelian Points bersifat final dan tidak dapat dikembalikan (non-refundable) dalam kondisi apa pun. Kesalahan input username atau pemilihan platform sepenuhnya merupakan tanggung jawab pembeli.' },
			{ num: '4.2', text: 'Melakukan chargeback atau dispute pembayaran melalui pihak ketiga dianggap sebagai tindakan agresif terhadap server dan akan ditindak tegas. Points tidak dapat dijual, ditukar dengan uang nyata, atau dipindahtangankan ke pemain lain.' }
		]
	},
	{
		title: 'Pasal 5: Hak Cipta, Promosi & Konten',
		content: [
			{ num: '5.1', text: 'Seluruh aset server (logo, desain, plugin, peta) adalah milik eksklusif Trinity Indonesia dan tidak boleh digunakan untuk kepentingan komersial tanpa izin tertulis. Pemain boleh membuat konten (video, streaming) yang menampilkan server selama mencantumkan kredit yang jelas.' },
			{ num: '5.2', text: 'Mempromosikan server lain, situs judi, pinjaman ilegal, atau aktivitas ilegal lainnya dilarang keras di seluruh platform Trinity Indonesia. Promosi pribadi (streaming, konten) hanya diizinkan di channel Discord yang telah ditentukan.' },
			{ num: '5.3', text: 'Pembuatan konten yang bertujuan mencemarkan nama baik server, menyebarkan hoaks, atau provokasi merupakan pelanggaran berat. Spam dalam bentuk apa pun (pesan berulang, iklan, atau flood chat) juga dilarang dan akan ditindak.' }
		]
	},
	{
		title: 'Pasal 6: Pelaporan & Banding',
		content: [
			{ num: '6.1', text: 'Pelaporan pelanggaran wajib disertai bukti valid berupa screenshot atau rekaman video yang tidak diedit, lengkap dengan timestamp. Laporan tanpa bukti atau dengan bukti yang dimanipulasi tidak akan diproses dan pelapornya berpotensi dikenakan sanksi balik.' },
			{ num: '6.2', text: 'Staff merespons tiket dalam waktu maksimal 48 jam kerja dan dilarang dihubungi melalui DM pribadi atau spam mention. Kritik dan saran konstruktif sangat dihargai selama disampaikan dengan sopan di channel yang tepat.' }
		]
	},
	{
		title: 'Pasal 7: Cheat & Gameplay',
		type: 'warning',
		content: [
			{ num: '7.1', text: 'Penggunaan hack client (KillAura, Fly, Speed, dll) diperbolehkan secara khusus di mode AnarchyRPG. Griefing, raiding, stealing, PvP bebas, dan scamming dalam trading juga merupakan bagian sah dari mekanisme mode ini.' },
			{ num: '7.2', text: 'PvP diperbolehkan di seluruh peta kecuali dalam radius perlindungan di sekitar titik spawn. Server tidak bertanggung jawab atas kehilangan item, bangunan, atau progress pemain di mode ini.' },
			{ num: '7.3', text: 'Tetap dilarang mutlak: lag machine, exploit yang menyebabkan server crash, duplikasi item, packet exploit, dan bot farming massal yang membebani performa server. Pelanggaran terhadap ketentuan ini akan ditindak tegas tanpa banding.' }
		]
	},
	{
		title: 'Pasal 8: Chat & Interaksi',
		type: 'warning',
		content: [
			{ num: '8.1', text: 'Trash talk dan toxic chat diperbolehkan sebagai bagian dari pengalaman anarchy selama hanya berkaitan dengan konteks PvP dan persaingan in-game. Konten NSFW eksplisit (gambar, build, pixel art) tetap dilarang di semua mode tanpa pengecualian.' },
			{ num: '8.2', text: 'Tetap dilarang mutlak di semua situasi: doxxing, ancaman kekerasan nyata, konten pedofilia/CSAM, terorisme, dan ujaran kebencian rasial ekstrem. Pelanggaran ini akan ditindak dengan sanksi maksimal dan bukti dapat dilimpahkan ke pihak berwajib.' }
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
