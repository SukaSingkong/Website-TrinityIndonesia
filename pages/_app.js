import '../styles/globals.css'
import { Analytics } from "@vercel/analytics/next"
import { useRouter } from 'next/router'
import { useEffect, useState } from 'react'
import ComingSoon from '@layer/components/layout/ComingSoon'

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

// TARGET DATE: March 16, 2026, 12:00 WIB (+07:00)
const TARGET_DATE = '2026-03-16T13:00:00+07:00'

export default function App({ Component, pageProps }) {
  const [isComingSoon, setIsComingSoon] = useState(true)

  useEffect(() => {
    // Check if current time is past the target date
    const checkDate = () => {
      // Check for bypass token in URL or localStorage
      const urlParams = new URLSearchParams(window.location.search)
      if (urlParams.has('blockbypass') || urlParams.get('blockbypass') === 'true') {
        localStorage.setItem('blockbypass', 'true')
      }
      const isBypass = localStorage.getItem('blockbypass') === 'true'

      if (isBypass) {
        setIsComingSoon(false)
        return
      }

      const difference = +new Date(TARGET_DATE) - +new Date()
      // If difference <= 0, the target date has passed, so don't show the overlay
      setIsComingSoon(difference > 0)
    }

    checkDate()

    // Periodically check just in case the client leaves the page open
    const interval = setInterval(checkDate, 1000)
    return () => clearInterval(interval)
  }, [])

  if (isComingSoon) {
    return (
      <>
        <ComingSoon targetDate={TARGET_DATE} />
        <Analytics />
      </>
    )
  }

  return (
    <>
      <LoadingBar />
      <Component {...pageProps} />
      <Analytics />
    </>
  )
}
