import { Wrapper } from '@layer/components/layout/Wrapper.jsx'
import { Icons } from '@layer/components/elements/Icons.jsx'
import config from '@layer/theme.config'
import { useRef, useState, useEffect } from 'react'

const features = [
	{ icon: Icons.Clock, title: 'AFK Rewards', description: 'Dapatkan Premium Points & AFK Crate Keys lewat AFK House' },
	{ icon: Icons.Lightning, title: 'RPG Skills', description: 'Buka berbagai Skills lewat AuraSkills dan tingkatkan gameplay kamu' },
	{ icon: Icons.Map, title: 'Player Warps', description: 'Buat warp kamu sendiri dan biarkan pemain lain teleport ke sana' },
	{ icon: Icons.Sword, title: 'Custom Death Messages', description: 'Death messages vanilla diganti dengan gradient death messages keren' },
	{ icon: Icons.Gem, title: 'Pointshop', description: 'Donasi ke server dan dapatkan Premium Ranks serta berbagai Cosmetics' },
	{ icon: Icons.Sparkles, title: 'Cosmetics', description: 'Akses semua cosmetics yang sudah dibeli via GUI yang bersih' },
	{ icon: Icons.Trophy, title: 'Player Leveling', description: 'Naik level dan dapatkan rewards karena aktif bermain di server' },
	{ icon: Icons.Book, title: 'Server Guide', description: 'Buka SMP Menu via /menu, /tutorial atau /help untuk info server' },
	{ icon: Icons.Chat, title: 'Chat Games', description: 'Ikuti Chat Games dan dapatkan Premium Points untuk menyelesaikannya' },
	{ icon: Icons.Star, title: 'Night Market', description: 'Beli item rare dengan harga acak yang berganti setiap hari' },
	{ icon: Icons.Coins, title: 'Server Shop', description: 'Beli item atau material yang kamu butuhkan di /shop' },
	{ icon: Icons.Cube, title: 'Clean Holograms', description: 'Hologram & NPC modern dan bersih dengan FancyHolograms' },
	{ icon: Icons.Speakerphone, title: 'Chat Announcements', description: 'Pengumuman chat: info server, Discord, promosi, dan lainnya' },
	{ icon: Icons.Lock, title: 'LuckPerms', description: 'Semua permission untuk semua rank sudah diset via LuckPerms' },
	{ icon: Icons.Backpack, title: 'Backpack & Enderchest', description: 'Akses 1 baris Enderchest dan /bp, bisa upgrade via /pointshop' },
	{ icon: Icons.Key, title: 'Keyall', description: 'Setiap 60 menit semua pemain online mendapat Common Crate Key' },
	{ icon: Icons.Wand, title: 'Sellwands', description: 'Bisa didapat dari berbagai Crates untuk menjual item ke Server Shop' },
	{ icon: Icons.Cash, title: 'Player Jobs', description: 'Dapatkan uang lewat Mining, Woodcutting, Farming, Hunting & Fishing' },
	{ icon: Icons.Fish, title: 'Custom Fishing', description: 'Tangkap ikan custom dan jual dengan harga lebih tinggi' },
	{ icon: Icons.Fire, title: 'Custom Enchants', description: '70+ custom enchants dari Villager Trades, Random Loot & Mob Drops' },
	{ icon: Icons.UserGroup, title: 'InteractiveChat', description: 'Pamer Inventory dan Items via [inv], [item], [ec] dan ping pemain' },
	{ icon: Icons.Globe, title: 'Custom World', description: 'Dunia raksasa dan epik dihasilkan oleh TerraformGenerator' },
	{ icon: Icons.Flag, title: 'Orders', description: 'Sistem terkenal dari DonutSMP, sekarang tersedia di server ini' },
	{ icon: Icons.Heart, title: 'Global Quests', description: 'Kerjakan quest komunitas bersama, top 3 pemain dapatkan rewards' },
]

