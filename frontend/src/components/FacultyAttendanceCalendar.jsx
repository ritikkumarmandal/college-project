/*import {
  useEffect,
  useState,
} from "react";

import Calendar from "react-calendar";

import "react-calendar/dist/Calendar.css";

import {

  getAttendanceDates,

  getAttendanceByDate,

  downloadReport,

} from "../services/authService";

const FacultyAttendanceCalendar = ({
  subjectId,
}) => {

  const [dates, setDates] =
    useState([]);

  const [students,
    setStudents] =
    useState([]);

  const [selectedDate,
    setSelectedDate] =
    useState("");


    



  // LOAD DATES
  useEffect(() => {

    if (subjectId) {

      fetchDates();

    }

  }, [subjectId]);

  const fetchDates =
    async () => {

      try {

        const res =
          await getAttendanceDates(
            subjectId
          );

        setDates(res.data);

      } catch (error) {

        console.log(error);

      }
    };

  // DATE CLICK
  const handleDateClick =
    async (date) => {

      const formattedDate =
        new Date(
          date.getTime() -
          date.getTimezoneOffset() *
            60000
        )
          .toISOString()
          .split("T")[0];

      const found =
        dates.find(
          (d) =>
            d.date ===
            formattedDate
        );

      // No attendance
      if (!found) return;

      try {

        const res =
          await getAttendanceByDate(
            subjectId,
            formattedDate
          );

        setStudents(
          res.data.students
        );

        setSelectedDate(
          formattedDate
        );

      } catch (error) {

        console.log(error);

      }
    };

  // COLOR
  const tileClassName = ({
    date,
  }) => {

    const formattedDate =
      new Date(
        date.getTime() -
        date.getTimezoneOffset() *
          60000
      )
        .toISOString()
        .split("T")[0];

    const found =
      dates.find(
        (d) =>
          d.date ===
          formattedDate
      );

    if (!found) return null;

    return found.status ===
      "Present"
      ? "present-date"
      : "absent-date";
  };

  return (

    <div className="bg-white p-6 rounded-xl shadow">

      <h2 className="text-3xl font-bold mb-6">

        Attendance Calendar

      </h2>

      <Calendar
        tileClassName={
          tileClassName
        }
        onClickDay={
          handleDateClick
        }
      />

      {/* STUDENTS }

      {students.length > 0 && (

        <div className="mt-8">

          <h2 className="text-2xl font-bold mb-5">

            Present Students

          </h2>

          <p className="mb-5 font-semibold">

            Date:
            {" "}
            {selectedDate}

          </p>

          <div className="space-y-4">

            {students.map(
              (
                student,
                index
              ) => (

                <div
                  key={index}
                  className="border p-4 rounded-xl flex justify-between items-center bg-green-50"
                >

                  <div>

                    <h2 className="font-bold text-lg">

                      {
                        student.name
                      }

                    </h2>

                    <p>

                      Reg No:
                      {" "}
                      {
                        student.regNumber
                      }

                    </p>

                  </div>

                  <h2 className="text-green-600 font-bold">

                    Present

                  </h2>

                </div>

              )
            )}

          </div>

        </div>

      )}

    </div>
  );
};

export default FacultyAttendanceCalendar;*/



import {
  useEffect,
  useState,
} from "react";

import Calendar from "react-calendar";

import "react-calendar/dist/Calendar.css";

import {
  getAttendanceDates,
  getAttendanceByDate,
  downloadReport,
} from "../services/authService";

