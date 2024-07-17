'use-client'
import React from 'react'
import { makeStyles } from '@material-ui/core'
import { Box, Grid, IconButton, Stack, TextField, Typography } from '@mui/material'
import Image from 'next/image'
import FlashOnOutlinedIcon from '@mui/icons-material/FlashOnOutlined'
import { themeConfig } from '../../../../theme/themesConfig'

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
}))

const Header = (props) => {
	const classes = useStyles()
	const { domainData, toggleModal, groupName } = props
	return (
		<>
			<Grid item xs={2}>
				<Grid container className={classes.root} alignItems={'center'} alignContent={'center'} textAlign={'center'}>
					<Grid item xs={1.5}>
						<Image
							src={
								domainData?.tentLogoDoc
									? domainData?.tentLogoDoc
									: _.isEqual(groupName, 'health care')
									? 'https://ik.imagekit.io/LyfngoDev/B2B_Flash/Header/Care.svg'
									: 'https://ik.imagekit.io/LyfngoDev/B2B_Flash/Header/Non_Care.svg'
							}
							alt='Happy Clinic Logo'
							style={{ width: '50px', height: '50px', borderRadius: '50%' }}
							width={100}
							height={100}
							priority={true}
						/>
					</Grid>
					<Grid item xs={9.5} className={classes.headerName}>
						<Box sx={{ display: 'flex', alignItem: 'center', flexDirection: 'column', paddingTop: '16px', gap: '4px' }}>
							<Typography variant='h6'>{domainData?.tentName}</Typography>
							<Typography variant='body1'>
								<FlashOnOutlinedIcon />
								Get Instant reply
							</Typography>
						</Box>
					</Grid>
					<Grid item xs={1}>
						<IconButton onClick={toggleModal}>
							<svg xmlns='http://www.w3.org/2000/svg' width='17' height='12' viewBox='0 0 17 10' fill='none'>
								<path
									d='M16.7923 0.207706C16.5153 -0.0692353 16.0677 -0.0692353 15.7907 0.207706L8.49998 7.49842L1.20926 0.207706C0.932315 -0.0692353 0.484647 -0.0692353 0.207706 0.207706C-0.0692353 0.484647 -0.0692353 0.932315 0.207706 1.20926L7.99922 9.00077C8.13734 9.13889 8.31866 9.20832 8.50001 9.20832C8.68136 9.20832 8.86268 9.13889 9.0008 9.00077L16.7923 1.20926C17.0692 0.932315 17.0692 0.484647 16.7923 0.207706Z'
									fill='white'
								/>
							</svg>
						</IconButton>
					</Grid>
				</Grid>
			</Grid>
		</>
	)
}

export default Header
