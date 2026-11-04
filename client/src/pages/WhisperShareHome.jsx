import { useEffect, useRef, useState } from 'react'
import './WhisperShareHome.css'
import { getRoomChannelName, getRoomFromStorage } from '../utils/room'

function formatFileSize(bytes) {
  if (bytes < 1024) return `${bytes} B`
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`
  if (bytes < 1024 * 1024 * 1024) return `${(bytes / (1024 * 1024)).toFixed(1)} MB`
  return `${(bytes / (1024 * 1024 * 1024)).toFixed(2)} GB`
}

function getFileExtension(fileName) {
  return fileName.split('.').pop()?.toUpperCase() || 'FILE'
}

function WhisperShareHome() {
  const fileInputRef = useRef(null)
  const [files, setFiles] = useState([])
  const [isDragging, setIsDragging] = useState(false)
  const room = getRoomFromStorage()
  const roomCode = new URLSearchParams(window.location.search).get('room') || room?.roomCode
  const channelName = roomCode ? getRoomChannelName(roomCode) : null

  useEffect(() => {
    if (!channelName) return undefined

    const channel = new BroadcastChannel(channelName)
    channel.onmessage = (event) => {
      if (event.data?.type === 'room-files-request') {
        channel.postMessage({ type: 'room-files', files })
      }
    }
    channel.postMessage({ type: 'room-files', files })

    return () => channel.close()
  }, [channelName, files])

  useEffect(() => {
    if (!roomCode) return

    const room = getRoomFromStorage()
    if (!room || room.roomCode !== roomCode) {
      window.location.assign('/create-room')
    }
  }, [roomCode])

  const addFiles = (incomingFiles) => {
    const selectedFiles = Array.from(incomingFiles || [])
    if (!selectedFiles.length) return

    setFiles((currentFiles) => {
      const existing = new Set(currentFiles.map((file) => `${file.name}-${file.size}-${file.lastModified}`))
      const additions = selectedFiles.filter((file) => {
        const key = `${file.name}-${file.size}-${file.lastModified}`
        if (existing.has(key)) return false
        existing.add(key)
        return true
      })
      return [...currentFiles, ...additions]
    })
  }

  const handleFileChange = (event) => {
    addFiles(event.target.files)
    // Allow selecting the same file again after removing it.
    event.target.value = ''
  }

  const handleDrop = (event) => {
    event.preventDefault()
    setIsDragging(false)
    addFiles(event.dataTransfer.files)
  }

  const removeFile = (fileToRemove) => {
    setFiles((currentFiles) =>
      currentFiles.filter((file) => file !== fileToRemove)
    )
  }

  const openFilePicker = () => fileInputRef.current?.click()

  const openLiveRoom = () => {
    if (!roomCode) return
    window.open(
      `/room?room=${encodeURIComponent(roomCode)}&key=${encodeURIComponent(room?.accessKey || '')}`,
      '_blank'
    )
  }

  return (
    <div className="ws-home">
      <header className="ws-header">
        <a className="ws-brand" href="/" aria-label="WhisperShare home">
          WhisperShare
        </a>

        <nav className="ws-nav" aria-label="Main navigation">
        
          <button
            className="ws-theme-button"
            type="button"
            onClick={() => document.documentElement.classList.toggle('ws-light-theme')}
          >
            ◐ THEME
          </button>
        </nav>
      </header>

      <main>
        
        <section className="ws-upload-section" id="upload">
          <div className="ws-section-heading">
            <div>
              <p className="ws-room-label">{room?.roomName || 'Your live room'}</p>
              <h2>Ready to <span>share?</span></h2>
              <p className="ws-room-credentials">
                Room ID: <strong>{roomCode || 'Unavailable'}</strong>
                <span aria-hidden="true"> · </span>
                Access key: <strong>{room?.accessKey || 'Unavailable'}</strong>
              </p>
            </div>
            <p className="ws-section-copy">
              Add the files you want to share. Anyone with your room credentials
              will see them live.
            </p>
          </div>

          <div
            className={`ws-dropzone${isDragging ? ' is-dragging' : ''}`}
            onDragOver={(event) => {
              event.preventDefault()
              setIsDragging(true)
            }}
            onDragLeave={(event) => {
              if (!event.currentTarget.contains(event.relatedTarget)) {
                setIsDragging(false)
              }
            }}
            onDrop={handleDrop}
            onClick={openFilePicker}
            onKeyDown={(event) => {
              if (event.key === 'Enter' || event.key === ' ') {
                event.preventDefault()
                openFilePicker()
              }
            }}
            role="button"
            tabIndex={0}
            aria-label="Choose files or drag files here"
          >
            <input
              ref={fileInputRef}
              className="ws-file-input"
              type="file"
              multiple
              onChange={handleFileChange}
            />
            <div className="ws-upload-icon" aria-hidden="true">↑</div>
            <h3>Drop files here to upload</h3>
            <p>or <span>browse files</span> from your device</p>
            <small>Choose multiple files · Files stay on this page until you continue</small>
          </div>

          <div className="ws-files-heading">
            <div>
              <h3>Selected files <span className="ws-file-count">{files.length}</span></h3>
              <p>Review the files you have chosen to share.</p>
            </div>
            {files.length > 0 && (
              <button className="ws-clear-button" type="button" onClick={() => setFiles([])}>
                Clear all
              </button>
            )}
          </div>

          {files.length === 0 ? (
            <div className="ws-empty-state">
              <span className="ws-empty-icon" aria-hidden="true">▤</span>
              <p>No files selected yet.</p>
            </div>
          ) : (
            <ul className="ws-file-list">
              {files.map((file) => (
                <li className="ws-file-row" key={`${file.name}-${file.size}-${file.lastModified}`}>
                  <div className="ws-file-type" aria-hidden="true">
                    {getFileExtension(file.name).slice(0, 4)}
                  </div>
                  <div className="ws-file-details">
                    <strong title={file.name}>{file.name}</strong>
                    <span>{formatFileSize(file.size)} · {getFileExtension(file.name)}</span>
                  </div>
                  <button
                    className="ws-remove-button"
                    type="button"
                    onClick={() => removeFile(file)}
                    aria-label={`Remove ${file.name}`}
                    title="Remove file"
                  >
                    ×
                  </button>
                </li>
              ))}
            </ul>
          )}

          <div className="ws-upload-footer">
            <p><span className="ws-lock">●</span> Files are shared only with people in your live room.</p>
            <button className="ws-button ws-button-orange" type="button" onClick={openLiveRoom}>
              Open live room <span>→</span>
            </button>
          </div>
        </section>

      </main>

      <footer className="ws-footer">
        <a className="ws-brand" href="/">WhisperShare</a>
        <span>Private file sharing, made simple.</span>
      </footer>
    </div>
  )
}

export default WhisperShareHome
