
import  { useState } from 'react'
import './RoomPage.css'

function JoinRoom() {

  const queryParams = new URLSearchParams(window.location.search)

  const [roomKey, setRoomKey] = useState(
    queryParams.get('code') || queryParams.get('room') || ''
  )

  const [accessKey, setAccessKey] = useState(
    queryParams.get('key') || ''
  )

  const [displayName, setDisplayName] = useState('')



  return (
    <div className="room-page">
      <main className="room-main">

        <div className="room-art">
          <img
            src="/image.png"
            alt="SoulTether village courtyard"
          />
        </div>

        <section className="room-panel">
          <div className="room-panel-inner">

            <p className="eyebrow">
              <span className="eyebrow-line" />
              Come, take a seat
            </p>

            <h1>
              Join a <em>Room</em>
            </h1>

            <p className="room-panel-copy">
              Enter the two keys shared by your host, then choose
              the name your friends will see above your avatar.
            </p>

           

            <form
              className="room-form"
            >

              <label htmlFor="room-key">
                Room code

                <input
                  id="room-key"
                  name="room-key"
                  value={roomKey}
                  onChange={(e) =>
                    setRoomKey(e.target.value.toUpperCase())
                  }
                  placeholder="e.g. CHAI-1234"
                  maxLength={9}
                  required
                />
              </label>

              <label htmlFor="access-key">
                Access key

                <input
                  id="access-key"
                  name="access-key"
                  value={accessKey}
                  onChange={(e) =>
                    setAccessKey(e.target.value.toUpperCase())
                  }
                  placeholder="e.g. 7KQ2M8PX"
                  maxLength={8}
                  required
                />
              </label>

              <label htmlFor="display-name">
                Your name

                <input
                  id="display-name"
                  name="display-name"
                  value={displayName}
                  onChange={(e) =>
                    setDisplayName(e.target.value)
                  }
                  placeholder="e.g. Kabir"
                  maxLength={24}
                  required
                />
              </label>



              <button
                className="button button--primary room-submit"
                type="submit"
              >
                Join the Katta <span>→</span>
              </button>

            </form>

            <div className="room-navigation">

              <a
                className="back-link room-switch-link"
                href="/create-room"
              >
                Want to create a room? →
              </a>

              <a className="back-link" href="/">
                ← Back to SoulTether
              </a>

            </div>

          </div>
        </section>
      </main>
    </div>
  )
}

export default JoinRoom
