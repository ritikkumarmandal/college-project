import { useEffect, useState } from "react";
import { getAllFaculty } from "../services/authService";

function FacultyShow() {

  const [faculty, setFaculty] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchFaculty = async () => {
    try {
      const data = await getAllFaculty();
      setFaculty(data.faculty);
    } catch (err) {
      console.error(err);
      setError("Unable to load faculty");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFaculty();
  }, []);

  // ===== Loading =====
  if (loading) {
    return (
      <div className="bg-white p-6 rounded-xl shadow">
        Loading faculty...
      </div>
    );
  }

  // ===== Error =====
  if (error) {
    return (
      <div className="bg-white p-6 rounded-xl shadow text-red-500">
        {error}
      </div>
    );
  }

  // ===== Empty =====
  if (faculty.length === 0) {
    return (
      <div className="bg-white p-6 rounded-xl shadow">
        No Faculty Found
      </div>
    );
  }

  // ===== Table =====
  return (
    <div className="bg-white p-6 rounded-xl shadow">

      <h2 className="text-xl font-semibold mb-5">
        Faculty Dashboard
      </h2>

      <div className="overflow-x-auto">
        <table className="w-full">

          <thead>
            <tr className="bg-gray-100 text-left">
              <th className="p-3">#</th>
              <th className="p-3">Name</th>
              <th className="p-3">Email</th>
              <th className="p-3">Mobile</th>
              <th className="p-3">Department</th>
            </tr>
          </thead>

          <tbody>
            {faculty.map((f, index) => (
              <tr
                key={f._id}
                className="border-b hover:bg-gray-50"
              >
                <td className="p-3">{index + 1}</td>
                <td className="p-3 font-medium">{f.name}</td>
                <td className="p-3">{f.email}</td>
                <td className="p-3">{f.mobile}</td>
                <td className="p-3">{f.department}</td>
              </tr>
            ))}
          </tbody>

        </table>
      </div>

    </div>
  );
}

export default FacultyShow;