import '../styles/globals.css'
import { Analytics } from "@vercel/analytics/next"
import { useRouter } from 'next/router'
import { useEffect, useState } from 'react'

// Page Loading Progress Bar
function LoadingBar() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [progress, setProgress] = useState(0)

  useEffect(() => {
    let progressInterval

    const handleStart = () => {
      setLoading(true)
      setProgress(0)
      progressInterval = setInterval(() => {
        setProgress(prev => {
          if (prev >= 90) {
            clearInterval(progressInterval)
            return 90
          }
          return prev + Math.random() * 15
        })
      }, 200)
    }

    const handleComplete = () => {
      clearInterval(progressInterval)
      setProgress(100)
      setTimeout(() => {
        setLoading(false)
        setProgress(0)
      }, 300)
    }

    router.events.on('routeChangeStart', handleStart)
    router.events.on('routeChangeComplete', handleComplete)
    router.events.on('routeChangeError', handleComplete)

    return () => {
      clearInterval(progressInterval)
      router.events.off('routeChangeStart', handleStart)
      router.events.off('routeChangeComplete', handleComplete)
      router.events.off('routeChangeError', handleComplete)
    }
  }, [router])

  if (!loading) return null

  return (
    <div className="fixed top-0 left-0 right-0 z-[100] h-1">
      <div
        className="h-full rounded-r-full transition-all duration-300 ease-out"
        style={{
          width: `${progress}%`,
          background: 'linear-gradient(90deg, #FFB656, #E26E10)',
          boxShadow: '0 0 15px rgba(255, 182, 86, 0.5)'
        }}
      />
    </div>
  )
}

import { SessionProvider } from 'next-auth/react'

export default function App({ Component, pageProps }) {
  return (
    <SessionProvider session={pageProps.session}>
      <LoadingBar />
      <Component {...pageProps} />
      <Analytics />
    </SessionProvider>
  )
}
