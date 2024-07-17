import React, { useCallback } from 'react'
import { Button } from '@mui/material'
import { motion } from 'framer-motion'
import { themeConfig } from '../../../../../../theme/themesConfig'
import BotApi from '@/service/BotApi'
import moment from 'moment'
import secureLocalStorage from 'react-secure-storage'
import useAuth from '../../../../../../Utils/Hooks/useAuth'

const TimeSlot = (props) => {
	const { setMessages, saveLoggedChats, availSlot, bookModes, selectedDate, setSelectedDate, domainData, defaultTentuser, setLoading } = props
	const { bot_custUuid, aiSetStatus, setAICount, custUuid } = useAuth()
	const getCurrentTimeIn12HrFormat = () => {
		const now = new Date()
		let hours = now.getHours()
		let minutes = now.getMinutes()
		const amOrPm = hours >= 12 ? 'PM' : 'AM'
		hours = hours % 12 || 12
		minutes = minutes < 10 ? '0' + minutes : minutes
		return `${hours}:${minutes} ${amOrPm}`
	}

	const formatTo12Hour = (time) => {
		const [hours, minutes] = time.split(':').map(Number)
		const period = hours >= 12 ? 'PM' : 'AM'
		const hour12 = hours % 12 || 12
		return `${hour12}:${minutes.toString().padStart(2, '0')} ${period}`
	}

	// Filter slots greater than current time
	const filteredSlots = availSlot?.filter((slot) => {
		const currentTime = getCurrentTimeIn12HrFormat()
		const currentHours = parseInt(currentTime.split(':')[0])
		const currentMinutes = parseInt(currentTime.split(':')[1].split(' ')[0])
		const currentAmPm = currentTime.split(' ')[1]

		const slotHours = parseInt(slot.startTime.split(':')[0])
		const slotMinutes = parseInt(slot.startTime.split(':')[1])
		const slotAmPm = slot.startTime.split(' ')[1]

		if (currentAmPm === 'PM' && slotAmPm === 'AM') {
			return true
		} else if (currentAmPm === 'AM' && slotAmPm === 'PM') {
			return false
		} else {
			if (currentHours === slotHours) {
				return currentMinutes < slotMinutes
			} else {
				return currentHours < slotHours
			}
		}
	})

	const lockSlot = useCallback(
		(selectedSlot, slotData) => {
			aiSetStatus(false)
			secureLocalStorage.setItem('AIstatus', false)
			setAICount(0)
			secureLocalStorage.setItem('AIsentCount', 0)
			let body = {
				apponmintId: 'string',
				startDate: selectedDate,
				endDate: selectedDate,
				startTime: slotData?.startTime,
				endTime: moment(slotData?.startTime, 'hh:mm A').add(slotData?.intervalInMins, 'minutes').format('HH:mm'),
				timezone: domainData?.countryTimezone?.split(' ')?.[2],
				summary: 'b2c',
			}
			setMessages((prevMessages) => [
				...prevMessages,
				{
					name: 'CustSlotSelection',
					type: 'cust',
					jsonType: 'card',
					component: '',
					data: {
						message: selectedSlot,
					},
				},
			])
			// saveLoggedChats([
			// 	{
			// 		name: 'CustSlotSelection',
			// 		type: 'cust',
			// 		jsonType: 'card',
			// 		component: '',
			// 		data: {
			// 			message: selectedSlot,
			// 		},
			// 	},
			// ])
			const onSuccess = (res) => {
				if (res?.data?.status === true) {
					bookDemo(selectedSlot, slotData, res?.data?.data?.meeting_link || '')
				}
			}
			const onFailure = (err) => {
				setMessages((prevMessages) => [
					...prevMessages,
					{
						name: 'meetlinkerror',
						type: 'bot',
						jsonType: 'card',
						component: '',
						data: {
							message: `Internal Error. Try again with the same once ${selectedSlot} or choose other slots from above.`,
						},
					},
				])
				// saveLoggedChats([
				// 	{
				// 		name: 'meetlinkerror',
				// 		type: 'bot',
				// 		jsonType: 'card',
				// 		component: '',
				// 		data: {
				// 			message: `Internal Error. Try again with the same once ${selectedSlot} or choose other slots from above.`,
				// 		},
				// 	},
				// ])
			}
			BotApi.googleMeetingLinkGeneration(body, domainData?.mastTentUuid).then(onSuccess, onFailure)
		},
		// eslint-disable-next-line react-hooks/exhaustive-deps
		[selectedDate]
	)

	const bookDemo = (selectedSlot, slotData, meetLink) => {
		const body = {
			custId: bot_custUuid || custUuid,
			tentUserId: defaultTentuser,
			tentId: domainData?.mastTentUuid,
			apptCatId: '',
			scheduledOn: selectedDate,
			scheduledTime: slotData?.startTime + ':00+05:30',
			scheduledPeriod: slotData?.intervalInMins,
			scheduledPeriodType: 'Mins',
			// specialityId: spec_id,
			plannedProcedure: [],
			notes: '',
			onOff: _.isEqual(bookModes, 'at-clinic') ? '0' : _.isEqual(bookModes, 'on-line') ? '1' : _.isEqual(bookModes, 'at-home') ? '2' : '0',
			totalAppointmentPrice: slotData?.consultantionFees,
			custMail: true,
			custSms: true,
			tentSms: true,
			tentMail: true,
			type: 'BOT',
			appointmentSource: 'b2cbot',
			isPaymentMandatory: slotData?.isPaymentMandatory,
			meetingLink: meetLink || null,
		}
		setLoading(true)
		const onSuccess = () => {
			setLoading(false)
			setMessages((prevMessages) => [
				...prevMessages,
				{
					name: 'SuccessConfirmation',
					type: 'bot',
					jsonType: 'card',
					component: '',
					data: {
						message:
							`Successfully booked your appointment on ${selectedDate} at ${selectedSlot} with ${domainData?.tentName}, For more information please check your appointment list.` +
							(meetLink ? '\n' + meetLink : ''),
					},
				},
				// {
				// 	name: 'MeetingLink',
				// 	type: 'bot',
				// 	jsonType: 'card',
				// 	component: '',
				// 	data: {
				// 		message: meetLink ? meetLink : `Soon you will get the meeting Link feature!`,
				// 	},
				// },
				{
					name: 'bot_msg',
					type: 'bot',
					jsonType: 'card',
					component: '',
					data: {
						message: 'Do like to connect to our advisor? Just a Click Away! 🌟',
					},
				},
				{
					name: 'Advisor-In-AI',
					type: 'bot',
					jsonType: 'NonCard',
					component: '',
					data: {},
				},
				// {
				// 	name: 'AI-Option',
				// 	type: 'bot',
				// 	jsonType: 'card',
				// 	component: '',
				// 	data: {
				// 		message: 'Choose your AI enabled for Q&A or connect with our advisor',
				// 	},
				// },
				// {
				// 	name: 'AdvisorOption',
				// 	type: 'bot',
				// 	jsonType: 'NonCard',
				// 	component: '',
				// 	data: {},
				// },
			])
			// saveLoggedChats([
			// 	{
			// 		name: 'SuccessConfirmation',
			// 		type: 'bot',
			// 		jsonType: 'card',
			// 		component: '',
			// 		data: {
			// 			message: `Successfully booked your demo on ${selectedDate} at ${selectedSlot} with ${domainData?.tentName} `,
			// 		},
			// 	},
			// 	{
			// 		name: 'AI-Option',
			// 		type: 'bot',
			// 		jsonType: 'card',
			// 		component: '',
			// 		data: {
			// 			message: 'Choose your AI enabled for Q&A or connect with our advisor',
			// 		},
			// 	},
			// 	{
			// 		name: 'AdvisorOption',
			// 		type: 'bot',
			// 		jsonType: 'NonCard',
			// 		component: '',
			// 		data: {},
			// 	},
			// ])
			setSelectedDate('')
		}
		const onFailure = () => {
			setLoading(true)
			setMessages((prevMessages) => [
				...prevMessages,
				{
					name: 'addApptErr',
					type: 'bot',
					jsonType: 'card',
					component: '',
					data: {
						message: `Internal Error. Try again with the same once ${selectedSlot} or choose other slots from above.`,
					},
				},
			])
			// saveLoggedChats([
			// 	{
			// 		name: 'addApptErr',
			// 		type: 'bot',
			// 		jsonType: 'card',
			// 		component: '',
			// 		data: {
			// 			message: `Internal Error. Try again with the same once ${selectedSlot} or choose other slots from above.`,
			// 		},
			// 	},
			// ])
		}
		BotApi.bookDemo(body).then(onSuccess, onFailure)
	}

	const renderTimeSlots = () => {
		return filteredSlots.map((slot, index) => (
			<motion.div
				key={index}
				whileTap={{ scale: 0.95 }}
				style={{
					borderRadius: '16px',
					overflow: 'hidden',
					width: '85px',
					height: '32px',
					display: 'flex',
					alignSelf: 'flex-end',
				}}
			>
				<Button
					key={index}
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
					onClick={() => lockSlot(formatTo12Hour(slot?.startTime), slot)}
				>
					{formatTo12Hour(slot?.startTime)}
				</Button>
			</motion.div>
		))
	}

	return <div style={{ display: 'flex', gap: 6, marginLeft: 44, flexWrap: 'wrap' }}>{renderTimeSlots()}</div>
}

export default TimeSlot
