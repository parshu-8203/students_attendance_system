import axios from 'axios';
const baseURL = "http://192.168.0.108:5000";

const api = axios.create({
    baseURL,
})

export const studentLogin = async (data) => {
    try {
        const response = await api.post('/student/login', data);

        return response.data;
    }
    catch (err) {
        throw err.response ? err.response.data : err.message;
    }
}

export const sendResetLinkEmail = async(data) => {
    try {
        const response = await api.post('/student/reset-link', data);
        return response.data;
    }
    catch(err)
    {
        throw err.response ? err.response.data : err.message;
    }
}