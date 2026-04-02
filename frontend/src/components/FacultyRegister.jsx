import React, { useState } from "react";
import { registerFaculty } from "../services/authService";

const FacultyRegister = ({ onClose }) => {

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    mobile: ""
  });

  const token = localStorage.getItem("token");

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      await registerFaculty(formData, token);
      alert("Faculty Registered Successfully ✅");
      onClose(); // form close
    } catch (error) {
      alert(error.response?.data?.message || "Registration failed");
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-40 flex justify-center items-center">

      <div className="bg-white p-6 rounded-lg w-96 shadow-lg">

        <h2 className="text-xl font-bold mb-4 text-center">
          Faculty Registration
        </h2>

        <form onSubmit={handleSubmit}>

          <input
            type="text"
            name="name"
            placeholder="Faculty Name"
            onChange={handleChange}
            required
            className="w-full border p-2 mb-3 rounded"
          />

          <input
            type="email"
            name="email"
            placeholder="Email"
            onChange={handleChange}
            required
            className="w-full border p-2 mb-3 rounded"
          />

          <input
            type="text"
            name="mobile"
            placeholder="Mobile Number"
            onChange={handleChange}
            required
            className="w-full border p-2 mb-4 rounded"
          />

          <div className="flex justify-between">

            <button
              type="button"
              onClick={onClose}
              className="bg-gray-400 text-white px-4 py-2 rounded"
            >
              Cancel
            </button>

            <button
              type="submit"
              className="bg-blue-500 text-white px-4 py-2 rounded"
            >
              Register
            </button>

          </div>

        </form>
      </div>
    </div>
  );
};

export default FacultyRegister;