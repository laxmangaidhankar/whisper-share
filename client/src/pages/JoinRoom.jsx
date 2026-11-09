import { useState } from 'react'
import './RoomPage.css'
import { Link } from 'react-router-dom'
import { getRoomFromStorage, redirectTo } from '../utils/room'
import { ROOM_FEATURE_AVAILABLE } from '../config/features'

function JoinRoom() {
  const queryParams = new URLSearchParams(window.location.search)

  const [roomKey, setRoomKey] = useState(
    queryParams.get('code') || queryParams.get('room') || ''
  )

  const [accessKey, setAccessKey] = useState(
    queryParams.get('key') || ''
  )

  const [displayName, setDisplayName] = useState('')
  const [error, setError] = useState('')

  const handleSubmit = (event) => {
    event.preventDefault()
    if (!ROOM_FEATURE_AVAILABLE) return

    if (!roomKey.trim() || !accessKey.trim() || !displayName.trim()) {
      setError('Enter your name, Room ID, and Access Key to continue.')
      return
    }

    const room = getRoomFromStorage()
    const normalizedRoomKey = roomKey.trim().toUpperCase()
    const normalizedAccessKey = accessKey.trim().toUpperCase()

    if (
      !room ||
      room.roomCode !== normalizedRoomKey ||
      room.accessKey !== normalizedAccessKey
    ) {
      setError('Those room credentials are not valid. Check them and try again.')
      return
    }

    setError('')
    document.body.classList.add('page-leaving')
    redirectTo(
      `/room?room=${encodeURIComponent(normalizedRoomKey)}&key=${encodeURIComponent(normalizedAccessKey)}&name=${encodeURIComponent(displayName.trim())}`
    )
  }

  return (
    <div className="room-page">
      <main className="room-main">

        <div className="room-art">
          <img
            src="/image.png"
            alt="WhisperShare secure file sharing"
          />
        </div>

        <section className="room-panel">
          <div className="room-panel-inner">

            <h1>
              Join a <em>Room</em>
            </h1>

            <p className="room-panel-copy">
              Enter the Room ID and Access Key shared by your host
              to securely access shared files.
            </p>

            {!ROOM_FEATURE_AVAILABLE && (
              <div className="room-notice" role="status">
                <strong>Rooms are unavailable right now</strong>
                <p>
                  This feature is under development. If someone shared a
                  file code with you, you can open it with{' '}
                  <Link to="/instant-upload">Instant Share</Link>.
                </p>
              </div>
            )}

            <form
              className="room-form"
              onSubmit={handleSubmit}
            >
              <fieldset className="room-fieldset" disabled={!ROOM_FEATURE_AVAILABLE}>

                <label htmlFor="room-key">
                  Room ID

                  <input
                    id="room-key"
                    name="room-key"
                    type="text"
                    value={roomKey}
                    onChange={(e) =>
                      setRoomKey(e.target.value.toUpperCase())
                    }
                    placeholder="Enter Room ID"
                    maxLength={24}
                    autoComplete="off"
                    required
                  />
                </label>

                <label htmlFor="access-key">
                  Access Key

                  <input
                    id="access-key"
                    name="access-key"
                    type="password"
                    value={accessKey}
                    onChange={(e) =>
                      setAccessKey(e.target.value.toUpperCase())
                    }
                    placeholder="Enter Access Key"
                    maxLength={8}
                    autoComplete="off"
                    required
                  />
                </label>

                <label htmlFor="display-name">
                  Your name

                  <input
                    id="display-name"
                    name="display-name"
                    type="text"
                    value={displayName}
                    onChange={(e) =>
                      setDisplayName(e.target.value)
                    }
                    placeholder="e.g. Kabir"
                    maxLength={24}
                    autoComplete="name"
                    required
                  />
                </label>

                <button
                  className="button button--primary room-submit"
                  type="submit"
                >
                  {ROOM_FEATURE_AVAILABLE ? <>Access Secure Room <span>→</span></> : 'Coming soon'}
                </button>

              </fieldset>

              {error && <p className="room-error" role="alert">{error}</p>}

            </form>

            <div className="room-navigation">

              <Link
                className="back-link room-switch-link"
                to="/create-room"
              >
                Need a new room? Create one →
              </Link>

              <Link className="back-link" to="/">
                ← Back to WhisperShare
              </Link>

            </div>

          </div>
        </section>
      </main>
    </div>
  )
}

export default JoinRoom