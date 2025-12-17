// API endpoint to send suggestion to Discord webhook

const DISCORD_WEBHOOK_URL = process.env.SUGGESTION_WEBHOOK_URL

const gameModeLabels = {
    general: 'Umum / General',
    oneblock: 'OneBlock',
    boxsmp: 'BoxSMP',
    anarchy: 'Anarchy Economy',
    website: 'Website',
    other: 'Lainnya'
}

const categoryLabels = {
    suggestion: { name: 'Saran', emoji: '💡', color: 0x10b981 },
    idea: { name: 'Ide Fitur', emoji: '✨', color: 0x3b82f6 },
    event: { name: 'Ide Event', emoji: '🎉', color: 0xf43f5e },
    complaint: { name: 'Keluhan', emoji: '😤', color: 0xf59e0b },
    appreciation: { name: 'Apresiasi', emoji: '❤️', color: 0xa855f7 },
    other: { name: 'Lainnya', emoji: '📝', color: 0x6b7280 }
}

export default async function handler(req, res) {
    if (req.method !== 'POST') {
        return res.status(405).json({ success: false, message: 'Method not allowed' })
    }

    try {
        const { nickname, platform, gameMode, category, suggestion } = req.body

        // Validate input
        if (!nickname || !suggestion || !gameMode || !category) {
            return res.status(400).json({
                success: false,
                message: 'Semua field wajib diisi'
            })
        }

        if (suggestion.length < 20) {
            return res.status(400).json({
                success: false,
                message: 'Suggestion minimal 20 karakter'
            })
        }

        // Check if webhook URL is configured
        if (!DISCORD_WEBHOOK_URL) {
            console.error('SUGGESTION_WEBHOOK_URL not configured')
            return res.status(500).json({
                success: false,
                message: 'Webhook tidak dikonfigurasi'
            })
        }

        // Get player avatar from mc-heads
        const avatarUrl = `https://mc-heads.net/avatar/${nickname}/128`

        // Server icon for webhook avatar
        const serverIconUrl = `https://cdn.discordapp.com/icons/1304809491099160580/a_3420e2d90d6e3e2f1fe8cc6f1b4fbb28.gif`

        // Get category info
        const categoryInfo = categoryLabels[category] || categoryLabels.other
        const gameModeLabel = gameModeLabels[gameMode] || 'Unknown'

        // Create Discord embed
        const embed = {
            title: `${categoryInfo.emoji} ${categoryInfo.name} Baru`,
            color: categoryInfo.color,
            thumbnail: {
                url: avatarUrl
            },
            fields: [
                {
                    name: "👤 Nickname",
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
                    name: "📂 Kategori",
                    value: categoryInfo.name,
                    inline: true
                },
                {
                    name: "📝 Isi Feedback",
                    value: suggestion.length > 1000 ? suggestion.substring(0, 1000) + '...' : suggestion,
                    inline: false
                }
            ],
            footer: {
                text: "Kirim saran kamu di trinityindonesia.cc/suggestion",
                icon_url: serverIconUrl
            },
            timestamp: new Date().toISOString(),
            url: "https://trinityindonesia.cc/suggestion"
        }

        // Send to Discord webhook
        const webhookResponse = await fetch(DISCORD_WEBHOOK_URL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                username: "Trinity Indonesia",
                avatar_url: serverIconUrl,
                embeds: [embed]
            })
        })

        if (!webhookResponse.ok) {
            console.error('Discord webhook error:', webhookResponse.status)
            return res.status(500).json({
                success: false,
                message: 'Gagal mengirim ke Discord'
            })
        }

        return res.status(200).json({
            success: true,
            message: 'Suggestion berhasil dikirim'
        })

    } catch (error) {
        console.error('Suggestion API error:', error)
        return res.status(500).json({
            success: false,
            message: 'Internal server error'
        })
    }
}
