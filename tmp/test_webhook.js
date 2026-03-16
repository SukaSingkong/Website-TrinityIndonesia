const fetch = require('node-fetch');

async function testWebhook() {
    const webhookUrl = process.argv[2];
    if (!webhookUrl) {
        console.error("Usage: node test_webhook.js <WEBHOOK_URL>");
        process.exit(1);
    }

    const title = "Test Patch Update";
    const month_group = "MARCH 2026";
    const type = "added";
    const content = [
        { num: "+", text: "Added Discord Webhook integration via ENV" },
        { num: "+", text: "Improved patch notes visualization" }
    ];

    const color = type === 'added' ? 3066993 : (type === 'removed' ? 15158332 : 3447003);
    
    const embed = {
        title: `📢 New Update: ${title}`,
        description: `Patch notes for **${month_group}** have been updated!`,
        color: color,
        fields: [
            {
                name: "Type",
                value: type.toUpperCase(),
                inline: true
            }
        ],
        timestamp: new Date().toISOString(),
        footer: {
            text: "Trinity Indonesia Updates (Test)"
        }
    };

    if (Array.isArray(content) && content.length > 0) {
        const preview = content.map(c => `${c.num} ${c.text}`).join('\n');
        embed.fields.push({
            name: "Highlights",
            value: preview
        });
    }

    try {
        const response = await fetch(webhookUrl, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                embeds: [embed]
            })
        });

        if (response.ok) {
            console.log("SUCCESS: Webhook sent successfully!");
        } else {
            console.error(`FAILED: ${response.status} ${response.statusText}`);
        }
    } catch (err) {
        console.error("ERROR:", err.message);
    }
}

testWebhook();
