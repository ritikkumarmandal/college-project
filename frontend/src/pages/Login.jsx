import { useState } from "react";
import { loginHod, loginfaculty ,loginStudent} from "../services/authService";
import { useNavigate } from "react-router-dom";

function Login() {

  const navigate = useNavigate();

  // ================= STATE =================
  const [roleType, setRoleType] = useState("HOD");

  const [formData, setFormData] = useState({
    email: "",
    password: ""
  });

  // ================= HANDLE INPUT =================
  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  // ================= LOGIN SUBMIT =================
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      let res;

      // ✅ Role based API call
      if (roleType === "HOD") {
        res = await loginHod(formData);
      } else if (roleType === "FACULTY") {
        res = await loginfaculty(formData);
      }

      else if (roleType === "STUDENT") {
  res = await loginStudent(formData);
      
  
  // 🔥 First time user check
  if (res.data.firstTime) {
    navigate("/set-password", { state: { email: formData.email } });
    return;
  }
}

      const { token, role } = res.data;

      // ✅ Save auth data
      localStorage.setItem("token", token);
      localStorage.setItem("role", role);

      alert("Login Successful ✅");

      // ✅ Role based redirect
      if (role === "HOD") {
        navigate("/hod-dashboard");
      } else if (role === "FACULTY") {
        navigate("/faculty-dashboard");
      }
         else if (role === "STUDENT") {
       navigate("/student-dashboard");

} 
       else {
        navigate("/");
      }

    } catch (error) {
      console.log(error);
      alert(error.response?.data?.message || "Login Failed ❌");
    }
  };

  // ================= UI =================
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">

      <div className="w-[900px] h-[520px] bg-white rounded-2xl shadow-xl flex overflow-hidden">

        {/* LEFT SIDE */}
        <div className="w-1/2 bg-teal-500 text-white flex flex-col justify-center items-center relative p-10">

          
          <img
            src="https://cdn-icons-png.flaticon.com/512/295/295128.png"
            alt="login"
            className="w-60"
          />

          <p className="mt-6 text-sm tracking-wider">
            ATTENDANCE MANAGEMENT SYSTEM
          </p>
        </div>

        {/* RIGHT SIDE FORM */}
        <div className="w-1/2 flex flex-col justify-center px-12">

          <h2 className="text-3xl font-bold text-teal-500 text-center mb-6">
            LOGIN
          </h2>

          <form onSubmit={handleSubmit} className="space-y-4">

            {/* ROLE SELECT */}
            <select
              value={roleType}
              onChange={(e) => setRoleType(e.target.value)}
              className="w-full border-b-2 outline-none py-2 focus:border-teal-500"
            >
              <option value="HOD">HOD</option>
              <option value="FACULTY">Faculty</option>
               <option value="STUDENT">Student</option>
            </select>

            {/* EMAIL */}
            <input
              type="email"
              name="email"
              placeholder="Enter Email"
              onChange={handleChange}
              required
              className="w-full border-b-2 outline-none py-2 focus:border-teal-500"
            />

            {/* PASSWORD */}
            <input
              type="password"
              name="password"
              placeholder="Enter Password"
              onChange={handleChange}
              required
              className="w-full border-b-2 outline-none py-2 focus:border-teal-500"
            />

            {/* BUTTON */}
            <button
              type="submit"
              className="w-full bg-teal-500 text-white py-3 rounded-full hover:bg-teal-600 transition"
            >
              Login
            </button>

          </form>

          <p className="text-center text-sm mt-5">
            Don't have an account?
            <span
              onClick={() => navigate("/register")}
              className="text-teal-500 font-semibold cursor-pointer ml-1"
            >
              Sign Up
            </span>
          </p>

          <p
  onClick={() => navigate("/set-password")}
  className="text-teal-500 text-sm cursor-pointer mt-2"
>
  First time user? Set Password
</p>

        </div>
      </div>
    </div>
  );
}

export default Login;