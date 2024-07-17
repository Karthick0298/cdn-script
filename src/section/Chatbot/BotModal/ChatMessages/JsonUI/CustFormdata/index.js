'use-client'
import React, { useState, useEffect } from 'react'
import { makeStyles } from '@material-ui/core'
import { Autocomplete, Button, Checkbox, InputAdornment, MenuItem, Popper, Select, TextField, Typography } from '@mui/material'
import { motion } from 'framer-motion'
import { themeConfig } from '../../../../../../theme/themesConfig'
import BotApi from '../../../../../../service/BotApi'
import useAuth from '../../../../../../Utils/Hooks/useAuth'
import secureLocalStorage from 'react-secure-storage'
// import { toast } from 'react-toastify'
import Axios from 'axios'

const useStyles = makeStyles((theme) => ({
	input: {
		background: '#fff',
		borderRadius: 18,
		'& .MuiOutlinedInput-notchedOutline': {
			border: '0px',
		},
		'& .MuiInputBase-root': {
			fontSize: themeConfig.typography.subtitle1.fontSize,
			fontFamily: themeConfig.typography.subtitle1.fontFamily,
			height: 40,
			borderRadius: '18px',
			background: '#fff',
		},
	},
	container: {
		display: 'flex',
		width:'100%',
		'& .MuiInputBase-root': {
			fontSize: themeConfig.typography.subtitle1.fontSize,
			fontFamily: themeConfig.typography.subtitle1.fontFamily,
			height: 40,
			borderRadius: '0 18px 18px 0px',
			background: '#fff',
		},
		'& .MuiAutocomplete-inputRoot': {
			borderRadius: '20px 0px 0px 20px !important',
			paddingBlock: 10,
			border: '0px !important',
		},
		'& .MuiAutocomplete-input': {
			textOverflow: 'initial',
		},
		'& .MuiInputBase-input': {
			fontSize: 14,
		},
		'& .MuiFormHelperText-contained': {
			[theme.breakpoints.up('xs')]: {
				marginLeft: -66,
			},
			[theme.breakpoints.up('sm')]: {
				marginLeft: 14,
			},
		},
	},
	popper: {
		zIndex: 99999,
		'& .MuiAutoComplete-option': {
			fontSize: 12,
			paddingLeft: 2,
			paddingRight: 2,
			paddingInline: 2,
		},
	},
	autoCompleteRoot: {
		width: 112,
		'& .MuiInput-underline:after': {
			borderBottom: 'none',
		},
		'& .MuiInputBase-input': {
			fontSize: 12,
			fontFamily: themeConfig.typography.h6.fontFamily,
			fontWeight: 400,
		},
	},
	popperStyle: {
		zIndex: 99999,
		// minWidth: 120,
		'& .MuiAutocomplete-listbox': {
			background: '#fff',
		},
	},
}))

