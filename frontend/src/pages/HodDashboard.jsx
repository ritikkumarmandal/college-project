import {useEffect, useState } from "react";

import CreateStudent from "../components/CreateStudent";
// later add:
import UploadStudents from "../components/UploadStudents";

import  FacultyShow from "../components/FacultyShow";

import CreateSubject from "../components/CreateSubject";
import ViewSubjects from "../components/ViewSubjects";
import AssignClass from "../components/AssignClass";

import HodStudentAttendance from "../components/HodStudentAttendance";

import FacultyShowClass
from "../components/FacultyShowClass";

import MarkAttendance from "../components/MarkAttendance";

import FacultyAttendanceCalendar
from "../components/FacultyAttendanceCalendar";

import {
  getFacultyClasses
}
from "../services/authService";

import Profile  from "../components/Profile";

const WelcomeBanner = ({
  setActivePage,
}) => (

  <div className="bg-white p-4 sm:p-6 rounded-xl shadow mb-6 flex flex-col sm:flex-row gap-4 sm:items-center sm:justify-between">

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
      className="w-full sm:w-auto flex items-center justify-center gap-3 bg-green-500 hover:bg-green-600 text-white px-5 py-2 rounded-xl transition"
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

function HodDashboard() {

  const [activePage, setActivePage] = useState("home");

  const [subjects,
setSubjects] =
useState([]);

const [selectedSubject,
setSelectedSubject] =
useState(null);

const [sidebarOpen, setSidebarOpen] = useState(false);

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

  // decide which component show
  const renderContent = () => {
    switch (activePage) {
      case "create-student":
        return <CreateStudent />;

      case "upload-students":
         return <UploadStudents />;

       case "faculty-show":
         return <FacultyShow />;

         case "create-subject":
  return <CreateSubject />;

  case "show-class":

  return (
    <FacultyShowClass />
  );

case "view-subjects":
  return <ViewSubjects />;

  case "student-attendance":

  return <HodStudentAttendance />;


   case "mark-attendance":

      return <MarkAttendance />;


      case "profile":

         return <Profile />;
       
  case "assign-subjects":
  return <AssignClass />;

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

  <div className="min-h-screen bg-gray-100 flex">

    {/* MOBILE OVERLAY */}

    {sidebarOpen && (
      <div
        className="fixed inset-0 bg-black/40 z-40 lg:hidden"
        onClick={() =>
          setSidebarOpen(false)
        }
      />
    )}

    {/* SIDEBAR */}

    <div
      className={`
        fixed lg:static top-0 left-0 z-50
        h-screen w-72 bg-white shadow-lg p-6
        transform transition-transform duration-300
        ${
          sidebarOpen
            ? "translate-x-0"
            : "-translate-x-full"
        }
        lg:translate-x-0
      `}
    >

      {/* SIDEBAR TOP */}

      <div className="flex items-center justify-between mb-8">

        <h1 className="text-2xl font-bold text-green-600">
          HOD Dashboard
        </h1>

        <button
          className="lg:hidden text-3xl"
          onClick={() =>
            setSidebarOpen(false)
          }
        >
          ✕
        </button>

      </div>

      {/* MENU */}

      <div className="space-y-3 overflow-y-auto h-[85vh] pr-2">

        <button
          onClick={() => {
            setActivePage(
              "create-student"
            );
            setSidebarOpen(false);
          }}
          className="w-full text-left p-3 rounded-lg hover:bg-green-500 hover:text-white"
        >
          Create Student
        </button>

        <button
          onClick={() => {
            setActivePage(
              "upload-students"
            );
            setSidebarOpen(false);
          }}
          className="w-full text-left p-3 rounded-lg hover:bg-green-500 hover:text-white"
        >
          Upload Students
        </button>

        <button
          onClick={() => {
            setActivePage(
              "faculty-show"
            );
            setSidebarOpen(false);
          }}
          className="w-full text-left p-3 rounded-lg hover:bg-green-500 hover:text-white"
        >
          Faculty Show
        </button>

        <h2 className="text-gray-400 text-sm mt-6 mb-2">
          Subject Management
        </h2>

        <button
          onClick={() => {
            setActivePage(
              "create-subject"
            );
            setSidebarOpen(false);
          }}
          className="w-full text-left p-3 rounded-lg hover:bg-green-500 hover:text-white"
        >
          Create Subject
        </button>

        <button
          onClick={() => {
            setActivePage(
              "view-subjects"
            );
            setSidebarOpen(false);
          }}
          className="w-full text-left p-3 rounded-lg hover:bg-green-500 hover:text-white"
        >
          View Semester Subjects
        </button>

        <button
          onClick={() => {
            setActivePage(
              "assign-subjects"
            );
            setSidebarOpen(false);
          }}
          className="w-full text-left p-3 rounded-lg hover:bg-green-500 hover:text-white"
        >
          Assign Class
        </button>

        <button
          onClick={() => {
            setActivePage(
              "student-attendance"
            );
            setSidebarOpen(false);
          }}
          className="w-full text-left p-3 rounded-lg hover:bg-green-500 hover:text-white"
        >
          Student Attendance
        </button>

        <button
          onClick={() => {
            setActivePage(
              "show-class"
            );
            setSidebarOpen(false);
          }}
          className="w-full text-left p-3 rounded-lg hover:bg-green-500 hover:text-white"
        >
          My Classes
        </button>

        <button
          onClick={() => {
            setActivePage(
              "mark-attendance"
            );
            setSidebarOpen(false);
          }}
          className="w-full text-left p-3 rounded-lg hover:bg-green-500 hover:text-white"
        >
          Mark Attendance
        </button>

        <button
          onClick={() => {
            setActivePage(
              "get-attendance-report"
            );
            setSidebarOpen(false);
          }}
          className="w-full text-left p-3 rounded-lg hover:bg-green-500 hover:text-white"
        >
          Show Attendance Report
        </button>

      </div>
    </div>

    {/* MAIN CONTENT */}

    <div className="flex-1 lg:ml-0">

      {/* MOBILE HEADER */}

      <div className="lg:hidden bg-white shadow-md px-4 py-4 flex items-center justify-between">

        <h1 className="text-xl font-bold text-green-600">
          Dashboard
        </h1>

        <button
          className="text-3xl"
          onClick={() =>
            setSidebarOpen(true)
          }
        >
          ☰
        </button>

      </div>

      {/* CONTENT */}

      <div className="p-4 sm:p-6 lg:p-8">

        <WelcomeBanner
          setActivePage={
            setActivePage
          }
        />

        {renderContent()}

      </div>

    </div>

  </div>

);  

}

export default HodDashboard;