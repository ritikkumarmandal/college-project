import mongoose from "mongoose";

const studentSchema = new mongoose.Schema({

  name:{
    type:String,
    required:true
  },

  email:{
    type:String,
    required:true,
    unique:true
  },
  regNumber:{
    type:String,
    require:true,
    unique:true
  },

  department:{
    type:String,
    required:true
  },

  semester:{
    type:Number,
    required:true
  }

},{timestamps:true});

export default mongoose.model("Student",studentSchema);