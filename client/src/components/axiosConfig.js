import axios from 'axios';

const instance = axios.create({
  baseURL: 'https://book-club-api-1hda.onrender.com',
  withCredentials: true, 
});

export default instance;
