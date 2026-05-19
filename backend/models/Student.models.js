import mongoose from "mongoose";

const studentSchema =
  new mongoose.Schema({

    name: {
      type: String,
      required: true,
    },

    email: {
      type: String,
      required: true,
      unique: true,
    },

    regNumber: {
      type: String,
      required: true,
      unique: true,
    },

    department: {
      type: String,
      required: true,
    },

    password: {
      type: String,
      default: null,
    },

    semester: {
      type: Number,
      required: true,
    },

    // PROFILE IMAGE
    profileImage: {
      type: String,
      default: "",
    },

    otp: {
  type: String,
},

otpExpiry: {
  type: Date,
},

isVerified: {
  type: Boolean,
  default: false,
},

  },
  {
    timestamps: true,
  });

const Student =
  mongoose.models.Student ||
  mongoose.model(
    "Student",
    studentSchema
  );

export default Student;