import { themeConfig } from '../../../..//theme/themesConfig'
import { makeStyles } from '@material-ui/core'
import { Grid, Typography, TextField, Avatar, Button, CircularProgress } from '@mui/material'
import { motion } from 'framer-motion'
import { useForm } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import BotApi from '../../../../service/BotApi'
import * as yup from 'yup'
import secureLocalStorage from 'react-secure-storage'
import React, { useEffect, useState } from 'react'

const useStyles = makeStyles((theme) => ({
	messageContainer: {
		padding: '24px 18px',
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
	input: {
		background: '#fff',
		borderRadius: 16,
		'& .MuiOutlinedInput-notchedOutline': {
			border: '0px',
		},
		'& .MuiInputBase-root': {
			fontSize: themeConfig.typography.subtitle1.fontSize,
			fontFamily: themeConfig.typography.subtitle1.fontFamily,
			// height: 40,
			borderRadius: '18px',
			background: '#fff',
		},
	},
}))

const EmailTemplate = ({ domainData }) => {
	const classes = useStyles()
	const [success, setSuccess] = useState(false)
	const [loading, setLoading] = useState(false)
	const validationSchema = yup.object({
		name: yup.string().required('Name is required'),
		email: yup.string().email('Invalid email address').required('Email is required'),
	})
	const {
		register,
		handleSubmit,
		formState: { errors },
		reset,
	} = useForm({
		resolver: yupResolver(validationSchema),
	})

	const handleFormSubmit = (data) => {
		setLoading(true)
		const body = {
			Name: data?.name,
			Email: data?.email,
			Message: data?.message,
		}
		const onSuccess = (res) => {
			setSuccess(res?.data?.status)
			setLoading(false)
			localStorage.setItem('mailData', JSON.stringify({ ...body, success: true }))
			localStorage.setItem('mailStateTime', new Date().getTime())
		}
		const onFailure = (err) => {
			setLoading(false)
			console.log(err)
		}
		BotApi.postEmail(body).then(onSuccess, onFailure)
	}

	useEffect(() => {
		const localInitializedData = typeof window !== 'undefined' ? localStorage.getItem('mailData') : null
		const savedState = localInitializedData ? JSON.parse(localInitializedData) : null
		const savedTime = typeof window !== 'undefined' ? localStorage.getItem('mailStateTime') : null
		const currentTime = new Date().getTime()
		const expirationTime = 2 * 60 * 60 * 1000 // 2 hours in milliseconds
		if (savedState && !_.isEmpty(savedState) && currentTime - savedTime <= expirationTime) {
			localStorage.setItem('mailData', JSON.stringify(savedState))
			reset({ name: savedState.Name, email: savedState.Email, message: savedState.Message })
			setSuccess(savedState.success)
		} else {
			setSuccess(false)
			localStorage.setItem('mailStateTime', null)
			localStorage.setItem('mailData', JSON.stringify({}))
		}
	}, [reset])
	const groupName = typeof window !== 'undefined' ? secureLocalStorage.getItem('groupName') : null
	return (
		<Grid container direction='row' gap={2} alignItems={'start'} flexWrap={'nowrap'} className={classes.messageContainer} id='msgChatBot'>
			<Grid>
				<motion.div
					initial={{ opacity: 0, y: 20 }}
					animate={{ opacity: 1, y: 0 }}
					transition={{ duration: 0.5, delay: 0.1 }}
					className={classes.textContainer}
				>
					<Avatar
						className={classes.avatar}
						style={{ display: 'block' }}
						src={
							domainData?.tentLogoDoc
								? domainData?.tentLogoDoc
								: _.isEqual(groupName, 'health care')
								? 'https://ik.imagekit.io/LyfngoDev/B2B_Flash/Header/Care.svg'
								: 'https://ik.imagekit.io/LyfngoDev/B2B_Flash/Header/Non_Care.svg'
						}
					/>
				</motion.div>
			</Grid>
			<Grid xs={10}>
				<motion.div
					initial={{ opacity: 0, y: 20 }}
					animate={{ opacity: 1, y: 0 }}
					transition={{ duration: 0.5, delay: 0.1 }}
					className={classes.textContainer}
				>
					<div className={classes.card}>
						<Typography variant='h3'>Email</Typography>
					</div>
				</motion.div>
				<motion.div
					initial={{ opacity: 0, y: 20 }}
					animate={{ opacity: 1, y: 0 }}
					transition={{ duration: 0.5, delay: 0.3 }}
					className={classes.textContainer}
				>
					<div className={classes.card} style={{ display: 'block', width: '100%', padding: '14px 16px' }}>
						<TextField
							{...register('name')}
							placeholder='Name'
							className={classes.input}
							fullWidth
							autoFocus
							autoComplete='off'
							size='small'
							sx={{ mb: 1.5 }}
							error={!!errors.name}
							helperText={errors.name?.message}
							disabled={success}
						/>

						<TextField
							{...register('email')}
							placeholder='Email'
							className={classes.input}
							fullWidth
							autoComplete='off'
							size='small'
							sx={{ mb: 1.5 }}
							error={!!errors.email}
							helperText={errors.email?.message}
							disabled={success}
						/>

						<TextField
							{...register('message')}
							placeholder='Message'
							className={classes.input}
							fullWidth
							size='small'
							autoComplete='off'
							multiline
							minRows={4}
							sx={{ mb: 1.5 }}
							error={!!errors.message}
							helperText={errors.message?.message}
							disabled={success}
						/>

						<div style={{ display: 'flex', justifyContent: 'end' }}>
							<motion.div whileTap={{ scale: 0.95 }} style={{ borderRadius: '16px', overflow: 'hidden', height: '32px' }}>
								<Button
									onClick={handleSubmit((data) => handleFormSubmit(data))}
									sx={{
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
									style={{ borderRadius: '16px', minWidth: '140px' }}
									disabled={success}
								>
									{loading ? <CircularProgress size={22} sx={{ color: '#fff' }} /> : success ? 'Successfully sent' : 'Send Message'}
								</Button>
							</motion.div>
						</div>
					</div>
				</motion.div>
			</Grid>
		</Grid>
	)
}

export default EmailTemplate
