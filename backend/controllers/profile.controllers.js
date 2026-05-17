import Student from "../models/Student.models.js";
import Faculty from "../models/faculty.models.js";
import Hod from "../models/hod.models.js";

export const getProfile =
  async (req, res) => {

    try {

      let user;

      // STUDENT
      if (
        req.user.role ===
        "STUDENT"
      ) {

        user =
          await Student.findById(
            req.user.id
          ).select("-password");

      }

      // FACULTY
      else if (
        req.user.role ===
        "FACULTY"
      ) {

        user =
          await Faculty.findById(
            req.user.id
          ).select("-password");

      }

      // HOD
      else if (
        req.user.role ===
        "HOD"
      ) {

        user =
          await Hod.findById(
            req.user.id
          ).select("-password");

      }

      if (!user) {

        return res.status(404).json({
          message: "User not found",
        });

      }

      res.json(user);

    } catch (error) {

      console.log(error);

      res.status(500).json({
        message:
          "Server Error",
      });

    }

};




export const changePassword =
  async (req, res) => {

    try {

      const {
        oldPassword,
        newPassword,
      } = req.body;

      let user;

      if (
        req.user.role ===
        "student"
      ) {

        user =
          await Student.findById(
            req.user.id
          );

      }

      else if (
        req.user.role ===
        "faculty"
      ) {

        user =
          await Faculty.findById(
            req.user.id
          );

      }

      else {

        user =
          await Hod.findById(
            req.user.id
          );

      }

      const isMatch =
        await bcrypt.compare(
          oldPassword,
          user.password
        );

      if (!isMatch) {

        return res.status(400).json({
          message:
            "Old password incorrect",
        });

      }

      const salt =
        await bcrypt.genSalt(10);

      user.password =
        await bcrypt.hash(
          newPassword,
          salt
        );

      await user.save();

      res.json({
        success: true,
        message:
          "Password changed",
      });

    } catch (error) {

      console.log(error);

      res.status(500).json({
        message:
          "Server Error",
      });

    }

};


export const updateProfile =
  async (req, res) => {

    try {

      const {
        name,
        department,
        profileImage,
      } = req.body;

      let user;

      // STUDENT
      if (
        req.user.role ===
        "student"
      ) {

        user =
          await Student.findById(
            req.user.id
          );

      }

      // FACULTY
      else if (
        req.user.role ===
        "faculty"
      ) {

        user =
          await Faculty.findById(
            req.user.id
          );

      }

      // HOD
      else if (
        req.user.role ===
        "hod"
      ) {

        user =
          await Hod.findById(
            req.user.id
          );

      }

      user.name =
        name || user.name;

      user.department =
        department ||
        user.department;

      user.profileImage =
        profileImage ||
        user.profileImage;

      await user.save();

      res.json({
        success: true,
        user,
      });

    } catch (error) {

      console.log(error);

      res.status(500).json({
        message:
          "Server Error",
      });

    }

};