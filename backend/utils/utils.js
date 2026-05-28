export function generateOtp() {

  return Math.floor(

    100000 + Math.random() * 900000

  ).toString();

}
export function getOtpHtml(otp) {
    return `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>OTP Verification</title>
    <style>
        body {
            font-family: Arial, sans-serif;
            background-color: #f4f4f4;
            display: flex;
            justify-content: center;
            align-items: center;
            height: 100vh;
        }
        .container {
            background-color: #fff;
            padding: 20px;
            border-radius: 5px;
            box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
            text-align: center;
        }
        .otp {
            font-size: 24px;
            font-weight: bold;
            color: #333;
        }
    </style>
</head>
<body>
    <div class="container">
        <h2>Your OTP Code</h2>
        <p class="otp">${otp}</p>
        <p>Please use this code to verify your email address.</p>
    </div>
</body>
</html>`;
}


export function getAttendanceHtml(
  name,
  regNumber,
  subject,
  status,
  date
) {
  return `
  <!DOCTYPE html>
  <html>
  <head>
    <style>
      body{
        font-family: Arial;
        background:#f4f4f4;
        padding:20px;
      }

      .container{
        max-width:500px;
        margin:auto;
        background:white;
        padding:20px;
        border-radius:10px;
      }

      .status{
        font-size:22px;
        font-weight:bold;
        color:${
          status === "Present"
            ? "green"
            : "red"
        };
      }
    </style>
  </head>

  <body>

    <div class="container">

      <h2>Attendance Notification</h2>

      <p>Hello ${name},</p>

      <p>Your attendance has been marked.</p>

      <p><b>Registration No:</b> ${regNumber}</p>

      <p><b>Subject:</b> ${subject}</p>

      <p><b>Date:</b> ${date}</p>

      <p class="status">
        Status: ${status}
      </p>

    </div>

  </body>
  </html>
  `;
}

export function getStudentAccountHtml(
  name,
  email,
  tempPassword
) {

  return `
  <!DOCTYPE html>

  <html>

  <head>

    <style>

      body{
        font-family: Arial;
        background:#f4f4f4;
        padding:20px;
      }

      .container{
        max-width:500px;
        margin:auto;
        background:white;
        padding:20px;
        border-radius:10px;
      }

      .password{
        font-size:22px;
        font-weight:bold;
        color:#2563eb;
      }

    </style>

  </head>

  <body>

    <div class="container">

      <h2>
        Student Account Created
      </h2>

      <p>
        Hello ${name},
      </p>

      <p>
        Your student account has been
        created successfully.
      </p>

      <p>
        <b>Email:</b> ${email}
      </p>

      <p class="password">

        Temporary Password:
        ${tempPassword}

      </p>

      <p>
        Please login and change your
        password after first login.
      </p>

    </div>

  </body>

  </html>
  `;
}