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

async function toggleReaction(path, fallbackMessage) {
  try {
    const response = await api.post(path)
    return { success: true, ...unwrapPayload(response) }
  } catch (error) {
    return {
      success: false,
      message: error.response?.data?.message || fallbackMessage,
    }
  }
}

/** Resolves to { success, reaction: 'like' | 'dislike' | null, likesCount, dislikesCount } */
export function toggleVideoLike(videoId) {
  return toggleReaction(`/likes/toggle/v/${videoId}`, 'Failed to update like')
}

export function toggleVideoDislike(videoId) {
  return toggleReaction(`/likes/toggle/dislike/v/${videoId}`, 'Failed to update dislike')
}

export async function toggleCommentLike(commentId) {
  try {
    await api.post(`/likes/toggle/c/${commentId}`)
    return { success: true }
  } catch (error) {
    return {
      success: false,
      message: error.response?.data?.message || 'Failed to update like',
    }
  }
}
