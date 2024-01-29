const express = require('express');
const Student = require('../models/Student')
const Admin = require('../models/Admin');
const router = express.Router();
const jwt = require('jsonwebtoken');
const QRcode = require('qrcode');
const fs = require('fs');
const jsQR = require('jsqr');

const { sendResetLinkEmail, generateResetToken, generateRandomString } = require('../utils/utils');
const jwtMiddleware = require('../middleware/auth.js');
const Attendance = require('../models/Attendance.js');
function extractDataFromQRCodeImage(filePath) {
    
    const imageBuffer = fs.readFileSync(filePath);

    
    const code = jsQR(imageBuffer, imageBuffer.length);

    if (code) {
        return code.data;
    } else {
        throw new Error('QR code decoding failed.');
    }
}
router.post('/admin/create', async (req, res) => {
    try {
        const { name, email, mobileNumber, password } = req.body;
        const count = 0;
        const isExisting = await Admin.findOne({ email });
        if (isExisting) {
            return res.status(400).json({ message: "Admin with this email already exists" });
        }
        const newAdmin = new Admin({
            name,
            email,
            mobileNumber,
            password,
            count
        });
        await newAdmin.save();
        return res.status(201).json({ message: "Admin Created Successfully" });
    }
    catch (err) {
        console.log(err);
        return res.status(500).json({ message: "Internal Server Error" });
    }
})
router.post("/admin/login", async (req, res) => {
    try {
        const { email, password } = req.body;
        const adminRecord = await Admin.findOne({ email });
        if (!adminRecord) {
            res.status(400).json({ message: "Given Email Id doesn't exists" });
        }
        else {
            if (password === adminRecord.password) {
                const token = jwt.sign({ email: adminRecord.email }, process.env.SECRET_KEY);
                return res.status(200).json({ message: "Login Successful", token });
            }
            else {
                res.status(400).json({ message: "Password Incorrect" });
            }
        }
    }
    catch (err) {
        res.status(500).json({ message: "Internal Server Error" });
    }
})
router.post('/admin/forgot-password', async (req, res) => {
    try {
        const { email } = req.body;
        const admin = await Admin.findOne({ email });
        if (!admin) {
            return res.status(404).json({ message: "Admin Not Found" });
        }

        const resetToken = generateResetToken();
        admin.resetToken = resetToken;
      
        admin.resetTokenExpiration = Date.now() + 60 * 60 * 1000;
        await admin.save();
        const resetLink = `http://localhost:3000/forgot-password/${resetToken}`;
        const emailContent = `Click the following link to reset your password: ${resetLink}`;
        await sendResetLinkEmail(email, 'Reset Password Link', emailContent);

        return res.status(200).json({ message: 'Reset password email sent successfully' });
    }
    catch (err) {
       
        return res.status(500).json({ message: "Internal Server Error" });
    }
});

router.post('/admin/verify-link', async (req, res) => {
    const { token, isStudent } = req.body;

    try {
        let record;
        if (!isStudent) {
            record = await Admin.findOne({
                resetToken: token,
                resetTokenExpiration: { $gt: Date.now() },
            });
        }
        else {
            record = await Student.findOne({
                resetToken: token,
                resetTokenExpiration: { $gt: Date.now() },
            })
        }
        if (!record) {
            throw new Error('Invalid or expired reset token');
        }
        res.status(200).json({ message: 'Reset token verified successfully' });
    } catch (error) {
        console.log(error);
        return res.status(401).json({ message: 'Invalid or expired reset token' });
    }
})

router.post("/admin/reset-password", async (req, res) => {
    try {
        const { token, newPassword, isStudent } = req.body;
        let record;
        if (!isStudent) {
            record = await Admin.findOne({
                resetToken: token,
                resetTokenExpiration: { $gt: Date.now() },
            });
        }
        else {
            record = await Student.findOne({
                resetToken: token,
                resetTokenExpiration: { $gt: Date.now() },
            })
        }
        if (!record) {
            return res.status(401).json({ message: 'Invalid or expired reset token' });
        }
        record.password = newPassword;
        record.resetToken = undefined;
        record.resetTokenExpiration = undefined;
        await record.save();
        return res.status(200).json({ message: 'Password reset successfully, Please Log In' });

    }
    catch (err) {
        return res.status(500).json({ message: "Internal Server Error" });
    }
})

