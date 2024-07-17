'use-client'
import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { makeStyles } from '@material-ui/core'
import { Avatar, Box, Button, Grid, Typography } from '@mui/material'
import { v4 as uuidv4 } from 'uuid'
import useAuth from '../../../Utils/Hooks/useAuth'
import { themeConfig } from '../../../theme/themesConfig'
import Header from './Header'
import Footer from './Footer'
import ChatMessages from './ChatMessages'
import EmailTemplate from './Email'
import { encryption } from '../../../Utils/Aes'
import _ from 'lodash'
import secureLocalStorage from 'react-secure-storage'

const useStyles = makeStyles((theme) => ({
	root: {
		padding: '7px 12px 0px',
	},
	headerName: {
		backgroundImage: `url('https://ik.imagekit.io/LyfngoDev/Microsite/chatbot_header.svg')`,
		backgroundRepeat: 'no-repeat',
		backgroundPosition: 'center',
		'& .MuiTypography-h6': {
			fontSize: 15,
			fontFamily: themeConfig.typography.h5.fontFamily,
			color: '#fff',
		},
		'& .MuiTypography-body1': {
			display: 'flex',
			alignItems: 'center',
			justifyContent: 'center',
			fontSize: themeConfig.typography.h3.fontSize,
			fontFamily: themeConfig.typography.h3.fontFamily,
			color: '#fff',
		},
		'& .MuiSvgIcon-root': {
			fontSize: 12,
		},
	},
	botBody: {
		position: 'relative',
		height: 410,
		overflow: 'auto',
		backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='410' height='478' viewBox='0 0 410 478' fill='none'%3E%3Cpath d='M0 10.1283C0 4.18397 5.09977 -0.461525 11.0145 0.130533C43.2301 3.35528 139.153 12.3674 205 12.3674C270.847 12.3674 366.77 3.35527 398.986 0.130531C404.9 -0.461527 410 4.18397 410 10.1283V468C410 473.523 405.523 478 400 478H9.99999C4.47714 478 0 473.523 0 468V10.1283Z' fill='white'/%3E%3C/svg%3E")`,
	},
	messageContainer: {
		padding: '24px 18px',
		position: 'relative',
	},
	textContainer: {
		display: 'flex',
		gap: 4,
		alignItems: 'center',
		marginBottom: 12,
	},
	card: {
		display: 'inline-flex',
		padding: '8px 12px',
		justifyContent: 'center',
		alignItems: 'center',
		gap: 8,
		borderRadius: '0px 8px 8px 8px',
		background: '#ECEEF5',
		'& .MuiTypography-h3': {
			fontSize: themeConfig.typography.h3.fontSize,
			fontFamily: themeConfig.typography.h3.fontFamily,
			fontWeight: 500,
		},
	},
}))

