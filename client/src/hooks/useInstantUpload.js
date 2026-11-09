import { useEffect, useRef, useState } from 'react'
import {
  ACCESS_CODE_PATTERN,
  MAX_FILE_BYTES,
  SHARE_SCHEME,
} from '../constants/instantShare'
import {
  base64ToBytes,
  bytesToBase64,
  bytesToBase64Url,
  bytesToHex,
  deriveShareSecrets,
  generateAccessCode,
  packFile,
  requireWebCrypto,
  unpackFile,
} from '../utils/instantShareCrypto'
import { copyText } from '../utils/clipboard'
import {
  claimShareContent,
  fetchShareMetadata,
  uploadInstantShare,
} from '../services/instantShareApi'

export function useInstantUpload() {
  const [showAccess, setShowAccess] = useState(false)
  const [selectedFile, setSelectedFile] = useState(null)
  const [shareCode, setShareCode] = useState('')
  const [expiresAt, setExpiresAt] = useState('')
  const [enteredCode, setEnteredCode] = useState('')
  const [download, setDownload] = useState(null)
  const [isLoading, setIsLoading] = useState(false)
  const [errorMessage, setErrorMessage] = useState('')
  const [isCodeCopied, setIsCodeCopied] = useState(false)
  const downloadUrlRef = useRef(null)
  const busyRef = useRef(false)

  useEffect(() => () => {
    if (downloadUrlRef.current) URL.revokeObjectURL(downloadUrlRef.current)
  }, [])

  const createInstantShare = async (file) => {
    if (busyRef.current) return
    busyRef.current = true
    setIsLoading(true)
    setErrorMessage('')
    setShareCode('')
    setExpiresAt('')
    setIsCodeCopied(false)
    let secretBytes

    try {
      requireWebCrypto()
      if (file.size > MAX_FILE_BYTES) throw new Error('The file must be 25 MiB or smaller')
      const code = generateAccessCode()
      secretBytes = new TextEncoder().encode(code)
      const salt = window.crypto.getRandomValues(new Uint8Array(16))
      const iv = window.crypto.getRandomValues(new Uint8Array(12))
      const { encryptionKey, claimToken } = await deriveShareSecrets(secretBytes, salt)
      const encrypted = await window.crypto.subtle.encrypt(
        { name: 'AES-GCM', iv },
        encryptionKey,
        await packFile(file)
      )
      const claimHash = new Uint8Array(
        await window.crypto.subtle.digest('SHA-256', claimToken)
      )
      claimToken.fill(0)

      const formData = new FormData()
      formData.append(
        'encryptedFile',
        new Blob([encrypted], { type: 'application/octet-stream' }),
        'encrypted.bin'
      )
      formData.append('accessCode', code)
      formData.append('salt', bytesToBase64(salt))
      formData.append('iv', bytesToBase64(iv))
      formData.append('claimTokenHash', bytesToHex(claimHash))

      const result = await uploadInstantShare(formData)
      if (result.accessCode !== code || !Number.isFinite(Date.parse(result.expiresAt))) {
        throw new Error('The server returned an invalid share response')
      }
      setShareCode(code)
      setExpiresAt(result.expiresAt)
    } catch (error) {
      setErrorMessage(error.message || 'Unable to upload the file')
    } finally {
      secretBytes?.fill(0)
      busyRef.current = false
      setIsLoading(false)
    }
  }

  const handleAccessSubmit = async (event) => {
    event.preventDefault()
    if (busyRef.current || download) return
    busyRef.current = true
    setIsLoading(true)
    setErrorMessage('')
    let claimAttempted = false
    let claimConfirmed = false
    let secretBytes
    let claimToken

    try {
      requireWebCrypto()
      const code = enteredCode.trim().toUpperCase()
      if (!ACCESS_CODE_PATTERN.test(code)) throw new Error('Enter the six-character access code')
      secretBytes = new TextEncoder().encode(code)
      const metadataResult = await fetchShareMetadata(code)
      const metadata = metadataResult.share
      if (metadata?.scheme !== SHARE_SCHEME) throw new Error('This share uses an unsupported format')
      const salt = base64ToBytes(metadata.salt, 16)
      const iv = base64ToBytes(metadata.iv, 12)
      const secrets = await deriveShareSecrets(secretBytes, salt)
      claimToken = secrets.claimToken

      claimAttempted = true
      const encrypted = await claimShareContent(code, bytesToBase64Url(claimToken))
      claimConfirmed = true
      const decrypted = await window.crypto.subtle.decrypt(
        { name: 'AES-GCM', iv },
        secrets.encryptionKey,
        encrypted
      )
      const file = unpackFile(decrypted)
      if (downloadUrlRef.current) URL.revokeObjectURL(downloadUrlRef.current)
      const url = URL.createObjectURL(file.blob)
      downloadUrlRef.current = url
      setDownload({ url, fileName: file.fileName })
      setEnteredCode('')

      const link = document.createElement('a')
      link.href = url
      link.download = file.fileName
      document.body.appendChild(link)
      link.click()
      link.remove()
    } catch (error) {
      const message = error.message || 'Unable to access the file'
      if (claimConfirmed) {
        setEnteredCode('')
        setErrorMessage(`The share was consumed, but the file could not be prepared. ${message} Ask the sender to upload it again.`)
      } else if (claimAttempted) {
        setErrorMessage(`${message} If the connection was interrupted, the share may already be used.`)
      } else {
        setErrorMessage(message)
      }
    } finally {
      secretBytes?.fill(0)
      claimToken?.fill(0)
      busyRef.current = false
      setIsLoading(false)
    }
  }

  const handleCopyAccessCode = async () => {
    try {
      await copyText(shareCode)
      setIsCodeCopied(true)
    } catch (error) {
      setErrorMessage(error.message || 'Unable to copy the access code')
    }
  }

  const openAccess = () => {
    setErrorMessage('')
    setEnteredCode('')
    setShowAccess(true)
  }

  const backToUpload = () => {
    if (downloadUrlRef.current) URL.revokeObjectURL(downloadUrlRef.current)
    downloadUrlRef.current = null
    setDownload(null)
    setEnteredCode('')
    setErrorMessage('')
    setShowAccess(false)
  }

  return {
    backToUpload,
    createInstantShare,
    download,
    enteredCode,
    errorMessage,
    expiresAt,
    handleAccessSubmit,
    handleCopyAccessCode,
    isCodeCopied,
    isLoading,
    openAccess,
    selectedFile,
    setEnteredCode,
    setSelectedFile,
    shareCode,
    showAccess,
  }
}
