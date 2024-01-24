
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

export const verifyResetToken = async (token) => {
    try {
        let isStudent = false;
        if (token.startsWith("stu")) {
            isStudent = true;
            const response = await api.post('/admin/verify-link', { token, isStudent })
            return response;
        }
        const response = await api.post('/admin/verify-link', { token, isStudent })
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

export const addStudent = async (data) => {
    console.log(data);
    try {
        const response = await api.post('/admin/add-student', data, {
            headers: {
                Authorization: data.token
            }
        });
        console.log(response.data);
        return response.data;
    }
    catch (err) {
        console.log(err.response.data);
        throw err.response ? err.response.data : err.message;
    }
}

export const generateQR = async (token) => {
    try {
        // const response = await api.get('/admin/generate-qrcode');
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

export const getStudentByRollNumber = async (rollNumber) => {
    try {
        console.log(rollNumber);
        const response = await api.post('/admin/attendance/search-by-rollNumber', { rollNumber });
        console.log(response.data);
        return response.data;
    }
    catch (err) {
        throw err.response ? err.response.data : err.message;
    }
}
export const getStudentByDate = async (date) => {
    try {
        console.log(date);
        const response = await api.post('/admin/attendance/search-by-date', { date });
        console.log(response.data);
        return response.data;

    }
    catch (err) {
        throw err.response ? err.response.data : err.message;
    }
}
export const setAttendanceStatus = async (id, status) => {
    try {
        const response = await api.put(
            '/admin/set-attendance-status/',
            { id, status },
        );
        return response.data;
    } catch (err) {
        throw err.response ? err.response.data : err.message;
    }
};

export const fetchRollNumber = async (rollNumber) => {
    try {
        console.log("Fetch Rol", rollNumber)
        const response = await api.post('/admin/fetch-student', { rollNumber });
        return response.data;
    }
    catch (err) {
        throw err.message ? err.response.data : err.message;
    }
}

export const updateStudent = async (formData) => {
    try {
        const response = await api.put('/admin/update-student', formData);
        return response;
    }
    catch (err) {
        throw err.message ? err.response.data : err.message;
    }
}
export const deleteStudent = async (formData) => {
    try {
        const { rollNumber } = formData;
        const response = await api.delete(`/admin/delete-student/${rollNumber}`);
        return response.data;
    } catch (err) {
        throw err.message ? err.response.data : err.message;
    }
};

export const fetchAdmin = async(token) => {
    try {
        const response = await api.get('/admin/fetch-details', {
            headers: {
                Authorization: token
            }
        });
        return response.data;
    }
    catch(err) {
        throw err.message ? err.response.data : err.message;
    }
}