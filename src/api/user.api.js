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

export async function fetchChannelProfile(username) {
  try {
    const response = await api.get(`/users/c/${encodeURIComponent(username)}`)
    const channel = unwrapPayload(response)

    return {
      success: true,
      channel: Array.isArray(channel) ? channel[0] : channel,
    }
  } catch (error) {
    return {
      success: false,
      message: error.response?.data?.message || 'Channel not found',
      channel: null,
    }
  }
}
