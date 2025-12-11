import { Wrapper } from '@layer/components/layout/Wrapper.jsx'
import { Icons } from '@layer/components/elements/Icons.jsx'
import { useState } from "react"
import config from '@layer/theme.config'

const staffMembers = [
	{ name: 'LouYz_', position: 'Owner', role: 'owner', description: 'Pemilik dan pengelola utama server Trinity Indonesia.' },
	{ name: 'Eikiiii', position: 'Developer', role: 'dev', description: 'Bertanggung jawab atas pengembangan fitur dan plugin server.' },
	{ name: 'Arjuna', position: 'Admin Senior', role: 'admin', description: 'Tim administrasi senior yang menjaga ketertiban server.' },
	{ name: 'BayuHD', position: 'Admin', role: 'admin', description: 'Tim administrasi yang membantu menjaga komunitas.' },
	{ name: 'Arinus_ID', position: 'Admin', role: 'admin', description: 'Tim administrasi yang membantu menjaga komunitas.' },
]

const roleConfig = {
	owner: { gradient: 'from-amber-500 to-orange-500', bg: 'from-amber-500/10 to-orange-500/10', glow: 'shadow-amber-500/20' },
	dev: { gradient: 'from-violet-500 to-purple-500', bg: 'from-violet-500/10 to-purple-500/10', glow: 'shadow-violet-500/20' },
	admin: { gradient: 'from-red-500 to-rose-500', bg: 'from-red-500/10 to-rose-500/10', glow: 'shadow-red-500/20' },
}

export default function Staff() {
	const [toastVisible, setToastVisible] = useState(false);
	const [toastMsg, setToastMsg] = useState('');

	function toast(msg, d = 2000) { setToastMsg(msg); setToastVisible(true); setTimeout(() => setToastVisible(false), d); }
	function copyIpAddress(e) { e.preventDefault(); if (typeof window !== "undefined") navigator.clipboard.writeText(config.serverIpAddress); toast('IP server berhasil disalin!'); }

	return (
		<Wrapper seo={{ title: 'Tim Staf' }}>
			<div className={`${toastVisible ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'} fixed right-5 bottom-5 z-50 glass-card px-6 py-4 rounded-2xl shadow-2xl transition-all duration-300`}>
				<p className="text-white font-semibold">{toastMsg}</p>
			</div>

			<section className="relative min-h-[50vh] flex items-center overflow-hidden pt-24">
				<div className="absolute inset-0 bg-cover bg-center" style={{ backgroundImage: 'url("/vendor/bg.jpg")' }} />
				<div className="absolute inset-0 hero-gradient" />
				<div className="absolute inset-0 overflow-hidden pointer-events-none">
					<div className="particle particle-1" /><div className="particle particle-2" /><div className="particle particle-4" />
				</div>

				<div className="container relative z-10">
					<div className="max-w-3xl">
						<p className="text-sm font-bold text-rose-400 mb-4 uppercase tracking-widest">Tim Staf</p>
						<h1 className="text-4xl md:text-6xl font-black text-white uppercase mb-6">Kenali <span className="gradient-text">Tim Kami</span></h1>
						<p className="text-lg text-gray-300 mb-8">Orang-orang hebat di balik layar yang memastikan server tetap aman dan menyenangkan.</p>
						<button onClick={copyIpAddress} className="glow-button font-bold uppercase py-4 px-8 rounded-2xl flex items-center gap-3 text-white">
							<Icons.ClipboardCopy className="h-5 w-5" />
							{config.serverIpAddress}
						</button>
					</div>
				</div>
			</section>

			<section className="py-24" style={{ background: 'var(--surface-900)' }}>
				<div className="container">
					<div className="text-center mb-16">
						<p className="text-sm font-bold text-rose-400 mb-3 uppercase tracking-widest flex items-center justify-center gap-2">
							<Icons.Sparkles className="h-4 w-4" />Tim Staf Kami<Icons.Sparkles className="h-4 w-4" />
						</p>
						<h2 className="text-4xl md:text-5xl font-black uppercase text-white mb-4">Kami Menjaga Server Tetap Aman!</h2>
					</div>

					<div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
						{staffMembers.map((member, i) => <StaffCard key={i} {...member} />)}
					</div>
				</div>
			</section>
		</Wrapper>
	)
}

const StaffCard = ({ name, position, role, description }) => {
	const cfg = roleConfig[role]
	return (
		<div className={`glass-card p-6 rounded-2xl hover:shadow-2xl ${cfg.glow} transition-all duration-500 group`}>
			<div className="flex items-start gap-5">
				<div className="relative flex-shrink-0">
					<div className={`w-20 h-20 rounded-2xl overflow-hidden shadow-xl group-hover:shadow-2xl ${cfg.glow} transition-all duration-500`}>
						<img src={`https://mc-heads.net/avatar/${name}`} className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-500" alt={name} />
					</div>
					<div className={`absolute -bottom-2 -right-2 w-8 h-8 rounded-lg bg-gradient-to-br ${cfg.gradient} flex items-center justify-center text-white shadow-lg`}>
						<Icons.Star className="h-5 w-5" />
					</div>
				</div>
				<div className="flex-1">
					<h4 className="text-xl font-bold text-white mb-1">{name}</h4>
					<div className={`inline-block px-3 py-1 rounded-full text-xs font-bold uppercase bg-gradient-to-r ${cfg.gradient} text-white mb-3`}>{position}</div>
					<p className="text-gray-400 text-sm">{description}</p>
				</div>
			</div>
		</div>
	)
}
