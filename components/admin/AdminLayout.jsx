import { useSession, signOut } from 'next-auth/react'
import { useRouter } from 'next/router'
import Link from 'next/link'
import { useEffect } from 'react'

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

    const navItems = [
        { name: 'Dashboard', path: '/admin' },
        { name: 'Products & Commands', path: '/admin/products' },
        { name: 'Store Settings', path: '/admin/settings' },
    ]

    return (
        <div className="min-h-screen flex bg-[#f5f3f8] text-[#1c1917]">
            {/* Sidebar */}
            <div className="w-64 bg-white border-r border-[#e8e0f0] flex flex-col">
                <div className="h-16 flex items-center px-6 border-b border-[#e8e0f0]">
                    <h1 className="font-black text-xl text-[#E26E10]">Trinity Admin</h1>
                </div>
                <div className="flex-1 overflow-y-auto py-4">
                    <nav className="space-y-1 px-3">
                        {navItems.map((item) => (
                            <Link key={item.path} href={item.path} className={`flex items-center px-3 py-2 text-sm font-bold rounded-xl transition-colors ${router.pathname === item.path ? 'bg-[#fff5eb] text-[#E26E10]' : 'text-[#78716c] hover:bg-[#f5f3f8]'}`}>
                                {item.name}
                            </Link>
                        ))}
                    </nav>
                </div>
                <div className="p-4 border-t border-[#e8e0f0]">
                    <div className="flex items-center gap-3 mb-4">
                        <div className="w-10 h-10 rounded-full bg-[#E26E10] flex items-center justify-center text-white font-bold">
                            A
                        </div>
                        <div>
                            <p className="text-sm font-bold">{session.user.name}</p>
                            <p className="text-xs text-[#a8a29e]">Administrator</p>
                        </div>
                    </div>
                    <button
                        onClick={() => signOut({ callbackUrl: '/' })}
                        className="w-full py-2 px-4 bg-[#fee2e2] text-[#ef4444] rounded-xl text-sm font-bold hover:bg-[#fecaca] transition-colors"
                    >
                        Logout
                    </button>
                </div>
            </div>

            {/* Main Content */}
            <div className="flex-1 flex flex-col">
                <header className="h-16 bg-white border-b border-[#e8e0f0] flex items-center px-6">
                    <h2 className="text-xl font-extrabold">{title}</h2>
                </header>
                <main className="flex-1 p-6 overflow-y-auto">
                    {children}
                </main>
            </div>
        </div>
    )
}
