

import { useEffect, useState } from "react";

import ShowSubjects from "../components/ShowSubjects";
import StudentAttendance from "../components/ShowAttendance";
import StudentAttendanceCalendar from "../components/StudentAttendanceCalendar";
import Profile  from "../components/Profile";


import {
  getStudentSubjects,
} from "../services/authService";

const WelcomeBanner = ({
  setActivePage,
}) => (

  <div className="bg-white p-6 rounded-xl shadow mb-6 flex items-center justify-between">

    <div>

      <h2 className="text-xl font-semibold">
        Welcome Faculty 👋
      </h2>

      <p className="text-gray-500 mt-2">
        Select an option from the sidebar.
      </p>

    </div>

    {/* PROFILE BUTTON */}

    <button
      onClick={() =>
        setActivePage("profile")
      }
      className="flex items-center gap-3 bg-green-500 hover:bg-green-600 text-white px-5 py-2 rounded-xl transition"
    >

      <img
        src="https://cdn-icons-png.flaticon.com/512/149/149071.png"
        alt="profile"
        className="w-10 h-10 rounded-full"
      />

      <span className="font-semibold">

        Profile

      </span>

    </button>

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

         return <Profile />;
 


      case "StudentAttendanceCalendar":

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
              setActivePage("StudentAttendanceCalendar")
            }
            className={menuClass("StudentAttendanceCalendar")}
          >
            Attendance Calendar
          </button>

        </div>

      </div>

      {/* RIGHT CONTENT */}

      <div className="flex-1 bg-gray-100 p-8">

         <WelcomeBanner
  setActivePage={
    setActivePage
  }
/> 

        {renderContent()}

      </div>

    </div>
  );
}

export default StudentDashboard;
