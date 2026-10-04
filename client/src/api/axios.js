import axios from 'axios';

const API_URL =
  import.meta.env.VITE_API_URL ??
  (import.meta.env.PROD ? "https://jobmatch-pro-axgx.onrender.com" : "");

const api = axios.create({
  baseURL: ${API_URL}/api,
  headers: {
    'Content-Type': 'application/json',
  },
});

export default api;
