import { useState } from "react";

import {

  loginHod,

  loginfaculty,

  studentLogin,

} from "../services/authService";

import { useNavigate }
from "react-router-dom";



function Login() {

  const navigate = useNavigate();

  // ROLE

  const [roleType, setRoleType] =
    useState("HOD");

  // FORM

  const [formData, setFormData] =
    useState({

      email: "",

      password: "",

    });

  // INPUT CHANGE

  const handleChange = (e) => {

    setFormData({

      ...formData,

      [e.target.name]:
        e.target.value,

    });

  };

  // LOGIN

  const handleSubmit = async (e) => {

    e.preventDefault();

    try {

      let res;

      // HOD LOGIN

      if (roleType === "HOD") {

        res = await loginHod({

          email:
            formData.email,

          password:
            formData.password,

        });

      }

      // FACULTY LOGIN

      else if (
        roleType === "FACULTY"
      ) {

        res = await loginfaculty({

          email:
            formData.email,

          password:
            formData.password,

        });

      }

      // STUDENT LOGIN

      else if (
        roleType === "STUDENT"
      ) {

        res = await studentLogin({

          email:
            formData.email,

          password:
            formData.password,

        });

      }

      // TOKEN

      const {

        token,

        role,

        isFirstLogin,

      } = res.data;

      localStorage.setItem(
        "token",
        token
      );

      localStorage.setItem(
        "role",
        role
      );

      alert("Login Successful ✅");

      // FIRST LOGIN

      if (
        role === "STUDENT" &&
        isFirstLogin
      ) {

        navigate(
          "/student/change-password"
        );

        return;

      }

      // REDIRECT

      if (role === "HOD") {

        navigate(
          "/hod-dashboard"
        );

      }

      else if (
        role === "FACULTY"
      ) {

        navigate(
          "/faculty-dashboard"
        );

      }

      else if (
        role === "STUDENT"
      ) {

        navigate(
          "/student-dashboard"
        );

      }

      else {

        navigate("/");

      }

    } catch (error) {

      console.log(error);

      alert(

        error.response?.data
          ?.message ||

        "Login Failed ❌"

      );

    }

  };

  // UI

  return (

    <div className="min-h-screen bg-gray-100 flex items-center justify-center px-4 py-10">

      <div className="w-full max-w-5xl bg-white rounded-2xl shadow-xl overflow-hidden flex flex-col md:flex-row">

        {/* LEFT */}

        <div className="md:w-1/2 bg-teal-500 text-white flex flex-col justify-center items-center p-8">

          <img

            src="https://cdn-icons-png.flaticon.com/512/295/295128.png"

            alt="login"

            className="w-40 md:w-60"

          />

          <h2 className="text-2xl md:text-3xl font-bold mt-6 text-center">

            Attendance Management System

          </h2>

          <p className="mt-4 text-sm text-center">

            Smart Attendance &
            Student Management

          </p>

        </div>

        {/* RIGHT */}

        <div className="md:w-1/2 flex items-center justify-center p-6 md:p-10">

          <div className="w-full">

            <h2 className="text-3xl font-bold text-center text-teal-500 mb-8">

              LOGIN

            </h2>

            <form
              onSubmit={handleSubmit}
              className="space-y-5"
            >

              {/* ROLE */}

              <select

                value={roleType}

                onChange={(e) => {

                  setRoleType(
                    e.target.value
                  );

                }}

                className="w-full border rounded-lg px-4 py-3 outline-none focus:border-teal-500"

              >

                <option value="HOD">

                  HOD

                </option>

                <option value="FACULTY">

                  Faculty

                </option>

                <option value="STUDENT">

                  Student

                </option>

              </select>

              {/* EMAIL */}

              <input

                type="email"

                name="email"

                placeholder="Enter Email"

                onChange={handleChange}

                required

                className="w-full border rounded-lg px-4 py-3 outline-none focus:border-teal-500"

              />

              {/* PASSWORD */}

              <input

                type="password"

                name="password"

                placeholder="Enter Password"

                onChange={handleChange}

                required

                className="w-full border rounded-lg px-4 py-3 outline-none focus:border-teal-500"

              />

              {/* LOGIN BUTTON */}

              <button

                type="submit"

                className="w-full bg-teal-500 hover:bg-teal-600 text-white py-3 rounded-lg transition font-semibold"

              >

                Login

              </button>

            </form>

            {/* REGISTER */}

            <p className="text-center text-sm mt-6">

              Don't have an account?

              <span

                onClick={() =>
                  navigate("/register")
                }

                className="text-teal-500 font-semibold cursor-pointer ml-1"

              >

                Sign Up

              </span>

            </p>

          </div>

        </div>

      </div>

    </div>

  );

}

export default Login;