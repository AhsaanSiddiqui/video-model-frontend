import api from './axios.js';

export async function loginUser(data) {
  try {
    const response = await api.post('/users/login', data);
    return response.data;
  } catch (error) {
    console.log('Login Error:', error.response?.data);
    return (
      error.response?.data ?? {
        success: false,
        message: 'Something went wrong',
      }
    );
  }
}

/**
 * Register expects multipart/form-data (avatar required by API).
 * @param {{ fullName: string, username: string, email: string, password: string, avatar: File, coverImage?: File }} data
 */
export async function registerUser(data) {
  try {
    const formData = new FormData();
    formData.append('fullName', data.fullName);
    formData.append('username', data.username);
    formData.append('email', data.email);
    formData.append('password', data.password);
    formData.append('avatar', data.avatar);
    if (data.coverImage) formData.append('coverImage', data.coverImage);

    const response = await api.post('/users/register', formData);
    return response.data;
  } catch (error) {
    console.log('error.response?.data:', error.response?.data.message);
    // console.log(error);
    return (
      error.response?.data ?? {
        success: false,
        message: 'Something went wrong',
      }
    );
  }
}

export async function forgotPassword(email) {
  try {
    const response = await api.post('/users/forgot-password', { email });
    return response.data;
  } catch (error) {
    return (
      error.response?.data ?? {
        success: false,
        message: 'Something went wrong',
      }
    );
  }
}

export async function resetPasswordWithToken({
  token,
  newPassword,
  confirmPassword,
}) {
  try {
    const response = await api.post(`/users/reset-password/${token}`, {
      newPassword,
      confirmPassword,
    });
    return response.data;
  } catch (error) {
    return (
      error.response?.data ?? {
        success: false,
        message: 'Something went wrong',
      }
    );
  }
}

export async function changePassword(payload) {
  try {
    const response = await api.post('/users/change-password', payload);
    return response.data;
  } catch (error) {
    return (
      error.response?.data ?? {
        success: false,
        message: 'Something went wrong',
      }
    );
  }
}

export async function getCurrentUser() {
  try {
    const response = await api.get('/users/current-user');
    return response.data;
  } catch (error) {
    console.log(error);
    return (
      error.response?.data ?? {
        success: false,
        message: 'Something went wrong',
      }
    );
  }
}

function unwrapUser(body) {
  const data = body?.data
  const message = body?.message
  if (data && typeof data === 'object' && (data._id || data.email)) return data
  if (message && typeof message === 'object' && (message._id || message.email)) return message
  return null
}

export async function logoutUser() {
  try {
    const response = await api.post('/users/logout')
    return response.data ?? { success: true }
  } catch (error) {
    return (
      error.response?.data ?? {
        success: false,
        message: 'Logout failed',
      }
    )
  }
}

export async function updateAccountDetails({ fullName, email }) {
  try {
    const response = await api.patch('/users/update-account', { fullName, email })
    return {
      success: Boolean(response.data?.success),
      message: typeof response.data?.message === 'string' ? response.data.message : 'Account updated',
      user: unwrapUser(response.data),
    }
  } catch (error) {
    return {
      success: false,
      message: error.response?.data?.message || 'Failed to update account',
      user: null,
    }
  }
}

export async function updateAvatar(file) {
  const formData = new FormData()
  formData.append('avatar', file)
  try {
    const response = await api.patch('/users/avatar', formData)
    return {
      success: Boolean(response.data?.success),
      message: typeof response.data?.message === 'string' ? response.data.message : 'Avatar updated',
      user: unwrapUser(response.data),
    }
  } catch (error) {
    return {
      success: false,
      message: error.response?.data?.message || 'Failed to update avatar',
      user: null,
    }
  }
}

export async function updateCoverImage(file) {
  const formData = new FormData()
  formData.append('coverImage', file)
  try {
    const response = await api.patch('/users/cover-image', formData)
    return {
      success: Boolean(response.data?.success),
      message: typeof response.data?.message === 'string' ? response.data.message : 'Cover image updated',
      user: unwrapUser(response.data),
    }
  } catch (error) {
    return {
      success: false,
      message: error.response?.data?.message || 'Failed to update cover image',
      user: null,
    }
  }
}

export async function fetchWatchHistory() {
  try {
    const response = await api.get('/users/history')
    const body = response?.data
    const videos = Array.isArray(body?.data)
      ? body.data
      : Array.isArray(body?.message)
        ? body.message
        : []
    return { success: true, videos: videos.filter(Boolean) }
  } catch (error) {
    return {
      success: false,
      message: error.response?.data?.message || 'Failed to load watch history',
      videos: [],
    }
  }
}
