import { Icons } from '@layer/components/elements/Icons.jsx'
import config from '@layer/theme.config'
import { Popover, Transition } from '@headlessui/react'
import { Fragment, useState, useEffect } from 'react'
import Link from 'next/link'
import Head from "next/head"

const solutions = [
    {
        name: 'Beranda',
        description: 'Lihat informasi utama server Trinity Indonesia.',
        href: '/',
        icon: Icons.Home,
    },
    {
        name: 'Tim Staf',
        description: 'Kenali orang-orang yang menjaga komunitas.',
        href: '/staff',
        icon: Icons.Users,
    },
    {
        name: 'Aturan Server',
        description: 'Baca panduan bermain agar semua nyaman.',
        href: '/rules',
        icon: Icons.Flag,
    },
    {
        name: 'Store',
        description: 'Beli gems untuk keuntungan in-game.',
        href: '/store',
        icon: Icons.Gem,
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
                <meta name="description" content={config.metaSiteDescription} />
                <meta property="og:type" content="website" />
                <meta property="og:url" content={config.metaSiteUrl} />
                <meta property="og:title" content={metaTitle} />
                <meta property="og:description" content={config.metaSiteDescription} />
                <meta property="og:image" content={config.metaImage} />
                <meta property="twitter:card" content="summary_large_image" />
                <meta property="twitter:url" content={config.metaSiteUrl} />
                <meta property="twitter:title" content={metaTitle} />
                <meta property="twitter:description" content={config.metaSiteDescription} />
                <meta property="twitter:image" content={config.metaImage} />
            </Head>
            <div className="min-h-screen" style={{ background: 'var(--surface-900)' }}>
                {/* Sticky Navbar */}
                <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${scrolled ? 'glass py-4' : 'py-6 bg-transparent'}`}>
                    <div className="container">
                        <div className="flex gap-12 items-center">
                            <Link href="/">
                                <div className="text-2xl font-bold uppercase cursor-pointer group">
                                    <span className="text-white transition-all duration-300 group-hover:text-rose-100">{brandPrimary}</span>
                                    {brandAccent && <span className="gradient-text transition-all duration-300"> {brandAccent}</span>}
                                </div>
                            </Link>
                            <div className="hidden md:flex flex-grow justify-end items-center gap-8" data-apply="navbar">
                                <Link href="/">Beranda</Link>
                                <Link href="/staff">Tim Staf</Link>
                                <Link href="/rules">Aturan</Link>
                                <Link href="/store">
                                    <Icons.Gem className="h-4 w-4" />
                                    Beli Gems
                                </Link>
                            </div>
                            <div className="flex md:hidden flex-grow justify-end items-center">
                                <Popover className="relative">
                                    {({ open }) => (
                                        <>
                                            <Popover.Button className="p-2 rounded-lg glass transition-all duration-200 hover:bg-white/10">
                                                {open ? <Icons.X className="h-6 w-6 text-white" /> : <Icons.Menu className="h-6 w-6 text-white" />}
                                            </Popover.Button>
                                            <Transition as={Fragment} enter="transition ease-out duration-300" enterFrom="opacity-0 translate-y-4 scale-95" enterTo="opacity-100 translate-y-0 scale-100" leave="transition ease-in duration-200" leaveFrom="opacity-100 translate-y-0 scale-100" leaveTo="opacity-0 translate-y-4 scale-95">
                                                <Popover.Panel className="absolute right-0 z-10 mt-4 w-screen max-w-sm -mr-4 px-4">
                                                    <div className="overflow-hidden rounded-2xl glass-card shadow-2xl">
                                                        <div className="relative grid gap-4 p-6">
                                                            {solutions.map((item) => (
                                                                <Link key={item.name} href={item.href}>
                                                                    <div className="flex items-center rounded-xl p-4 transition-all duration-300 hover:bg-white/5 cursor-pointer group">
                                                                        <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-red-500/20 to-rose-500/20 text-rose-400 group-hover:from-red-500/30 group-hover:to-rose-500/30 transition-all duration-300">
                                                                            <item.icon className="h-6 w-6" />
                                                                        </div>
                                                                        <div className="ml-4">
                                                                            <p className="text-sm font-semibold text-white uppercase">{item.name}</p>
                                                                            <p className="text-sm text-gray-400 mt-1">{item.description}</p>
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
                <footer className="relative">
                    <div className="section-divider" />
                    <div className="container py-16">
                        {/* Main Footer Content */}
                        <div className="grid grid-cols-1 lg:grid-cols-4 gap-12 mb-12">
                            {/* Brand */}
                            <div className="lg:col-span-1">
                                <h1 className="text-2xl font-bold uppercase mb-4">
                                    <span className="text-white">{brandPrimary}</span>
                                    {brandAccent && <span className="gradient-text"> {brandAccent}</span>}
                                </h1>
                                <p className="text-gray-500 text-sm mb-4">Server Minecraft Indonesia dengan berbagai mode seru: Survival, Skyblock, Lifesteal, dan Bedwars.</p>
                            </div>

                            {/* Quick Links */}
                            <div className="lg:col-span-1">
                                <h3 className="text-white font-bold uppercase text-sm mb-4">Menu</h3>
                                <div className="flex flex-col gap-3" data-apply="footer-links">
                                    <Link href="/">Beranda</Link>
                                    <Link href="/staff">Tim Staf</Link>
                                    <Link href="/rules">Aturan Server</Link>
                                    <Link href="/store">Beli Gems</Link>
                                </div>
                            </div>

                            {/* Legal */}
                            <div className="lg:col-span-1">
                                <h3 className="text-white font-bold uppercase text-sm mb-4">Legal</h3>
                                <div className="flex flex-col gap-3" data-apply="footer-links">
                                    <Link href="/privacy">Kebijakan Privasi</Link>
                                    <Link href="/terms">Ketentuan Layanan</Link>
                                    <Link href="/refund">Kebijakan Refund</Link>
                                </div>
                            </div>

                            {/* Join Server */}
                            <div className="lg:col-span-1">
                                <h3 className="text-white font-bold uppercase text-sm mb-4">Join Server</h3>
                                <div className="flex flex-col gap-2">
                                    <div className="flex items-center gap-3 px-4 py-3 rounded-lg bg-gradient-to-r from-rose-500/10 to-transparent border border-rose-500/20 hover:border-rose-500/40 transition-all cursor-default">
                                        <div className="w-8 h-8 rounded-md bg-rose-500/20 flex items-center justify-center flex-shrink-0">
                                            <Icons.Server className="h-4 w-4 text-rose-400" />
                                        </div>
                                        <div className="min-w-0">
                                            <p className="text-gray-500 text-[10px] uppercase tracking-wider">Server IP</p>
                                            <p className="text-white font-semibold text-sm truncate">trinityindonesia.cc</p>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-3 px-4 py-3 rounded-lg bg-gradient-to-r from-rose-500/10 to-transparent border border-rose-500/20 hover:border-rose-500/40 transition-all cursor-default">
                                        <div className="w-8 h-8 rounded-md bg-rose-500/20 flex items-center justify-center flex-shrink-0">
                                            <Icons.Cube className="h-4 w-4 text-rose-400" />
                                        </div>
                                        <div className="min-w-0">
                                            <p className="text-gray-500 text-[10px] uppercase tracking-wider">Version</p>
                                            <p className="text-white font-semibold text-sm">Java & Bedrock</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Bottom Section */}
                        <div className="section-divider mb-8" />
                        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
                            <p className="text-sm text-gray-600 font-medium">© 2026 Trinity Indonesia. All rights reserved.</p>

                            {/* Powered by Syncara */}
                            <a
                                href="https://syncara.host"
                                target="_blank"
                                rel="noreferrer"
                                className="flex items-center gap-3 px-4 py-2 rounded-xl bg-white/5 border border-white/10 hover:border-white/20 hover:bg-white/10 transition-all duration-300 group"
                            >
                                <span className="text-gray-500 text-sm">Powered by & Part of</span>
                                <img
                                    src="https://syncara.host/storage/logo-dark.webp"
                                    alt="Syncara.host"
                                    className="h-6 opacity-70 group-hover:opacity-100 transition-opacity"
                                />
                                <span className="text-white font-semibold group-hover:text-rose-400 transition-colors">Syncara.host</span>
                            </a>
                        </div>
                    </div>
                </footer>
            </div>
        </>
    )
}
