//X-SECURITY

export const csrf = () => {
	var timeStamp = Date.now() + 1 * 60 * 60 * 1000
	var productName = 'LYFnGO-PORTAL'
	var encode = Buffer.from(`${timeStamp + '###' + productName}`).toString('base64')
	return encode
}
