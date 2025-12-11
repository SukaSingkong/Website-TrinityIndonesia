/** @type {import('tailwindcss').Config} */
module.exports = {
	content: [
		"./pages/**/*.{js,ts,jsx,tsx}",
		"./components/**/*.{js,ts,jsx,tsx}",
	],
	theme: {
		extend: {
			fontFamily: {
				sans: ['Space Grotesk', 'Inter', 'sans-serif']
			},
			colors: {
				// Primary brand red - softer, more elegant
				brand: {
					50: '#fef2f2',
					100: '#fee2e2',
					200: '#fecaca',
					300: '#fca5a5',
					400: '#f87171',
					500: '#ef4444',
					600: '#dc2626',
					700: '#b91c1c',
					800: '#991b1b',
					900: '#7f1d1d',
				},
				// Accent - warm rose gold for highlights
				accent: {
					light: '#fda4af',
					DEFAULT: '#fb7185',
					dark: '#e11d48',
				},
				// Surface colors - warm slate for backgrounds
				surface: {
					900: '#0f172a',
					800: '#1e293b',
					700: '#334155',
					600: '#475569',
				}
			},
		},
	},
	plugins: [
		require("@tailwindcss/forms")({
			strategy: 'class'
		}),
		require('@tailwindcss/typography'),
	],
}