const BotModal = (props) => {
	const {
		toggleModal,
		showModal,
		domainData,
		groupName,
		botNum,
		bot_custUuid,
		bot_cheadId,
		dynamicTab,
		setDynamicTab,
		tabOrder,
		setTabOrder,
		saveLoggedChats,
		onlineStatus,
		sendMsg,
		setOnlinestatus,
		setSendMsg,
		messages,
		setMessages,
	} = props
	const { socket, aiStatus, aiCount, setAICount } = useAuth()
	const classes = useStyles()
	const [loading, setLoading] = useState(false)

	//Send Message
	const apiCall = {
		chead_id: bot_cheadId,
		message: sendMsg,
		sender_id: bot_custUuid,
		sender_type: 'CUST',
		media: null,
		// count: '0',
		is_read: false,
		dup_wamid: uuidv4(),
		isDelivered: true,
		isSeen: false,
		// reply: !_.isEmpty(replyTag)
		// 	? {
		// 			message: replyTag?.message,
		// 			tagType: replyTag?.tagType,
		// 			wamid: replyTag?.wamid,
		// 			media: !_.isEmpty(replyTag?.media)
		// 				? {
		// 						imgName: replyTag?.media?.imgName,
		// 						imgType: replyTag?.media?.imgTage,
		// 				  }
		// 				: {},
		// 	  }
		// 	: {},
		reply: {},
		type: 'micro_bot',
	}

	const sendMessage = (message) => {
		if (socket && socket.readyState === WebSocket.OPEN) {
			let encryptKey = encryption(apiCall)
			socket.send(encryptKey?.plainText + encryptKey?.publicKey)
			setMessages((prevMessages) => [
				...prevMessages,
				{
					name: 'bot_msg',
					type: 'cust',
					jsonType: 'card',
					component: '',
					data: {
						message: message,
					},
				},
			])
			// saveLoggedChats([
			// 	{
			// 		name: 'bot_msg',
			// 		type: 'cust',
			// 		jsonType: 'card',
			// 		component: '',
			// 		data: {
			// 			message: message,
			// 		},
			// 	},
			// ])
		} else {
			console.log('WebSocket is not open. Message not sent.')
		}
	}

	const handleClick = () => {
		if (_.isEqual(aiStatus, true) && apiCall?.message) {
			fetchData(apiCall?.message)
		} else {
			sendMessage(apiCall?.message)
			setSendMsg('')
		}
	}

	const keyPress = (e) => {
		if (e.keyCode === 13 && _.isEqual(aiStatus, true) && apiCall?.message) {
			fetchData(apiCall?.message)
		} else {
			if (e.keyCode === 13 && apiCall?.message) {
				e.preventDefault()
				sendMessage(apiCall?.message)
				setSendMsg('')
			}
		}
	}

	const fetchData = (msg) => {
		setLoading(true)
		const finalCount = aiCount + 1
		const myHeaders = new Headers()
		myHeaders.append('Content-Type', 'application/x-www-form-urlencoded')

		const urlencoded = new URLSearchParams()
		urlencoded.append('question', msg)
		urlencoded.append('refId', 'UUID::' + `${finalCount}`)

		const requestOptions = {
			method: 'POST',
			headers: myHeaders,
			body: urlencoded,
			redirect: 'follow',
		}
		setMessages((prevMessages) => [
			...prevMessages,
			{
				name: 'cust_msg',
				type: 'cust',
				jsonType: 'card',
				component: '',
				data: {
					message: msg,
				},
			},
		])
		// saveLoggedChats([
		// 	{
		// 		name: 'cust_msg',
		// 		type: 'cust',
		// 		jsonType: 'card',
		// 		component: '',
		// 		data: {
		// 			message: msg,
		// 		},
		// 	},
		// ])
		fetch(`https://${process.env.NEXT_PUBLIC_BOT_URL}/chat`, requestOptions)
			.then((response) => response.text())
			.then((data) => {
				setLoading(false)
				setAICount((prevState) => prevState + 1)
				setMessages((prevMessages) => [
					...prevMessages,
					{
						name: 'bot_msg',
						type: 'bot',
						jsonType: 'card',
						component: '',
						data: {
							message: data,
						},
					},
					{
						name: 'bot_msg',
						type: 'bot',
						jsonType: 'card',
						component: '',
						data: {
							message: 'Expert Health Advisor. Just a Click Away! 🌟',
						},
					},
					{
						name: 'Advisor-In-AI',
						type: 'bot',
						jsonType: 'NonCard',
						component: '',
						data: {},
					},
				])
				// saveLoggedChats([
				// 	{
				// 		name: 'bot_msg',
				// 		type: 'bot',
				// 		jsonType: 'card',
				// 		component: '',
				// 		data: {
				// 			message: data,
				// 		},
				// 	},
				// 	{
				// 		name: 'bot_msg',
				// 		type: 'bot',
				// 		jsonType: 'card',
				// 		component: '',
				// 		data: {
				// 			message: 'Expert Health Advisor. Just a Click Away! 🌟',
				// 		},
				// 	},
				// 	{
				// 		name: 'Advisor-In-AI',
				// 		type: 'bot',
				// 		jsonType: 'NonCard',
				// 		component: '',
				// 		data: {},
				// 	},
				// ])
				secureLocalStorage.setItem('AIsentCount', aiCount)
			})
			.catch((error) => {
				setLoading(false)
				console.error('Error:', error)
			})
		setSendMsg('')
	}

	return (
		<AnimatePresence>
			<motion.div
				style={{
					position: 'fixed',
					bottom: 0,
					right: 0,
					width: '100%',
					height: '100%',
					background: 'rgba(0, 0, 0, 0.5)',
					boxShadow: '0px 2px 17px 0px rgba(0, 0, 0, 0.25)',
					zIndex: 999,
					display: 'flex',
					alignItems: 'flex-end',
					justifyContent: 'flex-end',
					overflow: 'hidden',
				}}
				initial={{ opacity: 0 }}
				animate={{ opacity: 1 }}
				exit={{ opacity: 0 }}
			>
				<motion.div
					style={{
						width: '410px',
						height: '600px',
						borderRadius: '14px',
						background: themeConfig.palette.lyfngo.primary.main,
						marginBottom: '20px',
						marginRight: '18px',
						boxShadow: '0px 2px 17px 0px rgba(0, 0, 0, 0.25)',
					}}
					initial={{ scale: 0, opacity: 0 }}
					animate={{ scale: 1, opacity: 1 }}
					transition={{ type: 'spring', stiffness: 300, damping: 20 }}
				>
					<Header domainData={domainData} toggleModal={toggleModal} groupName={groupName} />
					<Grid container direction={'column'} sx={{ padding: 0, display: 'block' }} gap={'4px'}>
						<Grid item xs={7} className={classes.botBody} id='msgChatBot'>
							{_.isEqual(tabOrder, 0) ? (
								<ChatMessages
									domainData={domainData}
									groupName={groupName}
									botNum={botNum}
									showModal={showModal}
									bot_cheadId={bot_cheadId}
									bot_custUuid={bot_custUuid}
									loading={loading}
									setLoading={setLoading}
									socket={socket}
									// saveLoggedChats={saveLoggedChats}
									messages={messages}
									setMessages={setMessages}
								/>
							) : _.isEqual(tabOrder, 1) ? (
								<WhatsApp />
							) : _.isEqual(tabOrder, 2) ? (
								<Facebook />
							) : (
								<EmailTemplate domainData={domainData} />
							)}
						</Grid>
					</Grid>
					<Footer
						dynamicTab={dynamicTab}
						setDynamicTab={setDynamicTab}
						tabOrder={tabOrder}
						setTabOrder={setTabOrder}
						sendMsg={sendMsg}
						setSendMsg={setSendMsg}
						loading={loading}
						handleClick={handleClick}
						keyPress={keyPress}
						fetchData={fetchData}
					/>
				</motion.div>
			</motion.div>
		</AnimatePresence>
	)
}

