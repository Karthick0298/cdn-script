'use-client'
import { makeStyles } from '@material-ui/core'
import { Button } from '@mui/material'
import { motion } from 'framer-motion'
import React from 'react'
import { themeConfig } from '../../../../../../theme/themesConfig'
import useAuth from '../../../../../../Utils/Hooks/useAuth'

const ChatOptions = (props) => {
	const { bookDemo, currentState, cmpName, chatUs, aiChat, loggedInChead } = props
	const { token } = useAuth()
	return (
		<div style={{ display: 'flex', gap: 6, marginLeft: 44 }}>
			{cmpName === 'ChooseChatOption' ? (
				<>
					<motion.div
						whileTap={{ scale: 0.95 }}
						style={{ borderRadius: '16px', overflow: 'hidden', width: '136px', height: '32px', display: 'flex', alignSelf: 'flex-end' }}
					>
						<Button
							sx={{
								width: '136px',
								height: '33px',
								background: themeConfig.palette.lyfngo.primary.main,
								textTransform: 'capitalize',
								color: '#fff',
								padding: 0,
								fontFamily: themeConfig.typography.subtitle1.fontFamily,
								'&:hover': {
									background: themeConfig.palette.lyfngo.primary.main,
								},
								fontSize: themeConfig.typography.subtitle1.fontSize,
							}}
							variant='outlined'
							style={{ borderRadius: '16px' }}
							onClick={bookDemo}
							disabled={currentState[0]?.ChooseChatOption?.bookDemo}
						>
							Book Appointment
						</Button>
					</motion.div>
					<motion.div
						whileTap={{ scale: 0.95 }}
						style={{ borderRadius: '16px', overflow: 'hidden', width: '102px', height: '32px', display: 'flex', alignSelf: 'flex-end' }}
					>
						<Button
							sx={{
								minWidth: '102px',
								height: '33px',
								background: themeConfig.palette.lyfngo.primary.main,
								textTransform: 'capitalize',
								color: '#fff',
								padding: '4px',
								fontFamily: themeConfig.typography.subtitle1.fontFamily,
								'&:hover': {
									background: themeConfig.palette.lyfngo.primary.main,
								},
								fontSize: themeConfig.typography.subtitle1.fontSize,
							}}
							variant='outlined'
							style={{ borderRadius: '16px' }}
							onClick={() => {
								token !== null ? loggedInChead('Advisor') : chatUs('Advisor')
							}}
						>
							Advisor
						</Button>
					</motion.div>
				</>
			) : cmpName === 'Advisor-In-AI' ? (
				<>
					<motion.div
						whileTap={{ scale: 0.95 }}
						style={{ borderRadius: '16px', overflow: 'hidden', width: '102px', height: '32px', display: 'flex', alignSelf: 'flex-end' }}
					>
						<Button
							sx={{
								minWidth: '102px',
								height: '33px',
								background: themeConfig.palette.lyfngo.primary.main,
								textTransform: 'capitalize',
								color: '#fff',
								padding: '4px',
								fontFamily: themeConfig.typography.subtitle1.fontFamily,
								'&:hover': {
									background: themeConfig.palette.lyfngo.primary.main,
								},
								fontSize: themeConfig.typography.subtitle1.fontSize,
							}}
							variant='outlined'
							style={{ borderRadius: '16px' }}
							onClick={() => {
								token !== null ? loggedInChead('Connect') : chatUs('Connect')
							}}
						>
							Connect
						</Button>
					</motion.div>
				</>
			) : (
				<>
					<motion.div
						whileTap={{ scale: 0.95 }}
						style={{ borderRadius: '16px', overflow: 'hidden', width: '85px', height: '32px', display: 'flex', alignSelf: 'flex-end' }}
					>
						<Button
							sx={{
								width: '85px',
								height: '33px',
								background: themeConfig.palette.lyfngo.primary.main,
								textTransform: 'capitalize',
								color: '#fff',
								padding: 0,
								fontFamily: themeConfig.typography.subtitle1.fontFamily,
								'&:hover': {
									background: themeConfig.palette.lyfngo.primary.main,
								},
								fontSize: themeConfig.typography.subtitle1.fontSize,
							}}
							variant='outlined'
							style={{ borderRadius: '16px' }}
							onClick={() => chatUs('Advisor')}
							// disabled={currentState[0]?.ChooseChatOption?.bookDemo}
						>
							Advisor
						</Button>
					</motion.div>
					<motion.div
						whileTap={{ scale: 0.95 }}
						style={{ borderRadius: '16px', overflow: 'hidden', width: '102px', height: '32px', display: 'flex', alignSelf: 'flex-end' }}
					>
						<Button
							sx={{
								minWidth: '102px',
								height: '33px',
								background: themeConfig.palette.lyfngo.primary.main,
								textTransform: 'capitalize',
								color: '#fff',
								padding: '4px',
								fontFamily: themeConfig.typography.subtitle1.fontFamily,
								'&:hover': {
									background: themeConfig.palette.lyfngo.primary.main,
								},
								fontSize: themeConfig.typography.subtitle1.fontSize,
							}}
							variant='outlined'
							style={{ borderRadius: '16px' }}
							onClick={aiChat}
						>
							AI Q&A
						</Button>
					</motion.div>
				</>
			)}
		</div>
	)
}

export default ChatOptions
