import { API_ENDPOINTS } from '../../Constants'
const microSiteBaseUrl = process?.env?.NEXT_PUBLIC_API_PROFILE
export function ProfileUrlDetails(imageUrl) {
	return `data:image/png;base64,${imageUrl}`
}

export const getImgUrl = (uuid, token) => {
	return `${microSiteBaseUrl + API_ENDPOINTS.DOWNLOAD_FILE}/${uuid}?token=${encodeURIComponent(token)}`
}

export const getProfileImgUrl = (uuid, token) => {
	return `${microSiteBaseUrl + API_ENDPOINTS.DOWNLOAD_FILE}/${uuid}?token=${encodeURIComponent(token)}&isThumbnail=false`
}
