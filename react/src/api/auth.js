import instance from './axios';

export const registerUser = async (username, password) => {
  const response = await instance.post('/api/auth/register', {
    username,
    password
  });
  return response.data;
};

export const loginUser = async (username, password) => {
  const response = await instance.post('/api/auth/login', {
    username,
    password
  });
  return response.data;
};