router.post('/admin/add-student', jwtMiddleware.authenticate, async (req, res) => {
    try {
        
        const { name, email, password, mobileNumber } = req.body;
        const token = req.headers.authorization;

        const student = await Student.findOne({ email });
        if (student) {
            return res.status(401).json({ message: "Student already Exist" })
        }
        const decoded_email = jwt.verify(token, process.env.SECRET_KEY);
        const admin = await Admin.findOne({ email: decoded_email.email });
        admin.count = admin.count + 1;
        const rn = "S" + admin.count;
        await admin.save();
        const newStudent = new Student({
            name,
            email,
            mobileNumber,
            password,
            rollNumber: rn,
        })
        await newStudent.save();
        const emailContent = `Hello ${name}!,\n Please log in using this credentials\n Email : ${email}\n Password : ${password}\n Roll Number : ${rn}`
        await sendResetLinkEmail(email, 'Student Credentials', emailContent);
        return res.status(200).json({ message: "Student Created and Sent Mail Successfully" });
    }
    catch (err) {
        console.log(err);
        return res.status(500).json({ message: "Internal server Error" });
    }
})

router.get('/admin/generate-qrcode', jwtMiddleware.authenticate, async (req, res) => {
    try {
        const { email } = req.admin;
        const adminRecord = await Admin.findOne({ email });
        if (!adminRecord) {
            return res.status(400).json({ message: "Admin not found" });
        }
        const sessionID = generateRandomString();
        adminRecord.sessionToken = sessionID;
        await adminRecord.save();
        return res.status(200).json({ sessionID });
    }
    catch (err) {
        return res.status(500).json({ message: "Internal Server Error" });
    }
})

router.post('/student/login', async (req, res) => {
    try {
        const { email, password } = req.body;
        const studentData = await Student.findOne({ email });
        if (!studentData) {
            return res.status(400).json({ message: "Student doesn't exist" });
        }
        if (studentData.password === password) {
            const token = jwt.sign({ email: studentData.email }, process.env.SECRET_KEY);
            return res.status(200).json({ message: "Student Login Successful", token });
        }
        return res.status(400).json({ message: "Invalid Password" });
    }
    catch (err) {
       
        return res.status(500).json({ message: "Internal Server Error" });
    }
})


router.post('/student/reset-link', async (req, res) => {
    try {
        const { email } = req.body;
        const studentData = await Student.findOne({ email });
        if (!studentData) {
            return res.status(400).json({ message: "Student doesn't exist" });
        }
        const resetToken = generateResetToken();
        studentData.resetToken = "stu" + resetToken;
        studentData.resetTokenExpiration = Date.now() + 60 * 60 * 1000;
        await studentData.save();
        const resetLink = `http://localhost:3000/forgot-password/${studentData.resetToken}`;
        const emailContent = `Click the following link to reset your password: ${resetLink}`;
        await sendResetLinkEmail(email, 'Reset Password Link', emailContent);
        return res.status(200).json({ message: 'Reset password email sent successfully' });
    }
    catch (err) {
        console.log(err);
        return res.status(500).json({ message: "Internal server Error" });
    }
})

