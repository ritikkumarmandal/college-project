import {
  useEffect,
  useState,
} from "react";

import {

  getSubjects,

  getAllFaculty,

  assignClass,

} from "../services/authService";

function AssignClass() {

  const [department,
    setDepartment] =
    useState("");

  const [semester,
    setSemester] =
    useState("");

  const [subjects,
    setSubjects] =
    useState([]);

  const [facultyList,
    setFacultyList] =
    useState([]);

  const [subject,
    setSubject] =
    useState("");

  const [faculty,
    setFaculty] =
    useState("");

  // NEW
  const [assignType,
    setAssignType] =
    useState("Faculty");

  const departments = [

    "CSE",

    "ECE",

    "EE",

    "ME",

    "CE",

  ];

  // =========================
  // LOAD DATA
  // =========================

  useEffect(() => {

    if (
      !department ||
      !semester
    ) return;

    loadData();

  }, [
    department,
    semester,
  ]);

  const loadData =
    async () => {

      try {

        // SUBJECTS
        const subRes =
          await getSubjects(

            department,

            semester

          );

        setSubjects(
          subRes.data.subjects
        );

        // FACULTY
     const facRes =
  await getAllFaculty();

console.log(
  "FACULTY:",
  facRes
);

const facultyData =
  facRes.faculty || [];

const filtered =
  facultyData.filter(
    (f) =>

      f.department
        .trim()
        .toLowerCase() ===

      department
        .trim()
        .toLowerCase()

  );

console.log(
  "FILTERED:",
  filtered
);

setFacultyList(filtered);

      } catch (err) {

        console.log(err);

      }

    };

  // =========================
  // ASSIGN
  // =========================

  const handleAssign =
    async () => {

      if (!subject) {

        return alert(
          "Select Subject"
        );

      }

      // Faculty required
      if (
        assignType ===
          "Faculty" &&
        !faculty
      ) {

        return alert(
          "Select Faculty"
        );

      }

      try {

        const payload = {

          department,

          semester,

          subject,

          assignedRole:
            assignType,

        };

        // Faculty assign
        if (
          assignType ===
          "Faculty"
        ) {

          payload.faculty =
            faculty;

        }

        await assignClass(
          payload
        );

        alert(
          "Class Assigned ✅"
        );

        setSubject("");

        setFaculty("");

      } catch (err) {

        console.log(err);

        alert(
          err.response?.data
            ?.message ||
          "Assignment Failed"
        );

      }

    };

  return (

    <div className="bg-white p-6 rounded-2xl shadow-xl max-w-2xl">

      <h2 className="text-2xl font-bold mb-6">

        Assign Class

      </h2>

      <div className="space-y-5">

        {/* DEPARTMENT */}

        <select
          value={department}
          onChange={(e) =>
            setDepartment(
              e.target.value
            )
          }
          className="w-full border p-3 rounded-xl"
        >

          <option value="">

            Select Department

          </option>

          {departments.map(
            (dep) => (

              <option
                key={dep}
              >

                {dep}

              </option>

            )
          )}

        </select>

        {/* SEMESTER */}

        <select
          value={semester}
          onChange={(e) =>
            setSemester(
              e.target.value
            )
          }
          className="w-full border p-3 rounded-xl"
        >

          <option value="">

            Select Semester

          </option>

          {[1,2,3,4,5,6,7,8]
            .map((sem) => (

              <option
                key={sem}
                value={sem}
              >

                Semester {sem}

              </option>

            ))}

        </select>

        {/* SUBJECT */}

        <select
          value={subject}
          onChange={(e) =>
            setSubject(
              e.target.value
            )
          }
          className="w-full border p-3 rounded-xl"
        >

          <option value="">

            Select Subject

          </option>

          {subjects.map(
            (s) => (

              <option
                key={s._id}
                value={s._id}
              >

                {s.subjectName}

              </option>

            )
          )}

        </select>

        {/* ASSIGN TYPE */}

        <select
          value={assignType}
          onChange={(e) =>
            setAssignType(
              e.target.value
            )
          }
          className="w-full border p-3 rounded-xl"
        >

          <option value="Faculty">

            Assign To Faculty

          </option>

          <option value="Hod">

            Assign To Myself (HOD)

          </option>

        </select>

        {/* FACULTY */}

        {assignType ===
          "Faculty" && (

          <select
            value={faculty}
            onChange={(e) =>
              setFaculty(
                e.target.value
              )
            }
            className="w-full border p-3 rounded-xl"
          >

            <option value="">

              Select Faculty

            </option>

            {facultyList.map(
              (f) => (

                <option
                  key={f._id}
                  value={f._id}
                >

                  {f.name}

                </option>

              )
            )}

          </select>

        )}

        {/* BUTTON */}

        <button
          onClick={
            handleAssign
          }
          className="w-full bg-green-600 hover:bg-green-700 text-white p-3 rounded-xl font-bold transition"
        >

          Assign Class

        </button>

      </div>

    </div>

  );

}

export default AssignClass;