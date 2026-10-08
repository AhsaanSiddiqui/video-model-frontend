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

export async function fetchVideos({ page = 1, limit = 20, query, userId, published } = {}) {
  try {
    const params = {
      page,
      limit,
      sortBy: 'createdAt',
      sortType: 'desc',
    }

    if (query) params.query = query
    if (userId) params.userId = userId
    if (published !== undefined) params.published = published ? 'true' : 'false'

    const response = await api.get('/videos', { params })
    const payload = unwrapPayload(response)

    return {
      success: true,
      videos: payload?.videos ?? [],
      pagination: payload?.pagination ?? null,
    }
  } catch (error) {
    return {
      success: false,
      message: error.response?.data?.message || 'Failed to load videos',
      videos: [],
      pagination: null,
    }
  }
}

export async function fetchVideoById(videoId) {
  try {
    const response = await api.get(`/videos/${videoId}`)
    return {
      success: true,
      video: unwrapPayload(response),
    }
  } catch (error) {
    return {
      success: false,
      message: error.response?.data?.message || 'Failed to load video',
      video: null,
    }
  }
}

export async function uploadVideo({ title, description, videoFile, thumbnail }) {
  try {
    const formData = new FormData()
    formData.append('title', title)
    formData.append('description', description)
    formData.append('videoFile', videoFile)
    formData.append('thumbnail', thumbnail)

    const response = await api.post('/videos', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    })

    return {
      success: true,
      video: unwrapPayload(response),
      message: response.data?.message || 'Video uploaded successfully',
    }
  } catch (error) {
    return {
      success: false,
      message: error.response?.data?.message || 'Failed to upload video',
      video: null,
    }
  }
}
