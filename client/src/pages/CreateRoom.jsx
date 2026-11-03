
import './RoomPage.css'

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

                document.body.classList.add('page-leaving')

                // TODO: Call the create-room API
              }}
            >
              <label htmlFor="display-name">
                Room name
                <input
                  id="display-name"
                  name="display-name"
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
              <a className="back-link room-switch-link" href="/join-room">
                Have a Room ID? Join a room →
              </a>

              <a className="back-link" href="/">
                ← Back to WhisperShare
              </a>
            </div>
          </div>
        </section>
      </main>
    </div>
  )
}

export default CreateRoom
