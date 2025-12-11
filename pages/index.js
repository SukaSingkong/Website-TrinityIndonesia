import { Wrapper } from '@layer/components/layout/Wrapper.jsx'
import { Icons } from '@layer/components/elements/Icons.jsx'
import { useEffect, useState, useRef } from "react"
import config from '@layer/theme.config'

const gameModes = [
	{
		id: 'oneblock',
		name: 'OneBlock',
		tagline: 'Mulai dari Satu Blok',
		description: 'Tantangan skyblock unik dimana kamu memulai dengan satu blok yang terus regenerasi. Bangun kerajaan dari 0!',
		gradient: 'from-emerald-500 to-teal-500',
		shadowColor: 'shadow-emerald-500/30',
		features: ['Anti-Cheat Aktif', 'Leaderboard Global', 'Custom Islands'],
		playerCount: '2.5K+',
		badge: 'POPULAR'
	},
	{
		id: 'boxsmp',
		name: 'BoxSMP',
		tagline: 'Survival Multiplayer Premium',
		description: 'Pengalaman SMP klasik dengan ekonomi dan towns. Bangun base, join town, dan jadi yang terkaya!',
		gradient: 'from-blue-500 to-indigo-500',
		shadowColor: 'shadow-blue-500/30',
		features: ['Towns & Nations', 'Economy System', 'Events Mingguan'],
		playerCount: '1.8K+',
		badge: 'NEW'
	},
	{
		id: 'anarchy',
		name: 'Anarchy',
		tagline: 'Tanpa Batas, Tanpa Aturan',
		description: 'Mode hardcore untuk yang berani. Cheat allowed, PvP anywhere, no mercy. Bertahan jika kamu bisa!',
		gradient: 'from-red-500 to-rose-500',
		shadowColor: 'shadow-red-500/30',
		features: ['Cheat Allowed', 'Full PvP', 'Economy Bebas'],
		playerCount: '3.2K+',
		badge: 'HARDCORE'
	}
]

const stats = [
	{ value: 10847, suffix: '+', label: 'Pemain Terdaftar' },
	{ value: 99.9, suffix: '%', label: 'Uptime Server' },
	{ value: 24, suffix: '/7', label: 'Support Aktif' },
	{ value: 3, suffix: '', label: 'Game Modes' }
]

const features = [
	{ title: 'Hardware Premium', desc: 'Dedicated server dengan Ryzen 9 & NVMe SSD untuk zero lag experience' },
	{ title: 'Anti-Cheat Canggih', desc: 'Sistem proteksi berlapis untuk gameplay yang fair (mode tertentu)' },
	{ title: 'Update Reguler', desc: 'Konten baru setiap minggu dan event seasonal menarik' },
	{ title: 'Staff Profesional', desc: 'Tim moderator berpengalaman yang siap membantu 24/7' }
]

const frames = [
	{ id: 0, title: 'Buka Minecraft', paragraphs: [<>Buka launcher Minecraft versi Java Edition dan tekan Play.</>], image: '/vendor/frame_1.png' },
	{ id: 1, title: 'Multiplayer', paragraphs: [<>Klik Multiplayer di menu utama Minecraft.</>], image: '/vendor/frame_2.png' },
	{ id: 2, title: 'Direct Connect', paragraphs: [<>Klik Direct Connect dan masukkan IP: <span className="text-rose-400 font-bold">{config.serverIpAddress}</span></>], image: '/vendor/frame_3.png' }
]

