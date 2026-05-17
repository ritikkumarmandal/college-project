import mongoose from "mongoose";

const classAssignSchema =
  new mongoose.Schema(

    {

      department: {
        type: String,
        required: true,
      },

      semester: {
        type: Number,
        required: true,
      },

      subject: {
        type:
          mongoose.Schema.Types
            .ObjectId,

        ref: "Subject",

        required: true,
      },

      // FACULTY
      faculty: {

        type:
          mongoose.Schema.Types
            .ObjectId,

        ref: "Faculty",

        default: null,

      },

      // HOD
      hod: {

        type:
          mongoose.Schema.Types
            .ObjectId,

        ref: "Hod",

        default: null,

      },

      // WHO IS TEACHING
      assignedRole: {

        type: String,

        enum: [
          "Faculty",
          "Hod",
        ],

        required: true,

      },

    },

    { timestamps: true }

  );

export default mongoose.model(
  "ClassAssign",
  classAssignSchema
);