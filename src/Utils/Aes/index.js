const CryptoJS = require('crypto-js')

function randomString(length, chars) {
	var result = ''
	for (var i = length; i > 0; --i) result += chars[Math.floor(Math.random() * chars.length)]
	return result
}

var secretKey = CryptoJS.enc.Latin1.parse(process.env.NEXT_PUBLIC_SECRET_KEY)
var ivKey = CryptoJS.enc.Latin1.parse(randomString(16, '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ'))
var publicKey = CryptoJS.enc.Latin1.stringify(ivKey)

//encryption
export const encryption = (data) => {
	var plainText = CryptoJS.AES.encrypt(JSON.stringify(data), secretKey, {
		iv: ivKey,
	}).toString()
	return { plainText, publicKey }
}

//decryption
export const decryption = (res, key) => {
	let tempKey = key ? CryptoJS.enc.Latin1.parse(key) : CryptoJS.enc.Latin1.parse(res?.headers?.key)
	var cipherText = CryptoJS.enc.Base64.parse(res?.data ? res?.data : res)
	var isDecrypt = CryptoJS.lib.CipherParams.create({ ciphertext: cipherText })
	var bytes = CryptoJS.AES.decrypt(isDecrypt, secretKey, { iv: tempKey })
	const decryptedData = JSON.parse(bytes.toString(CryptoJS.enc.Utf8))
	return decryptedData
}

export const failureLogin = (res) => {
	var cipherText = CryptoJS.enc.Base64.parse(res?.response?.data)
	var isDecrypt = CryptoJS.lib.CipherParams.create({ ciphertext: cipherText })
	var bytes = CryptoJS.AES.decrypt(isDecrypt, secretKey, {
		iv: CryptoJS.enc.Latin1.parse(res?.response?.headers?.key),
	})
	const decryptedData = JSON.parse(bytes.toString(CryptoJS.enc.Utf8))
	return decryptedData
}
