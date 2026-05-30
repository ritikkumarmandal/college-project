import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { registerUser,registerFaculty,hodverifyOtp,facultyverifyOtp} from "../services/authService";

/*function Register() {

  const navigate = useNavigate();

  const [role, setRole] = useState("HOD");

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    mobile: "",
    password: "",
    department: "",
    regNumber: ""
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit =async (e) => {
    e.preventDefault();
      try {
          let res;

    // ✅ HOD REGISTER
    if (role === "HOD") {
      res = await registerUser({
        ...formData,
        role: "HOD"
      });
    }

     

    // ✅ faculty REGISTER
    if (role === "FACULTY") {
      res = await registerFaculty({
        ...formData,
        role: "FACULTY"
      });
    }

    
          alert("User Registered Successfully");
    
          navigate("/login"); // register ke baad login
           } catch (error) {
      console.log(error);
      alert("Registration Failed");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">

      {/* MAIN CARD }
      <div className="w-[900px] h-[540px] bg-white rounded-2xl shadow-xl flex overflow-hidden">

        {/* LEFT SIDE }
        <div className="w-1/2 bg-teal-500 text-white flex flex-col justify-center items-center relative p-10">

         

          <img
            src="https://cdn-icons-png.flaticon.com/512/295/295128.png"
            alt="register"
            className="w-60"
          />

          <p className="mt-6 text-sm tracking-wider">
            ATTENDANCE MANAGEMENT SYSTEM
          </p>
        </div>

        {/* RIGHT FORM }
        <div className="w-1/2 flex flex-col justify-center px-12">

          <h2 className="text-3xl font-bold text-teal-500 text-center mb-6">
            CREATE ACCOUNT
          </h2>

          <form onSubmit={handleSubmit} className="space-y-4">

            {/* ROLE SELECT }
            <select
              value={role}
              onChange={(e) => setRole(e.target.value)}
              className="w-full border-b-2 outline-none py-2 focus:border-teal-500"
            >
              <option value="HOD">HOD Register</option>
              <option value="FACULTY">Faculty Register</option>
             
            </select>

            {/* NAME }
            <input
              type="text"
              name="name"
              placeholder="Enter Name"
              onChange={handleChange}
              required
              className="w-full border-b-2 py-2 outline-none focus:border-teal-500"
            />

            {/* EMAIL}
            <input
              type="email"
              name="email"
              placeholder="Enter Email"
              onChange={handleChange}
              required
              className="w-full border-b-2 py-2 outline-none focus:border-teal-500"
            />

            {/* MOBILE }
            <input
              type="text"
              name="mobile"
              placeholder="Mobile Number"
              onChange={handleChange}
              required
              className="w-full border-b-2 py-2 outline-none focus:border-teal-500"
            />

            {/* HOD PASSWORD }
            {(role === "FACULTY" || role === "STUDENT" || role === "HOD") && (
              <input
                type="password"
                name="password"
                placeholder="Create Password"
                onChange={handleChange}
                required
                className="w-full border-b-2 py-2 outline-none focus:border-teal-500"
              />
            )}

            {/* FACULTY + STUDENT DEPARTMENT }
            {(role === "FACULTY" || role === "STUDENT" || role === "HOD") && (
              <select
                name="department"
                onChange={handleChange}
                required
                className="w-full border-b-2 py-2 outline-none focus:border-teal-500"
              >
                <option value="">Select Department</option>
                <option value="CSE">CSE</option>
                <option value="ECE">ECE</option>
                <option value="ME">ME</option>
                <option value="CE">CE</option>
              </select>
            )}

            {/* STUDENT REG NUMBER }
            {role === "STUDENT" && (
              <input
                type="text"
                name="regNumber"
                placeholder="Registration Number"
                onChange={handleChange}
                required
                className="w-full border-b-2 py-2 outline-none focus:border-teal-500"
              />
            )}

            {/* BUTTON }
            <button
              type="submit"
              className="w-full bg-teal-500 text-white py-3 rounded-full hover:bg-teal-600 transition"
            >
              Register
            </button>

          </form>

          {/* LOGIN LINK }
          <p className="text-center text-sm mt-5">
            Already have an account?
            <span
              onClick={() => navigate("/login")}
              className="text-teal-500 font-semibold cursor-pointer ml-1"
            >
              Login
            </span>
          </p>

        </div>
      </div>
    </div>
  );
}

export default Register;*/





