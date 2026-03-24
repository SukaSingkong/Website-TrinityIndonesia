import { Icons } from '@layer/components/elements/Icons.jsx'
import config from '@layer/theme.config'
import { Popover, Transition } from '@headlessui/react'
import { Fragment } from 'react'
import Link from 'next/link'
import Head from "next/head"
import { useRouter } from 'next/router'

const navLinks = [
    { name: 'Home', href: '/' },
    { name: 'Connect', href: '/connect' },
    { name: 'Leaderboard', href: '/leaderboard' },
    { name: 'Vote', href: '/vote' },
    { name: 'Update', href: '/update' },
    { name: 'Punishments', href: '/punishments' },
    { name: 'Wiki', href: 'https://wiki.trinityindonesia.cc' },
    { name: 'Rules', href: '/rules' },
]

import { useEffect, useState } from 'react'

function SiteHeader() {
    const [players, setPlayers] = useState(null)
    const [discordOnline, setDiscordOnline] = useState(null)
    const [copied, setCopied] = useState(false)

    useEffect(() => {
        // Fetch Minecraft Players
        fetch('https://api.mcstatus.io/v2/status/java/trinityindonesia.cc')
            .then(res => res.json())
            .then(data => {
                if (data.online) {
                    setPlayers(data.players.online)
                }
            })
            .catch(() => console.error("Failed to fetch player count"))

        // Fetch Discord Online Members (Widget must be enabled in Server Settings)
        fetch('https://discord.com/api/guilds/1405416617046966314/widget.json')
            .then(res => res.json())
            .then(data => {
                if (data.presence_count !== undefined) {
                    setDiscordOnline(data.presence_count)
                }
            })
            .catch(() => console.error("Failed to fetch Discord members"))
    }, [])

    const handleCopyIp = () => {
        navigator.clipboard.writeText("trinityindonesia.cc")
        setCopied(true)
        setTimeout(() => setCopied(false), 2000)
    }

    return (
        <div className="mc-header pb-4 sm:pb-0 overflow-hidden">
            {/* Center row: badge - logo - badge */}
            <div className="relative z-10 flex items-center justify-center gap-4 sm:gap-12 lg:gap-[200px] pt-10 pb-4 sm:py-8 px-2 w-full max-w-[1200px] mx-auto min-h-[140px]">
                {/* Online Badge - left */}
                <div
                    onClick={handleCopyIp}
                    className="mc-badge mc-badge-online flex-shrink-0 flex items-center px-2 py-1.5 sm:px-6 sm:py-3 cursor-pointer hover:opacity-90 transition-opacity"
                    title="Klik untuk menyalin IP"
                >
                    <Icons.Cube className="w-3 h-3 sm:w-5 sm:h-5" />
                    <div className="text-left">
                        <div className="text-xs sm:text-sm font-extrabold leading-none">
                            {copied ? "IP COPIED!" : (players !== null ? `${players} ONLINE` : 'ONLINE')}
                        </div>
                        <div className="text-[10px] sm:text-xs opacity-80">Online Players</div>
                    </div>
                </div>

                {/* Logo */}
                <img
                    src="/vendor/logo.webp"
                    alt="Trinity Indonesia"
                    className="w-28 sm:w-52 md:w-60 drop-shadow-2xl flex-shrink-0"
                />

                {/* Discord Badge - right */}
                <a href="https://discord.trinityindonesia.cc" target="_blank" rel="noopener noreferrer" className="mc-badge mc-badge-discord flex-shrink-0 flex items-center px-2 py-1.5 sm:px-6 sm:py-3 hover:opacity-90 transition-opacity">
                    <Icons.Discord className="w-3 h-3 sm:w-5 sm:h-5" />
                    <div className="text-left">
                        <div className="text-xs sm:text-sm font-extrabold leading-none">
                            {discordOnline !== null ? `${discordOnline} ONLINE` : 'DISCORD'}
                        </div>
                        <div className="text-[10px] sm:text-xs opacity-80">Join Server</div>
                    </div>
                </a>
            </div>
        </div>
    )
}

// Navigation Bar — increased bottom margin to avoid collision
function Navbar() {
    const router = useRouter()

    return (
        <div className="container relative z-20 mt-4 mb-6">
            <div className="mc-navbar flex items-center justify-between">
                {/* Left: Nav Links */}
                <div className="hidden sm:flex items-center gap-1">
                    {navLinks.map((link) => (
                        <Link
                            key={link.name}
                            href={link.href}
                            className={`mc-nav-link ${router.pathname === link.href ? 'active' : ''}`}
                        >
                            {link.name}
                        </Link>
                    ))}
                </div>

                {/* Mobile Nav */}
                <div className="sm:hidden">
                    <Popover className="relative">
                        {({ open }) => (
                            <>
                                <Popover.Button className="mc-nav-link">
                                    {open ? (
                                        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
                                    ) : (
                                        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" /></svg>
                                    )}
                                    Menu
                                </Popover.Button>

                                <Transition
                                    as={Fragment}
                                    enter="transition ease-out duration-200"
                                    enterFrom="opacity-0 translate-y-2"
                                    enterTo="opacity-100 translate-y-0"
                                    leave="transition ease-in duration-150"
                                    leaveFrom="opacity-100 translate-y-0"
                                    leaveTo="opacity-0 translate-y-2"
                                >
                                    <Popover.Panel className="absolute left-0 top-12 w-56 p-2 mc-card shadow-xl z-50">
                                        <div className="space-y-1">
                                            {navLinks.map((link) => (
                                                <Link
                                                    key={link.name}
                                                    href={link.href}
                                                    className={`block mc-nav-link w-full ${router.pathname === link.href ? 'active' : ''}`}
                                                >
                                                    {link.name}
                                                </Link>
                                            ))}
                                        </div>
                                    </Popover.Panel>
                                </Transition>
                            </>
                        )}
                    </Popover>
                </div>

                {/* Right: Store Button — links to /store page */}
                {!config.hideWebstoreButton && (
                    <Link href="/store" className="mc-btn mc-btn-store">
                        <Icons.ShoppingBag className="w-4 h-4" />
                        STORE
                    </Link>
                )}
            </div>
        </div>
    )
}

