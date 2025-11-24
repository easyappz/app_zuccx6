import instance from './axios';

export const getProfile = async (token) => {
  const response = await instance.get('/api/profile', {
    headers: {
      'Authorization': `Token ${token}`
    }
  });
  return response.data;
};
