import mongoose from "mongoose";

const attendanceSchema = new mongoose.Schema({
  faculty: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Faculty",
    required: true
  },

  subject: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Subject",
    required: true
  },

  department: String,
  semester: Number,

  date: {
    type: Date,
    default: Date.now
  },

  students: [
    
  {
    student: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Student"
    },

    regNumber: {
      type: String,
      required: true
    },

    name: String,

    status: {
      type: String,
      enum: ["Present", "Absent"],
      default: "Absent"
    }
  }
]
 

}, { timestamps: true });

export default mongoose.model("Attendance", attendanceSchema);