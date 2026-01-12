import axios from 'axios';

const HARD_CODED_API_URL = 'https://chaishots-cms-api.onrender.com';

export function getApiClient() {
  return axios.create({
    baseURL: HARD_CODED_API_URL,
    withCredentials: true,
  });
}