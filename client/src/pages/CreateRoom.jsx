import './RoomPage.css'
import { Link } from 'react-router-dom'
import { ROOM_FEATURE_AVAILABLE } from '../config/features'
import { createRoomCredentials, ROOM_STORAGE_KEY, redirectTo } from '../utils/room'


function CreateRoom() {
  return (
    <div className="room-page">
      <main className="room-main">
        <div className="room-art">
          <img src="/image.png" alt="WhisperShare" />
        </div>

        <section className="room-panel">
          <div className="room-panel-inner">
            <h1>Create a <em>Room</em></h1>

            <p className="room-description">
              Set up a secure space to share your files privately.
            </p>

            {!ROOM_FEATURE_AVAILABLE && (
              <div className="room-notice" role="status">
                <strong>Rooms are unavailable right now</strong>
                <p>
                  This feature is under development. In the meantime, you can
                  send a single file with <Link to="/instant-upload">Instant Share</Link>.
                </p>
              </div>
            )}

            <form
              className="room-form"
              onSubmit={(event) => {
                event.preventDefault()
                if (!ROOM_FEATURE_AVAILABLE) return

                const formData = new FormData(event.currentTarget)
                const name = formData.get('display-name')?.trim()
                if (!name) return

                const roomName = formData.get('room-name')?.trim()
                if (!roomName) return

                const { roomCode, accessKey } = createRoomCredentials()
                localStorage.setItem(
                  ROOM_STORAGE_KEY,
                  JSON.stringify({ roomCode, accessKey, roomName, hostName: name })
                )

                document.body.classList.add('page-leaving')
                redirectTo(
                  `/dashboard?room=${encodeURIComponent(roomCode)}&key=${encodeURIComponent(accessKey)}`
                )
              }}
            >
              <fieldset className="room-fieldset" disabled={!ROOM_FEATURE_AVAILABLE}>
                <label htmlFor="display-name">
                  Your name
                  <input
                    id="display-name"
                    name="display-name"
                    type="text"
                    placeholder="e.g. Alex"
                    maxLength={24}
                    autoComplete="name"
                    required
                  />
                </label>

                <label htmlFor="room-name">
                  Room name
                  <input
                    id="room-name"
                    name="room-name"
                    type="text"
                    placeholder="e.g. Scholarship Documents"
                    maxLength={24}
                    autoComplete="off"
                    required
                  />
                </label>

                <button className="button button--primary room-submit" type="submit">
                  {ROOM_FEATURE_AVAILABLE ? <>Create Secure Room <span>→</span></> : 'Coming soon'}
                </button>
              </fieldset>
            </form>

            <div className="room-navigation">
              <Link className="back-link room-switch-link" to="/join-room">
                Have a Room ID? Join a room →
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

export default CreateRoom