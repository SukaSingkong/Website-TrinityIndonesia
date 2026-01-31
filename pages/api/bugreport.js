// API endpoint to send bug report to Discord webhook with file attachments
import { IncomingForm } from 'formidable'
import fs from 'fs'
import path from 'path'

export const config = {
    api: {
        bodyParser: false, // Disable default body parser for file uploads
    },
}

const DISCORD_WEBHOOK_URL = process.env.BUGREPORT_WEBHOOK_URL

const gameModeLabels = {
    general: 'Umum / General',
    oneblock: 'OneBlock',
    boxsmp: 'BoxSMP',
    anarchy: 'Anarchy Economy',
    website: 'Website',
    other: 'Lainnya'
}

const bugTypeLabels = {
    gameplay: { name: 'Bug Gameplay', emoji: '🎮' },
    visual: { name: 'Bug Visual', emoji: '👁️' },
    performance: { name: 'Lag / Performance', emoji: '🐌' },
    exploit: { name: 'Exploit / Dupe', emoji: '⚠️' },
    other: { name: 'Lainnya', emoji: '❓' }
}

function parseForm(req) {
    return new Promise((resolve, reject) => {
        const form = new IncomingForm({
            multiples: true,
            maxFileSize: 10 * 1024 * 1024, // 10MB max per file
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
        // Parse form data
        const { fields, files } = await parseForm(req)

        const nickname = Array.isArray(fields.nickname) ? fields.nickname[0] : fields.nickname
        const platform = Array.isArray(fields.platform) ? fields.platform[0] : fields.platform
        const gameMode = Array.isArray(fields.gameMode) ? fields.gameMode[0] : fields.gameMode
        const bugType = Array.isArray(fields.bugType) ? fields.bugType[0] : fields.bugType
        const description = Array.isArray(fields.description) ? fields.description[0] : fields.description

        // Validate input
        if (!nickname || !description || !gameMode || !bugType) {
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

        // Check if webhook URL is configured
        if (!DISCORD_WEBHOOK_URL) {
            console.error('BUGREPORT_WEBHOOK_URL not configured')
            return res.status(500).json({
                success: false,
                message: 'Webhook tidak dikonfigurasi'
            })
        }

        // Get player avatar from mc-heads
        const avatarUrl = `https://mc-heads.net/avatar/${nickname}/128`

        // Server icon for webhook avatar
        const serverIconUrl = `https://trinityindonesia.cc/vendor/logo.webp`

        // Get labels
        const gameModeLabel = gameModeLabels[gameMode] || 'Unknown'
        const bugTypeInfo = bugTypeLabels[bugType] || bugTypeLabels.other

        // Collect file keys
        const fileKeys = Object.keys(files).filter(key => key.startsWith('file'))

        // Create Discord embed
        const embed = {
            title: `🐛 Bug Report Baru`,
            color: 0xf43f5e, // Rose color for bugs
            thumbnail: {
                url: avatarUrl
            },
            fields: [
                {
                    name: "👤 Reporter",
                    value: `\`${nickname}\``,
                    inline: true
                },
                {
                    name: "🎮 Platform",
                    value: platform === 'java' ? 'Java Edition' : 'Bedrock Edition',
                    inline: true
                },
                {
                    name: "🎯 Mode Permainan",
                    value: gameModeLabel,
                    inline: true
                },
                {
                    name: `${bugTypeInfo.emoji} Jenis Bug`,
                    value: bugTypeInfo.name,
                    inline: true
                },
                {
                    name: "📝 Deskripsi Bug",
                    value: description.length > 1000 ? description.substring(0, 1000) + '...' : description,
                    inline: false
                }
            ],
            footer: {
                text: "Laporkan bug di trinityindonesia.cc/bugreport",
                icon_url: serverIconUrl
            },
            timestamp: new Date().toISOString(),
            url: "https://trinityindonesia.cc/bugreport"
        }

        // Add first image to embed if available
        if (fileKeys.length > 0) {
            embed.image = {
                url: `attachment://screenshot0.png`
            }
        }

        // Create additional embeds for remaining images (all inside embeds)
        const allEmbeds = [embed]
        for (let i = 1; i < fileKeys.length && i < 5; i++) {
            allEmbeds.push({
                url: "https://trinityindonesia.cc/bugreport",
                color: 0xf43f5e,
                image: {
                    url: `attachment://screenshot${i}.png`
                }
            })
        }

        // Prepare FormData for Discord webhook with files
        const formData = new FormData()

        // Add JSON payload with server icon
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
                formData.append(`files[${i}]`, blob, `screenshot${i}.png`)
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
            message: 'Bug report berhasil dikirim'
        })

    } catch (error) {
        console.error('Bug Report API error:', error)
        return res.status(500).json({
            success: false,
            message: 'Internal server error'
        })
    }
}
