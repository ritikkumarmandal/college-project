// models/Hod.js
import mongoose from "mongoose";

const hodSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  department: {
    type: String,
    required: true,
    unique: true, 
  },
   profileImage: {
      type: String,
      default: "",
    },

  role: {
    type: String,
    default: "HOD",
    enum: ["HOD"],
  },
}, { timestamps: true });

export default mongoose.model("Hod", hodSchema);



