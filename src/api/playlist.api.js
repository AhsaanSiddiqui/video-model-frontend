import api from './axios.js'

function unwrapPayload(response) {
  const body = response?.data ?? response

  if (body?.data && typeof body.data === 'object') {
    return body.data
  }

  if (body?.message && typeof body.message === 'object') {
    return body.message
  }

  return body?.data ?? body
}

function errorMessage(error, fallback) {
  const data = error.response?.data

  if (typeof data?.message === 'string' && data.message.trim()) {
    return data.message
  }

  if (typeof data === 'string' && data.trim()) {
    return data.replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim().slice(0, 180)
  }

  if (!error.response) {
    return 'The server did not respond. Wait a few seconds and try again.'
  }

  return fallback
}

async function withGatewayRetry(request) {
  try {
    return await request()
  } catch (error) {
    const status = error.response?.status
    const shouldRetry = !error.response || status === 502 || status === 503 || status === 504
    if (!shouldRetry) throw error
    await new Promise((resolve) => setTimeout(resolve, 1500))
    return request()
  }
}

export async function fetchPlaylistById(playlistId) {
  try {
    const response = await api.get(`/playlists/${playlistId}`)
    return {
      success: true,
      playlist: unwrapPayload(response),
    }
  } catch (error) {
    return {
      success: false,
      message: errorMessage(error, 'Failed to load playlist'),
      playlist: null,
    }
  }
}

export async function fetchUserPlaylists(userId) {
  try {
    const response = await api.get(`/playlists/user/${userId}`)
    const playlists = unwrapPayload(response)
    return {
      success: true,
      playlists: Array.isArray(playlists) ? playlists : [],
    }
  } catch (error) {
    return {
      success: false,
      message: errorMessage(error, 'Failed to load playlists'),
      playlists: [],
    }
  }
}

export async function createPlaylist({ name, description = '' }) {
  try {
    const response = await api.post('/playlists', { name, description })
    return {
      success: true,
      playlist: unwrapPayload(response),
    }
  } catch (error) {
    return {
      success: false,
      message: errorMessage(error, 'Failed to create playlist'),
      playlist: null,
    }
  }
}

export async function addVideoToPlaylist(videoId, playlistId) {
  if (!videoId || !playlistId) {
    return { success: false, message: 'Missing video or playlist.' }
  }

  try {
    await withGatewayRetry(() => api.patch(`/playlists/add/${videoId}/${playlistId}`))
    return { success: true }
  } catch (error) {
    return {
      success: false,
      message: errorMessage(error, 'Failed to add video to playlist'),
    }
  }
}

export async function updatePlaylist(playlistId, { name, description }) {
  try {
    const response = await api.patch(`/playlists/${playlistId}`, { name, description })
    return {
      success: true,
      playlist: unwrapPayload(response),
    }
  } catch (error) {
    return {
      success: false,
      message: errorMessage(error, 'Failed to update playlist'),
      playlist: null,
    }
  }
}

export async function deletePlaylist(playlistId) {
  try {
    await api.delete(`/playlists/${playlistId}`)
    return { success: true }
  } catch (error) {
    return {
      success: false,
      message: errorMessage(error, 'Failed to delete playlist'),
    }
  }
}

export async function removeVideoFromPlaylist(videoId, playlistId) {
  if (!videoId || !playlistId) {
    return { success: false, message: 'Missing video or playlist.' }
  }

  try {
    await withGatewayRetry(() => api.patch(`/playlists/remove/${videoId}/${playlistId}`))
    return { success: true }
  } catch (error) {
    return {
      success: false,
      message: errorMessage(error, 'Failed to remove video from playlist'),
    }
  }
}
