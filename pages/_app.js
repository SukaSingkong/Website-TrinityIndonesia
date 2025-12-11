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
        setProgress(prev => prev < 90 ? prev + 10 : prev)
      }, 100)
    }

    const handleComplete = () => {
      clearInterval(progressInterval)
      setProgress(100)
      setTimeout(() => {
        setLoading(false)
        setProgress(0)
      }, 200)
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
    <div className="fixed top-0 left-0 right-0 z-[9999] h-1 bg-transparent">
      <div
        className="h-full bg-gradient-to-r from-rose-500 via-pink-500 to-rose-500 transition-all duration-200 ease-out shadow-lg shadow-rose-500/50"
        style={{ width: `${progress}%` }}
      />
    </div>
  )
}

function MyApp({ Component, pageProps }) {
  return (
    <>
      <LoadingBar />
      <Component {...pageProps} />
      <Analytics />
    </>
  )
}

export default MyApp
