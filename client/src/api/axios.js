import axios from 'axios';

// Permanent fix: Hardcode production URL if in production mode, avoiding Vercel env bugs completely
const baseURL = import.meta.env.PROD 
  ? 'https://jobmatch-pro-axgx.onrender.com/api' 
  : '/api';

const api = axios.create({
  baseURL: baseURL,
  headers: {
    'Content-Type': 'application/json',
  },
});

export default api;
