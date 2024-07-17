import { motion } from 'framer-motion'
import Image from 'next/image'
import React, { useState, useEffect } from 'react'
import BotModal from './BotModal'
import useAuth from '../../Utils/Hooks/useAuth'
import { v4 as uuidv4 } from 'uuid'
import ReconnectingWebSocket from 'reconnecting-websocket'
import { decryption, encryption } from '../../Utils/Aes'
import secureLocalStorage from 'react-secure-storage'

function Chatbot() {
	const [isHovered, setIsHovered] = useState(false)
	const [showButton, setShowButton] = useState(false)
	const [showDivs, setShowDivs] = useState(false)
	const [showCard, setShowCard] = useState(true)
	const [showModal, setShowModal] = useState(false)
	const [dynamicTab, setDynamicTab] = useState('Chat')
	const [tabOrder, setTabOrder] = useState(0)
	const [onlineStatus, setOnlinestatus] = useState(false)
	const [sendMsg, setSendMsg] = useState(null)
	const [messages, setMessages] = useState([])
	const [count, setCount] = useState(0)

	useEffect(() => {
		setTimeout(() => {
			setShowButton(true)
			setTimeout(() => {
				setShowDivs(true)
			}, 500)
		}, 2000)

		const isCardClosed = localStorage.getItem('isCardClosed')
		setShowCard(isCardClosed !== 'true')
	}, [])

	const toggleCardVisibility = () => {
		setShowCard(!showCard)
		localStorage.setItem('isCardClosed', !showCard)
	}

	const toggleModal = () => {
		setShowModal(!showModal)
		localStorage.setItem('typoStop', !showModal)
	}

	const buttonVariants = {
		hidden: {
			opacity: 0,
			scale: 0.8,
		},
		visible: {
			opacity: 1,
			scale: 1,
			transition: {
				ease: 'easeOut',
				duration: 0.5,
			},
		},
		hover: {
			scale: 1.1,
			transition: {
				yoyo: Infinity,
				duration: 0.3,
			},
		},
	}

	const divVariants = {
		hidden: { scale: 0.1 },
		visible: { scale: 1 },
		hover: { scale: 1.1 },
	}

	const cardVariants = {
		hidden: {
			opacity: 0,
			y: -100,
		},
		visible: {
			opacity: 1,
			y: 0,
			transition: {
				type: 'spring',
				damping: 10,
				stiffness: 100,
				duration: 1,
			},
		},
	}
	const { custName, domainData, bot_custUuid, bot_cheadId, botNum, groupName, ready, setReady, socket, setSocket } = useAuth()


	// Media & Message socket connection
	useEffect(() => {
		if (bot_cheadId && ready) {
			const ws = new ReconnectingWebSocket(`${process.env.NEXT_PUBLIC_SOCKET_CONNECTION + bot_cheadId}`)
			ws.debug = true
			ws.timeoutInterval = 3000
			ws.maxRetries = 4
			ws.onopen = (event) => {
				// if (event?.currentTarget?.readyState === 1) {
				setOnlinestatus(true)
				// let encryptKey = encryption(apiCall)
				// ws.send(encryptKey?.plainText + encryptKey?.publicKey)
				// setMessages((prevMessages) => [
				// 	...prevMessages,
				// 	{
				// 		name: 'bot_msg',
				// 		type: 'cust',
				// 		jsonType: 'card',
				// 		component: '',
				// 		data: {
				// 			message: apiCall?.message,
				// 		},
				// 	},
				// ])
				console.log('Websocket connected')
				// } else {
				// 	window.alert('waiting for connection')
				// 	setOnlinestatus(true)
				// }
			}
			ws.onerror = function (error) {
				ws.onclose = (event) => {
					setOnlinestatus(false)
					// console.log('The connection has been closed successfully.', error)
				}
			}
			ws.onclose = (event) => {
				setOnlinestatus(false)
				// console.log('The connection has been closed successfully.', event)
			}
			setSocket(ws)
			secureLocalStorage.setItem('socketstatus', ws)
			return () => {
				if (socket) {
					ws.close()
					setSocket(null)
				}
			}
		}
	}, [bot_cheadId, ready])

	// Receive message
	useEffect(() => {
		if (socket) {
			socket.onmessage = function (event) {
				const json = event?.data
				const plainText = json.slice(0, -16)
				const ivKey = json.slice(-16)
				let decryptedJson = decryption(plainText, ivKey)
				try {
					if ((decryptedJson.event = 'data' && decryptedJson?.chead_id === bot_cheadId)) {
						// txtStatus && decryptedJson?.sender_type === 'TENT' && seenTxtMerge(decryptedJson)
						if (!_.isEmpty(decryptedJson?.message)) {
							!showModal && setCount(decryptedJson?.count)
							setMessages((prevMessages) => [
								...prevMessages,
								{
									name: 'Specialist_text',
									type: 'bot',
									jsonType: 'card',
									component: '',
									data: {
										message: decryptedJson?.message,
									},
								},
							])
							// const chatState = { messages }
							// console.log('mainState', chatState)
							// localStorage.setItem('chatState', JSON.stringify(chatState))
						}
					}
				} catch (err) {
					console.log(err)
				}
			}
		}
	}, [bot_cheadId, showModal, socket])

	//Logged user data save
	// const saveLoggedChats = (data) => {
	// 	const onSuccess = () => {}
	// 	const onFailure = () => {}
	// 	BotApi.postUserChats(data).then(onSuccess, onFailure)
	// }

	// Update local storage whenever messages state changes
	useEffect(() => {
		if (!_.isEmpty(messages)) {
			const chatState = { messages: messages }
			localStorage.setItem('chatState', JSON.stringify(chatState))
		}
	}, [messages])

	// useEffect(() => {
	// 	if (token !== null) {
	// 		setMessages([])
	// 	}
	// }, [token])

	useEffect(() => {
		if (custName === null) {
			setMessages([])
		}
	}, [custName])

	return (
		<>
			{/* {showCard && (
				<motion.div
					style={{
						position: 'fixed',
						bottom: '64px',
						right: '98px',
						border: '1px solid #0062DD',
						marginRight: 12,
						borderRadius: '13px',
						background: '#FFF',
						boxShadow: '0px 0px 9px 0px rgba(0, 0, 0, 0.25)',
						width: '199px',
						height: '70px',
						padding: '10px',
						color: '#000',
						fontFamily: 'Poppins',
						fontSize: '14px',
						fontStyle: 'normal',
						fontWeight: 400,
						lineHeight: 'normal',
						zIndex: 2,
					}}
					variants={cardVariants}
					initial='hidden'
					animate='visible'
				>
					<button
						style={{
							background: 'linear-gradient(180deg, #0062DD, #2EB2FF)',
							border: 'none',
							borderRadius: '50%',
							width: '24px',
							height: '24px',
							display: 'flex',
							alignItems: 'center',
							justifyContent: 'center',
							cursor: 'pointer',
							position: 'absolute',
							top: '-30px',
							left: 0,
						}}
						onClick={toggleCardVisibility}
					>
						<svg
							xmlns='http://www.w3.org/2000/svg'
							width='14'
							height='14'
							viewBox='0 0 24 24'
							fill='none'
							stroke='#FFFFFF'
							strokeWidth='2'
							strokeLinecap='round'
							strokeLinejoin='round'
							className='feather feather-x'
						>
							<line x1='18' y1='6' x2='6' y2='18'></line>
							<line x1='6' y1='6' x2='18' y2='18'></line>
						</svg>
					</button>
					<span>Ready to get started? Your AI is here.</span>
				</motion.div>
			)} */}

			{showButton && (
				<motion.button
					style={{
						display: 'flex',
						alignItems: 'center',
						justifyContent: 'center',
						border: 0,
						width: 68,
						height: 68,
						background: 'linear-gradient(180deg, #0062DD, #2EB2FF)',
						borderRadius: '50%',
						padding: '12px',
						position: 'fixed',
						bottom: '64px',
						right: '30px',
						cursor: 'pointer',
					}}
					variants={buttonVariants}
					initial='hidden'
					animate='visible'
					whileHover='hover'
					onClick={() => setShowModal(true)}
					onMouseEnter={() => setIsHovered(true)}
					onMouseLeave={() => setIsHovered(false)}
				>
					{showDivs && (
						<>
							<motion.div
								style={{
									width: 16,
									height: 16,
									background: 'linear-gradient(180deg, #0062DD, #2EB2FF)',
									borderRadius: '50%',
									position: 'absolute',
									bottom: '56px',
									right: '-8px',
								}}
								variants={divVariants}
								initial='hidden'
								animate='visible'
								whileHover='hover'
							/>
							<motion.div
								style={{
									width: 7,
									height: 7,
									background: 'linear-gradient(180deg, #0062DD, #2EB2FF)',
									borderRadius: '50%',
									position: 'absolute',
									bottom: '70px',
									right: '-14px',
								}}
								variants={divVariants}
								initial='hidden'
								animate='visible'
								whileHover='hover'
							/>
						</>
					)}
					<Image src={'https://ik.imagekit.io/LyfngoDev/Microsite/Floating_icon.svg'} alt='micro-bot' width={40} height={40} priority />
				</motion.button>
			)}

			{showModal && (
				<BotModal
					toggleModal={toggleModal}
					showModal={showModal}
					domainData={domainData}
					groupName={groupName}
					botNum={botNum}
					bot_custUuid={bot_custUuid}
					bot_cheadId={bot_cheadId}
					dynamicTab={dynamicTab}
					setDynamicTab={setDynamicTab}
					tabOrder={tabOrder}
					setTabOrder={setTabOrder}
					onlineStatus={onlineStatus}
					// saveLoggedChats={saveLoggedChats}
					sendMsg={sendMsg}
					setOnlinestatus={setOnlinestatus}
					setSendMsg={setSendMsg}
					messages={messages}
					setMessages={setMessages}
				/>
			)}
		</>
	)
}

export default Chatbot
