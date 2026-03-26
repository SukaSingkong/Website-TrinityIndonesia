import { Wrapper } from '@layer/components/layout/Wrapper.jsx'
import { Icons } from '@layer/components/elements/Icons.jsx'
import { useState } from "react"

const allRules = [
	{
		title: 'Pasal 1: Ketentuan Umum',
		type: 'warning',
		content: [
			{ num: '1.1', text: 'Tidak mengetahui aturan bukan alasan yang sah untuk menghindari sanksi. Setiap pemain wajib membaca aturan ini sebelum bermain.' },
			{ num: '1.2', text: 'Dengan login dan bermain di server Trinity Indonesia, pemain secara otomatis dianggap telah membaca, memahami, dan menyetujui seluruh aturan yang tercantum di halaman ini.' },
			{ num: '1.3', text: 'Seluruh keputusan Staff, termasuk pemberian sanksi, penyelesaian sengketa antar pemain, dan penanganan laporan, bersifat mutlak dan tidak dapat diganggu gugat.' },
			{ num: '1.4', text: 'Aturan dapat diperbarui sewaktu-waktu tanpa pemberitahuan terlebih dahulu. Pemain bertanggung jawab untuk mengecek halaman ini secara berkala.' }
		]
	},
	{
		title: 'Pasal 2: Gameplay & Klien',
		type: 'info',
		content: [
			{ num: '2.1', text: 'Mod Quality of Life (QoL) berikut Diperbolehkan untuk digunakan:' },
			{ num: '', text: '• OptiFine / Sodium / Iris (mod performa & shader)' },
			{ num: '', text: '• Fullbright / Gamma mod (penerangan penuh)' },
			{ num: '', text: '• Minimap (TANPA radar entitas & TANPA radar gua)' },
			{ num: '', text: '• Armor/Status HUD (tampilan info armor & efek)' },
			{ num: '', text: '• Inventory Sorter (penataan inventori otomatis)' },
			{ num: '', text: '• Litematica / Schematica (mod blueprint bangunan)' },
			{ num: '', text: '• Replay Mod (perekam gameplay)' },
			{ num: '', text: 'Mod yang memiliki fungsi serupa tanpa mengubah gameplay secara signifikan dan tidak memberikan keuntungan tidak wajar Diperbolehkan.' },
			{ num: '2.2', text: 'Seluruh mod, hack client, dan modifikasi klien di luar daftar di atas secara tegas Dilarang. Jika ragu apakah suatu mod diperbolehkan, tanyakan ke Staff terlebih dahulu sebelum menggunakannya.' },
			{ num: '2.3', text: 'PvP, Griefing (menghancurkan bangunan), Stealing (mencuri barang), dan Scamming (menipu dalam transaksi in-game) sepenuhnya Diperbolehkan sebagai bagian dari gameplay Anarchy.' },
			{ num: '2.4', text: 'Eksploitasi bug seperti duplikasi item (Dupe), serta pembuatan Lag Machine atau Packet Exploit yang bertujuan membuat server lag/crash Dilarang dan akan dikenakan sanksi berat.' }
		]
	},
	{
		title: 'Pasal 3: Komunikasi & Interaksi',
		type: 'info',
		content: [
			{ num: '3.1', text: 'Trash talk dan toxic chat Diperbolehkan selama masih dalam konteks persaingan in-game, tidak berlebihan, dan bukan serangan personal di luar permainan.' },
			{ num: '3.2', text: 'Dilarang keras: ancaman dunia nyata, pelecehan seksual, ujaran kebencian SARA, penyebaran konten NSFW/pornografi, serta Doxxing (menyebarkan informasi pribadi pemain lain tanpa izin). Pelanggaran akan dikenakan ban permanen.' },
			{ num: '3.3', text: 'Spam chat secara berlebihan (flood) dan promosi server/layanan lain di dalam chat server Dilarang.' }
		]
	},
	{
		title: 'Pasal 4: Keamanan Akun & Komunitas',
		type: 'info',
		content: [
			{ num: '4.1', text: 'Setiap pemain bertanggung jawab penuh atas keamanan akunnya. Server tidak akan mengembalikan item, poin, atau data apapun yang hilang akibat akun diretas, dicuri, atau dipinjamkan ke pihak lain.' },
			{ num: '4.2', text: 'Impersonation (berpura-pura menjadi Staff atau pemain lain) untuk tujuan penipuan atau manipulasi merupakan pelanggaran serius dan akan dikenakan sanksi.' },
			{ num: '4.3', text: 'Segala bentuk eksploitasi yang merusak infrastruktur server (lag machine, dupe, crash exploit) akan ditangani langsung oleh Staff, dan keputusan yang diambil bersifat final tanpa banding.' }
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
					Dengan bermain di Trinity Indonesia, kamu dianggap telah membaca dan menyetujui seluruh aturan berikut. Trinity Indonesia mengusung mode permainan <strong>Anarchy</strong>. Aturan dapat berubah sewaktu-waktu tanpa pemberitahuan.
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