const faqData = [
	{
		question: 'Apa IP Server Trinity Indonesia?',
		answer: 'IP Server kami adalah trinityindonesia.cc (Java) dan Port 19132 (Bedrock).'
	},
	{
		question: 'Apakah server ini bisa dimainkan di HP (Bedrock/MCPE)?',
		answer: 'Tentu saja! Server kami mendukung cross-play. Kamu bisa bermain menggunakan Minecraft Java (PC) maupun Bedrock Edition (HP, Xbox, PlayStation).'
	},
	{
		question: 'Versi Minecraft berapa yang didukung?',
		answer: 'Semua versi Minecraft bisa bergabung ke server kami. Namun, kami sangat merekomendasikan menggunakan versi 1.21.11 untuk pengalaman bermain terbaik.'
	},
	{
		question: 'Apa itu Anarchy RPG?',
		answer: 'Di server ini, Griefing, Raiding, Stealing, dan PvP sepenuhnya legal (Anarchy). Tidak ada claim land! Namun, gameplay diperkaya dengan elemen RPG seperti Skills, Leveling, Custom Enchants, dan Custom Items yang imbang.'
	},
	{
		question: 'Bagaimana cara mendapatkan uang di server?',
		answer: 'Kamu bisa mendapatkan uang melalui Player Jobs (Mining, Farming, Fishing, dll), menjual item hasil farming atau memancing ke Server Shop via /shop, atau dengan mengikuti event dan Chat Games.'
	}
]

function FaqAccordion({ question, answer }) {
	const [isOpen, setIsOpen] = useState(false);

	return (
		<div className={`mc-accordion ${isOpen ? 'open' : ''} mb-4`}>
			<button
				onClick={() => setIsOpen(!isOpen)}
				className="w-full p-5 flex items-center gap-4 text-left"
			>
				<div className="flex-shrink-0 w-10 h-10 rounded-xl flex items-center justify-center transition-all duration-300"
					style={{ background: isOpen ? 'var(--brand-secondary)' : 'rgba(255,255,255,0.05)', color: isOpen ? '#fff' : 'var(--text-muted)' }}
				>
					<Icons.Sparkles className="h-5 w-5" />
				</div>
				<div className="flex-1">
					<h3 className="font-bold text-base" style={{ color: isOpen ? 'var(--brand-secondary)' : 'var(--text-primary)' }}>
						{question}
					</h3>
				</div>
				<div className={`flex-shrink-0 transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`}>
					<Icons.ChevronDown className="h-5 w-5" style={{ color: isOpen ? 'var(--brand-secondary)' : 'var(--text-muted)' }} />
				</div>
			</button>

			<div className={`grid transition-all duration-300 ease-in-out ${isOpen ? 'grid-rows-[1fr] opacity-100' : 'grid-rows-[0fr] opacity-0'}`}>
				<div className="overflow-hidden">
					<div className="px-5 pb-5 pt-0">
						<div className="ml-14 text-sm leading-relaxed" style={{ color: 'var(--text-secondary)' }}>
							{answer}
						</div>
					</div>
				</div>
			</div>
		</div>
	);
}

