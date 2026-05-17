
import { useEffect, useState } from "react";

import FacultyShowClass from "../components/FacultyShowClass";
import MarkAttendance from "../components/MarkAttendance";
import FacultyAttendanceCalendar from "../components/FacultyAttendanceCalendar";
import {getFacultyClasses} from "../services/authService"
import Profile  from "../components/Profile";

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

function FacultyDashboard() {

  const [activePage, setActivePage] =
    useState("home");

  const [subjects, setSubjects] =
    useState([]);

  const [selectedSubject,
    setSelectedSubject] =
    useState(null);

  // Fetch Faculty Classes
  useEffect(() => {

    fetchSubjects();

  }, []);

  const fetchSubjects = async () => {

    try {

      const res =
        await getFacultyClasses();

      console.log(res.data);

      setSubjects(
        res.data.validClasses || []
      );

    } catch (error) {

      console.log(
        "Subject Fetch Error",
        error
      );

    }
  };

  // Sidebar Button Style
  const menuClass = (page) =>
    `w-full text-left p-3 rounded-lg transition-all duration-200
     ${
       activePage === page
         ? "bg-green-500 text-white"
         : "hover:bg-green-500 hover:text-white"
     }`;

  // Right Content
  const renderContent = () => {

    switch (activePage) {

      case "show-class":

        return <FacultyShowClass />;

      case "mark-attendance":

        return <MarkAttendance />;

        case "profile":

         return <Profile />;

      case "get-attendance-report":

        return (

          <div>

            <h2 className="text-2xl font-bold mb-5">

              Select Subject

            </h2>

            {/* Subject Buttons */}

            <div className="flex gap-3 flex-wrap mb-6">

              {subjects?.map((sub) => (

                <button
                  key={sub._id}
                  onClick={() =>
                    setSelectedSubject(sub)
                  }
                  className="bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600"
                >
                  {
                    sub.subject
                      ?.subjectName
                  }
                </button>

              ))}

            </div>

            {/* Calendar */}

            {selectedSubject && (

              <FacultyAttendanceCalendar
                subjectId={
                  selectedSubject
                    .subject._id
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

          Faculty Dashboard

        </h1>

        <div className="space-y-3">

          <button
            onClick={() =>
              setActivePage("show-class")
            }
            className={menuClass("show-class")}
          >
            Show Classes
          </button>

          <button
            onClick={() =>
              setActivePage("mark-attendance")
            }
            className={menuClass("mark-attendance")}
          >
            Mark Attendance
          </button>

          <button
            onClick={() =>
              setActivePage(
                "get-attendance-report"
              )
            }
            className={menuClass(
              "get-attendance-report"
            )}
          >
            Show Attendance Report
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

export default FacultyDashboard;