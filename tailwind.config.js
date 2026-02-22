/** @type {import('tailwindcss').Config} */
module.exports = {
	content: [
		"./pages/**/*.{js,ts,jsx,tsx}",
		"./components/**/*.{js,ts,jsx,tsx}",
	],
	theme: {
		extend: {
			fontFamily: {
				sans: ['Nunito', 'sans-serif']
			},
			colors: {
				brand: {
					50: '#FFF8ED',
					100: '#FFECD2',
					200: '#FFD9A5',
					300: '#FFC678',
					400: '#FFB656',
					500: '#F5A03D',
					600: '#E26E10',
					700: '#C25A0E',
					800: '#9A480C',
					900: '#7A3A0A',
				},
				surface: {
					body: '#e8e0f0',
					card: '#ffffff',
					dark: '#2d2640',
				}
			},
		},
	},
	plugins: [],
}
