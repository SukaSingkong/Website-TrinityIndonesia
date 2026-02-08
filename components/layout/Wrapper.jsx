import { Icons } from '@layer/components/elements/Icons.jsx'
import config from '@layer/theme.config'
import { Popover, Transition } from '@headlessui/react'
import { Fragment, useState, useEffect } from 'react'
import Link from 'next/link'
import Head from "next/head"

const SERVER_IP = 'trinityindonesia.cc'

const solutions = [
    {
        name: 'Beranda',
        description: 'Halaman Utama',
        href: '/',
        icon: Icons.Home,
    },
    {
        name: 'Tim Staf',
        description: 'Daftar Staff',
        href: '/staff',
        icon: Icons.Users,
    },
    {
        name: 'Aturan Server',
        description: 'Peraturan',
        href: '/rules',
        icon: Icons.Flag,
    },
    {
        name: 'Store',
        description: 'Toko Gems',
        href: '/store',
        icon: Icons.Gem,
    },
    {
        name: 'Kritik & Saran',
        description: 'Masukan',
        href: '/suggestion',
        icon: Icons.Speakerphone,
    },
    {
        name: 'Bug Report',
        description: 'Lapor Bug',
        href: '/bugreport',
        icon: Icons.Exclamation,
    },
    {
        name: 'Report Player',
        description: 'Lapor Pemain',
        href: '/report',
        icon: Icons.Flag,
    },
]

