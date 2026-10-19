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
  const message = error.response?.data?.message
  return typeof message === 'string' && message.trim() ? message : fallback
}

export async function fetchUserTweets(userId) {
  try {
    const response = await api.get(`/tweets/user/${userId}`)
    const tweets = unwrapPayload(response)
    return {
      success: true,
      tweets: Array.isArray(tweets) ? tweets : [],
    }
  } catch (error) {
    return {
      success: false,
      message: errorMessage(error, 'Failed to load tweets'),
      tweets: [],
    }
  }
}

export async function createTweet(content) {
  try {
    const response = await api.post('/tweets', { content })
    return {
      success: true,
      tweet: unwrapPayload(response),
    }
  } catch (error) {
    return {
      success: false,
      message: errorMessage(error, 'Failed to post tweet'),
      tweet: null,
    }
  }
}

export async function updateTweet(tweetId, content) {
  try {
    const response = await api.patch(`/tweets/${tweetId}`, { content })
    return {
      success: true,
      tweet: unwrapPayload(response),
    }
  } catch (error) {
    return {
      success: false,
      message: errorMessage(error, 'Failed to update tweet'),
      tweet: null,
    }
  }
}

export async function deleteTweet(tweetId) {
  try {
    await api.delete(`/tweets/${tweetId}`)
    return { success: true }
  } catch (error) {
    return {
      success: false,
      message: errorMessage(error, 'Failed to delete tweet'),
    }
  }
}
