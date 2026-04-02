import mongoose from "mongoose";

const facultySchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true,
    unique: true
  },
  mobile: {
    type: String,
    unique:true
  },
  department: {
    type: String,
    required: true
  },
  password: {
    type: String,
    required: true,
  },
  role: {
    type: String,
    default: "FACULTY",
    enum: ["FACULTY"]
  },
  createdByHod: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Hod"
  },
   otp: String,
  otpExpiry: Date
}, { timestamps: true });

export default mongoose.model("Faculty", facultySchema);