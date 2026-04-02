import { useState } from "react";

import CreateStudent from "../components/CreateStudent";
// later add:
import UploadStudents from "../components/UploadStudents";

import  FacultyShow from "../components/FacultyShow";

import CreateSubject from "../components/CreateSubject";
import ViewSubjects from "../components/ViewSubjects";
import AssignClass from "../components/AssignClass";

function HodDashboard() {

  const [activePage, setActivePage] = useState("home");

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

case "view-subjects":
  return <ViewSubjects />;
       
  case "assign-subjects":
  return <AssignClass />;
      default:
        return (
          <div className="bg-white p-6 rounded-xl shadow sticky top-0 z-10">
            <h2 className="text-xl font-semibold">
              Welcome HOD 👋
            </h2>
            <p className="text-gray-500 mt-2">
              Select an option from the sidebar.
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
        </div>
      </div>

      {/* RIGHT CONTENT */}
      <div className="flex-1 bg-gray-100 p-8">
        {renderContent()}
      </div>

    </div>
  );
}

export default HodDashboard;