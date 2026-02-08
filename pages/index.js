import { Wrapper } from '@layer/components/layout/Wrapper.jsx'
import { Icons } from '@layer/components/elements/Icons.jsx'
import { useEffect, useState, useRef } from "react"
import config from '@layer/theme.config'

const gameModes = [
	{
		id: 'junktycoon',
		name: 'Junk Tycoon',
		tagline: 'Kumpulkan, Jual, Kaya!',
		description: 'Mode tycoon seru dimana kamu mengumpulkan sampah dan menjualnya untuk membangun kerajaan bisnis. Upgrade mesin dan jadi miliarder!',
		gradient: 'from-emerald-500 to-teal-500', // Keep for accent usage
		shadowColor: 'shadow-emerald-500/30',
		features: ['Auto Clicker Allowed', 'Leaderboard Global', 'Custom Upgrades'],
		playerCount: '2.5K+',
		badge: 'POPULAR',
        code: 'JT-001'
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
		badge: 'NEW',
        code: 'BX-SMP'
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
		badge: 'HARDCORE',
        code: 'AN-RCHY'
	}
]

const stats = [
	{ value: 10847, suffix: '+', label: 'PEMAIN TERDAFTAR' },
	{ value: 99.9, suffix: '%', label: 'UPTIME SERVER' },
	{ value: 24, suffix: '/7', label: 'ONLINE' },
	{ value: 3, suffix: '', label: 'MODE AKTIF' }
]

const features = [
	{ title: 'HARDWARE PREMIUM', desc: 'Dedicated server dengan Ryzen 9 & NVMe SSD untuk zero lag experience' },
	{ title: 'ANTI-CHEAT CANGGIH', desc: 'Sistem proteksi berlapis untuk gameplay yang fair (mode tertentu)' },
	{ title: 'UPDATE REGULER', desc: 'Konten baru setiap minggu dan event seasonal menarik' },
	{ title: 'STAFF PROFESIONAL', desc: 'Tim moderator berpengalaman yang siap membantu 24/7' }
]

