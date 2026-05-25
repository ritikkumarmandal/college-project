import mongoose from "mongoose";

const otpSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      required: [true, "Email is required"],
    },

    role: {
      type: String,
      enum: ["HOD", "FACULTY", "STUDENT"],
      required: [true, "Role is required"],
    },

    otpHash: {
      type: String,
      required: [true, "OTP hash is required"],
    },
    createdAt: {
  type: Date,
  default: Date.now,
  expires: 300,
}
  },
  {
    timestamps: true,
  }
);

const OtpModel = mongoose.model("Otp", otpSchema);

export default OtpModel;