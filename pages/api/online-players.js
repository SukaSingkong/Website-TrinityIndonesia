export default async function handler(req, res) {
	try {
		const response = await fetch('http://160.187.210.22:30069/stats.json')
		const data = await response.json()
		
		const onlinePlayers = data.online ? Object.keys(data.online) : []
		
		res.status(200).json({
			count: onlinePlayers.length,
			players: onlinePlayers
		})
	} catch (error) {
		console.error('Failed to fetch online players:', error)
		res.status(200).json({
			count: 0,
			players: []
		})
	}
}
