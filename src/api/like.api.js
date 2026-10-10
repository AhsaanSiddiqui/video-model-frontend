import api from './axios.js'

export async function toggleVideoLike(videoId) {
  try {
    await api.post(`/likes/toggle/v/${videoId}`)
    return { success: true }
  } catch (error) {
    return {
      success: false,
      message: error.response?.data?.message || 'Failed to update like',
    }
  }
}
