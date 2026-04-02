import { useEffect, useState } from "react";
import {
  getSubjects,
  getAllFaculty,
  assignClass
} from "../services/authService";

function AssignClass() {

  const [department, setDepartment] = useState("");
  const [semester, setSemester] = useState("");
  const [subjects, setSubjects] = useState([]);
  const [facultyList, setFacultyList] = useState([]);

  const [subject, setSubject] = useState("");
  const [faculty, setFaculty] = useState("");

  const departments = ["CSE", "ECE", "EE", "ME", "CE"];

  // Load subjects + faculty
  useEffect(() => {
    if (!department || !semester) return;

    loadData();
  }, [department, semester]);

  const loadData = async () => {
    try {
      const subRes = await getSubjects(department, semester);
      setSubjects(subRes.data.subjects);

      /*const facRes = await getAllFaculty();
      const filtered = facRes.data.faculty.filter(
        f => f.department === department
      );*/
      const facRes = await getAllFaculty();

const filtered = facRes.faculty.filter(
  f => f.department === department
);

      setFacultyList(filtered);
    } catch (err) {
      console.error(err);
    }
  };

  const handleAssign = async () => {
    if (!subject || !faculty) {
      return alert("Select subject & faculty");
    }

    try {
      await assignClass({
        department,
        semester,
        subject,
        faculty,
      });

      alert("Class Assigned ✅");

      setSubject("");
      setFaculty("");
    } catch (err) {
      console.error(err);
      alert("Assignment failed");
    }
  };

  return (
    <div className="bg-white p-6 rounded-xl shadow max-w-xl">

      <h2 className="text-xl font-semibold mb-6">
        Assign Class
      </h2>

      <div className="space-y-4">

        {/* Department */}
        <select
          value={department}
          onChange={(e) => setDepartment(e.target.value)}
          className="w-full border p-3 rounded"
        >
          <option value="">Select Department</option>
          {departments.map(dep => (
            <option key={dep}>{dep}</option>
          ))}
        </select>

        {/* Semester */}
        <select
          value={semester}
          onChange={(e) => setSemester(e.target.value)}
          className="w-full border p-3 rounded"
        >
          <option value="">Select Semester</option>
          {[1,2,3,4,5,6,7,8].map(sem => (
            <option key={sem} value={sem}>
              Semester {sem}
            </option>
          ))}
        </select>

        {/* Subject */}
        <select
          value={subject}
          onChange={(e) => setSubject(e.target.value)}
          className="w-full border p-3 rounded"
        >
          <option value="">Select Subject</option>
          {subjects.map(s => (
            <option key={s._id} value={s._id}>
              {s.subjectName}
            </option>
          ))}
        </select>

        {/* Faculty */}
        <select
          value={faculty}
          onChange={(e) => setFaculty(e.target.value)}
          className="w-full border p-3 rounded"
        >
          <option value="">Select Faculty</option>
          {facultyList.map(f => (
            <option key={f._id} value={f._id}>
              {f.name}
            </option>
          ))}
        </select>

        <button
          onClick={handleAssign}
          className="w-full bg-green-600 text-white p-3 rounded hover:bg-green-700"
        >
          Assign Class
        </button>

      </div>
    </div>
  );
}

export default AssignClass;