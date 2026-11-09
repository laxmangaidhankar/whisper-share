export const API_BASE_URL = (import.meta.env.VITE_API_URL).replace(/\/$/, '')
export const ACCESS_CODE_CHARACTERS = '23456789ABCDEFGHJKLMNPQRSTUVWXYZ'
export const ACCESS_CODE_PATTERN = /^[23456789ABCDEFGHJKLMNPQRSTUVWXYZ]{6}$/
export const SHARE_SCHEME = 'instant-share-v2'
export const MAX_FILE_BYTES = 25 * 1024 * 1024
export const MAX_METADATA_BYTES = 8192
export const ENCRYPTION_INFO = 'instant-share:v2:encryption'
export const CLAIM_INFO = 'instant-share:v2:claim'
