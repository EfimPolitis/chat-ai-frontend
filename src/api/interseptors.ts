import { API_URL } from '@/constants/api.constants';
import axios, { CreateAxiosDefaults } from 'axios';
import { getContentType } from './api.helper';

const axiosOptions: CreateAxiosDefaults = {
  baseURL: API_URL,
  headers: getContentType(),
};

export const axiosClassic = axios.create(axiosOptions);
