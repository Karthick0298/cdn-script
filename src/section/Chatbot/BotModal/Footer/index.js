'use-client'
import React from 'react'
import { motion } from 'framer-motion'
import { makeStyles } from '@material-ui/core'
import { Grid, IconButton, Stack, TextField, Typography } from '@mui/material'
import SendIcon from '@mui/icons-material/Send'
import SentimentSatisfiedOutlinedIcon from '@mui/icons-material/SentimentSatisfiedOutlined'
import { themeConfig } from '../../../../theme/themesConfig'
import Image from 'next/image'
import _ from 'lodash'
import useAuth from '../../../../Utils/Hooks/useAuth'

const useStyles = makeStyles((theme) => ({
	botFooter: {
		background: '#fff',
		height: 114,
		borderRadius: '0px 0px 14px 14px',
	},
	footer: {
		display: 'flex',
		alignItems: 'center',
		padding: '8px 8px',
		borderTop: `1px solid #ccc`,
		borderBottom: `1px solid #ccc`,
	},
	input: {
		flex: 1,
		'& .MuiOutlinedInput-notchedOutline': {
			border: '0px',
		},
		'& .MuiInputBase-input': {
			fontFamily: themeConfig.typography.h5.fontFamily,
		},
	},
	footerTab: {
		height: '60px',
		'& .MuiTypography-subtitle1': {
			fontSize: 10,
			fontFamily: themeConfig.typography.h3.fontFamily,
			color: '#727272',
		},
	},
	activeDot: {
		position: 'absolute',
		top: -3,
		left: '53%',
		transform: 'translateX(-50%)',
		width: '6px',
		height: '6px',
		borderRadius: '50%',
		backgroundColor: '#2E9BFF',
	},
}))

const Footer = (props) => {
	const classes = useStyles()
	const { dynamicTab, setDynamicTab, tabOrder, setTabOrder, sendMsg, setSendMsg, handleClick, keyPress, fetchData } = props
	const { socket } = useAuth()
	return (
		<>
			<Grid
				item
				xs={3}
				className={classes.botFooter}
				sx={{ display: !_.isEqual(tabOrder, 0) && 'flex', justifyContent: 'center', alignItems: 'self-end' }}
			>
				{_.isEqual(tabOrder, 0) && (
					<motion.div className={classes.footer}>
						<IconButton sx={{ padding: '2px' }}>
							<SentimentSatisfiedOutlinedIcon style={{ color: '#ccc' }} />
						</IconButton>
						<motion.div className={classes.input} layout>
							<TextField
								id='fullWidth'
								size='small'
								autoFocus
								autoComplete='off'
								fullWidth
								variant='outlined'
								value={sendMsg}
								disabled={!socket}
								onChange={(e) => setSendMsg(e.target?.value)}
								onKeyDown={(e) => sendMsg && keyPress(e)}
								placeholder={socket ? 'Write here...' : 'Please connect advisor to chat'}
							/>
						</motion.div>
						<motion.div whileTap={{ scale: 0.95 }}>
							<IconButton
								sx={{
									background: themeConfig.palette.lyfngo.primary.main,
									'&:hover': {
										background: themeConfig.palette.lyfngo.primary.main,
									},
									'& .Mui-disabled': {
										backgroundColor: '#ccc',
									},
								}}
								disabled={_.isEmpty(sendMsg)}
								onClick={() => !_.isEmpty(sendMsg) && handleClick()}
								// onClick={() => !_.isEmpty(sendMsg) && fetchData(sendMsg, 1)}
							>
								<SendIcon style={{ color: '#fff' }} />
							</IconButton>
						</motion.div>
					</motion.div>
				)}
				<Grid className={classes.footerTab} container direction={'rows'} alignItems={'center'} alignContent={'center'} textAlign={'center'}>
					<Grid item xs={7.5}>
						<Stack
							direction='row'
							spacing={1}
							sx={{
								justifyContent: 'flex-start',
								paddingInlineStart: 1,
							}}
						>
							<IconButton
								onClick={() => {
									setDynamicTab('chat')
									setTabOrder(0)
								}}
							>
								{tabOrder === 0 && (
									<div
										className={classes.activeDot}
										style={{
											backgroundColor: '#0367DF',
										}}
									/>
								)}
								<Image
									src={
										tabOrder !== 0
											? 'https://ik.imagekit.io/LyfngoDev/Microsite/Chat_unselected.svg'
											: 'https://ik.imagekit.io/LyfngoDev/Microsite/Chat_selected.svg'
									}
									alt={'chat'}
									width='24'
									height='24'
									priority={true}
								/>
							</IconButton>
							<IconButton
								onClick={() => {
									setDynamicTab('wa')
									setTabOrder(1)
								}}
							>
								{tabOrder === 1 && (
									<div
										className={classes.activeDot}
										style={{
											backgroundColor: '#25D366',
										}}
									/>
								)}
								<Image
									src={
										tabOrder !== 1
											? 'https://ik.imagekit.io/LyfngoDev/Microsite/WhatsApp_unselected.svg'
											: 'https://ik.imagekit.io/LyfngoDev/Microsite/WhatsApp_selected.svg'
									}
									alt={'wa'}
									width='24'
									height='24'
									priority={true}
								/>
							</IconButton>
							<IconButton
								onClick={() => {
									setDynamicTab('fb')
									setTabOrder(2)
								}}
							>
								{tabOrder === 2 && (
									<div
										className={classes.activeDot}
										style={{
											backgroundColor: '#3D6AD6',
										}}
									/>
								)}
								<Image
									src={
										tabOrder !== 2
											? 'https://ik.imagekit.io/LyfngoDev/Microsite/Facebook_unselected.svg'
											: 'https://ik.imagekit.io/LyfngoDev/Microsite/Facebook_selected.svg'
									}
									alt={'fb'}
									width='24'
									height='24'
									priority={true}
								/>
							</IconButton>
							<IconButton
								onClick={() => {
									setDynamicTab('email')
									setTabOrder(3)
								}}
							>
								{tabOrder === 3 && <div className={classes.activeDot} />}
								<Image
									src={
										tabOrder !== 3
											? 'https://ik.imagekit.io/LyfngoDev/Microsite/Email_unselected.svg'
											: 'https://ik.imagekit.io/LyfngoDev/Microsite/Email_selected.svg'
									}
									alt={'email'}
									width='24'
									height='24'
									priority={true}
								/>
							</IconButton>
						</Stack>
					</Grid>
					<Grid item xs={4.5} sx={{ display: 'flex', gap: '4px', alignItems: 'center' }}>
						<Typography variant='subtitle1'>Powered by</Typography>
						<Image
							src={
								'https://ik.imagekit.io/LyfngoDev/Microsite/LYFnGO_logo_chatbot.svg?updatedAt=1708516889779&ik-s=45d205156de5a71b15c2e6dde0e6030b4d6bcf08.svg'
							}
							priority={true}
							width={78}
							height={17}
							alt={'LYFnGO'}
						/>
					</Grid>
				</Grid>
			</Grid>
		</>
	)
}

export default Footer
