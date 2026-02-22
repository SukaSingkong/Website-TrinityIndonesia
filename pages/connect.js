import { Wrapper } from '@layer/components/layout/Wrapper.jsx'
import { Icons } from '@layer/components/elements/Icons.jsx'
import { useState } from 'react'

const SERVER_IP = 'trinityindonesia.cc'
const BEDROCK_PORT = '19132'

export default function Connect() {
	const [selectedEdition, setSelectedEdition] = useState(null)
	const [copied, setCopied] = useState(false)

	const copyIP = () => {
		navigator.clipboard.writeText(SERVER_IP)
		setCopied(true)
		setTimeout(() => setCopied(false), 2000)
	}

	return (
		<Wrapper
			title="Cara Bergabung"
			description="Cara bergabung ke server Trinity Indonesia. Tersedia untuk Java Edition dan Bedrock Edition."
			path="/connect"
		>
			{/* Edition Selector */}
			{!selectedEdition && (
				<div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8">
					<button onClick={() => setSelectedEdition('java')} className="connect-card-java text-left">
						<h3 className="text-xl font-extrabold mb-1">Pilih Java Edition</h3>
						<p className="text-sm opacity-80">Windows & MacOS</p>
					</button>
					<button onClick={() => setSelectedEdition('bedrock')} className="connect-card-bedrock text-left">
						<h3 className="text-xl font-extrabold mb-1">Pilih Bedrock Edition</h3>
						<p className="text-sm opacity-80">Mobile / Pocket Edition</p>
					</button>
				</div>
			)}

			{/* Java Instructions */}
			{selectedEdition === 'java' && (
				<div className="space-y-4">
					{/* Header */}
					<div className="mc-card p-6">
						<div className="flex items-center justify-between flex-wrap gap-4">
							<div className="flex items-center gap-3">
								<button onClick={() => setSelectedEdition(null)} className="w-8 h-8 rounded-lg flex items-center justify-center hover:bg-gray-100 transition-colors" style={{ color: 'var(--brand-secondary)' }}>
									<Icons.ArrowRight className="w-5 h-5 rotate-180" />
								</button>
								<div>
									<h2 className="text-lg font-extrabold" style={{ color: 'var(--text-primary)' }}>
										Cara Bergabung via Java Edition
									</h2>
									<p className="text-sm" style={{ color: 'var(--text-muted)' }}>Windows & MacOS</p>
								</div>
							</div>

							<div className="flex items-center gap-2">
								<button onClick={copyIP} className="mc-btn mc-btn-outline text-xs">
									{copied ? 'Tersalin!' : SERVER_IP}
								</button>
								<button onClick={copyIP} className="mc-btn mc-btn-primary text-xs p-3">
									<Icons.ClipboardCopy className="w-4 h-4" />
								</button>
							</div>
						</div>
					</div>

					{/* Steps */}
					<div className="mc-card p-6">
						<div className="space-y-2">
							<div className="mc-step">
								<div className="mc-step-number">#1</div>
								<p className="text-sm pt-1" style={{ color: 'var(--text-secondary)' }}>
									Buka Minecraft: Java Edition dan tekan tombol <strong>Multiplayer</strong>.
								</p>
							</div>
							<div className="mc-step">
								<div className="mc-step-number">#2</div>
								<p className="text-sm pt-1" style={{ color: 'var(--text-secondary)' }}>
									Klik tombol <strong>Add Server</strong> dan masukkan nama apapun di kolom Server Name.
								</p>
							</div>
							<div className="mc-step">
								<div className="mc-step-number">#3</div>
								<p className="text-sm pt-1" style={{ color: 'var(--text-secondary)' }}>
									Salin IP server dengan tombol di atas, lalu tempel di kolom <strong>Server Address</strong>.
								</p>
							</div>
						</div>
					</div>

					{/* Success Banner */}
					<div className="mc-success-banner">
						Selamat, kamu siap bergabung ke Trinity Indonesia!
					</div>
				</div>
			)}

			{/* Bedrock Instructions */}
			{selectedEdition === 'bedrock' && (
				<div className="space-y-4">
					{/* Header */}
					<div className="mc-card p-6">
						<div className="flex items-center justify-between flex-wrap gap-4">
							<div className="flex items-center gap-3">
								<button onClick={() => setSelectedEdition(null)} className="w-8 h-8 rounded-lg flex items-center justify-center hover:bg-gray-100 transition-colors" style={{ color: 'var(--brand-secondary)' }}>
									<Icons.ArrowRight className="w-5 h-5 rotate-180" />
								</button>
								<div>
									<h2 className="text-lg font-extrabold" style={{ color: 'var(--text-primary)' }}>
										Cara Bergabung via Bedrock Edition
									</h2>
									<p className="text-sm" style={{ color: 'var(--text-muted)' }}>Mobile / Console / Windows 10+</p>
								</div>
							</div>

							<div className="flex items-center gap-2">
								<button onClick={copyIP} className="mc-btn mc-btn-outline text-xs">
									{copied ? 'Tersalin!' : SERVER_IP}
								</button>
								<button onClick={copyIP} className="mc-btn mc-btn-primary text-xs p-3">
									<Icons.ClipboardCopy className="w-4 h-4" />
								</button>
							</div>
						</div>
					</div>

					{/* Steps */}
					<div className="mc-card p-6">
						<div className="space-y-2">
							<div className="mc-step">
								<div className="mc-step-number">#1</div>
								<p className="text-sm pt-1" style={{ color: 'var(--text-secondary)' }}>
									Buka Minecraft: Bedrock Edition dan pergi ke tab <strong>Servers</strong>.
								</p>
							</div>
							<div className="mc-step">
								<div className="mc-step-number">#2</div>
								<p className="text-sm pt-1" style={{ color: 'var(--text-secondary)' }}>
									Scroll ke bawah dan tekan <strong>Add Server</strong>. Masukkan nama apapun untuk Server Name.
								</p>
							</div>
							<div className="mc-step">
								<div className="mc-step-number">#3</div>
								<p className="text-sm pt-1" style={{ color: 'var(--text-secondary)' }}>
									Masukkan <strong>{SERVER_IP}</strong> sebagai Server Address dan <strong>{BEDROCK_PORT}</strong> sebagai Port.
								</p>
							</div>
							<div className="mc-step">
								<div className="mc-step-number">#4</div>
								<p className="text-sm pt-1" style={{ color: 'var(--text-secondary)' }}>
									Tekan <strong>Save</strong>, lalu pilih server dan tekan <strong>Join Server</strong>.
								</p>
							</div>
						</div>
					</div>

					{/* Success Banner */}
					<div className="mc-success-banner mb-12">
						Selamat, kamu siap bergabung ke Trinity Indonesia!
					</div>
				</div>
			)}
			{/* Pad bottom for footer clearance */}
			<div className="h-4" />
		</Wrapper>
	)
}