const FacultyAttendanceCalendar = ({
  subjectId,
}) => {

  const [dates, setDates] =
    useState([]);

  const [students,
    setStudents] =
    useState([]);

  const [selectedDate,
    setSelectedDate] =
    useState("");

  const [reportType,
    setReportType] =
    useState("daily");

  // LOAD ATTENDANCE DATES
  useEffect(() => {

    if (subjectId) {

      fetchDates();

    }

  }, [subjectId]);

  const fetchDates =
    async () => {

      try {

        const res =
          await getAttendanceDates(
            subjectId
          );

        setDates(res.data);

      } catch (error) {

        console.log(error);

      }
    };

  // DATE CLICK
  const handleDateClick =
    async (date) => {

      const formattedDate =
        new Date(
          date.getTime() -
          date.getTimezoneOffset() *
            60000
        )
          .toISOString()
          .split("T")[0];

      const found =
        dates.find(
          (d) =>
            d.date ===
            formattedDate
        );

      // Attendance nahi hai
      if (!found) {

        setStudents([]);
        setSelectedDate("");

        return;
      }

      try {

        const res =
          await getAttendanceByDate(
            subjectId,
            formattedDate
          );

        // Sirf Present students
        const presentStudents =
          res.data.students.filter(
            (s) =>
              s.status ===
              "Present"
          );

        setStudents(
          presentStudents
        );

        setSelectedDate(
          formattedDate
        );

      } catch (error) {

        console.log(error);

      }
    };

  // DATE COLORS
  const tileClassName = ({
    date,
  }) => {

    const formattedDate =
      new Date(
        date.getTime() -
        date.getTimezoneOffset() *
          60000
      )
        .toISOString()
        .split("T")[0];

    const found =
      dates.find(
        (d) =>
          d.date ===
          formattedDate
      );

    if (!found) return null;

    return found.status ===
      "Present"
      ? "present-date"
      : "absent-date";
  };

  // DOWNLOAD REPORT
  const handleDownload =
  async () => {

    // Daily report ke liye date required
    if (
      reportType === "daily" &&
      !selectedDate
    ) {

      alert(
        "Please select a date first"
      );

      return;
    }

    try {

      const res =
        await downloadReport(
          subjectId,
          reportType,
          selectedDate
        );

      const url =
        window.URL.createObjectURL(
          new Blob([res.data])
        );

      const link =
        document.createElement("a");

      link.href = url;

      link.setAttribute(
        "download",
        `${reportType}-attendance-report.xlsx`
      );

      document.body.appendChild(
        link
      );

      link.click();

    } catch (error) {

      console.log(error);

    }
  };

  return (

    <div className="bg-white p-6 rounded-2xl shadow-xl">

      {/* HEADER */}

      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-8">

        <div>

          <h2 className="text-3xl font-bold text-gray-800">

            Attendance Calendar

          </h2>

          <p className="text-gray-500 mt-1">

            Green = Attendance Marked

          </p>

        </div>

        {/* REPORT DOWNLOAD */}

        <div className="flex gap-3">

          <select
            value={reportType}
            onChange={(e) =>
              setReportType(
                e.target.value
              )
            }
            className="border px-4 py-2 rounded-lg outline-none"
          >

            <option value="daily">

              Daily Report

            </option>

            <option value="weekly">

              Weekly Report

            </option>

            <option value="monthly">

              Monthly Report

            </option>

          </select>

          <button
            onClick={
              handleDownload
            }
            className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2 rounded-lg font-semibold transition"
          >

            Download Excel

          </button>

        </div>

      </div>

      {/* CALENDAR */}

      <div className="bg-gray-50 p-4 rounded-2xl">

        <Calendar
          tileClassName={
            tileClassName
          }
          onClickDay={
            handleDateClick
          }
        />

      </div>

      {/* LEGEND */}

      <div className="flex gap-6 mt-5">

        <div className="flex items-center gap-2">

          <div className="w-5 h-5 bg-green-500 rounded-full"></div>

          <span className="font-medium">

            Attendance Marked

          </span>

        </div>

      </div>

      {/* STUDENT LIST */}

      {students.length > 0 && (

        <div className="mt-10">

          <div className="flex items-center justify-between mb-6">

            <div>

              <h2 className="text-2xl font-bold text-gray-800">

                Present Students

              </h2>

              <p className="text-gray-500 mt-1">

                Date:
                {" "}
                {selectedDate}

              </p>

            </div>

            <div className="bg-green-100 text-green-700 px-4 py-2 rounded-lg font-bold">

              Total:
              {" "}
              {
                students.length
              }

            </div>

          </div>

          <div className="grid gap-4">

            {students.map(
              (
                student,
                index
              ) => (

                <div
                  key={index}
                  className="bg-green-50 border border-green-200 p-5 rounded-2xl flex items-center justify-between hover:shadow-md transition"
                >

                  {/* LEFT */}

                  <div>

                    <h2 className="text-xl font-bold text-gray-800">

                      {
                        student.name
                      }

                    </h2>

                    <p className="text-gray-600 mt-1">

                      Registration No:
                      {" "}
                      {
                        student.regNumber
                      }

                    </p>

                  </div>

                  {/* RIGHT */}

                  <div className="bg-green-500 text-white px-5 py-2 rounded-full font-bold">

                    Present

                  </div>

                </div>

              )
            )}

          </div>

        </div>

      )}

      {/* NO STUDENT */}

      {selectedDate &&
        students.length === 0 && (

          <div className="mt-10 bg-red-50 border border-red-200 p-6 rounded-2xl text-center">

            <h2 className="text-xl font-bold text-red-600">

              No Present Students

            </h2>

          </div>

        )}

    </div>
  );
};

export default FacultyAttendanceCalendar;