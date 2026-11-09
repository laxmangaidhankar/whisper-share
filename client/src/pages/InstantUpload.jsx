import { useRef } from 'react'
import Header from '../components/instant-share/Header'
import AccessPanel from '../components/instant-share/AccessPanel'
import UploadPanel from '../components/instant-share/UploadPanel'
import { useInstantUpload } from '../hooks/useInstantUpload'
import '../components/home/Hero.css'
import './InstantUpload.css'

function InstantUpload() {
  const fileInputRef = useRef(null)
  const {
    backToUpload,
    createInstantShare,
    download,
    enteredCode,
    errorMessage,
    expiresAt,
    handleAccessSubmit,
    handleCopyAccessCode,
    isCodeCopied,
    isLoading,
    openAccess,
    selectedFile,
    setEnteredCode,
    setSelectedFile,
    shareCode,
    showAccess,
  } = useInstantUpload()

  const handleFileSelected = (event) => {
    const [file] = event.target.files
    if (!file) return
    setSelectedFile(file)
    void createInstantShare(file)
  }

  const openFilePicker = () => {
    if (!isLoading && fileInputRef.current) {
      fileInputRef.current.value = ''
      fileInputRef.current.click()
    }
  }

  return (
    <div className="site instant-upload-page">
      <Header />
      <main className="instant-upload-main">
        <a className="instant-upload-back" href="/">← Back to home</a>
        <div className="instant-upload-heading">
          <span className="instant-upload-mark">↗</span>
          <div>
            <p className="eyebrow">Private file transfer</p>
            <h1>Instant Share</h1>
            <p>Encrypted in your browser. One six-character code, one server download.</p>
          </div>
        </div>

        {!showAccess ? (
          <>
            <UploadPanel
              errorMessage={errorMessage}
              expiresAt={expiresAt}
              fileInputRef={fileInputRef}
              handleCopyAccessCode={handleCopyAccessCode}
              isCodeCopied={isCodeCopied}
              isLoading={isLoading}
              onFileSelected={handleFileSelected}
              onOpenFilePicker={openFilePicker}
              selectedFile={selectedFile}
              shareCode={shareCode}
            />
            <button className="access-code-link access-back" type="button" onClick={openAccess} disabled={isLoading}>
              Have an access code? <strong>Access your file →</strong>
            </button>
          </>
        ) : (
          <>
            <AccessPanel
              download={download}
              enteredCode={enteredCode}
              errorMessage={errorMessage}
              handleAccessSubmit={handleAccessSubmit}
              isLoading={isLoading}
              setEnteredCode={setEnteredCode}
            />
            <button className="access-code-link access-back" type="button" onClick={backToUpload} disabled={isLoading}>
              ← Back to Instant Share
            </button>
          </>
        )}
      </main>
    </div>
  )
}

export default InstantUpload
