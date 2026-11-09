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
        <p role="status">
          The share was used. If the download did not start,{' '}
          <a href={download.url} download={download.fileName}>save {download.fileName}</a>
          {' '}before leaving this page.
        </p>
      )}
      {errorMessage && <p role="alert">{errorMessage}</p>}
    </div>
  )
}

export default AccessPanel
