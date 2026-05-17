import {
  useEffect,
  useState,
} from "react";

import {
  useNavigate,
} from "react-router-dom";

import {

  getProfile,

  updateProfile,

  changePassword,

} from "../services/authService";

const Profile = () => {

  // =========================
  // STATES
  // =========================

  const [user, setUser] =
    useState(null);

  const [loading, setLoading] =
    useState(true);

  const [formData,
    setFormData] =
    useState({

      name: "",

      department: "",

      profileImage: "",

    });

  const [passwordData,
    setPasswordData] =
    useState({

      oldPassword: "",

      newPassword: "",

    });

  const navigate =
    useNavigate();

  // =========================
  // LOAD PROFILE
  // =========================

  useEffect(() => {

    fetchProfile();

  }, []);

  const fetchProfile =
    async () => {

      try {

        const res =
          await getProfile();

        setUser(res.data);

        setFormData({

          name:
            res.data.name || "",

          department:
            res.data.department || "",

          profileImage:
            res.data.profileImage || "",

        });

      } catch (error) {

        console.log(error);

      } finally {

        setLoading(false);

      }

    };

  // =========================
  // INPUT CHANGE
  // =========================

  const handleChange =
    (e) => {

      setFormData({

        ...formData,

        [e.target.name]:
          e.target.value,

      });

    };

  // =========================
  // PASSWORD INPUT
  // =========================

  const handlePasswordChange =
    (e) => {

      setPasswordData({

        ...passwordData,

        [e.target.name]:
          e.target.value,

      });

    };

  // =========================
  // UPDATE PROFILE
  // =========================

  const handleUpdateProfile =
    async (e) => {

      e.preventDefault();

      try {

        const res =
          await updateProfile(
            formData
          );

        alert(
          "Profile updated successfully"
        );

        setUser(
          res.data.user
        );

      } catch (error) {

        console.log(error);

        alert(
          "Failed to update profile"
        );

      }

    };

  // =========================
  // CHANGE PASSWORD
  // =========================

  const handleChangeUserPassword =
    async (e) => {

      e.preventDefault();

      try {

        const res =
          await changePassword(
            passwordData
          );

        alert(
          res.data.message
        );

        setPasswordData({

          oldPassword: "",

          newPassword: "",

        });

      } catch (error) {

        console.log(error);

        alert(
          error.response?.data
            ?.message ||
            "Failed to change password"
        );

      }

    };

  // =========================
  // LOGOUT
  // =========================

  const handleLogout =
    () => {

      localStorage.removeItem(
        "token"
      );

      localStorage.removeItem(
        "role"
      );

      localStorage.removeItem(
        "user"
      );

      navigate("/login");

    };

  // =========================
  // LOADING
  // =========================

  if (loading) {

    return (

      <div className="text-center mt-10 text-2xl font-bold">

        Loading...

      </div>

    );

  }

  return (

    <div className="max-w-6xl mx-auto p-6">

      {/* PROFILE HEADER */}

      <div className="bg-white rounded-3xl shadow-xl p-8">

        <div className="flex flex-col md:flex-row items-center gap-8">

          {/* IMAGE */}

          <div>

            <img
              src={
                formData.profileImage ||

                "https://cdn-icons-png.flaticon.com/512/149/149071.png"
              }

              alt="profile"

              className="w-40 h-40 rounded-full object-cover border-4 border-blue-500"
            />

          </div>

          {/* INFO */}

          <div className="flex-1">

            <h1 className="text-4xl font-bold text-gray-800">

              {user?.name}

            </h1>

            <p className="text-gray-500 text-lg mt-3">

              Role:
              {" "}

              <span className="font-semibold">

                {user?.role}

              </span>

            </p>

            <p className="text-gray-500 text-lg">

              Department:
              {" "}

              <span className="font-semibold">

                {user?.department}

              </span>

            </p>

            {user?.email && (

              <p className="text-gray-500 text-lg">

                Email:
                {" "}

                <span className="font-semibold">

                  {user?.email}

                </span>

              </p>

            )}

          </div>

        </div>

      </div>

      {/* FORMS */}

      <div className="grid md:grid-cols-2 gap-8 mt-8">

        {/* EDIT PROFILE */}

        <div className="bg-white rounded-3xl shadow-xl p-8">

          <h2 className="text-2xl font-bold mb-6">

            Edit Profile

          </h2>

          <form
            onSubmit={
              handleUpdateProfile
            }
            className="space-y-5"
          >

            {/* NAME */}

            <div>

              <label className="block mb-2 font-semibold">

                Name

              </label>

              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={
                  handleChange
                }
                placeholder="Enter name"
                className="w-full border p-3 rounded-xl outline-none focus:ring-2 focus:ring-blue-500"
              />

            </div>

            {/* DEPARTMENT */}

            <div>

              <label className="block mb-2 font-semibold">

                Department

              </label>

              <input
                type="text"
                name="department"
                value={
                  formData.department
                }
                onChange={
                  handleChange
                }
                placeholder="Enter department"
                className="w-full border p-3 rounded-xl outline-none focus:ring-2 focus:ring-blue-500"
              />

            </div>

            {/* IMAGE */}

            <div>

              <label className="block mb-2 font-semibold">

                Profile Image URL

              </label>

              <input
                type="text"
                name="profileImage"
                value={
                  formData.profileImage
                }
                onChange={
                  handleChange
                }
                placeholder="Paste image URL"
                className="w-full border p-3 rounded-xl outline-none focus:ring-2 focus:ring-blue-500"
              />

            </div>

            {/* BUTTON */}

            <button
              type="submit"
              className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-xl font-bold transition"
            >

              Update Profile

            </button>

          </form>

        </div>

        {/* CHANGE PASSWORD */}

        <div className="bg-white rounded-3xl shadow-xl p-8">

          <h2 className="text-2xl font-bold mb-6">

            Change Password

          </h2>

          <form
            onSubmit={
              handleChangeUserPassword
            }
            className="space-y-5"
          >

            {/* OLD PASSWORD */}

            <div>

              <label className="block mb-2 font-semibold">

                Old Password

              </label>

              <input
                type="password"
                name="oldPassword"
                value={
                  passwordData.oldPassword
                }
                onChange={
                  handlePasswordChange
                }
                placeholder="Enter old password"
                className="w-full border p-3 rounded-xl outline-none focus:ring-2 focus:ring-green-500"
              />

            </div>

            {/* NEW PASSWORD */}

            <div>

              <label className="block mb-2 font-semibold">

                New Password

              </label>

              <input
                type="password"
                name="newPassword"
                value={
                  passwordData.newPassword
                }
                onChange={
                  handlePasswordChange
                }
                placeholder="Enter new password"
                className="w-full border p-3 rounded-xl outline-none focus:ring-2 focus:ring-green-500"
              />

            </div>

            {/* BUTTON */}

            <button
              type="submit"
              className="w-full bg-green-600 hover:bg-green-700 text-white py-3 rounded-xl font-bold transition"
            >

              Change Password

            </button>

          </form>

        </div>

      </div>

      {/* LOGOUT */}

      <div className="mt-8">

        <button
          onClick={handleLogout}
          className="w-full bg-red-500 hover:bg-red-600 text-white py-4 rounded-2xl font-bold text-lg transition"
        >

          Logout

        </button>

      </div>

    </div>

  );

};

export default Profile;