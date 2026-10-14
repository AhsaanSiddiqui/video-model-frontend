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
      message: error.response?.data?.message || 'Failed to load playlists',
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
      message: error.response?.data?.message || 'Failed to create playlist',
      playlist: null,
    }
  }
}

export async function addVideoToPlaylist(videoId, playlistId) {
  try {
    await api.patch(`/playlists/add/${videoId}/${playlistId}`)
    return { success: true }
  } catch (error) {
    return {
      success: false,
      message: error.response?.data?.message || 'Failed to add video to playlist',
    }
  }
}

export async function removeVideoFromPlaylist(videoId, playlistId) {
  try {
    await api.patch(`/playlists/remove/${videoId}/${playlistId}`)
    return { success: true }
  } catch (error) {
    return {
      success: false,
      message: error.response?.data?.message || 'Failed to remove video from playlist',
    }
  }
}
