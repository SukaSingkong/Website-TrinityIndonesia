import { useState } from 'react'
import { signIn } from 'next-auth/react'
import { useRouter } from 'next/router'
import { Wrapper } from '@layer/components/layout/Wrapper.jsx'

export default function AdminLogin() {
    const [username, setUsername] = useState('')
    const [password, setPassword] = useState('')
    const [error, setError] = useState('')
    const [isLoading, setIsLoading] = useState(false)
    const router = useRouter()

    async function handleSubmit(e) {
        e.preventDefault()
        setError('')
        setIsLoading(true)

        const result = await signIn('credentials', {
            redirect: false,
            username,
            password
        })

        if (result?.error) {
            setError('Username atau password salah.')
            setIsLoading(false)
        } else {
            router.push('/admin')
        }
    }

    return (
        <Wrapper
            title="Admin Login"
            description="Login untuk Admin Dashboard Trinity Indonesia."
            path="/admin/login"
        >
            <div className="flex justify-center items-center min-h-[50vh]">
                <div className="mc-card p-8 w-full max-w-md">
                    <h2 className="text-2xl font-black mb-6 text-center" style={{ color: 'var(--text-primary)' }}>
                        Admin Login
                    </h2>

                    {error && (
                        <div className="mb-4 p-3 rounded-xl" style={{ background: '#fef2f2', border: '1px solid #fecaca' }}>
                            <p className="text-sm text-center" style={{ color: '#dc2626' }}>{error}</p>
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div>
                            <label className="block text-sm font-bold mb-2" style={{ color: 'var(--text-muted)' }}>Username</label>
                            <input
                                type="text"
                                value={username}
                                onChange={(e) => setUsername(e.target.value)}
                                className="mc-input"
                                required
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-bold mb-2" style={{ color: 'var(--text-muted)' }}>Password</label>
                            <input
                                type="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className="mc-input"
                                required
                            />
                        </div>
                        <button
                            type="submit"
                            disabled={isLoading}
                            className="w-full glow-button font-extrabold py-3 mt-4 rounded-xl text-white disabled:opacity-50"
                        >
                            {isLoading ? 'Memproses...' : 'Login'}
                        </button>
                    </form>
                </div>
            </div>
        </Wrapper>
    )
}
