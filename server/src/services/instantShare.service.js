import { createHash } from 'node:crypto'
import { hashAccessCode } from './accessCode.service.js'
import {
    consumeInstantShare,
    findInstantShareMetadataByCodeHash,
    insertInstantShare
} from '../repositories/instantShare.repository.js'

// Keep these limits consistent with the router and frontend.
const MAX_PLAINTEXT_BYTES = 25 * 1024 * 1024
const MAX_METADATA_BYTES = 8192
const MAX_ENCRYPTED_BYTES = MAX_PLAINTEXT_BYTES + 4 + MAX_METADATA_BYTES + 16
const CODE_PATTERN = /^[23456789ABCDEFGHJKLMNPQRSTUVWXYZ]{6}$/
const CLAIM_TOKEN_PATTERN = /^[A-Za-z0-9_-]{43}$/
const CLAIM_HASH_PATTERN = /^[a-f0-9]{64}$/

function httpError(statusCode, message) {
    const error = new Error(message)
    error.statusCode = statusCode
    return error
}

function notFound() {
    return httpError(404, 'The share was not found, has expired, or was already used')
}

function codeHashForLookup(code) {
    const normalizedCode = typeof code === 'string' ? code.trim().toUpperCase() : ''
    if (!CODE_PATTERN.test(normalizedCode)) throw notFound()
    return hashAccessCode(normalizedCode)
}

function decodeFixedBase64(value, fieldName, expectedBytes) {
    const pattern = /^(?:[A-Za-z0-9+/]{4})*(?:[A-Za-z0-9+/]{2}==|[A-Za-z0-9+/]{3}=)?$/
    const expectedCharacters = 4 * Math.ceil(expectedBytes / 3)
    if (
        typeof value !== 'string' ||
        value.length !== expectedCharacters ||
        !pattern.test(value)
    ) {
        throw httpError(400, `${fieldName} must be valid base64`)
    }
    const buffer = Buffer.from(value, 'base64')
    if (buffer.length !== expectedBytes || buffer.toString('base64') !== value) {
        throw httpError(400, `${fieldName} must contain exactly ${expectedBytes} bytes`)
    }
    return buffer
}

function hashClaimToken(value) {
    if (typeof value !== 'string' || !CLAIM_TOKEN_PATTERN.test(value)) throw notFound()
    const token = Buffer.from(value, 'base64url')
    if (token.length !== 32 || token.toString('base64url') !== value) throw notFound()
    return createHash('sha256').update(token).digest('hex')
}

export async function createShare({ file, accessCode, salt, iv, claimTokenHash }) {
    if (!file || !Buffer.isBuffer(file.buffer)) {
        throw httpError(400, 'An encryptedFile upload is required')
    }
    if (file.buffer.length < 16 || file.buffer.length > MAX_ENCRYPTED_BYTES) {
        throw httpError(413, 'The encrypted upload exceeds the permitted size')
    }
    const normalizedAccessCode = typeof accessCode === 'string'
        ? accessCode.trim().toUpperCase()
        : ''
    if (!CODE_PATTERN.test(normalizedAccessCode)) {
        throw httpError(400, 'A valid access code is required')
    }
    if (typeof claimTokenHash !== 'string' || !CLAIM_HASH_PATTERN.test(claimTokenHash)) {
        throw httpError(400, 'A valid claim-token hash is required')
    }

    const saved = await insertInstantShare({
        accessCodeHash: hashAccessCode(normalizedAccessCode),
        encryptedFile: file.buffer,
        salt: decodeFixedBase64(salt, 'salt', 16),
        iv: decodeFixedBase64(iv, 'iv', 12),
        claimTokenHash
    })
    if (!saved) throw httpError(409, 'Access code already in use. Please try again')

    return { accessCode: normalizedAccessCode, expiresAt: saved.expires_at }
}

export async function getShare(code) {
    const share = await findInstantShareMetadataByCodeHash(codeHashForLookup(code))
    if (!share) throw notFound()
    return {
        scheme: 'instant-share-v2',
        salt: share.salt.toString('base64'),
        iv: share.iv.toString('base64'),
        expiresAt: share.expires_at
    }
}

export async function getShareContent(code, claimToken) {
    const codeHash = codeHashForLookup(code)
    const tokenHash = hashClaimToken(claimToken)
    const share = await consumeInstantShare(codeHash, tokenHash)
    if (!share) throw notFound()
    return { content: share.encrypted_file }
}
