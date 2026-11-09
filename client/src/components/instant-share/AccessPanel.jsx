import { ACCESS_CODE_CHARACTERS } from '../../constants/instantShare'

function AccessPanel({
  download,
  enteredCode,
  errorMessage,
  handleAccessSubmit,
  isLoading,
  setEnteredCode,
}) {
  return (
    <div className="upload-card access-card">
      <form className="access-form" onSubmit={handleAccessSubmit}>
        <label htmlFor="private-share-code">SIX-CHARACTER ACCESS CODE</label>
        <input
          id="private-share-code"
          type="text"
          value={enteredCode}
          onChange={(event) => {
            setEnteredCode(
              event.target.value
                .toUpperCase()
                .replace(new RegExp(`[^${ACCESS_CODE_CHARACTERS}]`, 'g'), '')
                .slice(0, 6)
            )
          }}
          placeholder="ABC234"
          maxLength={6}
          inputMode="text"
          autoComplete="off"
          spellCheck={false}
          disabled={isLoading || Boolean(download)}
        />
        <button
          className="access-submit"
          type="submit"
          disabled={isLoading || Boolean(download) || !enteredCode}
        >
          {isLoading ? 'Accessing…' : 'Access with code'} <span>→</span>
        </button>
      </form>
      <p className="success-hint">The first valid access consumes the share, even if the download is interrupted.</p>
      {download && (
        <div className="instant-share-message instant-share-message--success" role="status" aria-live="polite">
          <span className="instant-share-message-icon" aria-hidden="true">✓</span>
          <div>
            <strong>Download ready</strong>
            <p><span className="instant-share-file-name">{download.fileName}</span> was downloaded successfully.</p>
            <a className="instant-share-save-link" href={download.url} download={download.fileName}>
              Save a copy manually <span aria-hidden="true">↓</span>
            </a>
            <small>The share has been used and cannot be downloaded again.</small>
          </div>
        </div>
      )}
      {errorMessage && (
        <div className="instant-share-message instant-share-message--error" role="alert">
          <span className="instant-share-message-icon" aria-hidden="true">!</span>
          <div>
            <strong>Could not access this file</strong>
            <p>{errorMessage}</p>
          </div>
        </div>
      )}
    </div>
  )
}

export default AccessPanel