const CustFormdata = (props) => {
	const { token, domainData, setBotCustId, setBotCheadId, botName, setBotName, botNum, setBotNum, aiSetStatus, custName, mobileNumber } = useAuth()
	const {
		setMessages,
		saveLoggedChats,
		moblen,
		setMoblen,
		setCurrentState,
		currentState = [{ NameMobileForm: {} }],
		register,
		handleSubmit,
		errors,
		reset,
		loading,
		setLoading,
	} = props
	const [formData, setFormData] = useState({
		name: currentState[0]?.NameMobileForm?.name || '',
		phoneNum: currentState[0]?.NameMobileForm?.mobile || '',
		terms: currentState[0]?.NameMobileForm?.terms || false,
	})
	const classes = useStyles()
	const [country, setCountry] = useState(null)
	const [countryCode, setcountryCode] = useState([])
	const [ipCode, setIpCode] = useState(null)

	const getLocationDetails = async () => {
		const res = await Axios.get('https://ipapi.co/json/')
		setIpCode(res?.data?.country_calling_code)
		secureLocalStorage.setItem('countryCodeIp', res?.data?.country_calling_code)
		// setCountryCodeLength(parseInt(code?.mastLookupValue))
	}
	useEffect(() => {
		getLocationDetails()
	}, [])

	const getDialCodeDetails = () => {
		const onSuccess = (res) => {
			if (res?.data?.status === true) {
				const code = _.orderBy(res?.data?.data, 'mastLookupKey', 'desc')
				setcountryCode(code)
			}
		}
		const onFailure = (err) => {
			console.log('error', err)
		}
		BotApi.CountryCodeGet().then(onSuccess, onFailure)
	}

	useEffect(() => {
		getDialCodeDetails()
	}, [])

	useEffect(() => {
		if (!_.isEmpty(countryCode, ipCode)) {
			let findCountry = ipCode || secureLocalStorage?.getItem('countryCodeIp')
			let temp = findCountry?.slice(1)
			let initialCountryCode = _.find(countryCode, { mastLookupKey: temp })
			setMoblen(initialCountryCode?.mastLookupValue)
			setCountry(initialCountryCode)
		}
	}, [countryCode, ipCode])

	const str = '+'

	const CustomPopper = function (props) {
		return <Popper {...props} className={classes.popperStyle} placement='bottom-start' />
	}

	const handleFormSubmit = (data) => {
		const body = {
			Name: data?.name,
			Phone: '+' + country?.mastLookupKey + data?.phoneNum,
			Type: 'micro_bot',
			MastTentUuid: domainData?.mastTentUuid,
			// terms: data?.terms,
			custUuid: null,
		}
		setLoading(true)
		const onSuccess = (res) => {
			setLoading(false)
			aiSetStatus(false)
			secureLocalStorage.setItem('AIstatus', false)
			localStorage.setItem('chatStateTime', new Date().getTime())
			secureLocalStorage.setItem('botName', data?.name)
			setBotName(data?.name)
			secureLocalStorage.setItem('botNum', data?.phoneNum)
			setBotNum(data?.phoneNum)
			localStorage.setItem('bot_custUuid', res?.data?.data?.cust_uuid)
			setBotCustId(res?.data?.data?.cust_uuid)
			localStorage.setItem('bot_cheadId', res?.data?.data?.chead_id)
			setBotCheadId(res?.data?.data?.chead_id)
			setMessages((prevMessages) => [
				...prevMessages,
				{
					name: 'OptionSelection',
					type: 'bot',
					jsonType: 'card',
					component: '',
					data: {
						message: 'Thank you for provided details',
					},
				},
				{
					name: 'ChooseChatOption',
					type: 'bot',
					jsonType: 'NonCard',
					component: 'ChatOption',
					data: {},
				},
				// {
				// 	name: 'AI-Option',
				// 	type: 'bot',
				// 	jsonType: 'card',
				// 	component: '',
				// 	data: {
				// 		message: `Discover Health Insights with Kauvery's AI Assistant!`,
				// 	},
				// },
				// {
				// 	name: 'bot_msg',
				// 	type: 'bot',
				// 	jsonType: 'card',
				// 	component: '',
				// 	data: {
				// 		message: `How can I help you today!`,
				// 	},
				// },
				// {
				// 	name: 'bot_msg',
				// 	type: 'bot',
				// 	jsonType: 'card',
				// 	component: '',
				// 	data: {
				// 		message: 'Expert Health Advisor. Just a Click Away! 🌟',
				// 	},
				// },
				// {
				// 	name: 'Advisor-In-AI',
				// 	type: 'bot',
				// 	jsonType: 'NonCard',
				// 	component: '',
				// 	data: {},
				// },
				// {
				// 	name: 'AdvisorOption',
				// 	type: 'bot',
				// 	jsonType: 'NonCard',
				// 	component: '',
				// 	data: {},
				// },
			])
			setCurrentState((prevState) => [
				{
					...prevState[0],
					NameMobileForm: {
						...prevState[0]?.NameMobileForm,
						name: data?.name,
						mobile: data?.phoneNum,
						country: str + country?.mastLookupKey,
					},
				},
			])
			// reset()
		}
		const onFailure = (err) => {
			setLoading(false)
			setMessages((prevMessages) => [
				...prevMessages,
				{
					name: 'OptionSelection',
					type: 'bot',
					jsonType: 'card',
					component: '',
					data: {
						message: 'Internal Error. Please try again.',
					},
				},
			])
			setCurrentState((prevState) => [
				{
					...prevState[0],
					NameMobileForm: {
						...prevState[0]?.NameMobileForm,
						name: data?.name,
						mobile: data?.phoneNum,
						country: str + country?.mastLookupKey,
					},
				},
			])
			reset()
		}
		BotApi.getLeadDetails(body).then(onSuccess, onFailure)
	}

	return (
		<div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
			<Typography
				variant='subtitle1'
				sx={{
					fontSize: themeConfig.typography.subtitle1.fontSize,
					fontFamily: themeConfig.typography.subtitle1.fontFamily,
					fontWeight: 500,
				}}
			>
				Please enter the details
			</Typography>
			<form onSubmit={() => handleSubmit(handleFormSubmit)} style={{ display: 'flex', alignItems: 'center', gap: 8, flexDirection: 'column' }}>
				<TextField
					id='fullWidth'
					size='small'
					autoFocus
					autoComplete='off'
					fullWidth
					className={classes.input}
					variant='outlined'
					{...register('name')}
					value={botName || custName}
					error={!!errors.name}
					disabled={botNum || token}
					helperText={errors.name?.message}
					InputProps={{
						startAdornment: (
							<InputAdornment position='start'>
								<Typography
									variant='subtitle1'
									sx={{
										fontSize: themeConfig.typography.subtitle1.fontSize,
										fontFamily: themeConfig.typography.subtitle1.fontFamily,
										fontWeight: 500,
									}}
								>
									Name
								</Typography>
							</InputAdornment>
						),
					}}
				/>
				<div className={classes.container}>
					<Autocomplete
						// loading={loading}
						loadingText='Loading..'
						ListboxProps={{
							style: {
								maxHeight: '12rem',
								fontSize: 14,
								fontFamily: ['"Poppins"', 'sans-serif'].join(','),
							},
						}}
						className={classes.autoCompleteRoot}
						disableClearable
						name='countryCodeOptions'
						onChange={(e, value) => {
							setCountry(value)
							setMoblen(value?.mastLookupValue)
						}}
						disabled={token !== null}
						size='small'
						value={country}
						options={_.orderBy(countryCode, 'mastLookupKey')}
						getOptionLabel={(option) => str.concat(option?.mastLookupKey || '')}
						classes={{ popper: classes.popper }}
						// style={{width: 140}}
						PopperComponent={CustomPopper}
						// renderOption={(option) => {
						//   return (
						//     <Box
						//       component="li"
						//       style={{ display: "flex", alignItems: "center" }}
						//     >
						//       <div style={{ display: "flex", gap: 8 }}>
						//         +{option?.mastLookupKey}
						//       </div>
						//     </Box>
						//   );
						// }}
						renderInput={(params) => {
							return (
								<TextField
									{...params}
									size='small'
									InputProps={{
										...params.InputProps,
									}}
								/>
							)
						}}
					/>
					<TextField
						id='fullWidth'
						size='small'
						autoComplete='off'
						fullWidth
						className={classes.input}
						variant='outlined'
						type='tel'
						{...register('phoneNum')}
						value={botNum || mobileNumber}
						// onChange={(e) => {
						// 	const { value } = e.target
						// 	setFormData((prevState) => ({
						// 		...prevState,
						// 		phoneNum: value,
						// 	}))

						// 	if (!errors.phoneNum) {
						// 		reset(errors)
						// 	}
						// }}
						disabled={token !== null}
						error={!!errors?.phoneNum}
						helperText={errors.phoneNum ? errors.phoneNum?.message : ''}
						inputProps={{ maxLength: moblen }}
						onKeyPress={(e) => {
							if (new RegExp(/[0-9]/).test(e.key)) {
							} else e.preventDefault()
						}}
						// InputProps={{
						// 	startAdornment: (
						// 		<InputAdornment position='start'>

						// 		</InputAdornment>
						// 	),
						// }}
					/>
				</div>

				<div style={{ display: 'flex', gap: 4, alignItems: 'flex-start' }}>
					<Checkbox
						sx={{ padding: 0, color: themeConfig.palette.lyfngo.primary.main }}
						size={'small'}
						{...register('terms', true)}
						checked={formData?.terms || true}
						onChange={(e) => setFormData({ ...formData, terms: e.target.checked })}
						inputProps={{ 'aria-label': 'controlled' }}
						error={!!errors.terms}
						label={'By checking this box, you agree our Terms and condition and Privacy Policy'}
					/>
					<Typography
						variant='subtitle1'
						sx={{
							fontSize: themeConfig.typography.subtitle1.fontSize,
							fontFamily: themeConfig.typography.subtitle1.fontFamily,
						}}
					>
						By checking this box, you agree our Terms and condition and Privacy Policy
					</Typography>
				</div>
				<motion.div
					whileTap={{ scale: 0.95 }}
					style={{ borderRadius: '16px', overflow: 'hidden', width: '85px', height: '32px', display: 'flex', alignSelf: 'flex-end' }}
				>
					<Button
						sx={{
							width: '85px',
							height: '32px',
							background: themeConfig.palette.lyfngo.primary.main,
							textTransform: 'capitalize',
							color: '#fff',
							fontSize: themeConfig.typography.subtitle1.fontSize,
							fontFamily: themeConfig.typography.subtitle1.fontFamily,
							'&:hover': {
								background: themeConfig.palette.lyfngo.primary.main,
							},
						}}
						variant='contained'
						style={{ borderRadius: '16px' }}
						disabled={botNum || token}
						onClick={() => handleSubmit(handleFormSubmit)()}
					>
						{botNum || token ? 'Submitted' : 'Submit'}
					</Button>
					{/* <button onClick={resety}>Rese</button> */}
				</motion.div>
			</form>
		</div>
	)
}

export default CustFormdata
