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