router.post('/student/mark-attendance', jwtMiddleware.authenticate, async (req, res) => {
    try {
        const { email } = req.admin;
       

        const { _id } = await Student.findOne({ email });
       
        const studentId = _id;

        let currentDate = new Date();
        currentDate.setMinutes(currentDate.getMinutes() + 330);

        let refDate = new Date();
        refDate.setMinutes(refDate.getMinutes() + 330);

        let message = "Attendance Marked";

        let attendanceRecord = await Attendance.findOne({
            studentId,
            date: { $gte: new Date(refDate.setHours(0, 0, 0, 0)) },
        });

        if (!attendanceRecord) {
            attendanceRecord = new Attendance({
                studentId,
                date: new Date(),
                inTime: currentDate.toISOString().slice(11, 19), // Extracting time part
            });
        } else if (attendanceRecord.inTime && attendanceRecord.outTime) {
            return res.status(400).json({ message: "Attendance already marked" });
        } else if (attendanceRecord.inTime && !attendanceRecord.outTime) {
            attendanceRecord.outTime = currentDate.toISOString().slice(11, 19); // Extracting time part
            attendanceRecord.status = true;
            message = "Out Attendance Marked";
        } else {
            attendanceRecord.inTime = currentDate.toISOString().slice(11, 19); // Extracting time part
            message = "In Attendance Marked";
        }

        await attendanceRecord.save();
        return res.status(200).json({ message });
    } catch (err) {
        console.error(err);
        return res.status(500).json({ message: "Internal server error" });
    }
});

router.get('/admin/set-student-records', async (req, res) => {
    try {
        let date = new Date();
        let refDate = new Date();
        
        date.setMinutes(date.getMinutes() + 330);
        refDate.setMinutes(date.getMinutes() + 330);
       
        const students = await Student.find({}, '_id');
        for (const student of students) {
            let attendanceRecord = await Attendance.findOne({
                studentId: student._id,
                date: { $gte: refDate.setHours(0, 0, 0, 0) },
            });
            if (!attendanceRecord) {
                attendanceRecord = new Attendance({
                    studentId: student._id,
                    date: date,
                    inTime: null,
                    outTime: null,
                })
            }
            if (attendanceRecord.inTime && attendanceRecord.outTime) {
                attendanceRecord.status = true;
            }
            else {
                attendanceRecord.status = false;
            }
            const result = await attendanceRecord.save();
        }
        return res.status(200).json({ message: "All Records Created" });
    }
    catch (err) {
       
        return res.status(500).json({ message: "Internal Server Error" });
    }
})


router.post('/admin/attendance/search-by-rollNumber', async (req, res) => {
    try {

        const { rollNumber } = req.body;
        const student = await Student.findOne({ rollNumber });

        if (!student) {
            return res.status(404).json({ message: 'Student not found with the provided rollNumber.' });
        }

        const attendanceRecords = await Attendance.find({ studentId: student._id })
            .populate('studentId')
            .exec();
        const result = attendanceRecords.map(record => ({
            rollNumber: rollNumber,
            _id: record._id,
            date: record.date,
            inTime: record.inTime,
            outTime: record.outTime,
            status: record.status,
            name: record.studentId.name,
        }));
        return res.status(200).json(result);
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: 'Internal Server Error' });
    }
});

router.post('/admin/attendance/search-by-date', async (req, res) => {
    try {
        const { date } = req.body;
        const attendanceRecords = await Attendance.find({
            date: {
                $gte: new Date(date), 
                $lt: new Date(new Date(date).setDate(new Date(date).getDate() + 1))
            }
        })
            .populate('studentId')
            .exec();
        const result = attendanceRecords.map(record => ({
            _id: record._id,
            name: record.studentId.name,
            rollNumber: record.studentId.rollNumber,
            status: record.status,
            inTime: record.inTime,
            outTime: record.outTime,
            date: date,
        }))
        return res.status(200).json(result);
    }
    catch (err) {
       
        res.status(500).json({ message: "Internal Server Error" })
    }
})

router.post('/student/validate-qr', async (req, res) => {
    try {
        const { qrCode } = req.body;
        const result = await Admin.findOne({ sessionToken: qrCode });
        if (result) {
            return res.status(200).json({ message: "Valid QR Code" });
        }
        return res.status(400).json({ message: "Invalid QR Code" }); s
    } catch (err) {
        return res.status(500).json({ message: 'Internal server error' });
    }
});