function Register() {

  const navigate = useNavigate();

  // ================= ROLE =================

  const [role, setRole] = useState("HOD");

  // ================= FORM DATA =================

  const [formData, setFormData] = useState({

    name: "",
    email: "",
    password: "",
    department: "",
    regNumber: "",

  });

  // ================= OTP =================

  const [otp, setOtp] = useState("");

  const [showOtpBox, setShowOtpBox] =
    useState(false);

  // ================= TEMP DATA =================

  const [tempData, setTempData] =
    useState(null);

  // ================= LOADING =================

  const [loading, setLoading] =
    useState(false);

  // ================= HANDLE CHANGE =================

  const handleChange = (e) => {

    setFormData({

      ...formData,

      [e.target.name]:
        e.target.value,

    });

  };

  // ================= REGISTER =================

  const handleSubmit = async (e) => {

    e.preventDefault();

    try {

      setLoading(true);

      let res;

      // ================= HOD =================

      if (role === "HOD") {

        res = await registerUser({

          ...formData,

          role: "HOD",

        });

      }

      // ================= FACULTY =================

      if (role === "FACULTY") {

        res = await registerFaculty({

          ...formData,

          role: "FACULTY",

        });

      }

      // ================= SAVE TEMP DATA =================

       // ================= SAVE TEMP DATA =================

setTempData(res.data);

console.log("REGISTER RESPONSE:", res.data);

console.log("TEMP DATA:", res.data.data);

// ================= SHOW OTP =================

setShowOtpBox(true);


      // ================= SHOW OTP =================

      setShowOtpBox(true);

      alert("OTP sent successfully");

    } catch (error) {

      console.log(error);

      alert(

        error.response?.data?.message ||

        "Registration Failed"

      );

    } finally {

      setLoading(false);

    }

  };

  // ================= VERIFY OTP =================

  const handleVerifyOtp = async () => {

    try {

      setLoading(true);

      let res;

      // ================= VERIFY HOD =================
      
           console.log(tempData);
      if (role === "HOD") {

        res = await hodverifyOtp({

          ...formData,

          otp,

        });

      }
       console.log(tempData);
      // ================= VERIFY FACULTY =================

      if (role === "FACULTY") {

        res = await facultyverifyOtp({

          ...formData,

          otp,

        });

      }

      alert("Registration Successful");

      navigate("/login");

    } catch (error) {

      console.log(error);

      alert(

        error.response?.data?.message ||

        "OTP Verification Failed"

      );

    } finally {

      setLoading(false);

    }

  };

  return (

    <div className="min-h-screen bg-gray-100 flex justify-center items-start lg:items-center px-4 py-6">
      {/* MAIN CARD */}

     <div className="w-full max-w-5xl my-4 bg-white rounded-2xl shadow-xl flex flex-col lg:flex-row overflow-hidden">
        {/* LEFT SIDE */}

        <div className="w-full lg:w-1/2 bg-teal-500 text-white flex flex-col justify-center items-center p-6 lg:p-10">

          <img
            src="https://cdn-icons-png.flaticon.com/512/295/295128.png"
            alt="register"
            className="w-32 sm:w-40 md:w-52 lg:w-60"
          />

          <p className="mt-6 text-xs sm:text-sm tracking-wider text-center">

            ATTENDANCE MANAGEMENT SYSTEM

          </p>

        </div>

        {/* RIGHT SIDE */}

        <div className="w-full lg:w-1/2 flex flex-col justify-center px-6 sm:px-10 lg:px-12 py-8">

          <h2 className="text-2xl sm:text-3xl font-bold text-teal-500 text-center mb-6">

            CREATE ACCOUNT

          </h2>

          {/* ================= FORM ================= */}

          <form
            onSubmit={handleSubmit}
            className="space-y-4"
          >

            {/* ROLE */}

            <select

              value={role}

              onChange={(e) =>
                setRole(e.target.value)
              }

              className="w-full border-b-2 outline-none py-2 focus:border-teal-500"

            >

              <option value="HOD">
                HOD Register
              </option>

              <option value="FACULTY">
                Faculty Register
              </option>

            </select>

            {/* NAME */}

            <input

              type="text"

              name="name"

              placeholder="Enter Name"

              onChange={handleChange}

              required

              className="w-full border-b-2 py-2 outline-none focus:border-teal-500"

            />

            {/* EMAIL */}

            <input

              type="email"

              name="email"

              placeholder="Enter Email"

              onChange={handleChange}

              required

              className="w-full border-b-2 py-2 outline-none focus:border-teal-500"

            />

            {/* MOBILE */}

            <input

              type="text"

              name="mobile"

              placeholder="Mobile Number"

              onChange={handleChange}

              required

              className="w-full border-b-2 py-2 outline-none focus:border-teal-500"

            />

            {/* PASSWORD */}

            <input

              type="password"

              name="password"

              placeholder="Create Password"

              onChange={handleChange}

              required

              className="w-full border-b-2 py-2 outline-none focus:border-teal-500"

            />

            {/* DEPARTMENT */}

            <select

              name="department"

              onChange={handleChange}

              required

              className="w-full border-b-2 py-2 outline-none focus:border-teal-500"

            >

              <option value="">
                Select Department
              </option>

              <option value="CSE">
                CSE
              </option>

              <option value="ECE">
                ECE
              </option>

              <option value="ME">
                ME
              </option>

              <option value="CE">
                CE
              </option>

            </select>

            {/* REGISTER BUTTON */}

            <button

              type="submit"

              disabled={loading}

              className="w-full bg-teal-500 text-white py-3 rounded-full hover:bg-teal-600 transition"

            >

              {

                loading

                  ? "Please wait..."

                  : "Register"

              }

            </button>

          </form>

          {/* ================= OTP BOX ================= */}

          {

            showOtpBox && (

              <div className="mt-6 space-y-4">

                <h3 className="text-center font-semibold text-gray-700">

                  Enter OTP Sent To Email

                </h3>

                <input

                  type="text"

                  placeholder="Enter OTP"

                  value={otp}

                  onChange={(e) =>
                    setOtp(e.target.value)
                  }

                  className="w-full border-b-2 py-2 outline-none focus:border-blue-500"

                />

                <button

                  type="button"

                  onClick={handleVerifyOtp}

                  disabled={loading}

                  className="w-full bg-blue-500 text-white py-3 rounded-full hover:bg-blue-600 transition"

                >

                  {

                    loading

                      ? "Verifying..."

                      : "Verify OTP"

                  }

                </button>

              </div>

            )

          }

          {/* LOGIN */}

          <p className="text-center text-sm mt-5">

            Already have an account?

            <span

              onClick={() =>
                navigate("/login")
              }

              className="text-teal-500 font-semibold cursor-pointer ml-1"

            >

              Login

            </span>

          </p>

        </div>

      </div>

    </div>

  );

}

export default Register;