export function Wrapper({ children, seo }) {
    const metaTitle = `${seo?.title ? `${seo.title} | ` : ''}${config.metaSiteName}`
    const brandName = config.metaSiteName || 'Trinity Indonesia'
    const [brandPrimary, ...brandRest] = brandName.split(' ')
    const brandAccent = brandRest.join(' ')

    const [scrolled, setScrolled] = useState(false)

    useEffect(() => {
        const handleScroll = () => {
            setScrolled(window.scrollY > 20)
        }
        window.addEventListener('scroll', handleScroll)
        return () => window.removeEventListener('scroll', handleScroll)
    }, [])

    return (
        <>
            <Head>
                <title>{metaTitle}</title>
                <meta name="title" content={metaTitle} />
                <meta name="description" content={seo?.description || config.metaSiteDescription} />
                
                {/* SEO Enhancements */}
                <meta name="keywords" content="minecraft server indonesia, server minecraft, trinity indonesia, minecraft java, minecraft bedrock, oneblock minecraft, boxsmp, anarchy server, minecraft survival" />
                <meta name="author" content="Trinity Indonesia" />
                <meta name="robots" content="index, follow" />
                <meta name="googlebot" content="index, follow" />
                <meta httpEquiv="Content-Language" content="id" />
                <meta name="language" content="Indonesian" />
                <meta name="revisit-after" content="7 days" />
                <meta name="geo.region" content="ID" />
                <meta name="geo.placename" content="Indonesia" />
                
                {/* Canonical URL */}
                <link rel="canonical" href={`${config.metaSiteUrl}${seo?.path || ''}`} />
                
                {/* Theme & Mobile */}
                <meta name="theme-color" content="#dc2626" />
                <meta name="msapplication-TileColor" content="#dc2626" />
                <meta name="apple-mobile-web-app-capable" content="yes" />
                <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
                
                {/* Open Graph / Facebook */}
                <meta property="og:type" content={seo?.type || "website"} />
                <meta property="og:url" content={`${config.metaSiteUrl}${seo?.path || ''}`} />
                <meta property="og:title" content={metaTitle} />
                <meta property="og:description" content={seo?.description || config.metaSiteDescription} />
                <meta property="og:image" content={seo?.image || config.metaImage} />
                <meta property="og:image:width" content="1200" />
                <meta property="og:image:height" content="630" />
                <meta property="og:site_name" content={config.metaSiteName} />
                <meta property="og:locale" content="id_ID" />
                
                {/* Twitter */}
                <meta property="twitter:card" content="summary_large_image" />
                <meta property="twitter:url" content={`${config.metaSiteUrl}${seo?.path || ''}`} />
                <meta property="twitter:title" content={metaTitle} />
                <meta property="twitter:description" content={seo?.description || config.metaSiteDescription} />
                <meta property="twitter:image" content={seo?.image || config.metaImage} />
                
                {/* Structured Data - Organization */}
                <script
                    type="application/ld+json"
                    dangerouslySetInnerHTML={{
                        __html: JSON.stringify({
                            "@context": "https://schema.org",
                            "@type": "Organization",
                            "name": "Trinity Indonesia",
                            "url": config.metaSiteUrl,
                            "logo": `${config.metaSiteUrl}/vendor/logo.webp`,
                            "description": config.metaSiteDescription,
                            "foundingDate": "2021",
                            "areaServed": "Indonesia",
                            "sameAs": []
                        })
                    }}
                />
                
                {/* Structured Data - WebSite */}
                <script
                    type="application/ld+json"
                    dangerouslySetInnerHTML={{
                        __html: JSON.stringify({
                            "@context": "https://schema.org",
                            "@type": "WebSite",
                            "name": config.metaSiteName,
                            "url": config.metaSiteUrl,
                            "description": config.metaSiteDescription,
                            "inLanguage": "id-ID"
                        })
                    }}
                />
                
                {/* Structured Data - Game Server */}
                <script
                    type="application/ld+json"
                    dangerouslySetInnerHTML={{
                        __html: JSON.stringify({
                            "@context": "https://schema.org",
                            "@type": "VideoGame",
                            "name": "Trinity Indonesia Minecraft Server",
                            "description": config.metaSiteDescription,
                            "genre": ["Survival", "Anarchy", "Economy", "Multiplayer"],
                            "gamePlatform": ["Java Edition", "Bedrock Edition"],
                            "applicationCategory": "Game",
                            "operatingSystem": "Windows, macOS, Linux, Android, iOS",
                            "offers": {
                                "@type": "Offer",
                                "price": "0",
                                "priceCurrency": "IDR",
                                "availability": "https://schema.org/InStock"
                            }
                        })
                    }}
                />
            </Head>
            <div className="min-h-screen relative" style={{ background: 'var(--surface-900)' }}>
                {/* Sticky Navbar */}
                {/* Sticky Navbar */}
                <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ease-out ${scrolled ? 'bg-black py-2 border-b border-white/10' : 'bg-gradient-to-b from-black/90 to-transparent py-6'}`}>
                    <div className="container">
                        <div className="flex gap-12 items-center justify-between">
                            <Link href="/">
                                <div className="flex items-center gap-4 cursor-pointer group">
                                    <div className="relative p-1 border border-white/10 bg-black/50 rounded-sm group-hover:border-red-500/50 transition-colors">
                                        <div className="absolute inset-0 bg-red-500 blur-md opacity-0 group-hover:opacity-20 transition-opacity"></div>
                                        <img src="/vendor/logo.webp" alt="Trinity Indonesia" className="h-10 w-10 relative z-10" />
                                    </div>
                                    <div className="flex flex-col">
                                        <div className="text-lg font-black uppercase font-mono tracking-tighter leading-none">
                                            <span className="text-white group-hover:text-red-500 transition-colors">{brandPrimary}</span>
                                            {brandAccent && <span className="text-red-600"> {brandAccent}</span>}
                                        </div>
                                        <span className="text-[10px] font-mono text-gray-500 tracking-[0.2em] group-hover:text-red-400 transition-colors">MINECRAFT SERVER</span>
                                    </div>
                                </div>
                            </Link>
                            <div className="hidden md:flex items-center gap-1 font-mono text-xs font-bold tracking-wider" data-apply="navbar">
                                <Link href="/" className="nav-link group relative px-4 py-2 text-gray-400 uppercase overflow-hidden">
                                    <span className="relative z-10 group-hover:text-red-500 transition-colors duration-300">[ BERANDA ]</span>
                                    <span className="absolute bottom-0 left-0 w-full h-0.5 bg-gradient-to-r from-transparent via-red-500 to-transparent scale-x-0 group-hover:scale-x-100 transition-transform duration-300"></span>
                                    <span className="absolute inset-0 bg-red-500/5 scale-y-0 group-hover:scale-y-100 origin-bottom transition-transform duration-200"></span>
                                </Link>
                                <Link href="/staff" className="nav-link group relative px-4 py-2 text-gray-400 uppercase overflow-hidden">
                                    <span className="relative z-10 group-hover:text-red-500 transition-colors duration-300">[ STAF ]</span>
                                    <span className="absolute bottom-0 left-0 w-full h-0.5 bg-gradient-to-r from-transparent via-red-500 to-transparent scale-x-0 group-hover:scale-x-100 transition-transform duration-300"></span>
                                    <span className="absolute inset-0 bg-red-500/5 scale-y-0 group-hover:scale-y-100 origin-bottom transition-transform duration-200"></span>
                                </Link>
                                <Link href="/rules" className="nav-link group relative px-4 py-2 text-gray-400 uppercase overflow-hidden">
                                    <span className="relative z-10 group-hover:text-red-500 transition-colors duration-300">[ ATURAN ]</span>
                                    <span className="absolute bottom-0 left-0 w-full h-0.5 bg-gradient-to-r from-transparent via-red-500 to-transparent scale-x-0 group-hover:scale-x-100 transition-transform duration-300"></span>
                                    <span className="absolute inset-0 bg-red-500/5 scale-y-0 group-hover:scale-y-100 origin-bottom transition-transform duration-200"></span>
                                </Link>
                                <Link href="/bugreport" className="nav-link group relative px-4 py-2 text-gray-400 uppercase overflow-hidden">
                                    <span className="relative z-10 group-hover:text-red-500 transition-colors duration-300">[ BUG ]</span>
                                    <span className="absolute bottom-0 left-0 w-full h-0.5 bg-gradient-to-r from-transparent via-red-500 to-transparent scale-x-0 group-hover:scale-x-100 transition-transform duration-300"></span>
                                    <span className="absolute inset-0 bg-red-500/5 scale-y-0 group-hover:scale-y-100 origin-bottom transition-transform duration-200"></span>
                                </Link>
                                <Link href="/report" className="nav-link group relative px-4 py-2 text-gray-400 uppercase overflow-hidden">
                                    <span className="relative z-10 group-hover:text-red-500 transition-colors duration-300">[ REPORT ]</span>
                                    <span className="absolute bottom-0 left-0 w-full h-0.5 bg-gradient-to-r from-transparent via-red-500 to-transparent scale-x-0 group-hover:scale-x-100 transition-transform duration-300"></span>
                                    <span className="absolute inset-0 bg-red-500/5 scale-y-0 group-hover:scale-y-100 origin-bottom transition-transform duration-200"></span>
                                </Link>
                                <div className="w-px h-6 bg-white/10 mx-2"></div>
                                <Link href="/store" className="group relative bg-red-600 hover:bg-red-500 text-white px-5 py-2 border border-red-500 hover:border-red-400 shadow-[0_0_10px_rgba(220,38,38,0.3)] hover:shadow-[0_0_20px_rgba(220,38,38,0.5)] transition-all duration-300 flex items-center gap-2 overflow-hidden">
                                    <span className="absolute inset-0 bg-gradient-to-r from-red-600 via-red-400 to-red-600 opacity-0 group-hover:opacity-100 transition-opacity duration-500 animate-shimmer bg-[length:200%_100%]"></span>
                                    <Icons.Gem className="h-3 w-3 relative z-10 group-hover:rotate-12 transition-transform duration-300" />
                                    <span className="relative z-10">STORE</span>
                                </Link>
                            </div>
                            <div className="flex md:hidden items-center">
                                <Popover className="relative">
                                    {({ open }) => (
                                        <>
                                            <Popover.Button className="p-2 border border-red-500/50 bg-black text-red-500 hover:bg-red-500 hover:text-white transition-all">
                                                {open ? <Icons.X className="h-6 w-6" /> : <Icons.Menu className="h-6 w-6" />}
                                            </Popover.Button>
                                            <Transition as={Fragment} enter="transition ease-out duration-300" enterFrom="opacity-0 translate-y-4" enterTo="opacity-100 translate-y-0" leave="transition ease-in duration-200" leaveFrom="opacity-100 translate-y-0" leaveTo="opacity-0 translate-y-4">
                                                <Popover.Panel className="absolute right-0 z-10 mt-4 w-screen max-w-sm -mr-4 px-4">
                                                    <div className="cia-box shadow-2xl bg-black">
                                                        <div className="relative grid gap-1 p-2">
                                                            {solutions.map((item) => (
                                                                <Link key={item.name} href={item.href}>
                                                                    <div className="flex items-center p-4 transition-all duration-300 hover:bg-red-900/20 cursor-pointer group border-b border-white/5 last:border-0">
                                                                        <div className="flex h-10 w-10 shrink-0 items-center justify-center bg-red-900/20 text-red-500 group-hover:bg-red-500 group-hover:text-white transition-all duration-300">
                                                                            <item.icon className="h-5 w-5" />
                                                                        </div>
                                                                        <div className="ml-4">
                                                                            <p className="text-sm font-bold text-white uppercase font-mono">{item.name}</p>
                                                                            <p className="text-[10px] text-gray-500 font-mono tracking-wider">{item.description}</p>
                                                                        </div>
                                                                    </div>
                                                                </Link>
                                                            ))}
                                                        </div>
                                                    </div>
                                                </Popover.Panel>
                                            </Transition>
                                        </>
                                    )}
                                </Popover>
                            </div>
                        </div>
                    </div>
                </nav>

                <div>{children}</div>

                {/* Footer */}
                <footer className="relative border-t border-red-900/30 bg-black">
                    <div className="container py-16">
                        {/* Main Footer Content */}
                        <div className="grid grid-cols-1 lg:grid-cols-4 gap-12 mb-12">
                            {/* Brand */}
                            <div className="lg:col-span-1">
                                <div className="flex items-center gap-3 mb-4">
                                    <div className="filter grayscale contrast-125">
                                        <img src="/vendor/logo.webp" alt="Trinity Indonesia" className="h-12 w-12" />
                                    </div>
                                    <h1 className="text-xl font-bold uppercase font-mono">
                                        <span className="text-white">{brandPrimary}</span>
                                        {brandAccent && <span className="text-red-600"> {brandAccent}</span>}
                                    </h1>
                                </div>
                                <p className="text-gray-500 text-xs font-mono leading-relaxed border-l border-red-900/50 pl-4">
                                    Server Minecraft Indonesia.<br/>
                                    Berdiri sejak 2021.<br/>
                                    Asal: Indonesia.
                                </p>
                            </div>

                            {/* Quick Links */}
                            <div className="lg:col-span-1">
                                <h3 className="text-red-500 font-bold uppercase text-xs tracking-widest mb-6 border-b border-red-900/30 pb-2 inline-block">NAVIGASI</h3>
                                <div className="flex flex-col gap-3 font-mono text-sm" data-apply="footer-links">
                                    <Link href="/" className="hover:pl-2 transition-all duration-300">{'>'} BERANDA</Link>
                                    <Link href="/staff" className="hover:pl-2 transition-all duration-300">{'>'} TIM STAF</Link>
                                    <Link href="/rules" className="hover:pl-2 transition-all duration-300">{'>'} ATURAN</Link>
                                    <Link href="/store" className="hover:pl-2 transition-all duration-300">{'>'} STORE</Link>
                                </div>
                            </div>

                            {/* Feedback */}
                            <div className="lg:col-span-1">
                                <h3 className="text-red-500 font-bold uppercase text-xs tracking-widest mb-6 border-b border-red-900/30 pb-2 inline-block">LAPORAN</h3>
                                <div className="flex flex-col gap-3 font-mono text-sm" data-apply="footer-links">
                                    <Link href="/suggestion" className="hover:pl-2 transition-all duration-300">{'>'} KRITIK & SARAN</Link>
                                    <Link href="/bugreport" className="hover:pl-2 transition-all duration-300">{'>'} LAPOR BUG</Link>
                                    <Link href="/report" className="hover:pl-2 transition-all duration-300">{'>'} LAPOR PEMAIN</Link>
                                </div>
                            </div>

                            {/* Join Server */}
                            <div className="lg:col-span-1">
                                <h3 className="text-red-500 font-bold uppercase text-xs tracking-widest mb-6 border-b border-red-900/30 pb-2 inline-block">GABUNG SERVER</h3>
                                <div className="flex flex-col gap-4">
                                    <button
                                        onClick={() => {
                                            navigator.clipboard?.writeText(SERVER_IP)
                                            // Show toast
                                            const toast = document.getElementById('footer-toast')
                                            if (toast) {
                                                toast.classList.remove('opacity-0', 'translate-y-2')
                                                toast.classList.add('opacity-100', 'translate-y-0')
                                                setTimeout(() => {
                                                    toast.classList.remove('opacity-100', 'translate-y-0')
                                                    toast.classList.add('opacity-0', 'translate-y-2')
                                                }, 2000)
                                            }
                                        }}
                                        className="cia-btn flex items-center justify-between !py-3 !px-4 hover:bg-red-900/20 group"
                                    >
                                        <div className="text-left">
                                            <p className="text-[10px] text-red-500 uppercase">SERVER ADDRESS</p>
                                            <p className="text-white text-sm">{SERVER_IP}</p>
                                        </div>
                                        <Icons.ClipboardCopy className="h-4 w-4 text-red-500 group-hover:scale-110 transition-transform" />
                                    </button>
                                    
                                    <div className="border border-white/10 p-4 bg-white/5">
                                        <p className="text-[10px] text-gray-500 uppercase mb-1">CLIENT COMPATIBILITY</p>
                                        <p className="text-white font-mono text-sm">JAVA & BEDROCK</p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Toast Notification */}
                        <div id="footer-toast" className="fixed bottom-6 right-6 z-50 px-6 py-4 bg-black border border-emerald-500 shadow-[0_0_20px_rgba(16,185,129,0.2)] opacity-0 translate-y-2 transition-all duration-300 pointer-events-none">
                            <div className="flex items-center gap-3">
                                <Icons.CheckCircle className="h-5 w-5 text-emerald-400" />
                                <p className="text-white font-mono text-xs uppercase tracking-wider">COPIED TO CLIPBOARD</p>
                            </div>
                        </div>

                        {/* Bottom Section */}
                        <div className="border-t border-white/5 pt-8 flex flex-col md:flex-row items-center justify-between gap-6">
                            <p className="text-xs text-gray-600 font-mono">
                                TRINITY INDONESIA // EST. 2021 // ALL RIGHTS RESERVED
                            </p>

                            {/* Powered by Syncara */}
                            <a
                                href="https://syncara.host"
                                target="_blank"
                                rel="noreferrer"
                                className="flex items-center gap-3 opacity-50 hover:opacity-100 transition-opacity"
                            >
                                <span className="text-gray-600 text-[10px] uppercase tracking-widest">INFRASTRUCTURE BY</span>
                                <span className="text-white font-bold font-mono text-xs">SYNCARA.HOST</span>
                            </a>
                        </div>
                    </div>
                </footer>
            </div>
        </>
    )
}
