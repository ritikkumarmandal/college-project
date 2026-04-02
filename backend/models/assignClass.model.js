import mongoose from "mongoose";

const assignClassSchema = new mongoose.Schema({
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

  department: {
    type: String,
    required: true
  },

  semester: {
    type: Number,
    required: true
  }

}, { timestamps: true });

export default mongoose.model("AssignClass", assignClassSchema);