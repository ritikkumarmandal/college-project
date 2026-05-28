import { useState } from "react";

import {
  changeStudentPassword
} from "../services/authService";

import { useNavigate }
from "react-router-dom";



function ChangePassword() {

  const navigate = useNavigate();

  const [formData, setFormData] =
    useState({

      email: "",

      oldPassword: "",

      newPassword: "",

      confirmPassword: "",

    });

  // INPUT CHANGE

  const handleChange = (e) => {

    setFormData({

      ...formData,

      [e.target.name]:
        e.target.value,

    });

  };

  // SUBMIT

  const handleSubmit = async (e) => {

    e.preventDefault();

    // PASSWORD MATCH

    if (

      formData.newPassword !==
      formData.confirmPassword

    ) {

      return alert(
        "Passwords do not match"
      );

    }

    try {

      const res =
        await changeStudentPassword({

          email:
            formData.email,

          oldPassword:
            formData.oldPassword,

          newPassword:
            formData.newPassword,

        });

      alert(res.data.message);

      navigate("/login");

    } catch (error) {

      console.log(error);

      alert(

        error.response?.data
          ?.message ||

        "Failed to change password"

      );

    }

  };

  return (

    <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4">

      <div className="w-full max-w-md bg-white p-8 rounded-2xl shadow-lg">

        <h2 className="text-3xl font-bold text-center text-teal-500 mb-6">

          Change Password

        </h2>

        <form
          onSubmit={handleSubmit}
          className="space-y-5"
        >

          {/* EMAIL */}

          <input

            type="email"

            name="email"

            placeholder="Enter Email"

            required

            onChange={handleChange}

            className="w-full border px-4 py-3 rounded-lg outline-none focus:border-teal-500"

          />

          {/* OLD PASSWORD */}

          <input

            type="password"

            name="oldPassword"

            placeholder="Old Password"

            required

            onChange={handleChange}

            className="w-full border px-4 py-3 rounded-lg outline-none focus:border-teal-500"

          />

          {/* NEW PASSWORD */}

          <input

            type="password"

            name="newPassword"

            placeholder="New Password"

            required

            onChange={handleChange}

            className="w-full border px-4 py-3 rounded-lg outline-none focus:border-teal-500"

          />

          {/* CONFIRM PASSWORD */}

          <input

            type="password"

            name="confirmPassword"

            placeholder="Confirm Password"

            required

            onChange={handleChange}

            className="w-full border px-4 py-3 rounded-lg outline-none focus:border-teal-500"

          />

          {/* BUTTON */}

          <button

            type="submit"

            className="w-full bg-teal-500 hover:bg-teal-600 text-white py-3 rounded-lg font-semibold"

          >

            Change Password

          </button>

        </form>

      </div>

    </div>

  );

}

export default ChangePassword;