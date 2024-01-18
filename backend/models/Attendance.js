const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const attendanceSchema = new Schema({
    studentId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Student',
        required: true,
    },
    date: {
        type: Date,
    },
    inTime: {
        type: String,
    },
    outTime: {
        type: String,
    },
    status: {
        type: Boolean,
        default: false,
    },
});
const Attendance = mongoose.model('Attendance', attendanceSchema);

module.exports = Attendance;