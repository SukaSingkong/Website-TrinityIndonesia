import { Wrapper } from '@layer/components/layout/Wrapper.jsx'
import { Icons } from '@layer/components/elements/Icons.jsx'
import { useState } from "react"

const allRules = [
	{
		title: 'Pasal 1: Ketentuan Umum',
		type: 'warning',
		content: [
			{ num: '1.1', text: 'Ketidaktahuan terhadap aturan tidak dapat dijadikan alasan untuk menghindari sanksi.' },
			{ num: '1.2', text: 'Dengan masuk dan bermain di server Trinity Indonesia, pemain dianggap telah membaca, memahami, dan menyetujui seluruh aturan yang berlaku.' },
			{ num: '1.3', text: 'Keputusan Staff dalam memberikan sanksi atau menyelesaikan perselisihan bersifat mutlak dan final.' }
		]
	},
	{
		title: 'Pasal 2: Gameplay & Klien',
		type: 'info',
		content: [
			{ num: '2.1', text: 'Penggunaan hack client (seperti KillAura, Fly, Speed, X-Ray), modifikasi klien, Auto-clicker, dan Macro Diperbolehkan.' },
			{ num: '2.2', text: 'Membunuh pemain lain (PvP), menghancurkan bangunan (Griefing), mencuri barang (Stealing), dan melakukan penipuan dalam transaksi in-game (Scamming) Diperbolehkan.' },
			{ num: '2.3', text: 'Eksploitasi bug server (Dupe item) atau penggunaan alat/mesin yang secara sengaja ditujukan untuk membuat server lag atau crash (Lag Machines/Packet Exploits) Dilarang.' }
		]
	},
	{
		title: 'Pasal 3: Komunikasi & Interaksi',
		type: 'info',
		content: [
			{ num: '3.1', text: 'Toxic chat dan trash talk diperbolehkan sebatas persaingan in-game.' },
			{ num: '3.2', text: 'DILARANG: Melontarkan ancaman dunia nyata, pelecehan seksual, ujaran kebencian ekstrem/SARA, penyebaran konten NSFW, dan Doxxing (menyebarkan data pribadi orang lain).' },
			{ num: '3.3', text: 'Spamming yang berlebihan atau mempromosikan server/layanan lain di chat in-game tidak diperkenankan.' }
		]
	},
	{
		title: 'Pasal 4: Keamanan Akun & Komunitas',
		type: 'info',
		content: [
			{ num: '4.1', text: 'Jaga keamanan akunmu sendiri. Server tidak mengembalikan barang atau poin yang hilang akibat akun yang diretas, dicuri, ataupun dipinjamkan.' },
			{ num: '4.2', text: 'Berpura-pura menjadi anggota Staff (Impersonation) untuk menipu pemain lain adalah pelanggaran serius.' },
			{ num: '4.3', text: 'Keputusan Staff dalam menindaklanjuti eksploitasi yang merusak infrastruktur server (seperti lag machine/dupe) bersifat final.' }
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
