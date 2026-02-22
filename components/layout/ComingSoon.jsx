import { useState, useEffect } from 'react'
import { Icons } from '@layer/components/elements/Icons'
import Head from 'next/head'

export default function ComingSoon({ targetDate }) {
    const [timeLeft, setTimeLeft] = useState({
        days: 0,
        hours: 0,
        minutes: 0,
        seconds: 0
    })
    const [isClient, setIsClient] = useState(false)

    useEffect(() => {
        setIsClient(true)
        const calculateTimeLeft = () => {
            const difference = +new Date(targetDate) - +new Date()
            if (difference > 0) {
                setTimeLeft({
                    days: Math.floor(difference / (1000 * 60 * 60 * 24)),
                    hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
                    minutes: Math.floor((difference / 1000 / 60) % 60),
                    seconds: Math.floor((difference / 1000) % 60)
                })
            }
        }

        calculateTimeLeft()
        const timer = setInterval(calculateTimeLeft, 1000)
        return () => clearInterval(timer)
    }, [targetDate])

    if (!isClient) {
        return <div className="min-h-screen bg-[var(--bg-primary)]"></div> // Prevent hydration mismatch
    }

    const padZero = (num) => num.toString().padStart(2, '0')

    return (
        <div className="min-h-screen w-full relative flex items-center justify-center overflow-hidden">
            <Head>
                <title>Coming Soon — Trinity Indonesia</title>
                <meta name="description" content="Trinity Indonesia is coming soon!" />
                <meta name="viewport" content="width=device-width, initial-scale=1" />
                <link rel="icon" type="image/png" href="/favicon-96x96.png" sizes="96x96" />
                <link rel="icon" type="image/svg+xml" href="/favicon.svg" />
                <link rel="shortcut icon" href="/favicon.ico" />
            </Head>

            {/* Background Image */}
            <div
                className="absolute inset-0 z-0 bg-cover bg-center bg-no-repeat"
                style={{
                    backgroundImage: 'url(/vendor/comingsoon.webp)', // Assuming bg.jpg is the high-res shader screenshot
                    backgroundColor: 'var(--bg-primary)'
                }}
            />

            {/* Dark Overlay */}
            <div className="absolute inset-0 z-10 bg-black/60 backdrop-blur-sm" />

            {/* Content Container */}
            <div className="relative z-20 w-full max-w-4xl px-4 flex flex-col items-center">
                {/* Logo */}
                <div className="mb-12 transform hover:scale-105 transition-transform duration-500">
                    <img src="/vendor/logo.webp" alt="Trinity Indonesia Logo" className="h-32 md:h-48 drop-shadow-2xl" />
                </div>

                {/* Coming Soon Text */}
                <div className="text-center mb-16">
                    <h1 className="text-5xl md:text-7xl font-black text-white mb-4 drop-shadow-lg tracking-tight">
                        COMING <span style={{ color: 'var(--brand-secondary)' }}>SOON</span>
                    </h1>
                    <p className="text-lg md:text-2xl text-white/80 font-medium tracking-wide">
                        Petualangan epik selanjutnya menantimu...
                    </p>
                </div>

                {/* Countdown Timer */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-8 w-full max-w-3xl">
                    <TimeBox value={padZero(timeLeft.days)} label="Hari" />
                    <TimeBox value={padZero(timeLeft.hours)} label="Jam" />
                    <TimeBox value={padZero(timeLeft.minutes)} label="Menit" />
                    <TimeBox value={padZero(timeLeft.seconds)} label="Detik" />
                </div>

                {/* Footer/Social Links */}
                <div className="mt-20 flex flex-col items-center gap-6">
                    <p className="text-white/60 text-sm font-semibold tracking-widest uppercase">
                        Ikuti Komunitas Kami
                    </p>
                    <div className="flex gap-4">
                        <a
                            href="https://discord.trinityindonesia.cc"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="w-12 h-12 rounded-2xl bg-white/10 hover:bg-[#5865F2] flex items-center justify-center transition-all duration-300 hover:scale-110 hover:-translate-y-1 shadow-xl backdrop-blur-md border border-white/20"
                        >
                            <Icons.Discord className="w-6 h-6 text-white" />
                        </a>
                        {/* Optional Instagram/Tiktok links if they exist, leaving discord as primary */}
                    </div>
                </div>
            </div>
        </div>
    )
}

function TimeBox({ value, label }) {
    return (
        <div className="flex flex-col items-center bg-white/5 backdrop-blur-md rounded-3xl p-6 border border-white/10 shadow-2xl">
            <span className="text-5xl md:text-7xl font-black text-white drop-shadow-md mb-2 tabular-nums">
                {value}
            </span>
            <span className="text-sm md:text-base font-bold text-white/60 uppercase tracking-widest">
                {label}
            </span>
        </div>
    )
}
