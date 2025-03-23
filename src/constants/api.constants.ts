const isDev = import.meta.env.DEV;

export const API_URL = isDev
  ? 'https://profunions.ru/api'
  : 'https://profunions.ru/api';
