import { useState } from "react";

import {
  getStudentAttendance
} from "../services/authService";

function ShowAttendance() {

  const [attendance, setAttendance] = useState([]);

  const fetchAttendance = async () => {
    try {

      const res = await getStudentAttendance();

      setAttendance(res.data.attendance || []);

    } catch (error) {

      console.log(error);

      alert("Failed to load attendance");
    }
  };

  return (
    <div className="bg-white p-6 rounded-xl shadow">

      <h2 className="text-xl font-semibold mb-6">
        My Attendance
      </h2>

      <button
        onClick={fetchAttendance}
        className="bg-blue-600 text-white px-5 py-2 rounded"
      >
        Show Attendance
      </button>

      <table className="w-full mt-6 border-collapse">

        <thead>
          <tr className="bg-gray-100">
            <th className="p-3">Subject</th>
            <th className="p-3">Total</th>
            <th className="p-3">Present</th>
            <th className="p-3">Percentage</th>
          </tr>
        </thead>

        <tbody>

          {attendance.map((a, index) => (

            <tr key={index} className="border-b">

              <td className="p-3">{a.subject}</td>

              <td className="p-3">
                {a.totalClasses}
              </td>

              <td className="p-3">
                {a.presentClasses}
              </td>

              <td className="p-3">
                {a.percentage}%
              </td>

            </tr>
          ))}

        </tbody>

      </table>

    </div>
  );
}

export default ShowAttendance;