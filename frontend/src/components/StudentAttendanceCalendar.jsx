import { useEffect, useState } from "react";

import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";

import {
  getStudentCalendarAttendance,
} from "../services/authService";

const StudentAttendanceCalendar = ({
  subjectId,
}) => {

  const [attendance, setAttendance] =
    useState([]);

  const [selectedData, setSelectedData] =
    useState(null);

  // Fetch Attendance
  useEffect(() => {

    if (subjectId) {
      fetchAttendance();
    }

  }, [subjectId]);

  const fetchAttendance = async () => {

    try {

      const res =
        await getStudentCalendarAttendance(
          subjectId
        );

      setAttendance(res.data);

    } catch (error) {

      console.log(
        "Attendance Fetch Error",
        error
      );

    }
  };

  // Date Color
  const tileClassName = ({ date }) => {

    const formattedDate =
  new Date(
    date.getTime() -
    date.getTimezoneOffset() * 60000
  )
    .toISOString()
    .split("T")[0];
    
    const found = attendance.find(
      (item) =>
        item.date.split("T")[0] ===
        formattedDate
    );

    if (!found) return null;

    return found.status === "Present"
      ? "present-date"
      : "absent-date";
  };

  // Date Click
  const handleDateClick = (date) => {

    const formattedDate =
      date.toISOString().split("T")[0];

    const found = attendance.find(
      (item) =>
        item.date.split("T")[0] ===
        formattedDate
    );

    setSelectedData(found);
  };

  return (
    <div className="bg-white p-5 rounded-xl shadow-md">

      <h2 className="text-2xl font-bold mb-5">
        Attendance Calendar
      </h2>

      <Calendar
        tileClassName={tileClassName}
        onClickDay={handleDateClick}
      />

      {/* Attendance Details */}
      {selectedData && (

        <div className="mt-6 border rounded-lg p-4 bg-gray-50">

          <h2 className="text-lg font-semibold">
            Date:
            {" "}
            {
              selectedData.date.split("T")[0]
            }
          </h2>

          <h2
            className={`mt-2 font-bold ${
              selectedData.status ===
              "Present"
                ? "text-green-600"
                : "text-red-600"
            }`}
          >
            Status:
            {" "}
            {selectedData.status}
          </h2>

          <h2 className="mt-2">
            Faculty:
            {" "}
            {selectedData.faculty}
          </h2>

        </div>

      )}

    </div>
  );
};

export default StudentAttendanceCalendar;