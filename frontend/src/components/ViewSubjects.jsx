import { useState } from "react";
import { getSubjects } from "../services/authService";

function ViewSubjects() {

  const [department, setDepartment] = useState("");
  const [semester, setSemester] = useState("");
  const [subjects, setSubjects] = useState([]);

  const departments = ["CSE", "ECE", "EE", "ME", "CE"];

  const fetchSubjects = async () => {
    if (!department || !semester) {
      alert("Select department and semester");
      return;
    }

    try {
      const res = await getSubjects(department, semester);
      setSubjects(res.data.subjects);
    } catch (err) {
      console.error(err);
      alert("Failed to load subjects");
    }
  };

  return (
    <div className="bg-white p-6 rounded-xl shadow">

      <h2 className="text-xl font-semibold mb-6">
        View Semester Subjects
      </h2>

      {/* Filters */}
      <div className="flex gap-4 mb-6 flex-wrap">

        {/* Department Dropdown */}
        <select
          value={department}
          onChange={(e) => setDepartment(e.target.value)}
          className="border p-2 rounded w-48"
        >
          <option value="">Select Department</option>
          {departments.map((dep) => (
            <option key={dep} value={dep}>
              {dep}
            </option>
          ))}
        </select>

        {/* Semester Dropdown */}
        <select
          value={semester}
          onChange={(e) => setSemester(e.target.value)}
          className="border p-2 rounded w-48"
        >
          <option value="">Select Semester</option>
          {[1,2,3,4,5,6,7,8].map((sem) => (
            <option key={sem} value={sem}>
              Semester {sem}
            </option>
          ))}
        </select>

        <button
          onClick={fetchSubjects}
          className="bg-green-600 text-white px-6 rounded hover:bg-green-700"
        >
          Load Subjects
        </button>
      </div>

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
              <tr>
                <td colSpan="4" className="text-center p-4 text-gray-500">
                  No subjects found
                </td>
              </tr>
            )}
          </tbody>

        </table>
      </div>

    </div>
  );
}

export default ViewSubjects;