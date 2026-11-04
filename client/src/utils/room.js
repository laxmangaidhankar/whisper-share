export const ROOM_STORAGE_KEY = 'whispershare-room'

export function createRoomCredentials() {
  const randomPart = () => Math.random().toString(36).slice(2, 8).toUpperCase()

  return {
    roomCode: `WHISPER-${randomPart()}`,
    accessKey: randomPart(),
  }
}

export function getRoomFromStorage() {
  try {
    const storedRoom = localStorage.getItem(ROOM_STORAGE_KEY)
    return storedRoom ? JSON.parse(storedRoom) : null
  } catch {
    return null
  }
}

export function getRoomChannelName(roomCode) {
  return `whispershare-live-room-${roomCode}`
}

export function redirectTo(path) {
  window.location.assign(path)
}
