import jwt from "jsonwebtoken";
import dotenv from "dotenv";

dotenv.config();

export const  authHod = (req, res, next) => {
  const token = req.headers.authorization?.split(" ")[1];
  if (!token) return res.status(401).json({ message: "Token missing" });

  const decoded = jwt.verify(token, process.env.JWT_SECRET);

  if (decoded.role !== "HOD") {
    return res.status(403).json({ message: "Only HOD allowed" });
  }

  req.hod = decoded;
  next();
};