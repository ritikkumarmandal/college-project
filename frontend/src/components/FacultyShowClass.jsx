import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getFacultyClasses } from "../services/authService";

function FacultyShowClass() {

  const [classes, setClasses] = useState([]);

  useEffect(() => {
    loadClasses();
  }, []);

  const loadClasses = async () => {
  try {
    const res = await getFacultyClasses();
    
    setClasses(res.data.validClasses || []);
  } catch (err) {
    console.error(err);
  }
};

  return (
    <div className="bg-white p-6 rounded-xl shadow">

      <h2 className="text-xl font-semibold mb-4">
        My Assigned Classes
      </h2>

      <table className="w-full border-collapse">

        <thead>
          <tr className="bg-gray-100 text-left">
            <th className="p-3">Department</th>
            <th className="p-3">Semester</th>
            <th className="p-3">Subject</th>
            <th className="p-3">Paper Code</th>
          </tr>
        </thead>

        <tbody>
          {classes.length > 0 ? (
            classes.map((c) => (
              <tr key={c._id} className="border-b">
                <td className="p-3">{c.department}</td>
                <td className="p-3">{c.semester}</td>

                <td className="p-3">
                  {c.subject ? c.subject.subjectName : "Not Assigned"}
                </td>

                <td className="p-3">
                  {c.subject ? c.subject.subjectCode : "-"}
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="4" className="text-center p-4 text-gray-500">
                No classes assigned yet
              </td>
            </tr>
          )}
        </tbody>

      </table>

    </div>
  );
}

export default FacultyShowClass;