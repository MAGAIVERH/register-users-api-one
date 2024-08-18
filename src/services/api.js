import axios from 'axios';

const api = axios.create({
    baseURL: 'https://api-one-register-users.vercel.app/'
})

export default api;