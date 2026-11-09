import {
  ACCESS_CODE_CHARACTERS,
  CLAIM_INFO,
  ENCRYPTION_INFO,
  MAX_METADATA_BYTES,
} from '../constants/instantShare'

export function requireWebCrypto() {
  if (!window.crypto?.subtle || !window.crypto?.getRandomValues) {
    throw new Error('Secure browser encryption requires HTTPS or localhost')
  }
}

export function bytesToBase64(bytes) {
  let binary = ''
  for (let index = 0; index < bytes.length; index += 0x8000) {
    binary += String.fromCharCode(...bytes.subarray(index, index + 0x8000))
  }
  return window.btoa(binary)
}

export function base64ToBytes(value, expectedLength) {
  const expectedCharacters = 4 * Math.ceil(expectedLength / 3)
  if (typeof value !== 'string' || value.length !== expectedCharacters) {
    throw new Error('The share contains invalid encryption metadata')
  }

  try {
    const binary = window.atob(value)
    const bytes = Uint8Array.from(binary, (character) => character.charCodeAt(0))
    if (bytes.length !== expectedLength || bytesToBase64(bytes) !== value) {
      throw new Error('Invalid bytes')
    }
    return bytes
  } catch {
    throw new Error('The share contains invalid encryption metadata')
  }
}

export function bytesToBase64Url(bytes) {
  return bytesToBase64(bytes).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '')
}

export function bytesToHex(bytes) {
  return Array.from(bytes, (byte) => byte.toString(16).padStart(2, '0')).join('')
}

export function generateAccessCode() {
  return Array.from(
    window.crypto.getRandomValues(new Uint8Array(6)),
    (byte) => ACCESS_CODE_CHARACTERS[byte % ACCESS_CODE_CHARACTERS.length]
  ).join('')
}

export async function deriveShareSecrets(secretBytes, salt) {
  const material = await window.crypto.subtle.importKey(
    'raw', secretBytes, 'HKDF', false, ['deriveKey', 'deriveBits']
  )
  const encoder = new TextEncoder()
  const params = (info) => ({
    name: 'HKDF',
    hash: 'SHA-256',
    salt,
    info: encoder.encode(info),
  })

  const encryptionKey = await window.crypto.subtle.deriveKey(
    params(ENCRYPTION_INFO),
    material,
    { name: 'AES-GCM', length: 256 },
    false,
    ['encrypt', 'decrypt']
  )
  const claimToken = new Uint8Array(
    await window.crypto.subtle.deriveBits(params(CLAIM_INFO), material, 256)
  )
  return { encryptionKey, claimToken }
}

export async function packFile(file) {
  const metadata = new TextEncoder().encode(JSON.stringify({
    version: 2,
    fileName: file.name,
    mimeType: file.type || 'application/octet-stream',
  }))
  if (!metadata.length || metadata.length > MAX_METADATA_BYTES) {
    throw new Error('The file name or type is too long')
  }

  const lengthBytes = new Uint8Array(4)
  new DataView(lengthBytes.buffer).setUint32(0, metadata.length, false)
  return new Blob([lengthBytes, metadata, file]).arrayBuffer()
}

export function unpackFile(buffer) {
  if (buffer.byteLength < 4) throw new Error('Invalid encrypted file')
  const metadataLength = new DataView(buffer).getUint32(0, false)
  if (!metadataLength || metadataLength > MAX_METADATA_BYTES || metadataLength > buffer.byteLength - 4) {
    throw new Error('Invalid encrypted file metadata')
  }

  let metadata
  try {
    const text = new TextDecoder('utf-8', { fatal: true }).decode(
      new Uint8Array(buffer, 4, metadataLength)
    )
    metadata = JSON.parse(text)
  } catch {
    throw new Error('Invalid encrypted file metadata')
  }

  if (metadata?.version !== 2 || typeof metadata.fileName !== 'string') {
    throw new Error('Invalid encrypted file metadata')
  }
  const fileName = metadata.fileName
    .replace(/[<>:"\\|?*\p{Cc}]/gu, '_')
    .replace(/\//g, '_')
    .trim()
    .slice(0, 255) || 'download'
  const mimeType = typeof metadata.mimeType === 'string' &&
    /^[a-z0-9!#$&^_.+-]+\/[a-z0-9!#$&^_.+-]+$/i.test(metadata.mimeType)
    ? metadata.mimeType
    : 'application/octet-stream'
  const fileBytes = new Uint8Array(buffer, 4 + metadataLength)
  return { blob: new Blob([fileBytes], { type: mimeType }), fileName }
}
