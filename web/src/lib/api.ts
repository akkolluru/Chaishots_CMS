import axios from 'axios';

const API_URL = 'https://chaishots-cms-api.onrender.com';

export function getApiClient() {
  return axios.create({
    baseURL: API_URL,
    withCredentials: true, // REQUIRED
  });
}