import { useEffect, useMemo, useState } from 'react'
import './LiveRoom.css'
import { getRoomChannelName, getRoomFromStorage, redirectTo } from '../utils/room'

function formatFileSize(bytes) {
  if (bytes < 1024) return `${bytes} B`
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`
  if (bytes < 1024 * 1024 * 1024) return `${(bytes / (1024 * 1024)).toFixed(1)} MB`
  return `${(bytes / (1024 * 1024 * 1024)).toFixed(2)} GB`
}

function getFileExtension(fileName) {
  return fileName.split('.').pop()?.toUpperCase() || 'FILE'
}

function downloadFile(file) {
  const url = URL.createObjectURL(file)
  const link = document.createElement('a')
  link.href = url
  link.download = file.name
  document.body.appendChild(link)
  link.click()
  link.remove()
  URL.revokeObjectURL(url)
}

function LiveRoom() {
  const [files, setFiles] = useState([])
  const queryParams = new URLSearchParams(window.location.search)
  const [roomCode] = useState(queryParams.get('room') || '')
  const accessKey = queryParams.get('key') || ''

  useEffect(() => {
    const storedRoom = getRoomFromStorage()
    if (
      !roomCode ||
      !storedRoom ||
      storedRoom.roomCode !== roomCode ||
      storedRoom.accessKey !== accessKey
    ) {
      redirectTo('/join-room')
      return undefined
    }

    const channel = new BroadcastChannel(getRoomChannelName(roomCode))

    channel.onmessage = (event) => {
      if (event.data?.type !== 'room-files') return

      setFiles(event.data.files || [])
    }

    channel.postMessage({ type: 'room-files-request' })

    return () => channel.close()
  }, [accessKey, roomCode])

  const totalSize = useMemo(
    () => files.reduce((total, file) => total + file.size, 0),
    [files]
  )

  return (
    <div className="live-room">
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

      <main className="live-room-main">
        <section className="live-room-intro">
          <div>
            <h1>Files are <span>live.</span></h1>
            <p className="live-room-copy">
              Files added by the host appear here automatically. Everyone in
              this room can download a copy whenever they need it.
            </p>
          </div>
          <div className="live-room-members">
            <span className="live-room-avatar">H</span>
            <span className="live-room-avatar">A</span>
            <span className="live-room-avatar">+</span>
            <strong>Anyone in this room</strong>
          </div>
        </section>

        <section className="live-room-files" aria-labelledby="live-files-title">
          <div className="live-room-files-heading">
            <div>
              <p className="live-room-eyebrow">Room contents</p>
              <h2 id="live-files-title">
                Available files <span>{files.length}</span>
              </h2>
              <p>{formatFileSize(totalSize)} shared in this room</p>
            </div>
            {files.length > 0 && (
              <button
                className="live-room-download-all"
                type="button"
                onClick={() => files.forEach(downloadFile)}
              >
                Download all <span>↓</span>
              </button>
            )}
          </div>

          {files.length === 0 ? (
            <div className="live-room-empty">
              <span aria-hidden="true">◌</span>
              <strong>Waiting for the host</strong>
              <p>New files will appear here in real time.</p>
            </div>
          ) : (
            <ul className="live-room-file-list">
              {files.map((file) => (
                <li className="live-room-file" key={`${file.name}-${file.size}-${file.lastModified}`}>
                  <div className="live-room-file-type" aria-hidden="true">
                    {getFileExtension(file.name).slice(0, 4)}
                  </div>
                  <div className="live-room-file-details">
                    <strong title={file.name}>{file.name}</strong>
                    <span>{formatFileSize(file.size)} · {getFileExtension(file.name)}</span>
                  </div>
                  <button
                    className="live-room-download"
                    type="button"
                    onClick={() => downloadFile(file)}
                    aria-label={`Download ${file.name}`}
                  >
                    Download <span>↓</span>
                  </button>
                </li>
              ))}
            </ul>
          )}
        </section>
      </main>

      <footer className="live-room-footer">
        <span>Room ID: <strong>{roomCode}</strong></span>
        <a href="/dashboard">Host dashboard →</a>
      </footer>
    </div>
  )
}

export default LiveRoom
