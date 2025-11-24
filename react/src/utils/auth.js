const TOKEN_KEY = 'auth_token';
const USERNAME_KEY = 'username';

export const saveToken = (token) => {
  if (token) {
    localStorage.setItem(TOKEN_KEY, token);
  }
};

export const getToken = () => {
  return localStorage.getItem(TOKEN_KEY);
};

export const removeToken = () => {
  localStorage.removeItem(TOKEN_KEY);
};

export const isAuthenticated = () => {
  const token = getToken();
  return !!token;
};

export const saveUsername = (username) => {
  if (username) {
    localStorage.setItem(USERNAME_KEY, username);
  }
};

export const getUsername = () => {
  return localStorage.getItem(USERNAME_KEY);
};

export const removeUsername = () => {
  localStorage.removeItem(USERNAME_KEY);
};
