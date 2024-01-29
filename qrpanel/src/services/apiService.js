
import axios from 'axios';

const baseURL = 'http://localhost:5000/';

const api = axios.create({
    baseURL,
});
export const login = async (email, password) => {
    try {
        const response = await api.post('/admin/login', { email, password });
        return response.data;
    } catch (error) {
        throw error.response ? error.response.data : error.message;
    }
};

export const sendResetPasswordEmail = async (email) => {
    try {
        const response = await api.post('/admin/forgot-password', { email });
        return response.data;
    }
    catch (error) {
        throw error.response ? error.response.data : error.message;
    }
}
export const resetPassword = async (token, newPassword) => {
    try {
        let isStudent = false;
        if (token.startsWith("stu")) {
            isStudent = true;
            const response = await api.post('/admin/reset-password', { token, newPassword, isStudent })
            return response.data;
        }
        const response = await api.post('/admin/reset-password', { token, newPassword, isStudent });
        return response.data;
    }
    catch (err) {
        throw err.response ? err.response.data : err.message;
    }
}

export const generateQR = async (token) => {
    try {
        
        const response = await api.get('/admin/generate-qrcode', {
            headers: {
                Authorization: token
            }
        });
        return response.data;
    }
    catch (err) {
        throw err.response ? err.response.data : err.message;
    }
}

export const setStudentRecords = async () => {
    try {
        const response = await api.get('/admin/set-student-records');
        return response.data;

    } catch (err) {
        throw err.response ? err.response.data : err.message;
    }
}
