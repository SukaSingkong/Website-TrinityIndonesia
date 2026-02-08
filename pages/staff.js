import { Wrapper } from '@layer/components/layout/Wrapper.jsx'
import { Icons } from '@layer/components/elements/Icons.jsx'
import { useState } from "react"
import config from '@layer/theme.config'

const staffMembers = [
	{ name: 'LouYz_', position: 'Owner', role: 'owner', clearance: 'LEVEL 5', description: 'Pemilik server. Mengurus semua keputusan penting.' },
	{ name: 'Eikiiii', position: 'Developer', role: 'dev', clearance: 'LEVEL 4', description: 'Developer utama. Membuat dan memelihara plugin.' },
	{ name: 'Arjuna', position: 'Admin Senior', role: 'admin', clearance: 'LEVEL 3', description: 'Admin senior. Mengawasi komunitas server.' },
	{ name: 'BayuHD', position: 'Admin', role: 'admin', clearance: 'LEVEL 3', description: 'Admin. Menjaga ketertiban dan keamanan server.' },
	{ name: 'Arinus_ID', position: 'Admin', role: 'admin', clearance: 'LEVEL 3', description: 'Admin. Menjaga ketertiban dan keamanan server.' },
]

const roleConfig = {
	owner: { border: 'border-red-500', text: 'text-red-500', bg: 'bg-red-500/10' },
	dev: { border: 'border-purple-500', text: 'text-purple-500', bg: 'bg-purple-500/10' },
	admin: { border: 'border-blue-500', text: 'text-blue-500', bg: 'bg-blue-500/10' },
}

export default function Staff() {
	const [toastVisible, setToastVisible] = useState(false);
	const [toastMsg, setToastMsg] = useState('');

	function toast(msg, d = 2000) { setToastMsg(msg); setToastVisible(true); setTimeout(() => setToastVisible(false), d); }
	function copyIpAddress(e) { e.preventDefault(); if (typeof window !== "undefined") navigator.clipboard.writeText(config.serverIpAddress); toast('COPIED TO CLIPBOARD'); }

	return (
		<Wrapper seo={{ 
			title: 'Tim Staff',
			description: 'Daftar staff resmi Trinity Indonesia yang bertanggung jawab menjaga server dan membantu komunitas pemain.',
			path: '/staff'
		}}>
			{/* Toast */}
			<div className={`${toastVisible ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'} fixed right-6 bottom-6 z-50 cia-box px-6 py-4 bg-black border border-emerald-500 transition-all duration-300`}>
				<div className="flex items-center gap-3">
					<Icons.CheckCircle className="h-5 w-5 text-emerald-400 animate-pulse" />
					<p className="text-white font-mono uppercase tracking-widest text-sm">{toastMsg}</p>
				</div>
			</div>

			{/* HEADER */}
			<section className="relative min-h-[40vh] flex flex-col justify-center pt-32 pb-12 border-b border-red-900/30 bg-black overflow-hidden">
				<div className="absolute inset-0 bg-grid opacity-20" />
                <div className="absolute inset-0 bg-gradient-to-b from-transparent to-[var(--surface-900)]"></div>
				
				<div className="container relative z-10">
					<div className="max-w-4xl mx-auto text-center">
						<div className="flex items-center justify-center gap-3 mb-4">
                            <div className="h-px w-8 bg-red-500"></div>
						    <p className="text-xs font-mono text-red-500 uppercase tracking-[0.3em]">DAFTAR STAFF</p>
                            <div className="h-px w-8 bg-red-500"></div>
                        </div>
						<h1 className="text-5xl md:text-7xl font-black text-white uppercase mb-6 leading-none glitch-effect">
                            TIM STAFF
                        </h1>
						<p className="text-lg text-gray-500 mb-8 font-mono max-w-2xl mx-auto">
                            Daftar staff yang bertanggung jawab menjaga server dan membantu komunitas.
                        </p>
					</div>
				</div>
			</section>

            {/* ROSTER */}
			<section className="py-24" style={{ background: 'var(--surface-900)' }}>
				<div className="container">
                    <div className="mb-12 flex items-end justify-between border-b border-red-900/30 pb-4">
                        <h2 className="text-2xl font-bold uppercase text-white flex gap-3 items-center">
                            <Icons.Users className="h-6 w-6 text-red-500" />
                            DAFTAR STAFF
                        </h2>
                        <span className="text-xs font-mono text-red-500 animate-pulse">AKTIF</span>
                    </div>

					<div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-5xl mx-auto">
						{staffMembers.map((member, i) => <StaffCard key={i} {...member} />)}
					</div>
				</div>
			</section>
		</Wrapper>
	)
}

const StaffCard = ({ name, position, role, clearance, description }) => {
	const cfg = roleConfig[role] || roleConfig.admin
	return (
		<div className={`cia-box p-1 group bg-black hover:bg-white/5 transition-all`}>
            <div className="relative p-6 h-full flex items-start gap-6">
                {/* Photo ID */}
				<div className="relative flex-shrink-0">
                    <div className="absolute -top-1 -left-1 w-2 h-2 border-t border-l border-red-500"></div>
                    <div className="absolute -bottom-1 -right-1 w-2 h-2 border-b border-r border-red-500"></div>
                    
					<div className={`w-24 h-24 bg-gray-900 grayscale group-hover:grayscale-0 transition-all duration-500`}>
						<img src={`https://mc-heads.net/avatar/${name}`} className="w-full h-full object-cover p-1" alt={name} />
					</div>
                    <div className="mt-2 text-center">
                        <span className={`text-[10px] font-mono border ${cfg.border} ${cfg.text} px-1`}>{clearance}</span>
                    </div>
				</div>

				<div className="flex-1 min-w-0">
                    <div className="flex justify-between items-start mb-2">
					    <h4 className="text-2xl font-black text-white uppercase tracking-tight">{name}</h4>
                        <Icons.CheckCircle className="h-4 w-4 text-emerald-500" />
                    </div>
                    
                    <div className="mb-4">
					    <span className={`inline-block mr-2 px-2 py-0.5 text-[10px] font-bold uppercase ${cfg.bg} ${cfg.text} border ${cfg.border} tracking-wider`}>
                            {position}
                        </span>
                    </div>
                    
                    <div className="h-px w-full bg-gray-800 mb-4"></div>
					<p className="text-gray-500 text-xs font-mono leading-relaxed uppercase">{description}</p>
				</div>
			</div>
		</div>
	)
}
