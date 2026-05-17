import { useState } from "react";

import {
  getStudentAttendance
} from "../services/authService";

function ShowAttendance() {

  const [attendance, setAttendance] = useState([]);

  const fetchAttendance = async () => {

    try {

      const res =
        await getStudentAttendance();

      setAttendance(
        res.data.attendance || []
      );

    } catch (error) {

      console.log(error);

      alert(
        "Failed to load attendance"
      );
    }
  };

  return (

    <div className="p-6">

      {/* HEADER */}

      <div className="flex items-center justify-between mb-6">

        <h2 className="text-3xl font-bold">
          My Attendance
        </h2>

        <button
          onClick={fetchAttendance}
          className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-3 rounded-xl font-semibold"
        >
          Show Attendance
        </button>

      </div>

      {/* SUBJECT CARDS */}

      <div className="space-y-6">

        {attendance.map((a, index) => {

          const absent =
            a.totalClasses -
            a.presentClasses;

          return (

            <div
              key={index}
              className="bg-white border-2 border-gray-200 rounded-3xl p-6 shadow-sm"
            >

              {/* SUBJECT NAME */}

              <h2 className="text-3xl font-bold mb-6 lowercase">

                {a.subject}

              </h2>

              {/* CARDS */}

              <div className="grid grid-cols-1 md:grid-cols-4 gap-5">

                {/* TOTAL */}

                <div className="bg-blue-100 rounded-3xl p-6">

                  <h3 className="text-2xl font-bold">
                    Total Classes
                  </h3>

                  <p className="text-5xl mt-3">
                    {a.totalClasses}
                  </p>

                </div>

                {/* PRESENT */}

                <div className="bg-green-100 rounded-3xl p-6">

                  <h3 className="text-2xl font-bold">
                    Present
                  </h3>

                  <p className="text-5xl mt-3">
                    {a.presentClasses}
                  </p>

                </div>

                {/* ABSENT */}

                <div className="bg-red-100 rounded-3xl p-6">

                  <h3 className="text-2xl font-bold">
                    Absent
                  </h3>

                  <p className="text-5xl mt-3">
                    {absent}
                  </p>

                </div>

                {/* PERCENTAGE */}

                <div className="bg-yellow-100 rounded-3xl p-6">

                  <h3 className="text-2xl font-bold">
                    Percentage
                  </h3>

                  <p className="text-5xl mt-3">
                    {a.percentage}%
                  </p>

                </div>

              </div>

            </div>

          );
        })}

      </div>

    </div>
  );
}

export default ShowAttendance;