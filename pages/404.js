import { Wrapper } from '@layer/components/layout/Wrapper.jsx'
import { Icons } from '@layer/components/elements/Icons.jsx'
import Link from 'next/link'
import { useState, useEffect } from 'react'

const messages = [
    "Waduh, nyasar bro?",
    "Mungkin halaman ini sudah di-grief...",
    "404: Block Not Found",
    "Sepertinya kamu jatuh ke void...",
    "Halaman ini tidak ada di peta server kita.",
    "Buset, nyari apa bang di sini?"
];

export default function Custom404() {
    const [message, setMessage] = useState("Halaman tidak ditemukan...");

    useEffect(() => {
        setMessage(messages[Math.floor(Math.random() * messages.length)]);
    }, []);

    return (
        <Wrapper title="404 Not Found" description="Halaman yang kamu cari tidak ditemukan.">
            <div className="mc-content-card text-center py-20 my-10 flex flex-col items-center justify-center min-h-[50vh]">
                <Icons.Map className="w-24 h-24 mb-6 opacity-50" style={{ color: 'var(--brand-secondary)' }} />
                <h1 className="text-6xl font-black mb-4 drop-shadow-md" style={{ color: 'var(--text-primary)' }}>404</h1>
                <h2 className="text-xl md:text-2xl font-bold mb-8" style={{ color: 'var(--text-secondary)' }}>{message}</h2>
                <Link href="/" className="mc-btn mc-btn-primary px-8 py-3 text-lg">
                    <Icons.ArrowRight className="w-5 h-5 rotate-180" />
                    Kembali ke Spawn
                </Link>
            </div>
        </Wrapper>
    )
}
