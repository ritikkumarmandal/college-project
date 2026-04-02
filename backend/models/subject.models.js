import mongoose from "mongoose";

const subjectSchema = new mongoose.Schema(
  {
    subjectName: {
      type: String,
      required: true,
    },

    subjectCode: {
      type: String,
      required: true,
      unique: true,
    },

    department: {
      type: String,
      required: true,
    },

    semester: {
      type: Number,
      required: true,
      min: 1,
      max: 8,
    },

    createdByHod: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Hod",
    },
  },
  { timestamps: true }
);

export default mongoose.model("Subject", subjectSchema);