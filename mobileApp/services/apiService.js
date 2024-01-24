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

export const sendResetLinkEmail = async (data) => {
    try {
        const response = await api.post('/student/reset-link', data);
        return response.data;
    }
    catch (err) {
        throw err.response ? err.response.data : err.message;
    }
}

export const validateQR = async (qrCode) => {
    try {
        const response = await api.post('/student/validate-qr', { qrCode });
        console.log(response.data);
        return response.data;
    }
    catch (err) {
        throw err.response ? err.response.data : err.message;
    }
}

export const markAttendance = async (studentId) => {
    try {
        console.log("mark attendace student id", studentId);
        const response = await api.post('/student/mark-attendance', {}, {
            headers: {
                Authorization: studentId
            }
        });
        console.log(response.data);
        return response.data;
    }
    catch (err) {
        throw err.response ? err.response.data : err.message;
    }
}

export const fetchAttendanceRecords = async (token) => {
    try {
        const response = await api.get('/student/get-students', {
            headers: {
                Authorization: token
            }
        });
        return response;
    }
    catch (err) {
        throw err.response ? err.response.data : err.message;
    }
}

export const fetchStudentDetails = async (token) => {
    try {
        const response = await api.get('/student/get-details', {
            headers: {
                Authorization: token
            }
        });
        return response;
    }
    catch (err) {
        throw err.response ? err.response.data : err.message;
    }
}
export const fetchAttendanceSummary = async(token)=>{
    try {
        const response = await api.get('/student/get-summary', {
            headers: {
                Authorization:token
            }
        });
        
        return response;
    }
    catch(err) {
        throw err.response ? err.response.data : err.message;
    }
}