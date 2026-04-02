import { useState } from "react";
import { createstudent}  from "../services/authService";

function CreateStudent() {

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    regNumber: "",
    department: "",
    semester: ""
  });

  const [message, setMessage] = useState("");

  // handle input
  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  // submit
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const res = await createstudent(formData);

      setMessage("✅ Student Created Successfully");

      // reset form
      setFormData({
        name: "",
        email: "",
        regNumber: "",
        department: "",
        semester: ""
      });

    } catch (error) {
      console.error(error);
      setMessage("❌ Failed to create student");
    }
  };

  return (
    <div className="flex justify-center min-h-screen items-center bg-gray-100 p-4">

      <div className="bg-white p-8 rounded-xl shadow-lg w-full max-w-lg">

        <h2 className="text-2xl font-bold text-center mb-6">
          Create Student
        </h2>

        {message && (
          <p className="text-center mb-4">{message}</p>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">

          <input
            type="text"
            name="name"
            placeholder="Student Name"
            value={formData.name}
            onChange={handleChange}
            className="w-full border p-3 rounded-lg"
            required
          />

          <input
            type="email"
            name="email"
            placeholder="Email"
            value={formData.email}
            onChange={handleChange}
            className="w-full border p-3 rounded-lg"
            required
          />

          <input
            type="text"
            name="regNumber"
            placeholder="Registration Number"
            value={formData.regNumber}
            onChange={handleChange}
            className="w-full border p-3 rounded-lg"
            required
          />

          <select
            name="department"
            value={formData.department}
            onChange={handleChange}
            className="w-full border p-3 rounded-lg"
            required
          >
            <option value="">Select Department</option>
            <option value="CSE">CSE</option>
            <option value="ECE">ECE</option>
            <option value="ME">ME</option>
            <option value="CE">CE</option>
          </select>

          <select
            name="semester"
            value={formData.semester}
            onChange={handleChange}
            className="w-full border p-3 rounded-lg"
            required
          >
            <option value="">Select Semester</option>
            {[1,2,3,4,5,6,7,8].map((sem) => (
              <option key={sem} value={sem}>
                Semester {sem}
              </option>
            ))}
          </select>

          <button
            type="submit"
            className="w-full bg-green-600 text-white p-3 rounded-lg hover:bg-blue-700"
          >
            Create Student
          </button>

        </form>

      </div>
    </div>
  );
}

export default CreateStudent;