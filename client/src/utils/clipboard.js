export async function copyText(value) {
  if (!value) throw new Error('There is no access code to copy')
  if (navigator.clipboard?.writeText) {
    try {
      await navigator.clipboard.writeText(value)
      return
    } catch {
      // Fall back when the Clipboard API is unavailable or denied.
    }
  }

  const input = document.createElement('textarea')
  input.value = value
  input.setAttribute('readonly', '')
  input.style.position = 'fixed'
  input.style.opacity = '0'
  document.body.appendChild(input)
  try {
    input.select()
    if (typeof document.execCommand !== 'function' || !document.execCommand('copy')) {
      throw new Error('Copy failed; select and copy the code manually')
    }
  } finally {
    input.remove()
  }
}
