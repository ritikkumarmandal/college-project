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

function HodDashboard() {

  const [activePage, setActivePage] = useState("home");

  const [subjects,
setSubjects] =
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
    <div className="flex min-h-screen">

      {/* SIDEBAR */}
      <div className="w-64 bg-white shadow-lg p-6">

        <h1 className="text-2xl font-bold text-green-600 mb-8">
          HOD Dashboard
        </h1>

        <div className="space-y-4">

          <button
            onClick={() => setActivePage("create-student")}
            className="w-full text-left p-3 rounded-lg hover:bg-green-500 hover:text-white"
          >
            Create Student
          </button>

          <button
            onClick={() => setActivePage("upload-students")}
            className="w-full text-left p-3 rounded-lg hover:bg-green-500 hover:text-white"
          >
            Upload Students
          </button>

          <button
            onClick={() => setActivePage("faculty-show")}
            className="w-full text-left p-3 rounded-lg hover:bg-green-500 hover:text-white"
          >
            Faculty Show
          </button>

          <h2 className="text-gray-400 text-sm mt-6 mb-2">
            Subject Management
        </h2>

       <button
      onClick={() => setActivePage("create-subject")}
       className="w-full text-left p-3 rounded-lg hover:bg-green-500 hover:text-white"
       >
     Create Subject
       </button>

      <button
  onClick={() => setActivePage("view-subjects")}
  className="w-full text-left p-3 rounded-lg hover:bg-green-500 hover:text-white"
   >
     View Semester Subjects
     </button>
      
       <button
  onClick={() => setActivePage("assign-subjects")}
  className="w-full text-left p-3 rounded-lg hover:bg-green-500 hover:text-white"
   >
     Assign class
     </button>


    

     <button
  onClick={() =>
    setActivePage(
      "student-attendance"
    )
  }
  className="w-full text-left p-3 rounded-lg hover:bg-green-500 hover:text-white"
>
  Student Attendance
</button>


<button
  onClick={() =>
    setActivePage(
      "show-class"
    )
  }
  className="w-full text-left p-3 rounded-lg hover:bg-green-500 hover:text-white"
  >
     My Classes
  </button>


  <button
  onClick={() =>
    setActivePage("mark-attendance")
  }
  className="w-full text-left p-3 rounded-lg hover:bg-green-500 hover:text-white"
  >
  Mark Attendance
</button>


        <button
            onClick={() =>
              setActivePage(
                "get-attendance-report"
              )
            }
            className="w-full text-left p-3 rounded-lg hover:bg-green-500 hover:text-white"
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

export default HodDashboard;