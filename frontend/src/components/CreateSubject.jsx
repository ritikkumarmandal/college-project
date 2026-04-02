import { useState } from "react";
import { createSubject } from "../services/authService";

function CreateSubject() {

  const [form, setForm] = useState({
    subjectName: "",
    subjectCode: "",
    department: "",
    semester: "",
  });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      await createSubject(form);
      alert("Subject Created ✅");

      setForm({
        subjectName: "",
        subjectCode: "",
        department: "",
        semester: "",
      });
    } catch (err) {
      console.error(err);
      alert("Error creating subject");
    }
  };

  return (
    <div className="bg-white p-6 rounded-xl shadow max-w-xl">
      <h2 className="text-xl font-semibold mb-4">
        Create Subject
      </h2>

      <form onSubmit={handleSubmit} className="space-y-4">

        <input
          name="subjectName"
          placeholder="Subject Name"
          value={form.subjectName}
          onChange={handleChange}
          className="w-full border p-3 rounded"
          required
        />

        <input
          name="subjectCode"
          placeholder="Subject Code"
          value={form.subjectCode}
          onChange={handleChange}
          className="w-full border p-3 rounded"
          required
        />
<select
  name="department"
  value={form.department}
  onChange={handleChange}
  className="w-full border p-3 rounded"
  required
>
  <option value="">Select Department</option>

  {["CSE", "ECE", "EE", "ME", "CE"].map((dept) => (
    <option key={dept} value={dept}>
      {dept}
    </option>
  ))}

</select>
       

       <select
          name="semester"
          value={form.semester}
          onChange={handleChange}
          className="w-full border p-3 rounded"
          required
        >
            
            
          <option value="">Select Semester</option>
          {[1,2,3,4,5,6,7,8].map((sem) => (
            <option key={sem} value={sem}>
              Semester {sem}
            </option>
          ))}
        </select>

        <button className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700">
          Create Subject
        </button>

      </form>
    </div>
  );
}

export default CreateSubject;