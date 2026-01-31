// API endpoint to send player report to Discord webhook with file attachments
import { IncomingForm } from 'formidable'
import fs from 'fs'

export const config = {
    api: {
        bodyParser: false,
    },
}

const DISCORD_WEBHOOK_URL = process.env.PLAYERREPORT_WEBHOOK_URL

const gameModeLabels = {
    general: 'Umum / General',
    oneblock: 'OneBlock',
    boxsmp: 'BoxSMP',
    anarchy: 'Anarchy Economy',
    discord: 'Discord',
    external: 'Di Luar Game',
    other: 'Lainnya'
}

const categoryLabels = {
    cheat: { name: 'Cheat / Hack', emoji: '🎮', color: 0xf43f5e },
    exploit: { name: 'Exploit / Bug Abuse', emoji: '⚠️', color: 0xf59e0b },
    toxic: { name: 'Toxic / Harassment', emoji: '💢', color: 0xef4444 },
    scam: { name: 'Penipuan', emoji: '🦊', color: 0xf97316 },
    account_selling: { name: 'Jual Beli Akun', emoji: '💰', color: 0xeab308 },
    rmt: { name: 'RMT (Real Money Trading)', emoji: '💵', color: 0x22c55e },
    other: { name: 'Lainnya', emoji: '❓', color: 0x6b7280 }
}

function parseForm(req) {
    return new Promise((resolve, reject) => {
        const form = new IncomingForm({
            multiples: true,
            maxFileSize: 10 * 1024 * 1024,
            maxFiles: 5,
        })

        form.parse(req, (err, fields, files) => {
            if (err) reject(err)
            else resolve({ fields, files })
        })
    })
}

export default async function handler(req, res) {
    if (req.method !== 'POST') {
        return res.status(405).json({ success: false, message: 'Method not allowed' })
    }

    try {
        const { fields, files } = await parseForm(req)

        const reporter = Array.isArray(fields.reporter) ? fields.reporter[0] : fields.reporter
        const platform = Array.isArray(fields.platform) ? fields.platform[0] : fields.platform
        const reportedPlayer = Array.isArray(fields.reportedPlayer) ? fields.reportedPlayer[0] : fields.reportedPlayer
        const gameMode = Array.isArray(fields.gameMode) ? fields.gameMode[0] : fields.gameMode
        const category = Array.isArray(fields.category) ? fields.category[0] : fields.category
        const description = Array.isArray(fields.description) ? fields.description[0] : fields.description

        // Validate input
        if (!reporter || !reportedPlayer || !description || !gameMode || !category) {
            return res.status(400).json({
                success: false,
                message: 'Semua field wajib diisi'
            })
        }

        if (description.length < 100) {
            return res.status(400).json({
                success: false,
                message: 'Deskripsi minimal 100 karakter'
            })
        }

        const fileKeys = Object.keys(files).filter(key => key.startsWith('file'))
        if (fileKeys.length === 0) {
            return res.status(400).json({
                success: false,
                message: 'Bukti screenshot wajib dilampirkan'
            })
        }

        if (!DISCORD_WEBHOOK_URL) {
            console.error('PLAYERREPORT_WEBHOOK_URL not configured')
            return res.status(500).json({
                success: false,
                message: 'Webhook tidak dikonfigurasi'
            })
        }

        // Get avatars
        const reporterAvatarUrl = `https://mc-heads.net/avatar/${reporter}/128`
        const reportedAvatarUrl = `https://mc-heads.net/avatar/${reportedPlayer}/64`

        // Server icon
        const serverIconUrl = `https://trinityindonesia.cc/vendor/logo.webp`

        // Get labels
        const gameModeLabel = gameModeLabels[gameMode] || 'Unknown'
        const categoryInfo = categoryLabels[category] || categoryLabels.other

        // Create Discord embed
        const embed = {
            title: `${categoryInfo.emoji} Player Report - ${categoryInfo.name}`,
            color: categoryInfo.color,
            thumbnail: {
                url: reporterAvatarUrl
            },
            fields: [
                {
                    name: "👤 Pelapor",
                    value: `\`${reporter}\``,
                    inline: true
                },
                {
                    name: "🎮 Platform",
                    value: platform === 'java' ? 'Java Edition' : 'Bedrock Edition',
                    inline: true
                },
                {
                    name: "🚨 Terlapor",
                    value: `\`${reportedPlayer}\``,
                    inline: true
                },
                {
                    name: "📍 Lokasi Kejadian",
                    value: gameModeLabel,
                    inline: true
                },
                {
                    name: `${categoryInfo.emoji} Kategori`,
                    value: categoryInfo.name,
                    inline: true
                },
                {
                    name: "📝 Kronologi",
                    value: description.length > 1000 ? description.substring(0, 1000) + '...' : description,
                    inline: false
                }
            ],
            footer: {
                text: "Laporkan player di trinityindonesia.cc/report",
                icon_url: serverIconUrl
            },
            timestamp: new Date().toISOString(),
            url: "https://trinityindonesia.cc/report"
        }

        // Add first image to embed
        if (fileKeys.length > 0) {
            embed.image = {
                url: `attachment://evidence0.png`
            }
        }

        // Create additional embeds for remaining images (all inside embeds)
        const allEmbeds = [embed]
        for (let i = 1; i < fileKeys.length && i < 5; i++) {
            allEmbeds.push({
                url: "https://trinityindonesia.cc/report",
                color: categoryInfo.color,
                image: {
                    url: `attachment://evidence${i}.png`
                }
            })
        }

        // Prepare FormData
        const formData = new FormData()

        formData.append('payload_json', JSON.stringify({
            username: "Trinity Indonesia",
            avatar_url: serverIconUrl,
            embeds: allEmbeds
        }))

        // Add files
        for (let i = 0; i < fileKeys.length && i < 5; i++) {
            const fileArray = files[fileKeys[i]]
            const file = Array.isArray(fileArray) ? fileArray[0] : fileArray

            if (file && file.filepath) {
                const fileBuffer = fs.readFileSync(file.filepath)
                const blob = new Blob([fileBuffer], { type: file.mimetype })
                formData.append(`files[${i}]`, blob, `evidence${i}.png`)
            }
        }

        // Send to Discord webhook
        const webhookResponse = await fetch(DISCORD_WEBHOOK_URL, {
            method: 'POST',
            body: formData
        })

        if (!webhookResponse.ok) {
            const errorText = await webhookResponse.text()
            console.error('Discord webhook error:', webhookResponse.status, errorText)
            return res.status(500).json({
                success: false,
                message: 'Gagal mengirim ke Discord'
            })
        }

        // Clean up temp files
        for (const key of fileKeys) {
            const fileArray = files[key]
            const file = Array.isArray(fileArray) ? fileArray[0] : fileArray
            if (file && file.filepath && fs.existsSync(file.filepath)) {
                fs.unlinkSync(file.filepath)
            }
        }

        return res.status(200).json({
            success: true,
            message: 'Laporan berhasil dikirim'
        })

    } catch (error) {
        console.error('Player Report API error:', error)
        return res.status(500).json({
            success: false,
            message: 'Internal server error'
        })
    }
}
