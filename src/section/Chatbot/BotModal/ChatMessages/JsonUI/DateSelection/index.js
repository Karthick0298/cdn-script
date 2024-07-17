'use-client'
import React, { useCallback, useState } from 'react'
import { makeStyles } from '@material-ui/core'
import BotApi from '@/service/BotApi'

const useStyles = makeStyles((theme) => ({
	input: {
		fontFamily: 'Poppins, sans-serif',
		borderRadius: '5px',
		border: '1px solid #ccc',
		boxShadow: '0 0 5px rgba(0, 0, 0, 0.1)',
		padding: '8px',
		outline: 'none',
		boxSizing: 'border-box',
	},
	inputFocused: {
		borderColor: 'dodgerblue',
	},
}))

const DateSelection = (props) => {
	const {
		setMessages,
		saveLoggedChats,
		bookModes,
		availSlot,
		setAvailslot,
		defaultTentuser,
		domainData,
		setCurrentState,
		selectedDate,
		setSelectedDate,
		setLoading,
	} = props
	const classes = useStyles()
	const handleDateChange = useCallback(
		(event) => {
			setSelectedDate(event.target.value)
			setLoading(true)
			const onSuccess = (res) => {
				if (res?.data?.status === 'success') {
					setLoading(false)
					const availableslot = res?.data?.data
					if (!_.isEmpty(availableslot)) {
						setAvailslot(availableslot)
						setMessages((prevMessages) => [
							...prevMessages,
							{
								name: 'ChosenDate',
								type: 'cust',
								jsonType: 'card',
								component: '',
								data: {
									message: event.target.value,
								},
							},
							{
								name: 'TimeSlotView',
								type: 'bot',
								jsonType: 'card',
								component: '',
								data: {
									message: 'Certainly! Please select your desired appointment time ⏰',
								},
							},
							{
								name: 'SlotSelection',
								type: 'bot',
								jsonType: 'NonCard',
								component: availSlot,
								data: {},
							},
						])
						// saveLoggedChats([
						// 	{
						// 		name: 'ChosenDate',
						// 		type: 'cust',
						// 		jsonType: 'card',
						// 		component: '',
						// 		data: {
						// 			message: event.target.value,
						// 		},
						// 	},
						// 	{
						// 		name: 'TimeSlotView',
						// 		type: 'bot',
						// 		jsonType: 'card',
						// 		component: '',
						// 		data: {
						// 			message: 'Certainly! Please select your desired appointment time ⏰',
						// 		},
						// 	},
						// 	{
						// 		name: 'SlotSelection',
						// 		type: 'bot',
						// 		jsonType: 'NonCard',
						// 		component: availSlot,
						// 		data: {},
						// 	},
						// ])
						// setCurrentState((prevState) => {
						// 	const newState = [...prevState]
						// 	const updatedObject = { ...newState[0] }
						// 	updatedObject.demoDate = [...updatedObject.demoDate, event.target.value]
						// 	newState[0] = updatedObject
						// 	return newState
						// })
					} else {
						// setSelectedDate('')
						setAvailslot([])
						setMessages((prevMessages) => [
							...prevMessages,
							{
								name: 'ChosenDate',
								type: 'cust',
								jsonType: 'card',
								component: '',
								data: {
									message: event.target.value,
								},
							},
							{
								name: 'TimeSlotView',
								type: 'bot',
								jsonType: 'card',
								component: '',
								data: {
									message: `Slot's not available on the date ${event.target.value} please choose other`,
								},
							},
							{
								name: 'DateSelection',
								type: 'bot',
								jsonType: 'NonCard',
								component: '',
								data: {},
							},
						])
						// saveLoggedChats([
						// 	{
						// 		name: 'ChosenDate',
						// 		type: 'cust',
						// 		jsonType: 'card',
						// 		component: '',
						// 		data: {
						// 			message: event.target.value,
						// 		},
						// 	},
						// 	{
						// 		name: 'TimeSlotView',
						// 		type: 'bot',
						// 		jsonType: 'card',
						// 		component: '',
						// 		data: {
						// 			message: `Slot's not available on the date ${event.target.value} please choose other`,
						// 		},
						// 	},
						// 	{
						// 		name: 'DateSelection',
						// 		type: 'bot',
						// 		jsonType: 'NonCard',
						// 		component: '',
						// 		data: {},
						// 	},
						// ])
					}
				}
			}
			const onFailure = (err) => {
				console.log(err)
				setMessages((prevMessages) => [
					...prevMessages,
					{
						name: 'ChosenDate',
						type: 'cust',
						jsonType: 'card',
						component: '',
						data: {
							message: 'Internal Error. Please try again or choose other dates.',
						},
					},
					{
						name: 'DateSelection',
						type: 'bot',
						jsonType: 'NonCard',
						component: '',
						data: {},
					},
				])
			}
			BotApi.getSlot({
				tentId: domainData?.mastTentUuid,
				appointmentMode: bookModes,
				scheduledOn: event.target?.value,
				tentUserId: defaultTentuser,
			}).then(onSuccess, onFailure)
		},
		[availSlot, bookModes, defaultTentuser, domainData?.mastTentUuid, setAvailslot, setMessages]
	)

	return (
		<div style={{ marginLeft: 44 }}>
			<input
				type='date'
				id='date'
				name='date'
				min={new Date().toISOString().split('T')[0]}
				max='9999-12-31'
				value={selectedDate}
				onChange={handleDateChange}
				className={classes.input}
				onFocus={(e) => e.target.classList.add(classes.inputFocused)}
				onBlur={(e) => e.target.classList.remove(classes.inputFocused)}
			/>
		</div>
	)
}

export default DateSelection
