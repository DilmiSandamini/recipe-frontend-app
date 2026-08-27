import axios from 'axios';

const api = axios.create({
    baseURL: 'http://35.202.207.85:8080/api',
});

export default api;