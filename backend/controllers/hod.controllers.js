import Hod from "../models/hod.models.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";

dotenv.config();

export const registered = async (req, res) => {
  try {
    const { name, email, password, department } = req.body;

    // 1 Check: department ka HOD already hai?
    const existingHod = await Hod.findOne({ department });
    if (existingHod) {
      return res.status(400).json({
        message: "Is department ka HOD pehle se registered hai",
      });
    }

    // 2️ Password hash
    const hashedPassword = await bcrypt.hash(password, 10);

    // 3️ Create HOD
    const hod = await Hod.create({
      name,
      email,
      password: hashedPassword,
      department,
      role: "HOD", //  force HOD
    });

    res.status(201).json({
      message: "HOD registered successfully",
      hod: {
        id: hod._id,
        name: hod.name,
        department: hod.department,
        role: hod.role,
      },
    });

  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// login


export const login= async (req, res) => {
  try {
    const { email, password } = req.body;

    const hod = await Hod.findOne({ email });
    if (!hod) {
      return res.status(404).json({ message: "HOD not found" });
    }

    const isMatch = await bcrypt.compare(password, hod.password);
    if (!isMatch) {
      return res.status(401).json({ message: "Invalid password" });
    }

    const token = jwt.sign(
      { id: hod._id, role: hod.role, department: hod.department },
      process.env.JWT_SECRET,
      { expiresIn: "1d" }
    );

    res.status(200).json({
      message: "HOD login successful",
      token,
      role: hod.role,
    });

  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};