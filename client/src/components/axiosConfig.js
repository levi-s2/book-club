import axios from 'axios';

const instance = axios.create({
  baseURL: 'https://book-club-q8mm.onrender.com',
  withCredentials: true, 
});

export default instance;
