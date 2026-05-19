import nodemailer from "nodemailer";




const transporter =
  nodemailer.createTransport({

    service: "gmail",

    auth: {

      user: process.env.EMAIL,

      pass: process.env.EMAIL_PASS,

    },

});

export const sendAttendanceEmail =
  async (

    to,
    studentName,
    regNumber,
    subject,
    status,
    date

  ) => {

    await transporter.sendMail({

      from: process.env.EMAIL,

      to,

      subject: "Attendance Status",

      text: `Hello ${studentName},

Your attendance has been marked successfully.

Registration Number: ${regNumber}

Subject: ${subject}

Status: ${status}

Date: ${date}

Regards
Attendance Management System`

    });

};