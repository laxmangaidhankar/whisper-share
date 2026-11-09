import { API_BASE_URL } from '../constants/instantShare'

async function readJsonResult(response, fallback) {
  let result
  try {
    result = await response.json()
  } catch {
    throw new Error(fallback)
  }
  if (!response.ok || !result?.success) {
    throw new Error(typeof result?.message === 'string' ? result.message : fallback)
  }
  return result
}

export async function uploadInstantShare(formData) {
  const response = await fetch(`${API_BASE_URL}/instant-share/upload`, {
    method: 'POST',
    body: formData,
    cache: 'no-store',
  })
  return readJsonResult(response, 'Unable to create the share')
}

export async function fetchShareMetadata(code) {
  const response = await fetch(`${API_BASE_URL}/instant-share/${encodeURIComponent(code)}`, {
    cache: 'no-store',
  })
  return readJsonResult(
    response,
    'The share was not found, has expired, or was already used'
  )
}

export async function claimShareContent(code, claimToken) {
  const response = await fetch(
    `${API_BASE_URL}/instant-share/${encodeURIComponent(code)}/content`,
    {
      method: 'GET',
      headers: { 'X-Share-Token': claimToken },
      cache: 'no-store',
    }
  )
  if (!response.ok) {
    let message = 'The share was not found, has expired, or was already used'
    try {
      const result = await response.json()
      if (typeof result?.message === 'string') message = result.message
    } catch {
      // Keep the generic message if the response is not JSON.
    }
    throw new Error(message)
  }
  return response.arrayBuffer()
}