const frames = [
	{ id: 0, title: 'INITIATE LAUNCHER', paragraphs: [<>Buka launcher Minecraft versi Java Edition dan tekan Play.</>], code: 'STEP-01' },
	{ id: 1, title: 'ACCESS MULTIPLAYER', paragraphs: [<>Klik Multiplayer di menu utama Minecraft.</>], code: 'STEP-02' },
	{ id: 2, title: 'ESTABLISH CONNECTION', paragraphs: [<>Klik Direct Connect dan masukkan IP: <span className="text-rose-400 font-bold">{config.serverIpAddress}</span></>], code: 'STEP-03' }
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
		// eslint-disable-next-line react-hooks/exhaustive-deps
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
	const [hoveredMode, setHoveredMode] = useState(null);
    const [scrolled, setScrolled] = useState(false);
    const [showBackToTop, setShowBackToTop] = useState(false);

    // Track scroll position
	useEffect(() => {
		const handleScroll = () => {
			setScrolled(window.scrollY > 100);
			setShowBackToTop(window.scrollY > 500);
		};
		window.addEventListener('scroll', handleScroll);
		return () => window.removeEventListener('scroll', handleScroll);
	}, []);


	function copyIp() { 
		navigator.clipboard?.writeText(config.serverIpAddress);
		// Use global toast from Wrapper
		const toast = document.getElementById('footer-toast');
		if (toast) {
			toast.classList.remove('opacity-0', 'translate-y-2');
			toast.classList.add('opacity-100', 'translate-y-0');
			setTimeout(() => {
				toast.classList.remove('opacity-100', 'translate-y-0');
				toast.classList.add('opacity-0', 'translate-y-2');
			}, 2000);
		}
	}

    function scrollToTop() {
		window.scrollTo({ top: 0, behavior: 'smooth' });
	}

	function scrollToSection(e, sectionId) {
		e.preventDefault();
		const element = document.getElementById(sectionId);
		if (element) {
			element.scrollIntoView({ behavior: 'smooth', block: 'start' });
		}
	}

	return (
		<Wrapper seo={{
			title: 'Server Minecraft #1 Indonesia',
			description: 'Trinity Indonesia adalah server Minecraft terbaik di Indonesia dengan 3 mode: Junk Tycoon, BoxSMP, dan Anarchy. Bergabung dengan 10,000+ pemain sekarang!',
			path: '/',
			type: 'website'
		}}>
            <div className="scanlines"></div>
            
			{/* HERO */}
			<section className="relative min-h-screen flex items-center justify-center overflow-hidden bg-grid">
                
				<div className="absolute inset-0 bg-cover bg-center opacity-20 grayscale brightness-50" style={{ backgroundImage: 'url("/vendor/bg.webp")' }} />
				<div className="absolute inset-0 bg-gradient-to-b from-black/80 via-black/50 to-[var(--surface-900)]" />

				<div className="relative z-10 text-center px-6 max-w-6xl mx-auto pt-20">
					{/* Live Badge */}
					<div className="inline-flex items-center gap-3 px-4 py-2 cia-box mb-10 border-red-500/50">
						<span className="relative flex h-2 w-2">
							<span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
							<span className="relative inline-flex rounded-full h-2 w-2 bg-red-500"></span>
						</span>
						<span className="text-xs font-bold text-red-500 tracking-[0.2em] animate-pulse">STATUS SERVER: ONLINE</span>
					</div>

					{/* Main Title */}
					<h1 className="text-5xl md:text-8xl font-black uppercase mb-8 leading-none tracking-tighter shimmer-text">
						<span className="block text-white glitch-effect" data-text="SERVER MINECRAFT">Server Minecraft</span>
						<span className="block text-red-600 glitch-effect" data-text="#1 INDONESIA">#1 Indonesia</span>
					</h1>

					{/* Subtitle */}
					<div className="max-w-2xl mx-auto mb-12 border-l-2 border-red-500 pl-6 text-left">
                        <p className="text-lg md:text-xl text-gray-400 font-mono">
                            <span className="text-red-500 mr-2">{'>'}</span> 
                            3 mode berbeda untuk setiap jenis pemain. Dari casual sampai hardcore.
                        </p>
					</div>

					{/* CTA Group */}
					<div className="flex flex-col sm:flex-row gap-5 justify-center items-center">
						<button onClick={copyIp} className="cia-btn hover:bg-red-600/20 group">
                            <span className="absolute top-0 left-0 w-2 h-2 border-t border-l border-red-500"></span>
                            <span className="absolute bottom-0 right-0 w-2 h-2 border-b border-r border-red-500"></span>
							<div className="flex items-center gap-4">
                                <Icons.ClipboardCopy className="h-5 w-5" />
                                <span>COPY IP: {config.serverIpAddress}</span>
                            </div>
						</button>
						<button onClick={(e) => scrollToSection(e, 'modes')} className="cia-btn text-white border-white/30 hover:border-white hover:text-black hover:bg-white group">
							<span>LIHAT MODE</span>
                            <Icons.ArrowRight className="h-4 w-4 ml-2 inline-block group-hover:translate-x-1 transition-transform" />
						</button>
					</div>

					{/* Stats */}
					<div className="mt-20 grid grid-cols-2 md:grid-cols-4 gap-4">
						{stats.map((stat, i) => (
							<StatCard key={i} value={stat.value} suffix={stat.suffix} label={stat.label} />
						))}
					</div>
				</div>

				{/* Scroll Indicator */}
				<div className={`absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 ${scrolled ? 'opacity-0' : 'opacity-100'} transition-opacity duration-500`}>
					<span className="text-[10px] text-red-500 uppercase tracking-[0.3em] animate-pulse">SCROLL UNTUK LANJUT</span>
                    <div className="w-[1px] h-10 bg-gradient-to-b from-red-500 to-transparent"></div>
				</div>
			</section>

			{/* GAME MODES */}
			<section className="py-32 relative bg-black" id="modes">
                <div className="absolute inset-0 bg-grid opacity-20 pointer-events-none"></div>
				<div className="container relative z-10">
					<div className="mb-20 border-b border-red-900/30 pb-10">
                        <div className="flex items-end justify-between">
                            <div>
                                <h2 className="cia-header text-4xl md:text-6xl font-black uppercase text-white mb-2">GAME MODES</h2>
                                <p className="text-gray-500 font-mono text-sm tracking-wider">PILIH MODE BERMAIN</p>
                            </div>
                            <div className="text-right hidden md:block">
                                <p className="text-red-500 font-mono text-xs">3 MODE TERSEDIA</p>
                                <p className="text-gray-600 font-mono text-xs">PILIH FAVORITMU</p>
                            </div>
                        </div>
					</div>

					<div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
						{gameModes.map((mode, i) => (
							<div
								key={mode.id}
								className={`cia-box p-1 group transition-all duration-300 hover:bg-red-900/5`}
								onMouseEnter={() => setHoveredMode(mode.id)}
								onMouseLeave={() => setHoveredMode(null)}
							>
                                <div className="absolute top-2 right-2 text-[10px] text-red-500 font-mono border border-red-500/30 px-2 py-0.5">
                                    {mode.code}
                                </div>

								{/* Content */}
								<div className="p-8 h-full flex flex-col relative overflow-hidden">
                                     {/* Scan overlay on hover */}
                                    <div className="absolute inset-0 bg-red-500/5 translate-y-full group-hover:translate-y-0 transition-transform duration-500 pointer-events-none"></div>

									<h3 className="text-3xl font-black text-white uppercase mb-2 group-hover:text-red-500 transition-colors">{mode.name}</h3>
									<p className="text-red-400 font-mono text-xs tracking-wider mb-6 border-b border-dashed border-red-500/20 pb-4 inline-block transform skew-x-12">{mode.tagline}</p>
									
                                    <p className="text-gray-400 mb-8 font-mono text-sm leading-relaxed border-l border-red-500/20 pl-4">{mode.description}</p>

									{/* Features */}
									<div className="space-y-3 mb-8 mt-auto">
										{mode.features.map((f, fi) => (
											<div key={fi} className="flex items-center gap-3">
                                                <div className="w-1 h-1 bg-red-500"></div>
												<span className="text-gray-300 font-mono text-xs uppercase text-opacity-80">[{f}]</span>
											</div>
										))}
									</div>

									{/* Player Count */}
									<div className="pt-6 border-t border-red-500/20">
										<span className="text-2xl font-black text-white block">{mode.playerCount}</span>
										<span className="text-[10px] text-gray-500 uppercase tracking-widest">Active Players</span>
									</div>
								</div>
							</div>
						))}
					</div>
				</div>
			</section>

			{/* WHY US */}
			<section className="py-32 relative bg-[var(--surface-900)] overflow-hidden">
                {/* Decorative Elements */}
                <div className="absolute top-0 right-0 p-4 opacity-20">
                    <Icons.Globe className="w-96 h-96 text-red-500 animate-spin-slow" style={{ animationDuration: '60s' }} />
                </div>

				<div className="container relative z-10">
					<div className="grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
						<div>
							<div className="mb-8">
                                <span className="text-red-500 font-mono text-xs border border-red-500 px-2 py-1 mb-4 inline-block">KENAPA TRINITY?</span>
                                <h2 className="text-4xl md:text-5xl font-black uppercase text-white leading-tight glitch-effect">
                                    BUKAN SERVER<br /><span className="text-transparent bg-clip-text bg-gradient-to-r from-red-500 to-red-800">BIASA</span>
                                </h2>
                            </div>
							
                            <p className="text-xl text-gray-400 mb-12 font-mono border-l-4 border-red-600 pl-6">
                                Dibangun dengan teknologi terdepan dan passion untuk memberikan pengalaman Minecraft terbaik di Indonesia.
                            </p>

							<div className="grid grid-cols-1 sm:grid-cols-2 gap-px bg-red-900/30 border border-red-900/30">
								{features.map((f, i) => (
									<div key={i} className="group p-6 bg-[var(--surface-900)] hover:bg-red-900/5 transition-colors">
										<div className="text-red-500 mb-4 opacity-50 group-hover:opacity-100">
											<Icons.Cpu className="h-6 w-6" />
										</div>
										<h4 className="font-bold text-white mb-2 text-sm uppercase tracking-wider">{f.title}</h4>
										<p className="text-xs text-gray-500 font-mono">{f.desc}</p>
									</div>
								))}
							</div>
						</div>

						{/* Testimonials */}
						<div className="relative">
							<div className="space-y-6">
								{[
									{ name: 'ProGamer_ID', msg: 'Gue udah main di OneBlock hampir 6 bulan dan masih ketagihan! Komunitasnya ramah banget.', mode: 'OneBlock', id: 'SUBJ-892' },
									{ name: 'CraftMaster99', msg: 'BoxSMP Trinity beda sama server lain. Event mingguan seru, ekonominya seimbang.', mode: 'BoxSMP', id: 'SUBJ-112' },
									{ name: 'AnarchyKing', msg: 'Kalau mau anarchy mode yang legit, ini tempatnya. Server stabil padahal player banyak.', mode: 'Anarchy', id: 'SUBJ-445' }
								].map((t, i) => (
									<div key={i} className="cia-box p-6 border-l-4 border-l-red-500 group">
                                         <div className="flex justify-between items-start mb-4">
                                            <div className="flex items-center gap-3">
                                                <div className="w-10 h-10 bg-gray-800 grayscale group-hover:grayscale-0 transition-all">
                                                    <img src={`https://mc-heads.net/avatar/${t.name}/40`} className="w-full h-full object-cover p-0.5 border border-white/20" alt="" />
                                                </div>
                                                <div>
                                                    <p className="font-bold text-white text-xs uppercase tracking-wider">{t.name}</p>
                                                    <p className="text-[10px] text-red-500 font-mono">{t.id} // {t.mode}</p>
                                                </div>
                                            </div>
                                            <Icons.Quote className="text-gray-700 h-6 w-6" />
                                        </div>
										<p className="text-gray-400 text-sm font-mono italic">"{t.msg}"</p>
									</div>
								))}
							</div>
						</div>
					</div>
				</div>
			</section>

			{/* HOW TO JOIN */}
			<section className="py-32 relative bg-black border-t border-red-900/30" id="join">
                <div className="absolute inset-0 bg-[linear-gradient(rgba(20,0,0,0.5)_1px,transparent_1px),linear-gradient(90deg,rgba(20,0,0,0.5)_1px,transparent_1px)] bg-[size:20px_20px]"></div>
				<div className="container relative z-10">
					<div className="text-center mb-16">
						<span className="text-red-500 font-mono text-sm tracking-[0.5em] mb-4 block animate-pulse">CARA BERGABUNG</span>
						<h2 className="text-4xl md:text-5xl font-black uppercase text-white mb-6">3 LANGKAH MUDAH</h2>
					</div>

					<div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
						{frames.map((frame, i) => (
							<div key={i} className="group relative cia-box p-8 bg-black">
                                <div className="absolute top-4 right-4 text-gray-800 text-4xl font-black opacity-30 select-none group-hover:text-red-900 group-hover:opacity-50 transition-colors">
                                    0{i + 1}
                                </div>
                                <div className="mb-6 font-mono text-xs text-red-500 border border-red-500/30 inline-block px-2 py-1">
                                    {frame.code}
                                </div>
								<h3 className="text-xl font-bold text-white mb-3 uppercase">{frame.title}</h3>
                                <div className="h-px w-10 bg-red-500 mb-4 group-hover:w-full transition-all duration-500"></div>
								<p className="text-gray-400 font-mono text-sm">{frame.paragraphs[0]}</p>
							</div>
						))}
					</div>

					<div className="text-center mt-16">
						<button onClick={copyIp} className="cia-btn-primary px-12 py-4 text-xl">
                            <span className="flex items-center gap-3">
                                <Icons.Terminal className="h-6 w-6" />
							    COPY IP: {config.serverIpAddress}
                            </span>
						</button>
					</div>
				</div>
			</section>

			{/* FINAL CTA */}
			<section className="py-32 relative overflow-hidden bg-red-950">
                <div className="absolute inset-0 bg-black opacity-90"></div>
				<div className="absolute inset-0 scanlines opacity-30"></div>

				<div className="container relative z-10">
					<div className="max-w-4xl mx-auto text-center border-y border-red-500/30 py-20">
						<h2 className="text-5xl md:text-7xl font-black uppercase text-white mb-8 tracking-tight">
							READY TO <br /><span className="text-red-500">DOMINATE?</span>
						</h2>
						<p className="text-xl text-gray-400 mb-12 font-mono max-w-2xl mx-auto">
                            Gabung dengan 10,000+ player yang sudah mempercayai Trinity Indonesia.
                        </p>

						<div className="flex flex-col sm:flex-row gap-6 justify-center">
							<button onClick={copyIp} className="cia-btn px-14 py-6 text-xl bg-red-600 !text-white hover:bg-red-700 border-none">
								<div className="flex items-center gap-4">
                                    <Icons.Globe className="h-6 w-6 animate-spin-slow" />
								    {config.serverIpAddress}
                                </div>
							</button>
						</div>
					</div>
				</div>
			</section>

			{/* Back to Top Button */}
			<button
				onClick={scrollToTop}
				className={`fixed bottom-8 right-8 z-50 w-12 h-12 bg-red-600 text-white border border-red-400 shadow-[0_0_15px_rgba(239,68,68,0.5)] flex items-center justify-center transition-all duration-300 hover:bg-red-700 ${showBackToTop ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10 pointer-events-none'}`}
				aria-label="Scroll to top"
			>
				<Icons.ArrowUp className="h-6 w-6" />
			</button>
		</Wrapper>
	)
}

// Stat card component
function StatCard({ value, suffix, label }) {
	const { count, ref } = useCountUp(value, 2000);
	return (
		<div ref={ref} className="bg-black/50 border border-gray-800 p-6 relative group hover:border-red-500/50 transition-colors">
            {/* Corner marks */}
            <div className="absolute top-0 left-0 w-2 h-2 border-t border-l border-gray-600 Group-hover:border-red-500"></div>
            <div className="absolute bottom-0 right-0 w-2 h-2 border-b border-r border-gray-600 Group-hover:border-red-500"></div>
            
			<div className="text-3xl md:text-4xl font-black text-white mb-2 tabular-nums font-mono text-center">
				{typeof value === 'number' && value < 100 ? count : count.toLocaleString()}{suffix}
			</div>
			<div className="text-[10px] text-gray-500 text-center uppercase tracking-widest group-hover:text-red-400 transition-colors">{label}</div>
		</div>
	);
}
