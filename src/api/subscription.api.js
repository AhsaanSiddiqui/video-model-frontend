import api from './axios.js'

export async function toggleSubscription(channelId) {
  try {
    await api.post(`/subscriptions/c/${channelId}`)
    return { success: true }
  } catch (error) {
    return {
      success: false,
      message: error.response?.data?.message || 'Failed to update subscription',
    }
  }
}

export async function fetchSubscribedChannels(userId) {
  try {
    const response = await api.get(`/subscriptions/u/${userId}`)
    const body = response?.data
    const channels = Array.isArray(body?.data)
      ? body.data
      : Array.isArray(body?.message)
        ? body.message
        : []
    return { success: true, channels: channels.filter(Boolean) }
  } catch (error) {
    return {
      success: false,
      message: error.response?.data?.message || 'Failed to load subscriptions',
      channels: [],
    }
  }
}
