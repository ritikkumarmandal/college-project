import { useState } from "react";

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
        return <StudentSubjects />;

      case "attendance":
        return <StudentAttendance />;

      case "profile":
        return <StudentProfile />;

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

      {/* RIGHT CONTENT */}
      <div className="flex-1 bg-gray-100 p-8">
        <WelcomeBanner />
        {renderContent()}
      </div>

    </div>
  );
}

export default StudentDashboard;


