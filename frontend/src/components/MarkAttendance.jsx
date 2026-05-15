import { useState } from "react";
import { getFacultySubjects, getStudentsByClass, markAttendance } from "../services/authService";

function MarkAttendance() {
  const [form, setForm] = useState({
    department: "",
    semester: "",
    subject: ""
  });

  const [subjects, setSubjects] = useState([]);
  const [students, setStudents] = useState([]);
  const [attendance, setAttendance] = useState({});

  const departments = ["CSE", "ECE", "EE", "ME", "CE"];
  const semesters = [1,2,3,4,5,6,7,8];

  // ✅ Load subjects when department & semester are selected
  const loadSubjects = async () => {
    if (!form.department || !form.semester) return;

    try {
      const res = await getFacultySubjects(form.department, form.semester);
      const subjectList = res.data.validClasses.map(c => c.subject);
      setSubjects(subjectList || []);
    } catch (err) {
      console.log(err);
    }
  };

  // ✅ Load students after selecting subject
  const loadStudents = async () => {
    if (!form.department || !form.semester) return;

    try {
      const res = await getStudentsByClass(form.department, form.semester);
      setStudents(res.data.students);

      // default attendance = Present
      const initial = {};
      res.data.students.forEach(s => initial[s._id] = "Present");
      setAttendance(initial);

    } catch (err) {
      console.log(err);
    }
  };

  // ✅ Change attendance
  const handleStatus = (id, status) => {
    setAttendance({ ...attendance, [id]: status });
  };

  // ✅ Submit attendance
  const handleSubmit = async () => {
  try {

    const studentsData = students.map((s) => ({
      studentId: s._id,

      regNumber: s.regNumber,

      name: s.name,

      status: attendance[s._id]
    }));

    await markAttendance({
      subject: form.subject,
      department: form.department,
      semester: form.semester,
      students: studentsData
    });

    alert("Attendance marked successfully ✅");

  } catch (err) {

    alert(err.response?.data?.message || "Error");
  }
};

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-4">Mark Attendance</h2>

      {/* Filters */}
      <div className="flex gap-4 mb-5">

        {/* Department Dropdown */}
        <select
          className="border p-2"
          value={form.department}
          onChange={e => setForm({ ...form, department: e.target.value })}
        >
          <option value="">Select Department</option>
          {departments.map(d => (
            <option key={d} value={d}>{d}</option>
          ))}
        </select>

        {/* Semester Dropdown */}
        <select
          className="border p-2"
          value={form.semester}
          onChange={e => setForm({ ...form, semester: e.target.value })}
        >
          <option value="">Select Semester</option>
          {semesters.map(s => (
            <option key={s} value={s}>{s}</option>
          ))}
        </select>

        {/* Load Subjects Button */}
        <button
          onClick={loadSubjects}
          className="bg-blue-600 text-white px-4 py-2"
        >
          Load Subjects
        </button>

        {/* Subjects Dropdown */}
        <select
          className="border p-2"
          value={form.subject}
          onChange={e => setForm({ ...form, subject: e.target.value })}
        >
          <option value="">Select Subject</option>
          {subjects.map(sub => (
            <option key={sub._id} value={sub._id}>
              {sub.subjectName} ({sub.subjectCode})
            </option>
          ))}
        </select>

        {/* Load Students Button */}
        <button
          onClick={loadStudents}
          className="bg-green-600 text-white px-4 py-2"
        >
          Load Students
        </button>
      </div>

      {/* Students Table */}
      <table className="w-full border">
        <thead>
          <tr className="bg-gray-200">
            <th>Name</th>
            <th>Registration No.</th>
            <th>Status</th>
          </tr>
        </thead>
        <tbody>
          {students.map(s => (
            <tr key={s._id} className="text-center border">
              <td>{s.name}</td>
              <td>{s.regNumber}</td>
              <td>
                {/* Attendance Dropdown */}
                <td>
  <div className="flex justify-center gap-2">
    <button
      className={`px-2 py-1 border rounded ${attendance[s._id] === "Present" ? "bg-green-500 text-white" : ""}`}
      onClick={() => handleStatus(s._id, "Present")}
    >
      Present
    </button>
    <button
      className={`px-2 py-1 border rounded ${attendance[s._id] === "Absent" ? "bg-red-500 text-white" : ""}`}
      onClick={() => handleStatus(s._id, "Absent")}
    >
      Absent
    </button>
  </div>
</td>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {students.length > 0 && (
        <button
          onClick={handleSubmit}
          className="mt-5 bg-purple-600 text-white px-6 py-2"
        >
          Submit Attendance
        </button>
      )}
    </div>
  );
}

export default MarkAttendance;