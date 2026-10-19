import api from './axios.js'

function unwrapPayload(response) {
  const body = response?.data ?? response

  if (Array.isArray(body?.data) || (body?.data && typeof body.data === 'object')) {
    return body.data
  }

  if (Array.isArray(body?.message) || (body?.message && typeof body.message === 'object')) {
    return body.message
  }

  return body?.data ?? body
}

export async function fetchDashboardStats() {
  try {
    const response = await api.get('/dashboard/stats')
    const stats = unwrapPayload(response) ?? {}
    return {
      success: true,
      stats: {
        views: stats.totalViews ?? 0,
        followers: stats.totalSubscribers ?? 0,
        likes: stats.totalLikes ?? 0,
        videos: stats.totalVideos ?? 0,
      },
    }
  } catch (error) {
    return {
      success: false,
      message: error.response?.data?.message || 'Failed to load channel stats',
      stats: { views: 0, followers: 0, likes: 0, videos: 0 },
    }
  }
}

export async function fetchDashboardVideos() {
  try {
    const response = await api.get('/dashboard/videos')
    const videos = unwrapPayload(response)
    return {
      success: true,
      videos: Array.isArray(videos) ? videos : [],
    }
  } catch (error) {
    return {
      success: false,
      message: error.response?.data?.message || 'Failed to load your videos',
      videos: [],
    }
  }
}
