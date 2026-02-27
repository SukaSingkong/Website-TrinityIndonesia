import { useSession, signOut } from 'next-auth/react'
import { useRouter } from 'next/router'
import Link from 'next/link'
import { useEffect } from 'react'
import { Icons } from '../elements/Icons'

const navItems = [
    { name: 'Dashboard', path: '/admin', icon: 'Home' },
    { name: 'Purchase Logs', path: '/admin/purchases', icon: 'Clipboard' },
    { name: 'Products & Commands', path: '/admin/products', icon: 'ShoppingBag' },
    { name: 'Store Settings', path: '/admin/settings', icon: 'Cog' },
]

const pageIcons = {
    '/admin': Icons.Home,
    '/admin/products': Icons.ShoppingBag,
    '/admin/purchases': Icons.Clipboard,
    '/admin/settings': Icons.Cog,
}

export default function AdminLayout({ children, title }) {
    const { data: session, status } = useSession()
    const router = useRouter()

    useEffect(() => {
        if (status === 'unauthenticated') {
            router.push('/admin/login')
        }
    }, [status, router])

    if (status === 'loading') {
        return <div className="min-h-screen flex items-center justify-center bg-[#f5f3f8]">
            <div className="w-12 h-12 border-4 rounded-full animate-spin border-t-[#E26E10] border-r-transparent border-b-transparent border-l-transparent" />
        </div>
    }

    if (!session) return null

    return (
        <div className="min-h-screen flex text-[#1c1917]" style={{ background: 'var(--bg-body)' }}>
            {/* Sidebar */}
            <div className="w-72 m-4 mr-0 rounded-2xl flex flex-col shadow-xl overflow-hidden relative" style={{ background: 'var(--bg-card)' }}>
                {/* Decorative background blobs */}
                <div className="absolute top-0 right-0 w-40 h-40 bg-[var(--brand-primary)] opacity-10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/4"></div>
                <div className="absolute bottom-20 left-0 w-32 h-32 bg-[var(--brand-secondary)] opacity-5 rounded-full blur-2xl -translate-x-1/2"></div>

                {/* Logo & Brand */}
                <div className="px-6 pt-6 pb-4 border-b border-[#e8e0f0] relative z-10">
                    <div className="flex items-center gap-3 mb-1">
                        <img src="/vendor/logo.webp" alt="Trinity Indonesia" className="w-12 h-12 object-contain drop-shadow-md" />
                        <div>
                            <h1 className="font-black text-xl leading-tight text-[var(--brand-secondary)]">
                                Trinity<span className="text-[var(--text-primary)] ml-1 text-sm font-extrabold">Admin</span>
                            </h1>
                            <p className="text-[10px] font-bold text-[var(--text-muted)] tracking-wide">Panel Manajemen</p>
                        </div>
                    </div>
                </div>

                {/* Navigation */}
                <div className="flex-1 overflow-y-auto py-5 relative z-10">
                    <nav className="space-y-1.5 px-4">
                        <p className="px-3 text-[10px] font-black uppercase tracking-widest text-[var(--text-muted)] mb-3">Menu Utama</p>
                        {navItems.map((item) => {
                            const isActive = router.pathname === item.path
                            const IconComp = Icons[item.icon]
                            return (
                                <Link
                                    key={item.path}
                                    href={item.path}
                                    className={`flex items-center gap-3 px-4 py-3 text-sm font-extrabold rounded-xl transition-all duration-300 ${isActive
                                        ? 'text-white shadow-md'
                                        : 'hover:bg-[#ece8f2] hover:text-[#1c1917]'
                                        }`}
                                    style={isActive
                                        ? { background: '#E26E10', color: '#fff', boxShadow: '0 4px 14px rgba(226,110,16,0.35)' }
                                        : { color: '#6b5e7b' }
                                    }
                                >
                                    <span style={{ color: isActive ? '#fff' : '#9b8fb0' }}><IconComp className="w-[18px] h-[18px] flex-shrink-0" /></span>
                                    {item.name}
                                </Link>
                            )
                        })}
                    </nav>
                </div>

                {/* User Info & Logout */}
                <div className="p-4 border-t border-[#e8e0f0] bg-[#faf8ff] relative z-10">
                    <div className="flex items-center gap-3 mb-3 p-2">
                        <div className="w-10 h-10 rounded-xl flex items-center justify-center text-white font-black shadow-sm" style={{ background: 'var(--brand-secondary)' }}>
                            {session.user.name?.charAt(0).toUpperCase() || 'A'}
                        </div>
                        <div className="min-w-0">
                            <p className="text-sm font-extrabold text-[var(--text-primary)] truncate">{session.user.name}</p>
                            <p className="text-xs font-bold text-[var(--brand-secondary)]">Administrator</p>
                        </div>
                    </div>
                    <button
                        onClick={() => signOut({ callbackUrl: '/' })}
                        className="w-full py-2.5 px-4 bg-[#fee2e2] text-[#ef4444] rounded-xl text-sm font-extrabold hover:bg-[#fecaca] transition-colors flex items-center justify-center gap-2"
                    >
                        <Icons.X className="w-4 h-4" />
                        Keluar
                    </button>
                </div>
            </div>

            {/* Main Content */}
            <div className="flex-1 flex flex-col min-w-0">
                <header className="h-20 flex items-center px-8 mx-8 mt-4 rounded-2xl bg-white shadow-sm" style={{ background: 'var(--bg-card)' }}>
                    <div className="w-10 h-10 rounded-xl bg-[var(--bg-body)] flex items-center justify-center mr-4">
                        {(() => { const Icon = pageIcons[router.pathname] || Icons.Home; return <Icon className="w-5 h-5 text-[var(--brand-secondary)]" /> })()}
                    </div>
                    <div>
                        <h2 className="text-xl font-black text-[var(--text-primary)] leading-tight">{title}</h2>
                        <p className="text-xs font-bold text-[var(--text-muted)]">Panel Manajemen Sistem</p>
                    </div>
                </header>
                <main className="flex-1 px-8 py-8 overflow-y-auto">
                    {children}
                </main>
            </div>
        </div>
    )
}
