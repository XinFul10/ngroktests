import axios from "axios";

const axiosClient = axios.create({
    baseURL: `${import.meta.env.VITE_API_BASE_URL}`
})

axiosClient.interceptors.request.use((config) => {
    const token = localStorage.getItem('ACCESS_TOKEN');
    config.headers.Authorization = `Bearer ${token}`
    return config;
})

axiosClient.interceptors.response.use((response) => {
    return response;
}, (error) => {
    try {
        const { response } = error;
        if (response) {
            if (response.status === 401) {
                localStorage.removeItem('ACCESS_TOKEN')
            }
        } else {
            // Network or CORS error: response is undefined
            console.error('Network or CORS error:', error.message);
        }
    }
    catch (e) {
        console.error(e);
    }
    throw error;
})

export default axiosClient;