import jwt from "jsonwebtoken";
import dotenv from "dotenv";

dotenv.config();

export const authFaculty = (req, res, next) => {
  try {

    const token = req.headers.authorization?.split(" ")[1];

    if (!token)
      return res.status(401).json({ message: "Token missing" });

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
     
    // allow only faculty
    if (decoded.role !== "FACULTY") {
      
      return res.status(403).json({ message: "Faculty only" });
    }

    // IMPORTANT
    req.user = decoded; // <-- yahi controller use karega

    next();

  } catch (error) {
    res.status(401).json({ message: "Invalid token" });
  }
};