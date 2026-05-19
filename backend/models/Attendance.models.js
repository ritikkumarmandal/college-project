import mongoose
from "mongoose";

const attendanceSchema =
  new mongoose.Schema({

    markedBy: {

      type:
        mongoose.Schema.Types.ObjectId,

      required: true,

      refPath:
        "markedByRole",

    },

    markedByRole: {

      type: String,

      required: true,

      enum: [
        "Faculty",
        "Hod",
      ],

    },

    subject: {

      type:
        mongoose.Schema.Types.ObjectId,

      ref: "Subject",

      required: true,

    },

    department: String,

    semester: Number,

    date: {

  type: Date,

  default:
    Date.now,

},

    students: [

      {

        student: {

          type:
            mongoose.Schema.Types.ObjectId,

          ref: "Student",

        },

        regNumber: {

          type: String,

          required: true,

        },

        name: String,

        status: {

          type: String,

          enum: [
            "Present",
            "Absent",
          ],

          default:
            "Absent",

        },

      },

    ],

  },

  {
    timestamps: true,
  }

);

export default
mongoose.model(
  "Attendance",
  attendanceSchema
);