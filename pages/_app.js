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

// Cookie Consent Banner
function CookieConsent() {
  const [visible, setVisible] = useState(false)
  const [animate, setAnimate] = useState(false)

  useEffect(() => {
    const consent = localStorage.getItem('cookieConsent')
    if (!consent) {
      setVisible(true)
      setTimeout(() => setAnimate(true), 100)
    }
  }, [])

  const handleAccept = () => {
    setAnimate(false)
    setTimeout(() => {
      localStorage.setItem('cookieConsent', 'accepted')
      setVisible(false)
    }, 400)
  }

  const handleReject = () => {
    setAnimate(false)
    setTimeout(() => {
      localStorage.setItem('cookieConsent', 'rejected')
      // Clear non-essential storage
      localStorage.removeItem('mcUsername')
      localStorage.removeItem('trinityCart')
      setVisible(false)
    }, 400)
  }

  if (!visible) return null

  return (
    <div className={`cookie-consent-overlay ${animate ? 'cookie-consent-show' : ''}`}>
      <div className="cookie-consent-banner">
        <div className="cookie-consent-icon">
          <svg viewBox="0 0 24 24" fill="currentColor" width="32" height="32" style={{ color: 'var(--brand-secondary)' }}>
            <path d="M21.1634 10.9711C21.5132 10.8204 21.9579 11.0073 21.9811 11.3875C22.1494 14.1467 21.1794 16.9625 19.071 19.0709C15.1657 22.976 8.83405 22.9761 4.92886 19.0709C1.02367 15.1657 1.02377 8.83405 4.92885 4.9288C7.03704 2.82061 9.8525 1.85015 12.6115 2.01806C12.9916 2.04119 13.1787 2.48598 13.028 2.83576C12.4774 4.11367 12.7239 5.65275 13.7677 6.69657C14.3307 7.25963 15.038 7.58971 15.7706 7.68848C16.0483 7.72594 16.2738 7.95144 16.3113 8.2292C16.4101 8.96178 16.7402 9.66905 17.3032 10.2321C18.347 11.2759 19.8857 11.5218 21.1634 10.9711ZM19.7845 13.8397C19.8558 13.5362 19.6123 13.2603 19.3017 13.2337C18.0569 13.1271 16.8417 12.599 15.889 11.6463C15.3166 11.0739 14.8979 10.4061 14.6309 9.69455C14.5744 9.54422 14.4556 9.42534 14.3052 9.36892C13.5936 9.10186 12.9259 8.68322 12.3535 8.11078C11.4005 7.15778 10.8715 5.94208 10.7648 4.69683C10.7381 4.38618 10.4621 4.14264 10.1586 4.2141C8.76039 4.54327 7.43341 5.25267 6.34306 6.34301C3.21903 9.46721 3.21893 14.5326 6.34307 17.6567C9.46721 20.7809 14.5326 20.7808 17.6568 17.6567C18.7474 16.566 19.4557 15.2384 19.7845 13.8397ZM9.8786 14.1212C10.4644 14.707 10.4644 15.6567 9.8786 16.2425C9.29281 16.8283 8.34307 16.8283 7.75728 16.2425C7.17149 15.6567 7.17149 14.707 7.75728 14.1212C8.34306 13.5354 9.29281 13.5354 9.8786 14.1212ZM10.2321 8.11078C10.8179 8.69657 10.8179 9.64631 10.2321 10.2321C9.64636 10.8179 8.69661 10.8179 8.11083 10.2321C7.52504 9.64631 7.52504 8.69656 8.11083 8.11078C8.69661 7.52499 9.64636 7.52499 10.2321 8.11078ZM15.889 13.7676C16.4748 14.3534 16.4748 15.3032 15.889 15.889C15.3032 16.4747 14.3535 16.4747 13.7677 15.889C13.1819 15.3032 13.1819 14.3534 13.7677 13.7676C14.3535 13.1818 15.3032 13.1818 15.889 13.7676Z" />
          </svg>
        </div>
        <div className="cookie-consent-text">
          <p className="cookie-consent-title">Kami menggunakan Cookies</p>
          <p className="cookie-consent-desc">
            Website ini menggunakan cookies dan penyimpanan lokal untuk meningkatkan pengalaman kamu, termasuk menyimpan data login dan keranjang belanja.
            Baca selengkapnya di <a href="/privacy" style={{ color: '#FFB656', fontWeight: 700 }}>Kebijakan Privasi</a>.
          </p>
        </div>
        <div className="cookie-consent-actions">
          <button onClick={handleAccept} className="cookie-consent-accept">
            Terima
          </button>
          <button onClick={handleReject} className="cookie-consent-reject">
            Tolak
          </button>
        </div>
      </div>
    </div>
  )
}

export default function App({ Component, pageProps }) {
  return (
    <SessionProvider session={pageProps.session}>
      <LoadingBar />
      <Component {...pageProps} />
      <CookieConsent />
      <Analytics />
    </SessionProvider>
  )
}
