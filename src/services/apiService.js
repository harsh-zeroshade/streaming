/**
 * Central API client for the Nova backend.
 * All requests go through here so the base URL and auth token
 * are managed in one place.
 */

const BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api'

/** Read JWT from localStorage (set by authService after sign-in) */
const getToken = () => {
  try {
    const data = localStorage.getItem('nova_auth')
    return data ? JSON.parse(data).token : null
  } catch {
    return null
  }
}

const request = async (method, path, body) => {
  const headers = { 'Content-Type': 'application/json' }
  const token = getToken()
  if (token) headers['Authorization'] = `Bearer ${token}`

  const res = await fetch(`${BASE_URL}${path}`, {
    method,
    headers,
    credentials: 'include',
    body: body !== undefined ? JSON.stringify(body) : undefined,
  })

  const data = await res.json().catch(() => ({}))

  if (!res.ok) {
    throw new Error(data.message || `API error ${res.status}`)
  }
  return data
}

export const api = {
  get:    (path)        => request('GET',    path),
  post:   (path, body)  => request('POST',   path, body),
  delete: (path)        => request('DELETE', path),
}
