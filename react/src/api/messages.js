import instance from './axios';

export const getMessages = async (token) => {
  const response = await instance.get('/api/messages', {
    headers: {
      'Authorization': `Token ${token}`
    }
  });
  return response.data;
};

export const createMessage = async (token, text) => {
  const response = await instance.post('/api/messages', 
    { text },
    {
      headers: {
        'Authorization': `Token ${token}`
      }
    }
  );
  return response.data;
};