// Animated Counter Hook
function useCountUp(end, duration = 2000, start = 0) {
	const [count, setCount] = useState(start);
	const [isVisible, setIsVisible] = useState(false);
	const ref = useRef(null);

	useEffect(() => {
		const observer = new IntersectionObserver(([entry]) => {
			if (entry.isIntersecting && !isVisible) {
				setIsVisible(true);
			}
		}, { threshold: 0.3 });

		if (ref.current) observer.observe(ref.current);
		return () => observer.disconnect();
	}, []);

	useEffect(() => {
		if (!isVisible) return;

		let startTime;
		const animate = (currentTime) => {
			if (!startTime) startTime = currentTime;
			const progress = Math.min((currentTime - startTime) / duration, 1);
			const easeOut = 1 - Math.pow(1 - progress, 3);
			setCount(Math.floor(easeOut * (end - start) + start));

			if (progress < 1) requestAnimationFrame(animate);
		};
		requestAnimationFrame(animate);
	}, [isVisible, end, start, duration]);

	return { count, ref };
}

export default function Home() {
	const [at, setAt] = useState(0);
	const [toastVisible, setToastVisible] = useState(false);
	const [toastMsg, setToastMsg] = useState('');
	const [hoveredMode, setHoveredMode] = useState(null);

	function toast(msg) { setToastMsg(msg); setToastVisible(true); setTimeout(() => setToastVisible(false), 2500); }
	function copyIp(e) { e?.preventDefault(); navigator.clipboard?.writeText(config.serverIpAddress); toast('IP Copied! Paste di Minecraft'); }

	return (
		<Wrapper>
			{/* Toast */}
			<div className={`${toastVisible ? 'translate-y-0 opacity-100 scale-100' : 'translate-y-4 opacity-0 scale-95'} fixed right-6 bottom-6 z-50 glass-card px-6 py-4 rounded-2xl shadow-2xl transition-all duration-300 border border-emerald-500/30`}>
				<div className="flex items-center gap-3">
					<div className="w-8 h-8 rounded-full bg-emerald-500/20 flex items-center justify-center">
						<Icons.CheckCircle className="h-5 w-5 text-emerald-400" />
					</div>
					<p className="text-white font-semibold">{toastMsg}</p>
				</div>
			</div>

			{/* HERO */}
			<section className="relative min-h-screen flex items-center justify-center overflow-hidden">
				<div className="absolute inset-0 bg-cover bg-center scale-105" style={{ backgroundImage: 'url("/vendor/bg.jpg")' }} />
				<div className="absolute inset-0 bg-gradient-to-b from-black/40 via-black/60 to-[var(--surface-900)]" />

				{/* Animated Grid */}
				<div className="absolute inset-0 opacity-20" style={{
					backgroundImage: 'linear-gradient(rgba(255,255,255,0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.03) 1px, transparent 1px)',
					backgroundSize: '50px 50px'
				}} />

				{/* Particles */}
				<div className="absolute inset-0 overflow-hidden pointer-events-none">
					{[...Array(8)].map((_, i) => (
						<div key={i} className={`particle particle-${(i % 6) + 1}`} style={{ animationDelay: `${i * 0.5}s` }} />
					))}
				</div>

				<div className="relative z-10 text-center px-6 max-w-6xl mx-auto pt-20">
					{/* Live Badge */}
					<div className="inline-flex items-center gap-3 px-5 py-2.5 rounded-full glass mb-10 animate-fade-in-up border border-white/10">
						<span className="relative flex h-3 w-3">
							<span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
							<span className="relative inline-flex rounded-full h-3 w-3 bg-emerald-500"></span>
						</span>
						<span className="text-sm font-semibold text-white">Server Online</span>
						<span className="w-px h-4 bg-white/20" />
						<span className="text-sm text-gray-400">7,500+ pemain aktif bulan ini</span>
					</div>

					{/* Main Title */}
					<h1 className="text-5xl md:text-7xl lg:text-8xl font-black uppercase mb-8 animate-fade-in-up leading-[0.9]" style={{ animationDelay: '0.1s' }}>
						<span className="text-white">Server Minecraft</span>
						<br />
						<span className="gradient-text">#1 Indonesia</span>
					</h1>

					{/* Subtitle */}
					<p className="text-xl md:text-2xl text-gray-300 mb-12 max-w-3xl mx-auto animate-fade-in-up font-light" style={{ animationDelay: '0.2s' }}>
						3 mode berbeda untuk setiap jenis pemain. Dari casual sampai hardcore.
					</p>

					{/* CTA Group */}
					<div className="flex flex-col sm:flex-row gap-5 justify-center items-center animate-fade-in-up" style={{ animationDelay: '0.3s' }}>
						<button onClick={copyIp} className="group relative glow-button font-bold uppercase py-5 px-10 rounded-2xl flex items-center gap-4 text-white text-lg overflow-hidden">
							<Icons.ClipboardCopy className="h-6 w-6 transition-transform group-hover:scale-110" />
							<span>{config.serverIpAddress}</span>
							<span className="absolute inset-0 bg-white/20 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-500 skew-x-12" />
						</button>
						<a href="#modes" className="glass font-semibold py-5 px-10 rounded-2xl flex items-center gap-3 text-white hover:bg-white/10 transition-all duration-300 border border-white/10 hover:border-white/20">
							Explore Game Modes
							<Icons.ArrowRight className="h-5 w-5" />
						</a>
					</div>

					{/* Stats */}
					<div className="mt-20 grid grid-cols-2 md:grid-cols-4 gap-6 animate-fade-in-up" style={{ animationDelay: '0.4s' }}>
						{stats.map((stat, i) => {
							const { count, ref } = useCountUp(stat.value, 2000);
							return (
								<div key={i} ref={ref} className="glass px-6 py-5 rounded-2xl border border-white/5 hover:border-white/10 transition-all duration-300 group hover:scale-105">
									<div className="text-3xl md:text-4xl font-black text-white mb-1 tabular-nums">
										{typeof stat.value === 'number' && stat.value < 100 ? count : count.toLocaleString()}{stat.suffix}
									</div>
									<div className="text-sm text-gray-400 group-hover:text-gray-300 transition-colors">{stat.label}</div>
								</div>
							);
						})}
					</div>
				</div>

				{/* Scroll Indicator */}
				<div className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 animate-bounce">
					<span className="text-xs text-gray-500 uppercase tracking-widest">Scroll</span>
					<Icons.ChevronDown className="h-5 w-5 text-gray-500" />
				</div>
			</section>

			{/* GAME MODES */}
			<section className="py-32 relative" style={{ background: 'var(--surface-900)' }} id="modes">
				<div className="container">
					<div className="text-center mb-20">
						<span className="inline-block px-4 py-1.5 rounded-full text-xs font-bold uppercase bg-rose-500/10 text-rose-400 border border-rose-500/20 mb-6">Pilih Petualanganmu</span>
						<h2 className="text-4xl md:text-6xl font-black uppercase text-white mb-6">Game Modes</h2>
						<p className="text-xl text-gray-400 max-w-2xl mx-auto">Tiga pengalaman unik dalam satu server. Mau santai atau hardcore?</p>
					</div>

					<div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
						{gameModes.map((mode, i) => (
							<div
								key={mode.id}
								className={`group relative rounded-3xl overflow-hidden transition-all duration-500 hover:scale-[1.03] ${hoveredMode === mode.id ? mode.shadowColor + ' shadow-2xl' : ''}`}
								style={{ background: 'linear-gradient(145deg, rgba(26,26,38,0.9), rgba(18,18,26,0.95))' }}
								onMouseEnter={() => setHoveredMode(mode.id)}
								onMouseLeave={() => setHoveredMode(null)}
							>
								{/* Top Gradient Line */}
								<div className={`absolute top-0 left-0 right-0 h-1 bg-gradient-to-r ${mode.gradient} opacity-0 group-hover:opacity-100 transition-opacity`} />

								{/* Badge */}
								<div className={`absolute top-6 right-6 px-3 py-1 rounded-lg text-[10px] font-black uppercase bg-gradient-to-r ${mode.gradient} text-white`}>
									{mode.badge}
								</div>

								{/* Content */}
								<div className="p-8">
									{/* Icon & Title */}
									<div className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${mode.gradient} flex items-center justify-center text-white mb-6 group-hover:scale-110 group-hover:rotate-3 transition-transform duration-300`}>
										<Icons.Cube className="h-8 w-8" />
									</div>

									<h3 className="text-2xl font-black text-white uppercase mb-2">{mode.name}</h3>
									<p className={`text-sm font-semibold bg-gradient-to-r ${mode.gradient} bg-clip-text text-transparent mb-4`}>{mode.tagline}</p>
									<p className="text-gray-400 mb-8 leading-relaxed">{mode.description}</p>

									{/* Features */}
									<div className="space-y-3 mb-8">
										{mode.features.map((f, fi) => (
											<div key={fi} className="flex items-center gap-3">
												<div className={`w-5 h-5 rounded-full bg-gradient-to-r ${mode.gradient} flex items-center justify-center`}>
													<Icons.CheckCircle className="h-3 w-3 text-white" />
												</div>
												<span className="text-gray-300 text-sm">{f}</span>
											</div>
										))}
									</div>

									{/* Player Count & CTA */}
									<div className="flex items-center justify-between pt-6 border-t border-white/5">
										<div>
											<span className="text-2xl font-black text-white">{mode.playerCount}</span>
											<span className="text-sm text-gray-500 ml-2">players</span>
										</div>
										<button onClick={copyIp} className={`px-6 py-2.5 rounded-xl font-bold uppercase text-sm text-white bg-gradient-to-r ${mode.gradient} hover:opacity-90 transition-all`}>
											Play Now
										</button>
									</div>
								</div>
							</div>
						))}
					</div>
				</div>
			</section>

			{/* WHY US */}
			<section className="py-32 relative overflow-hidden" style={{ background: 'var(--surface-800)' }}>
				<div className="absolute top-0 right-0 w-[600px] h-[600px] bg-rose-500/5 rounded-full blur-[150px]" />
				<div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-blue-500/5 rounded-full blur-[120px]" />

				<div className="container relative z-10">
					<div className="grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
						<div>
							<span className="inline-block px-4 py-1.5 rounded-full text-xs font-bold uppercase bg-rose-500/10 text-rose-400 border border-rose-500/20 mb-6">Kenapa Kami?</span>
							<h2 className="text-4xl md:text-5xl font-black uppercase text-white mb-8 leading-tight">
								Bukan Server<br /><span className="gradient-text">Biasa</span>
							</h2>
							<p className="text-xl text-gray-400 mb-12">Dibangun dengan teknologi terdepan dan passion untuk memberikan pengalaman Minecraft terbaik di Indonesia.</p>

							<div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
								{features.map((f, i) => (
									<div key={i} className="group p-5 rounded-2xl border border-white/5 hover:border-rose-500/20 hover:bg-white/[0.02] transition-all duration-300">
										<div className="w-10 h-10 rounded-xl bg-gradient-to-br from-rose-500/20 to-orange-500/20 flex items-center justify-center text-rose-400 mb-4 group-hover:scale-110 transition-transform">
											<Icons.CheckCircle className="h-5 w-5" />
										</div>
										<h4 className="font-bold text-white mb-2">{f.title}</h4>
										<p className="text-sm text-gray-500">{f.desc}</p>
									</div>
								))}
							</div>
						</div>

						{/* Testimonials or Social Proof */}
						<div className="relative">
							<div className="absolute -top-10 -left-10 w-20 h-20 bg-gradient-to-br from-rose-500 to-orange-500 rounded-2xl opacity-20 blur-xl" />
							<div className="space-y-6">
								{[
									{ name: 'ProGamer_ID', msg: 'Gue udah main di OneBlock hampir 6 bulan dan masih ketagihan! Komunitasnya ramah banget, staffnya responsif, dan update-nya rajin. Recommended banget buat yang nyari server skyblock Indonesia!', mode: 'OneBlock' },
									{ name: 'CraftMaster99', msg: 'BoxSMP Trinity beda sama server lain. Event mingguan seru, ekonominya seimbang, dan yang paling penting anti-cheatnya beneran works. Gak ada lagi player toxic yang bikin rusuh!', mode: 'BoxSMP' },
									{ name: 'AnarchyKing', msg: 'Kalau mau anarchy mode yang legit, ini tempatnya. Server stabil padahal player banyak, cheat allowed tapi tetap fair karena semua equal. Udah jadi home server gue sejak awal!', mode: 'Anarchy' }
								].map((t, i) => (
									<div key={i} className="glass-card p-6 rounded-2xl border border-white/5 hover:border-white/10 transition-all group hover:translate-x-2">
										<p className="text-gray-300 mb-4">"{t.msg}"</p>
										<div className="flex items-center gap-3">
											<img src={`https://mc-heads.net/avatar/${t.name}/40`} className="w-10 h-10 rounded-xl" alt="" />
											<div>
												<p className="font-bold text-white text-sm">{t.name}</p>
												<p className="text-xs text-gray-500">{t.mode} Player</p>
											</div>
										</div>
									</div>
								))}
							</div>
						</div>
					</div>
				</div>
			</section>

			{/* HOW TO JOIN */}
			<section className="py-32 relative" style={{ background: 'var(--surface-900)' }} id="join">
				<div className="container">
					<div className="text-center mb-16">
						<span className="inline-block px-4 py-1.5 rounded-full text-xs font-bold uppercase bg-rose-500/10 text-rose-400 border border-rose-500/20 mb-6">Mulai Bermain</span>
						<h2 className="text-4xl md:text-5xl font-black uppercase text-white mb-6">3 Langkah Mudah</h2>
					</div>

					<div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto">
						{frames.map((frame, i) => (
							<div key={i} className="text-center group">
								<div className="w-20 h-20 mx-auto mb-6 rounded-2xl bg-gradient-to-br from-rose-500/20 to-orange-500/20 flex items-center justify-center text-4xl font-black text-white group-hover:scale-110 transition-transform">
									{i + 1}
								</div>
								<h3 className="text-xl font-bold text-white mb-3">{frame.title}</h3>
								<p className="text-gray-400">{frame.paragraphs[0]}</p>
							</div>
						))}
					</div>

					<div className="text-center mt-16">
						<button onClick={copyIp} className="glow-button font-bold uppercase py-5 px-12 rounded-2xl flex items-center gap-4 text-white text-lg mx-auto">
							<Icons.ClipboardCopy className="h-6 w-6" />
							Copy IP: {config.serverIpAddress}
						</button>
					</div>
				</div>
			</section>

			{/* FINAL CTA */}
			<section className="py-32 relative overflow-hidden" style={{ background: 'linear-gradient(135deg, #1a0a0a 0%, #0a0a0f 100%)' }}>
				<div className="absolute inset-0 opacity-30" style={{
					backgroundImage: 'radial-gradient(circle at 50% 50%, rgba(239,68,68,0.1) 0%, transparent 50%)'
				}} />

				<div className="container relative z-10">
					<div className="max-w-4xl mx-auto text-center">
						<h2 className="text-5xl md:text-7xl font-black uppercase text-white mb-8">
							Ready to<br /><span className="gradient-text">Dominate?</span>
						</h2>
						<p className="text-xl text-gray-400 mb-12">Gabung dengan 10,000+ pemain yang sudah mempercayai Trinity Indonesia.</p>

						<div className="flex flex-col sm:flex-row gap-6 justify-center">
							<button onClick={copyIp} className="glow-button font-bold uppercase py-6 px-14 rounded-2xl flex items-center gap-4 text-white text-xl">
								<Icons.ClipboardCopy className="h-7 w-7" />
								{config.serverIpAddress}
							</button>
						</div>
					</div>
				</div>
			</section>
		</Wrapper>
	)
}
