import axios from 'axios';

const jwtAxios = axios.create({
  // baseURL: `http://localhost:8000/api/`,
  baseURL: `https://estoyfitstaging.ga/api/`,
  headers: {
    'Content-Type': 'application/json',
  },
});
export default jwtAxios;
