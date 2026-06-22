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
