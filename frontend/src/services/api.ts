import axios from 'axios';

export const api = axios.create({ baseURL: import.meta.env.VITE_API_URL || 'http://localhost:4000/api', withCredentials: true, headers: { 'Content-Type': 'application/json' } });
export function errorMessage(error: unknown): string {
  if (axios.isAxiosError(error)) return error.response?.data?.message || 'The server could not be reached. Check the API connection.';
  return 'Something went wrong. Please try again.';
}
