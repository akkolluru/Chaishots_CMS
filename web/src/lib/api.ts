import axios from 'axios';

export function getApiClient() {
  const baseURL = process.env.NEXT_PUBLIC_API_URL;

  if (!baseURL) {
    throw new Error('NEXT_PUBLIC_API_URL is not defined');
  }

  return axios.create({
    baseURL,
    withCredentials: true,
  });
}