function UploadPanel({
  errorMessage,
  expiresAt,
  fileInputRef,
  handleCopyAccessCode,
  isCodeCopied,
  isLoading,
  onFileSelected,
  onOpenFilePicker,
  selectedFile,
  shareCode,
}) {
  return (
    <div className={`upload-card ${shareCode ? 'upload-card--success' : ''}`}>
      <input
        ref={fileInputRef}
        className="visually-hidden"
        type="file"
        onChange={onFileSelected}
        disabled={isLoading}
      />
      {shareCode ? (
        <div className="upload-success" aria-live="polite">
          <div className="success-orbit success-orbit--one" aria-hidden="true" />
          <div className="success-orbit success-orbit--two" aria-hidden="true" />
          <span className="success-check" aria-hidden="true">✓</span>
          <p className="success-label">Upload successful</p>
          <h2>Your file is ready to share</h2>
          <p className="success-file">{selectedFile?.name}</p>
          <div className="access-code-display">
            <span>{shareCode}</span>
            <button type="button" onClick={handleCopyAccessCode}>
              {isCodeCopied ? 'Copied' : 'Copy access code'}
            </button>
          </div>
          <p className="success-hint">Share this six-character code. Anyone with the code can use it once.</p>
          <p className="success-hint">
            Expires: <time dateTime={expiresAt}>{new Date(expiresAt).toLocaleString()}</time>
          </p>
          <button className="upload-again" type="button" onClick={onOpenFilePicker} disabled={isLoading}>
            Upload another file <span>↗</span>
          </button>
        </div>
      ) : (
        <button className="upload-dropzone" type="button" onClick={onOpenFilePicker} disabled={isLoading}>
          <span className="upload-cloud">↑</span>
          <strong>{isLoading ? 'Encrypting and uploading…' : 'Upload your file'}</strong>
          <span>{selectedFile ? selectedFile.name : 'Click to select a file; maximum 25 MiB'}</span>
        </button>
      )}
      {errorMessage && <p role="alert">{errorMessage}</p>}
    </div>
  )
}

export default UploadPanel