router.get('/student/get-students', jwtMiddleware.authenticate, async (req, res) => {
    try {
        const { email } = req.admin;
        const studentRecord = await Student.findOne({ email });
        if (!studentRecord)
            return res.status(400).json({ message: "Student Not Found" });
        const id = studentRecord._id;
        const attendanceRecords = await Attendance.find({ studentId: id }).sort({ date: 'desc' });
        return res.status(200).json(attendanceRecords);
    }
    catch (err) {
        return res.status(500).json({ message: "Internal Server Error" });
    }

})
router.get('/student/get-details', jwtMiddleware.authenticate, async (req, res) => {
    try {
        const { email } = req.admin;
        const studentRecord = await Student.findOne({ email });
        if (!studentRecord)
            return res.status(400).json({ message: "Student not found" });
        return res.status(200).json(studentRecord);
    }
    catch (err) {
        return res.status(500).json({ message: "Internal Server Error" });
    }
})
router.get('/student/get-summary', jwtMiddleware.authenticate, async (req, res) => {
    try {
        const { email } = req.admin;
        const { id } = await Student.findOne({ email });
        const attendaceRecords = await Attendance.find({ studentId: id });
        const totalClasses = attendaceRecords.length;
        const attendedClasses = attendaceRecords.filter(record => record.status).length;
        return res.status(200).json({ totalClasses, attendedClasses });
    }
    catch (err) {
        return res.status(500).json({ message: "Internal Server Error" })
    }
})
router.put('/admin/set-attendance-status/', async (req, res) => {
    try {
        const { id, status } = req.body;

        if (status !== "true" && status !== "false") {
            return res.status(400).json({ error: 'Invalid status value' });
        }
        const updatedAttendance = await Attendance.findByIdAndUpdate(
            id,
            { $set: { status } },
            { new: true }
        );

        if (!updatedAttendance) {
            return res.status(404).json({ message: 'Attendance record not found' });
        }
        res.status(200).json(updatedAttendance);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

router.put('/admin/update-student', async (req, res) => {
    try {
        const { rollNumber, name, email, mobileNumber, password } = req.body;
        const existingStudent = await Student.findOne({ rollNumber });

        if (!existingStudent) {
            return res.status(404).json({ message: 'Student not found' });
        }

        existingStudent.name = name;
        existingStudent.email = email;
        existingStudent.mobileNumber = mobileNumber;
        existingStudent.password = password;

        const updatedStudent = await existingStudent.save();

        res.status(200).json({ message: "Updated Successfully" });
    } catch (error) {
        console.error('Error updating student:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
});
router.post('/admin/fetch-student', async (req, res) => {
    try {

        const { rollNumber } = req.body;
        
        const studentRecord = await Student.findOne({ rollNumber });
        if (studentRecord) {
            return res.status(200).json(studentRecord);
        }
        return res.status(400).json({ message: "Student with this Roll Number Not Found" })
    }
    catch (err) {

        res.status(500).json({ message: "Internal Server Error" });
    }
})
router.delete('/admin/delete-student/:rollNumber', async (req, res) => {
    try {
        const { rollNumber } = req.params;
        const existingStudent = await Student.findOne({ rollNumber });

        if (!existingStudent) {
            return res.status(404).json({ message: 'Student not found' });
        }
        await Student.deleteOne({ rollNumber });
        return res.status(200).json({ message: 'Student deleted successfully' });
    } catch (error) {
        console.error('Error deleting student:', error);
        return res.status(500).json({ message: 'Internal server error' });
    }
});

router.get('/admin/fetch-details', jwtMiddleware.authenticate, async (req, res) => {
    try {
        const { email } = req.admin;
        const adminRecord = await Admin.findOne({ email });
        return res.status(200).json(adminRecord);
    } catch (error) {
        return res.status(500).json({ message: "Internal Server Error" })
    }
})
module.exports = router;