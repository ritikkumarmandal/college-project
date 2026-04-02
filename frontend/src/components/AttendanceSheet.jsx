import { useEffect, useState } from "react";
import {
  getFacultyClasses,
  getAttendanceReport
} from "../services/authService";

import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

function AttendanceSheet() {

     
  const [classes, setClasses] = useState([]);

  const [department, setDepartment] = useState("");
  const [semester, setSemester] = useState("");
  const [subject, setSubject] = useState("");

  const [filteredSemesters, setFilteredSemesters] = useState([]);
  const [filteredSubjects, setFilteredSubjects] = useState([]);

  const [report, setReport] = useState([]);

  // ================= LOAD FACULTY CLASSES =================
  useEffect(() => {
    loadClasses();
  }, []);

  const loadClasses = async () => {
    try {
      const res = await getFacultyClasses();
      setClasses(res.data.validClasses || []);
    } catch (err) {
      console.log(err);
    }
  };

  // ================= FILTER SEMESTERS =================
  useEffect(() => {
    if (!department) return;

    const semesters = classes
      .filter(c => c.department === department)
      .map(c => c.semester);

    setFilteredSemesters([...new Set(semesters)]);
    setSemester("");
    setSubject("");
    setReport([]);
  }, [department]);

  // ================= FILTER SUBJECTS =================
  useEffect(() => {
    if (!semester) return;

    const subjects = classes.filter(
      c =>
        c.department === department &&
        c.semester === Number(semester)
    );

    setFilteredSubjects(subjects);
    setSubject("");
    setReport([]);
  }, [semester]);

  // ================= LOAD REPORT =================
  const loadReport = async () => {
    try {

         console.log("SENDING:", {
      department,
      semester,
      subject
    });
      const res = await getAttendanceReport(
        department,
        semester,
        subject
      );
       console.log("RESPONSE:", res.data);
      setReport(res.data || []);
    } catch (err) {
      console.log(err);
    }
  };

  // ================= PDF DOWNLOAD =================
  const downloadPDF = () => {

    const doc = new jsPDF();

    doc.text("Attendance Report", 14, 15);

    autoTable(doc, {
      startY: 25,
      head: [[
        "regNumber",
        "Name",
        "Total",
        "Present",
        "Absent",
        "Percentage"
      ]],
      body: report.map(r => [
        r.regNumber,
        r.name,
        r.totalClass,
        r.presentClass,
        r.absentClass,
        `${r.percentage.toFixed(2)}%`
      ])
    });

    doc.save("attendance-report.pdf");
  };

  // ================= UI =================
  return (
    <div className="p-6 bg-white rounded-xl shadow">

      <h2 className="text-2xl font-semibold mb-6">
        Attendance Sheet
      </h2>

      {/* ================= DROPDOWNS ================= */}
      <div className="grid grid-cols-3 gap-4 mb-6">

        {/* Department */}
        <select
          className="border p-2 rounded"
          value={department}
          onChange={e => setDepartment(e.target.value)}
        >
          <option value="">Select Department</option>

          {[...new Set(classes.map(c => c.department))].map(dep => (
            <option key={dep}>{dep}</option>
          ))}
        </select>

        {/* Semester */}
        <select
          className="border p-2 rounded"
          value={semester}
          onChange={e => setSemester(e.target.value)}
        >
          <option value="">Select Semester</option>

          {filteredSemesters.map(sem => (
            <option key={sem}>{sem}</option>
          ))}
        </select>

        {/* Subject */}
        <select
          className="border p-2 rounded"
          value={subject}
          onChange={e => setSubject(e.target.value)}
        >
          <option value="">Select Subject</option>

          {filteredSubjects.map(c => (
            <option
              key={c.subject._id}
              value={c.subject._id}
            >
              {c.subject.subjectName}
            </option>
          ))}
        </select>

      </div>

      {/* LOAD BUTTON */}
      <button
        onClick={loadReport}
        className="bg-blue-600 text-white px-5 py-2 rounded mb-6"
      >
        Load Attendance
      </button>

      {/* ================= TABLE ================= */}
      {report.length > 0 && (
        <>
          <table className="w-full border-collapse">

            <thead>
              <tr className="bg-gray-100">
                <th className="p-2">regNumber</th>
                <th className="p-2">Name</th>
                <th className="p-2">Total</th>
                <th className="p-2">Present</th>
                <th className="p-2">Absent</th>
                <th className="p-2">%</th>
              </tr>
            </thead>

            <tbody>
              {report.map((r, i) => (
                <tr key={i} className="border-b text-center">
                  <td>{r.regNumber}</td>
                  <td>{r.name}</td>
                  <td>{r.totalClass}</td>
                  <td>{r.presentClass}</td>
                  <td>{r.absentClass}</td>
                  <td
                    className={
                      r.percentage < 75
                        ? "text-red-600 font-semibold"
                        : "text-green-600 font-semibold"
                    }
                  >
                    {r.percentage.toFixed(2)}%
                  </td>
                </tr>
              ))}
            </tbody>

          </table>

          {/* PDF BUTTON */}
          <button
            onClick={downloadPDF}
            className="mt-6 bg-green-600 text-white px-5 py-2 rounded"
          >
            Download PDF
          </button>
        </>
      )}

    </div>
  );
}

export default AttendanceSheet;