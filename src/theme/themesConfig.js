'use client'
import secureLocalStorage from 'react-secure-storage'
const themeColor = typeof window !== 'undefined' ? localStorage.getItem('themeColor') : null

const themeConfig = {
	palette: {
		lyfngo: {
			light: {
				main: '#FFFFFF',
			},
			primary: {
				main: themeColor,
			},
			secondary: {
				main: '#72C63F',
				light: '#E7FFF0',
			},
			teritory: {
				main: '#E7291D',
				light: '#FFEBDF',
			},
			dark: {
				main: '#212121',
			},
			grey: {
				main: '#727272',
			},
			error: {
				main: 'red',
			},
			paragraph: {
				main: '#475677',
				light: '#7482a6',
				dark: '#1c2d4b',
				contrastText: '#fff',
			},
		},
	},
	typography: {
		h3: {
			fontFamily: 'poppins',
			fontSize: 12,
		},
		h4: {
			fontFamily: 'poppins',
			fontSize: 15,
		},
		h5: {
			fontFamily: 'poppins',
			fontSize: 18,
		},
		h6: {
			fontFamily: 'Poppins',
			fontSize: 24,
		},
		subtitle1: {
			fontSize: 12,
			fontFamily: 'poppins',
		},
	},
}

const updateThemeColor = (newThemeColor) => {
	themeConfig.palette.lyfngo.primary.main = newThemeColor
}
export { themeConfig, updateThemeColor }