export default function Home() {
	const carouselRef = useRef(null)
	const [isVideoPlaying, setIsVideoPlaying] = useState(false)

	const scrollCarousel = (direction) => {
		if (carouselRef.current) {
			const scrollAmount = 300
			carouselRef.current.scrollBy({
				left: direction === 'left' ? -scrollAmount : scrollAmount,
				behavior: 'smooth'
			})
		}
	}

	return (
		<Wrapper
			title="Home"
			description="Trinity Indonesia - Server Minecraft Indonesia paling seru! Gabung sekarang dan eksplorasi dunia AnarchyRPG bersama teman-teman!"
			path="/"
		>
			{/* Hero Section with Floating Islands */}
			<div className="hero-section relative rounded-3xl overflow-hidden mb-12 p-8 md:p-12 lg:p-16 flex items-center min-h-[500px]"
				style={{
					backgroundImage: 'url(/vendor/floatingisland1.webp)',
					backgroundSize: 'contain',
					backgroundPosition: 'right center',
					backgroundRepeat: 'no-repeat',
					backgroundColor: 'var(--bg-secondary)', // Fallback background color
				}}
			>
				{/* Gradient Overlay for blending */}
				<div className="absolute inset-0 bg-gradient-to-r from-[var(--bg-secondary)] via-[var(--bg-secondary)]/80 to-transparent"></div>

				{/* Welcome Card */}
				<div className="mc-content-card relative z-10 max-w-2xl bg-transparent border-none shadow-none p-0 pr-8">
					<h2 className="text-3xl md:text-4xl font-extrabold mb-4" style={{ color: 'var(--text-primary)' }}>
						Selamat Datang di Trinity Indonesia
					</h2>
					<p className="mb-8 text-base md:text-lg leading-relaxed" style={{ color: 'var(--text-secondary)' }}>
						Server Minecraft Indonesia dengan konsep Anarchy yang difusikan dengan elemen RPG — dilengkapi RPG Skills, Custom Enchants, Custom Fishing, dan masih banyak lagi. Ajak semua temanmu untuk bermain, baik di PC, Mobile, Xbox, maupun PlayStation!
					</p>
					<div className="flex flex-wrap gap-4">
						<a href="/connect" className="mc-btn mc-btn-primary px-6 py-3 text-lg">
							<Icons.ArrowRight className="w-5 h-5" />
							Cara Bergabung
						</a>
						<a href="https://discord.trinityindonesia.cc" target="_blank" rel="noopener noreferrer" className="mc-btn mc-btn-outline px-6 py-3 text-lg bg-[var(--bg-primary)]/50 backdrop-blur-sm border-white/20 hover:bg-white/10 hover:border-white/40">
							<Icons.Chat className="w-5 h-5" />
							Gabung Discord
						</a>
					</div>
				</div>
			</div>


			{/* Features Section */}
			<div className="mt-12 mb-12">
				{/* Header */}
				<div className="mb-6 text-center">
					<h3 className="text-2xl font-extrabold" style={{ color: 'var(--text-primary)' }}>
						Fitur Server Kami
					</h3>
					<p className="text-sm opacity-70" style={{ color: 'var(--text-secondary)' }}>
						Geser atau arahkan kursor untuk menjeda dan melihat detail fitur
					</p>
				</div>

				{/* Infinite Marquee Carousel */}
				<div className="marquee-container">
					<div className="marquee-content">
						{/* Double the array for seamless loop */}
						{[...features, ...features].map((feature, i) => (
							<div key={i} className="feature-card-loop">
								<div className="flex items-start gap-4">
									<div className="w-12 h-12 rounded-2xl flex items-center justify-center flex-shrink-0" style={{ background: 'rgba(226, 110, 16, 0.1)' }}>
										<feature.icon className="w-6 h-6" style={{ color: 'var(--brand-secondary)' }} />
									</div>
									<div>
										<h4 className="font-extrabold text-base mb-1" style={{ color: 'var(--text-primary)' }}>
											{feature.title}
										</h4>
										<p className="text-xs leading-relaxed opacity-80" style={{ color: 'var(--text-muted)' }}>
											{feature.description}
										</p>
									</div>
								</div>
							</div>
						))}
					</div>
				</div>
			</div>

			{/* Second Hero Section - Media/Trailer */}
			<div className="hero-section relative rounded-3xl overflow-hidden mt-24 mb-24 p-8 md:p-12 flex items-center lg:justify-end min-h-[400px]"
				style={{
					backgroundImage: 'url(/vendor/floatingisland2.webp)',
					backgroundSize: 'contain',
					backgroundPosition: '5% center', // Geser gambar pulau lebih ke kanan agar tidak terpotong
					backgroundRepeat: 'no-repeat',
					backgroundColor: 'var(--bg-secondary)',
				}}
			>
				{/* Gradient Overlay from left to right */}
				<div className="absolute inset-0 bg-gradient-to-l from-[var(--bg-secondary)] via-[var(--bg-secondary)]/80 to-[var(--bg-secondary)]/20"></div>

				{/* Video Embed */}
				<div
					className="relative z-10 w-full lg:w-[60%] max-w-2xl rounded-sm overflow-hidden shadow-2xl border-2 border-white/10 bg-black mx-auto aspect-video cursor-pointer group"
					onClick={() => setIsVideoPlaying(true)}
				>
					{isVideoPlaying ? (
						<iframe
							src="https://player.vimeo.com/video/1167078620?badge=0&autopause=0&player_id=0&app_id=58479&autoplay=1"
							frameBorder="0"
							allow="autoplay; fullscreen; picture-in-picture; clipboard-write; encrypted-media; web-share"
							referrerPolicy="strict-origin-when-cross-origin"
							className="absolute top-0 left-0 w-full h-full"
							title="HeroVideo"
						></iframe>
					) : (
						<>
							{/* Background Thumbnail */}
							<img src="/vendor/thumbnail.webp" alt="Video Thumbnail" className="absolute inset-0 w-full h-full object-cover" />

							{/* Play Button Overlay */}
							<div className="absolute inset-0 flex items-center justify-center bg-black/30 group-hover:bg-black/50 transition-colors duration-300">
								<div className="w-16 h-16 md:w-20 md:h-20 rounded-full border-2 border-white/80 flex items-center justify-center bg-black/40 backdrop-blur-sm group-hover:scale-110 transition-transform duration-300">
									<svg className="w-8 h-8 md:w-10 md:h-10 text-white ml-2" fill="currentColor" viewBox="0 0 24 24">
										<path d="M8 5v14l11-7z" />
									</svg>
								</div>
							</div>

							{/* Watch Trailer Bar (Absolute Bottom) */}
							<div className="absolute bottom-0 left-0 w-full bg-black/80 backdrop-blur-md py-3 md:py-4 flex items-center justify-center gap-3 border-t border-white/10 group-hover:bg-[#111]/90 transition-colors duration-300">
								<svg className="w-3 h-3 md:w-4 md:h-4 text-white" fill="currentColor" viewBox="0 0 24 24">
									<path d="M8 5v14l11-7z" />
								</svg>
								<span className="text-white font-black tracking-[0.2em] text-[10px] md:text-sm uppercase">Watch Trailer</span>
							</div>
						</>
					)}
				</div>
			</div>

			{/* FAQ Section */}
			<div className="mb-12 mt-24">
				<div className="text-center mb-10">
					<h2 className="text-3xl font-extrabold mb-4" style={{ color: 'var(--text-primary)' }}>
						Pertanyaan yang Sering Diajukan
					</h2>
					<p className="text-base" style={{ color: 'var(--text-secondary)' }}>
						Punya pertanyaan tentang server? Temukan jawabannya di bawah ini.
					</p>
				</div>
				<div className="flex flex-col w-full">
					{faqData.map((faq, i) => (
						<FaqAccordion key={i} question={faq.question} answer={faq.answer} />
					))}
				</div>
			</div>

			{/* Bottom CTA Section */}
			<div className="mb-12 p-8 md:p-12 lg:p-16 flex flex-col items-center justify-center gap-6 mc-content-card text-center">
				<div className="flex flex-col items-center max-w-3xl">
					<h2 className="text-3xl md:text-5xl font-black mb-6 leading-tight" style={{ color: 'var(--text-primary)' }}>
						Siap Untuk Petualangan Baru?
					</h2>
					<p className="mb-8 text-base md:text-xl leading-relaxed" style={{ color: 'var(--text-secondary)' }}>
						Bergabunglah dengan ribuan pemain lainnya di Trinity Indonesia. Dapatkan pengalaman bermain Minecraft Anarchy RPG terbaik yang belum pernah kamu rasakan sebelumnya.
					</p>
					<div className="flex flex-col sm:flex-row items-center justify-center gap-4">
						<a href="/connect" className="mc-btn mc-btn-primary px-8 py-4 text-xl shadow-xl hover:scale-105 transition-transform">
							<Icons.Server className="w-6 h-6" />
							Mulai Bermain Kalian
						</a>
						<a href="https://discord.trinityindonesia.cc" target="_blank" rel="noopener noreferrer" className="mc-btn mc-btn-outline px-8 py-4 text-xl">
							<Icons.Discord className="w-6 h-6" />
							Komunitas Discord
						</a>
					</div>
				</div>
			</div>
		</Wrapper>
	)
}
