/*import { useState } from "react";
import ShowSubjects from "../components/ShowSubjects";
import StudentAttendance from "../components/ShowAttendance";
import StudentAttendanceCalendar from "../components/StudentAttendanceCalendar";

// 👉 tum ye components baad me banaoge


const WelcomeBanner = () => (
  <div className="bg-white p-6 rounded-xl shadow mb-6">
    <h2 className="text-xl font-semibold">
      Welcome Student 👋
    </h2>
    <p className="text-gray-500 mt-2">
      Select an option from the sidebar.
    </p>
  </div>
);

function StudentDashboard() {

  const [activePage, setActivePage] = useState("home");

  // active button style
  const menuClass = (page) =>
    `w-full text-left p-3 rounded-lg transition-all duration-200
     ${
       activePage === page
         ? "bg-blue-500 text-white"
         : "hover:bg-green-500 hover:text-white"
     }`;

  // Right content switch
  const renderContent = () => {
    switch (activePage) {

      case "subjects":
        return <ShowSubjects />;

      case "attendance":
        return <StudentAttendance />;

      case "profile":
        return <StudentAttendanceCalendar />;

      default:
        return (
          <div className="bg-white p-6 rounded-xl shadow">
            <p className="text-gray-500">
              Please select an option from sidebar.
            </p>
          </div>
        );
    }
  };

  return (
    <div className="flex min-h-screen">

      {/* SIDEBAR }
      <div className="w-64 bg-white shadow-lg p-6">

        <h1 className="text-2xl font-bold text-green-600 mb-8">
          Student Dashboard
        </h1>

        <div className="space-y-3">

          <button
            onClick={() => setActivePage("subjects")}
            className={menuClass("subjects")}
          >
            My Subjects
          </button>

          <button
            onClick={() => setActivePage("attendance")}
            className={menuClass("attendance")}
          >
            My Attendance
          </button>

          <button
            onClick={() => setActivePage("profile")}
            className={menuClass("profile")}
          >
            My Profile
          </button>

        </div>
      </div>

      {/* RIGHT CONTENT }
      <div className="flex-1 bg-gray-100 p-8">
        <WelcomeBanner />
        {renderContent()}
      </div>

    </div>
  );
}

export default StudentDashboard;*/

import { useEffect, useState } from "react";

import ShowSubjects from "../components/ShowSubjects";
import StudentAttendance from "../components/ShowAttendance";
import StudentAttendanceCalendar from "../components/StudentAttendanceCalendar";

import {
  getStudentSubjects,
} from "../services/authService";

const WelcomeBanner = () => (
  <div className="bg-white p-6 rounded-xl shadow mb-6">

    <h2 className="text-xl font-semibold">
      Welcome Student 👋
    </h2>

    <p className="text-gray-500 mt-2">
      Select an option from the sidebar.
    </p>

  </div>
);

function StudentDashboard() {

  const [activePage, setActivePage] =
    useState("home");

  const [subjects, setSubjects] =
    useState([]);

  const [selectedSubject,
    setSelectedSubject] =
    useState(null);

  // Fetch Subjects
  useEffect(() => {

    fetchSubjects();

  }, []);
const fetchSubjects = async () => {

  try {

    const res =
      await getStudentSubjects();

    setSubjects(res.data.subjects);

  } catch (error) {

    console.log(
      "Subject Fetch Error",
      error
    );

  }
};
 
  // Sidebar button style
  const menuClass = (page) =>
    `w-full text-left p-3 rounded-lg transition-all duration-200
     ${
       activePage === page
         ? "bg-blue-500 text-white"
         : "hover:bg-green-500 hover:text-white"
     }`;

  // Right Content
  const renderContent = () => {

    switch (activePage) {

      case "subjects":

        return <ShowSubjects />;

      case "attendance":

        return <StudentAttendance />;

      case "profile":

        return (

          <div>

            <h2 className="text-2xl font-bold mb-5">

              Select Subject

            </h2>

            {/* Subject Buttons */}

            <div className="flex gap-3 flex-wrap mb-6">

              {subjects.map((sub) => (

                <button
                  key={sub._id}
                  onClick={() =>
                    setSelectedSubject(sub)
                  }
                  className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600"
                >
                  {sub.subjectName}
                </button>

              ))}

            </div>

            {/* Calendar */}

            {selectedSubject && (

              <StudentAttendanceCalendar
                subjectId={
                  selectedSubject._id
                }
              />

            )}

          </div>

        );

      default:

        return (

          <div className="bg-white p-6 rounded-xl shadow">

            <p className="text-gray-500">

              Please select an option from sidebar.

            </p>

          </div>

        );
    }
  };

  return (
    <div className="flex min-h-screen">

      {/* SIDEBAR */}

      <div className="w-64 bg-white shadow-lg p-6">

        <h1 className="text-2xl font-bold text-green-600 mb-8">

          Student Dashboard

        </h1>

        <div className="space-y-3">

          <button
            onClick={() =>
              setActivePage("subjects")
            }
            className={menuClass("subjects")}
          >
            My Subjects
          </button>

          <button
            onClick={() =>
              setActivePage("attendance")
            }
            className={menuClass("attendance")}
          >
            My Attendance
          </button>

          <button
            onClick={() =>
              setActivePage("profile")
            }
            className={menuClass("profile")}
          >
            Attendance Calendar
          </button>

        </div>

      </div>

      {/* RIGHT CONTENT */}

      <div className="flex-1 bg-gray-100 p-8">

        <WelcomeBanner />

        {renderContent()}

      </div>

    </div>
  );
}

export default StudentDashboard;
