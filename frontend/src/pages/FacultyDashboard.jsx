import { useState } from "react";

import FacultyShowClass from "../components/FacultyShowClass";
import MarkAttendance from "../components/MarkAttendance";
import AttendanceSheet from "../components/AttendanceSheet";

function FacultyDashboard() {

  const [activePage, setActivePage] = useState("home");

  // active button style
  const menuClass = (page) =>
    `w-full text-left p-3 rounded-lg transition-all duration-200
     ${
       activePage === page
         ? "bg-green-500 text-white"
         : "hover:bg-green-500 hover:text-white"
     }`;

  // Right content switch
  const renderContent = () => {
    switch (activePage) {
     
        case "show-class":
           return <FacultyShowClass />;

           case "mark-attendance":
           return < MarkAttendance />;

           case "get-attendance-report":
           return < AttendanceSheet />;


    
      default:
        return (
          <div className="bg-white p-6 rounded-xl shadow">
            <h2 className="text-xl font-semibold">
              Welcome Faculty 👋
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
          Faculty Dashboard
        </h1>

        <div className="space-y-3">


          <button onClick={() => setActivePage("show-class")}
            className="w-full text-left p-3 rounded-lg hover:bg-green-500 hover:text-white"
            >
               Show Classes
          </button>


          <button onClick={() => setActivePage("mark-attendance")}
            className="w-full text-left p-3 rounded-lg hover:bg-green-500 hover:text-white"
            >
               Mark Attendance
          </button>


           <button onClick={() => setActivePage("get-attendance-report")}
            className="w-full text-left p-3 rounded-lg hover:bg-green-500 hover:text-white"
            >
               show Attendance Report
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

export default FacultyDashboard;