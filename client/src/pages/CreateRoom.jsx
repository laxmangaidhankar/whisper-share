import './RoomPage.css'

function CreateRoom() {




  return (
    <div className="room-page">
      <main className="room-main">
        <div className="room-art">
          <img src="/image.png" alt="SoulTether village courtyard" />
        </div>

        <section className="room-panel">
          <div className="room-panel-inner">
            <p className="eyebrow"><span className="eyebrow-line" /> Your adda awaits</p>
            <h1>Create a <em>Room</em></h1>


            <form
              className="room-form"
              onSubmit={(event) => {
                event.preventDefault()
                const formData = new FormData(event.currentTarget)
                const name = formData.get('display-name').trim()
                if (!name) return

                document.body.classList.add('page-leaving')
               
              }}
            >
          

              <label htmlFor="display-name">
                Your name
                <input
                  id="display-name"
                  name="display-name"
                  placeholder="e.g. Aanya"
                  maxLength={24}
                  required
                />
              </label>

              <button className="button button--primary room-submit" type="submit">
                Create the Katta <span>→</span>
              </button>
            </form>

            <div className="room-navigation">
          
              <a className="back-link room-switch-link" href="/join-room">
                Join an existing room? →
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

export default CreateRoom
