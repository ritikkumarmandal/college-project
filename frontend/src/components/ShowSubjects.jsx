import { useState } from "react";
import {  getStudentSubjects } from "../services/authService"; // 👈 yaha se import



function ShowSubjects() {

  const [subjects, setSubjects] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchSubjects = async () => {
  try {
    setLoading(true);

    const res = await getStudentSubjects();

    

    setSubjects(res.data.subjects || []);

  } catch (err) {
    console.error(err);
    alert("Failed to load subjects");
  } finally {
    setLoading(false);
  }
};

  return (
    <div className="bg-white p-6 rounded-xl shadow">

      <h2 className="text-xl font-semibold mb-6">
        My Subjects
      </h2>

      {/* 🔘 Button Only */}
      <button
        onClick={fetchSubjects}
        className="bg-green-600 text-white px-6 py-2 rounded hover:bg-green-700 mb-6"
      >
        Show Subjects
      </button>

      {/* ⏳ Loading */}
      {loading && <p className="mb-4">Loading...</p>}

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full border-collapse">

          <thead>
            <tr className="bg-gray-100 text-left">
              <th className="p-3">Subject Name</th>
              <th className="p-3">Code</th>
              <th className="p-3">Department</th>
              <th className="p-3">Semester</th>
            </tr>
          </thead>

          <tbody>
            {subjects.length > 0 ? (
              subjects.map((s) => (
                <tr key={s._id} className="border-b hover:bg-gray-50">
                  <td className="p-3">{s.subjectName}</td>
                  <td className="p-3">{s.subjectCode}</td>
                  <td className="p-3">{s.department}</td>
                  <td className="p-3">{s.semester}</td>
                </tr>
              ))
            ) : (
              !loading && (
                <tr>
                  <td colSpan="4" className="text-center p-4 text-gray-500">
                    Click "Show Subjects" to load data
                  </td>
                </tr>
              )
            )}
          </tbody>

        </table>
      </div>

    </div>
  );
}

export default ShowSubjects;