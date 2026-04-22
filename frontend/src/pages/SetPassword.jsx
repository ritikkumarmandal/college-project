import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { setStudentPassword } from "../services/authService";

function SetPassword() {

  const navigate = useNavigate();
  const location = useLocation();

  // 👇 email login se aa raha hai
  const email = location.state?.email || "";

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (password !== confirmPassword) {
      alert("Passwords do not match ❌");
      return;
    }

    try {
      await setStudentPassword({
        email,
        newPassword: password
      });

      alert("Password set successfully ✅");
      navigate("/login");

    } catch (error) {
      alert(error.response?.data?.message || "Error ❌");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">

      <div className="bg-white p-10 rounded-xl shadow-lg w-[400px]">

        <h2 className="text-2xl font-bold text-center text-teal-500 mb-6">
          Set Password
        </h2>

        <form onSubmit={handleSubmit} className="space-y-4">

          {/* EMAIL (readonly) */}
          <input
            type="email"
            value={email}
            readOnly
            className="w-full border-b-2 py-2 outline-none text-gray-500"
          />

          {/* PASSWORD */}
          <input
            type="password"
            placeholder="Enter New Password"
            onChange={(e) => setPassword(e.target.value)}
            required
            className="w-full border-b-2 py-2 outline-none focus:border-teal-500"
          />

          {/* CONFIRM PASSWORD */}
          <input
            type="password"
            placeholder="Confirm Password"
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
            className="w-full border-b-2 py-2 outline-none focus:border-teal-500"
          />

          <button
            type="submit"
            className="w-full bg-teal-500 text-white py-3 rounded-full hover:bg-teal-600"
          >
            Set Password
          </button>

        </form>
      </div>
    </div>
  );
}

export default SetPassword;