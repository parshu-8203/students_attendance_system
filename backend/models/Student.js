const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const studentSchema = new Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  mobileNumber: { type: String, required: true },
  password: { type: String, required: true },
  rollNumber: { type: String, required: true, unique: true },
  resetToken: { type: String },
  resetTokenExpiration: { type: Date },
});

const Student = mongoose.model('Student', studentSchema);

module.exports = Student;
