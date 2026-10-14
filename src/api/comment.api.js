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

export async function fetchVideoComments(videoId, { page = 1, limit = 10 } = {}) {
  try {
    const response = await api.get(`/comments/${videoId}`, { params: { page, limit } })
    const payload = unwrapPayload(response)

    return {
      success: true,
      comments: payload?.comments ?? [],
      totalComments: payload?.totalComments ?? 0,
      currentPage: payload?.currentPage ?? page,
      totalPages: payload?.totalPages || 1,
    }
  } catch (error) {
    return {
      success: false,
      message: error.response?.data?.message || 'Failed to load comments',
      comments: [],
      totalComments: 0,
      currentPage: page,
      totalPages: 1,
    }
  }
}

export async function addComment(videoId, content) {
  try {
    const response = await api.post(`/comments/${videoId}`, { content })
    return {
      success: true,
      comment: unwrapPayload(response),
    }
  } catch (error) {
    return {
      success: false,
      message: error.response?.data?.message || 'Failed to add comment',
      comment: null,
    }
  }
}

export async function updateComment(commentId, content) {
  try {
    const response = await api.patch(`/comments/c/${commentId}`, { content })
    return {
      success: true,
      comment: unwrapPayload(response),
    }
  } catch (error) {
    return {
      success: false,
      message: error.response?.data?.message || 'Failed to update comment',
      comment: null,
    }
  }
}

export async function deleteComment(commentId) {
  try {
    await api.delete(`/comments/c/${commentId}`)
    return { success: true }
  } catch (error) {
    return {
      success: false,
      message: error.response?.data?.message || 'Failed to delete comment',
    }
  }
}