const WhatsApp = () => {
	const classes = useStyles()
	return (
		<Box>
			<Grid container direction='column' position={'relative'} className={classes.messageContainer} id='msgChatBot'>
				<motion.div
					initial={{ opacity: 0, y: 20 }}
					animate={{ opacity: 1, y: 0 }}
					transition={{ duration: 0.5, delay: 0.1 }}
					className={classes.textContainer}
					style={{ flexDirection: 'row', position: 'absolute', width: '90%' }}
				>
					<Avatar className={classes.avatar} src={'https://ik.imagekit.io/LyfngoDev/Microsite/WhatsApp_selected.svg'} />
					<div className={classes.card}>
						<Typography variant='h3'>
							Reach us on WhatsApp! Start a conversation using the button below and we try to reply soon as possible
						</Typography>
					</div>
				</motion.div>
			</Grid>
			<motion.div
				initial={{ opacity: 0 }}
				animate={{ opacity: 1 }}
				transition={{ duration: 0.5, delay: 0.3 }}
				className={classes.textContainer}
				style={{ dispaly: 'flex', justifyContent: 'center', width: '100%', position: 'absolute', bottom: 0 }}
			>
				<motion.div whileTap={{ scale: 0.95 }}>
					<Button
						onClick={() => window.open('https://api.whatsapp.com/send/?phone=918110071900&text=Hello!', '_blank')}
						sx={{
							display: 'flex',
							alignItems: 'center',
							justifyContent: 'center',
							gap: 1,
							background: '#25D366',
							textTransform: 'capitalize',
							color: '#fff',
							borderRadius: 50,
							paddingInline: 3,
							fontSize: themeConfig.typography.subtitle1.fontSize,
							fontFamily: themeConfig.typography.subtitle1.fontFamily,
							'&:hover': {
								background: '#25D366',
							},
						}}
					>
						<Avatar
							className={classes.avatar}
							style={{ width: 24, height: 24 }}
							src={'https://ik.imagekit.io/LyfngoDev/Microsite/WhatsApp_selected.svg'}
						/>
						<span>Chat Via Whatsapp</span>
					</Button>
				</motion.div>
			</motion.div>
		</Box>
	)
}

const Facebook = () => {
	const classes = useStyles()
	return (
		<Box>
			<Grid container direction='column' position={'relative'} className={classes.messageContainer} id='msgChatBot'>
				<motion.div
					initial={{ opacity: 0, y: 20 }}
					animate={{ opacity: 1, y: 0 }}
					transition={{ duration: 0.5, delay: 0.1 }}
					className={classes.textContainer}
					style={{ flexDirection: 'row', position: 'absolute', width: '90%' }}
				>
					<Avatar className={classes.avatar} src={'https://ik.imagekit.io/LyfngoDev/Microsite/Facebook_selected.svg'} />
					<div className={classes.card}>
						<Typography variant='h3'>
							Reach us on Facebook! Start a conversation using the button below and we will try to reply as soon as possible.
						</Typography>
					</div>
				</motion.div>
			</Grid>
			<motion.div
				initial={{ opacity: 0 }}
				animate={{ opacity: 1 }}
				transition={{ duration: 0.5, delay: 0.3 }}
				className={classes.textContainer}
				style={{ display: 'flex', justifyContent: 'center', width: '100%', position: 'absolute', bottom: 0 }}
			>
				<motion.div whileTap={{ scale: 0.95 }}>
					<Button
						onClick={() => window.open('https://www.facebook.com/lyfngo.official', '_blank')}
						sx={{
							display: 'flex',
							alignItems: 'center',
							justifyContent: 'center',
							gap: 1,
							background: '#3D6AD6',
							textTransform: 'capitalize',
							color: '#fff',
							borderRadius: 50,
							paddingInline: 3,
							fontSize: themeConfig.typography.subtitle1.fontSize,
							fontFamily: themeConfig.typography.subtitle1.fontFamily,
							'&:hover': {
								background: '#3D6AD6',
								opacity: 0.8,
							},
						}}
					>
						<span>Open Facebook</span>
					</Button>
				</motion.div>
			</motion.div>
		</Box>
	)
}
export default BotModal
