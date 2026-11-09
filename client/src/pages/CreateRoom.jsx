
import './RoomPage.css'
import {Link} from 'react-router-dom'
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

            <form
              className="room-form"
              onSubmit={(event) => {
                event.preventDefault()

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
                  autoComplete="name"
                  required
                />
              </label>

              <button
                className="button button--primary room-submit"
                type="submit"
              >
                Create Secure Room <span>→</span>
              </button>
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