// Footer
function Footer() {
    const scrollToTop = () => window.scrollTo({ top: 0, behavior: 'smooth' })

    return (
        <footer className="py-10" style={{ background: '#ddd5e8' }}>
            <div className="container">
                <div className="flex flex-col sm:flex-row items-center justify-between gap-6">
                    <div className="text-center sm:text-left">
                        <p className="text-sm font-bold" style={{ color: 'var(--text-secondary)' }}>
                            &copy; {new Date().getFullYear()} Trinity Indonesia. All Rights Reserved.
                        </p>
                        <p className="text-xs mt-1" style={{ color: 'var(--text-muted)' }}>
                            Trinity Indonesia tidak berafiliasi dengan Minecraft atau Mojang AB.
                        </p>
                        <div className="flex flex-wrap items-center justify-center sm:justify-start gap-4 mt-3 text-xs font-bold" style={{ color: 'var(--brand-secondary)' }}>
                            <Link href="/privacy" className="hover:underline">Kebijakan Privasi</Link>
                            <Link href="/refund" className="hover:underline">Kebijakan Pengembalian</Link>
                            <Link href="/terms" className="hover:underline">Syarat & Ketentuan</Link>
                        </div>
                    </div>

                    <div className="flex items-center gap-3">
                        <img src="/vendor/logo.webp" alt="Trinity Indonesia" className="h-10 w-auto" />
                    </div>

                    <div className="flex items-center gap-3">
                        <Link href="/store" className="mc-btn mc-btn-store text-xs">
                            <Icons.ShoppingBag className="w-3 h-3" />
                            Beli Points
                        </Link>
                        <button
                            onClick={scrollToTop}
                            className="mc-btn mc-btn-outline text-xs"
                        >
                            Atas
                            <Icons.ChevronDown className="w-3 h-3 rotate-180" />
                        </button>
                    </div>
                </div>
            </div>
        </footer>
    )
}

// Main Wrapper — uses page-wrapper class for min-height footer push
export function Wrapper({ children, title, description, path }) {
    const pageTitle = title ? `${title} — Trinity Indonesia` : 'Trinity Indonesia — Server Minecraft Indonesia'
    const pageDescription = description || config.metaSiteDescription
    const canonicalUrl = `https://trinityindonesia.cc${path || ''}`

    return (
        <div className="page-wrapper">
            <Head>
                <title>{pageTitle}</title>
                <meta name="description" content={pageDescription} />
                <meta name="viewport" content="width=device-width, initial-scale=1" />
                <meta name="theme-color" content="#E26E10" />
                <link rel="canonical" href={canonicalUrl} />
                <link rel="icon" type="image/png" href="/favicon-96x96.png" sizes="96x96" />
                <link rel="icon" type="image/svg+xml" href="/favicon.svg" />
                <link rel="shortcut icon" href="/favicon.ico" />
                <link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png" />
                <meta name="apple-mobile-web-app-title" content="Trinity Indonesia" />
                <link rel="manifest" href="/site.webmanifest" />

                <meta name="keywords" content="Minecraft, Server Minecraft, Indonesia, Trinity Indonesia, OneBlock, BoxSMP, Anarchy Economy, Survival Indonesia" />
                <meta name="robots" content="index, follow" />

                {/* Open Graph */}
                <meta property="og:title" content={pageTitle} />
                <meta property="og:description" content={pageDescription} />
                <meta property="og:site_name" content={config.metaSiteName} />
                <meta property="og:type" content="website" />
                <meta property="og:url" content={canonicalUrl} />
                <meta property="og:image" content={`${config.metaSiteUrl.replace(/\/$/, '')}${config.metaImage}`} />

                {/* Twitter */}
                <meta name="twitter:card" content="summary_large_image" />
                <meta name="twitter:title" content={pageTitle} />
                <meta name="twitter:description" content={pageDescription} />
                <meta name="twitter:image" content={`${config.metaSiteUrl.replace(/\/$/, '')}${config.metaImage}`} />

                {/* Structured Data */}
                <script
                    type="application/ld+json"
                    dangerouslySetInnerHTML={{
                        __html: JSON.stringify({
                            "@context": "https://schema.org",
                            "@type": "WebSite",
                            name: config.metaSiteName,
                            url: canonicalUrl,
                            description: pageDescription,
                        }),
                    }}
                />
            </Head>

            <SiteHeader />
            <Navbar />

            {/* Spacer between navbar and content */}
            <div style={{ height: '3rem' }} />

            <main className="container pb-32">
                {children}
            </main>

            <Footer />
        </div>
    )
}
