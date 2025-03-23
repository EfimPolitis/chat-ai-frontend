const isDev = import.meta.env.DEV;

export const API_URL = isDev
  ? 'http://localhost:5000/api'
  : 'https://example.com';
