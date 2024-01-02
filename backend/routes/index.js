const express = require('express');
const Student = require('../models/Student')
const Admin = require('../models/Admin');
const router = express.Router();
const jwt = require('jsonwebtoken');
const { sendResetLinkEmail, generateResetToken } = require('../utils/utils');
const authenticate = require('../middleware/auth');

router.post('/admin/create', async (req, res) => {
    try {
        const { name, email, mobileNumber, password } = req.body;
        const isExisting = await Admin.findOne({ email });
        if (isExisting) {
            return res.status(400).json({ message: "Admin with this email already exists" });
        }
        const newAdmin = new Admin({
            name,
            email,
            mobileNumber,
            password
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
        //for one hour
        admin.resetTokenExpiration = Date.now() + 60 * 60 * 1000;
        await admin.save();
        const resetLink = `http://localhost:3000/forgot-password/${resetToken}`;
        const emailContent = `Click the following link to reset your password: ${resetLink}`;
        await sendResetLinkEmail(email, 'Reset Password Link', emailContent);

        return res.status(200).json({ message: 'Reset password email sent successfully' });
    }
    catch (err) {
        console.log(err);
        return res.status(500).json({ message: "Internal Server Error" });
    }
});

router.post('/admin/verify-link', async (req, res) => {
    const { token } = req.body;

    try {
        const admin = await Admin.findOne({
            resetToken: token,
            resetTokenExpiration: { $gt: Date.now() },
        });
        if (!admin) {
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
        const { token, newPassword } = req.body;
        const admin = await Admin.findOne({
            resetToken: token,
            resetTokenExpiration: { $gt: Date.now() },
        });
        if (!admin) {
            return res.status(401).json({ message: 'Invalid or expired reset token' });
        }
        admin.password = newPassword;
        admin.resetToken = undefined;
        admin.resetTokenExpiration = undefined;
        await admin.save();
        return res.status(200).json({ message: 'Password reset successfully, Please Log In' });
    }
    catch (err) {
        return res.status(500).json({ message: "Internal Server Error" });
    }
})

module.exports = router;